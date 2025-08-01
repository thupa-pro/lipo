import { hasFeature, env } from '@/lib/config/environment';

// Redis-based rate limiting (production)
let Ratelimit: any, Redis: any;
let isUpstashAvailable = false;

// Dynamic imports for optional dependencies
async function loadUpstash() {
  if (isUpstashAvailable) return;
  
  try {
    if (hasFeature('redis')) {
      const upstashRatelimit = await import('@upstash/ratelimit');
      const upstashRedis = await import('@upstash/redis');
      Ratelimit = upstashRatelimit.Ratelimit;
      Redis = upstashRedis.Redis;
      isUpstashAvailable = true;
    }
  } catch (error) {
    console.warn('Upstash packages not available, using in-memory fallback');
    isUpstashAvailable = false;
  }
}

// In-memory fallback rate limiter
class InMemoryRateLimit {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxSize = 10000; // Prevent memory leaks

  check(identifier: string, maxAttempts: number, windowMs: number) {
    this.cleanup(); // Clean old entries periodically
    
    const now = Date.now();
    const key = identifier;
    const entry = this.attempts.get(key);

    if (!entry || now > entry.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return { 
        success: true, 
        remaining: maxAttempts - 1, 
        reset: now + windowMs, 
        limit: maxAttempts 
      };
    }

    if (entry.count >= maxAttempts) {
      return { 
        success: false, 
        remaining: 0, 
        reset: entry.resetTime, 
        limit: maxAttempts 
      };
    }

    entry.count++;
    return { 
      success: true, 
      remaining: maxAttempts - entry.count, 
      reset: entry.resetTime, 
      limit: maxAttempts 
    };
  }

  private cleanup() {
    if (this.attempts.size < this.maxSize) return;
    
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.attempts.delete(key));
  }
}

// Rate limiting configurations
const rateLimitConfigs = {
  auth_signin: {
    requests: 5,
    window: '15 m',
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  auth_signup: {
    requests: 3,
    window: '1 h',
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  api_general: {
    requests: 100,
    window: '1 m',
    windowMs: 60 * 1000, // 1 minute
  },
  password_reset: {
    requests: 3,
    window: '1 h',
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  profile_update: {
    requests: 10,
    window: '5 m',
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
  search: {
    requests: 50,
    window: '1 m',
    windowMs: 60 * 1000, // 1 minute
  },
  booking_create: {
    requests: 5,
    window: '10 m',
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
} as const;

type RateLimitType = keyof typeof rateLimitConfigs;

class EnterpriseRateLimiter {
  private redis?: any;
  private rateLimiters: Map<string, any> = new Map();
  private fallbackLimiter = new InMemoryRateLimit();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await loadUpstash();
      
      if (isUpstashAvailable && hasFeature('redis')) {
        const config = env.getConfig();
        
        this.redis = new Redis({
          url: config.UPSTASH_REDIS_REST_URL!,
          token: config.UPSTASH_REDIS_REST_TOKEN!,
        });

        // Create rate limiters for each type
        for (const [type, config] of Object.entries(rateLimitConfigs)) {
          this.rateLimiters.set(type, new Ratelimit({
            redis: this.redis,
            limiter: Ratelimit.slidingWindow(config.requests, config.window),
            analytics: true,
            prefix: `loconomy_rl_${type}`,
          }));
        }

        console.log('✅ Redis rate limiting initialized');
      } else {
        console.log('⚠️ Using in-memory rate limiting (Redis not available)');
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Rate limiter initialization failed:', error);
      console.log('📝 Falling back to in-memory rate limiting');
      this.isInitialized = true;
    }
  }

  async check(identifier: string, type: RateLimitType) {
    await this.initialize();

    try {
      const config = rateLimitConfigs[type];
      if (!config) {
        throw new Error(`Unknown rate limit type: ${type}`);
      }

      // Use Redis-based rate limiting if available
      if (this.rateLimiters.has(type)) {
        const limiter = this.rateLimiters.get(type);
        const result = await limiter.limit(`${identifier}`);
        
        return {
          success: result.success,
          remaining: result.remaining,
          reset: result.reset,
          limit: result.limit,
        };
      }

      // Fallback to in-memory rate limiting
      const result = this.fallbackLimiter.check(
        `${type}_${identifier}`,
        config.requests,
        config.windowMs
      );

      return result;
    } catch (error) {
      console.error('Rate limiting error:', error);
      
      // Fail open in case of errors
      return {
        success: true,
        remaining: 1,
        reset: Date.now() + 60000,
        limit: 1,
      };
    }
  }

  async getRemainingAttempts(identifier: string, type: RateLimitType) {
    const result = await this.check(identifier, type);
    return result.remaining;
  }

  async isBlocked(identifier: string, type: RateLimitType) {
    const result = await this.check(identifier, type);
    return !result.success;
  }

  async reset(identifier: string, type: RateLimitType) {
    await this.initialize();

    try {
      if (this.rateLimiters.has(type)) {
        const limiter = this.rateLimiters.get(type);
        // Redis-based reset (if supported by library)
        return true;
      }

      // In-memory reset
      this.fallbackLimiter['attempts'].delete(`${type}_${identifier}`);
      return true;
    } catch (error) {
      console.error('Rate limit reset error:', error);
      return false;
    }
  }

  getConfig(type: RateLimitType) {
    return rateLimitConfigs[type];
  }

  isRedisEnabled() {
    return isUpstashAvailable && hasFeature('redis');
  }
}

// Export singleton instance
export const enterpriseRateLimit = new EnterpriseRateLimiter();

// Export convenience functions
export async function checkRateLimit(identifier: string, type: RateLimitType) {
  return enterpriseRateLimit.check(identifier, type);
}

export async function isRateLimited(identifier: string, type: RateLimitType) {
  return enterpriseRateLimit.isBlocked(identifier, type);
}

export async function resetRateLimit(identifier: string, type: RateLimitType) {
  return enterpriseRateLimit.reset(identifier, type);
}

export function getRateLimitConfig(type: RateLimitType) {
  return enterpriseRateLimit.getConfig(type);
}

// Export types
export type { RateLimitType };
export { rateLimitConfigs };
