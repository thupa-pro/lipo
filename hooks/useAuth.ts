"use client";

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isLoading,
    isSignedIn: !!user,
    // User properties for backward compatibility
    userId: user?.id,
    email: user?.email,
    name: user?.name,
    firstName: user?.firstName,
    lastName: user?.lastName,
    role: user?.role,
    
    // Auth functions (placeholders for now)
    signOut: () => {
      setUser(null);
    },
  };
}
