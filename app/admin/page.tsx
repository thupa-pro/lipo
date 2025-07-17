/**
 * Admin Dashboard - Protected Route
 * Only accessible to users with 'admin' role
 */

import { RoleGate } from "@/components/rbac/RoleGate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  BarChart3,
  AlertTriangle,
  Settings,
  Crown,
  FileText,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <RoleGate allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 dark:text-gray-300">
                  Platform administration and management
                </p>
              </div>
            </div>
            <Badge className="bg-red-500 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Administrator Access
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    Total Users
                  </CardTitle>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  12,847
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    Active Providers
                  </CardTitle>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  2,341
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    Revenue
                  </CardTitle>
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  $284,932
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  +23% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    Support Tickets
                  </CardTitle>
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  47
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  5 urgent
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-slate-200 dark:border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and roles
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/admin/users">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Users
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle>Content Moderation</CardTitle>
                    <CardDescription>
                      Review and moderate platform content
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/admin/moderation">
                      <Eye className="w-4 h-4 mr-2" />
                      Review Queue
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/admin/reports">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      User Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>
                      Configure platform-wide settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/admin/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8 border-slate-200 dark:border-white/20">
            <CardHeader>
              <CardTitle>Recent Administrative Activity</CardTitle>
              <CardDescription>
                Latest actions performed by administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "User role updated",
                    user: "john.doe@example.com",
                    time: "2 minutes ago",
                    type: "role",
                  },
                  {
                    action: "Content reported",
                    user: "jane.smith@example.com",
                    time: "15 minutes ago",
                    type: "moderation",
                  },
                  {
                    action: "Provider approved",
                    user: "provider@local.com",
                    time: "1 hour ago",
                    type: "approval",
                  },
                  {
                    action: "System backup completed",
                    user: "System",
                    time: "2 hours ago",
                    type: "system",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "role"
                            ? "bg-blue-500"
                            : activity.type === "moderation"
                              ? "bg-red-500"
                              : activity.type === "approval"
                                ? "bg-emerald-500"
                                : "bg-gray-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          {activity.user}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGate>
  );
}
