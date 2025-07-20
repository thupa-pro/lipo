"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Star,
  Calendar,
  Bell,
  User,
  LogOut,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Eye,
  Edit,
  Sparkles,
  Users,
  BarChart,
} from "lucide-react";

export default function ProviderDashboard() {
  const { data: session } = useSession();

  const recentBookings = [
    {
      id: 1,
      service: "House Cleaning",
      customer: "John Smith",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed",
      price: 120,
    },
    {
      id: 2,
      service: "Deep Cleaning",
      customer: "Sarah Wilson",
      date: "2024-01-16",
      time: "2:00 PM",
      status: "pending",
      price: 180,
    },
    {
      id: 3,
      service: "Office Cleaning",
      customer: "Tech Corp",
      date: "2024-01-18",
      time: "9:00 AM",
      status: "completed",
      price: 250,
    },
  ];

  const myServices = [
    {
      id: 1,
      title: "Residential Cleaning",
      price: 80,
      duration: 120,
      bookings: 15,
      rating: 4.8,
      status: "active",
    },
    {
      id: 2,
      title: "Deep House Cleaning",
      price: 150,
      duration: 240,
      bookings: 8,
      rating: 4.9,
      status: "active",
    },
    {
      id: 3,
      title: "Office Cleaning",
      price: 200,
      duration: 180,
      bookings: 12,
      rating: 4.7,
      status: "draft",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ServiceHub Pro
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                Services
              </Button>
              <Button variant="ghost" size="sm">
                Bookings
              </Button>
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session?.user.image || ""} />
                  <AvatarFallback>
                    {session?.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session?.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Service Provider</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/landing" })}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {session?.user.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your services and grow your business
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    $3,240
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +12% this month
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    2 today
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    145
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    +5 this week
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    4.8
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    98% positive
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {booking.service}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.customer}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          ${booking.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-3" />
                    Create New Service
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-3" />
                    Manage Schedule
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart className="w-4 h-4 mr-3" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <User className="w-4 h-4 mr-3" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Bookings
                    </span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Revenue
                    </span>
                    <span className="font-semibold">$2,480</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      New Customers
                    </span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Reviews
                    </span>
                    <span className="font-semibold">22</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Services */}
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Services</CardTitle>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map((service) => (
                  <Card key={service.id} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {service.title}
                        </h3>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Price</span>
                          <span className="font-semibold">${service.price}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Duration</span>
                          <span className="font-semibold">{service.duration} min</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Bookings</span>
                          <span className="font-semibold">{service.bookings}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{service.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
