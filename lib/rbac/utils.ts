// RBAC Utility Functions for Loconomy Platform

import { 
  UserRole, 
  Permission, 
  ConsentSettings, 
  User,
  PERMISSIONS,
  ROLE_HIERARCHY,
  DEFAULT_CONSENT,
  SubscriptionTier,
  SubscriptionAccess
} from '@/types/rbac';

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = PERMISSIONS[userRole];
  return rolePermissions.includes(permission as any);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user role is allowed access
 */
export function isRoleAllowed(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user role has higher or equal hierarchy than required
 */
export function hasRoleHierarchy(userRole: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

/**
 * Get all permissions for a user role
 */
export function getRolePermissions(userRole: UserRole): readonly Permission[] {
  return PERMISSIONS[userRole];
}

/**
 * Validate user role
 */
export function isValidRole(role: string): role is UserRole {
  return ['guest', 'consumer', 'provider', 'admin'].includes(role);
}

/**
 * Get user role from string with fallback
 */
export function parseUserRole(role: string | undefined | null): UserRole {
  if (!role || !isValidRole(role)) {
    return 'guest';
  }
  return role;
}

/**
 * Check if subscription tier has access to feature
 */
export function hasSubscriptionAccess(
  tier: SubscriptionTier, 
  feature: keyof SubscriptionAccess[SubscriptionTier]
): boolean {
  const tierAccess = SUBSCRIPTION_ACCESS[tier];
  return tierAccess.includes(feature as any);
}

/**
 * Get subscription tier from string with fallback
 */
export function parseSubscriptionTier(tier: string | undefined | null): SubscriptionTier {
  if (!tier || !['free', 'starter', 'professional', 'enterprise'].includes(tier)) {
    return 'free';
  }
  return tier as SubscriptionTier;
}

/**
 * Consent Management Utilities
 */

/**
 * Get stored consent from localStorage for guests
 */
export function getGuestConsent(): ConsentSettings | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('loconomy_consent');
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return validateConsentSettings(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Store consent in localStorage for guests
 */
export function setGuestConsent(settings: ConsentSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('loconomy_consent', JSON.stringify(settings));
    // Dispatch custom event for consent changes
    window.dispatchEvent(new CustomEvent('consentChange', { 
      detail: { settings } 
    }));
  } catch (error) {
    console.warn('Failed to store consent settings:', error);
  }
}

/**
 * Clear stored consent
 */
export function clearGuestConsent(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('loconomy_consent');
  } catch (error) {
    console.warn('Failed to clear consent settings:', error);
  }
}

/**
 * Validate consent settings structure
 */
export function validateConsentSettings(settings: any): settings is ConsentSettings {
  return (
    settings &&
    typeof settings === 'object' &&
    typeof settings.essential === 'boolean' &&
    typeof settings.analytics === 'boolean' &&
    typeof settings.marketing === 'boolean' &&
    typeof settings.personalization === 'boolean' &&
    typeof settings.timestamp === 'string' &&
    typeof settings.version === 'string'
  );
}

/**
 * Create default consent settings
 */
export function createDefaultConsent(): ConsentSettings {
  return {
    ...DEFAULT_CONSENT,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Update consent settings with new values
 */
export function updateConsentSettings(
  current: ConsentSettings,
  updates: Partial<Omit<ConsentSettings, 'essential' | 'timestamp' | 'version'>>
): ConsentSettings {
  return {
    ...current,
    ...updates,
    essential: true, // Always true
    timestamp: new Date().toISOString(),
    version: '1.0', // Update version as needed
  };
}

/**
 * Check if consent allows analytics
 */
export function canLoadAnalytics(consent: ConsentSettings | null): boolean {
  return consent?.analytics === true;
}

/**
 * Check if consent allows marketing scripts
 */
export function canLoadMarketing(consent: ConsentSettings | null): boolean {
  return consent?.marketing === true;
}

/**
 * Check if consent allows personalization
 */
export function canLoadPersonalization(consent: ConsentSettings | null): boolean {
  return consent?.personalization === true;
}

/**
 * User Session Utilities
 */

/**
 * Extract user role from user object with fallback
 */
export function getUserRole(user: User | null | undefined): UserRole {
  if (!user?.role) return 'guest';
  return parseUserRole(user.role);
}

/**
 * Get user consent settings with fallback
 */
export function getUserConsent(user: User | null | undefined): ConsentSettings {
  if (!user?.metadata?.consentSettings) {
    return getGuestConsent() || createDefaultConsent();
  }
  return user.metadata.consentSettings;
}

/**
 * Check if user needs to complete onboarding
 */
export function needsOnboarding(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.metadata?.onboardingCompleted !== true;
}

/**
 * Get user subscription tier with fallback
 */
export function getUserSubscriptionTier(user: User | null | undefined): SubscriptionTier {
  if (!user?.metadata?.subscriptionTier) return 'free';
  return parseSubscriptionTier(user.metadata.subscriptionTier);
}

/**
 * Check if user can access feature based on role and subscription
 */
export function canAccessFeature(
  user: User | null | undefined,
  requiredRoles: UserRole[],
  requiredPermission?: Permission,
  requiredSubscription?: SubscriptionTier[]
): boolean {
  const userRole = getUserRole(user);
  
  // Check role access
  if (!isRoleAllowed(userRole, requiredRoles)) {
    return false;
  }
  
  // Check permission if specified
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return false;
  }
  
  // Check subscription if specified
  if (requiredSubscription && user) {
    const userTier = getUserSubscriptionTier(user);
    if (!requiredSubscription.includes(userTier)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Create consent accept all settings
 */
export function createAcceptAllConsent(): ConsentSettings {
  return {
    essential: true,
    analytics: true,
    marketing: true,
    personalization: true,
    timestamp: new Date().toISOString(),
    version: '1.0',
  };
}

/**
 * Create consent reject non-essential settings
 */
export function createRejectNonEssentialConsent(): ConsentSettings {
  return {
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
    timestamp: new Date().toISOString(),
    version: '1.0',
  };
}
