import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { z } from 'zod';

// Vector Search Schema for Sovereign Marketplace
export const SearchQuerySchema = z.object({
  query: z.string().min(1),
  filters: z.object({
    location: z.string().optional(),
    serviceCategory: z.string().optional(),
    priceRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    rating: z.number().min(0).max(5).optional(),
    availability: z.boolean().optional(),
    premiumOnly: z.boolean().optional(),
  }).optional(),
  limit: z.number().min(1).max(100).default(20),
  threshold: z.number().min(0).max(1).default(0.7),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const SearchResultSchema = z.object({
  id: z.string(),
  type: z.enum(['provider', 'listing', 'service']),
  title: z.string(),
  description: z.string(),
  score: z.number().min(0).max(1),
  metadata: z.record(z.any()),
  embedding: z.array(z.number()).optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// Sovereign Vector Search Engine
export class SovereignVectorSearch {
  private supabase;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-large',
      dimensions: 1536,
    });
  }

  // Search providers using semantic similarity
  async searchProviders(searchQuery: SearchQuery): Promise<SearchResult[]> {
    const validatedQuery = SearchQuerySchema.parse(searchQuery);
    
    // Generate embedding for search query
    const queryEmbedding = await this.embeddings.embedQuery(validatedQuery.query);

    // Build SQL query with filters
    let sqlQuery = `
      SELECT 
        p.id,
        'provider' as type,
        p.name as title,
        p.description,
        p.metadata,
        (p.embedding <=> $1) as distance,
        (1 - (p.embedding <=> $1)) as score
      FROM sovereign_providers p
      WHERE (p.embedding <=> $1) < $2
    `;

    const params: any[] = [JSON.stringify(queryEmbedding), 1 - validatedQuery.threshold];
    let paramIndex = 3;

    // Add filters
    if (validatedQuery.filters?.location) {
      sqlQuery += ` AND p.location ILIKE $${paramIndex}`;
      params.push(`%${validatedQuery.filters.location}%`);
      paramIndex++;
    }

    if (validatedQuery.filters?.serviceCategory) {
      sqlQuery += ` AND p.service_categories @> $${paramIndex}`;
      params.push(JSON.stringify([validatedQuery.filters.serviceCategory]));
      paramIndex++;
    }

    if (validatedQuery.filters?.rating) {
      sqlQuery += ` AND p.average_rating >= $${paramIndex}`;
      params.push(validatedQuery.filters.rating);
      paramIndex++;
    }

    if (validatedQuery.filters?.premiumOnly) {
      sqlQuery += ` AND p.is_premium = true`;
    }

    if (validatedQuery.filters?.availability) {
      sqlQuery += ` AND p.is_available = true`;
    }

    sqlQuery += ` ORDER BY score DESC LIMIT $${paramIndex}`;
    params.push(validatedQuery.limit);

    try {
      const { data, error } = await this.supabase.rpc('vector_search_providers', {
        query_embedding: queryEmbedding,
        similarity_threshold: validatedQuery.threshold,
        match_count: validatedQuery.limit,
        filters: validatedQuery.filters || {},
      });

      if (error) {
        console.error('Vector search error:', error);
        throw new Error(`Vector search failed: ${error.message}`);
      }

      return data?.map((row: any) => ({
        id: row.id,
        type: 'provider' as const,
        title: row.title,
        description: row.description,
        score: row.score,
        metadata: row.metadata,
      })) || [];

    } catch (error) {
      console.error('Provider search failed:', error);
      return [];
    }
  }

  // Search listings using semantic similarity
  async searchListings(searchQuery: SearchQuery): Promise<SearchResult[]> {
    const validatedQuery = SearchQuerySchema.parse(searchQuery);
    
    // Generate embedding for search query
    const queryEmbedding = await this.embeddings.embedQuery(validatedQuery.query);

    try {
      const { data, error } = await this.supabase.rpc('vector_search_listings', {
        query_embedding: queryEmbedding,
        similarity_threshold: validatedQuery.threshold,
        match_count: validatedQuery.limit,
        filters: validatedQuery.filters || {},
      });

      if (error) {
        console.error('Listing search error:', error);
        throw new Error(`Listing search failed: ${error.message}`);
      }

      return data?.map((row: any) => ({
        id: row.id,
        type: 'listing' as const,
        title: row.title,
        description: row.description,
        score: row.score,
        metadata: row.metadata,
      })) || [];

    } catch (error) {
      console.error('Listing search failed:', error);
      return [];
    }
  }

  // Hybrid search combining providers and listings
  async hybridSearch(searchQuery: SearchQuery): Promise<{
    providers: SearchResult[];
    listings: SearchResult[];
    combined: SearchResult[];
  }> {
    const [providers, listings] = await Promise.all([
      this.searchProviders(searchQuery),
      this.searchListings(searchQuery),
    ]);

    // Combine and re-rank results
    const combined = [...providers, ...listings]
      .sort((a, b) => b.score - a.score)
      .slice(0, searchQuery.limit);

    return {
      providers,
      listings,
      combined,
    };
  }

  // Generate embeddings for new content
  async embedContent(content: {
    id: string;
    type: 'provider' | 'listing';
    text: string;
    metadata?: any;
  }): Promise<number[]> {
    try {
      const embedding = await this.embeddings.embedQuery(content.text);
      
      // Store embedding in appropriate table
      if (content.type === 'provider') {
        await this.supabase
          .from('sovereign_providers')
          .upsert({
            id: content.id,
            embedding: JSON.stringify(embedding),
            content: content.text,
            metadata: content.metadata,
            updated_at: new Date().toISOString(),
          });
      } else {
        await this.supabase
          .from('sovereign_listings')
          .upsert({
            id: content.id,
            embedding: JSON.stringify(embedding),
            content: content.text,
            metadata: content.metadata,
            updated_at: new Date().toISOString(),
          });
      }

      return embedding;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error(`Embedding failed: ${error.message}`);
    }
  }

  // Bulk embed multiple items
  async bulkEmbed(items: Array<{
    id: string;
    type: 'provider' | 'listing';
    text: string;
    metadata?: any;
  }>): Promise<void> {
    const batchSize = 10;
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(item => this.embedContent(item))
      );
      
      // Rate limiting
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // Find similar providers
  async findSimilarProviders(providerId: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const { data, error } = await this.supabase.rpc('find_similar_providers', {
        provider_id: providerId,
        match_count: limit,
      });

      if (error) {
        console.error('Similar providers search error:', error);
        return [];
      }

      return data?.map((row: any) => ({
        id: row.id,
        type: 'provider' as const,
        title: row.title,
        description: row.description,
        score: row.similarity,
        metadata: row.metadata,
      })) || [];

    } catch (error) {
      console.error('Similar providers search failed:', error);
      return [];
    }
  }

  // Get recommendations for customer
  async getRecommendations(customerId: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      // Get customer preferences and history
      const { data: customer } = await this.supabase
        .from('sovereign_customers')
        .select('preferences, search_history, booking_history')
        .eq('id', customerId)
        .single();

      if (!customer) {
        return [];
      }

      // Create recommendation query based on customer profile
      const recommendationQuery = this.buildRecommendationQuery(customer);
      
      return await this.hybridSearch({
        query: recommendationQuery,
        limit,
        threshold: 0.6,
      }).then(results => results.combined);

    } catch (error) {
      console.error('Recommendations failed:', error);
      return [];
    }
  }

  private buildRecommendationQuery(customer: any): string {
    const preferences = customer.preferences || {};
    const searchHistory = customer.search_history || [];
    const bookingHistory = customer.booking_history || [];

    // Build intelligent query from customer data
    const terms = [
      ...Object.values(preferences).filter(Boolean),
      ...searchHistory.slice(-5), // Recent searches
      ...bookingHistory.slice(-3).map((b: any) => b.service_type), // Recent bookings
    ].filter(Boolean);

    return terms.join(' ');
  }
}

