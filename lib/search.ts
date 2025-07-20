import Fuse from 'fuse.js';
import { prisma } from '@/lib/prisma';

export interface SearchFilters {
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  availability?: boolean;
  verified?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  images?: string[];
  tags?: string[];
  provider: {
    id: string;
    name: string;
    image?: string;
    rating?: number;
    verified?: boolean;
  };
  rating?: number;
  reviewCount: number;
  score?: number; // Fuse.js search score
}

export class SearchService {
  private static instance: SearchService;
  private servicesFuse: Fuse<any> | null = null;
  private lastIndexUpdate: Date | null = null;
  private readonly INDEX_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  private async buildSearchIndex(): Promise<void> {
    try {
      const services = await prisma.service.findMany({
        where: {
          status: 'ACTIVE',
        },
        include: {
          provider: {
            select: {
              id: true,
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

      // Transform data for search
      const searchableServices = services.map(service => {
        const images = service.images ? JSON.parse(service.images) : [];
        const tags = service.tags ? JSON.parse(service.tags) : [];
        const avgRating = service.reviews.length > 0 
          ? service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length
          : 0;

        return {
          id: service.id,
          title: service.title,
          description: service.description,
          category: service.category,
          price: service.price,
          location: service.location,
          images,
          tags,
          provider: {
            id: service.provider.id,
            name: service.provider.name || '',
            image: service.provider.image,
            rating: service.provider.profile?.rating,
            verified: service.provider.profile?.verified || false,
          },
          rating: avgRating,
          reviewCount: service._count.reviews,
          // Create searchable text
          searchText: [
            service.title,
            service.description,
            service.category,
            service.location,
            service.provider.name,
            ...tags,
          ].join(' ').toLowerCase(),
        };
      });

      // Configure Fuse.js for fuzzy search
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 0.3 },
          { name: 'description', weight: 0.2 },
          { name: 'category', weight: 0.2 },
          { name: 'location', weight: 0.15 },
          { name: 'provider.name', weight: 0.1 },
          { name: 'tags', weight: 0.05 },
        ],
        threshold: 0.3, // 0.0 = perfect match, 1.0 = match anything
        includeScore: true,
        includeMatches: true,
      };

      this.servicesFuse = new Fuse(searchableServices, fuseOptions);
      this.lastIndexUpdate = new Date();
      
      console.log(`🔍 Search index built with ${searchableServices.length} services`);
    } catch (error) {
      console.error('Error building search index:', error);
    }
  }

  private async ensureIndexUpdated(): Promise<void> {
    const now = new Date();
    
    if (!this.lastIndexUpdate || 
        !this.servicesFuse || 
        (now.getTime() - this.lastIndexUpdate.getTime()) > this.INDEX_REFRESH_INTERVAL) {
      await this.buildSearchIndex();
    }
  }

  async searchServices(query: string, filters?: SearchFilters, limit: number = 20): Promise<SearchResult[]> {
    await this.ensureIndexUpdated();

    if (!this.servicesFuse) {
      console.error('Search index not available');
      return [];
    }

    let results: SearchResult[] = [];

    if (query.trim()) {
      // Perform fuzzy search
      const fuseResults = this.servicesFuse.search(query, { limit: limit * 2 });
      results = fuseResults.map(result => ({
        ...result.item,
        score: result.score,
      }));
    } else {
      // No query, get all services
      const allServices = this.servicesFuse.getIndex().docs as any[];
      results = allServices.slice(0, limit * 2);
    }

    // Apply filters
    if (filters) {
      results = results.filter(service => {
        if (filters.category && service.category !== filters.category) {
          return false;
        }
        
        if (filters.location && !service.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
        
        if (filters.priceMin !== undefined && service.price < filters.priceMin) {
          return false;
        }
        
        if (filters.priceMax !== undefined && service.price > filters.priceMax) {
          return false;
        }
        
        if (filters.rating !== undefined && service.rating < filters.rating) {
          return false;
        }
        
        if (filters.verified !== undefined && service.provider.verified !== filters.verified) {
          return false;
        }
        
        return true;
      });
    }

    return results.slice(0, limit);
  }

  async getPopularServices(limit: number = 10): Promise<SearchResult[]> {
    await this.ensureIndexUpdated();
    
    if (!this.servicesFuse) {
      return [];
    }

    const allServices = this.servicesFuse.getIndex().docs as any[];
    
    // Sort by rating and review count
    const popularServices = allServices
      .sort((a, b) => {
        const scoreA = (a.rating * 0.7) + (Math.min(a.reviewCount, 50) * 0.3);
        const scoreB = (b.rating * 0.7) + (Math.min(b.reviewCount, 50) * 0.3);
        return scoreB - scoreA;
      })
      .slice(0, limit);

    return popularServices;
  }

  async getServicesByCategory(category: string, limit: number = 20): Promise<SearchResult[]> {
    return this.searchServices('', { category }, limit);
  }

  async getServicesByLocation(location: string, limit: number = 20): Promise<SearchResult[]> {
    return this.searchServices('', { location }, limit);
  }

  async getSuggestedServices(userId: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      // Get user's booking history to suggest similar services
      const userBookings = await prisma.booking.findMany({
        where: { customerId: userId },
        include: {
          service: {
            select: {
              category: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      // Extract categories and locations from booking history
      const categories = [...new Set(userBookings.map(b => b.service.category))];
      const locations = [...new Set(userBookings.map(b => b.service.location))];

      if (categories.length === 0) {
        // No booking history, return popular services
        return this.getPopularServices(limit);
      }

      // Search for services in user's preferred categories and locations
      const suggestions: SearchResult[] = [];
      
      for (const category of categories) {
        const categoryServices = await this.getServicesByCategory(category, 5);
        suggestions.push(...categoryServices);
      }

      // Remove duplicates and limit results
      const uniqueSuggestions = suggestions.filter((service, index, arr) => 
        arr.findIndex(s => s.id === service.id) === index
      );

      return uniqueSuggestions.slice(0, limit);
    } catch (error) {
      console.error('Error getting suggested services:', error);
      return this.getPopularServices(limit);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const categories = await prisma.service.findMany({
        where: { status: 'ACTIVE' },
        select: { category: true },
        distinct: ['category'],
      });

      return categories.map(c => c.category).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getLocations(): Promise<string[]> {
    try {
      const locations = await prisma.service.findMany({
        where: { status: 'ACTIVE' },
        select: { location: true },
        distinct: ['location'],
      });

      return locations.map(l => l.location).sort();
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  }
}

export const searchService = SearchService.getInstance();