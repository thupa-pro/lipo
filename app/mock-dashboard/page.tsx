"use client";

import React from "react";
import { MockAuthProvider } from "@/lib/mock/auth-provider";
import Dashboard from "@/components/mock/Dashboard";
import MockRoleGate from "@/components/rbac/MockRoleGate";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MockDashboardPage = () => {
  return (
    <MockAuthProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
        <MockRoleGate
          allowedRoles={["consumer", "provider", "admin"]}
          fallback={
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You must be logged in to view this page.
              </p>
              <Button asChild>
                <Link href="/mock-auth">Go to Auth Page</Link>
              </Button>
            </div>
          }
        >
          <Dashboard />
        </MockRoleGate>
      </div>
    </MockAuthProvider>
  );
};

export default MockDashboardPage;
