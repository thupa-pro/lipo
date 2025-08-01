/**
 * 🛡️ Enhanced Security Middleware - Production Grade
 * Comprehensive protection with authentication, authorization, and security hardening
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { EnterpriseAuthService } from '@/lib/auth/enterprise-auth';
import { logSecurityEvent, SecurityEventTypes } from '@/lib/security/enterprise-audit-logger';
import { checkRateLimit } from '@/lib/security/enterprise-rate-limiter';
import { env, hasFeature } from '@/lib/config/environment';
import { advancedAuthMiddleware } from '@/lib/security/advanced-auth-middleware';
=======
import { checkRateLimit } from '@/lib/auth/secure-session';
>>>>>>> origin/main

// Route Matchers for Different Protection Levels
const isPublicRoute = createRouteMatcher([
  '/',
<<<<<<< HEAD
=======
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public(.*)',
  '/services',
  '/providers',
>>>>>>> origin/main
  '/about',
  '/contact',
  '/privacy',
  '/terms',
<<<<<<< HEAD
  '/pricing',
  '/search',
  '/browse',
  '/services',
  '/auth/signin',
  '/auth/signup',
  '/auth/oauth-callback',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/landing',
  '/help',
  '/how-it-works',
  '/safety',
  '/success-stories',
  '/careers',
  '/press',
  '/investors',
  '/partnerships',
];

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/provider',
  '/customer',
  '/messages',
  '/settings',
  '/onboarding',
  '/profile',
  '/bookings',
  '/my-bookings',
  '/notifications',
  '/billing',
  '/subscription',
  '/referrals',
  '/analytics',
];

// Admin-only routes
const adminRoutes = [
  '/admin',
];

// Provider-only routes
const providerRoutes = [
  '/provider',
];

// High-sensitivity routes requiring enhanced security
const sensitiveRoutes = [
  '/admin',
  '/billing',
  '/settings/security',
  '/api/admin',
  '/api/billing',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();

  // Skip middleware for static files and certain API routes
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Security monitoring - detect potential attacks
  try {
    await detectSecurityThreats(request);
  } catch (securityError) {
    console.warn('Security threat detection failed:', securityError);
    // Continue without threat detection if it fails
  }

  // Rate limiting for sensitive endpoints
  if (isSensitiveRoute(pathname)) {
    try {
      const rateLimitResult = await checkRateLimit(getClientIP(request), 'api_general');
      if (!rateLimitResult.success) {
        try {
          await logSecurityEvent({
            type: SecurityEventTypes.RATE_LIMIT_EXCEEDED,
            ip: getClientIP(request),
            severity: 'high',
            details: {
              path: pathname,
              userAgent: request.headers.get('user-agent'),
            },
          });
        } catch (logError) {
          console.warn('Failed to log rate limit event:', logError);
        }

        return new NextResponse('Rate limit exceeded', {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        });
      }
    } catch (rateLimitError) {
      console.warn('Rate limiting failed, allowing request:', rateLimitError);
      // Continue without rate limiting if it fails
    }
  }

  // Handle internationalization
  const localeResult = handleInternationalization(request);
  if (localeResult) {
    return localeResult;
  }

  // Extract locale and path
  const { locale, pathWithoutLocale } = extractLocaleAndPath(pathname);

  // Authentication and authorization
  const authResult = await handleAuthentication(request, pathWithoutLocale, locale);
  if (authResult) {
    return authResult;
  }

  // Handle auth routes for authenticated users
  if (isAuthRoute(pathWithoutLocale)) {
    const redirectResult = await handleAuthRouteRedirect(pathWithoutLocale, locale, request);
    if (redirectResult) {
      return redirectResult;
    }
  }

  // Create response with security headers
  const response = NextResponse.next();
  addSecurityHeaders(response, request);
  addPerformanceHeaders(response, startTime);

  // Add user context headers for authenticated users
  await addUserContextHeaders(response);

  return response;
}

// Security threat detection
async function detectSecurityThreats(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = request.nextUrl.pathname;
  
  // SQL Injection detection
  if (detectSQLInjection(request)) {
    await logSecurityEvent({
      type: SecurityEventTypes.SQL_INJECTION_ATTEMPT,
      ip: clientIP,
      severity: 'critical',
      details: { 
        path: pathname,
        userAgent,
        queryParams: Object.fromEntries(request.nextUrl.searchParams),
      },
    });
  }

  // XSS detection
  if (detectXSS(request)) {
    await logSecurityEvent({
      type: SecurityEventTypes.XSS_ATTEMPT,
      ip: clientIP,
      severity: 'high',
      details: { 
        path: pathname,
        userAgent,
        queryParams: Object.fromEntries(request.nextUrl.searchParams),
      },
    });
  }

  // Security scanner detection
  if (detectSecurityScanner(userAgent)) {
    await logSecurityEvent({
      type: SecurityEventTypes.SECURITY_SCAN_DETECTED,
      ip: clientIP,
      severity: 'medium',
      details: { userAgent, path: pathname },
    });
  }

  // Brute force detection
  if (isBruteForceAttempt(pathname, clientIP)) {
    await logSecurityEvent({
      type: SecurityEventTypes.BRUTE_FORCE_ATTEMPT,
      ip: clientIP,
      severity: 'high',
      details: { path: pathname, userAgent },
    });
  }
}

// Authentication and authorization handling
async function handleAuthentication(
  request: NextRequest,
  pathWithoutLocale: string,
  locale: string
): Promise<NextResponse | null> {
  if (!isProtectedRoute(pathWithoutLocale)) {
    return null;
  }

  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  try {
    // Check if environment is validated for auth services
    if (!env.isValidConfig()) {
      console.warn('Environment validation failed, skipping auth checks for development');

      // In development with invalid config, allow access but log warning
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Allowing access to ${pathWithoutLocale} due to env validation issues`);
        return null; // Allow access
      }

      // In production, redirect to error page
      return NextResponse.redirect(new URL(`/${locale}/auth/signin?error=config_error`, request.url));
    }

    // Check if user is authenticated
    const isAuthenticated = await EnterpriseAuthService.isAuthenticated();

    if (!isAuthenticated) {
      try {
        await logSecurityEvent({
          type: SecurityEventTypes.UNAUTHORIZED_ACCESS_ATTEMPT,
          ip: clientIP,
          severity: 'medium',
          details: {
            attemptedPath: pathWithoutLocale,
            userAgent: userAgent,
          },
        });
      } catch (logError) {
        console.warn('Failed to log security event:', logError);
      }

      // Redirect to sign in with return URL
      const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
      signInUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Get current user for role-based checks
    const currentUser = await EnterpriseAuthService.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
    }

    // Check admin access
    if (isAdminRoute(pathWithoutLocale)) {
      const hasAdminAccess = await EnterpriseAuthService.hasRole(['admin']);
      if (!hasAdminAccess) {
        await logSecurityEvent({
          type: SecurityEventTypes.ROLE_ESCALATION_ATTEMPT,
          userId: currentUser.clerkUserId,
          ip: clientIP,
          severity: 'critical',
          details: { 
            attemptedPath: pathWithoutLocale,
            userRole: currentUser.role,
            requiredRole: 'admin',
          },
        });

        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
      }

      // Log admin access
      await logSecurityEvent({
        type: SecurityEventTypes.ADMIN_ACCESS,
        userId: currentUser.clerkUserId,
        ip: clientIP,
        severity: 'info',
        details: { path: pathWithoutLocale },
      });
    }

    // Check provider access
    if (isProviderRoute(pathWithoutLocale)) {
      const hasProviderAccess = await EnterpriseAuthService.hasRole(['provider', 'admin']);
      if (!hasProviderAccess) {
        await logSecurityEvent({
          type: SecurityEventTypes.ROLE_ESCALATION_ATTEMPT,
          userId: currentUser.clerkUserId,
          ip: clientIP,
          severity: 'medium',
          details: { 
            attemptedPath: pathWithoutLocale,
            userRole: currentUser.role,
            requiredRole: 'provider',
          },
        });

        return NextResponse.redirect(new URL(`/${locale}/become-provider`, request.url));
      }
    }

    // Enhanced security for sensitive routes
    if (isSensitiveRoute(pathWithoutLocale)) {
      if (currentUser.securityLevel === 'standard' && currentUser.role === 'admin') {
        // Require enhanced security for admin accessing sensitive routes
        return NextResponse.redirect(new URL(`/${locale}/security/upgrade-required`, request.url));
      }

      // Log sensitive access
      await logSecurityEvent({
        type: SecurityEventTypes.SENSITIVE_DATA_ACCESS,
        userId: currentUser.clerkUserId,
        ip: clientIP,
        severity: 'medium',
        details: { 
          path: pathWithoutLocale,
          securityLevel: currentUser.securityLevel,
        },
      });
    }

    return null; // Continue to the protected route
  } catch (error) {
    console.error('Middleware auth error:', error);
    
    await logSecurityEvent({
      type: SecurityEventTypes.SYSTEM_ERROR,
      ip: clientIP,
      severity: 'high',
      details: {
        error: error instanceof Error ? error.message : 'Unknown middleware error',
        path: pathWithoutLocale,
      },
    });

    // On auth error, redirect to signin
    const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
    signInUrl.searchParams.set('error', 'auth_failed');
    return NextResponse.redirect(signInUrl);
  }
}

// Helper functions
function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/api/health') ||
    (pathname.includes('.') && !pathname.startsWith('/api'))
  );
}

function handleInternationalization(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and specific API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Protection against CVE-2025-29927 (Next.js Middleware Bypass)
  const suspiciousHeaders = request.headers.get('x-middleware-subrequest');
  if (suspiciousHeaders) {
    console.warn('⚠️ SECURITY ALERT: Potential middleware bypass attempt detected', {
      ip: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent'),
      path: pathname,
      header: suspiciousHeaders
    });
    
    // Block the request
    return NextResponse.json(
      { error: 'Forbidden: Security violation detected' },
      { status: 403 }
    );
  }

  // Apply advanced authentication middleware for API routes
  if (pathname.startsWith('/api/')) {
    return advancedAuthMiddleware.processRequest(request);
  }

  // Handle internationalization for non-API routes
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) || defaultLocale;
    
    if (!pathname.startsWith('/api') && !pathname.startsWith('/auth/oauth-callback')) {
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      );
=======
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
]);

const isProviderRoute = createRouteMatcher([
  '/provider(.*)',
  '/dashboard/provider(.*)',
  '/api/provider(.*)',
]);

const isCustomerRoute = createRouteMatcher([
  '/dashboard/customer(.*)',
  '/bookings(.*)',
  '/api/bookings(.*)',
]);

const isAPIRoute = createRouteMatcher(['/api(.*)']);

// Rate limiting configurations
const RATE_LIMITS = {
  public: { requests: 100, windowMs: 60000 }, // 100 requests per minute
  authenticated: { requests: 500, windowMs: 60000 }, // 500 requests per minute
  admin: { requests: 1000, windowMs: 60000 }, // 1000 requests per minute
  api: { requests: 200, windowMs: 60000 }, // 200 API requests per minute
};

// Security headers configuration
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site',
};

// CSP Configuration
const CSP_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.stripe.com https://js.stripe.com https://clerk.accounts.dev;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.supabase.co https://clerk.accounts.dev https://*.clerk.accounts.dev;
  frame-src 'self' https://checkout.stripe.com https://js.stripe.com;
  media-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s+/g, ' ').trim();

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;
  const origin = req.nextUrl.origin;
  
  // Create response with security headers
  let response = NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CSP header
  response.headers.set('Content-Security-Policy', CSP_POLICY);
  
  // Add HSTS for HTTPS
  if (req.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  try {
    // 1. Rate Limiting
    const rateLimitResult = await applyRateLimit(req, userId, sessionClaims);
    if (rateLimitResult.blocked) {
      return rateLimitResult.response;
>>>>>>> origin/main
    }

<<<<<<< HEAD
  return null;
}

function extractLocaleAndPath(pathname: string): { locale: string; pathWithoutLocale: string } {
  const segments = pathname.split('/');
  const locale = segments[1] || defaultLocale;
  const pathWithoutLocale = segments.slice(2).join('/') || '/';
  
  return { locale, pathWithoutLocale };
}

async function handleAuthRouteRedirect(pathWithoutLocale: string, locale: string, request: NextRequest): Promise<NextResponse | null> {
  try {
    // Skip auth checks if environment validation failed
    if (!env.isValidConfig()) {
      return null;
    }

    const isAuthenticated = await EnterpriseAuthService.isAuthenticated();

    if (isAuthenticated) {
      const currentUser = await EnterpriseAuthService.getCurrentUser();
      const redirectPath = getRedirectPath(currentUser?.role || 'consumer');
      return NextResponse.redirect(new URL(`/${locale}${redirectPath}`, request.url));
    }
  } catch (error) {
    console.warn('Error checking auth for auth route:', error);
=======
    // 2. CSRF Protection for state-changing operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const csrfResult = await validateCSRF(req);
      if (!csrfResult.valid) {
        return new NextResponse('CSRF token invalid', { status: 403 });
      }
    }

    // 3. Public routes - no authentication required
    if (isPublicRoute(req)) {
      return response;
    }

    // 4. Require authentication for protected routes
    if (!userId) {
      return redirectToSignIn(req);
    }

    // 5. Extract user role and tenant information
    const userRole = sessionClaims?.metadata?.role || 'guest';
    const tenantId = sessionClaims?.metadata?.tenantId || 
                    sessionClaims?.app_metadata?.tenant_id;

    // 6. Admin route protection
    if (isAdminRoute(req)) {
      if (!hasRole(userRole, ['admin'])) {
        return createForbiddenResponse('Admin access required');
      }
      
      // Log admin access
      await logSecurityEvent({
        type: 'ADMIN_ACCESS',
        userId,
        resource: pathname,
        ip: getClientIP(req),
        userAgent: req.headers.get('user-agent'),
      });
    }

    // 7. Provider route protection
    if (isProviderRoute(req)) {
      if (!hasRole(userRole, ['admin', 'moderator', 'provider'])) {
        return createForbiddenResponse('Provider access required');
      }
    }

    // 8. Customer route protection
    if (isCustomerRoute(req)) {
      if (!hasRole(userRole, ['admin', 'moderator', 'provider', 'customer'])) {
        return createForbiddenResponse('Customer access required');
      }
    }

    // 9. API route protection
    if (isAPIRoute(req)) {
      // Additional API security checks
      const apiSecurityResult = await validateAPIRequest(req, userId, userRole);
      if (!apiSecurityResult.valid) {
        return apiSecurityResult.response;
      }
    }

    // 10. Tenant isolation check (if applicable)
    if (tenantId && requiresTenantIsolation(pathname)) {
      const isolationResult = await validateTenantAccess(req, tenantId, userId);
      if (!isolationResult.valid) {
        return createForbiddenResponse('Tenant access violation');
      }
    }

    // 11. Add user context headers for downstream processing
    response.headers.set('X-User-ID', userId);
    response.headers.set('X-User-Role', userRole);
    if (tenantId) {
      response.headers.set('X-Tenant-ID', tenantId);
    }
    
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // Log security error
    await logSecurityEvent({
      type: 'MIDDLEWARE_ERROR',
      userId: userId || 'anonymous',
      resource: pathname,
      error: String(error),
      ip: getClientIP(req),
    });

    return new NextResponse('Internal server error', { status: 500 });
>>>>>>> origin/main
  }
});

<<<<<<< HEAD
  return null;
}

async function addUserContextHeaders(response: NextResponse) {
  try {
    // Skip if environment validation failed
    if (!env.isValidConfig()) {
      return;
    }

    const currentUser = await EnterpriseAuthService.getCurrentUser();
    if (currentUser) {
      response.headers.set('X-User-ID', currentUser.clerkUserId);
      response.headers.set('X-User-Role', currentUser.role);
      response.headers.set('X-User-Security-Level', currentUser.securityLevel);
    }
  } catch (error) {
    // Silently fail for header additions
  }
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         request.ip || 
         'unknown';
}

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = locales.find(locale => 
      acceptLanguage.toLowerCase().includes(locale.toLowerCase())
=======
/**
 * Rate Limiting Implementation
 */
