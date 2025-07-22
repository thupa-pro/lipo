"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  
  AlertTriangle,
  TrendingUp,
  Database,
  Users,
  List,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { billingClient } from "@/lib/billing/utils";
import type { UsageData, Subscription } from "@/lib/billing/types";

interface UsageMetricsProps {
  usageData: UsageData | null;
  subscription: Subscription | null;
}

export function UsageMetrics({ usageData, subscription }: UsageMetricsProps) {
  const [loading, setLoading] = useState(false);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatStorage = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}TB`;
    }
    return `${value}GB`;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 95) return "text-red-600";
    if (percentage >= 80) return "text-orange-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const isUnlimited = (limit: number) => limit === -1;

  const chartColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (!usageData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No usage data available
            </h3>
            <p className="text-muted-foreground text-center">
              Usage tracking will begin once you start using the platform
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallUsage = usageData.currentUsage;
  const isAtRisk = overallUsage >= 80;
  const isCritical = overallUsage >= 95;

  return (
    <div className="space-y-6">
      {/* Overall Usage Alert */}
      {isAtRisk && (
        <Alert
          className={cn(
            "border-orange-200 bg-orange-50",
            isCritical && "border-red-200 bg-red-50",
          )}
        >
          <AlertTriangle
            className={cn(
              "h-4 w-4",
              isCritical ? "text-red-600" : "text-orange-600",
            )}
          />
          <AlertDescription
            className={cn("text-orange-800", isCritical && "text-red-800")}
          >
            <strong>
              {isCritical ? "Critical:" : "Warning:"} High usage detected
            </strong>
            <br />
            You've used {overallUsage}% of your monthly quota.
            {isCritical
              ? " Consider upgrading your plan to avoid service interruption."
              : " Monitor your usage to avoid overage charges."}
            <Button variant="link" className="ml-2 p-0 h-auto text-current">
              Upgrade Plan
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Listings Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <List className="h-4 w-4" />
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatNumber(usageData.breakdown.listings.used)}
                </span>
                <Badge variant="outline">
                  {isUnlimited(usageData.breakdown.listings.limit)
                    ? "Unlimited"
                    : `of ${formatNumber(usageData.breakdown.listings.limit)}`}
                </Badge>
              </div>
              {!isUnlimited(usageData.breakdown.listings.limit) && (
                <div className="space-y-1">
                  <Progress
                    value={billingClient.calculateUsagePercentage(
                      usageData.breakdown.listings.used,
                      usageData.breakdown.listings.limit,
                    )}
                    className="h-2"
                  />
                  <div
                    className={cn(
                      "text-xs font-medium",
                      getUsageColor(
                        billingClient.calculateUsagePercentage(
                          usageData.breakdown.listings.used,
                          usageData.breakdown.listings.limit,
                        ),
                      ),
                    )}
                  >
                    {billingClient
                      .calculateUsagePercentage(
                        usageData.breakdown.listings.used,
                        usageData.breakdown.listings.limit,
                      )
                      .toFixed(1)}
                    % used
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bookings Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatNumber(usageData.breakdown.bookings.used)}
                </span>
                <Badge variant="outline">
                  {isUnlimited(usageData.breakdown.bookings.limit)
                    ? "Unlimited"
                    : `of ${formatNumber(usageData.breakdown.bookings.limit)}`}
                </Badge>
              </div>
              {!isUnlimited(usageData.breakdown.bookings.limit) && (
                <div className="space-y-1">
                  <Progress
                    value={billingClient.calculateUsagePercentage(
                      usageData.breakdown.bookings.used,
                      usageData.breakdown.bookings.limit,
                    )}
                    className="h-2"
                  />
                  <div
                    className={cn(
                      "text-xs font-medium",
                      getUsageColor(
                        billingClient.calculateUsagePercentage(
                          usageData.breakdown.bookings.used,
                          usageData.breakdown.bookings.limit,
                        ),
                      ),
                    )}
                  >
                    {billingClient
                      .calculateUsagePercentage(
                        usageData.breakdown.bookings.used,
                        usageData.breakdown.bookings.limit,
                      )
                      .toFixed(1)}
                    % used
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatNumber(usageData.breakdown.teamMembers.used)}
                </span>
                <Badge variant="outline">
                  {isUnlimited(usageData.breakdown.teamMembers.limit)
                    ? "Unlimited"
                    : `of ${formatNumber(usageData.breakdown.teamMembers.limit)}`}
                </Badge>
              </div>
              {!isUnlimited(usageData.breakdown.teamMembers.limit) && (
                <div className="space-y-1">
                  <Progress
                    value={billingClient.calculateUsagePercentage(
                      usageData.breakdown.teamMembers.used,
                      usageData.breakdown.teamMembers.limit,
                    )}
                    className="h-2"
                  />
                  <div
                    className={cn(
                      "text-xs font-medium",
                      getUsageColor(
                        billingClient.calculateUsagePercentage(
                          usageData.breakdown.teamMembers.used,
                          usageData.breakdown.teamMembers.limit,
                        ),
                      ),
                    )}
                  >
                    {billingClient
                      .calculateUsagePercentage(
                        usageData.breakdown.teamMembers.used,
                        usageData.breakdown.teamMembers.limit,
                      )
                      .toFixed(1)}
                    % used
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatStorage(usageData.breakdown.storage.used)}
                </span>
                <Badge variant="outline">
                  of {formatStorage(usageData.breakdown.storage.limit)}
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress
                  value={billingClient.calculateUsagePercentage(
                    usageData.breakdown.storage.used,
                    usageData.breakdown.storage.limit,
                  )}
                  className="h-2"
                />
                <div
                  className={cn(
                    "text-xs font-medium",
                    getUsageColor(
                      billingClient.calculateUsagePercentage(
                        usageData.breakdown.storage.used,
                        usageData.breakdown.storage.limit,
                      ),
                    ),
                  )}
                >
                  {billingClient
                    .calculateUsagePercentage(
                      usageData.breakdown.storage.used,
                      usageData.breakdown.storage.limit,
                    )
                    .toFixed(1)}
                  % used
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Usage Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage Trends
            </CardTitle>
            <CardDescription>
              Your usage patterns over the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData.usageHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="listings"
                  stackId="1"
                  stroke={chartColors[0]}
                  fill={chartColors[0]}
                  fillOpacity={0.6}
                  name="Listings"
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stackId="1"
                  stroke={chartColors[1]}
                  fill={chartColors[1]}
                  fillOpacity={0.6}
                  name="Bookings"
                />
                <Area
                  type="monotone"
                  dataKey="storage"
                  stackId="1"
                  stroke={chartColors[2]}
                  fill={chartColors[2]}
                  fillOpacity={0.6}
                  name="Storage (GB)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Usage Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of your resource usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Listings",
                      value: usageData.breakdown.listings.used,
                      color: chartColors[0],
                    },
                    {
                      name: "Bookings",
                      value: usageData.breakdown.bookings.used,
                      color: chartColors[1],
                    },
                    {
                      name: "API Calls",
                      value: usageData.breakdown.apiCalls.used / 100,
                      color: chartColors[2],
                    },
                    {
                      name: "Storage",
                      value: usageData.breakdown.storage.used,
                      color: chartColors[3],
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[...Array(4)].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Overage Information */}
      {usageData.overage.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Overage Pricing
            </CardTitle>
            <CardDescription>
              Additional charges when you exceed your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Additional Listings
                </div>
                <div className="text-xl font-bold">
                  ${usageData.overage.costs.listings.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">per listing</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Additional Bookings
                </div>
                <div className="text-xl font-bold">
                  ${usageData.overage.costs.bookings.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">per booking</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Additional API Calls
                </div>
                <div className="text-xl font-bold">
                  ${usageData.overage.costs.apiCalls.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  per 1,000 calls
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Additional Storage
                </div>
                <div className="text-xl font-bold">
                  ${usageData.overage.costs.storage.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  per GB/month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Suggestion */}
      {isAtRisk && subscription && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ArrowUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Consider upgrading your plan
                  </h3>
                  <p className="text-blue-700">
                    Get more resources and avoid overage charges with a higher
                    tier plan.
                  </p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Plans
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
