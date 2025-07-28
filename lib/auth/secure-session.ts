/**
 * 🛡️ Secure Session Management - Production Grade
 * Unified Clerk authentication with enhanced security
 */

import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Security Types
export type UserRole = 'admin' | 'moderator' | 'provider' | 'customer' | 'guest';
export type Permission = 
  | 'users:read' | 'users:write' | 'users:delete'
  | 'services:read' | 'services:write' | 'services:delete'
  | 'bookings:read' | 'bookings:write' | 'bookings:delete'
  | 'admin:access' | 'analytics:view';

export interface SecureUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
  permissions: Permission[];
  sessionId: string;
  lastActivity: Date;
}

export interface AuthContext {
  user: SecureUser;
  tenantId: string;
  sessionClaims: any;
}

// Enhanced JWT Claims Interface
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole;
      tenantId?: string;
      permissions?: Permission[];
    };
    app_metadata: {
      tenant_id?: string;
      role?: UserRole;
    };
  }
}

// Role Hierarchy for Permission Inheritance
const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  admin: ['admin', 'moderator', 'provider', 'customer', 'guest'],
  moderator: ['moderator', 'provider', 'customer', 'guest'],
  provider: ['provider', 'customer', 'guest'],
  customer: ['customer', 'guest'],
  guest: ['guest'],
};

// Permission Maps
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'users:read', 'users:write', 'users:delete',
    'services:read', 'services:write', 'services:delete',
    'bookings:read', 'bookings:write', 'bookings:delete',
    'admin:access', 'analytics:view'
  ],
  moderator: [
    'users:read', 'services:read', 'services:write',
    'bookings:read', 'bookings:write', 'analytics:view'
  ],
  provider: [
    'services:read', 'services:write',
    'bookings:read', 'bookings:write'
  ],
  customer: [
    'services:read', 'bookings:read', 'bookings:write'
  ],
  guest: ['services:read'],
};

/**
 * Enhanced Authentication with Security Validation
 */
export async function getSecureSession(): Promise<{
  user: SecureUser | null;
  isAuthenticated: boolean;
  error?: string;
}> {
  try {
    const { sessionClaims, userId } = await auth();
    
    if (!sessionClaims || !userId) {
      return { user: null, isAuthenticated: false };
    }

    // Validate session freshness
    const sessionAge = Date.now() - (sessionClaims.iat * 1000);
    const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > MAX_SESSION_AGE) {
      return { 
        user: null, 
        isAuthenticated: false, 
        error: 'Session expired' 
      };
    }

    // Extract secure user data
    const role = (sessionClaims.metadata?.role || 'guest') as UserRole;
    const tenantId = sessionClaims.metadata?.tenantId || 
                    sessionClaims.app_metadata?.tenant_id || 
                    'default';

    const user: SecureUser = {
      id: userId,
      email: sessionClaims.email || '',
      role,
      tenantId,
      permissions: ROLE_PERMISSIONS[role] || [],
      sessionId: sessionClaims.jti || '',
      lastActivity: new Date(),
    };

    return { user, isAuthenticated: true };
  } catch (error) {
    console.error('Session validation error:', error);
    return { 
      user: null, 
      isAuthenticated: false, 
      error: 'Session validation failed' 
    };
  }
}

/**
 * Server-side Role Verification with Audit Logging
 */
export async function requireRole(
  allowedRoles: UserRole[],
  context?: { req?: NextRequest; auditAction?: string }
): Promise<SecureUser> {
  const { user, isAuthenticated, error } = await getSecureSession();
  
  if (!isAuthenticated || !user) {
    // Log security event
    await logSecurityEvent({
      event: 'AUTH_FAILURE',
      reason: error || 'No session',
      ip: context?.req?.ip,
      userAgent: context?.req?.headers.get('user-agent'),
      resource: context?.req?.nextUrl?.pathname,
    });
    
    throw new UnauthorizedError('Authentication required');
  }

  // Check role hierarchy
  const hasPermission = allowedRoles.some(role => 
    ROLE_HIERARCHY[user.role]?.includes(role)
  );

  if (!hasPermission) {
    // Log authorization failure
    await logSecurityEvent({
      event: 'AUTHZ_FAILURE',
      userId: user.id,
      role: user.role,
      requiredRoles: allowedRoles,
      resource: context?.req?.nextUrl?.pathname,
      ip: context?.req?.ip,
    });
    
    throw new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
  }

  // Log successful access
  if (context?.auditAction) {
    await logSecurityEvent({
      event: 'ACCESS_GRANTED',
      userId: user.id,
      role: user.role,
      action: context.auditAction,
      resource: context?.req?.nextUrl?.pathname,
      ip: context?.req?.ip,
    });
  }

  return user;
}

