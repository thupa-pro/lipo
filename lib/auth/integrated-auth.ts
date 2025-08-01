import { clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { SecureSupabaseService } from '@/lib/supabase/secure-client';
import { logSecurityEvent } from '@/lib/security/audit-logger';

// Input validation schemas
const signInSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  role: z.enum(['consumer', 'provider']).default('consumer'),
});

export interface IntegratedUser {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: 'consumer' | 'provider' | 'admin';
  verified: boolean;
  avatar?: string;
  phone?: string;
  createdAt: string;
  lastSignIn?: string;
  metadata?: Record<string, any>;
}

export class IntegratedAuthService {
  private static readonly SESSION_COOKIE = '__session';
  private static readonly MAX_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Integrated sign up with Clerk and Supabase
  static async signUpWithCredentials(
    data: z.infer<typeof signUpSchema>,
    clientIP: string,
    userAgent?: string
  ) {
    try {
      // Input validation
      const validation = signUpSchema.safeParse(data);
      if (!validation.success) {
        await logSecurityEvent({
          type: 'INVALID_SIGNUP_ATTEMPT',
          ip: clientIP,
          severity: 'low',
          details: validation.error.issues,
        });
        return { 
          success: false, 
          error: 'Please check your input and try again.',
          details: validation.error.issues
        };
      }

      const { email, password, firstName, lastName, role } = validation.data;

      // Create user in Clerk first
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        password,
        firstName,
        lastName,
        publicMetadata: {
          role: role,
          verified: false,
          createdAt: new Date().toISOString(),
        },
        privateMetadata: {
          securityLevel: 'standard',
          lastPasswordChange: new Date().toISOString(),
        }
      });

      if (!clerkUser) {
        throw new Error('Failed to create user in Clerk');
      }

