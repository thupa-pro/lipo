"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Server,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { useAdminClient, formatSystemHealth } from "@/lib/admin/utils";
import { useToast } from "@/hooks/use-toast";

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  active_connections: number;
  response_time: number;
  error_rate: number;
  uptime: number;
  last_updated: string;
}

export function SystemMonitoring() {
  const { toast } = useToast();
  const adminClient = useAdminClient();

  const [systemHealth, setSystemHealth] = useState<{
    status: "healthy" | "warning" | "critical";
    metrics: SystemMetrics;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSystemHealth();
    const interval = setInterval(loadSystemHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    try {
      const health = await adminClient.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error("Error loading system health:", error);
      toast({
        title: "Error",
        description: "Failed to load system health data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUsageColor = (usage: number, type: "cpu" | "memory" | "disk") => {
    const thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 80, critical: 95 },
      disk: { warning: 85, critical: 95 },
    };

    const threshold = thresholds[type];
    if (usage >= threshold.critical) return "text-red-600 bg-red-100";
    if (usage >= threshold.warning) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!systemHealth) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-600">System health data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthStatus = formatSystemHealth(systemHealth.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <p className="text-gray-600">
            Real-time system health and performance metrics
          </p>
        </div>
        <Button onClick={loadSystemHealth}>
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Status Overview */}
      <Card
        className={`border-l-4 ${
          systemHealth.status === "healthy"
            ? "border-green-500"
            : systemHealth.status === "warning"
              ? "border-yellow-500"
              : "border-red-500"
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={healthStatus.color}>{healthStatus.icon}</span>
            System Status: {healthStatus.label}
            <Badge className={`${healthStatus.color} bg-opacity-20`}>
              {systemHealth.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Uptime</div>
              <div className="font-medium">
                {formatUptime(systemHealth.metrics.uptime)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Active Connections</div>
              <div className="font-medium">
                {systemHealth.metrics.active_connections.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Response Time</div>
              <div className="font-medium">
                {systemHealth.metrics.response_time}ms
              </div>
            </div>
            <div>
              <div className="text-gray-600">Error Rate</div>
              <div className="font-medium">
                {(systemHealth.metrics.error_rate * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth.metrics.cpu_usage.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  systemHealth.metrics.cpu_usage >= 90
                    ? "bg-red-500"
                    : systemHealth.metrics.cpu_usage >= 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${systemHealth.metrics.cpu_usage}%` }}
              />
            </div>
            <Badge
              className={`mt-2 ${getUsageColor(systemHealth.metrics.cpu_usage, "cpu")}`}
            >
              {systemHealth.metrics.cpu_usage >= 90
                ? "Critical"
                : systemHealth.metrics.cpu_usage >= 70
                  ? "Warning"
                  : "Normal"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth.metrics.memory_usage.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  systemHealth.metrics.memory_usage >= 95
                    ? "bg-red-500"
                    : systemHealth.metrics.memory_usage >= 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${systemHealth.metrics.memory_usage}%` }}
              />
            </div>
            <Badge
              className={`mt-2 ${getUsageColor(systemHealth.metrics.memory_usage, "memory")}`}
            >
              {systemHealth.metrics.memory_usage >= 95
                ? "Critical"
                : systemHealth.metrics.memory_usage >= 80
                  ? "Warning"
                  : "Normal"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth.metrics.disk_usage.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  systemHealth.metrics.disk_usage >= 95
                    ? "bg-red-500"
                    : systemHealth.metrics.disk_usage >= 85
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${systemHealth.metrics.disk_usage}%` }}
              />
            </div>
            <Badge
              className={`mt-2 ${getUsageColor(systemHealth.metrics.disk_usage, "disk")}`}
            >
              {systemHealth.metrics.disk_usage >= 95
                ? "Critical"
                : systemHealth.metrics.disk_usage >= 85
                  ? "Warning"
                  : "Normal"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Services Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Database", status: "healthy", latency: "2ms" },
              { name: "API Gateway", status: "healthy", latency: "15ms" },
              { name: "Payment Service", status: "healthy", latency: "45ms" },
              { name: "Email Service", status: "warning", latency: "120ms" },
              { name: "File Storage", status: "healthy", latency: "8ms" },
              { name: "Cache Layer", status: "healthy", latency: "1ms" },
              { name: "Search Engine", status: "healthy", latency: "25ms" },
              { name: "Notifications", status: "healthy", latency: "35ms" },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {service.status === "healthy" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : service.status === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="text-sm text-gray-600">{service.latency}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: "info",
                message: "System backup completed successfully",
                time: "5 minutes ago",
              },
              {
                type: "warning",
                message: "High memory usage detected on server-2",
                time: "15 minutes ago",
              },
              {
                type: "info",
                message: "Database maintenance window scheduled",
                time: "1 hour ago",
              },
              {
                type: "success",
                message: "Performance optimization deployed",
                time: "2 hours ago",
              },
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                {event.type === "success" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {event.type === "warning" && (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
                {event.type === "info" && (
                  <Activity className="w-4 h-4 text-blue-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{event.message}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
