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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Target,
} from "lucide-react";
import { analyticsClient } from "@/lib/analytics/utils";
import { CHART_COLORS } from "@/lib/analytics/types";
import type { RevenueMetrics } from "@/lib/analytics/types";
import { toast } from "sonner";

interface RevenueAnalyticsProps {
  timeframe: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function RevenueAnalytics({ timeframe }: RevenueAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(
    null,
  );

  useEffect(() => {
    loadRevenueAnalytics();
  }, [timeframe]);

  const loadRevenueAnalytics = async () => {
    setLoading(true);
    try {
      const response = await analyticsClient.getRevenueMetrics(timeframe);
      if (response.success) {
        setRevenueMetrics(response.data);
      }
    } catch (error) {
      console.error("Error loading revenue analytics:", error);
      toast.error("Failed to load revenue analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
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

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics
                ? formatCurrency(revenueMetrics.totalRevenue)
                : "..."}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {revenueMetrics && revenueMetrics.revenueGrowthRate > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">
                    +{revenueMetrics.revenueGrowthRate.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">
                    {revenueMetrics?.revenueGrowthRate.toFixed(1) || 0}%
                  </span>
                </>
              )}
              <span>vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Recurring Revenue
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics
                ? formatCurrency(revenueMetrics.monthlyRecurringRevenue)
                : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              Subscription revenue
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics
                ? formatCurrency(revenueMetrics.averageOrderValue)
                : "..."}
            </div>
            <div className="text-xs text-muted-foreground">Per transaction</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics
                ? formatNumber(revenueMetrics.totalBookings)
                : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              Completed transactions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Timeline</CardTitle>
          <CardDescription>
            Revenue and booking trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={revenueMetrics?.revenueTimeline || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="right"
                dataKey="bookings"
                fill={CHART_COLORS.accent}
                name="Bookings"
                fillOpacity={0.6}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                name="Revenue ($)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>
              Performance across service categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueMetrics?.revenueByCategory || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) =>
                    `${name} ${percentage.toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {(revenueMetrics?.revenueByCategory || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          analyticsClient.generateChartColors(
                            revenueMetrics?.revenueByCategory?.length || 0,
                          )[index]
                        }
                      />
                    ),
                  )}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Spending Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Users</CardTitle>
            <CardDescription>Highest value customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueMetrics?.topSpendingUsers
                ?.slice(0, 8)
                .map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.bookingCount} bookings
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {formatCurrency(user.totalSpent)}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Region */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Region</CardTitle>
          <CardDescription>Geographic revenue distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueMetrics?.revenueByRegion || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill={CHART_COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
