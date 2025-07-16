import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ArrowLeft,
  Eye,
  Star,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function ProviderAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/provider/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-muted-foreground">
                Track your performance and earnings
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold">$2,847</p>
                  <p className="text-sm text-green-600">+12% this month</p>
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
                  <p className="text-sm text-muted-foreground">
                    Completed Jobs
                  </p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-sm text-blue-600">+8 this month</p>
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
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold">324</p>
                  <p className="text-sm text-purple-600">+23% this month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-sm text-yellow-600">98% positive</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Earnings chart placeholder
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Booking trends chart placeholder
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded">
                    <span>House Cleaning Services</span>
                    <span className="font-semibold">$1,247</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded">
                    <span>Handyman Services</span>
                    <span className="font-semibold">$956</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded">
                    <span>Pet Grooming</span>
                    <span className="font-semibold">$644</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium">House Cleaning</p>
                        <p className="text-sm text-muted-foreground">
                          Dec {20 - i}, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$85</p>
                        <p className="text-sm text-green-600">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">2.1h</p>
                    <p className="text-sm text-muted-foreground">
                      Avg Response Time
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-sm text-muted-foreground">
                      Job Completion Rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-sm text-muted-foreground">
                      Customer Retention
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
