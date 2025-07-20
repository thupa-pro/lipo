"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Star,
  Clock,
  Target,
  Zap,
  Activity,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Settings,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    trend: number[];
    forecast: number[];
  };
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    conversionRate: number;
    trend: number[];
  };
  customers: {
    total: number;
    active: number;
    new: number;
    returning: number;
    retention: number;
    segments: { name: string; value: number; color: string }[];
  };
  performance: {
    rating: number;
    responseTime: number;
    completionRate: number;
    satisfactionScore: number;
    kpis: { name: string; value: number; target: number; unit: string }[];
  };
  geographic: {
    topCities: { name: string; bookings: number; revenue: number }[];
    heatmap: { lat: number; lng: number; value: number }[];
  };
  services: {
    topPerforming: { name: string; bookings: number; revenue: number; rating: number }[];
    categories: { name: string; percentage: number; growth: number }[];
  };
}

interface ReportData {
  id: string;
  name: string;
  description: string;
  type: "revenue" | "performance" | "customer" | "operational";
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  lastGenerated: Date;
  recipients: string[];
  isActive: boolean;
}

interface DashboardWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "table" | "map";
  size: "small" | "medium" | "large";
  position: { x: number; y: number };
  config: any;
  isVisible: boolean;
}

export default function BusinessIntelligence() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["revenue", "bookings", "customers"]);

  // Mock data
  const mockAnalyticsData: AnalyticsData = {
    revenue: {
      total: 847650,
      growth: 23.5,
      trend: [65000, 72000, 68000, 75000, 82000, 88000, 92000, 85000, 89000, 94000, 98000, 105000],
      forecast: [108000, 112000, 118000, 125000],
    },
    bookings: {
      total: 3247,
      completed: 2891,
      cancelled: 201,
      pending: 155,
      conversionRate: 89.1,
      trend: [245, 267, 289, 301, 278, 295, 312, 334, 298, 315, 328, 342],
    },
    customers: {
      total: 12847,
      active: 8965,
      new: 1247,
      returning: 7718,
      retention: 85.3,
      segments: [
        { name: "Premium", value: 25, color: "#8B5CF6" },
        { name: "Regular", value: 60, color: "#3B82F6" },
        { name: "Occasional", value: 15, color: "#10B981" },
      ],
    },
    performance: {
      rating: 4.8,
      responseTime: 12,
      completionRate: 94.7,
      satisfactionScore: 92.3,
      kpis: [
        { name: "On-time Delivery", value: 96.2, target: 95, unit: "%" },
        { name: "First Response", value: 8, target: 15, unit: "min" },
        { name: "Resolution Rate", value: 98.1, target: 90, unit: "%" },
        { name: "Quality Score", value: 4.7, target: 4.5, unit: "/5" },
      ],
    },
    geographic: {
      topCities: [
        { name: "New York", bookings: 847, revenue: 234500 },
        { name: "Los Angeles", bookings: 653, revenue: 189200 },
        { name: "Chicago", bookings: 521, revenue: 145600 },
        { name: "Houston", bookings: 398, revenue: 112800 },
        { name: "Phoenix", bookings: 287, revenue: 89400 },
      ],
      heatmap: [
        { lat: 40.7128, lng: -74.0060, value: 847 },
        { lat: 34.0522, lng: -118.2437, value: 653 },
        { lat: 41.8781, lng: -87.6298, value: 521 },
        { lat: 29.7604, lng: -95.3698, value: 398 },
        { lat: 33.4484, lng: -112.0740, value: 287 },
      ],
    },
    services: {
      topPerforming: [
        { name: "Professional Cleaning", bookings: 892, revenue: 178400, rating: 4.9 },
        { name: "Home Repairs", bookings: 654, revenue: 196200, rating: 4.7 },
        { name: "Lawn Care", bookings: 543, revenue: 108600, rating: 4.8 },
        { name: "Moving Services", bookings: 398, revenue: 119400, rating: 4.6 },
        { name: "Pet Care", bookings: 321, revenue: 96300, rating: 4.9 },
      ],
      categories: [
        { name: "Home Services", percentage: 45, growth: 18.2 },
        { name: "Professional Services", percentage: 25, growth: 12.8 },
        { name: "Personal Care", percentage: 20, growth: 25.4 },
        { name: "Event Services", percentage: 10, growth: 8.9 },
      ],
    },
  };

  const mockReports: ReportData[] = [
    {
      id: "1",
      name: "Monthly Revenue Report",
      description: "Comprehensive revenue analysis with forecasting",
      type: "revenue",
      frequency: "monthly",
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recipients: ["ceo@company.com", "finance@company.com"],
      isActive: true,
    },
    {
      id: "2",
      name: "Customer Satisfaction Dashboard",
      description: "Customer feedback and satisfaction metrics",
      type: "customer",
      frequency: "weekly",
      lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      recipients: ["support@company.com", "operations@company.com"],
      isActive: true,
    },
    {
      id: "3",
      name: "Operational Performance Review",
      description: "KPI tracking and operational efficiency metrics",
      type: "operational",
      frequency: "daily",
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      recipients: ["ops@company.com"],
      isActive: true,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setReports(mockReports);
      setIsLoading(false);
    }, 1000);

    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        // In real app, this would fetch fresh data
        console.log("Refreshing analytics data...");
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) return { icon: TrendingUp, color: "text-green-600" };
    if (growth < 0) return { icon: TrendingDown, color: "text-red-600" };
    return { icon: Minus, color: "text-gray-600" };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Intelligence</h1>
          <p className="text-muted-foreground">
            Advanced analytics and insights for data-driven decisions
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Auto Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.total)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {(() => {
                        const { icon: Icon, color } = getGrowthIndicator(analyticsData.revenue.growth);
                        return (
                          <>
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className={`text-sm ${color}`}>
                              {analyticsData.revenue.growth > 0 ? "+" : ""}{analyticsData.revenue.growth}%
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{formatNumber(analyticsData.bookings.total)}</p>
                    <p className="text-sm text-blue-600">
                      {analyticsData.bookings.conversionRate}% conversion
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                    <p className="text-2xl font-bold">{formatNumber(analyticsData.customers.active)}</p>
                    <p className="text-sm text-purple-600">
                      {analyticsData.customers.retention}% retention
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">{analyticsData.performance.rating}</p>
                    <p className="text-sm text-yellow-600">
                      {analyticsData.performance.satisfactionScore}% satisfaction
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 p-4">
                  {analyticsData.revenue.trend.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 bg-blue-500 rounded-t"
                        style={{ height: `${(value / Math.max(...analyticsData.revenue.trend)) * 200}px` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {new Date(Date.now() - (11 - index) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.customers.segments.map((segment) => (
                    <div key={segment.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{segment.name}</span>
                        <span className="text-sm text-muted-foreground">{segment.value}%</span>
                      </div>
                      <Progress value={segment.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance KPIs */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData.performance.kpis.map((kpi) => (
                  <div key={kpi.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{kpi.name}</span>
                      <Badge className={kpi.value >= kpi.target ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {kpi.value >= kpi.target ? "On Track" : "Needs Attention"}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">
                      {kpi.value}{kpi.unit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Target: {kpi.target}{kpi.unit}
                    </div>
                    <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.geographic.topCities.map((city, index) => (
                  <div key={city.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{city.name}</h4>
                        <p className="text-sm text-muted-foreground">{city.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(city.revenue)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end justify-between gap-1 p-4">
                  {[...analyticsData.revenue.trend, ...analyticsData.revenue.forecast].map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-6 rounded-t ${
                          index < analyticsData.revenue.trend.length 
                            ? "bg-blue-500" 
                            : "bg-blue-300 border-2 border-dashed border-blue-500"
                        }`}
                        style={{ 
                          height: `${(value / Math.max(...analyticsData.revenue.trend, ...analyticsData.revenue.forecast)) * 280}px` 
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {index < analyticsData.revenue.trend.length ? "Actual" : "Forecast"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.services.categories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Growth: +{category.growth}%</span>
                        <span>{formatCurrency(analyticsData.revenue.total * (category.percentage / 100))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{formatNumber(analyticsData.customers.total)}</div>
                  <div className="text-sm text-muted-foreground">Total Customers</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formatNumber(analyticsData.customers.new)}</div>
                  <div className="text-sm text-muted-foreground">New This Month</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatNumber(analyticsData.customers.returning)}</div>
                  <div className="text-sm text-muted-foreground">Returning</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{analyticsData.customers.retention}%</div>
                  <div className="text-sm text-muted-foreground">Retention Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: "Website Visits", value: 45620, conversion: 100 },
                  { stage: "Service Views", value: 23450, conversion: 51.4 },
                  { stage: "Booking Initiated", value: 8970, conversion: 38.3 },
                  { stage: "Booking Completed", value: 3247, conversion: 36.2 },
                  { stage: "Service Delivered", value: 2891, conversion: 89.1 },
                ].map((item, index) => (
                  <div key={item.stage} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{item.stage}</div>
                    <div className="flex-1">
                      <Progress value={item.conversion} className="h-3" />
                    </div>
                    <div className="w-20 text-sm text-muted-foreground text-right">
                      {formatNumber(item.value)}
                    </div>
                    <div className="w-16 text-sm text-muted-foreground text-right">
                      {item.conversion}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.services.topPerforming.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{service.bookings} bookings</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {service.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(service.revenue)}</div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">{analyticsData.performance.responseTime}</div>
                    <div className="text-sm text-muted-foreground">Average Response Time (minutes)</div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { time: "< 5 min", percentage: 45, color: "bg-green-500" },
                      { time: "5-15 min", percentage: 35, color: "bg-yellow-500" },
                      { time: "15-30 min", percentage: 15, color: "bg-orange-500" },
                      { time: "> 30 min", percentage: 5, color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.time} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.time}</span>
                          <span>{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Automated Reports</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge className={report.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {report.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{report.frequency}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Last generated: {report.lastGenerated.toLocaleDateString()}</span>
                        <span>Recipients: {report.recipients.length}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
