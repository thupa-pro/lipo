import { cookies } from 'next/headers';

export interface SimpleUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: string;
  verified: boolean;
}

export class SimpleAuthService {
  private static readonly SESSION_COOKIE = '__session';

  // Simple authentication check
  static async isAuthenticated(): Promise<boolean> {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(this.SESSION_COOKIE)?.value;
      return !!sessionToken;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Simple user check
  static async getCurrentUser(): Promise<SimpleUser | null> {
    try {
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(this.SESSION_COOKIE)?.value;
      
      if (!sessionToken) {
        return null;
      }

      // For now, return a mock user to test functionality
      return {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        name: 'Test User',
        role: 'consumer',
        verified: true,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Simple role check
  static async hasRole(allowedRoles: string[]): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user ? allowedRoles.includes(user.role) : false;
    } catch (error) {
      console.error('Role check error:', error);
      return false;
    }
  }

  // Set session cookie
  static async setSessionCookie(sessionId: string) {
    try {
      const cookieStore = cookies();
      cookieStore.set(this.SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    } catch (error) {
      console.error('Set cookie error:', error);
    }
  }

  // Clear session cookie
  static async clearSessionCookie() {
    try {
      const cookieStore = cookies();
      cookieStore.delete(this.SESSION_COOKIE);
    } catch (error) {
      console.error('Clear cookie error:', error);
    }
  }
}
