import { NextRequest, NextResponse } from 'next/server';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api') ||
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
    
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // Extract locale from pathname
  const segments = pathname.split('/');
  const locale = segments[1];
  const pathWithoutLocale = segments.slice(2).join('/') || '/';

  // For now, allow all access to avoid auth issues
  // TODO: Re-enable authentication once fully configured
  
  // Add basic security headers
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
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function addSecurityHeaders(response: NextResponse): void {
  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
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
