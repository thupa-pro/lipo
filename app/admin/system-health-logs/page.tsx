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
import {
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Cloud,
  Server,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  description: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  source: string;
}

export default function SystemHealthLogsPage() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: "API Response Time",
      value: 120,
      unit: "ms",
      status: "healthy",
      description: "Average response time for API requests.",
    },
    {
      name: "Database Latency",
      value: 45,
      unit: "ms",
      status: "healthy",
      description: "Average database query latency.",
    },
    {
      name: "Server CPU Usage",
      value: 65,
      unit: "%",
      status: "warning",
      description: "Current CPU utilization across servers.",
    },
    {
      name: "Memory Usage",
      value: 82,
      unit: "%",
      status: "warning",
      description: "Total memory consumption.",
    },
    {
      name: "Error Rate",
      value: 0.5,
      unit: "%",
      status: "healthy",
      description: "Percentage of failed requests.",
    },
    {
      name: "Uptime",
      value: 99.9,
      unit: "%",
      status: "healthy",
      description: "Overall system uptime.",
    },
  ]);

  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      timestamp: "2024-04-22 10:30:00",
      level: "error",
      message:
        "Failed to process payment for user ID: 12345. Stripe API error.",
      source: "payments-service",
    },
    {
      id: "log-2",
      timestamp: "2024-04-22 10:25:15",
      level: "warn",
      message:
        "High memory usage detected on worker-node-7. Threshold exceeded.",
      source: "monitoring-agent",
    },
    {
      id: "log-3",
      timestamp: "2024-04-22 10:20:00",
      level: "info",
      message: "New provider 'Jane Doe' successfully onboarded.",
      source: "auth-service",
    },
    {
      id: "log-4",
      timestamp: "2024-04-22 10:15:30",
      level: "debug",
      message: "Database connection pool usage: 75%.",
      source: "database-service",
    },
    {
      id: "log-5",
      timestamp: "2024-04-22 10:10:00",
      level: "error",
      message: "Geolocation service timeout for user ID: 67890.",
      source: "location-service",
    },
  ]);

  const { toast } = useToast();

  // Simulate real-time updates for metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          let newValue = metric.value;
          let newStatus = metric.status;

          if (metric.name === "API Response Time") {
            newValue = Math.max(
              100,
              Math.min(150, metric.value + (Math.random() * 20 - 10)),
            );
            newStatus = newValue > 140 ? "warning" : "healthy";
          } else if (metric.name === "Server CPU Usage") {
            newValue = Math.max(
              30,
              Math.min(90, metric.value + (Math.random() * 10 - 5)),
            );
            newStatus =
              newValue > 80
                ? "critical"
                : newValue > 70
                  ? "warning"
                  : "healthy";
          } else if (metric.name === "Memory Usage") {
            newValue = Math.max(
              50,
              Math.min(95, metric.value + (Math.random() * 8 - 4)),
            );
            newStatus =
              newValue > 90
                ? "critical"
                : newValue > 80
                  ? "warning"
                  : "healthy";
          } else if (metric.name === "Uptime") {
            newValue = 99.9 + (Math.random() * 0.1 - 0.05);
            newStatus = newValue < 99.8 ? "critical" : "healthy";
          }

          return {
            ...metric,
            value: parseFloat(newValue.toFixed(1)),
            status: newStatus,
          };
        }),
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLogLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-600";
      case "warn":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      case "debug":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  const chartData = systemMetrics.find((m) => m.name === "API Response Time")
    ? Array.from({ length: 10 }).map((_, i) => ({
        time: `${i * 5}s`,
        value: Math.max(80, Math.min(180, 120 + (Math.random() * 60 - 30))), // Simulate fluctuating data
      }))
    : [];

  const chartConfig = {
    value: {
      label: "Response Time (ms)",
      color: "hsl(var(--primary))",
    },
  };

  const handleRefreshLogs = () => {
    toast({
      title: "Refreshing Logs",
      description: "Fetching latest system logs...",
      variant: "default",
    });
    // Simulate fetching new logs
    setRecentLogs((prev) =>
      [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          level: (Math.random() > 0.7
              ? "error"
              : Math.random() > 0.4
                ? "warn"
                : "info") as "info" | "warn" | "error",
          message: `Simulated new log entry: ${Math.random() > 0.5 ? "Successful operation." : "Minor issue detected."}`,
          source: "sim-service",
        },
        ...prev,
      ].slice(0, 5),
    ); // Keep only latest 5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-9 h-9 text-red-600" />
            System Health & Logs
          </h1>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Monitor platform stability, performance, and review real-time error
          logs for quick issue resolution.
        </p>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overall Status
                </CardTitle>
                <div className="text-4xl font-bold mt-2 text-green-800 dark:text-green-200">
                  Operational
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All systems nominal
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Warnings
                </CardTitle>
                <div className="text-4xl font-bold mt-2 text-yellow-800 dark:text-yellow-200">
                  {systemMetrics.filter((m) => m.status === "warning").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minor issues detected
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Critical Errors
                </CardTitle>
                <div className="text-4xl font-bold mt-2 text-red-800 dark:text-red-200">
                  {systemMetrics.filter((m) => m.status === "critical").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Immediate action required
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-600 opacity-30" />
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics & Charts */}
        <Card className="shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Clock className="w-6 h-6 text-primary" />
              Real-time Performance Metrics
            </CardTitle>
            <CardDescription>
              Key indicators of system health and responsiveness.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metric.name}</span>
                      <span className="font-medium">
                        {metric.value}
                        {metric.unit}
                      </span>
                    </div>
                    <Progress
                      value={metric.value}
                      className={`h-2 ${
                        metric.status === "healthy"
                          ? "text-green-500"
                          : metric.status === "warning"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    />
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  API Response Time Trend
                </h3>
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-4 mt-4">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Metrics
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Run Diagnostics
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="w-6 h-6 text-primary" />
              Recent Logs
            </CardTitle>
            <CardDescription>
              Latest system events and error messages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={handleRefreshLogs}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh Logs
              </Button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              {recentLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No recent logs.</p>
                  <p className="text-sm">System is quiet.</p>
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-3 border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <Badge
                      variant="outline"
                      className={`capitalize ${getLogLevelColor(log.level)}`}
                    >
                      {log.level}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">{log.source}</span> •{" "}
                        {log.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <Card className="mt-10 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-950/30 dark:to-teal-950/30 shadow-xl border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-3 text-blue-800 dark:text-blue-200">
              Ensure Uninterrupted Platform Performance
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Proactively monitor system health and quickly respond to any
              issues to maintain a seamless user experience.
            </p>
            <Button
              size="lg"
              variant="default"
              asChild
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/admin">
                Back to Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
