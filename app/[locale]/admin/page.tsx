import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Bell, Eye, UserCheck, ArrowUpRight, Rocket, Zap } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total, Users",
      value: "2.1M",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-ai-500 to-ai-600",
    },
    {
      title: "Active Providers",
      value: "89.3K",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      color: "from-trust-500 to-trust-600",
    },
    {
      title: "Monthly Revenue",
      value: "$12.4M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "from-premium-500 to-premium-600",
    },
    {
      title: "Service Requests",
      value: "456K",
      change: "+22.1%",
      trend: "up",
      icon: Briefcase,
      color: "from-success-500 to-success-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "new_provider",
      user: "Sarah Chen",
      action: "joined as Home Cleaning provider",
      location: "San, Francisco, CA",
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
      location: "New, York, NY",
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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated Background - 2025 Design System */}
      <div className="absolute inset-0 backdrop-ai">
        <div className="neural-grid opacity-20" />
        <div className="floating-orbs" />
      </div>

      {/* Floating Elements - Enhanced Design System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-ai-400 rounded-full animate-ai-pulse opacity-30" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-trust-400 rounded-full animate-ai-ping opacity-20" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-premium-400 rounded-full animate-ai-bounce opacity-15" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-success-400 rounded-full animate-ai-pulse opacity-20" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-ai-300 rounded-full animate-ai-ping opacity-15" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Hero Header */}
        <section className="text-center mb-16">
          <div className="card-glass-trust inline-flex items-center gap-2 px-4 py-2 mb-8 group interactive-hover">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-trust-gradient">
              Admin Dashboard • Live System Monitoring
            </span>
            <OptimizedIcon name="Shield" className="w-4 h-4 text-trust-500" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-none">
            <span className="text-gradient-ai">
              Platform
            </span>
            <br />
            <span className="text-gradient-premium">
              Command Center
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Monitor and manage the Loconomy platform with
            <span className="text-trust-gradient font-semibold">
              {" "}
              real-time insights{" "}
            </span>
            and advanced analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-ai-primary px-8 py-3">
              <Eye className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button
              variant="outline"
              className="btn-outline-ai px-8 py-3"
            >
              <NavigationIcons.Settings className="w-4 h-4 mr-2" / />
              Settings
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-trust">
                Platform Metrics
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Real-time performance indicators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="card-glass-ai relative p-8 group interactive-hover hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`,
                  }}
                />
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 mb-3 font-medium">
                    {stat.title}
                  </div>
                  <div className="text-sm text-emerald-400 font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="card-glass">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-ai-500 to-trust-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-lg">
                  Latest platform activities and user interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-6 card-glass-ai interactive-hover"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ai-500 to-trust-500 flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-slate-900 dark:text-white text-lg">
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
                            className="px-3 py-1"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                          {activity.action}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-500">
                          <span className="flex items-center gap-2">
                            <BusinessIcons.MapPin className="w-4 h-4" / />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <OptimizedIcon name="Clock" className="w-4 h-4" />
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

          {/* Alerts & Quick Actions */}
          <div className="space-y-8">
            {/* Alerts */}
            <Card className="card-glass">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-success-500 to-premium-500 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  System Alerts
                </CardTitle>
                <CardDescription className="text-lg">
                  Important notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-6 card-glass-ai interactive-hover"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {alert.type === "warning" && (
                            <UIIcons.AlertTriangle className="w-5 h-5 text-amber-500" / />
                          )}
                          {alert.type === "success" && (
                            <UIIcons.CheckCircle className="w-5 h-5 text-emerald-500" / />
                          )}
                          {alert.type === "info" && (
                            <Activity className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                            {alert.title}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 mb-3">
                            {alert.message}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-500">
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
            <Card className="card-glass">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-premium-500 to-ai-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <Button
                  variant="outline"
                  className="btn-outline-ai w-full justify-start h-14"
                  asChild
                >
                  <Link href="/admin/users">
                    <NavigationIcons.Users className="w-5 h-5 mr-3" / />
                    <span className="font-semibold">Manage Users</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="btn-outline-ai w-full justify-start h-14"
                  asChild
                >
                  <Link href="/admin/providers">
                    <UserCheck className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Review Providers</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="btn-outline-ai w-full justify-start h-14"
                  asChild
                >
                  <Link href="/admin/reports">
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <span className="font-semibold">View Analytics</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="btn-outline-ai w-full justify-start h-14"
                  asChild
                >
                  <Link href="/admin/settings">
                    <NavigationIcons.Settings className="w-5 h-5 mr-3" / />
                    <span className="font-semibold">System Settings</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="btn-outline-ai w-full justify-start h-14"
                  asChild
                >
                  <Link href="/admin/launch">
                    <Rocket className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Launch Preparation</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="btn-outline-ai w-full justify-start h-14"
                  asChild
                >
                  <Link href="/admin/optimization">
                    <Zap className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Optimization Tools</span>
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
