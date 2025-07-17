"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  DollarSign,
  Star,
  Users,
  Clock,
  BarChart3,
} from "lucide-react";

export default function ProviderAnalyticsPage() {
  const stats = [
    {
      title: "Total Earnings",
      value: "$2,847",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Profile Views",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Total Bookings",
      value: "47",
      change: "+15.3%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      service: "Home Cleaning",
      customer: "Sarah J.",
      date: "2024-01-20",
      amount: "$120",
      status: "completed",
    },
    {
      id: 2,
      service: "Plumbing Repair",
      customer: "Mike R.",
      date: "2024-01-18",
      amount: "$160",
      status: "completed",
    },
    {
      id: 3,
      service: "Garden Maintenance",
      customer: "Lisa M.",
      date: "2024-01-16",
      amount: "$90",
      status: "pending",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your service performance and earnings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer} • {booking.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{booking.amount}</p>
                    <Badge
                      variant={
                        booking.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button className="w-full" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button className="w-full" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Update Availability
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Earnings and bookings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Chart visualization would go here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Integration with charting library needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
