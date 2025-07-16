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
} from "recharts";
import {
  Activity,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { analyticsClient } from "@/lib/analytics/utils";
import { CHART_COLORS } from "@/lib/analytics/types";
import type { PerformanceMetrics } from "@/lib/analytics/types";
import { toast } from "sonner";

interface PerformanceMonitoringProps {
  timeframe: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function PerformanceMonitoring({
  timeframe,
}: PerformanceMonitoringProps) {
  const [loading, setLoading] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    loadPerformanceMetrics();
  }, [timeframe]);

  const loadPerformanceMetrics = async () => {
    setLoading(true);
    try {
      const response = await analyticsClient.getPerformanceMetrics(timeframe);
      if (response.success) {
        setPerformanceMetrics(response.data);
      }
    } catch (error) {
      console.error("Error loading performance metrics:", error);
      toast.error("Failed to load performance metrics");
    } finally {
      setLoading(false);
    }
  };

  const getSystemHealthStatus = (status: string) => {
    switch (status) {
      case "healthy":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Healthy",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          label: "Warning",
        };
      case "critical":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Critical",
        };
      default:
        return {
          icon: Activity,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          label: "Unknown",
        };
    }
  };

  const getErrorImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const systemHealth = performanceMetrics?.systemHealth;
  const healthStatus = systemHealth
    ? getSystemHealthStatus(systemHealth.status)
    : null;
  const HealthIcon = healthStatus?.icon || Activity;

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      {systemHealth && (
        <Alert
          className={
            systemHealth.status === "critical" ? "border-red-200 bg-red-50" : ""
          }
        >
          <HealthIcon className={`h-4 w-4 ${healthStatus?.color}`} />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                System Status:{" "}
                <strong className={healthStatus?.color}>
                  {healthStatus?.label}
                </strong>
              </span>
              <div className="flex items-center gap-4 text-sm">
                <span>Uptime: {formatPercentage(systemHealth.uptime)}</span>
                <span>
                  Response: {formatDuration(systemHealth.responseTime)}
                </span>
                <span>
                  Error Rate: {formatPercentage(systemHealth.errorRate)}
                </span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth ? formatPercentage(systemHealth.uptime) : "..."}
            </div>
            <Progress value={systemHealth?.uptime || 0} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth ? formatDuration(systemHealth.responseTime) : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              P95:{" "}
              {performanceMetrics?.apiMetrics
                ? formatDuration(performanceMetrics.apiMetrics.p95ResponseTime)
                : "..."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth ? formatPercentage(systemHealth.errorRate) : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              Failed requests:{" "}
              {performanceMetrics?.apiMetrics
                ? formatNumber(performanceMetrics.apiMetrics.failedRequests)
                : "..."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth ? formatNumber(systemHealth.throughput) : "..."}
            </div>
            <div className="text-xs text-muted-foreground">requests/min</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
          <CardDescription>
            System performance metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceMetrics?.performanceTimeline || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="responseTime"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                name="Response Time (ms)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="throughput"
                stroke={CHART_COLORS.secondary}
                strokeWidth={2}
                name="Throughput (req/min)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="errorRate"
                stroke={CHART_COLORS.danger}
                fill={CHART_COLORS.danger}
                fillOpacity={0.3}
                name="Error Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Database Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Performance
            </CardTitle>
            <CardDescription>
              Database metrics and query performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {performanceMetrics?.databaseMetrics && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Active Connections
                  </span>
                  <Badge variant="secondary">
                    {formatNumber(
                      performanceMetrics.databaseMetrics.connectionCount,
                    )}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Query Performance</span>
                    <span>
                      {formatDuration(
                        performanceMetrics.databaseMetrics.queryPerformance,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (1000 /
                        performanceMetrics.databaseMetrics.queryPerformance) *
                        100,
                      100,
                    )}
                    className="h-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <Badge
                    variant={
                      performanceMetrics.databaseMetrics.cacheHitRate > 80
                        ? "default"
                        : "secondary"
                    }
                  >
                    {formatPercentage(
                      performanceMetrics.databaseMetrics.cacheHitRate,
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Slow Queries</span>
                  <Badge
                    variant={
                      performanceMetrics.databaseMetrics.slowQueries > 10
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {formatNumber(
                      performanceMetrics.databaseMetrics.slowQueries,
                    )}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              API Performance
            </CardTitle>
            <CardDescription>API endpoints and request metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceMetrics?.apiMetrics && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Requests</span>
                  <Badge variant="secondary">
                    {formatNumber(performanceMetrics.apiMetrics.totalRequests)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Success Rate</span>
                    <span>
                      {formatPercentage(
                        (performanceMetrics.apiMetrics.successfulRequests /
                          performanceMetrics.apiMetrics.totalRequests) *
                          100,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={
                      (performanceMetrics.apiMetrics.successfulRequests /
                        performanceMetrics.apiMetrics.totalRequests) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg Response Time</span>
                  <Badge variant="secondary">
                    {formatDuration(
                      performanceMetrics.apiMetrics.averageResponseTime,
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">P95 Response Time</span>
                  <Badge variant="secondary">
                    {formatDuration(
                      performanceMetrics.apiMetrics.p95ResponseTime,
                    )}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Analysis
          </CardTitle>
          <CardDescription>Recent errors and their impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceMetrics?.errorAnalysis &&
            performanceMetrics.errorAnalysis.length > 0 ? (
              performanceMetrics.errorAnalysis.map((error, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{error.errorType}</p>
                      <p className="text-xs text-muted-foreground">
                        Last occurrence:{" "}
                        {new Date(error.lastOccurrence).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {formatNumber(error.count)} occurrences
                    </Badge>
                    <Badge variant={getErrorImpactColor(error.impact)}>
                      {error.impact} impact
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No recent errors detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
