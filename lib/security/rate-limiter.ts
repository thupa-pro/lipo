interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: Request) => string
}

class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>()

  constructor(private config: RateLimitConfig) {}

  async isAllowed(req: Request): Promise<{ allowed: boolean; resetTime?: number }> {
    const key = this.config.keyGenerator?.(req) || this.getDefaultKey(req)
    const now = Date.now()
    const rateLimitData = this.store.get(key)

    if (!rateLimitData || now > rateLimitData.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      })
      return { allowed: true }
    }

    rateLimitData.count++

    if (rateLimitData.count > this.config.maxRequests) {
      return {
        allowed: false,
        resetTime: rateLimitData.resetTime,
      }
    }

    return { allowed: true }
  }

  private getDefaultKey(req: Request): string {
    const url = new URL(req.url)
    const ip = req.headers.get("x-forwarded-for") || "anonymous"
    return `${ip}:${url.pathname}`
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
})

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
})

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    apiRateLimiter.cleanup()
    authRateLimiter.cleanup()
  },
  5 * 60 * 1000,
)
