// This provider is no longer needed since we're using backend-only authentication
// Keeping file for compatibility but it's just a pass-through now

import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  // No NextAuth session provider needed - we use backend-only authentication
  return <>{children}</>;
}