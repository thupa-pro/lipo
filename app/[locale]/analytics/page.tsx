import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Switch } from "@/components/ui/switch";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { PerformanceMetrics } from "@/components/analytics/performance-metrics";
import { RevenueTrends } from "@/components/analytics/revenue-trends";
import { UserInsights } from "@/components/analytics/user-insights";
import { ExportModal } from "@/components/analytics/export-modal";
import { RealtimeIndicator } from "@/components/analytics/realtime-indicator";
import { BarChart3, Download, RefreshCw, Filter, TrendingUp, Activity, Eye, Share2,  } from "lucide-react";

interface AnalyticsFilter {
  dateRange: {
    from: Date;
    to: Date;
  };
  metrics: string[];
  segments: string[];
  granularity: "hour" | "day" | "week" | "month";
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRealtime, setIsRealtime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filters, setFilters] = useState<AnalyticsFilter>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    },
    metrics: ["revenue", "users", "jobs", "ratings"],
    segments: ["all"],
    granularity: "day",
  });

  // Auto-refresh for real-time data
  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In a real, app, this would trigger data refresh
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isRealtime]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleFilterChange = (key: keyof AnalyticsFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Analytics Center</h1>
              </div>
              <RealtimeIndicator
                isActive={isRealtime}
                lastUpdated={lastUpdated}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span>Real-time</span>
                <Switch checked={isRealtime} onCheckedChange={setIsRealtime} />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <DateRangePicker
                    from={filters.dateRange.from}
                    to={filters.dateRange.to}
                    onSelect={(range) => handleFilterChange("dateRange", range)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Granularity</label>
                  <Select
                    value={filters.granularity}
                    onValueChange={(value) =>
                      handleFilterChange("granularity", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">Hourly</SelectItem>
                      <SelectItem value="day">Daily</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Segments</label>
                  <Select
                    value={filters.segments[0] || ""}
                    onValueChange={(value) =>
                      handleFilterChange("segments", [value])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="providers">Providers</SelectItem>
                      <SelectItem value="new">New Users</SelectItem>
                      <SelectItem value="returning">Returning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Compare</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Previous period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="previous">Previous Period</SelectItem>
                      <SelectItem value="year">
                        Same Period Last Year
                      </SelectItem>
                      <SelectItem value="none">No Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <NavigationIcons.Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <BusinessIcons.DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsOverview filters={filters} isRealtime={isRealtime} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserInsights filters={filters} isRealtime={isRealtime} />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueTrends filters={filters} isRealtime={isRealtime} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics filters={filters} isRealtime={isRealtime} />
          </TabsContent>
        </Tabs>

        {/* Data Quality Indicator */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                Data Quality:
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  High (98.7%)
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        filters={filters}
      />
    </div>
  );
}
