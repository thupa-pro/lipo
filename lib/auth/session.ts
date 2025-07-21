// Unified Session Management for Loconomy Platform
// Supports both NextAuth.js and Clerk.js with fallback handling

import { auth } from '@clerk/nextjs/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User, UserRole, ConsentSettings } from '@/types/rbac';
import { parseUserRole, createDefaultConsent } from '@/lib/rbac/utils';

export interface ServerSession {
  user: User | null;
  isAuthenticated: boolean;
  source: 'clerk' | 'nextauth' | 'none';
}

/**
 * Get unified server session from either Clerk or NextAuth
 * This function works in Server Components and API routes
 */
export async function getUnifiedSession(): Promise<ServerSession> {
  try {
    // Try Clerk first
    const clerkAuth = auth();
    if (clerkAuth?.userId) {
      const user = await getUserFromClerk(clerkAuth);
      if (user) {
        return {
          user,
          isAuthenticated: true,
          source: 'clerk'
        };
      }
    }
  } catch (error) {
    console.warn('Clerk auth failed, trying NextAuth:', error);
  }

  try {
    // Fallback to NextAuth
    const nextAuthSession = await getServerSession(authOptions);
    if (nextAuthSession?.user) {
      const user = await getUserFromNextAuth(nextAuthSession);
      return {
        user,
        isAuthenticated: true,
        source: 'nextauth'
      };
    }
  } catch (error) {
    console.warn('NextAuth session failed:', error);
  }

  // No authentication found
  return {
    user: null,
    isAuthenticated: false,
    source: 'none'
  };
}

/**
 * Transform Clerk user data to our User interface
 */
async function getUserFromClerk(clerkAuth: any): Promise<User | null> {
  try {
    // In a real implementation, you would fetch additional data from your database
    // using clerkAuth.userId to get role, consent settings, etc.
    
    const role = parseUserRole(clerkAuth.sessionClaims?.role as string);
    
    return {
      id: clerkAuth.userId,
      email: clerkAuth.sessionClaims?.email as string || '',
      role,
      tenantId: clerkAuth.sessionClaims?.tenantId as string,
      metadata: {
        consentSettings: createDefaultConsent(),
        subscriptionTier: 'free',
        onboardingCompleted: false,
      }
    };
  } catch (error) {
    console.error('Error transforming Clerk user:', error);
    return null;
  }
}

/**
 * Transform NextAuth user data to our User interface
 */
async function getUserFromNextAuth(session: any): Promise<User | null> {
  try {
    const role = parseUserRole(session.user?.role as string);
    
    return {
      id: session.user?.id || session.user?.sub || '',
      email: session.user?.email || '',
      role,
      tenantId: session.user?.tenantId,
      metadata: {
        consentSettings: session.user?.consentSettings || createDefaultConsent(),
        subscriptionTier: session.user?.subscriptionTier || 'free',
        onboardingCompleted: session.user?.onboardingCompleted || false,
      }
    };
  } catch (error) {
    console.error('Error transforming NextAuth user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getUnifiedSession();
  return session.isAuthenticated;
}

/**
 * Get current user (server-side)
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getUnifiedSession();
  return session.user;
}

/**
 * Get current user role (server-side)
 */
export async function getCurrentUserRole(): Promise<UserRole> {
  const user = await getCurrentUser();
  return parseUserRole(user?.role);
}

/**
 * Require authentication or throw
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require specific role or throw
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth();
  const userRole = parseUserRole(user.role);
  
  if (!allowedRoles.includes(userRole)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
  }
  
  return user;
}

/**
 * Update user consent settings in the appropriate auth system
 */
export async function updateUserConsent(
  userId: string,
  consentSettings: ConsentSettings,
  source: 'clerk' | 'nextauth'
): Promise<void> {
  try {
    if (source === 'clerk') {
      // Update Clerk user metadata
      // In a real implementation, you would use Clerk's backend API
      console.log('Updating Clerk user consent:', userId, consentSettings);
    } else {
      // Update in your database for NextAuth users
      // In a real implementation, you would update your user table
      console.log('Updating NextAuth user consent:', userId, consentSettings);
    }
  } catch (error) {
    console.error('Failed to update user consent:', error);
    throw new Error('Failed to update consent settings');
  }
}

/**
 * Create a guest session for unauthenticated users
 */
export function createGuestSession(): ServerSession {
  return {
    user: {
      id: 'guest',
      email: '',
      role: 'guest',
      metadata: {
        consentSettings: createDefaultConsent(),
        subscriptionTier: 'free',
        onboardingCompleted: false,
      }
    },
    isAuthenticated: false,
    source: 'none'
  };
}

/**
 * Validate session and return safe user data for client
 */
export async function getSessionForClient() {
  const session = await getUnifiedSession();
  
  if (!session.user) {
    return null;
  }

  // Return only safe data for client-side
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    isAuthenticated: session.isAuthenticated,
    metadata: {
      onboardingCompleted: session.user.metadata.onboardingCompleted,
      subscriptionTier: session.user.metadata.subscriptionTier,
    }
  };
}