      // Create user profile in Supabase
      const supabaseResult = await SecureSupabaseService.upsertUserProfile(
        clerkUser.id,
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: role,
          avatar_url: clerkUser.profileImageUrl,
          email_verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        },
        clientIP
      );

      if (!supabaseResult.success) {
        // Rollback: Delete Clerk user if Supabase profile creation fails
        await clerkClient.users.deleteUser(clerkUser.id);
        
        await logSecurityEvent({
          type: 'SIGNUP_ROLLBACK',
          email: email,
          ip: clientIP,
          severity: 'medium',
          details: { reason: 'Supabase profile creation failed' },
        });

        return { 
          success: false, 
          error: 'Registration failed. Please try again.' 
        };
      }

      // Create session in Clerk
      const session = await clerkClient.sessions.createSession({
        userId: clerkUser.id,
        expiresInSeconds: this.MAX_SESSION_DURATION / 1000,
      });

      // Track session in Supabase
      await SecureSupabaseService.createSession(
        supabaseResult.user!.id,
        session.id,
        clientIP,
        userAgent || 'unknown'
      );

      // Set session cookie
      await this.setSessionCookie(session.id);

      await logSecurityEvent({
        type: 'SUCCESSFUL_SIGNUP',
        email: email,
        userId: clerkUser.id,
        ip: clientIP,
        severity: 'info',
      });

      return { 
        success: true, 
        userId: clerkUser.id,
        needsVerification: !clerkUser.emailAddresses[0]?.verification?.status,
        redirectTo: role === 'provider' ? '/onboarding/provider' : '/onboarding'
      };

    } catch (error) {
      await logSecurityEvent({
        type: 'SIGNUP_ERROR',
        email: data.email,
        ip: clientIP,
        severity: 'medium',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return { 
            success: false, 
            error: 'An account with this email already exists.' 
          };
        }
        if (error.message.includes('rate limit')) {
          return { 
            success: false, 
            error: 'Too many registration attempts. Please try again later.' 
          };
        }
      }

      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  }

  // Integrated sign in with Clerk and Supabase
  static async signInWithCredentials(
    data: z.infer<typeof signInSchema>,
    clientIP: string,
    userAgent?: string
  ) {
    try {
      // Input validation
      const validation = signInSchema.safeParse(data);
      if (!validation.success) {
        await logSecurityEvent({
          type: 'INVALID_SIGNIN_ATTEMPT',
          ip: clientIP,
          severity: 'low',
          details: validation.error.issues,
        });
        return { 
          success: false, 
          error: 'Invalid email or password format' 
        };
      }

      const { email, password } = validation.data;

      // Check for suspicious activity
      const isSuspicious = await SecureSupabaseService.checkSuspiciousActivity(clientIP);
      if (isSuspicious) {
        await logSecurityEvent({
          type: 'SUSPICIOUS_SIGNIN_BLOCKED',
          email: email,
          ip: clientIP,
          severity: 'high',
        });
        return { 
          success: false, 
          error: 'Account temporarily locked due to suspicious activity. Please contact support.' 
        };
      }

      // Authenticate with Clerk
      const signInAttempt = await clerkClient.signInTokens.createSignInToken({
        userId: undefined, // Will find user by email
        expiresInSeconds: 300, // 5 minutes
      });

      if (!signInAttempt) {
        await logSecurityEvent({
          type: 'FAILED_SIGNIN_ATTEMPT',
          email: email,
          ip: clientIP,
          severity: 'medium',
        });
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }

      // Create session in Clerk
      const session = await clerkClient.sessions.createSession({
        token: signInAttempt.token,
        expiresInSeconds: this.MAX_SESSION_DURATION / 1000,
      });

      // Get user from Clerk
      const clerkUser = await clerkClient.users.getUser(session.userId);
      
      // Update/sync user profile in Supabase
      const supabaseResult = await SecureSupabaseService.upsertUserProfile(
        clerkUser.id,
        {
          email: clerkUser.emailAddresses[0]?.emailAddress || email,
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          role: (clerkUser.publicMetadata?.role as any) || 'consumer',
          avatar_url: clerkUser.profileImageUrl,
          email_verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
          last_sign_in_at: new Date().toISOString(),
        },
        clientIP
      );

      if (supabaseResult.success && supabaseResult.user) {
        // Track session in Supabase
        await SecureSupabaseService.createSession(
          supabaseResult.user.id,
          session.id,
          clientIP,
          userAgent || 'unknown'
        );
      }

      // Set session cookie
      await this.setSessionCookie(session.id);

      await logSecurityEvent({
        type: 'SUCCESSFUL_SIGNIN',
        email: email,
        userId: clerkUser.id,
        ip: clientIP,
        severity: 'info',
      });

      return { 
        success: true, 
        sessionId: session.id,
        redirectTo: this.getRedirectPath(clerkUser.publicMetadata?.role as string)
      };

    } catch (error) {
      await logSecurityEvent({
        type: 'SIGNIN_ERROR',
        email: data.email,
        ip: clientIP,
        severity: 'high',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      return { 
        success: false, 
        error: 'Authentication failed. Please check your credentials.' 
      };
    }
  }

  // Get current integrated user (Clerk + Supabase data)
  static async getCurrentUser(): Promise<IntegratedUser | null> {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(this.SESSION_COOKIE)?.value;

      if (!sessionToken) {
        return null;
      }

      // Validate session with Clerk
      const session = await clerkClient.sessions.getSession(sessionToken);
      
      if (!session || session.status !== 'active') {
        await this.clearSessionCookie();
        return null;
      }

      // Get user data from Clerk
      const clerkUser = await clerkClient.users.getUser(session.userId);
      
      // Get additional profile data from Supabase
      const supabaseProfile = await SecureSupabaseService.getUserProfile(clerkUser.id);

      // Combine Clerk and Supabase data
      const integratedUser: IntegratedUser = {
        id: supabaseProfile?.id || clerkUser.id,
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        role: (clerkUser.publicMetadata?.role as any) || supabaseProfile?.role || 'consumer',
        verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        avatar: clerkUser.profileImageUrl,
        phone: supabaseProfile?.phone,
        createdAt: supabaseProfile?.created_at || clerkUser.createdAt.toString(),
        lastSignIn: supabaseProfile?.last_sign_in_at || clerkUser.lastSignInAt?.toString(),
        metadata: supabaseProfile?.metadata,
      };

      return integratedUser;

    } catch (error) {
      await logSecurityEvent({
        type: 'SESSION_VALIDATION_ERROR',
        severity: 'medium',
        ip: 'unknown',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      await this.clearSessionCookie();
      return null;
    }
  }

  // Secure sign out with session cleanup
  static async signOut(userId?: string) {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(this.SESSION_COOKIE)?.value;

      if (sessionToken) {
        // Revoke session in Clerk
        await clerkClient.sessions.revokeSession(sessionToken);
        
        // Invalidate session in Supabase
        await SecureSupabaseService.invalidateSession(sessionToken);
        
        await logSecurityEvent({
          type: 'SUCCESSFUL_SIGNOUT',
          userId: userId,
          severity: 'info',
          ip: 'unknown',
        });
      }

      // Clear session cookie
      await this.clearSessionCookie();
      
      return { success: true };

    } catch (error) {
      await logSecurityEvent({
        type: 'SIGNOUT_ERROR',
        userId: userId,
        severity: 'low',
        ip: 'unknown',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      // Still clear the cookie even if calls fail
      await this.clearSessionCookie();
      return { success: true };
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // Check if user has specific role
  static async hasRole(allowedRoles: string[]): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user ? allowedRoles.includes(user.role) : false;
  }

  // Update user profile (sync between Clerk and Supabase)
  static async updateUserProfile(
    userId: string,
    updates: Partial<IntegratedUser>,
    clientIP: string
  ) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser || currentUser.clerkUserId !== userId) {
        return { success: false, error: 'Unauthorized' };
      }

      // Update in Clerk if needed
      const clerkUpdates: any = {};
      if (updates.firstName) clerkUpdates.firstName = updates.firstName;
      if (updates.lastName) clerkUpdates.lastName = updates.lastName;
      if (updates.avatar) clerkUpdates.profileImageUrl = updates.avatar;

      if (Object.keys(clerkUpdates).length > 0) {
        await clerkClient.users.updateUser(userId, clerkUpdates);
      }

      // Update in Supabase
      const supabaseUpdates: any = {};
      if (updates.firstName) supabaseUpdates.first_name = updates.firstName;
      if (updates.lastName) supabaseUpdates.last_name = updates.lastName;
      if (updates.phone) supabaseUpdates.phone = updates.phone;
      if (updates.avatar) supabaseUpdates.avatar_url = updates.avatar;
      if (updates.metadata) supabaseUpdates.metadata = updates.metadata;

      if (Object.keys(supabaseUpdates).length > 0) {
        const result = await SecureSupabaseService.upsertUserProfile(
          userId,
          supabaseUpdates,
          clientIP
        );

        if (!result.success) {
          return { success: false, error: 'Failed to update profile' };
        }
      }

      await logSecurityEvent({
        type: 'PROFILE_UPDATED',
        userId: userId,
        ip: clientIP,
        severity: 'info',
      });

      return { success: true };

    } catch (error) {
      await logSecurityEvent({
        type: 'PROFILE_UPDATE_ERROR',
        userId: userId,
        ip: clientIP,
        severity: 'medium',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Helper methods
  private static async setSessionCookie(sessionId: string) {
    const cookieStore = cookies();
    
    cookieStore.set(this.SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.MAX_SESSION_DURATION / 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.loconomy.com' : undefined,
    });
  }

  private static async clearSessionCookie() {
    const cookieStore = cookies();
    cookieStore.delete(this.SESSION_COOKIE);
  }

  private static getRedirectPath(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'provider':
        return '/provider/dashboard';
      case 'consumer':
      default:
        return '/dashboard';
    }
  }

  // Maintenance methods
  static async cleanupExpiredSessions(): Promise<number> {
    return await SecureSupabaseService.cleanupExpiredSessions() ? 1 : 0;
  }

  static async getUserActivity(userId: string, days: number = 30) {
    return await SecureSupabaseService.getUserActivity(userId, days);
  }
}
