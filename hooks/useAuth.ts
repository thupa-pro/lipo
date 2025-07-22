"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Get current user from server
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear user state even if server call fails
      setUser(null);
      router.push('/');
    }
  };

  return {
    // User data
    user,
    isSignedIn: !!user,
    isLoading,
    
    // User properties
    userId: user?.id,
    email: user?.email,
    name: user?.name,
    firstName: user?.firstName,
    lastName: user?.lastName,
    role: user?.role,
    
    // Auth functions
    signOut,
  };
}