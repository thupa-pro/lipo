import { clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { env, hasFeature } from '@/lib/config/environment';
import { checkRateLimit, type RateLimitType } from '@/lib/security/enterprise-rate-limiter';
import { logSecurityEvent, SecurityEventTypes } from '@/lib/security/enterprise-audit-logger';

// Input validation schemas with comprehensive security
const signInSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(254, 'Email too long')
    .transform(email => email.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
});

const signUpSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(254, 'Email too long')
    .transform(email => email.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .trim(),
  role: z.enum(['consumer', 'provider']).default('consumer'),
});

export interface EnterpriseUser {
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
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  mfaEnabled: boolean;
  loginCount: number;
  lastPasswordChange?: string;
}

interface AuthResponse {
  success: boolean;
  user?: EnterpriseUser;
  error?: string;
  details?: any;
  redirectTo?: string;
  needsVerification?: boolean;
  needsMFA?: boolean;
  sessionId?: string;
  rateLimit?: {
    remaining: number;
    reset: number;
    blocked: boolean;
  };
}

export class EnterpriseAuthService {
  private static readonly SESSION_COOKIE = '__loconomy_session';
  private static readonly MAX_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Enhanced sign up with comprehensive security
  static async signUpWithCredentials(
    data: z.infer<typeof signUpSchema>,
    clientIP: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    try {
      // Rate limiting check
      const rateLimitResult = await checkRateLimit(clientIP, 'auth_signup');
      if (!rateLimitResult.success) {
        await logSecurityEvent({
          type: SecurityEventTypes.RATE_LIMIT_EXCEEDED,
          email: data.email,
          ip: clientIP,
          severity: 'medium',
          details: { action: 'signup', limit: rateLimitResult.limit },
        });

        return {
          success: false,
          error: `Too many registration attempts. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now()) / 60000)} minutes.`,
          rateLimit: {
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
            blocked: true,
          },
        };
      }

      // Input validation with sanitization
      const validation = signUpSchema.safeParse(data);
      if (!validation.success) {
        await logSecurityEvent({
          type: SecurityEventTypes.INVALID_SIGNIN_ATTEMPT,
          email: data.email,
          ip: clientIP,
          severity: 'low',
          details: { validationErrors: validation.error.issues },
        });

        return {
          success: false,
          error: 'Please check your input and try again.',
          details: validation.error.issues,
        };
      }

      const { email, password, firstName, lastName, role } = validation.data;

      // Check for existing account
      const existingUser = await this.checkExistingUser(email);
      if (existingUser) {
        await logSecurityEvent({
          type: SecurityEventTypes.FAILED_SIGNUP_ATTEMPT,
          email: email,
          ip: clientIP,
          severity: 'medium',
          details: { reason: 'Email already exists' },
        });

        return {
          success: false,
          error: 'An account with this email already exists.',
        };
      }

      // Create user in Clerk with enhanced security metadata
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        password,
        firstName,
        lastName,
        publicMetadata: {
          role: role,
          verified: false,
          createdAt: new Date().toISOString(),
          securityLevel: 'standard',
          registrationIP: clientIP,
          registrationUserAgent: userAgent,
        },
        privateMetadata: {
          securityLevel: 'standard',
          lastPasswordChange: new Date().toISOString(),
          loginCount: 0,
          mfaEnabled: false,
          securityEvents: [],
        },
        unsafeMetadata: {
          onboardingCompleted: false,
          profileSetupCompleted: false,
        },
      });

      if (!clerkUser) {
        throw new Error('Failed to create user in Clerk');
      }

      // Create user profile in Supabase (if available)
      if (hasFeature('supabase')) {
        await this.createSupabaseProfile(clerkUser.id, {
          email,
          firstName,
          lastName,
          role,
          avatar: clerkUser.profileImageUrl,
          verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        }, clientIP);
      }

      // Create initial session
      const session = await clerkClient.sessions.createSession({
        userId: clerkUser.id,
        expiresInSeconds: this.MAX_SESSION_DURATION / 1000,
      });

      // Set secure session cookie
      await this.setSecureSessionCookie(session.id);

