import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limits for different endpoints
const rateLimits = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
    analytics: true,
  }),
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 auth requests per minute
    analytics: true,
  }),
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 AI requests per hour
    analytics: true,
  }),
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 h'), // 50 search requests per hour
    analytics: true,
  }),
};

// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
const defaultLocale = 'en';

// GDPR-compliant countries (EU + UK + EEA)
const gdprCountries = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE', 'GB', 'IS', 'LI', 'NO'
];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.openai.com https://*.sentry.io https://*.posthog.com; frame-src https://js.stripe.com; media-src 'self';"
  );

  // Get client IP for rate limiting
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  
  // Get country from headers for GDPR compliance
  const country = request.headers.get('cf-ipcountry') || 
                 request.headers.get('x-vercel-ip-country') || 'US';

  // GDPR compliance - set cookie consent requirement
  if (gdprCountries.includes(country)) {
    response.headers.set('X-Requires-Cookie-Consent', 'true');
  }

  // Locale detection and routing
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Extract locale from pathname
  const localeFromPath = pathname.split('/')[1];
  const currentLocale = locales.includes(localeFromPath) ? localeFromPath : defaultLocale;
  
  // Set locale header for app consumption
  response.headers.set('X-Locale', currentLocale);

  // Rate limiting based on route patterns
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await applyRateLimit(pathname, ip);
    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.reset?.toString() || '3600',
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit?.toString() || '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining?.toString() || '0');
    if (rateLimitResult.reset) {
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
    }
  }

  // Authentication middleware for protected routes
  if (isProtectedRoute(pathname)) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = new URL(`/${currentLocale}/auth/login`, request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Add user context to headers
    response.headers.set('X-User-ID', session.user.id);
    response.headers.set('X-User-Email', session.user.email || '');
  }

  // API route specific middleware
  if (pathname.startsWith('/api/')) {
    // CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://loconomy.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    response.headers.set('Access-Control-Max-Age', '86400');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    // API key validation for public API endpoints
    if (pathname.startsWith('/api/public/')) {
      const apiKey = request.headers.get('X-API-Key');
      if (!apiKey || !await validateApiKey(apiKey)) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or missing API key' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // Cache control headers for static assets
  if (pathname.startsWith('/_next/static/') || pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Dynamic content cache headers
  if (pathname.startsWith('/api/') && request.method === 'GET') {
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300');
  }

  return response;
}

// Get user's preferred locale
function getLocale(request: NextRequest): string {
  // 1. Check URL parameter
  const localeParam = request.nextUrl.searchParams.get('locale');
  if (localeParam && locales.includes(localeParam)) {
    return localeParam;
  }

  // 2. Check cookie
  const localeCookie = request.cookies.get('locale')?.value;
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
      .map(lang => lang.split('-')[0]); // Extract language part only

    for (const lang of preferredLocales) {
      if (locales.includes(lang)) {
        return lang;
      }
    }
  }

  // 4. Default locale
  return defaultLocale;
}

// Apply rate limiting based on route pattern
async function applyRateLimit(pathname: string, ip: string) {
  let rateLimit = rateLimits.api; // default

  if (pathname.includes('/auth/')) {
    rateLimit = rateLimits.auth;
  } else if (pathname.includes('/ai/') || pathname.includes('/chat/')) {
    rateLimit = rateLimits.ai;
  } else if (pathname.includes('/search/') || pathname.includes('/vector/')) {
    rateLimit = rateLimits.search;
  }

  return await rateLimit.limit(ip);
}

// Check if route requires authentication
function isProtectedRoute(pathname: string): boolean {
  const protectedPrefixes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/billing',
    '/bookings',
    '/admin',
  ];

  // Remove locale prefix for checking
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
  
  return protectedPrefixes.some(prefix => 
    pathWithoutLocale.startsWith(prefix)
  );
}

// Validate API key (placeholder implementation)
async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    // In production, validate against database or external service
    const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
    return validApiKeys.includes(apiKey);
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
