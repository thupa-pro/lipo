"use client";

import { ReactNode } from "react";
import { useMockAuth } from "@/lib/mock/use-mock-auth";
import { UserRole } from "@/lib/mock/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock } from "lucide-react";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function RoleGate({
  children,
  allowedRoles,
  fallback,
  requireAuth = true,
}: RoleGateProps) {
  const { user, isLoading } = useMockAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  // Check if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return (
      fallback || (
        <Alert className="max-w-md mx-auto mt-8">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            You need to sign in to access this page.
          </AlertDescription>
        </Alert>
      )
    );
  }

  // Check if user role is allowed
  if (user && !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have permission to access this page. Required roles:{" "}
            {allowedRoles.join(", ")}
          </AlertDescription>
        </Alert>
      )
    );
  }

  return <>{children}</>;
}

// Helper component for specific role checks
export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGate allowedRoles={["admin"]} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

export function ProviderOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGate allowedRoles={["provider", "admin"]} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

export function ConsumerOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGate allowedRoles={["consumer", "admin"]} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

export function AuthenticatedOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGate
      allowedRoles={["consumer", "provider", "admin"]}
      fallback={fallback}
    >
      {children}
    </RoleGate>
  );
}

// Hook for checking permissions in components
export function useRoleCheck() {
  const { user } = useMockAuth();

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = () => hasRole("admin");
  const isProvider = () => hasRole(["provider", "admin"]);
  const isConsumer = () => hasRole(["consumer", "admin"]);
  const isAuthenticated = () => hasRole(["consumer", "provider", "admin"]);

  return {
    user,
    hasRole,
    isAdmin,
    isProvider,
    isConsumer,
    isAuthenticated,
  };
}
