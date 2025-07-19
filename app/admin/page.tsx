"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  AlertTriangle,
  Flag,
  Shield,
  Settings,
  TrendingUp,
  Activity,
  Database,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserManagement } from "@/components/admin/UserManagement";
import { ContentModeration } from "@/components/admin/ContentModeration";
import { SystemMonitoring } from "@/components/admin/SystemMonitoring";
import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { PlatformAnalytics } from "@/components/admin/PlatformAnalytics";
import { useAdminClient } from "@/lib/admin/utils";
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  total_users: number;
  active_users: number;
  total_listings: number;
  active_listings: number;
  total_bookings: number;
  pending_moderation: number;
  flagged_content: number;
  revenue_today: number;
  revenue_month: number;
  system_health: "healthy" | "warning" | "critical";
}

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const adminClient = useAdminClient();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");

  useEffect(() => {
    if (user?.id) {
      checkAdminAccess();
      loadAdminStats();
    }
  }, [user?.id]);

  const checkAdminAccess = async () => {
    try {
      const hasAccess = await adminClient.checkAdminAccess(user?.id || "");
      if (!hasAccess) {
        toast({
          title: "Access Denied",
          description:
            "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      router.push("/dashboard");
    }
  };

  const loadAdminStats = async () => {
    setIsLoading(true);
    try {
      const statsData = await adminClient.getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading admin stats:", error);
      toast({
        title: "Error",
        description: "Failed to load admin statistics.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (type: "users" | "analytics" | "listings" | "bookings") => {
    try {
      const data = await adminClient.exportData(type);
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Complete",
        description: `${type} data has been exported successfully.`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Platform management, moderation, and analytics
          </p>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportData("users")}>
                Export Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("listings")}>
                Export Listings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("bookings")}>
                Export Bookings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("analytics")}>
                Export Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={loadAdminStats}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_users.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {stats.active_users.toLocaleString()} active
                </Badge>
                <span className="text-xs text-green-600">
                  {((stats.active_users / stats.total_users) * 100).toFixed(1)}%
                  active
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Listings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_listings.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {stats.active_listings.toLocaleString()} active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Moderation Queue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pending_moderation}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive" className="text-xs">
                  {stats.flagged_content} flagged
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.revenue_today.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.revenue_month.toLocaleString()} this month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Health Alert */}
      {stats && stats.system_health !== "healthy" && (
        <Card
          className={`border-l-4 ${
            stats.system_health === "critical"
              ? "border-red-500 bg-red-50"
              : "border-yellow-500 bg-yellow-50"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-5 h-5 ${
                  stats.system_health === "critical"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              />
              <div>
                <h3
                  className={`font-medium ${
                    stats.system_health === "critical"
                      ? "text-red-900"
                      : "text-yellow-900"
                  }`}
                >
                  System Health: {stats.system_health.toUpperCase()}
                </h3>
                <p
                  className={`text-sm ${
                    stats.system_health === "critical"
                      ? "text-red-700"
                      : "text-yellow-700"
                  }`}
                >
                  {stats.system_health === "critical"
                    ? "Critical system issues detected. Immediate attention required."
                    : "System performance issues detected. Monitor closely."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setCurrentTab("moderation")}
                >
                  <Flag className="w-6 h-6" />
                  Review Flags
                  {stats && stats.flagged_content > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.flagged_content}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setCurrentTab("users")}
                >
                  <Users className="w-6 h-6" />
                  Manage Users
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setCurrentTab("analytics")}
                >
                  <BarChart3 className="w-6 h-6" />
                  View Analytics
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setCurrentTab("monitoring")}
                >
                  <Activity className="w-6 h-6" />
                  System Health
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>New user registrations today</span>
                    <Badge variant="secondary">23</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Listings created today</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Bookings completed today</span>
                    <Badge variant="secondary">45</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Support tickets opened</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moderation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Content items pending review</span>
                    <Badge variant="destructive">
                      {stats?.pending_moderation || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Flagged content items</span>
                    <Badge variant="destructive">
                      {stats?.flagged_content || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Appeals pending</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Auto-moderated today</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <ContentModeration />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PlatformAnalytics />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <SystemMonitoring />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditLogTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
