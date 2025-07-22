import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Users,
  Briefcase,
  TrendingUp,
  Settings,
  Bell,
  Eye,
  UserCheck,
  DollarSign,
  MapPin, AlertTriangle
  ArrowUpRight
  Rocket
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "2.1M",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Active Providers",
      value: "89.3K",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Monthly Revenue",
      value: "$12.4M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Service Requests",
      value: "456K",
      change: "+22.1%",
      trend: "up",
      icon: Briefcase,
      color: "from-pink-500 to-rose-600",
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
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Animated Background - Same as Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Hero Header */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Admin Dashboard • Live System Monitoring
            </span>
            <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Platform
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Monitor and manage the Loconomy platform with
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              real-time insights{" "}
            </span>
            and advanced analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25">
              <Eye className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl px-8 py-3 font-semibold border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
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
                className="relative bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8 group hover:bg-white/10 transition-all duration-500 hover:scale-105"
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
            <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
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
                      className="flex items-start gap-4 p-6 rounded-2xl bg-blue-50/50 dark:bg-white/5 border border-blue-200/50 dark:border-white/10 hover:bg-blue-50/70 dark:hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
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
                            <MapPin className="w-4 h-4" />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
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
            <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
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
                      className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50/30 dark:hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {alert.type === "warning" && (
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          )}
                          {alert.type === "success" && (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
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
            <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-14 rounded-2xl border-blue-300 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300"
                  asChild
                >
                  <Link href="/admin/users">
                    <Users className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Manage Users</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-14 rounded-2xl border-blue-300 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300"
                  asChild
                >
                  <Link href="/admin/providers">
                    <UserCheck className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Review Providers</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-14 rounded-2xl border-blue-300 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300"
                  asChild
                >
                  <Link href="/admin/reports">
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <span className="font-semibold">View Analytics</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-14 rounded-2xl border-blue-300 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300"
                  asChild
                >
                  <Link href="/admin/settings">
                    <Settings className="w-5 h-5 mr-3" />
                    <span className="font-semibold">System Settings</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-14 rounded-2xl border-blue-300 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300"
                  asChild
                >
                  <Link href="/admin/launch">
                    <Rocket className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Launch Preparation</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-14 rounded-2xl border-blue-300 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300"
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
