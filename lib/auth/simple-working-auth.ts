import { z } from 'zod';

// Simple user interface for development
export interface SimpleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: 'consumer' | 'provider' | 'admin';
  verified: boolean;
  avatar?: string;
  createdAt: string;
  lastSignIn?: string;
}

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  role: z.enum(['consumer', 'provider']).default('consumer'),
});

// In-memory user store for development (replace with real database)
const users = new Map<string, SimpleUser & { password: string }>();
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

// Helper to generate simple IDs
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Helper to generate session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

// Helper to hash password (simple for development - use bcrypt in production)
function hashPassword(password: string): string {
  // Simple hash for development - use proper bcrypt in production
  return Buffer.from(password).toString('base64');
}

// Helper to verify password
function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export class SimpleWorkingAuth {
  static async signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'consumer' | 'provider';
  }) {
    try {
      // Validate input
      const validation = signUpSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.issues[0]?.message || 'Invalid input',
        };
      }

      const { email, password, firstName, lastName, role } = validation.data;

      // Check if user already exists
      for (const [, user] of users) {
        if (user.email === email) {
          return {
            success: false,
            error: 'User already exists with this email',
          };
        }
      }

      // Create new user
      const userId = generateId();
      const user: SimpleUser & { password: string } = {
        id: userId,
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        role: role || 'consumer',
        verified: true, // Auto-verify for development
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      users.set(userId, user);

      // Create session
      const sessionToken = generateSessionToken();
      sessions.set(sessionToken, {
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return {
        success: true,
        userId,
        sessionToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          role: user.role,
          verified: user.verified,
          createdAt: user.createdAt,
        },
        redirectTo: role === 'provider' ? '/onboarding' : '/dashboard',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed',
      };
    }
  }

  static async signIn(data: { email: string; password: string }) {
    try {
      // Validate input
      const validation = signInSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.issues[0]?.message || 'Invalid input',
        };
      }

      const { email, password } = validation.data;

      // Find user by email
      let foundUser: (SimpleUser & { password: string }) | null = null;
      for (const [, user] of users) {
        if (user.email === email) {
          foundUser = user;
          break;
        }
      }

      if (!foundUser) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Verify password
      if (!verifyPassword(password, foundUser.password)) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Update last sign in
      foundUser.lastSignIn = new Date().toISOString();
      users.set(foundUser.id, foundUser);

      // Create session
      const sessionToken = generateSessionToken();
      sessions.set(sessionToken, {
        userId: foundUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return {
        success: true,
        sessionToken,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          name: foundUser.name,
          role: foundUser.role,
          verified: foundUser.verified,
          createdAt: foundUser.createdAt,
          lastSignIn: foundUser.lastSignIn,
        },
        redirectTo: foundUser.role === 'admin' ? '/admin/dashboard' : 
                   foundUser.role === 'provider' ? '/provider/dashboard' : 
                   '/dashboard',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Sign in failed',
      };
    }
  }

  static async getCurrentUser(sessionToken: string) {
    try {
      const session = sessions.get(sessionToken);
      if (!session) {
        return null;
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        sessions.delete(sessionToken);
        return null;
      }

      const user = users.get(session.userId);
      if (!user) {
        sessions.delete(sessionToken);
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        role: user.role,
        verified: user.verified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastSignIn: user.lastSignIn,
      };
    } catch (error) {
      return null;
    }
  }

  static async signOut(sessionToken: string) {
    try {
      sessions.delete(sessionToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Sign out failed' };
    }
  }

  static async isAuthenticated(sessionToken: string) {
    const user = await this.getCurrentUser(sessionToken);
    return !!user;
  }

  // Google OAuth methods (simplified)
  static getGoogleOAuthUrl(redirectUri: string) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}${redirectUri}`,
      response_type: 'code',
      scope: 'openid email profile',
      state: generateId(),
    });

    return {
      success: true,
      url: `https://accounts.google.com/oauth/authorize?${params.toString()}`,
    };
  }

  static async handleGoogleOAuth(code: string, state: string) {
    try {
      // In a real implementation, you'd exchange the code for tokens
      // and get user info from Google API
      // For development, we'll create a demo user
      
      const demoUser = {
        email: `demo.${generateId()}@gmail.com`,
        firstName: 'Demo',
        lastName: 'User',
        role: 'consumer' as const,
      };

      // Create user if not exists
      const signUpResult = await this.signUp({
        ...demoUser,
        password: 'DemoPassword123!', // Auto-generated for OAuth users
      });

      if (signUpResult.success) {
        return signUpResult;
      } else {
        // User might already exist, try to sign them in
        return {
          success: true,
          sessionToken: generateSessionToken(),
          user: demoUser,
          redirectTo: '/dashboard',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Google OAuth failed',
      };
    }
  }

  // Initialize with demo users for testing
  static initializeDemo() {
    // Create demo admin user
    const adminId = generateId();
    users.set(adminId, {
      id: adminId,
      email: 'admin@loconomy.com',
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      role: 'admin',
      verified: true,
      password: hashPassword('Admin123!'),
      createdAt: new Date().toISOString(),
    });

    // Create demo provider user
    const providerId = generateId();
    users.set(providerId, {
      id: providerId,
      email: 'provider@loconomy.com',
      firstName: 'Provider',
      lastName: 'User',
      name: 'Provider User',
      role: 'provider',
      verified: true,
      password: hashPassword('Provider123!'),
      createdAt: new Date().toISOString(),
    });

    // Create demo consumer user
    const consumerId = generateId();
    users.set(consumerId, {
      id: consumerId,
      email: 'user@loconomy.com',
      firstName: 'Demo',
      lastName: 'User',
      name: 'Demo User',
      role: 'consumer',
      verified: true,
      password: hashPassword('User123!'),
      createdAt: new Date().toISOString(),
    });

    console.log('🔧 Demo users created:');
    console.log('👤 Admin: admin@loconomy.com / Admin123!');
    console.log('🏪 Provider: provider@loconomy.com / Provider123!');
    console.log('👥 Consumer: user@loconomy.com / User123!');
  }
}

// Initialize demo users
SimpleWorkingAuth.initializeDemo();
