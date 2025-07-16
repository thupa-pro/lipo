"use client";

/**
 * Main Navigation Component with RBAC Integration
 * Uses role-aware navigation and integrates with existing Clerk authentication
 */

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { RoleAwareNavigation } from "./navigation/RoleAwareNavigation";
import { UserRole } from "@/lib/rbac/types";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import { useMockAuth } from "@/lib/mock/auth";

export default function Navigation() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isMockMode = pathname.startsWith("/mock-");

  // Use mock auth if in mock mode
  const mockAuth = isMockMode ? useMockAuth() : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMockMode) {
      if (mockAuth?.user) {
        setUserRole(mockAuth.user.role as UserRole);
      } else {
        setUserRole("guest");
      }
      return;
    }

    if (!isLoaded) return;

    const fetchUserRole = async () => {
      if (!user?.id) {
        setUserRole("guest");
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
          // Default to consumer for authenticated users without explicit role
          setUserRole("consumer");
          console.log("No user role found, defaulting to consumer");
        } else {
          setUserRole(data.role as UserRole);
        }
      } catch (error) {
        console.log("Database not ready, using default role");
        setUserRole("consumer"); // Default fallback
      }
    };

    fetchUserRole();
  }, [user?.id, isLoaded, isMockMode, mockAuth]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return <RoleAwareNavigation userRole={userRole} />;
}