async function applyRateLimit(
  req: NextRequest, 
  userId?: string, 
  sessionClaims?: any
): Promise<{ blocked: boolean; response?: NextResponse }> {
  try {
    const identifier = userId || getClientIP(req);
    const userRole = sessionClaims?.metadata?.role || 'guest';
    
    // Select rate limit based on user role and route type
    let rateLimit = RATE_LIMITS.public;
    
    if (isAPIRoute(req)) {
      rateLimit = RATE_LIMITS.api;
    } else if (userRole === 'admin') {
      rateLimit = RATE_LIMITS.admin;
    } else if (userId) {
      rateLimit = RATE_LIMITS.authenticated;
    }

    const result = await checkRateLimit(
      identifier,
      rateLimit.requests,
      rateLimit.windowMs
>>>>>>> origin/main
    );

    if (!result.allowed) {
      const response = new NextResponse('Rate limit exceeded', { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetTime.getTime() - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(rateLimit.requests),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.resetTime.getTime()),
        }
      });

      return { blocked: true, response };
    }

    return { blocked: false };
  } catch (error) {
    console.error('Rate limiting error:', error);
    return { blocked: false };
  }
<<<<<<< HEAD

  return defaultLocale;
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function isProviderRoute(pathname: string): boolean {
  return providerRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function isAuthRoute(pathname: string): boolean {
  const authRoutes = ['/auth/signin', '/auth/signup'];
  return authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function isSensitiveRoute(pathname: string): boolean {
  return sensitiveRoutes.some(route => 
    pathname.startsWith(route)
  );
}

function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'provider':
      return '/provider/dashboard';
    case 'consumer':
    default:
      return '/dashboard';
  }
}

