"use client";

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <ClerkProviderBase
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        elements: {
          // Hide Clerk's default UI since we're using custom components
          rootBox: "hidden",
          card: "hidden"
        }
      }}
    >
      {children}
    </ClerkProviderBase>
  );
}