"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  Calendar,
  TrendingUp,
  BookOpen,
  Settings,
  BarChart3,
  MessageSquare, MapPin,
  Phone,
  Mail,
  Plus,
  Eye,
  Edit
} from "lucide-react";

export default function ProviderDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push(`/${locale}/auth/signin`);
    }
  }, [isLoading, isSignedIn, router, locale]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Provider Dashboard...</h2>
          <p className="text-gray-600 dark:text-gray-400">Preparing your elite service management platform</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  // Mock data for demonstration
  const dashboardStats = {
    totalEarnings: "$12,450",
    activeBookings: 23,
    completedServices: 156,
    averageRating: 4.9,
    monthlyGrowth: "+15%",
    responseTime: "2 min"
  };

  const recentBookings = [
    { id: 1, client: "Sarah Johnson", service: "House Cleaning", date: "Today, 2:00 PM", status: "confirmed", amount: "$120" },
    { id: 2, client: "Mike Chen", service: "Plumbing Repair", date: "Tomorrow, 10:00 AM", status: "pending", amount: "$85" },
    { id: 3, client: "Emma Davis", service: "Gardening", date: "Dec 28, 3:00 PM", status: "confirmed", amount: "$150" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, back, {user?.firstName || 'Provider'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your, services, bookings, and grow your business with our elite platform
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button onClick={() => router.push(`/${locale}/provider/listings/new`)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
              <Button variant="outline" onClick={() => router.push(`/${locale}/provider/calendar`)}>
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalEarnings}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.activeBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Services</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.completedServices}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{dashboardStats.monthlyGrowth}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.responseTime}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
              <TabsTrigger value="services">My Services</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>
                    Manage your upcoming appointments and service requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {booking.client.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{booking.client}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">{booking.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <span className="font-semibold text-gray-900 dark:text-white">{booking.amount}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => router.push(`/${locale}/provider/calendar`)}>
                      View All Bookings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    My Services
                  </CardTitle>
                  <CardDescription>
                    Manage your service listings and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manage Your Services</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Create and edit your service listings to attract more customers
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => router.push(`/${locale}/provider/listings/new`)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Service
                      </Button>
                      <Button variant="outline" onClick={() => router.push(`/${locale}/provider/listings`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Existing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics & Insights
                  </CardTitle>
                  <CardDescription>
                    Track your performance and business growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Business Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Get detailed insights into your, earnings, customer, satisfaction, and growth trends
                    </p>
                    <Button onClick={() => router.push(`/${locale}/provider/reports`)}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Detailed Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Provider Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your professional profile and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">Professional Service Provider</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">4.9 rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Local Area</span>
                          </div>
                        </div>
                      </div>
                      <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">{user?.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            Account Settings
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Calendar className="w-4 h-4 mr-2" />
                            Availability Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}