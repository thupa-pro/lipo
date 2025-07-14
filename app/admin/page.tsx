import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Users,
  Briefcase,
  Star,
  TrendingUp,
  TrendingDown,
  Shield,
  Settings,
  Bell,
  Eye,
  UserCheck,
  DollarSign,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "2,147,483",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Active Providers",
      value: "89,342",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Monthly Revenue",
      value: "$12.4M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Service Requests",
      value: "456,789",
      change: "+22.1%",
      trend: "up",
      icon: Briefcase,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "new_provider",
      user: "Sarah Chen",
      action: "joined as Home Cleaning provider",
      location: "San Francisco, CA",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "service_completed",
      user: "Mike Rodriguez",
      action: "completed Plumbing service",
      location: "Austin, TX",
      time: "5 minutes ago",
      status: "completed",
    },
    {
      id: 3,
      type: "new_user",
      user: "Emma Thompson",
      action: "created account",
      location: "New York, NY",
      time: "8 minutes ago",
      status: "active",
    },
    {
      id: 4,
      type: "payment",
      user: "David Kim",
      action: "payment processed $125",
      location: "Seattle, WA",
      time: "12 minutes ago",
      status: "completed",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "High Demand Area",
      message: "Downtown LA has 5x more requests than available providers",
      time: "15 minutes ago",
    },
    {
      id: 2,
      type: "success",
      title: "Payment System Update",
      message: "New payment gateway successfully deployed",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "info",
      title: "Scheduled Maintenance",
      message: "AI matching system will be updated tonight at 2 AM EST",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Monitor and manage the Loconomy platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-blue-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-emerald-600"
                            : "text-blue-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest platform activities and user interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {activity.user}
                          </span>
                          <Badge
                            variant={
                              activity.status === "completed"
                                ? "default"
                                : activity.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {activity.action}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  System Alerts
                </CardTitle>
                <CardDescription>
                  Important notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {alert.type === "warning" && (
                            <AlertTriangle className="w-4 h-4 text-blue-500" />
                          )}
                          {alert.type === "success" && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          {alert.type === "info" && (
                            <Activity className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                            {alert.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {alert.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/admin/users">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/admin/providers">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Review Providers
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/admin/reports">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
