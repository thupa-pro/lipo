import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/auth/enterprise-auth';
import { logSecurityEvent, SecurityEventTypes } from '@/lib/security/enterprise-audit-logger';
import { checkRateLimit } from '@/lib/security/enterprise-rate-limiter';
import { env, hasFeature } from '@/lib/config/environment';

// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
const defaultLocale = 'en';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
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
  await detectSecurityThreats(request);

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
    const redirectResult = await handleAuthRouteRedirect(pathWithoutLocale, locale);
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
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) || defaultLocale;
    
    if (!pathname.startsWith('/api') && !pathname.startsWith('/auth/oauth-callback')) {
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      );
    }
  }

  return null;
}

function extractLocaleAndPath(pathname: string): { locale: string; pathWithoutLocale: string } {
  const segments = pathname.split('/');
  const locale = segments[1] || defaultLocale;
  const pathWithoutLocale = segments.slice(2).join('/') || '/';
  
  return { locale, pathWithoutLocale };
}

async function handleAuthRouteRedirect(pathWithoutLocale: string, locale: string): Promise<NextResponse | null> {
  try {
    const isAuthenticated = await EnterpriseAuthService.isAuthenticated();
    
    if (isAuthenticated) {
      const currentUser = await EnterpriseAuthService.getCurrentUser();
      const redirectPath = getRedirectPath(currentUser?.role || 'consumer');
      return NextResponse.redirect(new URL(`/${locale}${redirectPath}`, window.location.origin));
    }
  } catch (error) {
    console.warn('Error checking auth for auth route:', error);
  }

  return null;
}

async function addUserContextHeaders(response: NextResponse) {
  try {
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
    );
    if (preferredLocale) return preferredLocale;
  }

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
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes are handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
