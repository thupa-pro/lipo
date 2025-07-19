"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Navigation,
  Target,
  TestTube,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Settings,
} from "lucide-react";
import LocationPermissionManager from "@/components/geolocation/LocationPermissionManager";
import EnhancedBrowseSearchHeader from "@/components/browse/EnhancedBrowseSearchHeader";
import HyperlocalProviderCard from "@/components/browse/HyperlocalProviderCard";
import { geolocationService } from "@/lib/geolocation/geolocation-service";
import { hyperlocalService } from "@/lib/geolocation/hyperlocal-service";
import type { Location, ProviderWithLocation } from "@/lib/geolocation/types";
import type {
  HyperlocalMatch,
  DiscoveryFilters,
} from "@/lib/geolocation/hyperlocal-service";

// Mock provider data with coordinates
const mockProviders: ProviderWithLocation[] = [
  {
    id: 1,
    name: "Mike's Plumbing",
    service: "Emergency Plumbing",
    category: "plumbing",
    rating: 4.8,
    reviews: 124,
    price: "$85/hr",
    hourlyRate: 85,
    location: "Downtown",
    coordinates: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
    avatar: "/placeholder.svg",
    badges: ["Emergency", "24/7"],
    completedJobs: 340,
    responseTime: "15 minutes",
    availability: "Available now",
    description: "Professional emergency plumber with 10+ years experience",
    verified: true,
    isAvailableNow: true,
    urgencyTags: ["emergency"],
    serviceRadius: 25,
    hyperlocalScore: 95,
  },
  {
    id: 2,
    name: "Clean Pro Services",
    service: "Deep House Cleaning",
    category: "cleaning",
    rating: 4.9,
    reviews: 89,
    price: "$45/hr",
    hourlyRate: 45,
    location: "Mission District",
    coordinates: { latitude: 37.7599, longitude: -122.4148 },
    avatar: "/placeholder.svg",
    badges: ["Eco-friendly", "Insured"],
    completedJobs: 156,
    responseTime: "1 hour",
    availability: "Today",
    description: "Eco-friendly deep cleaning service for homes and offices",
    verified: true,
    isAvailableNow: false,
    serviceRadius: 15,
    hyperlocalScore: 88,
  },
  {
    id: 3,
    name: "TechFix Solutions",
    service: "Computer Repair",
    category: "tech",
    rating: 4.7,
    reviews: 203,
    price: "$120/hr",
    hourlyRate: 120,
    location: "SOMA",
    coordinates: { latitude: 37.7849, longitude: -122.4094 },
    avatar: "/placeholder.svg",
    badges: ["Same-day", "Certified"],
    completedJobs: 445,
    responseTime: "30 minutes",
    availability: "This week",
    description: "Professional computer and tech device repair service",
    verified: true,
    isAvailableNow: true,
    serviceRadius: 20,
    hyperlocalScore: 76,
  },
];

