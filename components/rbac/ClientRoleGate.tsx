"use client";

/**
 * Client-side RoleGate wrapper
 * Wraps the server RoleGate for use in client components
 */

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Shield,
  Link
} from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/lib/rbac/types";
import { createClient } from "@/lib/supabase/client";

interface ClientRoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function ClientRoleGate({
  allowedRoles,
  children,
  fallback,
  requireAuth = true,
}: ClientRoleGateProps) {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchUserRole = async () => {
      if (!user?.id) {
        setUserRole("guest");
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          setUserRole("consumer"); // Default for authenticated users
        } else {
          setUserRole(data.role as UserRole);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("consumer");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id, isLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai-600"></div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!user) {
    if (requireAuth) {
      return (
        fallback || (
          <div className="flex items-center justify-center min-h-[400px] p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-br from-ai-500 to-trust-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
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
    // For guest, access, treat as guest role
    if (allowedRoles.includes("guest")) {
      return <>{children}</>;
    }
    return fallback || null;
  }

  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
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
              {userRole}
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

  // User has required, role, render children
  return <>{children}</>;
}
