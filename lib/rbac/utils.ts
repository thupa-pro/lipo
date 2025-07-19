/**
 * RBAC Utility Functions
 * Client-safe utilities for role-based access control
 */

import {
  UserRole,
  ROLE_PERMISSIONS,
  RolePermissions,
} from "./types";

export interface UserSession {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  isAuthenticated: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export function getCurrentSession(): UserSession | null {
  // In a real app, this would get the session from your auth provider
  // For now, return a mock session
  if (typeof window === 'undefined') return null;
  
  const mockSession: UserSession = {
    id: 'user-123',
    email: 'user@example.com',
    role: 'provider',
    permissions: ['read:listings', 'write:listings', 'read:bookings'],
    isAuthenticated: true,
  };
  
  return mockSession;
}

export function hasPermission(userSession: UserSession | null, permission: string): boolean {
  if (!userSession || !userSession.isAuthenticated) return false;
  return userSession.permissions.includes(permission);
}

export function hasRole(userSession: UserSession | null, role: string): boolean {
  if (!userSession || !userSession.isAuthenticated) return false;
  return userSession.role === role;
}

export function hasAnyRoleFromSession(userSession: UserSession | null, roles: string[]): boolean {
  if (!userSession || !userSession.isAuthenticated) return false;
  return roles.includes(userSession.role);
}

export function checkAccess(userSession: UserSession | null, requiredPermissions: string[]): boolean {
  if (!userSession || !userSession.isAuthenticated) return false;
  
  return requiredPermissions.every(permission => 
    userSession.permissions.includes(permission)
  );
}

export const SYSTEM_ROLES = {
  ADMIN: 'admin',
  PROVIDER: 'provider',
  CUSTOMER: 'customer',
  MODERATOR: 'moderator',
} as const;

export const PERMISSIONS = {
  // Listings
  'read:listings': 'Read listings',
  'write:listings': 'Create and update listings',
  'delete:listings': 'Delete listings',
  'moderate:listings': 'Moderate listings',
  
  // Bookings
  'read:bookings': 'Read bookings',
  'write:bookings': 'Create and update bookings',
  'delete:bookings': 'Delete bookings',
  
  // Users
  'read:users': 'Read user profiles',
  'write:users': 'Update user profiles',
  'delete:users': 'Delete users',
  
  // Admin
  'admin:all': 'Full administrative access',
  'admin:users': 'Manage users',
  'admin:system': 'System administration',
} as const;

/**
 * Check if user has any of the allowed roles
 */
export function hasAnyRole(
  userRole: UserRole,
  allowedRoles: UserRole[],
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Get role-specific redirect URL after authentication
 */
export function getRoleRedirectUrl(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "provider":
      return "/provider/dashboard";
    case "consumer":
      return "/dashboard";
    case "guest":
    default:
      return "/";
  }
}

/**
 * Get navigation items based on user role
 */
export function getRoleNavigation(role: UserRole) {
  const baseItems = [
    {
      href: "/",
      label: "Home",
      roles: ["guest", "consumer", "provider", "admin"],
    },
    {
      href: "/browse",
      label: "Services",
      roles: ["guest", "consumer", "provider", "admin"],
    },
  ];

  const roleSpecificItems = [
    // Consumer items
    { href: "/dashboard", label: "Dashboard", roles: ["consumer"] },
    { href: "/bookings", label: "My Bookings", roles: ["consumer"] },

    // Provider items
    {
      href: "/provider/dashboard",
      label: "Provider Dashboard",
      roles: ["provider"],
    },
    { href: "/provider/listings", label: "My Listings", roles: ["provider"] },
    { href: "/provider/analytics", label: "Analytics", roles: ["provider"] },

    // Admin items
    { href: "/admin", label: "Admin", roles: ["admin"] },
    { href: "/admin/users", label: "User Management", roles: ["admin"] },
    {
      href: "/admin/moderation",
      label: "Content Moderation",
      roles: ["admin"],
    },
  ];

  return [...baseItems, ...roleSpecificItems].filter((item) =>
    item.roles.includes(role),
  );
}

/**
 * Validate role transition (for role upgrades/downgrades)
 */
export function canTransitionToRole(
  currentRole: UserRole,
  targetRole: UserRole,
): boolean {
  // Only admins can change roles, and specific transitions are allowed
  const allowedTransitions: Record<UserRole, UserRole[]> = {
    guest: ["consumer"],
    consumer: ["provider"],
    provider: ["consumer"], // Can downgrade
    admin: ["consumer", "provider"], // Admin can become other roles
  };

  return allowedTransitions[currentRole]?.includes(targetRole) ?? false;
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, UserRole[]> = {
    "/dashboard": ["consumer", "provider", "admin"],
    "/provider": ["provider", "admin"],
    "/admin": ["admin"],
    "/bookings": ["consumer", "provider", "admin"],
    "/analytics": ["provider", "admin"],
  };

  // Check if route starts with any protected path
  for (const [path, allowedRoles] of Object.entries(routePermissions)) {
    if (route.startsWith(path)) {
      return allowedRoles.includes(userRole);
    }
  }

  // Default: allow access to public routes
  return true;
}
