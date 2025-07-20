import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getUnifiedSession } from "@/lib/auth/session";
import { UserRole } from "@/types/rbac";
import { isRoleAllowed } from "@/lib/rbac/utils";

// Route protection configuration
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': ['consumer', 'provider', 'admin'],
  '/provider': ['provider', 'admin'],
  '/provider/dashboard': ['provider', 'admin'],
  '/provider/listings': ['provider', 'admin'],
  '/provider/analytics': ['provider', 'admin'],
  '/provider/calendar': ['provider', 'admin'],
  '/admin': ['admin'],
  '/admin/users': ['admin'],
  '/admin/moderation': ['admin'],
  '/subscription': ['provider', 'admin'],
  '/billing': ['provider', 'admin'],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/browse',
  '/about',
  '/contact',
  '/pricing',
  '/privacy',
  '/terms',
  '/cookies',
  '/auth/signin',
  '/auth/signup',
  '/auth/signout',
  '/example-rbac',
];

// Internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "es", "fr", "de", "pt", "it", "ja", "ko", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and certain paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Apply internationalization middleware first
  const intlResponse = intlMiddleware(request);
  
  // Extract the actual path without locale prefix for route protection
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  
  // Check if route requires protection
  const requiredRoles = getRequiredRoles(pathWithoutLocale);
  
  if (!requiredRoles) {
    // Public route - apply intl middleware only
    return intlResponse;
  }

  // Protected route - check authentication and authorization
  try {
    const session = await getUnifiedSession();
    
    if (!session.isAuthenticated || !session.user) {
      // Redirect to sign in for unauthenticated users
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check role authorization
    const userRole = session.user.role;
    if (!isRoleAllowed(userRole, requiredRoles)) {
      // Redirect to appropriate page based on user role
      const redirectUrl = getRoleRedirectUrl(userRole, request.url);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // User is authorized - apply intl middleware
    return intlResponse;
    
  } catch (error) {
    console.error('Middleware auth error:', error);
    
    // On auth error, redirect to sign in
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('error', 'auth_error');
    return NextResponse.redirect(signInUrl);
  }
}

// Helper function to get required roles for a path
function getRequiredRoles(pathname: string): UserRole[] | null {
  // Check exact matches first
  if (PROTECTED_ROUTES[pathname]) {
    return PROTECTED_ROUTES[pathname];
  }

  // Check for wildcard matches
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route + '/') || 
        (route.includes('[') && matchesDynamicRoute(pathname, route))) {
      return roles;
    }
  }

  // Check if it's a public route
  if (PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )) {
    return null;
  }

  // Default: require authentication for unknown routes
  return ['consumer', 'provider', 'admin'];
}

// Helper function to match dynamic routes like /provider/[id]
function matchesDynamicRoute(pathname: string, route: string): boolean {
  const pathSegments = pathname.split('/').filter(Boolean);
  const routeSegments = route.split('/').filter(Boolean);

  if (pathSegments.length !== routeSegments.length) {
    return false;
  }

  return routeSegments.every((segment, index) => {
    if (segment.startsWith('[') && segment.endsWith(']')) {
      return true; // Dynamic segment matches any value
    }
    return segment === pathSegments[index];
  });
}

// Helper function to get redirect URL based on user role
function getRoleRedirectUrl(userRole: UserRole, requestUrl: string): string {
  const roleRedirects = {
    guest: '/auth/signin',
    consumer: '/dashboard',
    provider: '/provider/dashboard',
    admin: '/admin',
  };

  return roleRedirects[userRole] || '/';
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /_static (inside /public)
    // - all root files inside /public (e.g. /favicon.ico)
    '/((?!api|_next|_static|[\\w-]+\\.\\w+).*)',
  ],
};
