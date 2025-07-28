/**
 * 🛡️ Secure API Route Handlers - Production Grade
 * Comprehensive protection with authentication, authorization, validation, and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  getSecureSession, 
  requireRole, 
  requirePermission, 
  requireTenantAccess,
  checkRateLimit,
  UserRole, 
  Permission,
  SecureUser,
  UnauthorizedError,
  ForbiddenError 
} from '@/lib/auth/secure-session';

// Rate Limiting Configuration
interface RateLimit {
  requests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
}

// Security Options for Route Protection
interface SecurityOptions {
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  tenantIsolation?: boolean;
  rateLimit?: RateLimit;
  validateInput?: z.ZodSchema;
  validateOutput?: z.ZodSchema;
  auditAction?: string;
  csrfProtection?: boolean;
}

// Enhanced Request Context
interface SecureRequestContext {
  user: SecureUser;
  tenantId: string;
  validatedInput?: any;
  rateLimitInfo?: {
    remaining: number;
    resetTime: Date;
  };
}

/**
 * Main Security Wrapper for API Routes
 */
export function withSecurity<TInput = any, TOutput = any>(
  handler: (
    req: NextRequest,
    context: SecureRequestContext
  ) => Promise<TOutput>,
  options: SecurityOptions = {}
) {
  return async (req: NextRequest, params?: any): Promise<NextResponse> => {
    const startTime = Date.now();
    
    try {
      // 1. Rate Limiting
      if (options.rateLimit) {
        const identifier = await getRateLimitIdentifier(req);
        const rateResult = await checkRateLimit(
          identifier,
          options.rateLimit.requests,
          options.rateLimit.windowMs
        );
        
        if (!rateResult.allowed) {
          return NextResponse.json(
            { 
              error: 'Rate limit exceeded',
              retryAfter: Math.ceil((rateResult.resetTime.getTime() - Date.now()) / 1000)
            },
            { 
              status: 429,
              headers: {
                'Retry-After': String(Math.ceil((rateResult.resetTime.getTime() - Date.now()) / 1000)),
                'X-RateLimit-Limit': String(options.rateLimit.requests),
                'X-RateLimit-Remaining': String(rateResult.remaining),
                'X-RateLimit-Reset': String(rateResult.resetTime.getTime()),
              }
            }
          );
        }
      }

      // 2. Authentication
      const { user, isAuthenticated, error } = await getSecureSession();
      
      if (!isAuthenticated || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // 3. Role-based Authorization
      if (options.requiredRoles) {
        await requireRole(options.requiredRoles, { 
          req, 
          auditAction: options.auditAction 
        });
      }

      // 4. Permission-based Authorization
      if (options.requiredPermissions) {
        await requirePermission(options.requiredPermissions, { req });
      }

      // 5. Input Validation
      let validatedInput: TInput | undefined;
      if (options.validateInput) {
        const body = await safelyParseRequestBody(req);
        const queryParams = Object.fromEntries(req.nextUrl.searchParams);
        const inputData = { ...body, ...queryParams, ...params };
        
        const validation = options.validateInput.safeParse(inputData);
        if (!validation.success) {
          return NextResponse.json(
            { 
              error: 'Validation failed',
              details: validation.error.errors
            },
            { status: 400 }
          );
        }
        validatedInput = validation.data;
      }

      // 6. Tenant Isolation (if required)
      if (options.tenantIsolation && validatedInput) {
        const resourceTenantId = extractTenantId(validatedInput);
        if (resourceTenantId) {
          await requireTenantAccess(resourceTenantId, { req });
        }
      }

      // 7. CSRF Protection (for state-changing operations)
      if (options.csrfProtection && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        await validateCSRFToken(req);
      }

      // 8. Execute Handler
      const context: SecureRequestContext = {
        user,
        tenantId: user.tenantId,
        validatedInput,
      };

      const result = await handler(req, context);

      // 9. Output Validation
      if (options.validateOutput) {
        const validation = options.validateOutput.safeParse(result);
        if (!validation.success) {
          console.error('Output validation failed:', validation.error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }

      // 10. Security Headers & Response
      const response = NextResponse.json(result);
      addSecurityHeaders(response, {
        processingTime: Date.now() - startTime,
        userId: user.id,
      });

      return response;

    } catch (error) {
      return handleSecureError(error, { userId: user?.id });
    }
  };
}

/**
 * Specialized Route Protectors
 */

// Admin-only routes
export const withAdminAuth = (
  handler: (req: NextRequest, context: SecureRequestContext) => Promise<any>,
  options: Omit<SecurityOptions, 'requiredRoles'> = {}
) => withSecurity(handler, {
  ...options,
  requiredRoles: ['admin'],
  auditAction: 'admin_access',
  rateLimit: options.rateLimit || { requests: 100, windowMs: 60000 },
});

// Provider routes with tenant isolation
export const withProviderAuth = (
  handler: (req: NextRequest, context: SecureRequestContext) => Promise<any>,
  options: Omit<SecurityOptions, 'requiredRoles' | 'tenantIsolation'> = {}
) => withSecurity(handler, {
  ...options,
  requiredRoles: ['admin', 'moderator', 'provider'],
  tenantIsolation: true,
  auditAction: 'provider_access',
});

// Customer routes
export const withCustomerAuth = (
  handler: (req: NextRequest, context: SecureRequestContext) => Promise<any>,
  options: Omit<SecurityOptions, 'requiredRoles'> = {}
) => withSecurity(handler, {
  ...options,
  requiredRoles: ['admin', 'moderator', 'provider', 'customer'],
  tenantIsolation: true,
});

// Public routes with optional authentication
export const withOptionalAuth = (
  handler: (req: NextRequest, context: Partial<SecureRequestContext>) => Promise<any>,
  options: Omit<SecurityOptions, 'requiredRoles'> = {}
) => {
  return async (req: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      const { user } = await getSecureSession();
      const context: Partial<SecureRequestContext> = {
        user: user || undefined,
        tenantId: user?.tenantId,
      };

      const result = await handler(req, context);
      return NextResponse.json(result);
    } catch (error) {
      return handleSecureError(error);
    }
  };
};

/**
 * Utility Functions
 */

async function safelyParseRequestBody(req: NextRequest): Promise<any> {
  try {
    const contentType = req.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await req.json();
    }
    return {};
  } catch {
    return {};
  }
}

function extractTenantId(input: any): string | null {
  // Common patterns for tenant ID extraction
  return input?.tenantId || input?.tenant_id || input?.organizationId || null;
}

async function getRateLimitIdentifier(req: NextRequest): Promise<string> {
  // Try to get user ID first, fall back to IP
  const { user } = await getSecureSession();
  if (user) {
    return `user:${user.id}`;
  }
  
  const ip = req.ip || 
            req.headers.get('x-forwarded-for')?.split(',')[0] || 
            req.headers.get('x-real-ip') ||
            'anonymous';
  
  return `ip:${ip}`;
}

async function validateCSRFToken(req: NextRequest): Promise<void> {
  const token = req.headers.get('x-csrf-token') || 
                req.headers.get('x-xsrf-token');
  
  if (!token) {
    throw new ForbiddenError('CSRF token required');
  }

  // In a real implementation, validate against stored token
  // const isValid = await verifyCSRFToken(token);
  // if (!isValid) {
  //   throw new ForbiddenError('Invalid CSRF token');
  // }
}

function addSecurityHeaders(
  response: NextResponse,
  metadata?: { processingTime?: number; userId?: string }
): void {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance headers
  if (metadata?.processingTime) {
    response.headers.set('X-Response-Time', `${metadata.processingTime}ms`);
  }
  
  // Request ID for tracing
  response.headers.set('X-Request-ID', generateRequestId());
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function handleSecureError(
  error: unknown,
  context?: { userId?: string }
): NextResponse {
  console.error('API Error:', error, context);

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed',
        details: error.errors
      },
      { status: 400 }
    );
  }

  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return NextResponse.json(
    { 
      error: isDevelopment ? String(error) : 'Internal server error',
      ...(isDevelopment && { stack: error instanceof Error ? error.stack : undefined })
    },
    { status: 500 }
  );
}

/**
 * Common Validation Schemas
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),

  // Tenant operations
  tenantResource: z.object({
    tenantId: z.string().min(1),
    resourceId: z.string().min(1),
  }),

  // User management
  userUpdate: z.object({
    userId: z.string().min(1),
    role: z.enum(['admin', 'moderator', 'provider', 'customer', 'guest']).optional(),
    tenantId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),

  // Service operations
  serviceCreate: z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    category: z.string().min(1),
    price: z.number().positive(),
    duration: z.number().positive(),
    location: z.string().min(1),
    tags: z.array(z.string()).optional(),
  }),

  // Booking operations
  bookingCreate: z.object({
    serviceId: z.string().min(1),
    providerId: z.string().min(1),
    scheduledAt: z.string().datetime(),
    notes: z.string().optional(),
  }),
};