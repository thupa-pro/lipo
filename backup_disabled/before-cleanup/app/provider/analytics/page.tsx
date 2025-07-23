"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Star,
  Target,
  Clock,
} from "lucide-react";

export default function ProviderAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      title: "Revenue",
      value: "$2,847",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Bookings",
      value: "47",
      change: "+8.2%",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "New Clients",
      value: "23",
      change: "+15.3%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg Rating",
      value: "4.9",
      change: "+0.1",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your performance and grow your business
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        {["7d", "30d", "90d", "1y"].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            onClick={() => setTimeRange(range)}
            size="sm"
          >
            {range === "7d" && "Last 7 days"}
            {range === "30d" && "Last 30 days"}
            {range === "90d" && "Last 90 days"}
            {range === "1y" && "Last year"}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-green-600 mt-1">
                {stat.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart placeholder - Revenue analytics would be displayed here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Booking Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart placeholder - Booking trends would be displayed here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
