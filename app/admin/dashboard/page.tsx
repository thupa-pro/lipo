"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  DollarSign,
  Activity,
  Bell,
  LogOut,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart,
  Shield,
  UserCheck,
  Sparkles,
  Eye,
  Edit,
  Ban,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  const systemStats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+14%",
      changeType: "positive",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "$48,621",
      change: "+8%",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      title: "Active Services",
      value: "2,341",
      change: "+23%",
      changeType: "positive",
      icon: Activity,
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2%",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "CUSTOMER",
      status: "ACTIVE",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "PROVIDER",
      status: "PENDING_VERIFICATION",
      joinDate: "2024-01-14",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      email: "mike@example.com",
      role: "PROVIDER",
      status: "ACTIVE",
      joinDate: "2024-01-13",
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High server load detected",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "info",
      message: "New provider verification pending",
      time: "10 minutes ago",
    },
    {
      id: 3,
      type: "success",
      message: "Daily backup completed successfully",
      time: "1 hour ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "PENDING_VERIFICATION":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "PROVIDER":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "ADMIN":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ServiceHub Admin
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                Users
              </Button>
              <Button variant="ghost" size="sm">
                Services
              </Button>
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session?.user.image || ""} />
                  <AvatarFallback>
                    {session?.user.name?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session?.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.user.role}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/landing" })}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage the ServiceHub platform
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs ${
                        stat.changeType === "positive"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <stat.icon className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Joined {user.joinDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex gap-2">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Ban className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-3" />
                    Manage Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <UserCheck className="w-4 h-4 mr-3" />
                    Verify Providers
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart className="w-4 h-4 mr-3" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-3" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    User Distribution
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Customers
                      </span>
                      <span className="font-semibold">8,246 (64%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Providers
                      </span>
                      <span className="font-semibold">4,401 (34%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Admins
                      </span>
                      <span className="font-semibold">200 (2%)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        New Signups Today
                      </span>
                      <span className="font-semibold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Services Booked
                      </span>
                      <span className="font-semibold">123</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Completed Services
                      </span>
                      <span className="font-semibold">89</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    System Health
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Server Uptime
                      </span>
                      <span className="font-semibold text-green-600">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Response Time
                      </span>
                      <span className="font-semibold text-green-600">124ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Error Rate
                      </span>
                      <span className="font-semibold text-green-600">0.01%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}