import { NextRequest, NextResponse } from 'next/server';
import { IntegratedAuthService } from '@/lib/auth/integrated-auth';
import { logSecurityEvent } from '@/lib/security/audit-logger';

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
  '/api/health',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/google-oauth',
  '/api/auth/oauth-callback',
  '/api/search',
  '/api/webhooks',
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/webhooks') ||
    (pathname.includes('.') && !pathname.startsWith('/api'))
  ) {
    return NextResponse.next();
  }

  // Handle internationalization
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) || defaultLocale;
    
    // Don't redirect API routes or auth callbacks
    if (!pathname.startsWith('/api') && !pathname.startsWith('/auth/oauth-callback')) {
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      );
    }
  }

  // Extract locale from pathname
  const segments = pathname.split('/');
  const locale = segments[1];
  const pathWithoutLocale = segments.slice(2).join('/') || '/';

  // Get client information for logging
  const clientIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  request.ip || 
                  'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Check authentication for protected routes
  if (isProtectedRoute(pathWithoutLocale)) {
    try {
      // Check if user is authenticated using integrated auth
      const isAuthenticated = await IntegratedAuthService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Log unauthorized access attempt
        await logSecurityEvent({
          type: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          ip: clientIP,
          severity: 'medium',
          details: { 
            attemptedPath: pathWithoutLocale,
            userAgent: userAgent
          },
        });

        // Redirect to sign in with return URL
        const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
        signInUrl.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Get current user for role-based checks
      const currentUser = await IntegratedAuthService.getCurrentUser();
      
      // Check role-based access for specific routes
      if (isAdminRoute(pathWithoutLocale)) {
        const hasAdminRole = currentUser?.role === 'admin';
        if (!hasAdminRole) {
          await logSecurityEvent({
            type: 'ROLE_ESCALATION_ATTEMPT',
            userId: currentUser?.clerkUserId,
            ip: clientIP,
            severity: 'high',
            details: { 
              attemptedPath: pathWithoutLocale,
              userRole: currentUser?.role,
              requiredRole: 'admin'
            },
          });

          return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
        }
      }

      if (isProviderRoute(pathWithoutLocale)) {
        const hasProviderRole = ['provider', 'admin'].includes(currentUser?.role || '');
        if (!hasProviderRole) {
          await logSecurityEvent({
            type: 'ROLE_ESCALATION_ATTEMPT',
            userId: currentUser?.clerkUserId,
            ip: clientIP,
            severity: 'medium',
            details: { 
              attemptedPath: pathWithoutLocale,
              userRole: currentUser?.role,
              requiredRole: 'provider'
            },
          });

          return NextResponse.redirect(new URL(`/${locale}/become-provider`, request.url));
        }
      }

      // Add security headers for authenticated users
      const response = NextResponse.next();
      addSecurityHeaders(response);
      
      // Add user context header for server components
      if (currentUser) {
        response.headers.set('X-User-ID', currentUser.clerkUserId);
        response.headers.set('X-User-Role', currentUser.role);
      }
      
      return response;

    } catch (error) {
      console.error('Middleware auth error:', error);
      
      // Log authentication error
      await logSecurityEvent({
        type: 'AUTHENTICATION_ERROR',
        ip: clientIP,
        severity: 'high',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      // On auth error, redirect to signin
      const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
      signInUrl.searchParams.set('error', 'auth_failed');
      return NextResponse.redirect(signInUrl);
    }
  }

  // Handle auth routes - redirect authenticated users
  if (isAuthRoute(pathWithoutLocale)) {
    try {
      const isAuthenticated = await IntegratedAuthService.isAuthenticated();
      
      if (isAuthenticated) {
        const currentUser = await IntegratedAuthService.getCurrentUser();
        const redirectPath = getRedirectPath(currentUser?.role || 'consumer');
        return NextResponse.redirect(new URL(`/${locale}${redirectPath}`, request.url));
      }
    } catch (error) {
      // If there's an error checking auth, allow access to auth pages
      console.warn('Error checking auth for auth route:', error);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  addSecurityHeaders(response);

  return response;
}

function getLocale(request: NextRequest): string {
  // Check if locale is in URL
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;

  // Check Accept-Language header
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
  // Remove locale prefix for checking
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
  
  return publicRoutes.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
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

function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'provider':
      return '/provider/dashboard';
    case 'consumer':
    default:
      return '/dashboard';
  }
}

function addSecurityHeaders(response: NextResponse): void {
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.accounts.dev; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data: https:; " +
    "connect-src 'self' https: wss: https://*.supabase.co https://clerk.accounts.dev; " +
    "frame-src 'self' https://clerk.accounts.dev https://*.clerk.accounts.dev;"
  );
  
  // Strict Transport Security (HTTPS only in production)
  if (process.env.NODE_ENV === 'production') {
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
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
