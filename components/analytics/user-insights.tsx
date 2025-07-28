import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { UserPlus, UserCheck, Smartphone, Monitor, Globe, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

interface UserInsightsProps {
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

export function UserInsights({ filters, isRealtime }: UserInsightsProps) {
  const [data, setData] = useState({
    userGrowth: [
      { date: "Week 1", newUsers: 245, activeUsers: 1580, retainedUsers: 1420 },
      { date: "Week 2", newUsers: 290, activeUsers: 1720, retainedUsers: 1500 },
      { date: "Week 3", newUsers: 185, activeUsers: 1650, retainedUsers: 1480 },
      { date: "Week 4", newUsers: 320, activeUsers: 1890, retainedUsers: 1680 },
    ],
    cohortData: [
      { cohort: "Jan 2024", month0: 100, month1: 75, month2: 60, month3: 50 },
      { cohort: "Feb 2024", month0: 100, month1: 78, month2: 65, month3: 55 },
      { cohort: "Mar 2024", month0: 100, month1: 82, month2: 70 },
      { cohort: "Apr 2024", month0: 100, month1: 85 },
    ],
    demographics: [
      { ageGroup: "18-25", users: 1250, percentage: 25 },
      { ageGroup: "26-35", users: 1875, percentage: 37.5 },
      { ageGroup: "36-45", users: 1125, percentage: 22.5 },
      { ageGroup: "46-55", users: 500, percentage: 10 },
      { ageGroup: "55+", users: 250, percentage: 5 },
    ],
    deviceData: [
      { device: "Mobile", users: 3200, percentage: 64 },
      { device: "Desktop", users: 1400, percentage: 28 },
      { device: "Tablet", users: 400, percentage: 8 },
    ],
    locationData: [
      { city: "New York", users: 890, growth: 12.3 },
      { city: "Los Angeles", users: 654, growth: 8.7 },
      { city: "Chicago", users: 432, growth: 15.2 },
      { city: "Houston", users: 389, growth: 6.1 },
      { city: "Phoenix", users: 287, growth: 22.8 },
    ],
    engagementMetrics: {
      avgSessionDuration: 4.2,
      pagesPerSession: 2.8,
      bounceRate: 32.5,
      returnVisitorRate: 68.3,
    },
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        engagementMetrics: {
          ...prev.engagementMetrics,
          avgSessionDuration:
            prev.engagementMetrics.avgSessionDuration +
            (Math.random() - 0.5) * 0.1,
          returnVisitorRate: Math.max(
            60,
            Math.min(
              75,
              prev.engagementMetrics.returnVisitorRate +
                (Math.random() - 0.5) * 2,
            ),
          ),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealtime]);

  return (
    <div className="space-y-6">
      {/* User Growth Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Users</p>
                <p className="text-2xl font-bold">1,340</p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  18.2%
                </div>
              </div>
              <UserPlus className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">8,247</p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  12.7%
                </div>
              </div>
              <NavigationIcons.Users className="w-8 h-8 text-green-500 opacity-80" / />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <p className="text-2xl font-bold">73.4%</p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  5.1%
                </div>
              </div>
              <UserCheck className="w-8 h-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Session</p>
                <p className="text-2xl font-bold">
                  {data.engagementMetrics.avgSessionDuration.toFixed(1)}m
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  8.3%
                </div>
              </div>
              <OptimizedIcon name="Clock" className="w-8 h-8 text-orange-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            User Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userGrowth}>
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
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stackId="1"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                  name="Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  stackId="2"
                  stroke={COLORS[1]}
                  fill={COLORS[1]}
                  fillOpacity={0.6}
                  name="New Users"
                />
                <Line
                  type="monotone"
                  dataKey="retainedUsers"
                  stroke={COLORS[2]}
                  strokeWidth={3}
                  name="Retained Users"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Demographics and Device Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NavigationIcons.Users className="w-5 h-5" / />
              Age Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.demographics.map((demo, index) => (
                <div key={demo.ageGroup} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{demo.ageGroup}</span>
                    <span>
                      {demo.users.toLocaleString()} users ({demo.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={demo.percentage}
                    className="h-2"
                    style={{
                      background: `${COLORS[index % COLORS.length]}20`,
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="users"
                    >
                      {data.deviceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        value.toLocaleString(),
                        "Users",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {data.deviceData.map((device, index) => (
                  <div
                    key={device.device}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      {device.device === "Mobile" && (
                        <Smartphone className="w-4 h-4" />
                      )}
                      {device.device === "Desktop" && (
                        <Monitor className="w-4 h-4" />
                      )}
                      {device.device === "Tablet" && (
                        <Smartphone className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {device.device}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {device.percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {device.users.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BusinessIcons.MapPin className="w-5 h-5" / />
            Top Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.locationData.map((location, index) => (
              <div
                key={location.city}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{location.city}</div>
                    <div className="text-sm text-muted-foreground">
                      {location.users.toLocaleString()} users
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={`${
                      location.growth > 10
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    <ArrowUp className="w-3 h-3 mr-1" />
                    {location.growth}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {data.engagementMetrics.avgSessionDuration.toFixed(1)} min
            </div>
            <div className="text-sm text-muted-foreground">
              Avg Session Duration
            </div>
            <Progress value={70} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {data.engagementMetrics.pagesPerSession}
            </div>
            <div className="text-sm text-muted-foreground">
              Pages per Session
            </div>
            <Progress value={56} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {data.engagementMetrics.bounceRate}%
            </div>
            <div className="text-sm text-muted-foreground">Bounce Rate</div>
            <Progress
              value={data.engagementMetrics.bounceRate}
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data.engagementMetrics.returnVisitorRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Return Visitors</div>
            <Progress
              value={data.engagementMetrics.returnVisitorRate}
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
