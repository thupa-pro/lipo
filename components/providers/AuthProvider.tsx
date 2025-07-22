// This provider is no longer needed since we're using backend-only authentication
// Keeping file for compatibility but it's just a pass-through now

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

// Simplified Auth Provider for backend-only authentication
export function AuthProvider({ children }: AuthProviderProps) {
  // No client-side auth providers needed - we use backend-only authentication
  return <>{children}</>;
}

// Export both for backward compatibility
export { AuthProvider as SessionProvider };