// Security detection functions
function detectSQLInjection(request: NextRequest): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b)/i,
    /(\b(UNION|OR|AND)\b.*\b(SELECT|INSERT|UPDATE|DELETE)\b)/i,
    /(;|\-\-|\/\*|\*\/)/,
    /(\b(xp_|sp_|cmd)\w+)/i,
  ];

  const checkString = request.nextUrl.search + request.nextUrl.pathname;
  return sqlPatterns.some(pattern => pattern.test(checkString));
}

function detectXSS(request: NextRequest): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /expression\s*\(/gi,
  ];

  const checkString = request.nextUrl.search;
  return xssPatterns.some(pattern => pattern.test(checkString));
}

function detectSecurityScanner(userAgent: string): boolean {
  const scannerPatterns = [
    /nmap/i,
    /sqlmap/i,
    /burp/i,
    /nikto/i,
    /dirbuster/i,
    /gobuster/i,
    /masscan/i,
    /zap/i,
    /acunetix/i,
    /nessus/i,
  ];

  return scannerPatterns.some(pattern => pattern.test(userAgent));
}

function isBruteForceAttempt(pathname: string, ip: string): boolean {
  // This would integrate with rate limiting data
  // For now, return false to avoid false positives
  return false;
}

function addSecurityHeaders(response: NextResponse, request: NextRequest): void {
  let config;
  try {
    config = env.getConfig();
  } catch (error) {
    // Fallback to process.env if validation fails
    config = {
      NODE_ENV: process.env.NODE_ENV || 'development'
    };
  }

  // Core security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.accounts.dev",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    "connect-src 'self' https: wss: https://*.supabase.co https://clerk.accounts.dev",
    "frame-src 'self' https://clerk.accounts.dev https://*.clerk.accounts.dev",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ];

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // HSTS in production
  if (config.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // Security monitoring headers
  response.headers.set('X-Security-Version', '2.0');
  response.headers.set('X-Environment', config.NODE_ENV);
}