export default function GPSTestPage() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [hyperlocalMatches, setHyperlocalMatches] = useState<HyperlocalMatch[]>(
    [],
  );
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load cached location on mount
    const cached = geolocationService.getCachedLocation();
    if (cached) {
      setCurrentLocation(cached);
      runHyperlocalDiscovery(cached);
    }
  }, []);

  const runHyperlocalDiscovery = async (location?: Location | null) => {
    const loc = location || currentLocation;
    if (!loc) return;

    try {
      const matches = await hyperlocalService.startHyperlocalDiscovery(
        mockProviders,
        { radius: 25 },
        { preferredRadius: 5, maxRadius: 25 },
      );
      setHyperlocalMatches(matches);
    } catch (error) {
      console.error("Hyperlocal discovery failed:", error);
    }
  };

  const handleLocationUpdate = (location: Location | null) => {
    setCurrentLocation(location);
    if (location) {
      runHyperlocalDiscovery(location);
    }
  };

  const runGPSTests = async () => {
    setIsRunningTests(true);
    const results = [];

    // Test 1: Check geolocation support
    results.push({
      test: "Geolocation Support",
      result: geolocationService.isSupported(),
      status: geolocationService.isSupported() ? "pass" : "fail",
      details: geolocationService.isSupported()
        ? "Browser supports geolocation"
        : "Browser does not support geolocation",
    });

    // Test 2: Check permissions
    try {
      const permission = await geolocationService.checkPermissions();
      results.push({
        test: "Permission Check",
        result: permission.state,
        status:
          permission.state === "granted"
            ? "pass"
            : permission.state === "prompt"
              ? "warning"
              : "fail",
        details: permission.message,
      });
    } catch (error) {
      results.push({
        test: "Permission Check",
        result: false,
        status: "fail",
        details: `Permission check failed: ${error}`,
      });
    }

    // Test 3: Get current position
    try {
      const location = await geolocationService.getCurrentPosition();
      results.push({
        test: "Get Current Position",
        result: location,
        status: "pass",
        details: `Location obtained: ${location.address.city}, ${location.address.state}`,
      });
      setCurrentLocation(location);
    } catch (error) {
      results.push({
        test: "Get Current Position",
        result: false,
        status: "fail",
        details: `Failed to get location: ${error}`,
      });
    }

    // Test 4: Distance calculation
    if (mockProviders.length > 1 && mockProviders[0]?.coordinates && mockProviders[1]?.coordinates) {
      const distance = geolocationService.calculateDistance(
        mockProviders[0].coordinates,
        mockProviders[1].coordinates,
        "km",
      );
      results.push({
        test: "Distance Calculation",
        result: distance,
        status: "pass",
        details: `Distance between providers: ${distance}km`,
      });
    }

    // Test 5: Hyperlocal discovery
    if (currentLocation) {
      try {
        const matches =
          await hyperlocalService.startHyperlocalDiscovery(mockProviders);
        results.push({
          test: "Hyperlocal Discovery",
          result: matches.length,
          status: matches.length > 0 ? "pass" : "warning",
          details: `Found ${matches.length} hyperlocal matches`,
        });
        setHyperlocalMatches(matches);
      } catch (error) {
        results.push({
          test: "Hyperlocal Discovery",
          result: false,
          status: "fail",
          details: `Hyperlocal discovery failed: ${error}`,
        });
      }
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const handleSearch = (filters?: DiscoveryFilters) => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      if (currentLocation) {
        runHyperlocalDiscovery();
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          GPS & Hyperlocal Discovery Test
        </h1>
        <p className="text-muted-foreground">
          Test and verify GPS geolocation and hyperlocal discovery functionality
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  GPS Status
                </CardTitle>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentLocation ? "Active" : "Inactive"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentLocation
                    ? `${currentLocation.address.city}, ${currentLocation.address.state}`
                    : "No location detected"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Providers Found
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hyperlocalMatches.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hyperlocal matches
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Best Match
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hyperlocalMatches[0]?.relevanceScore || 0}%
                </div>
                <p className="text-xs text-muted-foreground">Relevance score</p>
              </CardContent>
            </Card>
          </div>

          {currentLocation && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                Current location: {currentLocation.address.city},{" "}
                {currentLocation.address.state}
                {currentLocation.coordinates.accuracy &&
                  ` (±${Math.round(currentLocation.coordinates.accuracy)}m accuracy)`}
                • Source: {currentLocation.source.toUpperCase()}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <LocationPermissionManager
            onLocationUpdate={handleLocationUpdate}
            autoRequest={false}
            showPreciseLocation={true}
          />
        </TabsContent>

        <TabsContent value="discovery" className="space-y-6">
          <EnhancedBrowseSearchHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            location={locationInput}
            setLocation={setLocationInput}
            handleSearch={handleSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            loading={isLoading}
            onLocationUpdate={handleLocationUpdate}
          />

          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {hyperlocalMatches.map((match) => (
              <HyperlocalProviderCard
                key={match.provider.id}
                match={match}
                viewMode={viewMode}
                showHyperlocalScore={true}
                showDetailedMetrics={true}
              />
            ))}
          </div>

          {hyperlocalMatches.length === 0 && currentLocation && (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No providers found</h3>
                <p className="text-muted-foreground">
                  Try expanding your search radius or changing filters
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">GPS Functionality Tests</h2>
            <Button
              onClick={runGPSTests}
              disabled={isRunningTests}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isRunningTests ? "Running Tests..." : "Run Tests"}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              {testResults.map((test, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{test.test}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <Badge
                          variant={
                            test.status === "pass"
                              ? "default"
                              : test.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {test.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {test.details}
                    </p>
                    {typeof test.result === "object" && test.result && (
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(test.result, null, 2)}
                      </pre>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {testResults.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Ready to Test</h3>
                <p className="text-muted-foreground">
                  Click "Run Tests" to verify GPS and hyperlocal discovery
                  functionality
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
