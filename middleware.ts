import { NextRequest, NextResponse } from 'next/server';

// Supported locales - matches the next-intl.config.js file
const locales = [
  "en", "zh", "hi", "es", "ar", "pt", "bn", "ru", "ja", "pa", "de", "ur", "ko", "fr", "tr", "it", "th", "fa", "pl", "nl", "uk", "vi", "he", "sw", "ro", "el", "cs", "hu", "fi", "da", "no", "sv", "id", "ms", "tl", "zh-TW", "am", "mg"
];
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
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.includes('.')
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

  // Check authentication for protected routes
  if (isProtectedRoute(pathWithoutLocale)) {
    try {
      // For now, we'll allow access to protected routes
      // In production, you would check authentication here
      const response = NextResponse.next();
      
      // Add security headers
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      
      return response;
    } catch (error) {
      console.error('Middleware auth error:', error);
      // On auth error, redirect to signin
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
