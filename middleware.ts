import { NextRequest, NextResponse } from 'next/server';
import { advancedAuthMiddleware } from '@/lib/security/advanced-auth-middleware';

// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
const defaultLocale = 'en';

// Public routes that don't require authentication
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
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/google-oauth',
  '/api/auth/oauth-callback',
  '/api/search',
  '/api/webhooks'
];

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/provider',
  '/customer',
  '/messages',
  '/settings',
  '/onboarding'
];

export async function middleware(request: NextRequest) {
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

  // Check authentication for protected routes
  if (isProtectedRoute(pathWithoutLocale)) {
    try {
      // Apply advanced authentication for protected page routes
      const authResponse = await advancedAuthMiddleware.processRequest(request);
      
      // If auth middleware returns an error response, handle it
      if (authResponse.status >= 400) {
        // Redirect to signin for authentication errors
        return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
      }
      
      // Add comprehensive security headers
      const response = NextResponse.next();
      addSecurityHeaders(response);
      
      return response;
    } catch (error) {
      console.error('Middleware auth error:', error);
      // On auth error, redirect to signin
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
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

/**
 * Add comprehensive security headers to response
 */
function addSecurityHeaders(response: NextResponse): void {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Enable XSS protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Enforce HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Permissions Policy (restrict dangerous features)
  response.headers.set('Permissions-Policy', 
    'accelerometer=(), camera=(), geolocation=(self), gyroscope=(), magnetometer=(), microphone=(), payment=(self), usb=()'
  );
  
  // Cross-Origin Policies
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes are handled by the advanced auth middleware)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
