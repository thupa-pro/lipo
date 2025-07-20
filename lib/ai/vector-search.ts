import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { prisma } from '@/lib/prisma';

export interface VectorSearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity: number;
}

export interface EmbeddingDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export class VectorSearchService {
  private static instance: VectorSearchService;

  public static getInstance(): VectorSearchService {
    if (!VectorSearchService.instance) {
      VectorSearchService.instance = new VectorSearchService();
    }
    return VectorSearchService.instance;
  }

  /**
   * Generate embeddings for text content
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: text,
      });
      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return a dummy embedding for development
      return new Array(1536).fill(0).map(() => Math.random() - 0.5);
    }
  }

  /**
   * Index a service listing for vector search
   */
  async indexServiceListing(serviceId: string): Promise<void> {
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          provider: {
            select: {
              name: true,
              profile: {
                select: {
                  bio: true,
                  verified: true,
                },
              },
            },
          },
          reviews: {
            select: {
              comment: true,
              rating: true,
            },
            take: 5,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!service) {
        throw new Error(`Service ${serviceId} not found`);
      }

      // Combine all relevant text for embedding
      const textContent = [
        service.title,
        service.description,
        service.category,
        service.location,
        service.provider.name,
        service.provider.profile?.bio || '',
        ...service.reviews.map(r => r.comment || ''),
        ...(service.tags ? JSON.parse(service.tags) : []),
      ].filter(Boolean).join(' ');

      // Generate embedding
      const embedding = await this.generateEmbedding(textContent);

      // Update service with search vector (stored as JSON string for SQLite)
      await prisma.service.update({
        where: { id: serviceId },
        data: {
          searchVector: JSON.stringify(embedding),
        },
      });

      console.log(`📊 Indexed service: ${service.title}`);
    } catch (error) {
      console.error('Error indexing service:', error);
    }
  }

  /**
   * Perform semantic search across services
   */
  async semanticSearch(
    query: string,
    limit: number = 10,
    filters?: {
      category?: string;
      location?: string;
      priceMin?: number;
      priceMax?: number;
    }
  ): Promise<VectorSearchResult[]> {
    try {
      // Generate embedding for search query
      const queryEmbedding = await this.generateEmbedding(query);

      // Get all services with embeddings
      const whereClause: any = {
        status: 'ACTIVE',
        searchVector: {
          not: null,
        },
      };

      if (filters) {
        if (filters.category) whereClause.category = filters.category;
        if (filters.location) whereClause.location = { contains: filters.location };
        if (filters.priceMin) whereClause.price = { gte: filters.priceMin };
        if (filters.priceMax) whereClause.price = { ...whereClause.price, lte: filters.priceMax };
      }

      const services = await prisma.service.findMany({
        where: whereClause,
        include: {
          provider: {
            select: {
              name: true,
              image: true,
              profile: {
                select: {
                  verified: true,
                  rating: true,
                },
              },
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

      // Calculate similarity scores
      const results: VectorSearchResult[] = services
        .map(service => {
          if (!service.searchVector) return null;

          try {
            const serviceEmbedding = JSON.parse(service.searchVector);
            const similarity = this.cosineSimilarity(queryEmbedding, serviceEmbedding);

            return {
              id: service.id,
              content: service.title,
              similarity,
              metadata: {
                title: service.title,
                description: service.description,
                category: service.category,
                price: service.price,
                location: service.location,
                rating: service.reviews.length > 0
                  ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
                  : 0,
                reviewCount: service._count.reviews,
                provider: {
                  name: service.provider.name,
                  image: service.provider.image,
                  verified: service.provider.profile?.verified || false,
                  rating: service.provider.profile?.rating,
                },
                images: service.images ? JSON.parse(service.images) : [],
                tags: service.tags ? JSON.parse(service.tags) : [],
              },
            };
          } catch (error) {
            console.error('Error parsing service embedding:', error);
            return null;
          }
        })
        .filter((result): result is VectorSearchResult => result !== null)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return results;
    } catch (error) {
      console.error('Error performing semantic search:', error);
      return [];
    }
  }

  /**
   * Get personalized recommendations for a user
   */
  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 5
  ): Promise<VectorSearchResult[]> {
    try {
      // Get user's booking history and preferences
      const userBookings = await prisma.booking.findMany({
        where: { customerId: userId },
        include: {
          service: {
            select: {
              title: true,
              description: true,
              category: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      if (userBookings.length === 0) {
        // No history, return popular services
        return this.getPopularServices(limit);
      }

      // Create user preference profile
      const preferenceText = userBookings
        .map(booking => [
          booking.service.title,
          booking.service.description,
          booking.service.category,
          booking.service.location,
        ].join(' '))
        .join(' ');

      // Search based on user preferences
      return this.semanticSearch(preferenceText, limit);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return this.getPopularServices(limit);
    }
  }

  /**
   * Get popular services as fallback
   */
  async getPopularServices(limit: number = 5): Promise<VectorSearchResult[]> {
    try {
      const services = await prisma.service.findMany({
        where: { status: 'ACTIVE' },
        include: {
          provider: {
            select: {
              name: true,
              image: true,
              profile: {
                select: {
                  verified: true,
                  rating: true,
                },
              },
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
        orderBy: [
          { bookings: { _count: 'desc' } },
          { reviews: { _count: 'desc' } },
        ],
        take: limit,
      });

      return services.map(service => ({
        id: service.id,
        content: service.title,
        similarity: 1.0, // Highest similarity for popular items
        metadata: {
          title: service.title,
          description: service.description,
          category: service.category,
          price: service.price,
          location: service.location,
          rating: service.reviews.length > 0
            ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
            : 0,
          reviewCount: service._count.reviews,
          bookingCount: service._count.bookings,
          provider: {
            name: service.provider.name,
            image: service.provider.image,
            verified: service.provider.profile?.verified || false,
            rating: service.provider.profile?.rating,
          },
          images: service.images ? JSON.parse(service.images) : [],
          tags: service.tags ? JSON.parse(service.tags) : [],
        },
      }));
    } catch (error) {
      console.error('Error getting popular services:', error);
      return [];
    }
  }

  /**
   * Index all existing services
   */
  async indexAllServices(): Promise<void> {
    try {
      const services = await prisma.service.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });

      console.log(`🔄 Indexing ${services.length} services...`);

      for (const service of services) {
        await this.indexServiceListing(service.id);
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Indexed ${services.length} services successfully`);
    } catch (error) {
      console.error('Error indexing all services:', error);
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Auto-tag services using AI
   */
  async autoTagService(serviceId: string): Promise<string[]> {
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          provider: {
            select: {
              profile: {
                select: {
                  bio: true,
                },
              },
            },
          },
        },
      });

      if (!service) return [];

      // Use AI to generate relevant tags
      const prompt = `
Generate relevant tags for this service listing:

Title: ${service.title}
Description: ${service.description}
Category: ${service.category}
Location: ${service.location}
Provider Bio: ${service.provider.profile?.bio || 'N/A'}

Generate 5-8 relevant tags that would help users find this service. 
Return only the tags as a comma-separated list.
`;

      try {
        const { text } = await import('ai').then(ai => ai.generateText({
          model: openai('gpt-3.5-turbo'),
          prompt,
          maxTokens: 100,
        }));

        const tags = text.split(',').map(tag => tag.trim()).filter(Boolean);
        
        // Update service with generated tags
        await prisma.service.update({
          where: { id: serviceId },
          data: {
            tags: JSON.stringify(tags),
          },
        });

        return tags;
      } catch (error) {
        // Fallback: generate basic tags from category and title
        const basicTags = [
          service.category.toLowerCase(),
          ...service.title.toLowerCase().split(' ').filter(word => word.length > 3),
        ];
        return basicTags.slice(0, 5);
      }
    } catch (error) {
      console.error('Error auto-tagging service:', error);
      return [];
    }
  }
}

export const vectorSearchService = VectorSearchService.getInstance();