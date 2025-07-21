import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import createMiddleware from 'next-intl/middleware';
import { UserRole } from './types/rbac';

// Loconomy Multi-Tenant Middleware
// Handles tenant detection, RBAC, internationalization, and AI-native routing

interface TenantConfig {
  id: string;
  slug: string;
  domain?: string;
  defaultLocale: string;
  supportedLocales: string[];
  features: {
    aiAssistant: boolean;
    smartRecommendations: boolean;
    voiceSearch: boolean;
    customBranding: boolean;
  };
}

interface RouteConfig {
  path: string;
  roles: UserRole[];
  requiresAuth: boolean;
  requiresSubscription?: boolean;
  tenantSpecific: boolean;
}

// Mock tenant configurations (in production, fetch from database)
const TENANT_CONFIGS: Record<string, TenantConfig> = {
  'sf-local': {
    id: 'tenant_sf_123',
    slug: 'sf-local',
    domain: 'sf.loconomy.com',
    defaultLocale: 'en',
    supportedLocales: ['en', 'es'],
    features: {
      aiAssistant: true,
      smartRecommendations: true,
      voiceSearch: true,
      customBranding: false,
    },
  },
  'nyc-services': {
    id: 'tenant_nyc_456',
    slug: 'nyc-services',
    domain: 'nyc.loconomy.com',
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'zh'],
    features: {
      aiAssistant: true,
      smartRecommendations: true,
      voiceSearch: false,
      customBranding: true,
    },
  },
  'global': {
    id: 'tenant_global_789',
    slug: 'global',
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
    features: {
      aiAssistant: true,
      smartRecommendations: true,
      voiceSearch: true,
      customBranding: true,
    },
  },
};

// Route configurations with RBAC
const ROUTE_CONFIGS: RouteConfig[] = [
  // Public routes
  { path: '/', roles: ['guest', 'consumer', 'provider', 'admin'], requiresAuth: false, tenantSpecific: true },
  { path: '/search', roles: ['guest', 'consumer', 'provider', 'admin'], requiresAuth: false, tenantSpecific: true },
  { path: '/services', roles: ['guest', 'consumer', 'provider', 'admin'], requiresAuth: false, tenantSpecific: true },
  { path: '/providers', roles: ['guest', 'consumer', 'provider', 'admin'], requiresAuth: false, tenantSpecific: true },
  
  // Auth routes
  { path: '/auth/signin', roles: ['guest'], requiresAuth: false, tenantSpecific: false },
  { path: '/auth/signup', roles: ['guest'], requiresAuth: false, tenantSpecific: false },
  { path: '/auth/callback', roles: ['guest'], requiresAuth: false, tenantSpecific: false },
  
  // Consumer routes
  { path: '/bookings', roles: ['consumer'], requiresAuth: true, tenantSpecific: true },
  { path: '/favorites', roles: ['consumer'], requiresAuth: true, tenantSpecific: true },
  { path: '/profile', roles: ['consumer', 'provider'], requiresAuth: true, tenantSpecific: false },
  
  // Provider routes
  { path: '/dashboard', roles: ['provider', 'admin'], requiresAuth: true, tenantSpecific: true },
  { path: '/listings', roles: ['provider'], requiresAuth: true, tenantSpecific: true },
  { path: '/analytics', roles: ['provider', 'admin'], requiresAuth: true, tenantSpecific: true },
  { path: '/ai-coach', roles: ['provider'], requiresAuth: true, requiresSubscription: true, tenantSpecific: true },
  
  // Admin routes
  { path: '/admin', roles: ['admin'], requiresAuth: true, tenantSpecific: true },
  { path: '/admin/tenants', roles: ['admin'], requiresAuth: true, tenantSpecific: false },
  { path: '/admin/users', roles: ['admin'], requiresAuth: true, tenantSpecific: true },
  
  // Billing routes
  { path: '/billing', roles: ['consumer', 'provider'], requiresAuth: true, tenantSpecific: false },
  { path: '/subscription', roles: ['consumer', 'provider'], requiresAuth: true, tenantSpecific: false },
];

// AI-native route patterns
const AI_ROUTES = [
  '/ai/chat',
  '/ai/recommendations',
  '/ai/search',
  '/ai/coach',
  '/voice/search',
];

// Detect tenant from request
function detectTenant(request: NextRequest): TenantConfig | null {
  const host = request.headers.get('host');
  const pathname = request.nextUrl.pathname;
  
  // Check for custom domain
  if (host) {
    for (const [slug, config] of Object.entries(TENANT_CONFIGS)) {
      if (config.domain === host) {
        return config;
      }
    }
  }
  
  // Check for subdomain
  if (host && host.includes('.loconomy.com')) {
    const subdomain = host.split('.')[0];
    const config = TENANT_CONFIGS[subdomain];
    if (config) {
      return config;
    }
  }
  
  // Check for tenant in path (e.g., /t/sf-local/...)
  const tenantMatch = pathname.match(/^\/t\/([^\/]+)/);
  if (tenantMatch) {
    const tenantSlug = tenantMatch[1];
    return TENANT_CONFIGS[tenantSlug] || null;
  }
  
  // Default to global tenant
  return TENANT_CONFIGS['global'];
}

// Check if user has required role for route
function hasRequiredRole(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) {
    return allowedRoles.includes('guest');
  }
  return allowedRoles.includes(userRole);
}

