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
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Target
} from "lucide-react";

interface RevenueTrendsProps {
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

export function RevenueTrends({ filters, isRealtime }: RevenueTrendsProps) {
  const [data, setData] = useState({
    monthlyRevenue: [
      { month: "Jan", revenue: 45200, fees: 3216, net: 41984, jobs: 284 },
      { month: "Feb", revenue: 52800, fees: 3696, net: 49104, jobs: 332 },
      { month: "Mar", revenue: 48100, fees: 3367, net: 44733, jobs: 301 },
      { month: "Apr", revenue: 61500, fees: 4305, net: 57195, jobs: 387 },
      { month: "May", revenue: 69200, fees: 4844, net: 64356, jobs: 435 },
      { month: "Jun", revenue: 73900, fees: 5173, net: 68727, jobs: 465 },
    ],
    categoryRevenue: [
      {
        category: "House Cleaning",
        revenue: 89420,
        percentage: 34.2,
        growth: 12.8,
      },
      {
        category: "Handyman Services",
        revenue: 67350,
        percentage: 25.8,
        growth: 18.3,
      },
      { category: "Pet Care", revenue: 45200, percentage: 17.3, growth: 8.7 },
      { category: "Tutoring", revenue: 32100, percentage: 12.3, growth: 22.1 },
      {
        category: "Moving Help",
        revenue: 26930,
        percentage: 10.3,
        growth: 15.6,
      },
    ],
    paymentMethods: [
      {
        method: "Credit Card",
        amount: 156780,
        transactions: 2847,
        percentage: 60.1,
      },
      {
        method: "Bank Transfer",
        amount: 78340,
        transactions: 1205,
        percentage: 30.0,
      },
      {
        method: "Digital Wallet",
        amount: 25880,
        transactions: 643,
        percentage: 9.9,
      },
    ],
    revenueMetrics: {
      totalRevenue: 261000,
      avgTransactionValue: 89.5,
      platformFee: 7.2,
      monthlyGrowthRate: 18.7,
      recurringRevenue: 45600,
      churnRate: 3.2,
    },
    dailyRevenue: [
      { date: "Mon", revenue: 12450, transactions: 89 },
      { date: "Tue", revenue: 15680, transactions: 112 },
      { date: "Wed", revenue: 13290, transactions: 94 },
      { date: "Thu", revenue: 17850, transactions: 127 },
      { date: "Fri", revenue: 19240, transactions: 138 },
      { date: "Sat", revenue: 22100, transactions: 156 },
      { date: "Sun", revenue: 18340, transactions: 131 },
    ],
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        revenueMetrics: {
          ...prev.revenueMetrics,
          totalRevenue:
            prev.revenueMetrics.totalRevenue + Math.floor(Math.random() * 500),
          avgTransactionValue:
            prev.revenueMetrics.avgTransactionValue + (Math.random() - 0.5) * 2,
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealtime]);

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.revenueMetrics.totalRevenue)}
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  {data.revenueMetrics.monthlyGrowthRate}%
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Transaction</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.revenueMetrics.avgTransactionValue)}
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  12.3%
                </div>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform Fee</p>
                <p className="text-2xl font-bold">
                  {data.revenueMetrics.platformFee}%
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  Standard
                </div>
              </div>
              <Wallet className="w-8 h-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Recurring Revenue
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.revenueMetrics.recurringRevenue)}
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  24.1%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
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
                  formatter={(value: any, name: any) => [
                    name === "jobs" ? value : formatCurrency(value),
                    name,
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill={COLORS[0]}
                  name="Gross Revenue"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="net"
                  fill={COLORS[1]}
                  name="Net Revenue"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="jobs"
                  stroke={COLORS[2]}
                  strokeWidth={3}
                  name="Jobs Completed"
                  dot={{ fill: COLORS[2], strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Revenue and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categoryRevenue.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">
                      {category.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        {category.growth}%
                      </Badge>
                      <span className="text-sm font-bold">
                        {formatCurrency(category.revenue)}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={category.percentage}
                    className="h-3"
                    style={{
                      background: `${COLORS[index % COLORS.length]}20`,
                    }}
                  />
                  <div className="text-xs text-muted-foreground">
                    {category.percentage}% of total revenue
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.paymentMethods}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {data.paymentMethods.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        formatCurrency(value),
                        "Amount",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {data.paymentMethods.map((method, index) => (
                  <div key={method.method} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium">
                        {method.method}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-5">
                      {formatCurrency(method.amount)} • {method.transactions}{" "}
                      transactions
                    </div>
                    <div className="text-xs font-medium ml-5">
                      {method.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Revenue Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any, name: any) => [
                    name === "transactions" ? value : formatCurrency(value),
                    name === "transactions" ? "Transactions" : "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {data.dailyRevenue.map((day, index) => (
              <div
                key={day.date}
                className="text-center p-2 bg-muted/50 rounded"
              >
                <div className="text-xs font-medium">{day.date}</div>
                <div className="text-xs text-muted-foreground">
                  {day.transactions} jobs
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {formatCurrency(285600)}
              </div>
              <div className="text-sm text-muted-foreground">
                Projected Monthly
              </div>
              <Badge
                variant="outline"
                className="mt-2 bg-green-100 text-green-700 border-green-200"
              >
                +23% vs current
              </Badge>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.revenueMetrics.churnRate}%
              </div>
              <div className="text-sm text-muted-foreground">Churn Rate</div>
              <Badge
                variant="outline"
                className="mt-2 bg-blue-100 text-blue-700 border-blue-200"
              >
                Industry avg: 5.2%
              </Badge>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {formatCurrency(156)}
              </div>
              <div className="text-sm text-muted-foreground">Customer LTV</div>
              <Badge
                variant="outline"
                className="mt-2 bg-purple-100 text-purple-700 border-purple-200"
              >
                +18% growth
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
