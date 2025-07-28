import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark, CreditCard, Plus, Eye, History } from "lucide-react";

export default function CustomerDashboardPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <NavigationIcons.User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Customer Dashboard...</h2>
          <p className="text-gray-600 dark:text-gray-400">Preparing your personalized service experience</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  // Mock data for demonstration
  const dashboardStats = {
    totalBookings: 12,
    activeBookings: 3,
    completedServices: 9,
    totalSpent: "$1,245",
    favoriteProviders: 5,
    recentReviews: 8
  };

  const recentBookings = [
    { id: 1, provider: "Sarah's Cleaning", service: "House Cleaning", date: "Today, 2:00 PM", status: "confirmed", amount: "$120", rating: null },
    { id: 2, provider: "Mike's Plumbing", service: "Plumbing Repair", date: "Tomorrow, 10:00 AM", status: "confirmed", amount: "$85", rating: null },
    { id: 3, provider: "Green Gardens", service: "Gardening", date: "Dec 22, 3:00 PM", status: "completed", amount: "$150", rating: 5 }
  ];

  const favoriteProviders = [
    { id: 1, name: "Sarah's Cleaning", service: "House Cleaning", rating: 4.9, bookings: 3, avatar: "SC" },
    { id: 2, name: "Mike's Plumbing", service: "Plumbing Services", rating: 4.8, bookings: 2, avatar: "MP" },
    { id: 3, name: "Green Gardens", service: "Landscaping", rating: 5.0, bookings: 4, avatar: "GG" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
                Welcome, back, {user?.firstName || 'Customer'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover amazing local services and manage your bookings with ease
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button onClick={() => router.push(`/${locale}/browse`)} className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                <NavigationIcons.Search className="w-4 h-4 mr-2" />
                Find Services
              </Button>
              <Button variant="outline" onClick={() => router.push(`/${locale}/bookings`)}>
                <BusinessIcons.Calendar className="w-4 h-4 mr-2" />
                My Bookings
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <BusinessIcons.Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <OptimizedIcon name="Clock" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <UIIcons.CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalSpent}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorite Providers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.favoriteProviders}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviews Given</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.recentReviews}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <OptimizedIcon name="Star" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
              <TabsTrigger value="favorites">Favorite Providers</TabsTrigger>
              <TabsTrigger value="discover">Discover Services</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BusinessIcons.Calendar className="w-5 h-5" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>
                    Track your service appointments and booking history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {booking.provider.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{booking.provider}</h4>
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
                            {booking.status === 'completed' && booking.rating ? (
                              <div className="flex items-center gap-1">
                                <OptimizedIcon name="Star" className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-medium">{booking.rating}</span>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <OptimizedIcon name="MessageSquare" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => router.push(`/${locale}/bookings`)}>
                      <History className="w-4 h-4 mr-2" />
                      View All Bookings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Favorite Providers
                  </CardTitle>
                  <CardDescription>
                    Quick access to your trusted service providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteProviders.map((provider) => (
                      <div key={provider.id} className="p-4 border rounded-lg dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {provider.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{provider.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{provider.service}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <OptimizedIcon name="Star" className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{provider.rating}</span>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400">{provider.bookings} bookings</span>
                        </div>
                        <Button className="w-full mt-3" size="sm">
                          Book Again
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => router.push(`/${locale}/browse`)}>
                      <NavigationIcons.Search className="w-4 h-4 mr-2" />
                      Discover More Providers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discover">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <NavigationIcons.Search className="w-5 h-5" />
                    Discover Services
                  </CardTitle>
                  <CardDescription>
                    Find amazing local service providers for all your needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <NavigationIcons.Search className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Explore Local Services</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Find trusted professionals for, cleaning, repairs, wellness, and more
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Button onClick={() => router.push(`/${locale}/browse?category=cleaning`)}>
                        🧹 House Cleaning
                      </Button>
                      <Button onClick={() => router.push(`/${locale}/browse?category=repairs`)} variant="outline">
                        🔧 Home Repairs
                      </Button>
                      <Button onClick={() => router.push(`/${locale}/browse?category=wellness`)} variant="outline">
                        💆‍♀️ Wellness & Beauty
                      </Button>
                      <Button onClick={() => router.push(`/${locale}/browse?category=gardening`)} variant="outline">
                        🌱 Gardening
                      </Button>
                    </div>
                    <div className="mt-6">
                      <Button onClick={() => router.push(`/${locale}/browse`)} className="bg-gradient-to-r from-emerald-600 to-blue-600">
                        <NavigationIcons.Search className="w-4 h-4 mr-2" />
                        Browse All Services
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <NavigationIcons.User className="w-5 h-5" />
                    My Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">Loconomy Customer</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <BusinessIcons.Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Member since 2024</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BusinessIcons.MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Local Area</span>
                          </div>
                        </div>
                      </div>
                      <Button>
                        <NavigationIcons.Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <OptimizedIcon name="Mail" className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">{user?.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <OptimizedIcon name="Phone" className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <NavigationIcons.Settings className="w-4 h-4 mr-2" />
                            Account Settings
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Payment Methods
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Saved Services
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