// Get route configuration
function getRouteConfig(pathname: string): RouteConfig | null {
  // Remove tenant prefix if present
  const cleanPath = pathname.replace(/^\/t\/[^\/]+/, '');
  
  // Find exact match or closest match
  const exactMatch = ROUTE_CONFIGS.find(config => config.path === cleanPath);
  if (exactMatch) return exactMatch;
  
  // Find pattern match
  const patternMatch = ROUTE_CONFIGS.find(config => {
    if (config.path.includes('*')) {
      const pattern = config.path.replace('*', '.*');
      return new RegExp(`^${pattern}`).test(cleanPath);
    }
    return cleanPath.startsWith(config.path + '/');
  });
  
  return patternMatch || null;
}

// Create internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and API routes (except /api/auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/auth'))
  ) {
    return response;
  }
  
  // Detect tenant
  const tenant = detectTenant(request);
  if (!tenant) {
    return new NextResponse('Tenant not found', { status: 404 });
  }
  
  // Set tenant context in headers
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-slug', tenant.slug);
  response.headers.set('x-tenant-features', JSON.stringify(tenant.features));
  
  // Handle internationalization
  const locale = request.nextUrl.pathname.split('/')[1];
  const isValidLocale = tenant.supportedLocales.includes(locale);
  
  if (!isValidLocale && !pathname.startsWith('/api')) {
    // Apply internationalization middleware
    const intlResponse = intlMiddleware(request);
    if (intlResponse) {
      // Copy tenant headers to intl response
      intlResponse.headers.set('x-tenant-id', tenant.id);
      intlResponse.headers.set('x-tenant-slug', tenant.slug);
      intlResponse.headers.set('x-tenant-features', JSON.stringify(tenant.features));
      return intlResponse;
    }
  }
  
  // Initialize Supabase client for auth
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  // Get user role and tenant membership
  let userRole: UserRole | null = null;
  let tenantMembership = null;
  
  if (user) {
    try {
      // Fetch user role and tenant membership
      const { data: userData } = await supabase
        .from('users')
        .select(`
          role,
          user_tenant_memberships (
            role,
            status,
            tenant_id
          )
        `)
        .eq('id', user.id)
        .single();
      
      if (userData) {
        userRole = userData.role;
        tenantMembership = userData.user_tenant_memberships?.find(
          (m: any) => m.tenant_id === tenant.id && m.status === 'active'
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  
  // Set user context in headers
  if (user && userRole) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', userRole);
    response.headers.set('x-user-email', user.email || '');
    if (tenantMembership) {
      response.headers.set('x-tenant-role', tenantMembership.role);
    }
  }
  
  // Get route configuration
  const routeConfig = getRouteConfig(pathname);
  
  // Check AI route access
  const isAIRoute = AI_ROUTES.some(route => pathname.startsWith(route));
  if (isAIRoute && !tenant.features.aiAssistant) {
    return new NextResponse('AI features not available for this tenant', { status: 403 });
  }
  
  // Handle auth requirements
  if (routeConfig) {
    // Check authentication requirement
    if (routeConfig.requiresAuth && !user) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // Check role requirements
    if (!hasRequiredRole(userRole, routeConfig.roles)) {
      if (!user) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
      } else {
        return new NextResponse('Insufficient permissions', { status: 403 });
      }
    }
    
    // Check tenant-specific access
    if (routeConfig.tenantSpecific && userRole !== 'admin' && !tenantMembership) {
      return new NextResponse('No access to this tenant', { status: 403 });
    }
    
    // Check subscription requirements (mock)
    if (routeConfig.requiresSubscription && userRole === 'provider') {
      // In production, check actual subscription status
      const hasActiveSubscription = true; // Mock check
      if (!hasActiveSubscription) {
        const subscriptionUrl = new URL('/subscription', request.url);
        subscriptionUrl.searchParams.set('upgrade', 'required');
        return NextResponse.redirect(subscriptionUrl);
      }
    }
  }
  
  // Handle tenant-specific redirects
  if (pathname === '/' && tenant.slug !== 'global') {
    // Add tenant context to home page
    response.headers.set('x-tenant-context', 'home');
  }
  
  // Handle provider onboarding
  if (userRole === 'provider' && pathname === '/dashboard') {
    try {
      const { data: profile } = await supabase
        .from('provider_profiles')
        .select('verification_status')
        .eq('user_id', user?.id)
        .eq('tenant_id', tenant.id)
        .single();
      
      if (!profile) {
        const onboardingUrl = new URL('/onboarding/provider', request.url);
        return NextResponse.redirect(onboardingUrl);
      }
    } catch (error) {
      // Profile doesn't exist, redirect to onboarding
      const onboardingUrl = new URL('/onboarding/provider', request.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
  
  // Handle admin tenant switching
  if (userRole === 'admin' && pathname.startsWith('/admin/tenants/')) {
    const targetTenantSlug = pathname.split('/')[3];
    const targetTenant = Object.values(TENANT_CONFIGS).find(t => t.slug === targetTenantSlug);
    if (targetTenant) {
      response.headers.set('x-admin-target-tenant', targetTenant.id);
    }
  }
  
  // Add security headers
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('referrer-policy', 'origin-when-cross-origin');
  
  // Add tenant-specific CSP for custom branding
  if (tenant.features.customBranding) {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com",
    ].join('; ');
    response.headers.set('content-security-policy', csp);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
