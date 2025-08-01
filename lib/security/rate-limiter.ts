// Fallback rate limiter for when Redis is not available
class InMemoryRateLimit {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  check(identifier: string, maxAttempts: number, windowMs: number) {
    const now = Date.now();
    const key = identifier;
    const entry = this.attempts.get(key);

    if (!entry || now > entry.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true, remaining: maxAttempts - 1, reset: now + windowMs, limit: maxAttempts };
    }

    if (entry.count >= maxAttempts) {
      return { success: false, remaining: 0, reset: entry.resetTime, limit: maxAttempts };
    }

    entry.count++;
    return { success: true, remaining: maxAttempts - entry.count, reset: entry.resetTime, limit: maxAttempts };
  }
}

const fallbackRateLimit = new InMemoryRateLimit();

// Rate limiting configurations
const rateLimitConfigs = {
  auth_signin: {
    requests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  auth_signup: {
    requests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  api_general: {
    requests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  password_reset: {
    requests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

export const rateLimit = {
  async check(identifier: string, type: keyof typeof rateLimitConfigs) {
    try {
      // For now, use in-memory rate limiting as fallback
      // In production, implement Redis-based rate limiting
      const config = rateLimitConfigs[type];
      if (!config) {
        throw new Error(`Unknown rate limit type: ${type}`);
      }

      const result = fallbackRateLimit.check(identifier, config.requests, config.windowMs);
      
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

  async getRemainingAttempts(identifier: string, type: keyof typeof rateLimitConfigs) {
    const result = await this.check(identifier, type);
    return result.remaining;
  },

  async isBlocked(identifier: string, type: keyof typeof rateLimitConfigs) {
    const result = await this.check(identifier, type);
    return !result.success;
  },
};

export { fallbackRateLimit };
