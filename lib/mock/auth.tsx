"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Types and Interfaces
export type Role = 'guest' | 'consumer' | 'provider' | 'admin';

export type SubscriptionPlan = 'Free' | 'Pro' | 'Premium';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  subscriptionPlan: SubscriptionPlan;
}

interface MockAuthContextType {
  user: MockUser | null;
  role: Role;
  signIn: (role: Role) => void;
  signOut: () => void;
  switchRole: (role: Role) => void;
}

// 2. Auth Context
const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

// 3. Mock User Data
const mockUsers: Record<Role, MockUser> = {
  guest: {
    id: 'guest-001',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'guest',
    subscriptionPlan: 'Free',
  },
  consumer: {
    id: 'consumer-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'consumer',
    subscriptionPlan: 'Pro',
  },
  provider: {
    id: 'provider-001',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'provider',
    subscriptionPlan: 'Premium',
  },
  admin: {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    subscriptionPlan: 'Premium',
  },
};

// 4. Auth Provider Component
export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('mockUser');
    }
  }, []);

  const signIn = (role: Role) => {
    const userToSignIn = mockUsers[role];
    if (userToSignIn) {
      setUser(userToSignIn);
      localStorage.setItem('mockUser', JSON.stringify(userToSignIn));
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const switchRole = (newRole: Role) => {
    if (user) {
      const newUser = mockUsers[newRole];
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('mockUser', JSON.stringify(newUser));
      }
    }
  };

  const value = {
    user,
    role: user?.role ?? 'guest',
    signIn,
    signOut,
    switchRole,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

// 5. Custom Hook
export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};
