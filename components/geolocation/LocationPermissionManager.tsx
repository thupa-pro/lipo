"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  AlertTriangle,
  XCircle,
  Settings,
  Loader2,
  CheckCircle,
  Shield
} from "lucide-react";
import { geolocationService } from "@/lib/geolocation/geolocation-service";
import type { LocationPermission, Location } from "@/lib/geolocation/types";
import { useToast } from "@/components/ui/use-toast";

interface LocationPermissionManagerProps {
  onLocationUpdate?: (location: Location | null) => void;
  onPermissionChange?: (permission: LocationPermission) => void;
  autoRequest?: boolean;
  showPreciseLocation?: boolean;
}

export default function LocationPermissionManager({
  onLocationUpdate,
  onPermissionChange,
  autoRequest = false,
  showPreciseLocation = false,
}: LocationPermissionManagerProps) {
  const [permission, setPermission] = useState<LocationPermission>({
    state: "unknown",
    canRequest: false,
  });
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    enableAutoLocation: true,
    highAccuracy: true,
    backgroundUpdates: false,
    shareLocation: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    checkCurrentPermission();

    // Auto-request location if enabled
    if (autoRequest && permission.state === "prompt") {
      requestLocation();
    }
  }, [autoRequest, permission.state, requestLocation]);

  useEffect(() => {
    // Load cached location
    const cached = geolocationService.getCachedLocation();
    if (cached) {
      setCurrentLocation(cached);
      onLocationUpdate?.(cached);
    }

    // Subscribe to location updates
    geolocationService.onLocationUpdate((location) => {
      setCurrentLocation(location);
      onLocationUpdate?.(location);
    });

    // Subscribe to error updates
    geolocationService.onError((error) => {
      toast({
        title: "Location Error",
        description: error.message,
        variant: "destructive",
      });
    });
  }, [onLocationUpdate, toast]);

  const checkCurrentPermission = async () => {
    try {
      const currentPermission = await geolocationService.checkPermissions();
      setPermission(currentPermission);
      onPermissionChange?.(currentPermission);
    } catch (error) {
      console.error("Failed to check permissions:", error);
    }
  };

  const requestLocation = async () => {
    setIsLoading(true);
    try {
      const location = await geolocationService.getCurrentPosition();
      setCurrentLocation(location);
      onLocationUpdate?.(location);

      // Re-check permissions after successful request
      await checkCurrentPermission();

      toast({
        title: "Location Access Granted",
        description: "Your location has been successfully detected.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Location Access Failed",
        description:
          error instanceof Error ? error.message : "Failed to get location",
        variant: "destructive",
      });
      await checkCurrentPermission();
    } finally {
      setIsLoading(false);
    }
  };

  const startWatchingLocation = () => {
    geolocationService.startWatchingPosition();
    toast({
      title: "Location Tracking Started",
      description: "Your location will be updated automatically.",
      variant: "default",
    });
  };

  const stopWatchingLocation = () => {
    geolocationService.stopWatchingPosition();
    toast({
      title: "Location Tracking Stopped",
      description: "Location updates have been disabled.",
      variant: "default",
    });
  };

  const getPermissionIcon = () => {
    switch (permission.state) {
      case "granted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "denied":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "prompt":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPermissionBadge = () => {
    switch (permission.state) {
      case "granted":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Granted
          </Badge>
        );
      case "denied":
        return <Badge variant="destructive">Denied</Badge>;
      case "prompt":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatLocation = (location: Location) => {
    const { coordinates, address, source } = location;
    return {
      display: `${address.city}, ${address.state}`,
      precise: `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`,
      accuracy: coordinates.accuracy
        ? `±${Math.round(coordinates.accuracy)}m`
        : "Unknown",
      source: source.toUpperCase(),
    };
  };

  return (
    <div className="space-y-6">
      {/* Permission Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getPermissionIcon()}
              <div>
                <CardTitle className="text-lg">Location Permission</CardTitle>
                <CardDescription>
                  Manage your location sharing preferences
                </CardDescription>
              </div>
            </div>
            {getPermissionBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission.message && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{permission.message}</AlertDescription>
            </Alert>
          )}

          {permission.state === "denied" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Location access is blocked. Please enable it in your browser
                settings to use location-based features.
              </AlertDescription>
            </Alert>
          )}

          {permission.canRequest && (
            <Button
              onClick={requestLocation}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Request Location Access
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Current Location Card */}
      {currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Current Location
            </CardTitle>
            <CardDescription>
              Last updated:{" "}
              {new Date(currentLocation.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Location
                </Label>
                <p className="font-medium">
                  {formatLocation(currentLocation).display}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Source</Label>
                <p className="font-medium">
                  {formatLocation(currentLocation).source}
                </p>
              </div>
              {showPreciseLocation && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Coordinates
                    </Label>
                    <p className="font-mono text-xs">
                      {formatLocation(currentLocation).precise}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Accuracy
                    </Label>
                    <p className="font-medium">
                      {formatLocation(currentLocation).accuracy}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Location Preferences
          </CardTitle>
          <CardDescription>
            Configure how location services work for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Auto-detect Location
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically detect your location when browsing services
                </p>
              </div>
              <Switch
                checked={preferences.enableAutoLocation}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    enableAutoLocation: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">High Accuracy</Label>
                <p className="text-xs text-muted-foreground">
                  Use GPS for more precise location (uses more battery)
                </p>
              </div>
              <Switch
                checked={preferences.highAccuracy}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, highAccuracy: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Background Updates
                </Label>
                <p className="text-xs text-muted-foreground">
                  Update location automatically while using the app
                </p>
              </div>
              <Switch
                checked={preferences.backgroundUpdates}
                onCheckedChange={(checked) => {
                  setPreferences((prev) => ({
                    ...prev,
                    backgroundUpdates: checked,
                  }));
                  if (checked) {
                    startWatchingLocation();
                  } else {
                    stopWatchingLocation();
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Share with Providers
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow providers to see your approximate location
                </p>
              </div>
              <Switch
                checked={preferences.shareLocation}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    shareLocation: checked,
                  }))
                }
              />
            </div>
          </div>

          {permission.state === "granted" && currentLocation && (
            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestLocation}
                  disabled={isLoading}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Refresh Location
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (preferences.backgroundUpdates) {
                      stopWatchingLocation();
                      setPreferences((prev) => ({
                        ...prev,
                        backgroundUpdates: false,
                      }));
                    } else {
                      startWatchingLocation();
                      setPreferences((prev) => ({
                        ...prev,
                        backgroundUpdates: true,
                      }));
                    }
                  }}
                >
                  {preferences.backgroundUpdates ? "Stop" : "Start"} Tracking
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
