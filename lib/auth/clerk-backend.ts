import { clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export class ClerkBackendAuth {
  // Sign in with email and password using Clerk's backend API
  static async signInWithCredentials(email: string, password: string) {
    try {
      // Use Clerk's backend API to authenticate
      const response = await fetch('https://api.clerk.com/v1/sign_ins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'complete') {
        // Set session cookie
        await this.setSessionCookie(data.created_session_id);
        return { success: true, sessionId: data.created_session_id };
      }

      return { 
        success: false, 
        error: data.errors?.[0]?.long_message || 'Invalid credentials' 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: 'Authentication failed. Please try again.' 
      };
    }
  }

  // Sign up with email and password using Clerk's backend API
  static async signUpWithCredentials(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    role: string = 'CUSTOMER'
  ) {
    try {
      // Create user in Clerk
      const response = await fetch('https://api.clerk.com/v1/sign_ups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          password,
          first_name: firstName,
          last_name: lastName,
          unsafe_metadata: {
            role: role
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'missing_requirements') {
          // Need email verification
          await this.prepareEmailVerification(data.id);
          return { 
            success: true, 
            needsVerification: true, 
            signUpId: data.id 
          };
        }

        if (data.status === 'complete') {
          // Account created and verified
          await this.setSessionCookie(data.created_session_id);
          return { success: true, sessionId: data.created_session_id };
        }
      }

      return { 
        success: false, 
        error: data.errors?.[0]?.long_message || 'Registration failed' 
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  }

  // Generate OAuth URL for Google sign in
  static async getGoogleOAuthUrl(redirectUrl: string = '/auth/oauth-callback') {
    try {
      const response = await fetch('https://api.clerk.com/v1/oauth_applications/google/authorize_url', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${redirectUrl}`,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, url: data.authorize_url };
      }

      return { success: false, error: 'Failed to generate OAuth URL' };
    } catch (error) {
      console.error('OAuth URL generation error:', error);
      return { success: false, error: 'OAuth setup failed' };
    }
  }

  // Handle OAuth callback
  static async handleOAuthCallback(code: string, state?: string) {
    try {
      const response = await fetch('https://api.clerk.com/v1/oauth_callback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          state,
        }),
      });

      const data = await response.json();

      if (response.ok && data.session_id) {
        await this.setSessionCookie(data.session_id);
        return { success: true, sessionId: data.session_id };
      }

      return { success: false, error: 'OAuth authentication failed' };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return { success: false, error: 'OAuth authentication failed' };
    }
  }

  // Set session cookie
  private static async setSessionCookie(sessionId: string) {
    const cookieStore = cookies();
    cookieStore.set('__session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  // Get current user from session
  static async getCurrentUser() {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get('__session')?.value;

      if (!sessionToken) {
        return null;
      }

      // Verify session with Clerk
      const session = await clerkClient.sessions.getSession(sessionToken);
      
      if (session && session.userId) {
        const user = await clerkClient.users.getUser(session.userId);
        return {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.unsafeMetadata?.role || 'CUSTOMER',
        };
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Sign out
  static async signOut() {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get('__session')?.value;

      if (sessionToken) {
        // Revoke session in Clerk
        await clerkClient.sessions.revokeSession(sessionToken);
      }

      // Clear session cookie
      cookieStore.delete('__session');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear the cookie even if Clerk call fails
      const cookieStore = cookies();
      cookieStore.delete('__session');
      return { success: true };
    }
  }

  // Check if user is authenticated
  static async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // Prepare email verification
  private static async prepareEmailVerification(signUpId: string) {
    try {
      await fetch(`https://api.clerk.com/v1/sign_ups/${signUpId}/prepare_verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategy: 'email_code',
        }),
      });
    } catch (error) {
      console.error('Email verification preparation error:', error);
    }
  }

  // Verify email with code
  static async verifyEmail(signUpId: string, code: string) {
    try {
      const response = await fetch(`https://api.clerk.com/v1/sign_ups/${signUpId}/attempt_verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategy: 'email_code',
          code,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'complete') {
        await this.setSessionCookie(data.created_session_id);
        return { success: true, sessionId: data.created_session_id };
      }

      return { 
        success: false, 
        error: data.errors?.[0]?.long_message || 'Invalid verification code' 
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  }
}