function addPerformanceHeaders(response: NextResponse, startTime: number): void {
  const processingTime = Date.now() - startTime;
  response.headers.set('X-Response-Time', `${processingTime}ms`);
  response.headers.set('X-Powered-By', 'Loconomy Enterprise');
=======
}

/**
 * CSRF Token Validation
 */
async function validateCSRF(req: NextRequest): Promise<{ valid: boolean }> {
  const token = req.headers.get('x-csrf-token') || 
                req.headers.get('x-xsrf-token');

  // For API routes, we might want to skip CSRF for certain scenarios
  if (isAPIRoute(req) && req.headers.get('content-type')?.includes('application/json')) {
    // Could implement more sophisticated CSRF protection for APIs
    return { valid: true };
  }

  // In development, we might be more lenient
  if (process.env.NODE_ENV === 'development') {
    return { valid: true };
  }

  // In production, implement proper CSRF validation
  // This is a simplified version - implement actual token validation
  return { valid: !!token };
}

/**
 * API Request Validation
 */
async function validateAPIRequest(
  req: NextRequest,
  userId: string,
  userRole: string
): Promise<{ valid: boolean; response?: NextResponse }> {
  // Check for required headers
  const contentType = req.headers.get('content-type');
  const userAgent = req.headers.get('user-agent');

  // Block suspicious requests
  if (!userAgent || userAgent.includes('bot') || userAgent.includes('crawler')) {
    return {
      valid: false,
      response: new NextResponse('Invalid user agent', { status: 403 })
    };
  }

  // Validate content type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!contentType?.includes('application/json')) {
      return {
        valid: false,
        response: new NextResponse('Invalid content type', { status: 400 })
      };
    }
  }

  return { valid: true };
}

