"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams  } from "next/navigation";

export interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  avatar?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en'; // ✅ Get locale from params

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        // Handle direct user object or nested user object
        setUser(userData.user || userData);
      } else if (response.status === 401) {
        // Normal unauthenticated state - no error logging needed
        setUser(null);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Only log actual errors, not network issues or expected auth failures
      if (!(error instanceof TypeError && error.message.includes('fetch'))) {
        console.error('Failed to fetch user:', error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        router.push(`/${locale}/auth/signin`);
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isSignedIn: !!user,
    isLoading,
    userId: user?.id,
    email: user?.email,
    name: user?.name,
    firstName: user?.firstName,
    lastName: user?.lastName,
    role: user?.role,
    signOut,
    refetch: fetchUser,
  };
}
