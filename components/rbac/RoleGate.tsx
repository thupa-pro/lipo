/**
 * RoleGate Component
 * Conditionally renders content based on user roles and permissions
 */

import { getCurrentSession } from "@/lib/rbac/utils";
import { RoleGateProps } from "@/lib/rbac/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, Lock } from "lucide-react";
import Link from "next/link";

/**
 * Server Component for role-based access control
 * Checks user session and role permissions server-side
 */
export async function RoleGate({
  allowedRoles,
  children,
  fallback,
  requireAuth = true,
}: RoleGateProps) {
  const session = await getCurrentSession();

  // Handle unauthenticated users
  if (!session) {
    if (requireAuth) {
      return (
        fallback || (
          <div className="flex items-center justify-center min-h-[400px] p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Authentication Required
              </h2>
              <p className="text-slate-600 dark:text-gray-300 mb-6">
                You need to sign in to access this content.
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }
    // For guest access, treat as guest role
    if (allowedRoles.includes("guest")) {
      return <>{children}</>;
    }
    return fallback || null;
  }

  // Check if user has required role
  if (!allowedRoles.includes(session.role)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-slate-600 dark:text-gray-300 mb-6">
              You don't have permission to access this content. Current role:{" "}
              {session.role}
            </p>
            <Alert className="text-left mb-6">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Required roles: {allowedRoles.join(", ")}
              </AlertDescription>
            </Alert>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      )
    );
  }

  // User has required role, render children
  return <>{children}</>;
}

/**
 * Client-side role gate for dynamic content
 * Use this for client components that need role checking
 */
export function ClientRoleGate({
  allowedRoles,
  children,
  fallback,
  userRole,
}: RoleGateProps & { userRole: string }) {
  if (!allowedRoles.includes(userRole as any)) {
    return fallback || null;
  }

  return <>{children}</>;
}
