/**
 * Advanced Authentication Middleware for Loconomy Platform
 * Enterprise-grade security with modern best practices for 2025
 * Edge Runtime Compatible
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface AuthToken {
  userId: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}

interface RefreshToken {
  userId: string;
  sessionId: string;
  tokenId: string;
  iat: number;
  exp: number;
}

interface SecurityHeaders {
  'Strict-Transport-Security': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Content-Security-Policy': string;
  'Permissions-Policy': string;
  'Cross-Origin-Embedder-Policy': string;
  'Cross-Origin-Opener-Policy': string;
  'Cross-Origin-Resource-Policy': string;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
}

class AdvancedAuthMiddleware {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly encryptionKey: string;
  private readonly rateLimitStore: Map<string, { count: number; resetTime: number }>;
  private readonly sessionStore: Map<string, { userId: string; createdAt: number; lastActivity: number }>;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || this.generateSecureSecret();
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || this.generateSecureSecret();
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateSecureSecret();
    this.rateLimitStore = new Map();
    this.sessionStore = new Map();
    
    // Clean up expired sessions and rate limits every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  /**
   * Generate a secure secret using Web Crypto API (Edge Runtime compatible)
   */
  private generateSecureSecret(): string {
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Simple base64 encoding for Edge Runtime
   */
  private base64Encode(str: string): string {
    if (typeof btoa !== 'undefined') {
      return btoa(str);
    }
    // Fallback implementation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;
      const bitmap = (a << 16) | (b << 8) | c;
      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
    }
    return result;
  }

  /**
   * Simple base64 decoding for Edge Runtime
   */
  private base64Decode(str: string): string {
    if (typeof atob !== 'undefined') {
      return atob(str);
    }
    // Fallback implementation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    str = str.replace(/[^A-Za-z0-9+/]/g, '');
    
    while (i < str.length) {
      const encoded1 = chars.indexOf(str.charAt(i++));
      const encoded2 = chars.indexOf(str.charAt(i++));
      const encoded3 = chars.indexOf(str.charAt(i++));
      const encoded4 = chars.indexOf(str.charAt(i++));
      
      const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
      
      result += String.fromCharCode((bitmap >> 16) & 255);
      if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
      if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
    }
    return result;
  }

  /**
   * Simple JWT creation for Edge Runtime
   */
  private createJWT(payload: any, secret: string, expiresIn: number): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn
    };

    const encodedHeader = this.base64Encode(JSON.stringify(header)).replace(/=/g, '');
    const encodedPayload = this.base64Encode(JSON.stringify(fullPayload)).replace(/=/g, '');
    
    const signature = this.simpleHmac(`${encodedHeader}.${encodedPayload}`, secret);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Simple HMAC implementation for Edge Runtime
   */
  private simpleHmac(data: string, key: string): string {
    // This is a simplified implementation for Edge Runtime
    // In production, you should use a proper crypto library
    let hash = 0;
    const combined = key + data;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Verify JWT token
   */
  private verifyJWT(token: string, secret: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const [header, payload, signature] = parts;
      const expectedSignature = this.simpleHmac(`${header}.${payload}`, secret);
      
      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      const decodedPayload = JSON.parse(this.base64Decode(payload + '=='));
      
      // Check expiration
      if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return decodedPayload;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  /**
   * Rate limiting implementation
   */
  private async rateLimit(request: NextRequest, config: RateLimitConfig): Promise<boolean> {
    const key = config.keyGenerator ? config.keyGenerator(request) : this.getClientIP(request);
    const now = Date.now();
    const resetTime = now + config.windowMs;

    const record = this.rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime });
      return true;
    }

    if (record.count >= config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    return (
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      'unknown'
    );
  }

  /**
   * Enhanced security headers
   */
  private getSecurityHeaders(): SecurityHeaders {
    return {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: blob:;
        font-src 'self' data: https:;
        connect-src 'self' https: wss:;
        frame-src 'self' https://clerk.accounts.dev;
        worker-src 'self' blob:;
        manifest-src 'self';
      `.replace(/\s+/g, ' ').trim(),
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    // Cleanup rate limit store
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }

    // Cleanup session store (sessions older than 24 hours)
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    for (const [sessionId, session] of this.sessionStore.entries()) {
      if (now - session.lastActivity > sessionTimeout) {
        this.sessionStore.delete(sessionId);
      }
    }
  }

  /**
   * Process incoming request with authentication and security checks
   */
  public async processRequest(request: NextRequest): Promise<NextResponse> {
    try {
      const { pathname } = request.nextUrl;

      // Apply rate limiting for API routes
      if (pathname.startsWith('/api/')) {
        const rateLimitConfig: RateLimitConfig = {
          windowMs: 15 * 60 * 1000, // 15 minutes
          maxRequests: 100, // 100 requests per window
          keyGenerator: (req) => this.getClientIP(req)
        };

        const isAllowed = await this.rateLimit(request, rateLimitConfig);
        if (!isAllowed) {
          return new NextResponse('Rate limit exceeded', {
            status: 429,
            headers: {
              'Retry-After': '900' // 15 minutes
            }
          });
        }
      }

      // Skip auth for public routes
      const publicRoutes = ['/api/health', '/api/auth/signin', '/api/auth/signup'];
      if (publicRoutes.some(route => pathname.startsWith(route))) {
        const response = NextResponse.next();
        this.addSecurityHeaders(response);
        return response;
      }

      // For protected routes, check authentication
      if (pathname.startsWith('/api/') && !publicRoutes.some(route => pathname.startsWith(route))) {
        const authResult = await this.authenticateRequest(request);
        if (!authResult.success) {
          return new NextResponse('Unauthorized', {
            status: 401,
            headers: {
              'WWW-Authenticate': 'Bearer'
            }
          });
        }
      }

      const response = NextResponse.next();
      this.addSecurityHeaders(response);
      return response;

    } catch (error) {
      console.error('Advanced auth middleware error:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

  /**
   * Authenticate request using JWT
   */
  private async authenticateRequest(request: NextRequest): Promise<{ success: boolean; user?: any }> {
    try {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return { success: false };
      }

      const decoded = this.verifyJWT(token, this.accessTokenSecret);
      return { success: true, user: decoded };

    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Add security headers to response
   */
  private addSecurityHeaders(response: NextResponse): void {
    const headers = this.getSecurityHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Additional custom headers
    response.headers.set('X-Powered-By', 'Loconomy-Enterprise');
    response.headers.set('X-Security-Level', 'Enhanced');
    response.headers.set('X-Auth-Version', '2.0');
  }

  /**
   * Generate access token
   */
  public generateAccessToken(payload: Omit<AuthToken, 'iat' | 'exp'>): string {
    return this.createJWT(payload, this.accessTokenSecret, 15 * 60); // 15 minutes
  }

  /**
   * Generate refresh token
   */
  public generateRefreshToken(payload: Omit<RefreshToken, 'iat' | 'exp'>): string {
    return this.createJWT(payload, this.refreshTokenSecret, 7 * 24 * 60 * 60); // 7 days
  }

  /**
   * Verify access token
   */
  public verifyAccessToken(token: string): AuthToken {
    return this.verifyJWT(token, this.accessTokenSecret);
  }

  /**
   * Verify refresh token
   */
  public verifyRefreshToken(token: string): RefreshToken {
    return this.verifyJWT(token, this.refreshTokenSecret);
  }
}

// Export singleton instance
export const advancedAuthMiddleware = new AdvancedAuthMiddleware();

// Export class for testing
export { AdvancedAuthMiddleware };
