/**
 * Advanced API Gateway for Loconomy Platform
 * Enterprise-grade API management with comprehensive security and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash, randomUUID } from 'crypto';
import { URL } from 'url';

// Types
interface ApiEndpoint {
  path: string;
  method: string;
  schema?: z.ZodSchema;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  requiresAuth?: boolean;
  roles?: string[];
  timeout?: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  nextAttempt: number;
}

interface RequestMetrics {
  requestId: string;
  startTime: number;
  endTime?: number;
  method: string;
  path: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip: string;
  userId?: string;
  error?: string;
}

interface ApiHealthCheck {
  endpoint: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: number;
  responseTime: number;
  errorCount: number;
}

class AdvancedApiGateway {
  private readonly circuitBreakers = new Map<string, CircuitBreakerState>();
  private readonly requestMetrics: RequestMetrics[] = [];
  private readonly healthChecks = new Map<string, ApiHealthCheck>();
  private readonly apiEndpoints: ApiEndpoint[] = [];

  // Circuit breaker configuration
  private readonly failureThreshold = 5;
  private readonly recoveryTimeMs = 60000; // 1 minute
  private readonly halfOpenMaxRequests = 3;

  // Metrics configuration
  private readonly maxMetricsRetention = 10000; // Keep last 10k requests
  private readonly metricsRetentionMs = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.initializeApiEndpoints();
    this.startHealthCheckScheduler();
    this.startMetricsCleanup();
  }

  /**
   * Main gateway processing function
   */
  async processRequest(request: NextRequest): Promise<NextResponse> {
    const requestId = randomUUID();
    const startTime = Date.now();
    
    try {
      // Add request tracing
      const traceHeaders = this.addRequestTracing(request, requestId);
      
      // Validate request format
      const validationResult = await this.validateRequest(request);
      if (!validationResult.valid) {
        return this.createErrorResponse(validationResult.error!, 400, requestId);
      }

      // Check circuit breaker
      const circuitBreakerResult = this.checkCircuitBreaker(request.nextUrl.pathname);
      if (!circuitBreakerResult.allowed) {
        return this.createErrorResponse('Service temporarily unavailable', 503, requestId);
      }

      // Apply API gateway logic
      const response = await this.routeRequest(request, requestId);
      
      // Record metrics
      this.recordRequestMetrics(request, response, requestId, startTime);
      
      // Update circuit breaker on success
      this.recordCircuitBreakerSuccess(request.nextUrl.pathname);
      
      // Add response headers
      this.addResponseHeaders(response, requestId, traceHeaders);
      
      return response;
    } catch (error) {
      console.error(`API Gateway error [${requestId}]:`, error);
      
      // Record failure metrics
      this.recordRequestMetrics(request, null, requestId, startTime, error as Error);
      
      // Update circuit breaker on failure
      this.recordCircuitBreakerFailure(request.nextUrl.pathname);
      
      return this.createErrorResponse('Gateway error', 500, requestId);
    }
  }

  /**
   * Initialize API endpoint configurations
   */
  private initializeApiEndpoints(): void {
    this.apiEndpoints.push(
      // Authentication endpoints
      {
        path: '/api/auth/signin',
        method: 'POST',
        schema: z.object({
          email: z.string().email(),
          password: z.string().min(8),
          rememberMe: z.boolean().optional()
        }),
        rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
        requiresAuth: false,
        timeout: 10000
      },
      {
        path: '/api/auth/signup',
        method: 'POST',
        schema: z.object({
          email: z.string().email(),
          password: z.string().min(8),
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          role: z.enum(['customer', 'provider']).optional()
        }),
        rateLimit: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
        requiresAuth: false,
        timeout: 15000
      },
      
      // User management endpoints
      {
        path: '/api/user/profile',
        method: 'GET',
        requiresAuth: true,
        timeout: 5000
      },
      {
        path: '/api/user/profile',
        method: 'PUT',
        schema: z.object({
          firstName: z.string().min(1).optional(),
          lastName: z.string().min(1).optional(),
          phone: z.string().optional(),
          avatar: z.string().url().optional()
        }),
        requiresAuth: true,
        timeout: 10000
      },
      
      // Booking endpoints
      {
        path: '/api/bookings',
        method: 'POST',
        schema: z.object({
          serviceId: z.string().uuid(),
          providerId: z.string().uuid(),
          scheduledFor: z.string().datetime(),
          notes: z.string().optional(),
          budget: z.number().min(0)
        }),
        requiresAuth: true,
        roles: ['customer'],
        timeout: 15000
      },
      
      // Admin endpoints
      {
        path: '/api/admin/users',
        method: 'GET',
        requiresAuth: true,
        roles: ['admin', 'super_admin'],
        timeout: 10000
      },
      
      // Public endpoints
      {
        path: '/api/search/services',
        method: 'GET',
        rateLimit: { windowMs: 60 * 1000, maxRequests: 60 },
        requiresAuth: false,
        timeout: 5000
      }
    );
  }

  /**
   * Validate incoming request against schema
   */
  private async validateRequest(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
    const endpoint = this.findEndpoint(request.nextUrl.pathname, request.method);
    
    if (!endpoint) {
      return { valid: false, error: 'Endpoint not found' };
    }

    // Validate content type for requests with body
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { valid: false, error: 'Content-Type must be application/json' };
      }
    }

    // Validate request body against schema
    if (endpoint.schema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const body = await request.json();
        endpoint.schema.parse(body);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
          return { valid: false, error: `Validation error: ${errorMessage}` };
        }
        return { valid: false, error: 'Invalid request body' };
      }
    }

    return { valid: true };
  }

  /**
   * Route request to appropriate handler
   */
  private async routeRequest(request: NextRequest, requestId: string): Promise<NextResponse> {
    const endpoint = this.findEndpoint(request.nextUrl.pathname, request.method);
    
    if (!endpoint) {
      return this.createErrorResponse('Endpoint not found', 404, requestId);
    }

    // Apply timeout
    const timeoutPromise = new Promise<NextResponse>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), endpoint.timeout || 30000);
    });

    // Create request with timeout
    const requestPromise = this.executeRequest(request, endpoint, requestId);
    
    try {
      return await Promise.race([requestPromise, timeoutPromise]);
    } catch (error) {
      if (error instanceof Error && error.message === 'Request timeout') {
        return this.createErrorResponse('Request timeout', 408, requestId);
      }
      throw error;
    }
  }

  /**
   * Execute the actual request
   */
  private async executeRequest(request: NextRequest, endpoint: ApiEndpoint, requestId: string): Promise<NextResponse> {
    // For this implementation, we'll pass through to Next.js
    // In a real API gateway, you might proxy to different services
    
    // Add gateway headers
    const modifiedRequest = new NextRequest(request, {
      headers: {
        ...request.headers,
        'X-Gateway-Request-ID': requestId,
        'X-Gateway-Timestamp': Date.now().toString(),
        'X-Gateway-Version': '1.0'
      }
    });

    // Pass through to Next.js handler
    return NextResponse.next();
  }

  /**
   * Circuit breaker implementation
   */
  private checkCircuitBreaker(path: string): { allowed: boolean; reason?: string } {
    const key = this.getCircuitBreakerKey(path);
    const state = this.circuitBreakers.get(key);
    
    if (!state) {
      // Initialize circuit breaker
      this.circuitBreakers.set(key, {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED',
        nextAttempt: 0
      });
      return { allowed: true };
    }

    const now = Date.now();

    switch (state.state) {
      case 'CLOSED':
        return { allowed: true };
        
      case 'OPEN':
        if (now >= state.nextAttempt) {
          // Try half-open
          state.state = 'HALF_OPEN';
          return { allowed: true };
        }
        return { allowed: false, reason: 'Circuit breaker OPEN' };
        
      case 'HALF_OPEN':
        return { allowed: true };
        
      default:
        return { allowed: true };
    }
  }

  /**
   * Record circuit breaker success
   */
  private recordCircuitBreakerSuccess(path: string): void {
    const key = this.getCircuitBreakerKey(path);
    const state = this.circuitBreakers.get(key);
    
    if (state) {
      if (state.state === 'HALF_OPEN') {
        // Reset to closed
        state.state = 'CLOSED';
        state.failures = 0;
      }
    }
  }

  /**
   * Record circuit breaker failure
   */
  private recordCircuitBreakerFailure(path: string): void {
    const key = this.getCircuitBreakerKey(path);
    const state = this.circuitBreakers.get(key) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'CLOSED' as const,
      nextAttempt: 0
    };

    state.failures++;
    state.lastFailureTime = Date.now();

    if (state.failures >= this.failureThreshold) {
      state.state = 'OPEN';
      state.nextAttempt = Date.now() + this.recoveryTimeMs;
    }

    this.circuitBreakers.set(key, state);
  }

  /**
   * Add request tracing headers
   */
  private addRequestTracing(request: NextRequest, requestId: string): Record<string, string> {
    const traceId = request.headers.get('X-Trace-ID') || randomUUID();
    const spanId = randomUUID();
    
    return {
      'X-Trace-ID': traceId,
      'X-Span-ID': spanId,
      'X-Request-ID': requestId,
      'X-Gateway-Timestamp': Date.now().toString()
    };
  }

  /**
   * Add response headers
   */
  private addResponseHeaders(response: NextResponse, requestId: string, traceHeaders: Record<string, string>): void {
    Object.entries(traceHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    response.headers.set('X-Gateway-Response-Time', Date.now().toString());
    response.headers.set('X-Gateway-Version', '1.0');
  }

  /**
   * Record request metrics
   */
  private recordRequestMetrics(
    request: NextRequest,
    response: NextResponse | null,
    requestId: string,
    startTime: number,
    error?: Error
  ): void {
    const endTime = Date.now();
    const metrics: RequestMetrics = {
      requestId,
      startTime,
      endTime,
      method: request.method,
      path: request.nextUrl.pathname,
      statusCode: response?.status,
      responseTime: endTime - startTime,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: this.getClientIP(request),
      userId: request.headers.get('X-User-ID') || undefined,
      error: error?.message
    };

    this.requestMetrics.push(metrics);
    
    // Keep only recent metrics
    if (this.requestMetrics.length > this.maxMetricsRetention) {
      this.requestMetrics.splice(0, this.requestMetrics.length - this.maxMetricsRetention);
    }
  }

  /**
   * Health check scheduler
   */
  private startHealthCheckScheduler(): void {
    setInterval(() => {
      this.performHealthChecks();
    }, 30000); // Every 30 seconds
  }

  /**
   * Perform health checks on endpoints
   */
  private async performHealthChecks(): Promise<void> {
    const criticalEndpoints = [
      '/api/health',
      '/api/auth/signin',
      '/api/search/services'
    ];

    for (const endpoint of criticalEndpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`, {
          method: 'GET',
          timeout: 5000
        });
        
        const responseTime = Date.now() - startTime;
        const healthCheck: ApiHealthCheck = {
          endpoint,
          status: response.ok ? 'healthy' : 'unhealthy',
          lastCheck: Date.now(),
          responseTime,
          errorCount: response.ok ? 0 : 1
        };

        this.healthChecks.set(endpoint, healthCheck);
      } catch (error) {
        const healthCheck: ApiHealthCheck = {
          endpoint,
          status: 'unhealthy',
          lastCheck: Date.now(),
          responseTime: 0,
          errorCount: 1
        };

        this.healthChecks.set(endpoint, healthCheck);
      }
    }
  }

  /**
   * Metrics cleanup scheduler
   */
  private startMetricsCleanup(): void {
    setInterval(() => {
      const cutoff = Date.now() - this.metricsRetentionMs;
      const validMetrics = this.requestMetrics.filter(m => m.startTime > cutoff);
      this.requestMetrics.length = 0;
      this.requestMetrics.push(...validMetrics);
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Find endpoint configuration
   */
  private findEndpoint(path: string, method: string): ApiEndpoint | undefined {
    return this.apiEndpoints.find(endpoint => 
      endpoint.path === path && endpoint.method === method
    );
  }

  /**
   * Get circuit breaker key
   */
  private getCircuitBreakerKey(path: string): string {
    return createHash('md5').update(path).digest('hex');
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
   * Create standardized error response
   */
  private createErrorResponse(message: string, status: number, requestId: string): NextResponse {
    return NextResponse.json(
      {
        error: message,
        requestId,
        timestamp: new Date().toISOString(),
        status
      },
      { status }
    );
  }

  /**
   * Get API metrics
   */
  getMetrics(): {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    requestsPerMinute: number;
    topEndpoints: Array<{ path: string; count: number }>;
    healthChecks: Array<ApiHealthCheck>;
  } {
    const totalRequests = this.requestMetrics.length;
    const recentRequests = this.requestMetrics.filter(m => 
      m.startTime > Date.now() - 60000 // Last minute
    );

    const averageResponseTime = this.requestMetrics.reduce((sum, m) => 
      sum + (m.responseTime || 0), 0
    ) / totalRequests || 0;

    const errors = this.requestMetrics.filter(m => 
      m.statusCode && m.statusCode >= 400
    ).length;
    const errorRate = errors / totalRequests || 0;

    const pathCounts = this.requestMetrics.reduce((acc, m) => {
      acc[m.path] = (acc[m.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEndpoints = Object.entries(pathCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    return {
      totalRequests,
      averageResponseTime,
      errorRate,
      requestsPerMinute: recentRequests.length,
      topEndpoints,
      healthChecks: Array.from(this.healthChecks.values())
    };
  }
}

// Export singleton instance
export const apiGateway = new AdvancedApiGateway();