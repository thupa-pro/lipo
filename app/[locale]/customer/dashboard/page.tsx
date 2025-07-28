import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AgentCommandInput from "@/components/ai/AgentCommandInput";
import SmartListingCard from "@/components/ai/SmartListingCard";
import { Bell, LogOut, Heart, Car, Wrench, Camera, Laptop, Sparkles, Bot, Zap } from "lucide-react";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const recentBookings = [
    {
      id: 1,
      service: "House, Cleaning",
      provider: "Sarah, Johnson",
      date: "2024-01-15",
      status: "completed",
      rating: 5,
      price: 120,
    },
    {
      id: 2,
      service: "Plumbing Repair",
      provider: "Mike Rodriguez",
      date: "2024-01-20",
      status: "confirmed",
      price: 85,
    },
    {
      id: 3,
      service: "Photography",
      provider: "Emma Wilson",
      date: "2024-01-25",
      status: "pending",
      price: 250,
    },
  ];

  const categories = [
    { name: "Home Services", icon: Home, count: 124, color: "text-blue-600" },
    { name: "Auto Services", icon: Car, count: 89, color: "text-green-600" },
    { name: "Repairs", icon: Wrench, count: 156, color: "text-purple-600" },
    { name: "Photography", icon: Camera, count: 67, color: "text-pink-600" },
    { name: "Tech Support", icon: Laptop, count: 98, color: "text-orange-600" },
    { name: "Health & Beauty", icon: Phone, count: 78, color: "text-teal-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loconomy
              </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" / />
                <Input
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, back, {session?.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect service provider for your needs
          </p>
        </div>

        {/* AI Agent Interface */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-gray-200 flex items-center gap-2">
                    Loconomy AI Assistant
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Intelligence-First
                    </Badge>
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    Ask anything or use slash commands: /find, /book, /status, /reschedule, /cancel
                  </p>
                </div>
              </div>
              <AgentCommandInput
                placeholder="Try: '/find plumber' or 'I need house cleaning tomorrow'"
                currentPage="customer-dashboard"
                onResponse={(response) => {
                  console.log('Agent response:', response);
                  // Handle agent responses here - could trigger, searches, bookings, etc.
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    12
                  </p>
                </div>
                <BusinessIcons.Calendar className="w-8 h-8 text-blue-600" / />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                </div>
                <OptimizedIcon name="Clock" className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Saved Favorites
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
                <Heart className="w-8 h-8 text-red-600" />
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
                </div>
                <OptimizedIcon name="Star" className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <NavigationIcons.User className="w-6 h-6 text-white" / />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {booking.service}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.provider}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {booking.date}
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
                        {booking.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <OptimizedIcon name="Star" className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {booking.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Bookings
                  <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Service Categories */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Browse Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className={`w-5 h-5 ${category.color}`} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  Explore All Services
                  <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <NavigationIcons.Search className="w-6 h-6 text-blue-600" / />
                  <span>Find Services</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <BusinessIcons.Calendar className="w-6 h-6 text-green-600" / />
                  <span>Schedule Service</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Heart className="w-6 h-6 text-red-600" />
                  <span>View Favorites</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <NavigationIcons.User className="w-6 h-6 text-purple-600" / />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}