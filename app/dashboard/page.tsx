"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Bell,
  Settings,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const stats = [
  {
    title: "Total Revenue",
    value: "$12,426",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-green-600 dark:text-green-400"
  },
  {
    title: "Active Bookings",
    value: "23",
    change: "+3",
    changeType: "positive" as const,
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "Customer Rating",
    value: "4.8",
    change: "+0.2",
    changeType: "positive" as const,
    icon: Star,
    color: "text-yellow-600 dark:text-yellow-400"
  },
  {
    title: "Response Time",
    value: "2.3h",
    change: "-0.5h",
    changeType: "positive" as const,
    icon: Clock,
    color: "text-purple-600 dark:text-purple-400"
  }
];

const recentBookings = [
  {
    id: 1,
    customer: "Sarah Johnson",
    service: "House Cleaning",
    date: "Today, 2:00 PM",
    status: "confirmed",
    amount: "$85",
    avatar: "/avatars/sarah.jpg"
  },
  {
    id: 2,
    customer: "Mike Chen",
    service: "Handyman Work",
    date: "Tomorrow, 10:00 AM",
    status: "pending",
    amount: "$120",
    avatar: "/avatars/mike.jpg"
  },
  {
    id: 3,
    customer: "Emma Wilson",
    service: "Pet Care",
    date: "Dec 28, 3:00 PM",
    status: "confirmed",
    amount: "$45",
    avatar: "/avatars/emma.jpg"
  },
  {
    id: 4,
    customer: "David Rodriguez",
    service: "Tutoring",
    date: "Dec 29, 7:00 PM",
    status: "completed",
    amount: "$60",
    avatar: "/avatars/david.jpg"
  }
];

const notifications = [
  {
    id: 1,
    type: "booking",
    title: "New booking request",
    description: "Sarah Johnson requested house cleaning service",
    time: "5 minutes ago",
    isRead: false
  },
  {
    id: 2,
    type: "payment",
    title: "Payment received",
    description: "$60 payment from David Rodriguez",
    time: "1 hour ago",
    isRead: false
  },
  {
    id: 3,
    type: "review",
    title: "New 5-star review",
    description: "Emma Wilson left a great review for your pet care service",
    time: "3 hours ago",
    isRead: true
  }
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: resolvedTheme === "dark" ? "bg-blue-900/30 text-blue-300 border-blue-700" : "bg-blue-100 text-blue-700 border-blue-200",
      pending: resolvedTheme === "dark" ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" : "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: resolvedTheme === "dark" ? "bg-green-900/30 text-green-300 border-green-700" : "bg-green-100 text-green-700 border-green-200",
      cancelled: resolvedTheme === "dark" ? "bg-red-900/30 text-red-300 border-red-700" : "bg-red-100 text-red-700 border-red-200"
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking": return Calendar;
      case "payment": return DollarSign;
      case "review": return Star;
      default: return Bell;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      resolvedTheme === "dark" 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
    }`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className={`text-3xl font-bold ${
              resolvedTheme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Dashboard
            </h1>
            <p className={`${
              resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}>
              Welcome back! Here's what's happening with your services.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className={`w-6 h-6 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
              }`} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </div>
            <ThemeToggle size="sm" />
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`theme-transition ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              } hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className={`text-sm font-medium ${
                        resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}>
                        {stat.title}
                      </p>
                      <p className={`text-2xl font-bold ${
                        resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                      }`}>
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500 font-medium">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${
                      resolvedTheme === "dark" ? "bg-slate-700" : "bg-slate-100"
                    }`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className={`theme-transition ${
              resolvedTheme === "dark"
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white border-slate-200"
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-xl font-semibold ${
                    resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                  }`}>
                    Recent Bookings
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Booking
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      resolvedTheme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`} />
                    <Input 
                      placeholder="Search bookings..." 
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border theme-transition ${
                      resolvedTheme === "dark"
                        ? "border-slate-700 hover:bg-slate-700/30"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={booking.avatar} alt={booking.customer} />
                        <AvatarFallback>
                          {booking.customer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className={`font-medium ${
                          resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                        }`}>
                          {booking.customer}
                        </p>
                        <p className={`text-sm ${
                          resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {booking.service}
                        </p>
                        <p className={`text-xs ${
                          resolvedTheme === "dark" ? "text-slate-500" : "text-slate-500"
                        }`}>
                          {booking.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <span className={`font-semibold ${
                        resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                      }`}>
                        {booking.amount}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            {/* Notifications */}
            <Card className={`theme-transition ${
              resolvedTheme === "dark"
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white border-slate-200"
            }`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-lg font-semibold ${
                  resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification, index) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-lg theme-transition ${
                        notification.isRead
                          ? resolvedTheme === "dark" ? "bg-slate-700/30" : "bg-slate-50"
                          : resolvedTheme === "dark" ? "bg-blue-900/20 border border-blue-800" : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        resolvedTheme === "dark" ? "bg-slate-700" : "bg-white"
                      }`}>
                        <IconComponent className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm font-medium ${
                          resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                        }`}>
                          {notification.title}
                        </p>
                        <p className={`text-xs ${
                          resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {notification.description}
                        </p>
                        <p className={`text-xs ${
                          resolvedTheme === "dark" ? "text-slate-500" : "text-slate-500"
                        }`}>
                          {notification.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`theme-transition ${
              resolvedTheme === "dark"
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white border-slate-200"
            }`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-lg font-semibold ${
                  resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Service
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Availability
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  View Customer Reviews
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className={`theme-transition ${
            resolvedTheme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-slate-200"
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xl font-semibold ${
                  resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Performance Overview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={selectedPeriod === "7d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedPeriod("7d")}
                  >
                    7 Days
                  </Button>
                  <Button 
                    variant={selectedPeriod === "30d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedPeriod("30d")}
                  >
                    30 Days
                  </Button>
                  <Button 
                    variant={selectedPeriod === "90d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedPeriod("90d")}
                  >
                    90 Days
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`h-64 rounded-lg flex items-center justify-center border-2 border-dashed ${
                resolvedTheme === "dark" 
                  ? "border-slate-600 bg-slate-700/30" 
                  : "border-slate-300 bg-slate-50"
              }`}>
                <div className="text-center space-y-2">
                  <TrendingUp className={`w-12 h-12 mx-auto ${
                    resolvedTheme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`} />
                  <p className={`text-lg font-medium ${
                    resolvedTheme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}>
                    Performance Chart
                  </p>
                  <p className={`text-sm ${
                    resolvedTheme === "dark" ? "text-slate-500" : "text-slate-500"
                  }`}>
                    Analytics visualization would appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