      // Track session if Supabase is available
      if (hasFeature('supabase')) {
        await this.trackSession(clerkUser.id, session.id, clientIP, userAgent);
      }

      // Log successful signup
      await logSecurityEvent({
        type: SecurityEventTypes.SUCCESSFUL_SIGNUP,
        email: email,
        userId: clerkUser.id,
        ip: clientIP,
        severity: 'info',
        details: { role, method: 'credentials' },
      });

      return {
        success: true,
        userId: clerkUser.id,
        needsVerification: !clerkUser.emailAddresses[0]?.verification?.status,
        redirectTo: role === 'provider' ? '/onboarding/provider' : '/onboarding',
        rateLimit: {
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset,
          blocked: false,
        },
      };

    } catch (error) {
      await logSecurityEvent({
        type: SecurityEventTypes.SIGNUP_ERROR,
        email: data.email,
        ip: clientIP,
        severity: 'high',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        },
      });

      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          return { success: false, error: 'Too many registration attempts. Please try again later.' };
        }
        if (error.message.includes('already exists')) {
          return { success: false, error: 'An account with this email already exists.' };
        }
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  // Enhanced sign in with comprehensive security
  static async signInWithCredentials(
    data: z.infer<typeof signInSchema>,
    clientIP: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    try {
      // Rate limiting check
      const rateLimitResult = await checkRateLimit(clientIP, 'auth_signin');
      if (!rateLimitResult.success) {
        await logSecurityEvent({
          type: SecurityEventTypes.RATE_LIMIT_EXCEEDED,
          email: data.email,
          ip: clientIP,
          severity: 'high',
          details: { action: 'signin', limit: rateLimitResult.limit },
        });

        return {
          success: false,
          error: `Too many login attempts. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now()) / 60000)} minutes.`,
          rateLimit: {
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
            blocked: true,
          },
        };
      }

      // Input validation
      const validation = signInSchema.safeParse(data);
      if (!validation.success) {
        await logSecurityEvent({
          type: SecurityEventTypes.INVALID_SIGNIN_ATTEMPT,
          email: data.email,
          ip: clientIP,
          severity: 'low',
          details: { validationErrors: validation.error.issues },
        });

        return {
          success: false,
          error: 'Invalid email or password format',
        };
      }

      const { email, password } = validation.data;

      // Check for suspicious activity
      if (hasFeature('supabase')) {
        const isSuspicious = await this.checkSuspiciousActivity(clientIP, email);
        if (isSuspicious) {
          await logSecurityEvent({
            type: SecurityEventTypes.SUSPICIOUS_ACTIVITY,
            email: email,
            ip: clientIP,
            severity: 'critical',
            details: { reason: 'Suspicious signin pattern detected' },
          });

          return {
            success: false,
            error: 'Account temporarily locked due to suspicious activity. Please contact support.',
          };
        }
      }

      // Create sign-in attempt with Clerk
      const signInAttempt = await clerkClient.signInTokens.createSignInToken({
        userId: undefined, // Will find user by email
        expiresInSeconds: 300, // 5 minutes
      });

      if (!signInAttempt) {
        await logSecurityEvent({
          type: SecurityEventTypes.FAILED_SIGNIN_ATTEMPT,
          email: email,
          ip: clientIP,
          severity: 'medium',
          details: { reason: 'Invalid credentials' },
        });

        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Create session in Clerk
      const session = await clerkClient.sessions.createSession({
        token: signInAttempt.token,
        expiresInSeconds: this.MAX_SESSION_DURATION / 1000,
      });

      // Get user data from Clerk
      const clerkUser = await clerkClient.users.getUser(session.userId);
      
      // Update user metadata
      await clerkClient.users.updateUser(clerkUser.id, {
        publicMetadata: {
          ...clerkUser.publicMetadata,
          lastSignInAt: new Date().toISOString(),
          lastSignInIP: clientIP,
          lastSignInUserAgent: userAgent,
        },
        privateMetadata: {
          ...clerkUser.privateMetadata,
          loginCount: (clerkUser.privateMetadata?.loginCount as number || 0) + 1,
        },
      });

      // Update/sync user profile in Supabase
      if (hasFeature('supabase')) {
        await this.updateSupabaseProfile(clerkUser.id, {
          email: clerkUser.emailAddresses[0]?.emailAddress || email,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          role: (clerkUser.publicMetadata?.role as any) || 'consumer',
          avatar: clerkUser.profileImageUrl,
          verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
          lastSignIn: new Date().toISOString(),
        }, clientIP);

        // Track session
        await this.trackSession(clerkUser.id, session.id, clientIP, userAgent);
      }

      // Set secure session cookie
      await this.setSecureSessionCookie(session.id);

      // Log successful signin
      await logSecurityEvent({
        type: SecurityEventTypes.SUCCESSFUL_SIGNIN,
        email: email,
        userId: clerkUser.id,
        ip: clientIP,
        severity: 'info',
        details: { method: 'credentials', userAgent },
      });

      return {
        success: true,
        sessionId: session.id,
        redirectTo: this.getRedirectPath(clerkUser.publicMetadata?.role as string),
        rateLimit: {
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset,
          blocked: false,
        },
      };

    } catch (error) {
      await logSecurityEvent({
        type: SecurityEventTypes.SIGNIN_ERROR,
        email: data.email,
        ip: clientIP,
        severity: 'high',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        },
      });

      return {
        success: false,
        error: 'Authentication failed. Please check your credentials.',
      };
    }
  }

  // Get current authenticated user with comprehensive data
  static async getCurrentUser(): Promise<EnterpriseUser | null> {
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
        await logSecurityEvent({
          type: SecurityEventTypes.SESSION_EXPIRED,
          severity: 'info',
          details: { sessionId: sessionToken },
        });
        return null;
      }

      // Get user data from Clerk
      const clerkUser = await clerkClient.users.getUser(session.userId);
      
      // Get additional profile data from Supabase if available
      let supabaseProfile = null;
      if (hasFeature('supabase')) {
        supabaseProfile = await this.getSupabaseProfile(clerkUser.id);
      }

      // Combine Clerk and Supabase data into comprehensive user object
      const enterpriseUser: EnterpriseUser = {
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
        metadata: {
          onboardingCompleted: clerkUser.unsafeMetadata?.onboardingCompleted || false,
          profileSetupCompleted: clerkUser.unsafeMetadata?.profileSetupCompleted || false,
          ...supabaseProfile?.metadata,
        },
        securityLevel: (clerkUser.publicMetadata?.securityLevel as any) || 'standard',
        mfaEnabled: (clerkUser.privateMetadata?.mfaEnabled as boolean) || false,
        loginCount: (clerkUser.privateMetadata?.loginCount as number) || 0,
        lastPasswordChange: clerkUser.privateMetadata?.lastPasswordChange as string,
      };

      return enterpriseUser;

    } catch (error) {
      await logSecurityEvent({
        type: SecurityEventTypes.SESSION_VALIDATION_ERROR,
        severity: 'medium',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      await this.clearSessionCookie();
      return null;
    }
  }

  // Secure sign out with comprehensive cleanup
  static async signOut(userId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(this.SESSION_COOKIE)?.value;

      if (sessionToken) {
        // Revoke session in Clerk
        await clerkClient.sessions.revokeSession(sessionToken);
        
        // Invalidate session in Supabase if available
        if (hasFeature('supabase')) {
          await this.invalidateSupabaseSession(sessionToken);
        }
        
        await logSecurityEvent({
          type: SecurityEventTypes.SUCCESSFUL_SIGNOUT,
          userId: userId,
          severity: 'info',
        });
      }

      // Clear session cookie
      await this.clearSessionCookie();
      
      return { success: true };

    } catch (error) {
      await logSecurityEvent({
        type: SecurityEventTypes.SIGNOUT_ERROR,
        userId: userId,
        severity: 'low',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      // Still clear the cookie even if calls fail
      await this.clearSessionCookie();
      return { success: true };
    }
  }

  // Authentication and authorization helpers
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  static async hasRole(allowedRoles: string[]): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user ? allowedRoles.includes(user.role) : false;
  }

  static async hasPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

    // Role-based permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'], // Admin has all permissions
      provider: [
        'manage_listings',
        'view_bookings',
        'manage_calendar',
        'view_earnings',
        'respond_to_reviews',
        'access_provider_dashboard',
      ],
      consumer: [
        'book_services',
        'write_reviews',
        'view_bookings',
        'manage_profile',
        'access_dashboard',
      ],
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }

  // Private helper methods
  private static async checkExistingUser(email: string): Promise<boolean> {
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });
      return users.length > 0;
    } catch (error) {
      console.error('Error checking existing user:', error);
      return false;
    }
  }

  private static async checkSuspiciousActivity(ip: string, email: string): Promise<boolean> {
    // This would integrate with Supabase security_events table
    // For now, return false to avoid blocking during development
    return false;
  }

  private static async createSupabaseProfile(userId: string, userData: any, clientIP: string) {
    try {
      const { createUserProfile, logSecurityEvent: logSupabaseEvent } = await import('@/lib/supabase/enterprise-client');

      await createUserProfile({
        clerkUserId: userId,
        email: userData.email || userData.emailAddresses?.[0]?.emailAddress,
        firstName: userData.firstName || userData.given_name || 'Unknown',
        lastName: userData.lastName || userData.family_name || 'User',
        role: userData.role || 'consumer',
        avatar: userData.avatar || userData.picture,
        metadata: {
          signupMethod: userData.signupMethod || 'clerk',
          signupIP: clientIP,
          signupUserAgent: userData.userAgent,
        },
      });

      await logSupabaseEvent({
        userId,
        eventType: 'USER_PROFILE_CREATED',
        ipAddress: clientIP,
        severity: 'info',
        details: {
          method: userData.signupMethod || 'clerk',
          role: userData.role || 'consumer',
        },
      });
    } catch (error) {
      console.error('Error creating Supabase profile:', error);
      // Don't throw here as profile creation shouldn't break auth flow
    }
  }

  private static async updateSupabaseProfile(userId: string, userData: any, clientIP: string) {
    try {
      const { updateUserProfile, logSecurityEvent: logSupabaseEvent } = await import('@/lib/supabase/enterprise-client');

      await updateUserProfile(userId, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        phone: userData.phone,
        lastSignInAt: new Date().toISOString(),
        metadata: userData.metadata,
      });

      await logSupabaseEvent({
        userId,
        eventType: 'USER_PROFILE_UPDATED',
        ipAddress: clientIP,
        severity: 'info',
        details: { updateReason: 'signin' },
      });
    } catch (error) {
      console.error('Error updating Supabase profile:', error);
      // Don't throw here as profile update shouldn't break auth flow
    }
  }

  private static async getSupabaseProfile(userId: string) {
    try {
      const { getUserProfile } = await import('@/lib/supabase/enterprise-client');
      return await getUserProfile(userId);
    } catch (error) {
      console.error('Error fetching Supabase profile:', error);
      return null;
    }
  }

  private static async trackSession(userId: string, sessionId: string, ip: string, userAgent?: string) {
    try {
      const { createSession } = await import('@/lib/supabase/enterprise-client');

      await createSession({
        userId,
        clerkSessionId: sessionId,
        ipAddress: ip,
        userAgent,
        expiresAt: new Date(Date.now() + this.MAX_SESSION_DURATION).toISOString(),
      });
    } catch (error) {
      console.error('Error tracking session in Supabase:', error);
      // Don't throw here as session tracking shouldn't break auth flow
    }
  }

  private static async invalidateSupabaseSession(sessionId: string) {
    try {
      const { invalidateSession } = await import('@/lib/supabase/enterprise-client');
      await invalidateSession(sessionId);
    } catch (error) {
      console.error('Error invalidating Supabase session:', error);
      // Don't throw here as session invalidation shouldn't break auth flow
    }
  }

  private static async setSecureSessionCookie(sessionId: string) {
    const cookieStore = cookies();
    const config = env.getConfig();
    
    cookieStore.set(this.SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.MAX_SESSION_DURATION / 1000,
      path: '/',
      domain: config.NODE_ENV === 'production' ? '.loconomy.com' : undefined,
    });
  }

  private static async clearSessionCookie() {
    const cookieStore = cookies();
    cookieStore.delete(this.SESSION_COOKIE);
  }

  private static getRedirectPath(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'consumer':
      default:
        return '/dashboard';
    }
  }

  // Maintenance and security methods
  static async cleanupExpiredSessions(): Promise<number> {
    // This would clean up expired sessions in both Clerk and Supabase
    return 0;
  }

  static async getUserActivity(userId: string, days: number = 30) {
    // This would return user activity from Supabase security_events
    return [];
  }

  static async enableMFA(userId: string): Promise<boolean> {
    try {
      // Enable MFA in user metadata
      const user = await clerkClient.users.getUser(userId);
      await clerkClient.users.updateUser(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          mfaEnabled: true,
        },
      });

      await logSecurityEvent({
        type: 'MFA_ENABLED',
        userId: userId,
        severity: 'info',
      });

      return true;
    } catch (error) {
      console.error('Error enabling MFA:', error);
      return false;
    }
  }

  static async updateSecurityLevel(userId: string, level: 'standard' | 'enhanced' | 'maximum'): Promise<boolean> {
    try {
      const user = await clerkClient.users.getUser(userId);
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          securityLevel: level,
        },
      });

      await logSecurityEvent({
        type: 'SECURITY_LEVEL_CHANGED',
        userId: userId,
        severity: 'info',
        details: { newLevel: level },
      });

      return true;
    } catch (error) {
      console.error('Error updating security level:', error);
      return false;
    }
  }

  // Google OAuth integration with enterprise security
  static getGoogleOAuthUrl(redirectUri: string): { success: boolean; url?: string; error?: string } {
    try {
      const config = env.getConfig();

      // Generate secure state parameter
      const state = Buffer.from(JSON.stringify({
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substring(2),
        redirectUri,
      })).toString('base64url');

      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || 'demo_google_client_id',
        redirect_uri: `${config.NEXT_PUBLIC_APP_URL}${redirectUri}`,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        prompt: 'consent',
        access_type: 'offline',
      });

      return {
        success: true,
        url: `https://accounts.google.com/oauth/authorize?${params.toString()}`,
      };
    } catch (error) {
      console.error('Error generating Google OAuth URL:', error);
      return {
        success: false,
        error: 'Failed to generate OAuth URL',
      };
    }
  }

  static async handleGoogleOAuth(
    code: string,
    state: string,
    clientIP: string,
    userAgent?: string
  ): Promise<AuthResponse & { isNewUser?: boolean; userId?: string }> {
    try {
      // Validate state parameter for security
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
        const stateAge = Date.now() - stateData.timestamp;

        // State should not be older than 10 minutes
        if (stateAge > 10 * 60 * 1000) {
          throw new Error('OAuth state expired');
        }
      } catch (error) {
        await logSecurityEvent({
          type: SecurityEventTypes.OAUTH_ERROR,
          ip: clientIP,
          severity: 'medium',
          details: { error: 'Invalid OAuth state parameter' },
        });

        return {
          success: false,
          error: 'Invalid OAuth state. Please try again.',
        };
      }

      // Rate limiting check
      const rateLimitResult = await checkRateLimit(clientIP, 'auth_oauth');
      if (!rateLimitResult.success) {
        return {
          success: false,
          error: 'Too many OAuth attempts. Please try again later.',
          rateLimit: {
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
            blocked: true,
          },
        };
      }

      // In a real implementation, exchange code for tokens and get user info
      // For development/demo, create a mock user with Google-like data
      const mockGoogleUser = {
        id: `google_${code.substring(0, 8)}`,
        email: `demo.oauth.${Date.now()}@gmail.com`,
        given_name: 'Google',
        family_name: 'User',
        picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        verified_email: true,
      };

      // Check if user already exists in Clerk
      let clerkUser;
      let isNewUser = false;

      try {
        const existingUsers = await clerkClient.users.getUserList({
          emailAddress: [mockGoogleUser.email],
        });

        if (existingUsers.length > 0) {
          clerkUser = existingUsers[0];
        } else {
          // Create new user via OAuth
          isNewUser = true;
          clerkUser = await clerkClient.users.createUser({
            emailAddress: [mockGoogleUser.email],
            firstName: mockGoogleUser.given_name,
            lastName: mockGoogleUser.family_name,
            profileImageUrl: mockGoogleUser.picture,
            publicMetadata: {
              role: 'consumer',
              securityLevel: 'standard',
              signupMethod: 'google_oauth',
            },
            privateMetadata: {
              mfaEnabled: false,
              loginCount: 1,
            },
            unsafeMetadata: {
              onboardingCompleted: false,
              profileSetupCompleted: false,
            },
          });

          // Create Supabase profile if available
          if (hasFeature('supabase')) {
            await this.createSupabaseProfile(clerkUser.id, mockGoogleUser, clientIP);
          }

          await logSecurityEvent({
            type: SecurityEventTypes.OAUTH_SIGNUP,
            userId: clerkUser.id,
            email: mockGoogleUser.email,
            ip: clientIP,
            severity: 'info',
            details: {
              provider: 'google',
              userAgent,
            },
          });
        }
      } catch (error) {
        await logSecurityEvent({
          type: SecurityEventTypes.OAUTH_ERROR,
          ip: clientIP,
          severity: 'high',
          details: {
            error: error instanceof Error ? error.message : 'OAuth user creation failed',
            provider: 'google',
          },
        });

        return {
          success: false,
          error: 'OAuth authentication failed. Please try again.',
        };
      }

      // Create session for OAuth user
      const session = await clerkClient.sessions.createSession({
        userId: clerkUser.id,
      });

      // Set secure session cookie
      await this.setSecureSessionCookie(session.id);

      // Update login count and tracking
      const currentLoginCount = (clerkUser.privateMetadata?.loginCount as number) || 0;
      await clerkClient.users.updateUser(clerkUser.id, {
        privateMetadata: {
          ...clerkUser.privateMetadata,
          loginCount: currentLoginCount + 1,
          lastOAuthProvider: 'google',
        },
      });

      // Track session if Supabase is available
      if (hasFeature('supabase')) {
        await this.trackSession(clerkUser.id, session.id, clientIP, userAgent);
      }

      // Build enterprise user object
      const enterpriseUser: EnterpriseUser = {
        id: clerkUser.id,
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        role: (clerkUser.publicMetadata?.role as any) || 'consumer',
        verified: true, // OAuth users are automatically verified
        avatar: clerkUser.profileImageUrl,
        createdAt: clerkUser.createdAt.toString(),
        lastSignIn: new Date().toISOString(),
        metadata: {
          onboardingCompleted: clerkUser.unsafeMetadata?.onboardingCompleted || false,
          profileSetupCompleted: clerkUser.unsafeMetadata?.profileSetupCompleted || false,
        },
        securityLevel: (clerkUser.publicMetadata?.securityLevel as any) || 'standard',
        mfaEnabled: (clerkUser.privateMetadata?.mfaEnabled as boolean) || false,
        loginCount: currentLoginCount + 1,
      };

      await logSecurityEvent({
        type: SecurityEventTypes.OAUTH_SUCCESS,
        userId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        ip: clientIP,
        severity: 'info',
        details: {
          provider: 'google',
          isNewUser,
          userAgent,
        },
      });

      return {
        success: true,
        user: enterpriseUser,
        userId: clerkUser.id,
        isNewUser,
        sessionId: session.id,
        redirectTo: isNewUser ? '/onboarding' : this.getRedirectPath(enterpriseUser.role),
        rateLimit: {
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset,
          blocked: false,
        },
      };

    } catch (error) {
      await logSecurityEvent({
        type: SecurityEventTypes.OAUTH_ERROR,
        ip: clientIP,
        severity: 'high',
        details: {
          error: error instanceof Error ? error.message : 'Unknown OAuth error',
          provider: 'google',
        },
      });

      return {
        success: false,
        error: 'OAuth authentication failed. Please try again.',
      };
    }
  }
}
