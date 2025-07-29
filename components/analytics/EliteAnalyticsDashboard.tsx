"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Eye,
  Target,
  Zap,
  Brain,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Filter,
  Download,
  Share2,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    trend: "up" | "down" | "stable";
    forecast: number[];
  };
  users: {
    active: number;
    new: number;
    retention: number;
    churn: number;
    segments: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  };
  bookings: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    conversionRate: number;
    averageValue: number;
  };
  realTime: {
    activeUsers: number;
    currentSessions: number;
    pageViews: number;
    conversions: number;
    alerts: Array<{
      id: string;
      type: "warning" | "error" | "success" | "info";
      message: string;
      timestamp: Date;
    }>;
  };
  predictions: {
    nextWeekRevenue: number;
    churnRisk: Array<{
      userId: string;
      riskScore: number;
      reasons: string[];
    }>;
    demandForecast: Array<{
      category: string;
      predicted: number;
      confidence: number;
    }>;
  };
}

interface EliteAnalyticsDashboardProps {
  timeRange?: "1h" | "24h" | "7d" | "30d" | "90d";
  autoRefresh?: boolean;
  customFilters?: Record<string, any>;
}

export default function EliteAnalyticsDashboard({
  timeRange = "24h",
  autoRefresh = true,
  customFilters = {}
}: EliteAnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLive, setIsLive] = useState(autoRefresh);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState(customFilters);
  const [isLoading, setIsLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  // Real-time data connection
  useEffect(() => {
    if (isLive) {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/analytics`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: "subscribe",
          channels: ["revenue", "users", "bookings", "realtime", "predictions"],
          timeRange: selectedTimeRange,
          filters,
        }));
      };

      ws.onmessage = (event) => {
        const update = JSON.parse(event.data);
        
        switch (update.type) {
          case "full_update":
            setData(update.data);
            setIsLoading(false);
            break;
          case "partial_update":
            setData(prev => prev ? { ...prev, ...update.data } : null);
            break;
          case "alert":
            setData(prev => prev ? {
              ...prev,
              realTime: {
                ...prev.realTime,
                alerts: [update.alert, ...prev.realTime.alerts.slice(0, 9)]
              }
            } : null);
            break;
        }
      };

      return () => {
        ws.close();
      };
    } else {
      // Fetch static data
      fetchAnalyticsData();
    }
  }, [isLive, selectedTimeRange, filters]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics?timeRange=${selectedTimeRange}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }),
      });
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: "csv" | "pdf" | "excel") => {
    const response = await fetch(`/api/analytics/export?format=${format}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, timeRange: selectedTimeRange }),
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${selectedTimeRange}.${format}`;
    a.click();
  };

  const getMetricColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4" />;
      case "down": return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load analytics data</p>
        <Button onClick={fetchAnalyticsData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Elite Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time insights and predictive analytics for your platform
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          {/* Live Toggle */}
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isLive ? "Live" : "Static"}
          </Button>

          {/* Export */}
          <Select onValueChange={exportData}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Real-time Alerts */}
      {data.realTime.alerts.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
              Live Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.realTime.alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{alert.message}</span>
                  <Badge variant={alert.type === "error" ? "destructive" : "secondary"}>
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${data.revenue.current.toLocaleString()}
              </div>
              <p className={cn("text-xs flex items-center", getMetricColor(data.revenue.trend))}>
                {getTrendIcon(data.revenue.trend)}
                <span className="ml-1">
                  {data.revenue.trend === "up" ? "+" : ""}
                  {((data.revenue.current - data.revenue.previous) / data.revenue.previous * 100).toFixed(1)}%
                </span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Users Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.users.active.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{data.users.new} new users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversion Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.bookings.conversionRate.toFixed(1)}%
              </div>
              <Progress value={data.bookings.conversionRate} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-time Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.realTime.currentSessions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.realTime.pageViews} page views
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="predictions">AI Insights</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChartIcon className="w-5 h-5 mr-2" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={generateTimeSeriesData(data.revenue.current)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  User Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.users.segments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.users.segments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Booking Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{data.bookings.total}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{data.bookings.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{data.bookings.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{data.bookings.cancelled}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={generateBookingData(data.bookings)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10B981" />
                  <Bar dataKey="pending" fill="#F59E0B" />
                  <Bar dataKey="cancelled" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Revenue Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-green-600">
                    ${data.predictions.nextWeekRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Predicted next week revenue</p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={generateForecastData(data.revenue.forecast)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Churn Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Churn Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.predictions.churnRisk.slice(0, 5).map((risk, index) => (
                    <div key={risk.userId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">User #{risk.userId.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {risk.reasons.slice(0, 2).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={risk.riskScore > 0.7 ? "destructive" : risk.riskScore > 0.4 ? "secondary" : "default"}
                        >
                          {(risk.riskScore * 100).toFixed(0)}% Risk
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demand Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>AI Demand Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.predictions.demandForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="predicted" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Activity Feed */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Live Activity Feed
                  {isLive && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {generateLiveActivity().map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-2 border-l-2 border-blue-200 bg-blue-50 rounded-r"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-xs text-gray-600">{activity.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Live Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <span className="font-bold">{data.realTime.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Sessions</span>
                  <span className="font-bold">{data.realTime.currentSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Page Views</span>
                  <span className="font-bold">{data.realTime.pageViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Live Conversions</span>
                  <span className="font-bold text-green-600">{data.realTime.conversions}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for generating mock data
function generateTimeSeriesData(current: number) {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    data.push({
      time: `${i}h ago`,
      value: Math.round(current * (0.8 + Math.random() * 0.4)),
    });
  }
  return data.reverse();
}

function generateBookingData(bookings: any) {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString(),
      completed: Math.round(bookings.completed * (0.8 + Math.random() * 0.4) / 7),
      pending: Math.round(bookings.pending * (0.8 + Math.random() * 0.4) / 7),
      cancelled: Math.round(bookings.cancelled * (0.8 + Math.random() * 0.4) / 7),
    });
  }
  return data;
}

function generateForecastData(forecast: number[]) {
  const data = [];
  const today = new Date();
  
  // Historical data (actual)
  for (let i = 7; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString(),
      actual: Math.round(50000 + Math.random() * 20000),
      predicted: null,
    });
  }
  
  // Future data (predicted)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toLocaleDateString(),
      actual: null,
      predicted: forecast[i - 1] || Math.round(55000 + Math.random() * 15000),
    });
  }
  
  return data;
}

function generateLiveActivity() {
  const activities = [
    "New booking created",
    "Payment completed",
    "User signed up",
    "Review submitted",
    "Service completed",
    "Provider verified",
    "Refund processed",
    "Chat message sent",
  ];
  
  return Array.from({ length: 10 }, (_, index) => ({
    event: activities[Math.floor(Math.random() * activities.length)],
    timestamp: new Date(Date.now() - index * 30000).toLocaleTimeString(),
  }));
}
