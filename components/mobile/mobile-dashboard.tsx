"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import {
  Search,
  TrendingUp,
  CreditCard,
  BarChart3,
  ShoppingBag,
  Users,
  Star,
  ArrowRight,
  Plus, Shield,
  MapPin,
  Calendar,
  Wallet,
  Activity,
  Bell,
  Settings,
  Eye,
  Lock,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardTile {
  id: string;
  title: string;
  subtitle?: string;
  value?: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  href: string;
  size: "small" | "medium" | "large";
  priority: number;
}

const dashboardTiles: DashboardTile[] = [
  {
    id: "balance",
    title: "Total Balance",
    subtitle: "Available funds",
    value: "$2,847.50",
    change: "+12.5%",
    icon: Wallet,
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
    href: "/payments?tab=wallet",
    size: "large",
    priority: 1,
  },
  {
    id: "bookings",
    title: "Active Bookings",
    value: 3,
    icon: Calendar,
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
    href: "/my-bookings",
    size: "medium",
    priority: 2,
  },
  {
    id: "rating",
    title: "Your Rating",
    value: "4.9",
    subtitle: "248 reviews",
    icon: Star,
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-orange-500",
    href: "/profile?tab=reviews",
    size: "medium",
    priority: 3,
  },
  {
    id: "analytics",
    title: "Performance",
    subtitle: "This month",
    value: "+23%",
    icon: TrendingUp,
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500",
    href: "/dashboard?tab=analytics",
    size: "small",
    priority: 4,
  },
  {
    id: "messages",
    title: "Messages",
    value: 7,
    subtitle: "2 unread",
    icon: MessageSquare,
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-purple-500",
    href: "/dashboard?tab=messages",
    size: "small",
    priority: 5,
  },
  {
    id: "marketplace",
    title: "Marketplace",
    subtitle: "Browse services",
    icon: ShoppingBag,
    color: "text-rose-600",
    gradient: "from-rose-500 to-pink-500",
    href: "/browse",
    size: "medium",
    priority: 6,
  },
];

const quickActions = [
  {
    id: "request",
    label: "Request Service",
    icon: Plus,
    href: "/request-service",
  },
  {
    id: "pay",
    label: "Quick Pay",
    icon: CreditCard,
    href: "/payments?tab=pay",
  },
  { id: "wallet", label: "Wallet", icon: Wallet, href: "/payments" },
  { id: "scan", label: "QR Pay", icon: Eye, href: "/payments?tab=qr" },
];

interface MobileDashboardProps {
  className?: string;
}

export function MobileDashboard({ className }: MobileDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const router = useRouter();
  const isMobile = useIsMobile();
  const t = useTranslations("Mobile.dashboard");

  useEffect(() => {
    // Simulate AI suggestions
    const suggestions = [
      "House cleaning service",
      "Plumber near me",
      "Handyman for repairs",
      "Pet grooming",
      "Tutoring services",
    ];
    setAiSuggestions(suggestions.slice(0, 3));

    // Simulate recent activity
    setRecentActivity([
      {
        id: 1,
        action: "Payment received",
        amount: "$125.00",
        time: "2 min ago",
        type: "payment",
      },
      {
        id: 2,
        action: "New booking",
        service: "House Cleaning",
        time: "15 min ago",
        type: "booking",
      },
      {
        id: 3,
        action: "Review received",
        rating: 5,
        time: "1 hour ago",
        type: "review",
      },
    ]);
  }, []);

  const handleTileClick = (tile: DashboardTile) => {
    router.push(tile.href);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <div className={cn("pb-safe-area", className)}>
      {/* AI-Powered Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 pr-4 py-3 rounded-2xl border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />
          {searchQuery && (
            <Button
              size="sm"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:shadow-lg transition-all duration-300"
            >
              <Zap className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {aiSuggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 rounded-full whitespace-nowrap cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  setSearchQuery(suggestion);
                  handleSearch();
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                onClick={() => router.push(action.href)}
                className="flex flex-col items-center gap-2 p-4 h-auto rounded-2xl hover:bg-accent/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Tiles */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {dashboardTiles
            .sort((a, b) => a.priority - b.priority)
            .map((tile) => {
              const Icon = tile.icon;
              const isLarge = tile.size === "large";

              return (
                <Card
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden",
                    isLarge && "col-span-2",
                  )}
                >
                  <CardContent className="p-4 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-5`}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tile.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm mb-1">
                          {tile.title}
                        </h3>
                        {tile.value && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">
                              {tile.value}
                            </span>
                            {tile.change && (
                              <span className="text-xs text-emerald-600 font-medium">
                                {tile.change}
                              </span>
                            )}
                          </div>
                        )}
                        {tile.subtitle && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {tile.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard?tab=activity")}
          >
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <Card
              key={activity.id}
              className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-sm font-bold text-emerald-600">
                    {activity.amount}
                  </span>
                )}
                {activity.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-slate-700 text-slate-700 dark:fill-white dark:text-white" />
                    <span className="text-sm font-medium">
                      {activity.rating}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Security Status */}
      <div className="px-4 mb-6">
        <Card className="border-0 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Account Secure
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  End-to-end encrypted • Biometric enabled
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/settings?tab=security")}
            >
              <Lock className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
