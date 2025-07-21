import { NextRequest, NextResponse } from 'next/server';
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

// Simplified middleware without external dependencies

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/')
  ) {
    return response;
  }
  
  // Simplified tenant detection
  const tenant = detectTenant(request);
  if (tenant) {
    response.headers.set('x-tenant-id', tenant.id);
    response.headers.set('x-tenant-slug', tenant.slug);
    response.headers.set('x-tenant-features', JSON.stringify(tenant.features));
  }
  
  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Set default user role (for future use)
  response.headers.set('x-user-role', 'guest');
  
  // Simplified middleware - just pass through for now
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
