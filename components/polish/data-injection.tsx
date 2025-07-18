"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Users,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
} from "lucide-react";
import {
  seedUsers,
  seedServices,
  seedBookings,
  seedReviews,
  popularCategories,
  platformStats,
  testimonials,
} from "@/lib/data/seed-data";

interface DataInjectionProps {
  onDataLoaded?: () => void;
}

export function DataInjection({ onDataLoaded }: DataInjectionProps) {
  const [isInjecting, setIsInjecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [injectedData, setInjectedData] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);

  const dataTypes = [
    {
      key: "users",
      name: "Users & Providers",
      description: "Realistic user profiles with verified accounts",
      count: seedUsers.length,
      icon: Users,
      color: "blue",
    },
    {
      key: "services",
      name: "Service Listings",
      description: "Professional services with real pricing and descriptions",
      count: seedServices.length,
      icon: Star,
      color: "green",
    },
    {
      key: "bookings",
      name: "Booking History",
      description: "Completed and active bookings with realistic timelines",
      count: seedBookings.length,
      icon: Calendar,
      color: "purple",
    },
    {
      key: "reviews",
      name: "Reviews & Ratings",
      description: "Authentic customer reviews with detailed feedback",
      count: seedReviews.length,
      icon: Star,
      color: "yellow",
    },
    {
      key: "categories",
      name: "Popular Categories",
      description: "Service categories with usage statistics",
      count: popularCategories.length,
      icon: TrendingUp,
      color: "orange",
    },
    {
      key: "testimonials",
      name: "Customer Testimonials",
      description: "Success stories from satisfied customers",
      count: testimonials.length,
      icon: Eye,
      color: "pink",
    },
  ];

  const injectData = async (dataType?: string) => {
    setIsInjecting(true);
    setProgress(0);

    const typesToInject = dataType ? [dataType] : dataTypes.map((dt) => dt.key);
    const totalSteps = typesToInject.length;

    for (let i = 0; i < typesToInject.length; i++) {
      const type = typesToInject[i];

      // Simulate data injection
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Store in localStorage for demo purposes
      switch (type) {
        case "users":
          localStorage.setItem("loconomy_users", JSON.stringify(seedUsers));
          break;
        case "services":
          localStorage.setItem(
            "loconomy_services",
            JSON.stringify(seedServices),
          );
          break;
        case "bookings":
          localStorage.setItem(
            "loconomy_bookings",
            JSON.stringify(seedBookings),
          );
          break;
        case "reviews":
          localStorage.setItem("loconomy_reviews", JSON.stringify(seedReviews));
          break;
        case "categories":
          localStorage.setItem(
            "loconomy_categories",
            JSON.stringify(popularCategories),
          );
          break;
        case "testimonials":
          localStorage.setItem(
            "loconomy_testimonials",
            JSON.stringify(testimonials),
          );
          break;
      }

      setInjectedData((prev) => ({ ...prev, [type]: true }));
      setProgress(((i + 1) / totalSteps) * 100);
    }

    // Store platform stats
    localStorage.setItem(
      "loconomy_platform_stats",
      JSON.stringify(platformStats),
    );

    setIsInjecting(false);
    onDataLoaded?.();
  };

  const clearData = async (dataType?: string) => {
    const typesToClear = dataType ? [dataType] : dataTypes.map((dt) => dt.key);

    typesToClear.forEach((type) => {
      localStorage.removeItem(`loconomy_${type}`);
      setInjectedData((prev) => ({ ...prev, [type]: false }));
    });

    if (!dataType) {
      localStorage.removeItem("loconomy_platform_stats");
    }
  };

  const checkExistingData = () => {
    const existingData: Record<string, boolean> = {};
    dataTypes.forEach((dt) => {
      const data = localStorage.getItem(`loconomy_${dt.key}`);
      existingData[dt.key] = !!data;
    });
    setInjectedData(existingData);
  };

  useEffect(() => {
    checkExistingData();
  }, []);

  const getDataTypeIcon = (dataType: any) => {
    const IconComponent = dataType.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getDataTypeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      pink: "bg-pink-100 text-pink-800 border-pink-200",
    };
    return colors[color] || colors.blue;
  };

  const totalInjected = Object.values(injectedData).filter(Boolean).length;
  const completionPercentage = (totalInjected / dataTypes.length) * 100;

  return (
    <div className="space-y-6">
      {/* Data Injection Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Realistic Data Injection
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide" : "Preview"}
              </Button>
              <Button
                onClick={() => injectData()}
                disabled={isInjecting}
                className="flex items-center gap-2"
              >
                {isInjecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Injecting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Inject All Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Data injection progress ({totalInjected}/{dataTypes.length}{" "}
                completed)
              </span>
              <span className="text-sm text-muted-foreground">
                {completionPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={isInjecting ? progress : completionPercentage}
              className="w-full"
            />

            {completionPercentage === 100 && !isInjecting && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All realistic data has been successfully injected into the
                  platform. Users will now see authentic profiles, services, and
                  interactions.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Types */}
      <Card>
        <CardHeader>
          <CardTitle>Data Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTypes.map((dataType) => (
              <div
                key={dataType.key}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDataTypeColor(dataType.color)}`}
                  >
                    {getDataTypeIcon(dataType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{dataType.name}</h4>
                      <Badge variant="outline">{dataType.count} items</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dataType.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {injectedData[dataType.key] ? (
                    <>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Injected
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearData(dataType.key)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => injectData(dataType.key)}
                      disabled={isInjecting}
                    >
                      Inject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <h4 className="font-medium">Sample Users</h4>
                {seedUsers.slice(0, 2).map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h5>
                          {user.verificationStatus === "verified" && (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {user.isProvider && (
                            <Badge variant="outline" className="text-xs">
                              Provider
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {user.bio}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.location.city}, {user.location.state}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            {user.rating}
                          </div>
                          <span>{user.totalBookings} bookings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <h4 className="font-medium">Sample Services</h4>
                {seedServices.slice(0, 2).map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-medium">{service.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              {service.category} • {service.subcategory}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ${service.price.amount}
                              {service.price.type === "hourly" ? "/hr" : ""}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                              {service.rating} ({service.reviewCount})
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {service.description.substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <h4 className="font-medium">Platform Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {platformStats.totalUsers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Users
                    </div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {platformStats.totalProviders.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Providers
                    </div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {platformStats.totalBookings.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Bookings
                    </div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      ${(platformStats.totalRevenue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => clearData()}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataInjection;
