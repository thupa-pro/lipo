import Redis from 'ioredis';
import { performance } from 'perf_hooks';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  compress?: boolean;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  warmup?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  avgResponseTime: number;
  totalMemoryUsage: number;
  keyCount: number;
}

export interface SessionData {
  userId: string;
  email?: string;
  role: string;
  permissions: string[];
  preferences: Record<string, any>;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
}

class AdvancedRedisCache {
  private redis: Redis;
  private subscriber: Redis;
  private publisher: Redis;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
    avgResponseTime: 0,
    totalMemoryUsage: 0,
    keyCount: 0
  };
  private responseTimes: number[] = [];
  private readonly maxResponseTimes = 1000;

  constructor() {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    };

    this.redis = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);

    this.setupEventHandlers();
    this.startStatsCollection();
  }

  private setupEventHandlers() {
    this.redis.on('connect', () => {
      console.log('Redis connected');
    });

    this.redis.on('error', (error) => {
      console.error('Redis error:', error);
    });

    this.redis.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });

    // Subscribe to cache invalidation events
    this.subscriber.subscribe('cache:invalidate');
    this.subscriber.on('message', (channel, message) => {
      if (channel === 'cache:invalidate') {
        this.handleCacheInvalidation(message);
      }
    });
  }

  private startStatsCollection() {
    // Update stats every 30 seconds
    setInterval(async () => {
      await this.updateStats();
    }, 30000);
  }

  private async updateStats() {
    try {
      const info = await this.redis.info('memory');
      const memoryMatch = info.match(/used_memory:(\d+)/);
      this.stats.totalMemoryUsage = memoryMatch ? parseInt(memoryMatch[1]) : 0;

      const keyCount = await this.redis.dbsize();
      this.stats.keyCount = keyCount;

      this.stats.hitRate = this.stats.hits + this.stats.misses > 0 
        ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100 
        : 0;

      this.stats.avgResponseTime = this.responseTimes.length > 0
        ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
        : 0;
    } catch (error) {
      console.error('Error updating cache stats:', error);
    }
  }

  private recordResponseTime(time: number) {
    this.responseTimes.push(time);
    if (this.responseTimes.length > this.maxResponseTimes) {
      this.responseTimes = this.responseTimes.slice(-this.maxResponseTimes);
    }
  }

  private handleCacheInvalidation(message: string) {
    try {
      const { pattern, tags } = JSON.parse(message);
      if (pattern) {
        this.deletePattern(pattern);
      }
      if (tags) {
        this.deleteByTags(tags);
      }
    } catch (error) {
      console.error('Error handling cache invalidation:', error);
    }
  }

  // Core caching methods
  async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();
    
    try {
      const value = await this.redis.get(key);
      const responseTime = performance.now() - startTime;
      this.recordResponseTime(responseTime);

      if (value === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      this.stats.misses++;
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    const startTime = performance.now();
    
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      const ttl = options.ttl || 3600; // Default 1 hour

      let result;
      if (ttl > 0) {
        result = await this.redis.setex(key, ttl, serializedValue);
      } else {
        result = await this.redis.set(key, serializedValue);
      }

      // Add tags for cache invalidation
      if (options.tags && options.tags.length > 0) {
        await this.addTags(key, options.tags);
      }

      const responseTime = performance.now() - startTime;
      this.recordResponseTime(responseTime);
      this.stats.sets++;

      return result === 'OK';
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key);
      this.stats.deletes++;
      return result > 0;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async increment(key: string, by: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, by);
    } catch (error) {
      console.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.redis.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }

  // Advanced caching methods
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.redis.mget(...keys);
      return values.map(value => {
        if (value === null) {
          this.stats.misses++;
          return null;
        }
        this.stats.hits++;
        try {
          return JSON.parse(value) as T;
        } catch {
          return value as T;
        }
      });
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  async mset(keyValuePairs: Record<string, any>, ttl?: number): Promise<boolean> {
    try {
      const pipeline = this.redis.pipeline();
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttl) {
          pipeline.setex(key, ttl, serializedValue);
        } else {
          pipeline.set(key, serializedValue);
        }
      });

      const results = await pipeline.exec();
      this.stats.sets += Object.keys(keyValuePairs).length;
      
      return results?.every(result => result[1] === 'OK') || false;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;
      
      const result = await this.redis.del(...keys);
      this.stats.deletes += result;
      return result;
    } catch (error) {
      console.error(`Cache deletePattern error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  // Tag-based cache invalidation
  private async addTags(key: string, tags: string[]): Promise<void> {
    const pipeline = this.redis.pipeline();
    tags.forEach(tag => {
      pipeline.sadd(`tag:${tag}`, key);
    });
    await pipeline.exec();
  }

  async deleteByTags(tags: string[]): Promise<number> {
    try {
      let allKeys: string[] = [];
      
      for (const tag of tags) {
        const keys = await this.redis.smembers(`tag:${tag}`);
        allKeys = [...allKeys, ...keys];
      }

      if (allKeys.length === 0) return 0;

      // Remove duplicates
      const uniqueKeys = [...new Set(allKeys)];
      
      const pipeline = this.redis.pipeline();
      uniqueKeys.forEach(key => pipeline.del(key));
      tags.forEach(tag => pipeline.del(`tag:${tag}`));
      
      const results = await pipeline.exec();
      const deletedCount = results?.filter(result => result[1] > 0).length || 0;
      
      this.stats.deletes += deletedCount;
      return deletedCount;
    } catch (error) {
      console.error('Cache deleteByTags error:', error);
      return 0;
    }
  }

  // Session management
  async setSession(sessionId: string, sessionData: SessionData, ttl: number = 86400): Promise<boolean> {
    const key = `session:${sessionId}`;
    return await this.set(key, sessionData, { ttl, tags: ['sessions'] });
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const key = `session:${sessionId}`;
    return await this.get<SessionData>(key);
  }

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<boolean> {
    const key = `session:${sessionId}`;
    const currentSession = await this.getSession(sessionId);
    
    if (!currentSession) return false;

    const updatedSession = { ...currentSession, ...updates, lastActivity: Date.now() };
    return await this.setSession(sessionId, updatedSession);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const key = `session:${sessionId}`;
    return await this.delete(key);
  }

  async getUserSessions(userId: string): Promise<string[]> {
    try {
      const pattern = 'session:*';
      const keys = await this.redis.keys(pattern);
      const sessions = await this.mget<SessionData>(keys);
      
      return keys.filter((key, index) => {
        const session = sessions[index];
        return session && session.userId === userId;
      }).map(key => key.replace('session:', ''));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  // Cache warming
  async warmCache(warmupFunctions: Array<() => Promise<void>>): Promise<void> {
    console.log('Starting cache warmup...');
    const startTime = performance.now();
    
    try {
      await Promise.all(warmupFunctions.map(fn => fn()));
      const duration = performance.now() - startTime;
      console.log(`Cache warmup completed in ${duration.toFixed(2)}ms`);
    } catch (error) {
      console.error('Cache warmup error:', error);
    }
  }

  // Distributed cache invalidation
  async invalidateCache(pattern?: string, tags?: string[]): Promise<void> {
    const message = JSON.stringify({ pattern, tags });
    await this.publisher.publish('cache:invalidate', message);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Memory management
  async clearExpired(): Promise<number> {
    try {
      // Redis automatically removes expired keys, but we can force cleanup
      const keys = await this.redis.keys('*');
      let expiredCount = 0;
      
      for (const key of keys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -2) { // Key doesn't exist (expired)
          expiredCount++;
        }
      }
      
      return expiredCount;
    } catch (error) {
      console.error('Error clearing expired keys:', error);
      return 0;
    }
  }

  async getMemoryUsage(): Promise<{ used: number; peak: number; fragmentation: number }> {
    try {
      const info = await this.redis.info('memory');
      const used = parseInt(info.match(/used_memory:(\d+)/)?.[1] || '0');
      const peak = parseInt(info.match(/used_memory_peak:(\d+)/)?.[1] || '0');
      const fragmentation = parseFloat(info.match(/mem_fragmentation_ratio:([\d.]+)/)?.[1] || '1');
      
      return { used, peak, fragmentation };
    } catch (error) {
      console.error('Error getting memory usage:', error);
      return { used: 0, peak: 0, fragmentation: 1 };
    }
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await Promise.all([
      this.redis.disconnect(),
      this.subscriber.disconnect(),
      this.publisher.disconnect()
    ]);
  }
}

// Singleton instance
let redisCache: AdvancedRedisCache | null = null;

export function getRedisCache(): AdvancedRedisCache {
  if (!redisCache) {
    redisCache = new AdvancedRedisCache();
  }
  return redisCache;
}

// Utility functions for common caching patterns
export async function cacheWrapper<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cache = getRedisCache();
  
  // Try to get from cache first
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch fresh data
  const data = await fetchFunction();
  
  // Store in cache
  await cache.set(key, data, options);
  
  return data;
}

export async function invalidateUserCache(userId: string): Promise<void> {
  const cache = getRedisCache();
  await cache.invalidateCache(`user:${userId}:*`, ['user_data', `user_${userId}`]);
}

export async function cacheUserData(userId: string, data: any, ttl: number = 3600): Promise<boolean> {
  const cache = getRedisCache();
  return await cache.set(`user:${userId}:data`, data, { 
    ttl, 
    tags: ['user_data', `user_${userId}`] 
  });
}