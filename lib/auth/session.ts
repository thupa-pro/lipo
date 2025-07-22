// Unified Session Management for Loconomy Platform
// Backend-only Clerk authentication

import { ClerkBackendAuth } from '@/lib/auth/clerk-backend';
import { User, UserRole, ConsentSettings } from '@/types/rbac';
import { parseUserRole, createDefaultConsent } from '@/lib/rbac/utils';

export interface ServerSession {
  user: User | null;
  isAuthenticated: boolean;
  source: 'clerk' | 'none';
}

/**
 * Get unified server session from Clerk backend
 * This function works in Server Components and API routes
 */
export async function getUnifiedSession(): Promise<ServerSession> {
  try {
    // Use our backend-only Clerk authentication
    const user = await ClerkBackendAuth.getCurrentUser();
    
    if (user) {
      const transformedUser = await transformClerkUser(user);
      return {
        user: transformedUser,
        isAuthenticated: true,
        source: 'clerk'
      };
    }
  } catch (error) {
    console.warn('Clerk backend auth failed:', error);
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
async function transformClerkUser(clerkUser: any): Promise<User> {
  try {
    const role = parseUserRole(clerkUser.role as string);
    
    return {
      id: clerkUser.id,
      email: clerkUser.email || '',
      role,
      tenantId: clerkUser.tenantId || clerkUser.id, // Use user ID as tenant ID if not set
      metadata: {
        consentSettings: createDefaultConsent(),
        subscriptionTier: 'free',
        onboardingCompleted: false,
      }
    };
  } catch (error) {
    console.error('Error transforming Clerk user:', error);
    throw error;
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
 * Update user consent settings in Clerk
 */
export async function updateUserConsent(
  userId: string,
  consentSettings: ConsentSettings
): Promise<void> {
  try {
    // Update user metadata in your database
    // You would typically store this in your Prisma database
    console.log('Updating user consent:', userId, consentSettings);
    
    // In a real implementation, you would:
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { consentSettings }
    // });
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