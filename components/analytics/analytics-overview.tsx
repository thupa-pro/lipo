"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Briefcase,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  Eye,
  Clock,
  Target,
} from "lucide-react";

interface AnalyticsOverviewProps {
  filters: any;
  isRealtime: boolean;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function AnalyticsOverview({
  filters,
  isRealtime,
}: AnalyticsOverviewProps) {
  const [data, setData] = useState({
    kpis: {
      totalUsers: { value: 15247, change: 12.3, trend: "up" },
      activeJobs: { value: 342, change: 8.7, trend: "up" },
      revenue: { value: 89450, change: 15.2, trend: "up" },
      avgRating: { value: 4.8, change: 0.2, trend: "up" },
      conversionRate: { value: 12.4, change: -2.1, trend: "down" },
      customerLTV: { value: 285, change: 9.8, trend: "up" },
    },
    timeSeriesData: [
      { date: "Jan 1", users: 1200, revenue: 3400, jobs: 45, rating: 4.6 },
      { date: "Jan 2", users: 1350, revenue: 3800, jobs: 52, rating: 4.7 },
      { date: "Jan 3", users: 1180, revenue: 3200, jobs: 38, rating: 4.8 },
      { date: "Jan 4", users: 1450, revenue: 4100, jobs: 58, rating: 4.7 },
      { date: "Jan 5", users: 1600, revenue: 4500, jobs: 64, rating: 4.8 },
      { date: "Jan 6", users: 1380, revenue: 3900, jobs: 49, rating: 4.9 },
      { date: "Jan 7", users: 1750, revenue: 4900, jobs: 71, rating: 4.8 },
    ],
    categoryData: [
      { name: "House Cleaning", value: 35, revenue: 31200 },
      { name: "Handyman", value: 28, revenue: 25100 },
      { name: "Pet Care", value: 18, revenue: 16800 },
      { name: "Tutoring", value: 12, revenue: 10200 },
      { name: "Moving", value: 7, revenue: 6150 },
    ],
    funnelData: [
      { stage: "Visitors", count: 10250, rate: 100 },
      { stage: "Signups", count: 1847, rate: 18.0 },
      { stage: "First Booking", count: 758, rate: 41.1 },
      { stage: "Completed Job", count: 623, rate: 82.2 },
      { stage: "Repeat Customer", count: 298, rate: 47.8 },
    ],
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        kpis: {
          ...prev.kpis,
          totalUsers: {
            ...prev.kpis.totalUsers,
            value: prev.kpis.totalUsers.value + Math.floor(Math.random() * 5),
          },
          activeJobs: {
            ...prev.kpis.activeJobs,
            value:
              prev.kpis.activeJobs.value + Math.floor(Math.random() * 3) - 1,
          },
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealtime]);

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <ArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {formatValue(data.kpis.totalUsers.value, "number")}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(data.kpis.totalUsers.trend)}`}
                >
                  {getTrendIcon(data.kpis.totalUsers.trend)}
                  {Math.abs(data.kpis.totalUsers.change)}%
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
            {isRealtime && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">
                  {formatValue(data.kpis.activeJobs.value, "number")}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(data.kpis.activeJobs.trend)}`}
                >
                  {getTrendIcon(data.kpis.activeJobs.trend)}
                  {Math.abs(data.kpis.activeJobs.change)}%
                </div>
              </div>
              <Briefcase className="w-8 h-8 text-green-500 opacity-80" />
            </div>
            {isRealtime && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  {formatValue(data.kpis.revenue.value, "currency")}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(data.kpis.revenue.trend)}`}
                >
                  {getTrendIcon(data.kpis.revenue.trend)}
                  {Math.abs(data.kpis.revenue.change)}%
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500 opacity-80" />
            </div>
            {isRealtime && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {data.kpis.avgRating.value}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(data.kpis.avgRating.trend)}`}
                >
                  {getTrendIcon(data.kpis.avgRating.trend)}
                  {Math.abs(data.kpis.avgRating.change)}
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500 opacity-80" />
            </div>
            {isRealtime && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="text-2xl font-bold">
                  {formatValue(data.kpis.conversionRate.value, "percentage")}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(data.kpis.conversionRate.trend)}`}
                >
                  {getTrendIcon(data.kpis.conversionRate.trend)}
                  {Math.abs(data.kpis.conversionRate.change)}%
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-500 opacity-80" />
            </div>
            {isRealtime && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customer LTV</p>
                <p className="text-2xl font-bold">
                  {formatValue(data.kpis.customerLTV.value, "currency")}
                </p>
                <div
                  className={`flex items-center text-sm ${getTrendColor(data.kpis.customerLTV.trend)}`}
                >
                  {getTrendIcon(data.kpis.customerLTV.trend)}
                  {Math.abs(data.kpis.customerLTV.change)}%
                </div>
              </div>
              <Activity className="w-8 h-8 text-indigo-500 opacity-80" />
            </div>
            {isRealtime && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
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
                  <Bar
                    yAxisId="left"
                    dataKey="jobs"
                    fill={COLORS[0]}
                    name="Jobs"
                    radius={[4, 4, 0, 0]}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    fill={COLORS[1]}
                    stroke={COLORS[1]}
                    fillOpacity={0.3}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    stroke={COLORS[2]}
                    strokeWidth={3}
                    name="Users"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Service Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `${value}%`,
                        "Share",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {data.categoryData.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{category.value}%</div>
                      <div className="text-xs text-muted-foreground">
                        ${category.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {stage.count.toLocaleString()} users
                    </span>
                    <Badge variant="outline">{stage.rate}%</Badge>
                  </div>
                </div>
                <Progress
                  value={stage.rate}
                  className="h-3"
                  style={{
                    background: `linear-gradient(to right, ${COLORS[index % COLORS.length]} 0%, ${COLORS[index % COLORS.length]}40 100%)`,
                  }}
                />
                {index < data.funnelData.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
