"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Star,
  DollarSign,
  Clock,
  Users,
  Plus,
  Edit,
  Eye,
  MoreHorizontal,
  Briefcase,
  MessageCircle,
  Heart,
  Activity,
  ChevronRight,
  Award,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DashboardMetrics {
  totalEarnings: number;
  monthlyEarnings: number;
  upcomingJobs: number;
  completedJobs: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  completionRate: number;
  repeatCustomers: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "paused" | "draft";
  bookings: number;
  revenue: number;
  rating: number;
  views: number;
  image: string;
  lastBooked: string;
}

interface UpcomingBooking {
  id: string;
  service: string;
  customer: {
    name: string;
    image?: string;
  };
  date: string;
  time: string;
  status: "confirmed" | "pending" | "in_progress";
  price: number;
  address: string;
}

interface RecentActivity {
  id: string;
  type: "booking" | "review" | "message" | "payout";
  description: string;
  time: string;
  amount?: number;
}

export default function ProviderDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockMetrics: DashboardMetrics = {
    totalEarnings: 15420,
    monthlyEarnings: 3250,
    upcomingJobs: 7,
    completedJobs: 245,
    averageRating: 4.9,
    totalReviews: 127,
    responseRate: 98,
    completionRate: 99,
    repeatCustomers: 85,
  };

  const mockServices: Service[] = [
    {
      id: "1",
      title: "Professional House Cleaning",
      description: "Deep cleaning service for homes",
      price: 75,
      category: "Cleaning",
      status: "active",
      bookings: 45,
      revenue: 3375,
      rating: 4.9,
      views: 1234,
      image: "/api/placeholder/100/100",
      lastBooked: "2024-01-15",
    },
    {
      id: "2",
      title: "Office Deep Clean",
      description: "Commercial cleaning for offices",
      price: 150,
      category: "Cleaning",
      status: "active",
      bookings: 23,
      revenue: 3450,
      rating: 4.8,
      views: 876,
      image: "/api/placeholder/100/100",
      lastBooked: "2024-01-14",
    },
    {
      id: "3",
      title: "Move-in/Move-out Cleaning",
      description: "Comprehensive cleaning for relocations",
      price: 120,
      category: "Cleaning",
      status: "paused",
      bookings: 18,
      revenue: 2160,
      rating: 4.7,
      views: 543,
      image: "/api/placeholder/100/100",
      lastBooked: "2024-01-10",
    },
  ];

  const mockUpcomingBookings: UpcomingBooking[] = [
    {
      id: "1",
      service: "Professional House Cleaning",
      customer: {
        name: "Jessica Thompson",
        image: "/api/placeholder/40/40",
      },
      date: "2024-01-16",
      time: "10:00",
      status: "confirmed",
      price: 75,
      address: "123 Oak, Street, Downtown",
    },
    {
      id: "2",
      service: "Office Deep Clean",
      customer: {
        name: "Tech Startup Inc.",
        image: "/api/placeholder/40/40",
      },
      date: "2024-01-16",
      time: "14:00",
      status: "confirmed",
      price: 150,
      address: "456 Business, Ave, Midtown",
    },
    {
      id: "3",
      service: "Professional House Cleaning",
      customer: {
        name: "Michael Rodriguez",
        image: "/api/placeholder/40/40",
      },
      date: "2024-01-17",
      time: "09:00",
      status: "pending",
      price: 75,
      address: "789 Pine, Road, Uptown",
    },
  ];

  const mockRecentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "booking",
      description: "New booking for Professional House Cleaning",
      time: "2 hours ago",
      amount: 75,
    },
    {
      id: "2",
      type: "review",
      description: "New 5-star review from Jessica M.",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "payout",
      description: "Weekly payout processed",
      time: "1 day ago",
      amount: 485,
    },
    {
      id: "4",
      type: "message",
      description: "New message from Michael R.",
      time: "2 days ago",
    },
  ];

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "PROVIDER") {
      router.push("/");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setMetrics(mockMetrics);
      setServices(mockServices);
      setUpcomingBookings(mockUpcomingBookings);
      setRecentActivity(mockRecentActivity);
      setIsLoading(false);
    }, 1000);
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-2xl mx-auto p-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-muted rounded-lg"></div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "payout":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case "message":
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, back, {session?.user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your business today
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Service
            </Button>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${metrics.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+${metrics.monthlyEarnings} this month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Jobs</p>
                  <p className="text-2xl font-bold">{metrics.upcomingJobs}</p>
                  <p className="text-sm text-blue-600">Next: Today 10:00 AM</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    {metrics.averageRating}
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </p>
                  <p className="text-sm text-muted-foreground">{metrics.totalReviews} reviews</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Jobs</p>
                  <p className="text-2xl font-bold">{metrics.completedJobs}</p>
                  <p className="text-sm text-purple-600">{metrics.completionRate}% completion rate</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Services Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Services</CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{service.title}</h4>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">${service.price}</span>
                            <span className="text-muted-foreground">
                              {service.bookings} bookings
                            </span>
                            <span className="text-muted-foreground">
                              ${service.revenue} revenue
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{service.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Service</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Response Rate</span>
                        <span className="text-sm font-bold">{metrics.responseRate}%</span>
                      </div>
                      <Progress value={metrics.responseRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-sm font-bold">{metrics.completionRate}%</span>
                      </div>
                      <Progress value={metrics.completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Repeat Customers</span>
                        <span className="text-sm font-bold">{metrics.repeatCustomers}%</span>
                      </div>
                      <Progress value={metrics.repeatCustomers} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={booking.customer.image} />
                          <AvatarFallback>
                            {booking.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{booking.customer.name}</h4>
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {booking.service}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium">${booking.price}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <MessageCircle className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {activity.time}
                            </span>
                            {activity.amount && (
                              <span className="text-sm font-medium text-green-600">
                                +${activity.amount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
