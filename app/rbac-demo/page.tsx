/**
 * RBAC Demo Page
 * Demonstrates role-based access control features
 */

import { RoleGate, ClientRoleGate } from "@/components/rbac/RoleGate";
import { getCurrentSession } from "@/lib/rbac/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, Briefcase, Crown, Eye, Lock, Info } from "lucide-react";

export default async function RBACDemo() {
  const session = await getCurrentSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            RBAC System Demo
          </h1>
          <p className="text-slate-600 dark:text-gray-300 mb-6">
            This page demonstrates how the Role-Based Access Control system
            works across different user roles.
          </p>

          {/* Current User Info */}
          <Card className="mb-6 border-slate-200 dark:border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Current Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              {session ? (
                <div className="flex items-center gap-4">
                  <Badge
                    className={
                      session.role === "admin"
                        ? "bg-red-500"
                        : session.role === "provider"
                          ? "bg-blue-500"
                          : session.role === "consumer"
                            ? "bg-green-500"
                            : "bg-gray-500"
                    }
                  >
                    {session.role === "admin" && (
                      <Crown className="w-3 h-3 mr-1" />
                    )}
                    {session.role === "provider" && (
                      <Briefcase className="w-3 h-3 mr-1" />
                    )}
                    {session.role === "consumer" && (
                      <Users className="w-3 h-3 mr-1" />
                    )}
                    {session.role.toUpperCase()}
                  </Badge>
                  <span className="text-slate-600 dark:text-gray-300">
                    User ID: {session.id.slice(0, 8)}...
                  </span>
                  {session.tenantId && (
                    <span className="text-slate-500 dark:text-gray-400">
                      Tenant: {session.tenantId?.slice(0, 8)}...
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  Not authenticated (viewing as guest)
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Role-Based Content Examples */}
        <div className="space-y-8">
          {/* Guest Content */}
          <Card className="border-slate-200 dark:border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-500" />
                Guest Content
              </CardTitle>
              <CardDescription>
                This content is visible to all users, including unauthenticated
                guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleGate
                allowedRoles={["guest", "consumer", "provider", "admin"]}
                requireAuth={false}
              >
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    ✅ This content is accessible to everyone. Perfect for
                    landing pages, public information, and marketing content.
                  </AlertDescription>
                </Alert>
              </RoleGate>
            </CardContent>
          </Card>

          {/* Consumer Content */}
          <Card className="border-slate-200 dark:border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Consumer Content
              </CardTitle>
              <CardDescription>
                This content is only visible to authenticated consumers and
                higher roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleGate
                allowedRoles={["consumer", "provider", "admin"]}
                fallback={
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      🔒 This content requires consumer access or higher. Please
                      sign in or upgrade your account.
                    </AlertDescription>
                  </Alert>
                }
              >
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Consumer Dashboard: Book services, manage appointments,
                    view order history.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    My Bookings
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Browse Services
                  </Button>
                </div>
              </RoleGate>
            </CardContent>
          </Card>

          {/* Provider Content */}
          <Card className="border-slate-200 dark:border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Provider Content
              </CardTitle>
              <CardDescription>
                This content is only visible to service providers and admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleGate
                allowedRoles={["provider", "admin"]}
                fallback={
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      🔒 This content requires provider access. Apply to become
                      a service provider to access these tools.
                    </AlertDescription>
                  </Alert>
                }
              >
                <Alert>
                  <Briefcase className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Provider Tools: Manage listings, view analytics, handle
                    bookings, track earnings.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="justify-start" variant="outline">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Manage Listings
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Customer Reviews
                  </Button>
                </div>
              </RoleGate>
            </CardContent>
          </Card>

          {/* Admin Content */}
          <Card className="border-slate-200 dark:border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-red-500" />
                Admin Content
              </CardTitle>
              <CardDescription>
                This content is only visible to platform administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleGate
                allowedRoles={["admin"]}
                fallback={
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      🔒 This content requires administrator privileges. Contact
                      support if you believe this is an error.
                    </AlertDescription>
                  </Alert>
                }
              >
                <Alert>
                  <Crown className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Admin Panel: User management, content moderation,
                    platform analytics, system settings.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    User Management
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Content Moderation
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Platform Analytics
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Crown className="w-4 h-4 mr-2" />
                    System Settings
                  </Button>
                </div>
              </RoleGate>
            </CardContent>
          </Card>

          {/* Implementation Notes */}
          <Card className="border-slate-200 dark:border-white/20">
            <CardHeader>
              <CardTitle>Implementation Notes</CardTitle>
              <CardDescription>
                How this RBAC system works under the hood
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Server-Side Security
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-gray-300">
                      <li>• RoleGate component runs on server</li>
                      <li>• Session verified with Clerk + Supabase</li>
                      <li>• Roles stored in secure database</li>
                      <li>• Protected routes in middleware.ts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Role Management
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-gray-300">
                      <li>• TypeScript-strict role definitions</li>
                      <li>• Automatic role assignment on signup</li>
                      <li>• Multi-tenant support for providers</li>
                      <li>• Permission-based access control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
