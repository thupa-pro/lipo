"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Import analytics components
import { MetricsOverview } from "@/components/analytics/MetricsOverview";
import { UserAnalytics } from "@/components/analytics/UserAnalytics";
import { RevenueAnalytics } from "@/components/analytics/RevenueAnalytics";
import { PerformanceMonitoring } from "@/components/analytics/PerformanceMonitoring";
import { BusinessIntelligence } from "@/components/analytics/BusinessIntelligence";
import { RealTimeMetrics } from "@/components/analytics/RealTimeMetrics";

// Analytics client
import { analyticsClient } from "@/lib/analytics/utils";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  const [timeframe, setTimeframe] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Key metrics state
  const [keyMetrics, setKeyMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    growthRate: 0,
    conversionRate: 0,
    avgSessionDuration: 0,
  });

  useEffect(() => {
    loadKeyMetrics();
  }, [timeframe, dateRange]);

  const loadKeyMetrics = async () => {
    setLoading(true);
    try {
      const response = await analyticsClient.getKeyMetrics(timeframe);
      if (response.success && response.data) {
        setKeyMetrics(response.data);
      } else {
        toast.error("Failed to load key metrics");
      }
    } catch (error) {
      console.error("Error loading key metrics:", error);
      toast.error("Error loading analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKeyMetrics();
    setTimeout(() => setRefreshing(false), 1000); // Visual feedback
    toast.success("Analytics data refreshed");
  };

  const handleExport = async () => {
    try {
      const response = await analyticsClient.exportAnalytics(
        timeframe,
        dateRange,
      );
      if (response.success && response.data) {
        // Create and trigger download
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `loconomy-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Analytics exported successfully");
      } else {
        toast.error("Failed to export analytics");
      }
    } catch (error) {
      console.error("Error exporting analytics:", error);
      toast.error("Error exporting data");
    }
  };

  const formatMetric = (
    value: number,
    type: "currency" | "number" | "percentage" | "duration",
  ) => {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "duration":
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return `${minutes}m ${seconds}s`;
      default:
        return new Intl.NumberFormat("en-US").format(value);
    }
  };

  const getMetricTrend = (value: number) => {
    if (value > 0)
      return { icon: TrendingUp, color: "text-green-600", direction: "up" };
    if (value < 0)
      return { icon: TrendingDown, color: "text-red-600", direction: "down" };
    return { icon: Activity, color: "text-gray-600", direction: "neutral" };
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics & Observability
          </h1>
          <p className="text-muted-foreground">
            Monitor platform performance, user behavior, and business metrics
          </p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          {/* Timeframe Selector */}
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          {timeframe === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatMetric(keyMetrics.totalUsers, "number")}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {(() => {
                const trend = getMetricTrend(keyMetrics.growthRate);
                const Icon = trend.icon;
                return (
                  <>
                    <Icon className={cn("h-3 w-3", trend.color)} />
                    <span className={trend.color}>
                      {Math.abs(keyMetrics.growthRate).toFixed(1)}%
                    </span>
                    <span>vs last period</span>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatMetric(keyMetrics.activeUsers, "number")}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>
                {keyMetrics.totalUsers > 0
                  ? `${((keyMetrics.activeUsers / keyMetrics.totalUsers) * 100).toFixed(1)}% of total users`
                  : "No data"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : formatMetric(keyMetrics.totalRevenue, "currency")}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span>vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : formatMetric(keyMetrics.conversionRate, "percentage")}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>
                Avg session:{" "}
                {formatMetric(keyMetrics.avgSessionDuration, "duration")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <RealTimeMetrics />

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="business">Business Intel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <MetricsOverview timeframe={timeframe} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserAnalytics timeframe={timeframe} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueAnalytics timeframe={timeframe} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMonitoring timeframe={timeframe} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <BusinessIntelligence timeframe={timeframe} dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
