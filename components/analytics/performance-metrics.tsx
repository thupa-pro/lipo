"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Activity,
  Zap,
  Clock,
  Shield,
  Server,
  Database,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
  Users,
  MessageSquare,
} from "lucide-react";

interface PerformanceMetricsProps {
  filters: any;
  isRealtime: boolean;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function PerformanceMetrics({
  filters,
  isRealtime,
}: PerformanceMetricsProps) {
  const [data, setData] = useState({
    systemHealth: {
      uptime: 99.97,
      responseTime: 245,
      errorRate: 0.08,
      throughput: 1247,
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 34,
    },
    performanceData: [
      { time: "00:00", responseTime: 230, requests: 145, errors: 2 },
      { time: "04:00", responseTime: 215, requests: 89, errors: 1 },
      { time: "08:00", responseTime: 280, requests: 267, errors: 4 },
      { time: "12:00", responseTime: 320, requests: 445, errors: 8 },
      { time: "16:00", responseTime: 285, requests: 389, errors: 5 },
      { time: "20:00", responseTime: 255, requests: 234, errors: 3 },
    ],
    userExperience: {
      pageLoadTime: 1.8,
      bounceRate: 32.5,
      sessionDuration: 4.2,
      pagesPerSession: 2.8,
      conversionRate: 12.4,
      customerSatisfaction: 4.7,
    },
    securityMetrics: {
      threatLevel: "Low",
      blockedAttacks: 23,
      vulnerabilities: 2,
      securityScore: 94,
      lastSecurityScan: "2 hours ago",
    },
    apiMetrics: [
      { endpoint: "/api/users", calls: 2847, avgTime: 180, errorRate: 0.2 },
      { endpoint: "/api/jobs", calls: 1923, avgTime: 245, errorRate: 0.1 },
      { endpoint: "/api/payments", calls: 1456, avgTime: 320, errorRate: 0.5 },
      { endpoint: "/api/auth", calls: 3421, avgTime: 95, errorRate: 0.8 },
      {
        endpoint: "/api/notifications",
        calls: 5672,
        avgTime: 65,
        errorRate: 0.1,
      },
    ],
    errorBreakdown: [
      { type: "4xx Client Errors", count: 145, percentage: 65 },
      { type: "5xx Server Errors", count: 58, percentage: 26 },
      { type: "Network Timeouts", count: 20, percentage: 9 },
    ],
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        systemHealth: {
          ...prev.systemHealth,
          responseTime: Math.max(
            200,
            Math.min(
              400,
              prev.systemHealth.responseTime + (Math.random() - 0.5) * 20,
            ),
          ),
          throughput: Math.max(
            1000,
            Math.min(
              1500,
              prev.systemHealth.throughput +
                Math.floor((Math.random() - 0.5) * 50),
            ),
          ),
          cpuUsage: Math.max(
            30,
            Math.min(
              80,
              prev.systemHealth.cpuUsage + (Math.random() - 0.5) * 10,
            ),
          ),
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealtime]);

  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number },
  ) => {
    if (value <= thresholds.good) return "text-green-600";
    if (value <= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (
    value: number,
    thresholds: { good: number; warning: number },
  ) => {
    if (value <= thresholds.good)
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (value <= thresholds.warning)
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.systemHealth.uptime}%
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Excellent
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">
                  {Math.round(data.systemHealth.responseTime)}ms
                </p>
                <div
                  className={`flex items-center text-sm ${getStatusColor(data.systemHealth.responseTime, { good: 250, warning: 400 })}`}
                >
                  {getStatusIcon(data.systemHealth.responseTime, {
                    good: 250,
                    warning: 400,
                  })}
                  {data.systemHealth.responseTime <= 250
                    ? "Fast"
                    : data.systemHealth.responseTime <= 400
                      ? "Moderate"
                      : "Slow"}
                </div>
              </div>
              <Clock className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.systemHealth.errorRate}%
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Low
                </div>
              </div>
              <Shield className="w-8 h-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Throughput</p>
                <p className="text-2xl font-bold">
                  {data.systemHealth.throughput.toLocaleString()}
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  req/min
                </div>
              </div>
              <Zap className="w-8 h-8 text-yellow-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Trends (Last 24 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="time"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="responseTime"
                  stroke={COLORS[0]}
                  strokeWidth={3}
                  name="Response Time (ms)"
                  dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="requests"
                  stroke={COLORS[1]}
                  strokeWidth={3}
                  name="Requests/min"
                  dot={{ fill: COLORS[1], strokeWidth: 2, r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="errors"
                  stroke={COLORS[2]}
                  strokeWidth={2}
                  name="Errors"
                  dot={{ fill: COLORS[2], strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage and API Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>CPU Usage</span>
                <span className="font-medium">
                  {Math.round(data.systemHealth.cpuUsage)}%
                </span>
              </div>
              <Progress
                value={data.systemHealth.cpuUsage}
                className="h-3"
                style={{
                  background:
                    data.systemHealth.cpuUsage > 80
                      ? "#ef444420"
                      : data.systemHealth.cpuUsage > 60
                        ? "#f59e0b20"
                        : "#10b98120",
                }}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Memory Usage</span>
                <span className="font-medium">
                  {data.systemHealth.memoryUsage}%
                </span>
              </div>
              <Progress
                value={data.systemHealth.memoryUsage}
                className="h-3"
                style={{
                  background:
                    data.systemHealth.memoryUsage > 80
                      ? "#ef444420"
                      : data.systemHealth.memoryUsage > 60
                        ? "#f59e0b20"
                        : "#10b98120",
                }}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Disk Usage</span>
                <span className="font-medium">
                  {data.systemHealth.diskUsage}%
                </span>
              </div>
              <Progress
                value={data.systemHealth.diskUsage}
                className="h-3"
                style={{
                  background:
                    data.systemHealth.diskUsage > 80
                      ? "#ef444420"
                      : data.systemHealth.diskUsage > 60
                        ? "#f59e0b20"
                        : "#10b98120",
                }}
              />
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {data.systemHealth.throughput}
                  </div>
                  <div className="text-xs text-muted-foreground">Req/min</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {data.systemHealth.uptime}%
                  </div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              API Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.apiMetrics.map((api, index) => (
                <div
                  key={api.endpoint}
                  className="space-y-2 p-3 border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">{api.endpoint}</span>
                    <Badge
                      variant="outline"
                      className={`${
                        api.errorRate < 0.5
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {api.errorRate}% errors
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span>{api.calls.toLocaleString()} calls</span>
                    <span>{api.avgTime}ms avg</span>
                    <span
                      className={
                        api.errorRate > 0.5
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {api.errorRate < 0.5 ? "Healthy" : "Watch"}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, (api.avgTime / 500) * 100)}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Experience Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {data.userExperience.pageLoadTime}s
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Page Load Time
            </div>
            <Progress value={85} className="h-2" />
            <div className="text-xs text-green-600 mt-1">Fast</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {data.userExperience.sessionDuration}min
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Avg Session
            </div>
            <Progress value={70} className="h-2" />
            <div className="text-xs text-green-600 mt-1">Good</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {data.userExperience.bounceRate}%
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Bounce Rate
            </div>
            <Progress value={data.userExperience.bounceRate} className="h-2" />
            <div className="text-xs text-green-600 mt-1">Low</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data.userExperience.pagesPerSession}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Pages/Session
            </div>
            <Progress value={56} className="h-2" />
            <div className="text-xs text-green-600 mt-1">Average</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {data.userExperience.conversionRate}%
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Conversion Rate
            </div>
            <Progress
              value={data.userExperience.conversionRate * 8}
              className="h-2"
            />
            <div className="text-xs text-green-600 mt-1">Good</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {data.userExperience.customerSatisfaction}/5
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Customer Rating
            </div>
            <Progress
              value={data.userExperience.customerSatisfaction * 20}
              className="h-2"
            />
            <div className="text-xs text-green-600 mt-1">Excellent</div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div>
                <div className="font-medium text-green-800 dark:text-green-400">
                  Threat Level: {data.securityMetrics.threatLevel}
                </div>
                <div className="text-sm text-green-600">System is secure</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold">
                  {data.securityMetrics.blockedAttacks}
                </div>
                <div className="text-xs text-muted-foreground">
                  Blocked Attacks
                </div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold">
                  {data.securityMetrics.vulnerabilities}
                </div>
                <div className="text-xs text-muted-foreground">
                  Vulnerabilities
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Security Score</span>
                <span className="font-medium">
                  {data.securityMetrics.securityScore}/100
                </span>
              </div>
              <Progress
                value={data.securityMetrics.securityScore}
                className="h-3"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Last scan: {data.securityMetrics.lastSecurityScan}
            </div>
          </CardContent>
        </Card>

        {/* Error Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Error Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.errorBreakdown.map((error, index) => (
                <div key={error.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{error.type}</span>
                    <span>
                      {error.count} errors ({error.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={error.percentage}
                    className="h-3"
                    style={{
                      background: `${COLORS[index % COLORS.length]}20`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-sm font-medium mb-1">Recommendations:</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  • Monitor 4xx errors - potential API documentation issues
                </li>
                <li>• Investigate 5xx spikes during peak hours</li>
                <li>• Optimize timeout handling for better UX</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
