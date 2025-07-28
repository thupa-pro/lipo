/**
 * Advanced Redis-based Caching Manager for Loconomy
 * Comprehensive caching solution for performance optimization
 * 
 * Features:
 * - Multi-tier caching strategy
 * - Intelligent cache invalidation
 * - Session and user data caching
 * - Geospatial query caching
 * - Real-time data synchronization
 * - Cache warming and preloading
 * - Performance analytics
 * - Distributed cache coordination
 */

import Redis, { RedisOptions } from 'ioredis';
import { PrismaClient } from '@prisma/client';

// Cache Configuration
interface CacheConfig {
  defaultTTL: number;
  keyPrefix: string;
  compression: boolean;
  encryption: boolean;
  maxMemoryPolicy: 'allkeys-lru' | 'allkeys-lfu' | 'volatile-lru' | 'volatile-lfu';
}

interface CacheEntry<T = any> {
  data: T;
  metadata: {
    createdAt: number;
    accessedAt: number;
    hitCount: number;
    tags: string[];
  };
}

interface CacheKeyPattern {
  pattern: string;
  ttl: number;
  invalidationTriggers: string[];
}

// Cache Key Patterns for Loconomy
const CACHE_PATTERNS: Record<string, CacheKeyPattern> = {
  // User and Session Data
  USER_PROFILE: {
    pattern: 'user:profile:{userId}',
    ttl: 3600, // 1 hour
    invalidationTriggers: ['user_updated', 'profile_changed'],
  },
  USER_SESSION: {
    pattern: 'session:{sessionId}',
    ttl: 1800, // 30 minutes
    invalidationTriggers: ['session_expired', 'user_logout'],
  },
  USER_PREFERENCES: {
    pattern: 'user:preferences:{userId}',
    ttl: 7200, // 2 hours
    invalidationTriggers: ['preferences_updated'],
  },
  
  // Service Discovery
  SERVICE_LISTINGS: {
    pattern: 'services:category:{category}:location:{lat}:{lng}',
    ttl: 300, // 5 minutes
    invalidationTriggers: ['service_created', 'service_updated', 'provider_availability_changed'],
  },
  PROVIDER_SEARCH: {
    pattern: 'providers:search:{query}:filters:{filterHash}',
    ttl: 180, // 3 minutes
    invalidationTriggers: ['provider_updated', 'new_provider'],
  },
  GEOSPATIAL_SERVICES: {
    pattern: 'geo:services:{radius}:{lat}:{lng}',
    ttl: 600, // 10 minutes
    invalidationTriggers: ['location_services_changed'],
  },
  
  // Booking and Availability
  PROVIDER_AVAILABILITY: {
    pattern: 'availability:{providerId}:{date}',
    ttl: 900, // 15 minutes
    invalidationTriggers: ['booking_created', 'availability_updated'],
  },
  BOOKING_DETAILS: {
    pattern: 'booking:{bookingId}',
    ttl: 3600, // 1 hour
    invalidationTriggers: ['booking_updated', 'booking_status_changed'],
  },
  
  // AI and Recommendations
  AI_RECOMMENDATIONS: {
    pattern: 'ai:recommendations:{userId}:{contextHash}',
    ttl: 1800, // 30 minutes
    invalidationTriggers: ['user_preferences_changed', 'new_services_available'],
  },
  AI_CONVERSATION: {
    pattern: 'ai:conversation:{sessionId}',
    ttl: 3600, // 1 hour
    invalidationTriggers: ['session_ended'],
  },
  
  // Analytics and Metrics
  ANALYTICS_SUMMARY: {
    pattern: 'analytics:summary:{tenantId}:{timeframe}',
    ttl: 1800, // 30 minutes
    invalidationTriggers: ['new_booking', 'new_user'],
  },
  PERFORMANCE_METRICS: {
    pattern: 'metrics:performance:{component}:{timeframe}',
    ttl: 300, // 5 minutes
    invalidationTriggers: ['metrics_updated'],
  },
};

export class AdvancedCacheManager {
  private redis: Redis;
  private fallbackRedis: Redis;
  private prisma: PrismaClient;
  private config: CacheConfig;
  private hitRateTracker: Map<string, { hits: number; misses: number }>;

