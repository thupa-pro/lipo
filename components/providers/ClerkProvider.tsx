// This provider is no longer needed since we're using Clerk backend-only
// Keeping file for reference but not using client-side Clerk components

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  // No Clerk client-side provider needed - we use backend-only authentication
  return <>{children}</>;
}