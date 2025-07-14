"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmartRecommendations from "@/components/ai/smart-recommendations";
import PriceOptimizer from "@/components/ai/price-optimizer";
import AIChat from "@/components/ai/AIChat";
import {
  User,
  Star,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  TrendingUp,
  Bell,
  MessageSquare,
  Settings,
  Brain,
  Sparkles,
  Zap,
  Target,
  Crown,
  Gift,
  Activity,
  Award,
  Heart,
  DollarSign,
  Users,
  Plus,
  ArrowRight,
  Shield,
  Lightbulb,
  Rocket,
  PiggyBank,
  Search,
  Eye,
  Flame,
  ThumbsUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";

const recentBookings = [
  {
    id: 1,
    service: "Premium House Cleaning",
    provider: "Sarah Mitchell",
    providerImage: "/placeholder.svg?height=40&width=40",
    date: "Today, 2:00 PM",
    status: "confirmed",
    price: "$120",
    rating: 4.9,
    aiOptimized: true,
    category: "cleaning",
    urgency: "high",
  },
  {
    id: 2,
    service: "Smart Home Repair",
    provider: "Mike Rodriguez",
    providerImage: "/placeholder.svg?height=40&width=40",
    date: "Tomorrow, 10:00 AM",
    status: "pending",
    price: "$85",
    rating: 4.8,
    aiOptimized: false,
    category: "maintenance",
    urgency: "medium",
  },
  {
    id: 3,
    service: "Elite Pet Grooming",
    provider: "Emma Thompson",
    providerImage: "/placeholder.svg?height=40&width=40",
    date: "Dec 15, 3:00 PM",
    status: "completed",
    price: "$60",
    rating: 5.0,
    aiOptimized: true,
    category: "petcare",
    urgency: "low",
  },
];

const aiInsights = [
  {
    title: "Potential Savings",
    value: "$45",
    description: "Available this week with timing optimization",
    icon: PiggyBank,
    color: "from-emerald-500 to-green-600",
    trend: "+$12 from last week",
  },
  {
    title: "AI Match Score",
    value: "94%",
    description: "Average compatibility with your preferences",
    icon: Brain,
    color: "from-blue-500 to-purple-600",
    trend: "+5% improvement",
  },
  {
    title: "Trust Score",
    value: "98%",
    description: "Provider reliability based on AI analysis",
    icon: Shield,
    color: "from-purple-500 to-pink-600",
    trend: "Industry leading",
  },
];

const quickStats = [
  {
    title: "Total Bookings",
    value: "24",
    change: "+3 this month",
    icon: Calendar,
    trend: "up",
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "AI Savings",
    value: "$247",
    change: "Saved this year",
    icon: Sparkles,
    trend: "up",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Satisfaction",
    value: "4.8★",
    change: "Average rating",
    icon: Star,
    trend: "stable",
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Response Time",
    value: "1.2hrs",
    change: "Average response",
    icon: Clock,
    trend: "up",
    color: "from-cyan-500 to-blue-600",
  },
];

export default function PremiumDashboardPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [showPriceOptimizer, setShowPriceOptimizer] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "confirmed":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "pending":
        return "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-100 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Flame className="w-3 h-3 text-red-500" />;
      case "medium":
        return <Zap className="w-3 h-3 text-amber-500" />;
      case "low":
        return <Clock className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header with AI Welcome */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white dark:border-white/20 shadow-xl">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 dark:from-violet-600 dark:to-purple-600 text-white font-bold text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-2">
                  <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                    Good morning, John! ☀️
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-gray-300 flex items-center gap-3">
                  <Brain className="w-5 h-5 text-blue-500" />
                  AI has found 3 new recommendations for you
                  {mounted && currentTime ? (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="font-medium">{currentTime}</span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Pro
              </Button>
            </div>
          </div>

          {/* AI Insights Bar */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30" />
            <Card className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 shadow-xl rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                        AI Assistant Active
                      </h3>
                      <p className="text-slate-600 dark:text-gray-300">
                        Monitoring prices and finding optimal booking times for
                        your next service
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-gray-300 font-medium">
                      Live Monitoring
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced AI Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {aiInsights.map((insight, index) => (
            <Card
              key={insight.title}
              className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${insight.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-5 transition-opacity duration-700`}
              />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">
                      {insight.title}
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {insight.value}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                      {insight.description}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${insight.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                  >
                    <insight.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {insight.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <Card
              key={stat.title}
              className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500`}
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Enhanced Recent Bookings */}
          <Card className="lg:col-span-2 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 shadow-xl rounded-3xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-white">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Recent Bookings
                </CardTitle>
                <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="group flex items-center justify-between p-6 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-blue-300 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <Avatar className="w-14 h-14 border-3 border-white dark:border-white/20 shadow-lg">
                          <AvatarImage src={booking.providerImage} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 dark:from-violet-600 dark:to-purple-600 text-white font-bold">
                            {booking.provider
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {booking.aiOptimized && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -left-1">
                          {getUrgencyIcon(booking.urgency)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800 dark:text-white">
                          {booking.service}
                        </h4>
                        <p className="text-slate-600 dark:text-gray-300 flex items-center gap-2 mb-1">
                          {booking.provider}
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                            <span className="text-sm font-medium">
                              {booking.rating}
                            </span>
                          </div>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          {booking.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                        {booking.price}
                      </p>
                      <Badge
                        className={`${getStatusColor(booking.status)} text-xs mb-1`}
                      >
                        {booking.status}
                      </Badge>
                      {booking.aiOptimized && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          AI Optimized
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-6 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                asChild
              >
                <Link href="/my-bookings">
                  View All Bookings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-white">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Smart Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25"
                asChild
              >
                <Link href="/browse">
                  <Search className="w-5 h-5 mr-3" />
                  Find Services with AI
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                onClick={() => setShowPriceOptimizer(!showPriceOptimizer)}
              >
                <Target className="w-5 h-5 mr-3" />
                AI Price Optimizer
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                asChild
              >
                <Link href="/payments">
                  <CreditCard className="w-5 h-5 mr-3" />
                  Smart Payments
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                asChild
              >
                <Link href="/profile">
                  <User className="w-5 h-5 mr-3" />
                  AI Preferences
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                asChild
              >
                <Link href="/settings">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Section */}
        <div className="mb-12">
          <SmartRecommendations
            userId="user123"
            location="New York, NY"
            context="dashboard"
            maxRecommendations={6}
            showAIInsights={true}
          />
        </div>

        {/* Price Optimizer Modal */}
        {showPriceOptimizer && (
          <div className="mb-12">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30" />
              <Card className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 shadow-2xl rounded-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-white">
                      <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      AI Price Optimizer
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setShowPriceOptimizer(false)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <PriceOptimizer
                    serviceType="House Cleaning"
                    location="New York, NY"
                    flexibility="medium"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Enhanced Recent Activity with AI Insights */}
        <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-white">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              AI Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-slate-800 dark:text-white">
                    Service Completed & AI Analyzed
                  </p>
                  <p className="text-slate-600 dark:text-gray-300">
                    Pet grooming with Emma Thompson • Quality score: 98% •
                    Perfect match!
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500 dark:text-gray-400">
                    2 hours ago
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <ThumbsUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Excellent
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-slate-800 dark:text-white">
                    AI Found Better Price
                  </p>
                  <p className="text-slate-600 dark:text-gray-300">
                    $25 savings available for your next cleaning service • Book
                    within 48hrs
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500 dark:text-gray-400">
                    4 hours ago
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Save $25
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-slate-800 dark:text-white">
                    Smart Recommendation
                  </p>
                  <p className="text-slate-600 dark:text-gray-300">
                    AI suggests booking Tuesday morning for best rates and
                    provider availability
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500 dark:text-gray-400">
                    1 day ago
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <Target className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Optimal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Assistant */}
      <AIChat
        agentId="maya"
        context={{ currentPage: "dashboard", userId: "user123" }}
        position="floating"
        theme="brand"
        autoOpen={false}
        proactiveMessage={true}
      />
    </div>
  );
}