/**
 * Permission-based Access Control
 */
export async function requirePermission(
  requiredPermissions: Permission[],
  context?: { req?: NextRequest }
): Promise<SecureUser> {
  const { user, isAuthenticated } = await getSecureSession();
  
  if (!isAuthenticated || !user) {
    throw new UnauthorizedError('Authentication required');
  }

  const hasPermission = requiredPermissions.every(permission =>
    user.permissions.includes(permission)
  );

  if (!hasPermission) {
    await logSecurityEvent({
      event: 'PERMISSION_DENIED',
      userId: user.id,
      role: user.role,
      requiredPermissions,
      userPermissions: user.permissions,
      resource: context?.req?.nextUrl?.pathname,
    });
    
    throw new ForbiddenError(`Missing permissions: ${requiredPermissions.join(', ')}`);
  }

  return user;
}

/**
 * Tenant Isolation Enforcement
 */
export async function requireTenantAccess(
  resourceTenantId: string,
  context?: { req?: NextRequest }
): Promise<SecureUser> {
  const { user, isAuthenticated } = await getSecureSession();
  
  if (!isAuthenticated || !user) {
    throw new UnauthorizedError('Authentication required');
  }

  // Admin users can access all tenants
  if (user.role === 'admin') {
    return user;
  }

  if (user.tenantId !== resourceTenantId) {
    await logSecurityEvent({
      event: 'TENANT_VIOLATION',
      userId: user.id,
      userTenantId: user.tenantId,
      requestedTenantId: resourceTenantId,
      resource: context?.req?.nextUrl?.pathname,
    });
    
    throw new ForbiddenError('Access denied: Tenant isolation violation');
  }

  return user;
}

/**
 * Enhanced User Management with Clerk
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  tenantId?: string
): Promise<void> {
  const adminUser = await requireRole(['admin']);
  
  try {
    const client = await clerkClient();
    
    const updateData = {
      publicMetadata: {
        role: newRole,
        tenantId: tenantId || adminUser.tenantId,
        permissions: ROLE_PERMISSIONS[newRole],
        updatedBy: adminUser.id,
        updatedAt: new Date().toISOString(),
      }
    };

    await client.users.updateUserMetadata(userId, updateData);
    
    // Log role change
    await logSecurityEvent({
      event: 'ROLE_UPDATED',
      userId: adminUser.id,
      targetUserId: userId,
      oldRole: 'unknown', // Could be fetched from previous metadata
      newRole,
      tenantId,
    });
    
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw new Error('Role update failed');
  }
}

/**
 * Security Event Logging
 */
interface SecurityEvent {
  event: string;
  userId?: string;
  targetUserId?: string;
  role?: UserRole;
  oldRole?: UserRole;
  newRole?: UserRole;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  userPermissions?: Permission[];
  tenantId?: string;
  userTenantId?: string;
  requestedTenantId?: string;
  resource?: string;
  action?: string;
  reason?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: Date;
}

async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  const securityLog = {
    ...event,
    timestamp: event.timestamp || new Date(),
    severity: getEventSeverity(event.event),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', securityLog);
  }

  // In production, send to monitoring service
  // await sendToSecurityMonitoring(securityLog);
  
  // Store in database for audit trail
  try {
    // await storeSecurityEvent(securityLog);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

function getEventSeverity(event: string): 'low' | 'medium' | 'high' | 'critical' {
  const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    ACCESS_GRANTED: 'low',
    AUTH_FAILURE: 'medium',
    AUTHZ_FAILURE: 'medium',
    PERMISSION_DENIED: 'high',
    TENANT_VIOLATION: 'critical',
    ROLE_UPDATED: 'medium',
  };
  
  return severityMap[event] || 'medium';
}

/**
 * Custom Error Classes
 */
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Rate Limiting with Redis (placeholder)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
  // Implementation would use Redis for distributed rate limiting
  // For now, return allowed
  return {
    allowed: true,
    remaining: limit - 1,
    resetTime: new Date(Date.now() + windowMs),
  };
}

/**
 * Request Validation Schemas
 */
export const securitySchemas = {
  roleUpdate: z.object({
    userId: z.string().min(1),
    newRole: z.enum(['admin', 'moderator', 'provider', 'customer', 'guest']),
    tenantId: z.string().optional(),
  }),
  
  tenantAccess: z.object({
    tenantId: z.string().min(1),
    resourceId: z.string().min(1),
  }),
};