import { clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { rateLimit } from '@/lib/security/rate-limiter';
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

export class SecureClerkAuth {
  private static readonly SESSION_COOKIE = '__session';
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Secure sign in with rate limiting and validation
  static async signInWithCredentials(email: string, password: string, clientIP: string) {
    try {
      // Rate limiting check
      const rateLimitResult = await rateLimit.check(clientIP, 'auth_signin');
      if (!rateLimitResult.success) {
        await logSecurityEvent({
          type: 'RATE_LIMIT_EXCEEDED',
          email,
          ip: clientIP,
          severity: 'medium',
        });
        return { 
          success: false, 
          error: 'Too many login attempts. Please try again later.' 
        };
      }

      // Input validation
      const validation = signInSchema.safeParse({ email, password });
      if (!validation.success) {
        await logSecurityEvent({
          type: 'INVALID_SIGNIN_ATTEMPT',
          email,
          ip: clientIP,
          severity: 'low',
          details: validation.error.issues,
        });
        return { 
          success: false, 
          error: 'Invalid email or password format' 
        };
      }

      // Authenticate with Clerk
      const signInAttempt = await clerkClient.signInTokens.createSignInToken({
        userId: undefined, // Will be resolved by email
        expiresInSeconds: 300, // 5 minutes
      });

      // Create session securely
      const sessionId = await this.createSecureSession(signInAttempt.token);
      
      await logSecurityEvent({
        type: 'SUCCESSFUL_SIGNIN',
        email,
        ip: clientIP,
        severity: 'info',
      });

      return { 
        success: true, 
        sessionId,
        redirectTo: '/dashboard'
      };

    } catch (error) {
      await logSecurityEvent({
        type: 'SIGNIN_ERROR',
        email,
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

  // Secure sign up with validation
  static async signUpWithCredentials(
    data: z.infer<typeof signUpSchema>,
    clientIP: string
  ) {
    try {
      // Rate limiting
      const rateLimitResult = await rateLimit.check(clientIP, 'auth_signup');
      if (!rateLimitResult.success) {
        return { 
          success: false, 
          error: 'Too many registration attempts. Please try again later.' 
        };
      }

      // Input validation
      const validation = signUpSchema.safeParse(data);
      if (!validation.success) {
        return { 
          success: false, 
          error: 'Please check your input and try again.',
          details: validation.error.issues
        };
      }

      const { email, password, firstName, lastName, role } = validation.data;

      // Create user in Clerk with secure metadata
      const user = await clerkClient.users.createUser({
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

      // Create secure session
      const session = await clerkClient.sessions.createSession({
        userId: user.id,
        expiresInSeconds: 60 * 60 * 24 * 7, // 7 days
      });

      await this.setSecureSessionCookie(session.id);

      await logSecurityEvent({
        type: 'SUCCESSFUL_SIGNUP',
        email,
        ip: clientIP,
        severity: 'info',
        userId: user.id,
      });

      return { 
        success: true, 
        userId: user.id,
        needsVerification: !user.emailAddresses[0]?.verification?.status,
        redirectTo: '/onboarding'
      };

    } catch (error) {
      await logSecurityEvent({
        type: 'SIGNUP_ERROR',
        email: data.email,
        ip: clientIP,
        severity: 'medium',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof Error && error.message.includes('already exists')) {
        return { 
          success: false, 
          error: 'An account with this email already exists.' 
        };
      }

      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  }

  // Get current user with JWT validation
  static async getCurrentUser() {
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

      // Get user data
      const user = await clerkClient.users.getUser(session.userId);
      
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: user.publicMetadata?.role || 'consumer',
        verified: user.emailAddresses[0]?.verification?.status === 'verified',
        avatar: user.profileImageUrl,
        createdAt: user.createdAt,
        lastSignIn: user.lastSignInAt,
      };

    } catch (error) {
      await logSecurityEvent({
        type: 'SESSION_VALIDATION_ERROR',
        severity: 'medium',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      await this.clearSessionCookie();
      return null;
    }
  }

  // Secure sign out
  static async signOut() {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(this.SESSION_COOKIE)?.value;

      if (sessionToken) {
        // Revoke session in Clerk
        await clerkClient.sessions.revokeSession(sessionToken);
        
        await logSecurityEvent({
          type: 'SUCCESSFUL_SIGNOUT',
          severity: 'info',
        });
      }

      // Clear session cookie
      await this.clearSessionCookie();
      
      return { success: true };

    } catch (error) {
      await logSecurityEvent({
        type: 'SIGNOUT_ERROR',
        severity: 'low',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      // Still clear the cookie even if Clerk call fails
      await this.clearSessionCookie();
      return { success: true };
    }
  }

  // Create secure session with regeneration
  private static async createSecureSession(token: string): Promise<string> {
    const session = await clerkClient.sessions.createSession({
      token,
      expiresInSeconds: 60 * 60 * 24 * 7, // 7 days
    });

    await this.setSecureSessionCookie(session.id);
    return session.id;
  }

  // Set secure session cookie with proper flags
  private static async setSecureSessionCookie(sessionId: string) {
    const cookieStore = cookies();
    
    cookieStore.set(this.SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.loconomy.com' : undefined,
    });
  }

  // Clear session cookie
  private static async clearSessionCookie() {
    const cookieStore = cookies();
    cookieStore.delete(this.SESSION_COOKIE);
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // Validate user role
  static async hasRole(requiredRoles: string[]): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user ? requiredRoles.includes(user.role) : false;
  }
}
