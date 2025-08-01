import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { UserPlus, UserCheck, TrendingUp, TrendingDown, Smartphone, Monitor, Tablet, Globe,  } from "lucide-react";
import { analyticsClient } from "@/lib/analytics/utils";
import { CHART_COLORS } from "@/lib/analytics/types";
import type { UserMetrics, CohortAnalysis } from "@/lib/analytics/types";
import { toast } from "sonner";

interface UserAnalyticsProps {
  timeframe: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function UserAnalytics({ timeframe }: UserAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [cohortData, setCohortData] = useState<CohortAnalysis[]>([]);
  const [userGrowthChart, setUserGrowthChart] = useState<any[]>([]);

  useEffect(() => {
    loadUserAnalytics();
  }, [timeframe]);

  const loadUserAnalytics = async () => {
    setLoading(true);
    try {
      const [metrics, cohort, growth] = await Promise.all([
        analyticsClient.getUserMetrics(timeframe),
        analyticsClient.getCohortAnalysis(timeframe),
        analyticsClient.getUserGrowthChart(timeframe),
      ]);

      if (metrics.success) {
        setUserMetrics(metrics.data);
      }

      if (cohort.success) {
        setCohortData(cohort.data || []);
      }

      if (growth.success) {
        const chartData =
          growth.data?.labels?.map((label: string, index: number) => ({
            date: label,
            total: growth.data?.datasets?.[0]?.data?.[index] || 0,
            new: growth.data?.datasets?.[1]?.data?.[index] || 0,
            returning: growth.data?.datasets?.[2]?.data?.[index] || 0,
          })) || [];
        setUserGrowthChart(chartData);
      }
    } catch (error) {
      console.error("Error loading user analytics:", error);
      toast.error("Failed to load user analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return Smartphone;
      case "desktop":
        return Monitor;
      case "tablet":
        return Tablet;
      default:
        return Globe;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key User Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <NavigationIcons.Users className="h-4 w-4 text-muted-foreground" / />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userMetrics ? formatNumber(userMetrics.totalUsers) : "..."}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {userMetrics && userMetrics.userGrowthRate > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">
                    +{formatPercentage(userMetrics.userGrowthRate)}
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">
                    {formatPercentage(userMetrics?.userGrowthRate || 0)}
                  </span>
                </>
              )}
              <span>vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userMetrics ? formatNumber(userMetrics.newUsers) : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {userMetrics && userMetrics.totalUsers > 0
                ? `${formatPercentage((userMetrics.newUsers / userMetrics.totalUsers) * 100)} of total`
                : "No data"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userMetrics ? formatNumber(userMetrics.activeUsers) : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {userMetrics && userMetrics.totalUsers > 0
                ? `${formatPercentage((userMetrics.activeUsers / userMetrics.totalUsers) * 100)} activity rate`
                : "No data"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retention Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userMetrics
                ? formatPercentage(userMetrics.userRetentionRate)
                : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {userMetrics
                ? `${formatNumber(userMetrics.returningUsers)} returning users`
                : "No data"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Trends</CardTitle>
          <CardDescription>
            User acquisition and retention patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={userGrowthChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="total"
                stackId="1"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.6}
                name="Total Users"
              />
              <Area
                type="monotone"
                dataKey="new"
                stackId="2"
                stroke={CHART_COLORS.secondary}
                fill={CHART_COLORS.secondary}
                fillOpacity={0.8}
                name="New Users"
              />
              <Line
                type="monotone"
                dataKey="returning"
                stroke={CHART_COLORS.accent}
                strokeWidth={2}
                name="Returning Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Segmentation */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* User Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NavigationIcons.Users className="h-5 w-5" / />
              User Segments
            </CardTitle>
            <CardDescription>
              Users grouped by behavior and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userMetrics?.topUserSegments?.map((segment, index) => (
                <div key={segment.segment} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{segment.segment}</span>
                    <div className="flex items-center gap-2">
                      <span>{formatNumber(segment.count)} users</span>
                      <Badge variant="secondary">
                        {formatPercentage(segment.percentage)}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={segment.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BusinessIcons.MapPin className="h-5 w-5" / />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Users by location and region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userMetrics?.usersByLocation
                ?.slice(0, 8)
                .map((location, index) => (
                  <div
                    key={location.location}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">
                        {location.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {formatNumber(location.count)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage(location.percentage)}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Distribution
            </CardTitle>
            <CardDescription>User device preferences and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userMetrics?.usersByDevice?.map((device, index) => {
                const DeviceIcon = getDeviceIcon(device.device);
                return (
                  <div
                    key={device.device}
                    className="flex items-center space-x-3"
                  >
                    <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">
                          {device.device}
                        </span>
                        <span>{formatPercentage(device.percentage)}</span>
                      </div>
                      <Progress value={device.percentage} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Analysis */}
      {cohortData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cohort Retention Analysis</CardTitle>
            <CardDescription>
              User retention rates by signup month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Cohort</th>
                    <th className="text-center p-2 font-medium">Month 0</th>
                    <th className="text-center p-2 font-medium">Month 1</th>
                    <th className="text-center p-2 font-medium">Month 2</th>
                    <th className="text-center p-2 font-medium">Month 3</th>
                    <th className="text-center p-2 font-medium">Month 6</th>
                    <th className="text-center p-2 font-medium">Month 12</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((cohort) => (
                    <tr key={cohort.cohort} className="border-b">
                      <td className="p-2 font-medium">{cohort.cohort}</td>
                      <td className="p-2 text-center">
                        <Badge
                          variant="default"
                          className="bg-blue-100 text-blue-600"
                        >
                          100%
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <Badge
                          variant="secondary"
                          className={`${cohort.month1 > 50 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                        >
                          {formatPercentage(cohort.month1)}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <Badge
                          variant="secondary"
                          className={`${cohort.month2 > 40 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                        >
                          {formatPercentage(cohort.month2)}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <Badge
                          variant="secondary"
                          className={`${cohort.month3 > 30 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                        >
                          {formatPercentage(cohort.month3)}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <Badge
                          variant="secondary"
                          className={`${cohort.month6 > 20 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {formatPercentage(cohort.month6)}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <Badge
                          variant="secondary"
                          className={`${cohort.month12 > 15 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {formatPercentage(cohort.month12)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
