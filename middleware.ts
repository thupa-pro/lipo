import createMiddlewareClient from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n/config";

// Rate limiting store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Create the internationalization middleware
const handleI18nRouting = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // Only add prefix for non-default locales
});

export async function middleware(req: NextRequest) {
  // Skip middleware for certain paths that shouldn't be localized
  const shouldSkipI18n =
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.includes(".") ||
    req.nextUrl.pathname.startsWith("/favicon");

  if (!shouldSkipI18n) {
    // Handle internationalization first
    const intlResponse = handleI18nRouting(req);
    if (intlResponse) {
      return intlResponse;
    }
  }
  let res = NextResponse.next(); // Initialize a new response

  // CORS headers
  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production" ? "https://loconomy.com" : "*",
  );
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.headers.set("Access-Control-Max-Age", "86400");

  // Security headers
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)",
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    // For OPTIONS requests, return the response with CORS headers immediately
    // Ensure we return the NextResponse object itself, not a new generic Response
    return res;
  }

  // Initialize Supabase client. This needs to happen before any potential redirects
  // or session checks, as it might set cookies on 'res'.
  // const supabase = createMiddlewareClient({ req, res }); // Temporarily commented out for development

  // Rate limiting for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "anonymous";
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    const rateLimitKey = `${ip}:${req.nextUrl.pathname}`;
    const rateLimitData = rateLimitMap.get(rateLimitKey);

    if (!rateLimitData || now > rateLimitData.resetTime) {
      rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
    } else {
      rateLimitData.count++;
      if (rateLimitData.count > maxRequests) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests" }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil(
                (rateLimitData.resetTime - now) / 1000,
              ).toString(),
            },
          },
        );
      }
    }
  }

  // Authentication for protected routes - TEMPORARILY DISABLED FOR DEVELOPMENT
  // const protectedPaths = ["/dashboard", "/admin", "/api/protected"]
  // const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // if (isProtectedPath) {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()

  //   if (!session) {
  //     const redirectUrl = new URL("/auth/signin", req.url)
  //     redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
  //     return NextResponse.redirect(redirectUrl)
  //   }
  // }

  return res;
}

export const config = {
  // Match all paths except for API routes, Next.js static assets, and the favicon.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
