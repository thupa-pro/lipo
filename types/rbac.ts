// RBAC and Consent Management Types for Loconomy Platform

export type UserRole = 'guest' | 'consumer' | 'provider' | 'admin';

export interface RolePermissions {
  readonly guest: readonly ['browse_services', 'view_public_profiles'];
  readonly consumer: readonly [
    'browse_services',
    'view_public_profiles', 
    'book_services',
    'manage_bookings',
    'write_reviews',
    'access_dashboard'
  ];
  readonly provider: readonly [
    'browse_services',
    'view_public_profiles',
    'manage_listings',
    'view_earnings',
    'respond_bookings',
    'access_provider_dashboard',
    'manage_calendar'
  ];
  readonly admin: readonly [
    'browse_services',
    'view_public_profiles',
    'manage_all_listings',
    'view_all_earnings',
    'moderate_content',
    'access_admin_dashboard',
    'manage_users',
    'view_analytics',
    'audit_logs'
  ];
}

export type Permission = RolePermissions[UserRole][number];

export interface User {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string; // For provider workspace isolation
  metadata: {
    consentSettings?: ConsentSettings;
    subscriptionTier?: SubscriptionTier;
    onboardingCompleted?: boolean;
  };
}

export interface ConsentSettings {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: string;
  version: string; // Privacy policy version
}

export type ConsentAction = 'accept_all' | 'reject_non_essential' | 'manage_preferences';

export interface ConsentEvent {
  action: ConsentAction;
  settings: ConsentSettings;
  userAgent: string;
  timestamp: string;
}

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface SubscriptionAccess {
  readonly free: readonly ['basic_listings', 'standard_support'];
  readonly starter: readonly ['basic_listings', 'standard_support', 'analytics_basic'];
  readonly professional: readonly [
    'basic_listings',
    'premium_listings',
    'standard_support', 
    'analytics_advanced',
    'priority_support'
  ];
  readonly enterprise: readonly [
    'basic_listings',
    'premium_listings',
    'unlimited_listings',
    'standard_support',
    'analytics_advanced',
    'priority_support',
    'custom_branding',
    'api_access'
  ];
}

export interface RoleGateProps {
  allowedRoles: UserRole[];
  currentRole?: UserRole;
  fallback?: React.ReactNode;
  requireSubscription?: SubscriptionTier[];
  children: React.ReactNode;
}

export interface AuthSession {
  user: User | null;
  isLoading: boolean;
  error?: string;
}

// Role hierarchy for permission inheritance
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  consumer: 1,
  provider: 2,
  admin: 3,
} as const;

// Default consent settings
export const DEFAULT_CONSENT: ConsentSettings = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
  timestamp: new Date().toISOString(),
  version: '1.0',
} as const;

// Permission mappings
export const PERMISSIONS: RolePermissions = {
  guest: ['browse_services', 'view_public_profiles'],
  consumer: [
    'browse_services',
    'view_public_profiles',
    'book_services', 
    'manage_bookings',
    'write_reviews',
    'access_dashboard'
  ],
  provider: [
    'browse_services',
    'view_public_profiles',
    'manage_listings',
    'view_earnings',
    'respond_bookings',
    'access_provider_dashboard',
    'manage_calendar'
  ],
  admin: [
    'browse_services',
    'view_public_profiles',
    'manage_all_listings',
    'view_all_earnings',
    'moderate_content',
    'access_admin_dashboard',
    'manage_users',
    'view_analytics',
    'audit_logs'
  ]
} as const;

export const SUBSCRIPTION_ACCESS: SubscriptionAccess = {
  free: ['basic_listings', 'standard_support'],
  starter: ['basic_listings', 'standard_support', 'analytics_basic'],
  professional: [
    'basic_listings',
    'premium_listings', 
    'standard_support',
    'analytics_advanced',
    'priority_support'
  ],
  enterprise: [
    'basic_listings',
    'premium_listings',
    'unlimited_listings',
    'standard_support',
    'analytics_advanced', 
    'priority_support',
    'custom_branding',
    'api_access'
  ]
} as const;