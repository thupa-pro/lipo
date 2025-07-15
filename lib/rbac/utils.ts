/**
 * RBAC Utility Functions
 * Server and client utilities for role-based access control
 */

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import {
  UserRole,
  UserSession,
  ROLE_PERMISSIONS,
  RolePermissions,
} from "./types";

/**
 * Get the current user session with role information (Server-side)
 */
export async function getCurrentSession(): Promise<UserSession | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const supabase = createClient();

    // Get user role from Supabase
    const { data: userRole, error } = await supabase
      .from("user_roles")
      .select("role, tenant_id")
      .eq("user_id", userId)
      .single();

    if (error || !userRole) {
      // Default to consumer role for authenticated users without explicit role
      return {
        id: userId,
        email: "",
        role: "consumer" as UserRole,
      };
    }

    return {
      id: userId,
      email: "",
      role: userRole.role as UserRole,
      tenantId: userRole.tenant_id,
    };
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: UserRole,
  permission: keyof RolePermissions,
): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

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
