/**
 * Provider Dashboard - Protected Route
 * Only accessible to users with 'provider' or 'admin' role
 */

"use client";

import { ClientRoleGate } from "@/components/rbac/ClientRoleGate";
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
  Briefcase,
  DollarSign,
  BarChart3,
  Calendar,
  Star,
  TrendingUp,
  Plus,
  Eye,
  Edit,
} from "lucide-react";
import Link from "next/link";

export default function ProviderDashboard() {
  return (
    <RoleGate allowedRoles={["provider", "admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Provider Dashboard
                </h1>
                <p className="text-slate-600 dark:text-gray-300">
                  Manage your services and grow your business
                </p>
              </div>
            </div>
            <Badge className="bg-blue-500 text-white">
              <Briefcase className="w-3 h-3 mr-1" />
              Service Provider
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  $3,247
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    Active Listings
                  </CardTitle>
                  <Briefcase className="w-4 h-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  12
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  3 pending review
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    Customer Rating
                  </CardTitle>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  4.8
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Based on 156 reviews
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    This Month
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  47
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Bookings completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-slate-200 dark:border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Manage Listings</CardTitle>
                    <CardDescription>
                      Add, edit, or remove your services
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/provider/listings/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Service
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/provider/listings">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Listings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>
                      Track your performance and growth
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/provider/analytics">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/provider/reports">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Download Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>
                      Manage your availability and bookings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/provider/calendar">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/provider/availability">
                      <Edit className="w-4 h-4 mr-2" />
                      Set Availability
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card className="border-slate-200 dark:border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    Your latest customer bookings
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/provider/bookings">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    service: "Home Cleaning",
                    customer: "Sarah Johnson",
                    date: "Dec 15, 2024",
                    status: "confirmed",
                    amount: "$85",
                  },
                  {
                    service: "Garden Maintenance",
                    customer: "Mike Davis",
                    date: "Dec 14, 2024",
                    status: "completed",
                    amount: "$120",
                  },
                  {
                    service: "Pet Sitting",
                    customer: "Emily Chen",
                    date: "Dec 13, 2024",
                    status: "completed",
                    amount: "$60",
                  },
                ].map((booking, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-blue-500"
                            : booking.status === "completed"
                              ? "bg-emerald-500"
                              : "bg-gray-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {booking.service}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          {booking.customer} • {booking.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {booking.amount}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          booking.status === "confirmed"
                            ? "text-blue-600 border-blue-200"
                            : booking.status === "completed"
                              ? "text-emerald-600 border-emerald-200"
                              : "text-gray-600 border-gray-200"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGate>
  );
}
