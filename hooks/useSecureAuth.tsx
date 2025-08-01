"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: string;
  verified: boolean;
  avatar?: string;
  createdAt: number;
  lastSignIn?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'consumer' | 'provider';
}

const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['consumer', 'provider']).default('consumer'),
});

export function useSecureAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const router = useRouter();

  // Get current user from server
  const getCurrentUser = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return userData;
      } else if (response.status === 401) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return null;
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Authentication error',
      });
      return null;
    }
  }, []);

  // Sign in function with validation
  const signIn = useCallback(async (data: SignInData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Client-side validation
      const validation = signInSchema.safeParse(data);
      if (!validation.success) {
        const errorMessage = validation.error.issues[0]?.message || 'Invalid input';
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));
        return { success: false, error: errorMessage };
      }

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh user data after successful sign in
        await getCurrentUser();
        
        // Redirect to intended destination or dashboard
        const redirectTo = result.redirectTo || '/dashboard';
        router.push(redirectTo);
        
        return { success: true };
      } else {
        const errorMessage = result.error || 'Sign in failed';
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, [getCurrentUser, router]);

  // Sign up function with validation
  const signUp = useCallback(async (data: SignUpData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Client-side validation
      const validation = signUpSchema.safeParse(data);
      if (!validation.success) {
        const errorMessage = validation.error.issues[0]?.message || 'Invalid input';
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));
        return { success: false, error: errorMessage };
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh user data after successful sign up
        await getCurrentUser();
        
        // Redirect based on verification needs
        const redirectTo = result.needsVerification 
          ? '/auth/verify-email' 
          : (result.redirectTo || '/onboarding');
        router.push(redirectTo);
        
        return { 
          success: true, 
          needsVerification: result.needsVerification 
        };
      } else {
        const errorMessage = result.error || 'Registration failed';
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, [getCurrentUser, router]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        router.push('/');
        return { success: true };
      } else {
        throw new Error('Sign out failed');
      }
    } catch (error) {
      // Still clear user state even if server call fails
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Sign out error',
      });
      router.push('/');
      return { success: false, error: 'Sign out failed' };
    }
  }, [router]);

  // Clear error function
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((roles: string | string[]) => {
    if (!authState.user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(authState.user.role);
  }, [authState.user]);

  // Check if user has permission
  const hasPermission = useCallback((permission: string) => {
    if (!authState.user) return false;
    
    // Define role-based permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'], // Admin has all permissions
      provider: [
        'manage_listings',
        'view_bookings',
        'manage_calendar',
        'view_earnings',
        'respond_to_reviews',
      ],
      consumer: [
        'book_services',
        'write_reviews',
        'view_bookings',
        'manage_profile',
      ],
      guest: [
        'browse_services',
        'view_providers',
      ],
    };

    const userPermissions = rolePermissions[authState.user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }, [authState.user]);

  // Initialize auth state on mount
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Auto-refresh user data periodically
  useEffect(() => {
    if (authState.isAuthenticated) {
      const interval = setInterval(() => {
        getCurrentUser();
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, getCurrentUser]);

  return {
    // State
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,

    // Actions
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    clearError,

    // Helpers
    hasRole,
    hasPermission,

    // User properties (for backward compatibility)
    userId: authState.user?.id,
    email: authState.user?.email,
    name: authState.user?.name,
    firstName: authState.user?.firstName,
    lastName: authState.user?.lastName,
    role: authState.user?.role,
    isVerified: authState.user?.verified,
    avatar: authState.user?.avatar,
  };
}
