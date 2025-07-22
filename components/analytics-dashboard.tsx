"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  DollarSign,
  Eye, Calendar
  BarChart3,
  PieChart,
  Activity
  Lightbulb,
  TrendingUp
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  AreaChart, // Added, AreaChart import,
  Area
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent
} from "@/components/ui/chart";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeJobs: number;
    revenue: number;
    avgRating: number;
    growthRate: number;
  };
  userMetrics: {
    newSignups: number;
    retention: number;
    engagement: number;
    conversionRate: number;
  };
  jobMetrics: {
    jobsPosted: number;
    jobsCompleted: number;
    avgJobValue: number;
    completionRate: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    monthlyGrowth: number;
    avgTransactionFee: number;
    topCategories: Array<{ name: string; revenue: number; percentage: number }>;
  };
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock analytics data
  const data: AnalyticsData = {
    overview: {
      totalUsers: 2847,
      activeJobs: 156,
      revenue: 12450,
      avgRating: 4.8,
      growthRate: 23.5,
    },
    userMetrics: {
      newSignups: 89,
      retention: 78,
      engagement: 65,
      conversionRate: 12.3,
    },
    jobMetrics: {
      jobsPosted: 234,
      jobsCompleted: 189,
      avgJobValue: 85,
      completionRate: 94.2,
    },
    revenueMetrics: {
      totalRevenue: 12450,
      monthlyGrowth: 18.7,
      avgTransactionFee: 8.5,
      topCategories: [
        { name: "House Cleaning", revenue: 4200, percentage: 33.7 },
        { name: "Handyman Services", revenue: 3100, percentage: 24.9 },
        { name: "Pet Care", revenue: 2200, percentage: 17.7 },
        { name: "Tutoring", revenue: 1800, percentage: 14.5 },
        { name: "Moving Help", revenue: 1150, percentage: 9.2 },
      ],
    },
  };

  // Mock data for charts
  const dailyUsersData = [
    { date: "Jan 1", users: 100 },
    { date: "Jan 2", users: 120 },
    { date: "Jan 3", users: 150 },
    { date: "Jan 4", users: 130 },
    { date: "Jan 5", users: 180 },
    { date: "Jan 6", users: 200 },
    { date: "Jan 7", users: 220 },
  ];

  const dailyJobsData = [
    { date: "Jan 1", posted: 10, completed: 8 },
    { date: "Jan 2", posted: 12, completed: 10 },
    { date: "Jan 3", posted: 15, completed: 12 },
    { date: "Jan 4", posted: 11, completed: 9 },
    { date: "Jan 5", posted: 18, completed: 15 },
    { date: "Jan 6", posted: 20, completed: 17 },
    { date: "Jan 7", posted: 22, completed: 19 },
  ];

  const dailyRevenueData = [
    { date: "Jan 1", revenue: 500 },
    { date: "Jan 2", revenue: 600 },
    { date: "Jan 3", revenue: 750 },
    { date: "Jan 4", revenue: 680 },
    { date: "Jan 5", revenue: 900 },
    { date: "Jan 6", revenue: 1000 },
    { date: "Jan 7", revenue: 1100 },
  ];

  const getGrowthColor = (value: number) => {
    return value > 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const getGrowthIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingUp className="w-4 h-4 rotate-180" />
    );
  };

  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--primary))",
    },
    posted: {
      label: "Posted",
      color: "hsl(var(--chart-2))",
    },
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-3))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track your platform's performance and growth
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {data.overview.totalUsers.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-sm ${getGrowthColor(data.overview.growthRate)}`}
                >
                  {getGrowthIcon(data.overview.growthRate)}{" "}
                  {Math.abs(data.overview.growthRate)}% vs last period
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{data.overview.activeJobs}</p>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" /> 12% vs last period
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  ${data.overview.revenue.toLocaleString()}
                </p>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" /> 18.7% vs last period
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{data.overview.avgRating}</p>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" /> 0.2 vs last period
                </div>
              </div>
              <Star className="w-8 h-8 text-slate-700 dark:text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="jobs">Job Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  User Growth
                </CardTitle>
                <CardDescription>
                  Daily active users and new signups over time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={dailyUsersData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="var(--color-users)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>New Signups</span>
                      <span className="font-medium">
                        {data.userMetrics.newSignups}
                      </span>
                    </div>
                    <Progress value={75} className="h-2 bg-blue-200" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>User Retention</span>
                      <span className="font-medium">
                        {data.userMetrics.retention}%
                      </span>
                    </div>
                    <Progress
                      value={data.userMetrics.retention}
                      className="h-2 bg-green-200"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Engagement Rate</span>
                      <span className="font-medium">
                        {data.userMetrics.engagement}%
                      </span>
                    </div>
                    <Progress
                      value={data.userMetrics.engagement}
                      className="h-2 bg-purple-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Conversion Funnel
                </CardTitle>
                <CardDescription>
                  User progression through key stages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <span className="text-sm font-medium">Visitors</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <span className="text-sm font-medium">Signups</span>
                    <span className="font-bold">89 (7.1%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <span className="text-sm font-medium">
                      First Job Posted
                    </span>
                    <span className="font-bold">34 (38.2%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <span className="text-sm font-medium">
                      Completed Transaction
                    </span>
                    <span className="font-bold">11 (12.3%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Job Metrics
                </CardTitle>
                <CardDescription>
                  Daily job postings and completions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart
                      data={dailyJobsData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend content={<ChartLegendContent />} />
                      <Bar
                        dataKey="posted"
                        fill="var(--color-posted)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="var(--color-completed)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.jobMetrics.jobsPosted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Jobs Posted
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {data.jobMetrics.jobsCompleted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Jobs Completed
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion Rate</span>
                    <span className="font-medium">
                      {data.jobMetrics.completionRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.jobMetrics.completionRate}
                    className="h-2 bg-purple-200"
                  />
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${data.jobMetrics.avgJobValue}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Job Value
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Job Categories
                </CardTitle>
                <CardDescription>
                  Distribution of jobs across categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.revenueMetrics.topCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">
                          ${category.revenue.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={category.percentage}
                        className="h-2 bg-blue-200"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>Daily revenue trends.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                      data={dailyRevenueData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        fill="var(--color-revenue)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${data.revenueMetrics.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Revenue
                  </div>
                  <div className="text-sm text-green-600 mt-1 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 mr-1" />{" "}
                    {data.revenueMetrics.monthlyGrowth}% monthly growth
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg shadow-sm">
                    <div className="text-xl font-bold">
                      ${data.revenueMetrics.avgTransactionFee}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Transaction Fee
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg shadow-sm">
                    <div className="text-xl font-bold">7.2%</div>
                    <div className="text-sm text-muted-foreground">
                      Platform Take Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                  Revenue by Category
                </CardTitle>
                <CardDescription>
                  Revenue distribution across service categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.revenueMetrics.topCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg shadow-sm"
                    >
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.percentage}% of total
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ${category.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-600" />
                  Platform Health
                </CardTitle>
                <CardDescription>
                  Key indicators of system performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>System Uptime</span>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2 bg-green-200" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Response Time</span>
                    <span className="font-medium">245ms</span>
                  </div>
                  <Progress value={85} className="h-2 bg-yellow-200" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Error Rate</span>
                    <span className="font-medium text-green-600">0.1%</span>
                  </div>
                  <Progress value={1} className="h-2 bg-red-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  User Engagement
                </CardTitle>
                <CardDescription>
                  Metrics on how users interact with the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4.2</div>
                  <div className="text-sm text-muted-foreground">
                    Avg Session Duration (min)
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2.8</div>
                  <div className="text-sm text-muted-foreground">
                    Pages per Session
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">68%</div>
                  <div className="text-sm text-muted-foreground">
                    Return Visitor Rate
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-teal-600" />
                  Communication
                </CardTitle>
                <CardDescription>
                  Efficiency of user and provider communication.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    1,247
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Messages Sent
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">
                    Response Rate
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">8 min</div>
                  <div className="text-sm text-muted-foreground">
                    Avg Response Time
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Insights Section */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
            Key Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Actionable takeaways from your platform's performance data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">
                  User retention is strong, but new signups could be boosted.
                </div>
                <div className="text-sm text-muted-foreground">
                  Consider A/B testing different signup flows or marketing
                  channels to increase new user acquisition.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">
                  House Cleaning and Handyman services drive significant
                  revenue.
                </div>
                <div className="text-sm text-muted-foreground">
                  Focus marketing efforts and provider recruitment on these
                  high-performing categories.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">
                  Average response time for messages is good, but can be
                  improved.
                </div>
                <div className="text-sm text-muted-foreground">
                  Implement urgency notifications for providers to reduce
                  response times further and improve user satisfaction.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
