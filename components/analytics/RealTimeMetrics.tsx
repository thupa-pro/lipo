"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Zap,
  Server,
  Database,
  Globe,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { analyticsClient } from "@/lib/analytics/utils";
import type { RealTimeMetrics as RealTimeMetricsType } from "@/lib/analytics/types";
import { toast } from "sonner";

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<RealTimeMetricsType>({
    currentActiveUsers: 0,
    realtimeBookings: 0,
    systemLoad: 0,
    alertsCount: 0,
    recentActivity: [],
    geographicActivity: [],
  });
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isLive) {
      startRealTimeUpdates();
    } else {
      stopRealTimeUpdates();
    }

    return () => {
      stopRealTimeUpdates();
    };
  }, [isLive]);

  const startRealTimeUpdates = () => {
    // Initial load
    loadRealTimeMetrics();

    // Set up periodic updates every 5 seconds
    intervalRef.current = setInterval(() => {
      loadRealTimeMetrics();
    }, 5000);

    // Set up real-time subscriptions
    unsubscribeRef.current = analyticsClient.subscribeToRealTimeMetrics(
      (data) => {
        setMetrics(data);
        setLastUpdate(new Date());
      },
    );
  };

  const stopRealTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  };

  const loadRealTimeMetrics = async () => {
    try {
      const response = await analyticsClient.getRealTimeMetrics();
      if (response.success && response.data) {
        setMetrics(response.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error loading real-time metrics:", error);
      if (isLive) {
        toast.error("Failed to update real-time metrics");
      }
    }
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
    if (!isLive) {
      toast.success("Real-time updates enabled");
    } else {
      toast.info("Real-time updates paused");
    }
  };

  const getSystemLoadStatus = (load: number) => {
    if (load < 30)
      return { color: "text-green-600", label: "Low", icon: CheckCircle };
    if (load < 70)
      return { color: "text-yellow-600", label: "Medium", icon: AlertTriangle };
    return { color: "text-red-600", label: "High", icon: XCircle };
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "📅";
      case "signup":
        return "👋";
      case "payment":
        return "💳";
      case "error":
        return "⚠️";
      default:
        return "📊";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "booking":
        return "text-blue-600";
      case "signup":
        return "text-green-600";
      case "payment":
        return "text-purple-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  const systemLoadStatus = getSystemLoadStatus(metrics.systemLoad);
  const SystemLoadIcon = systemLoadStatus.icon;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className={cn("h-5 w-5", isLive && "text-green-600")} />
              Real-Time Metrics
            </CardTitle>
            <CardDescription>
              Live platform activity and system status • Last updated:{" "}
              {formatTime(lastUpdate)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isLive ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  isLive ? "bg-green-500 animate-pulse" : "bg-gray-400",
                )}
              />
              {isLive ? "LIVE" : "PAUSED"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLiveUpdates}
              className="flex items-center gap-1"
            >
              {isLive ? (
                <>
                  <Pause className="h-3 w-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {/* Active Users */}
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Users
              </p>
              <p className="text-2xl font-bold">{metrics.currentActiveUsers}</p>
            </div>
          </div>

          {/* Realtime Bookings */}
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Live Bookings
              </p>
              <p className="text-2xl font-bold">{metrics.realtimeBookings}</p>
            </div>
          </div>

          {/* System Load */}
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <div
              className={cn(
                "p-2 rounded-lg",
                metrics.systemLoad < 30
                  ? "bg-green-100"
                  : metrics.systemLoad < 70
                    ? "bg-yellow-100"
                    : "bg-red-100",
              )}
            >
              <SystemLoadIcon
                className={cn("h-5 w-5", systemLoadStatus.color)}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                System Load
              </p>
              <p className="text-2xl font-bold">{metrics.systemLoad}%</p>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <div
              className={cn(
                "p-2 rounded-lg",
                metrics.alertsCount === 0 ? "bg-green-100" : "bg-red-100",
              )}
            >
              <AlertTriangle
                className={cn(
                  "h-5 w-5",
                  metrics.alertsCount === 0 ? "text-green-600" : "text-red-600",
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Alerts
              </p>
              <p className="text-2xl font-bold">{metrics.alertsCount}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {metrics.recentActivity.length > 0 ? (
                    metrics.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="text-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              getActivityColor(activity.type),
                            )}
                          >
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                        {activity.severity && (
                          <Badge
                            variant={
                              activity.severity === "error"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {activity.severity}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Geographic Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Geographic Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {metrics.geographicActivity.length > 0 ? (
                    metrics.geographicActivity
                      .sort((a, b) => b.activityCount - a.activityCount)
                      .slice(0, 10)
                      .map((location, index) => (
                        <div
                          key={location.location}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {location.location}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {location.latitude.toFixed(2)},{" "}
                                {location.longitude.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {location.activityCount}
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No geographic data</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* System Status Indicators */}
        <Separator className="my-4" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">API Server</span>
            <Badge variant="secondary" className="bg-green-100 text-green-600">
              Healthy
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Database</span>
            <Badge variant="secondary" className="bg-green-100 text-green-600">
              Operational
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">CDN</span>
            <Badge variant="secondary" className="bg-green-100 text-green-600">
              Online
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