/**
 * Helper Functions
 */
function hasRole(userRole: string, allowedRoles: string[]): boolean {
  const roleHierarchy: Record<string, string[]> = {
    admin: ['admin', 'moderator', 'provider', 'customer', 'guest'],
    moderator: ['moderator', 'provider', 'customer', 'guest'],
    provider: ['provider', 'customer', 'guest'],
    customer: ['customer', 'guest'],
    guest: ['guest'],
  };

  const userRoles = roleHierarchy[userRole] || ['guest'];
  return allowedRoles.some(role => userRoles.includes(role));
}

function redirectToSignIn(req: NextRequest): NextResponse {
  const signInUrl = new URL('/sign-in', req.url);
  signInUrl.searchParams.set('redirectUrl', req.url);
  return NextResponse.redirect(signInUrl);
}

function createForbiddenResponse(message: string): NextResponse {
  return new NextResponse(message, { status: 403 });
}

function getClientIP(req: NextRequest): string {
  return (
    req.ip ||
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function requiresTenantIsolation(pathname: string): boolean {
  const tenantRoutes = [
    '/dashboard',
    '/api/services',
    '/api/bookings',
    '/api/users',
    '/provider',
    '/admin'
  ];
  
  return tenantRoutes.some(route => pathname.startsWith(route));
}

async function validateTenantAccess(
  req: NextRequest,
  tenantId: string,
  userId: string
): Promise<{ valid: boolean }> {
  // Implement tenant access validation logic
  // This would typically check if the user has access to the requested tenant
  // For now, return true as placeholder
  return { valid: true };
}

/**
 * Security Event Logging
 */
interface SecurityEvent {
  type: string;
  userId: string;
  resource?: string;
  error?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: Date;
}

async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || new Date(),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', logEntry);
  }

  // In production, send to monitoring service
  try {
    // await sendToSecurityMonitoring(logEntry);
    // await storeInAuditLog(logEntry);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
>>>>>>> origin/main
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
