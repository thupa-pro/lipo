"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { MockUser, MockAuthState, UserRole } from "./types";

const MockAuthContext = createContext<MockAuthState | undefined>(undefined);

const STORAGE_KEY = "loconomy_mock_user";

const defaultUsers: Record<UserRole, Omit<MockUser, "id">> = {
  guest: {
    email: "guest@loconomy.com",
    name: "Guest User",
    role: "guest",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    subscription: {
      plan: "free",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: {
        maxListings: 3,
        maxBookings: 10,
        aiSupport: false,
        analytics: false,
        whiteLabel: false,
      },
    },
  },
  consumer: {
    email: "consumer@loconomy.com",
    name: "Sarah Johnson",
    role: "consumer",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    subscription: {
      plan: "pro",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: {
        maxListings: 25,
        maxBookings: 100,
        aiSupport: true,
        analytics: true,
        whiteLabel: false,
      },
    },
  },
  provider: {
    email: "provider@loconomy.com",
    name: "Mike Rodriguez",
    role: "provider",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    subscription: {
      plan: "premium",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: {
        maxListings: 100,
        maxBookings: 500,
        aiSupport: true,
        analytics: true,
        whiteLabel: true,
      },
    },
  },
  admin: {
    email: "admin@loconomy.com",
    name: "Alex Chen",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    subscription: {
      plan: "premium",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: {
        maxListings: 999999,
        maxBookings: 999999,
        aiSupport: true,
        analytics: true,
        whiteLabel: true,
      },
    },
  },
};

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Convert date strings back to Date objects
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        parsedUser.subscription.currentPeriodEnd = new Date(
          parsedUser.subscription.currentPeriodEnd,
        );
        setUser(parsedUser);
      }
    } catch (error) {
      console.warn("Failed to load saved user:", error);
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, role: UserRole): Promise<void> => {
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userData = defaultUsers[role];
    const newUser: MockUser = {
      ...userData,
      id: `mock_${role}_${Date.now()}`,
      email: email || userData.email,
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;

    const userData = defaultUsers[role];
    const updatedUser: MockUser = {
      ...userData,
      id: `mock_${role}_${Date.now()}`,
      email: user.email,
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const updateSubscription = (plan: "free" | "pro" | "premium") => {
    if (!user) return;

    const features = {
      free: {
        maxListings: 3,
        maxBookings: 10,
        aiSupport: false,
        analytics: false,
        whiteLabel: false,
      },
      pro: {
        maxListings: 25,
        maxBookings: 100,
        aiSupport: true,
        analytics: true,
        whiteLabel: false,
      },
      premium: {
        maxListings: 100,
        maxBookings: 500,
        aiSupport: true,
        analytics: true,
        whiteLabel: true,
      },
    };

    const updatedUser: MockUser = {
      ...user,
      subscription: {
        plan,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        features: features[plan],
      },
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const value: MockAuthState = {
    user,
    isLoading,
    signIn,
    signOut,
    switchRole,
    updateSubscription,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth(): MockAuthState {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
}
