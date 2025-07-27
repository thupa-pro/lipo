import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting configurations
const rateLimitConfigs = {
  auth_signin: {
    requests: 5,
    window: '15 m', // 15 minutes
  },
  auth_signup: {
    requests: 3,
    window: '1 h', // 1 hour
  },
  api_general: {
    requests: 100,
    window: '1 m', // 1 minute
  },
  password_reset: {
    requests: 3,
    window: '1 h', // 1 hour
  },
};

// Create rate limiters
const rateLimiters = {
  auth_signin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      rateLimitConfigs.auth_signin.requests,
      rateLimitConfigs.auth_signin.window
    ),
    analytics: true,
  }),
  auth_signup: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      rateLimitConfigs.auth_signup.requests,
      rateLimitConfigs.auth_signup.window
    ),
    analytics: true,
  }),
  api_general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      rateLimitConfigs.api_general.requests,
      rateLimitConfigs.api_general.window
    ),
    analytics: true,
  }),
  password_reset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      rateLimitConfigs.password_reset.requests,
      rateLimitConfigs.password_reset.window
    ),
    analytics: true,
  }),
};

export const rateLimit = {
  async check(identifier: string, type: keyof typeof rateLimiters) {
    try {
      const limiter = rateLimiters[type];
      if (!limiter) {
        throw new Error(`Unknown rate limit type: ${type}`);
      }

      const result = await limiter.limit(`${type}_${identifier}`);
      
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
        limit: result.limit,
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open in case of rate limiter issues
      return {
        success: true,
        remaining: 1,
        reset: Date.now() + 60000,
        limit: 1,
      };
    }
  },

  async getRemainingAttempts(identifier: string, type: keyof typeof rateLimiters) {
    const result = await this.check(identifier, type);
    return result.remaining;
  },

  async isBlocked(identifier: string, type: keyof typeof rateLimiters) {
    const result = await this.check(identifier, type);
    return !result.success;
  },
};

// Fallback rate limiter for when Redis is not available
class InMemoryRateLimit {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  check(identifier: string, maxAttempts: number, windowMs: number) {
    const now = Date.now();
    const key = identifier;
    const entry = this.attempts.get(key);

    if (!entry || now > entry.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true, remaining: maxAttempts - 1 };
    }

    if (entry.count >= maxAttempts) {
      return { success: false, remaining: 0 };
    }

    entry.count++;
    return { success: true, remaining: maxAttempts - entry.count };
  }
}

export const fallbackRateLimit = new InMemoryRateLimit();