// Recommendation Engine using Vector Similarity
export class SovereignRecommendationEngine {
  private vectorSearch: SovereignVectorSearch;

  constructor() {
    this.vectorSearch = new SovereignVectorSearch();
  }

  // Generate AI-powered provider suggestions
  async suggestProviders(criteria: {
    serviceType: string;
    location: string;
    budget?: number;
    quality?: 'basic' | 'standard' | 'premium' | 'luxury';
    urgency?: 'low' | 'medium' | 'high' | 'emergency';
  }): Promise<SearchResult[]> {
    
    // Build semantic query
    const query = `${criteria.serviceType} ${criteria.location} ${criteria.quality || 'quality'} service`;
    
    // Set filters based on criteria
    const filters: any = {
      location: criteria.location,
      serviceCategory: criteria.serviceType,
    };

    if (criteria.budget) {
      filters.priceRange = { max: criteria.budget };
    }

    if (criteria.quality === 'premium' || criteria.quality === 'luxury') {
      filters.premiumOnly = true;
      filters.rating = 4.5;
    }

    return await this.vectorSearch.searchProviders({
      query,
      filters,
      limit: criteria.urgency === 'emergency' ? 5 : 15,
      threshold: criteria.urgency === 'emergency' ? 0.6 : 0.7,
    });
  }

  // Generate listing suggestions based on user behavior
  async suggestListings(userId: string, context?: string): Promise<SearchResult[]> {
    if (context) {
      return await this.vectorSearch.searchListings({
        query: context,
        limit: 10,
        threshold: 0.7,
      });
    }

    return await this.vectorSearch.getRecommendations(userId);
  }
}

// Singleton instances
export const sovereignVectorSearch = new SovereignVectorSearch();
export const sovereignRecommendations = new SovereignRecommendationEngine();

export default sovereignVectorSearch;