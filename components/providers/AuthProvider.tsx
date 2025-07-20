"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

// Unified Auth Provider that supports both NextAuth and Clerk
export function AuthProvider({ children }: AuthProviderProps) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <NextAuthSessionProvider>
      {clerkPublishableKey ? (
        <ClerkProvider publishableKey={clerkPublishableKey}>
          {children}
        </ClerkProvider>
      ) : (
        children
      )}
    </NextAuthSessionProvider>
  );
}

// Export both for backward compatibility
export { AuthProvider as SessionProvider };