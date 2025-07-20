"use client";

import { useSession } from "next-auth/react";
import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";

export interface UnifiedUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export function useAuth() {
  // NextAuth session
  const { data: session, status: nextAuthStatus } = useSession();
  
  // Clerk user (with fallback to avoid errors when Clerk is not configured)
  let clerkUser, clerkLoaded, clerkSignedIn;
  try {
    const clerk = useUser();
    clerkUser = clerk.user;
    clerkLoaded = clerk.isLoaded;
    clerkSignedIn = clerk.isSignedIn;
  } catch (error) {
    // Clerk not available
    clerkUser = null;
    clerkLoaded = true;
    clerkSignedIn = false;
  }

  const user: UnifiedUser = useMemo(() => {
    // Prefer Clerk if available and signed in
    if (clerkSignedIn && clerkUser) {
      return {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
        name: clerkUser.fullName || clerkUser.firstName || null,
        image: clerkUser.imageUrl || null,
        role: clerkUser.publicMetadata?.role as string || null,
        isLoaded: clerkLoaded,
        isSignedIn: clerkSignedIn,
      };
    }

    // Fall back to NextAuth
    if (session?.user) {
      return {
        id: session.user.id || session.user.email || "",
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: (session.user as any)?.role || null,
        isLoaded: nextAuthStatus !== "loading",
        isSignedIn: !!session.user,
      };
    }

    // No user signed in
    return {
      id: "",
      email: null,
      name: null,
      image: null,
      role: null,
      isLoaded: clerkLoaded && nextAuthStatus !== "loading",
      isSignedIn: false,
    };
  }, [session, clerkUser, clerkLoaded, clerkSignedIn, nextAuthStatus]);

  return {
    user,
    isLoading: !user.isLoaded,
    isSignedIn: user.isSignedIn,
    // Additional helpers
    isAdmin: user.role === "admin",
    isProvider: user.role === "provider",
    isCustomer: user.role === "customer" || (!user.role && user.isSignedIn),
  };
}

// Legacy exports for backward compatibility
export const useUserCompat = () => {
  const { user, isLoading } = useAuth();
  return {
    user: user.isSignedIn ? user : null,
    isLoaded: !isLoading,
    isSignedIn: user.isSignedIn,
  };
};