import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Grid3X3, List, Filter, X, Navigation, Target } from "lucide-react";
import { geolocationService } from "@/lib/geolocation/geolocation-service";
import { hyperlocalService } from "@/lib/geolocation/hyperlocal-service";
import type { Location, Coordinates } from "@/lib/geolocation/types";
import type { DiscoveryFilters } from "@/lib/geolocation/hyperlocal-service";
import { useToast } from "@/components/ui/use-toast";

interface EnhancedBrowseSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (loc: string) => void;
  handleSearch: (filters?: DiscoveryFilters) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  loading: boolean;
  onLocationUpdate?: (location: Location | null) => void;
  onFiltersChange?: (filters: DiscoveryFilters) => void;
}

export default function EnhancedBrowseSearchHeader({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  handleSearch,
  viewMode,
  setViewMode,
  loading,
  onLocationUpdate,
  onFiltersChange,
}: EnhancedBrowseSearchHeaderProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [radiusKm, setRadiusKm] = useState([10]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [filters, setFilters] = useState<DiscoveryFilters>({
    category: undefined,
    urgency: undefined,
    priceRange: undefined,
    rating: undefined,
    availability: undefined,
    radius: 10,
    verified: false,
  });

  const { toast } = useToast();

  // Initialize location services
  useEffect(() => {
    // Check for cached location
    const cached = geolocationService.getCachedLocation();
    if (cached) {
      setCurrentLocation(cached);
      setGpsEnabled(true);
      updateLocationDisplay(cached);
      onLocationUpdate?.(cached);
    }

    // Subscribe to location updates
    geolocationService.onLocationUpdate((newLocation) => {
      setCurrentLocation(newLocation);
      updateLocationDisplay(newLocation);
      onLocationUpdate?.(newLocation);
    });
  }, [onLocationUpdate]);

  // Update filters when radius changes
  useEffect(() => {
    const newFilters = { ...filters, radius: radiusKm[0] };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [radiusKm[0], onFiltersChange]);

  const updateLocationDisplay = (loc: Location) => {
    setLocation(`${loc.address.city}, ${loc.address.state}`);
  };

  const enableGPS = useCallback(async () => {
    setIsGettingLocation(true);
    try {
      const newLocation = await geolocationService.getCurrentPosition();
      setCurrentLocation(newLocation);
      setGpsEnabled(true);
      updateLocationDisplay(newLocation);
      onLocationUpdate?.(newLocation);

      toast({
        title: "Location Detected",
        description: `Found your location: ${newLocation.address.city}, ${newLocation.address.state}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Location Access Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get your location",
        variant: "destructive",
      });
      setGpsEnabled(false);
    } finally {
      setIsGettingLocation(false);
    }
  }, [onLocationUpdate, toast]);

  const disableGPS = () => {
    setGpsEnabled(false);
    setCurrentLocation(null);
    geolocationService.stopWatchingPosition();
    onLocationUpdate?.(null);

    toast({
      title: "GPS Disabled",
      description: "Location services have been turned off",
      variant: "default",
    });
  };

  const handleFilterChange = (key: keyof DiscoveryFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: DiscoveryFilters = {
      category: undefined,
      urgency: undefined,
      priceRange: undefined,
      rating: undefined,
      availability: undefined,
      radius: radiusKm[0],
      verified: false,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.urgency) count++;
    if (filters.priceRange) count++;
    if (filters.rating) count++;
    if (filters.availability) count++;
    if (filters.verified) count++;
    return count;
  };

  const formatDistance = (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km}km`;
  };

  return (
    <div className="bg-muted/50 border-b border-border dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl py-6 px-4 space-y-4">
        {/* Main Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              {/* Service Search */}
              <div className="relative flex-1">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" / />
                <Input
                  placeholder="Search services or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-md shadow-sm dark:bg-input"
                />
              </div>

              {/* Location Input with GPS */}
              <div className="relative flex-1">
                <BusinessIcons.MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" / />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 pr-12 rounded-md shadow-sm dark:bg-input"
                  disabled={gpsEnabled}
                />
                <Button
                  size="sm"
                  variant={gpsEnabled ? "default" : "outline"}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={gpsEnabled ? disableGPS : enableGPS}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <UIIcons.Loader2 className="w-3 h-3 animate-spin" / />
                  ) : gpsEnabled ? (
                    <Navigation className="w-3 h-3" />
                  ) : (
                    <Target className="w-3 h-3" />
                  )}
                </Button>
              </div>

              {/* Search Button */}
              <Button
                onClick={() => handleSearch(filters)}
                disabled={loading}
                className="rounded-md shadow-sm transition-all hover:shadow-md"
              >
                {loading ? (
                  <UIIcons.Loader2 className="w-4 h-4 animate-spin" / />
                ) : (
                  <NavigationIcons.Search className="w-4 h-4" / />
                )}
              </Button>
            </div>
          </div>

          {/* View Toggle and Filters */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="rounded-md shadow-sm transition-all hover:shadow-md"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>

            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-md shadow-sm transition-all hover:shadow-md"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-md shadow-sm transition-all hover:shadow-md"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* GPS Status and Radius */}
        {gpsEnabled && currentLocation && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Navigation className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      GPS Location Active
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {currentLocation.address.city},{" "}
                      {currentLocation.address.state}
                      {currentLocation.coordinates.accuracy &&
                        ` (±${Math.round(currentLocation.coordinates.accuracy)}m)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Label className="text-xs text-green-700 dark:text-green-300">
                      Search Radius: {formatDistance(radiusKm[0])}
                    </Label>
                    <div className="w-24">
                      <Slider
                        value={radiusKm}
                        onValueChange={setRadiusKm}
                        max={50}
                        min={1}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Advanced Filters</h3>
                <div className="flex gap-2">
                  {getActiveFilterCount() > 0 && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Category
                  </Label>
                  <Select
                    value={filters.category || ""}
                    onValueChange={(value) =>
                      handleFilterChange("category", value || undefined)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Any category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any category</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="handyman">Handyman</SelectItem>
                      <SelectItem value="gardening">Gardening</SelectItem>
                      <SelectItem value="moving">Moving</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency Filter */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Urgency
                  </Label>
                  <Select
                    value={filters.urgency || ""}
                    onValueChange={(value) =>
                      handleFilterChange("urgency", value || undefined)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Any urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any urgency</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Availability
                  </Label>
                  <Select
                    value={filters.availability || ""}
                    onValueChange={(value) =>
                      handleFilterChange("availability", value || undefined)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any time</SelectItem>
                      <SelectItem value="now">Available now</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this_week">This week</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Min Rating
                  </Label>
                  <Select
                    value={filters.rating?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "rating",
                        value ? Number(value) : undefined,
                      )
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any rating</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                      <SelectItem value="4.0">4.0+ stars</SelectItem>
                      <SelectItem value="3.5">3.5+ stars</SelectItem>
                      <SelectItem value="3.0">3.0+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified-only"
                    checked={filters.verified || false}
                    onCheckedChange={(checked) =>
                      handleFilterChange("verified", checked)
                    }
                  />
                  <Label htmlFor="verified-only" className="text-sm">
                    Verified providers only
                  </Label>
                </div>

                {!gpsEnabled && (
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Search radius:</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-8">
                        {formatDistance(radiusKm[0])}
                      </span>
                      <div className="w-20">
                        <Slider
                          value={radiusKm}
                          onValueChange={setRadiusKm}
                          max={50}
                          min={1}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
