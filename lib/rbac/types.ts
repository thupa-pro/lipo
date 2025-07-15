/**
 * Role-Based Access Control (RBAC) Types
 * Defines user roles and permissions for the Loconomy platform
 */

import React from "react";

export type UserRole = "guest" | "consumer" | "provider" | "admin";

export interface RolePermissions {
  canViewDashboard: boolean;
  canManageListings: boolean;
  canViewAnalytics: boolean;
  canAccessAdmin: boolean;
  canBookServices: boolean;
  canViewProviderTools: boolean;
  canModerateContent: boolean;
  canViewFinancials: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  guest: {
    canViewDashboard: false,
    canManageListings: false,
    canViewAnalytics: false,
    canAccessAdmin: false,
    canBookServices: false,
    canViewProviderTools: false,
    canModerateContent: false,
    canViewFinancials: false,
  },
  consumer: {
    canViewDashboard: true,
    canManageListings: false,
    canViewAnalytics: false,
    canAccessAdmin: false,
    canBookServices: true,
    canViewProviderTools: false,
    canModerateContent: false,
    canViewFinancials: false,
  },
  provider: {
    canViewDashboard: true,
    canManageListings: true,
    canViewAnalytics: true,
    canAccessAdmin: false,
    canBookServices: true,
    canViewProviderTools: true,
    canModerateContent: false,
    canViewFinancials: true,
  },
  admin: {
    canViewDashboard: true,
    canManageListings: true,
    canViewAnalytics: true,
    canAccessAdmin: true,
    canBookServices: true,
    canViewProviderTools: true,
    canModerateContent: true,
    canViewFinancials: true,
  },
};

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string; // For multi-tenant provider spaces
  subscription?: {
    plan: string;
    status: "active" | "cancelled" | "past_due";
  };
}

export interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}
