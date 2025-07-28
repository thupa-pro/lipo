/**
 * Advanced Authentication Middleware for Loconomy Platform
 * Enterprise-grade security with modern best practices for 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

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
  private readonly csrfSecret: string;
  private readonly accessTokenExpiry: string = '15m'; // Short-lived access tokens
  private readonly refreshTokenExpiry: string = '7d'; // Longer-lived refresh tokens
  private readonly rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || this.generateSecureSecret();
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || this.generateSecureSecret();
    this.csrfSecret = process.env.CSRF_SECRET || this.generateSecureSecret();
    
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.warn('JWT secrets not found in environment variables. Using generated secrets (not recommended for production).');
    }
  }

  /**
   * Main middleware function
   */
  async processRequest(request: NextRequest): Promise<NextResponse> {
    try {
      // Apply security headers
      const response = NextResponse.next();
      this.applySecurityHeaders(response);

      // Rate limiting
      const rateLimitResult = await this.checkRateLimit(request);
      if (!rateLimitResult.allowed) {
        return this.createErrorResponse('Too Many Requests', 429, {
          'Retry-After': Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime!).toISOString()
        });
      }

      // Skip auth for public routes
      if (this.isPublicRoute(request.nextUrl.pathname)) {
        return response;
      }

      // CSRF protection for non-GET requests
      if (request.method !== 'GET') {
        const csrfValid = await this.validateCSRFToken(request);
        if (!csrfValid) {
          return this.createErrorResponse('CSRF token validation failed', 403);
        }
      }

      // Token validation and refresh
      const authResult = await this.validateAndRefreshTokens(request);
      
      if (!authResult.success) {
        return this.createErrorResponse(authResult.error || 'Authentication required', 401);
      }

      // Attach user info to request headers for downstream consumption
      if (authResult.user) {
        response.headers.set('X-User-ID', authResult.user.userId);
        response.headers.set('X-User-Role', authResult.user.role);
        response.headers.set('X-Session-ID', authResult.user.sessionId);
      }

      // Set new tokens if refreshed
      if (authResult.newTokens) {
        this.setAuthCookies(response, authResult.newTokens);
      }

      return response;
    } catch (error) {
      console.error('Auth middleware error:', error);
      return this.createErrorResponse('Internal authentication error', 500);
    }
  }

  /**
   * Generate secure random secret
   */
  private generateSecureSecret(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Apply comprehensive security headers
   */
  private applySecurityHeaders(response: NextResponse): void {
    const securityHeaders: SecurityHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': this.generateCSP(),
      'Permissions-Policy': this.generatePermissionsPolicy(),
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  /**
   * Generate Content Security Policy
   */
  private generateCSP(): string {
    const nonce = randomBytes(16).toString('base64');
    return [
      `default-src 'self'`,
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `img-src 'self' data: https:`,
      `font-src 'self' https://fonts.gstatic.com`,
      `connect-src 'self' https://api.stripe.com https://api.clerk.com`,
      `frame-src 'none'`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `upgrade-insecure-requests`
    ].join('; ');
  }

  /**
   * Generate Permissions Policy
   */
  private generatePermissionsPolicy(): string {
    return [
      'accelerometer=()',
      'camera=()',
      'geolocation=(self)',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=(self)',
      'usb=()'
    ].join(', ');
  }

  /**
   * Advanced rate limiting with multiple strategies
   */
  private async checkRateLimit(request: NextRequest): Promise<{ allowed: boolean; resetTime?: number }> {
    const configs: RateLimitConfig[] = [
      // Global rate limit
      {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
        keyGenerator: (req) => this.getClientIP(req)
      },
      // Auth endpoint rate limit
      {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        keyGenerator: (req) => `auth:${this.getClientIP(req)}:${req.nextUrl.pathname}`
      }
    ];

    for (const config of configs) {
      if (request.nextUrl.pathname.startsWith('/api/auth') || config.maxRequests === 100) {
        const key = config.keyGenerator ? config.keyGenerator(request) : this.getClientIP(request);
        const now = Date.now();
        const rateLimitData = this.rateLimitStore.get(key);

        if (!rateLimitData || now > rateLimitData.resetTime) {
          this.rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
          });
          continue;
        }

        rateLimitData.count++;

        if (rateLimitData.count > config.maxRequests) {
          return {
            allowed: false,
            resetTime: rateLimitData.resetTime,
          };
        }
      }
    }

    return { allowed: true };
  }

  /**
   * Validate and refresh JWT tokens
   */
  private async validateAndRefreshTokens(request: NextRequest): Promise<{
    success: boolean;
    user?: AuthToken;
    newTokens?: { accessToken: string; refreshToken: string };
    error?: string;
  }> {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
      return { success: false, error: 'No authentication tokens provided' };
    }

    // Try to validate access token
    if (accessToken) {
      try {
        const decoded = verify(accessToken, this.accessTokenSecret) as AuthToken;
        return { success: true, user: decoded };
      } catch (error) {
        // Access token invalid or expired, try refresh token
      }
    }

    // Try to refresh using refresh token
    if (refreshToken) {
      try {
        const decoded = verify(refreshToken, this.refreshTokenSecret) as RefreshToken;
        
        // Generate new tokens
        const newAccessToken = this.generateAccessToken({
          userId: decoded.userId,
          role: 'user', // You would fetch this from your database
          sessionId: decoded.sessionId
        });

        const newRefreshToken = this.generateRefreshToken({
          userId: decoded.userId,
          sessionId: decoded.sessionId,
          tokenId: randomBytes(16).toString('hex')
        });

        return {
          success: true,
          user: verify(newAccessToken, this.accessTokenSecret) as AuthToken,
          newTokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }
        };
      } catch (error) {
        return { success: false, error: 'Invalid refresh token' };
      }
    }

    return { success: false, error: 'Token validation failed' };
  }

  /**
   * Generate access token
   */
  private generateAccessToken(payload: { userId: string; role: string; sessionId: string }): string {
    return sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'loconomy',
      audience: 'loconomy-api'
    });
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(payload: { userId: string; sessionId: string; tokenId: string }): string {
    return sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'loconomy',
      audience: 'loconomy-refresh'
    });
  }

  /**
   * Validate CSRF token
   */
  private async validateCSRFToken(request: NextRequest): Promise<boolean> {
    const csrfHeader = request.headers.get('X-CSRF-Token');
    const csrfCookie = request.cookies.get('csrfToken')?.value;

    if (!csrfHeader || !csrfCookie) {
      return false;
    }

    try {
      const expectedToken = createHash('sha256')
        .update(`${csrfCookie}:${this.csrfSecret}`)
        .digest('hex');

      return timingSafeEqual(
        Buffer.from(csrfHeader),
        Buffer.from(expectedToken)
      );
    } catch {
      return false;
    }
  }

  /**
   * Set authentication cookies with secure options
   */
  private setAuthCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }): void {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access token cookie (shorter lived)
    response.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    // Refresh token cookie (longer lived)
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/api/auth/refresh'
    });

    // CSRF token
    const csrfToken = randomBytes(32).toString('hex');
    response.cookies.set('csrfToken', csrfToken, {
      httpOnly: false, // Needs to be accessible to client for headers
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
  }

  /**
   * Check if route is public
   */
  private isPublicRoute(pathname: string): boolean {
    const publicRoutes = [
      '/',
      '/auth/signin',
      '/auth/signup',
      '/auth/oauth-callback',
      '/search',
      '/services',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/api/health',
      '/api/search',
      '/api/webhooks'
    ];

    return publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for') ||
           request.headers.get('x-real-ip') ||
           request.ip ||
           'unknown';
  }

  /**
   * Create error response with proper headers
   */
  private createErrorResponse(message: string, status: number, extraHeaders?: Record<string, string>): NextResponse {
    const response = NextResponse.json({ error: message }, { status });
    
    // Apply security headers even to error responses
    this.applySecurityHeaders(response);
    
    if (extraHeaders) {
      Object.entries(extraHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    return response;
  }

  /**
   * Cleanup expired rate limit entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.rateLimitStore.entries()) {
      if (now > data.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }
}

// Export singleton instance
export const advancedAuthMiddleware = new AdvancedAuthMiddleware();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  advancedAuthMiddleware.cleanup();
}, 5 * 60 * 1000);