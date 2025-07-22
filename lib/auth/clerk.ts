import { 
  SignInWithCredentialsParams,
  SignUpWithCredentialsParams,
  OAuthProvider,
} from '@clerk/types';
import { clerk } from '@clerk/nextjs';

// Custom auth functions that work with our existing UI
export class ClerkAuth {
  // Sign in with email and password
  static async signInWithCredentials(email: string, password: string) {
    try {
      const response = await clerk.client?.signIn.create({
        identifier: email,
        password,
      });
      
      if (response?.status === 'complete') {
        await clerk.setActive({
          session: response.createdSessionId,
        });
        return { success: true, user: response.userData };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || 'Authentication failed' 
      };
    }
  }

  // Sign up with email and password
  static async signUpWithCredentials(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) {
    try {
      const response = await clerk.client?.signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      if (response?.status === 'missing_requirements') {
        // Need email verification
        await response.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        return { 
          success: true, 
          needsVerification: true, 
          signUp: response 
        };
      }

      if (response?.status === 'complete') {
        await clerk.setActive({
          session: response.createdSessionId,
        });
        return { success: true, user: response.userData };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || 'Registration failed' 
      };
    }
  }

  // OAuth sign in (Google, GitHub, etc.)
  static async signInWithOAuth(provider: OAuthProvider) {
    try {
      await clerk.client?.signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/auth/loading',
        redirectUrlComplete: '/dashboard',
      });
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || `${provider} authentication failed` 
      };
    }
  }

  // Sign out
  static async signOut() {
    try {
      await clerk.signOut();
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || 'Sign out failed' 
      };
    }
  }

  // Get current user
  static getCurrentUser() {
    return clerk.user;
  }

  // Get current session
  static getCurrentSession() {
    return clerk.session;
  }

  // Check if user is signed in
  static isSignedIn() {
    return !!clerk.user;
  }
}