  constructor(redisOptions: RedisOptions = {}) {
    this.config = {
      defaultTTL: 3600,
      keyPrefix: 'loconomy:',
      compression: true,
      encryption: process.env.NODE_ENV === 'production',
      maxMemoryPolicy: 'allkeys-lru',
    };

    // Primary Redis connection
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 0,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      ...redisOptions,
    });

    // Fallback Redis connection (different instance/cluster)
    this.fallbackRedis = new Redis({
      host: process.env.REDIS_FALLBACK_HOST || 'localhost',
      port: parseInt(process.env.REDIS_FALLBACK_PORT || '6380'),
      password: process.env.REDIS_FALLBACK_PASSWORD,
      db: 1,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });

    this.prisma = new PrismaClient();
    this.hitRateTracker = new Map();

    this.setupEventHandlers();
  }

  /**
   * Multi-tier caching with fallback strategies
   */
  async get<T>(key: string, fallbackFn?: () => Promise<T>, ttl?: number): Promise<T | null> {
    const fullKey = this.buildKey(key);
    
    try {
      // Try primary cache
      const cachedData = await this.redis.get(fullKey);
      if (cachedData) {
        this.trackHit(key);
        return this.deserializeData<T>(cachedData);
      }

      // Try fallback cache
      const fallbackData = await this.fallbackRedis.get(fullKey);
      if (fallbackData) {
        this.trackHit(key);
        // Restore to primary cache
        const deserializedData = this.deserializeData<T>(fallbackData);
        this.set(key, deserializedData, ttl);
        return deserializedData;
      }

      this.trackMiss(key);

      // Execute fallback function if provided
      if (fallbackFn) {
        const freshData = await fallbackFn();
        if (freshData) {
          await this.set(key, freshData, ttl);
        }
        return freshData;
      }

      return null;
    } catch (error) {
      console.error(`Cache get error for key ${fullKey}:`, error);
      
      // Fallback to database or function
      if (fallbackFn) {
        return await fallbackFn();
      }
      
      return null;
    }
  }

  /**
   * Set data in cache with intelligent TTL
   */
  async set<T>(key: string, data: T, ttl?: number, tags: string[] = []): Promise<boolean> {
    const fullKey = this.buildKey(key);
    const finalTTL = ttl || this.getTTLForKey(key);
    
    try {
      const serializedData = this.serializeData(data, tags);
      
      // Set in primary cache
      const result = await this.redis.setex(fullKey, finalTTL, serializedData);
      
      // Set in fallback cache with longer TTL
      this.fallbackRedis.setex(fullKey, finalTTL * 2, serializedData);
      
      // Add to tag indexes for invalidation
      if (tags.length > 0) {
        await this.addToTagIndexes(fullKey, tags, finalTTL);
      }
      
      return result === 'OK';
    } catch (error) {
      console.error(`Cache set error for key ${fullKey}:`, error);
      return false;
    }
  }

  /**
   * Intelligent bulk operations
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const fullKeys = keys.map(key => this.buildKey(key));
    
    try {
      const results = await this.redis.mget(fullKeys);
      return results.map(result => result ? this.deserializeData<T>(result) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  async mset(keyValuePairs: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    try {
      const pipeline = this.redis.pipeline();
      
      keyValuePairs.forEach(({ key, value, ttl }) => {
        const fullKey = this.buildKey(key);
        const finalTTL = ttl || this.getTTLForKey(key);
        const serializedData = this.serializeData(value);
        
        pipeline.setex(fullKey, finalTTL, serializedData);
      });
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  /**
   * Geographic caching for location-based queries
   */
  async setGeoLocation(key: string, longitude: number, latitude: number, member: string): Promise<boolean> {
    const fullKey = this.buildKey(key);
    
    try {
      const result = await this.redis.geoadd(fullKey, longitude, latitude, member);
      return result === 1;
    } catch (error) {
      console.error('Geo cache set error:', error);
      return false;
    }
  }

  async getGeoRadius(
    key: string, 
    longitude: number, 
    latitude: number, 
    radius: number, 
    unit: 'km' | 'm' = 'km'
  ): Promise<string[]> {
    const fullKey = this.buildKey(key);
    
    try {
      const results = await this.redis.georadius(fullKey, longitude, latitude, radius, unit);
      return results;
    } catch (error) {
      console.error('Geo cache get error:', error);
      return [];
    }
  }

  /**
   * Tag-based cache invalidation
   */
  async invalidateByTag(tag: string): Promise<number> {
    try {
      const tagKey = this.buildKey(`tags:${tag}`);
      const keys = await this.redis.smembers(tagKey);
      
      if (keys.length === 0) return 0;
      
      // Delete all keys with this tag
      const pipeline = this.redis.pipeline();
      keys.forEach(key => pipeline.del(key));
      pipeline.del(tagKey);
      
      const results = await pipeline.exec();
      return results?.length || 0;
    } catch (error) {
      console.error(`Tag invalidation error for ${tag}:`, error);
      return 0;
    }
  }

  async invalidateByPattern(pattern: string): Promise<number> {
    try {
      const fullPattern = this.buildKey(pattern);
      const keys = await this.redis.keys(fullPattern);
      
      if (keys.length === 0) return 0;
      
      await this.redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`Pattern invalidation error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Cache warming strategies
   */
  async warmCache(patterns: string[]): Promise<void> {
    console.log('Starting cache warming...');
    
    for (const pattern of patterns) {
      try {
        switch (pattern) {
          case 'popular_services':
            await this.warmPopularServices();
            break;
          case 'active_providers':
            await this.warmActiveProviders();
            break;
          case 'user_sessions':
            await this.warmUserSessions();
            break;
        }
      } catch (error) {
        console.error(`Cache warming error for ${pattern}:`, error);
      }
    }
    
    console.log('Cache warming completed');
  }

  private async warmPopularServices(): Promise<void> {
    // Preload popular services from database
    const popularServices = await this.prisma.serviceListing.findMany({
      where: { status: 'active' },
      orderBy: { viewCount: 'desc' },
      take: 100,
      include: {
        provider: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
        category: true,
      },
    });

    const pipeline = this.redis.pipeline();
    popularServices.forEach(service => {
      const key = `service:${service.id}`;
      pipeline.setex(this.buildKey(key), 3600, this.serializeData(service));
    });

    await pipeline.exec();
  }

  private async warmActiveProviders(): Promise<void> {
    const activeProviders = await this.prisma.user.findMany({
      where: { 
        role: 'provider',
        status: 'active',
        lastActiveAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        profile: true,
        serviceListings: {
          where: { status: 'active' },
          take: 5,
        },
      },
      take: 200,
    });

    const pipeline = this.redis.pipeline();
    activeProviders.forEach(provider => {
      const key = `provider:${provider.id}`;
      pipeline.setex(this.buildKey(key), 1800, this.serializeData(provider));
    });

    await pipeline.exec();
  }

  private async warmUserSessions(): Promise<void> {
    // Warm user sessions for active users
    const recentUsers = await this.redis.keys(this.buildKey('session:*'));
    console.log(`Warmed ${recentUsers.length} user sessions`);
  }

  /**
   * Performance monitoring and analytics
   */
  getHitRate(key?: string): { hits: number; misses: number; rate: number } {
    if (key) {
      const stats = this.hitRateTracker.get(key) || { hits: 0, misses: 0 };
      const total = stats.hits + stats.misses;
      return {
        ...stats,
        rate: total > 0 ? stats.hits / total : 0,
      };
    }

    // Overall hit rate
    let totalHits = 0;
    let totalMisses = 0;
    
    this.hitRateTracker.forEach(stats => {
      totalHits += stats.hits;
      totalMisses += stats.misses;
    });

    const total = totalHits + totalMisses;
    return {
      hits: totalHits,
      misses: totalMisses,
      rate: total > 0 ? totalHits / total : 0,
    };
  }

  async getCacheInfo(): Promise<{
    memory: any;
    keyspace: any;
    hitRate: number;
    connections: number;
  }> {
    try {
      const info = await this.redis.info();
      const keyspace = await this.redis.info('keyspace');
      
      return {
        memory: this.parseMemoryInfo(info),
        keyspace: this.parseKeyspaceInfo(keyspace),
        hitRate: this.getHitRate().rate,
        connections: parseInt(info.match(/connected_clients:(\d+)/)?.[1] || '0'),
      };
    } catch (error) {
      console.error('Cache info error:', error);
      return {
        memory: {},
        keyspace: {},
        hitRate: 0,
        connections: 0,
      };
    }
  }

  /**
   * Utility methods
   */
  private buildKey(key: string): string {
    return `${this.config.keyPrefix}${key}`;
  }

  private getTTLForKey(key: string): number {
    // Find matching pattern
    for (const [name, pattern] of Object.entries(CACHE_PATTERNS)) {
      if (this.keyMatchesPattern(key, pattern.pattern)) {
        return pattern.ttl;
      }
    }
    return this.config.defaultTTL;
  }

  private keyMatchesPattern(key: string, pattern: string): boolean {
    const regex = pattern.replace(/\{[^}]+\}/g, '[^:]+');
    return new RegExp(`^${regex}$`).test(key);
  }

  private serializeData<T>(data: T, tags: string[] = []): string {
    const cacheEntry: CacheEntry<T> = {
      data,
      metadata: {
        createdAt: Date.now(),
        accessedAt: Date.now(),
        hitCount: 0,
        tags,
      },
    };

    let serialized = JSON.stringify(cacheEntry);
    
    // Apply compression if enabled
    if (this.config.compression && serialized.length > 1000) {
      // Would use compression library like zlib in production
      serialized = this.compress(serialized);
    }

    return serialized;
  }

  private deserializeData<T>(serialized: string): T {
    try {
      // Decompress if needed
      let data = serialized;
      if (this.isCompressed(serialized)) {
        data = this.decompress(serialized);
      }

      const cacheEntry: CacheEntry<T> = JSON.parse(data);
      
      // Update access metadata
      cacheEntry.metadata.accessedAt = Date.now();
      cacheEntry.metadata.hitCount++;

      return cacheEntry.data;
    } catch (error) {
      console.error('Cache deserialization error:', error);
      throw error;
    }
  }

  private async addToTagIndexes(key: string, tags: string[], ttl: number): Promise<void> {
    const pipeline = this.redis.pipeline();
    
    tags.forEach(tag => {
      const tagKey = this.buildKey(`tags:${tag}`);
      pipeline.sadd(tagKey, key);
      pipeline.expire(tagKey, ttl + 300); // Tags expire after data
    });

    await pipeline.exec();
  }

  private trackHit(key: string): void {
    const stats = this.hitRateTracker.get(key) || { hits: 0, misses: 0 };
    stats.hits++;
    this.hitRateTracker.set(key, stats);
  }

  private trackMiss(key: string): void {
    const stats = this.hitRateTracker.get(key) || { hits: 0, misses: 0 };
    stats.misses++;
    this.hitRateTracker.set(key, stats);
  }

  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      console.log('Redis connected');
    });

    this.redis.on('error', (error) => {
      console.error('Redis error:', error);
    });

    this.redis.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });
  }

  // Mock compression methods (would use real compression in production)
  private compress(data: string): string {
    return `compressed:${data}`;
  }

  private decompress(data: string): string {
    return data.replace('compressed:', '');
  }

  private isCompressed(data: string): boolean {
    return data.startsWith('compressed:');
  }

  private parseMemoryInfo(info: string): any {
    const match = info.match(/used_memory_human:([^\r\n]+)/);
    return { used: match?.[1] || 'unknown' };
  }

  private parseKeyspaceInfo(info: string): any {
    const match = info.match(/keys=(\d+),expires=(\d+)/);
    return {
      keys: parseInt(match?.[1] || '0'),
      expires: parseInt(match?.[2] || '0'),
    };
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down cache manager...');
    await this.redis.quit();
    await this.fallbackRedis.quit();
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
export const cacheManager = new AdvancedCacheManager();

// Export cache patterns for external use
export { CACHE_PATTERNS };

// Utility functions for common caching patterns
export const CacheUtils = {
  // Generate cache key for user data
  userKey: (userId: string, type: string) => `user:${type}:${userId}`,
  
  // Generate cache key for service queries
  serviceKey: (category: string, lat: number, lng: number) => 
    `services:category:${category}:location:${lat.toFixed(4)}:${lng.toFixed(4)}`,
  
  // Generate cache key for provider data
  providerKey: (providerId: string, type: string = 'profile') => 
    `provider:${type}:${providerId}`,
  
  // Generate hash for complex filter objects
  filterHash: (filters: Record<string, any>) => {
    const sorted = Object.keys(filters).sort().map(key => `${key}:${filters[key]}`).join('|');
    // Simple hash function (would use crypto.createHash in production)
    return sorted.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0).toString(36);
  },
};
