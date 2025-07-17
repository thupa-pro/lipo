import type {
  Coordinates,
  Location,
  GeolocationConfig,
  LocationPermission,
  RadiusFilter,
  ProximityResult,
  Address,
} from "./types";

class GeolocationService {
  private static instance: GeolocationService;
  private currentLocation: Location | null = null;
  private watchId: number | null = null;
  private locationUpdateCallbacks: ((location: Location) => void)[] = [];
  private errorCallbacks: ((error: GeolocationPositionError) => void)[] = [];

  private config: GeolocationConfig = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
    fallbackToIP: true,
    cacheExpiry: 600000, // 10 minutes
  };

  private constructor() {
    // Only initialize on client-side to prevent SSR issues
    if (typeof window !== "undefined") {
      this.loadCachedLocation();
    }
  }

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "geolocation" in navigator
    );
  }

  // Check current permission status
  async checkPermissions(): Promise<LocationPermission> {
    if (!this.isSupported()) {
      return {
        state: "unknown",
        canRequest: false,
        message: "Geolocation is not supported by this browser",
      };
    }

    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "permissions" in navigator
    ) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        return {
          state: permission.state,
          canRequest: permission.state === "prompt",
          message: this.getPermissionMessage(permission.state),
        };
      } catch (error) {
        console.warn("Permission query failed:", error);
      }
    }

    return {
      state: "unknown",
      canRequest: true,
      message: "Location permission status unknown",
    };
  }

  private getPermissionMessage(state: string): string {
    switch (state) {
      case "granted":
        return "Location access granted";
      case "denied":
        return "Location access denied. Please enable in browser settings.";
      case "prompt":
        return "Location permission will be requested";
      default:
        return "Location permission status unknown";
    }
  }

  // Get current position with enhanced error handling
  async getCurrentPosition(): Promise<Location> {
    if (!this.isSupported()) {
      throw new Error("Geolocation is not supported");
    }

    return new Promise((resolve, reject) => {
      const options: PositionOptions = {
        enableHighAccuracy: this.config.enableHighAccuracy,
        timeout: this.config.timeout,
        maximumAge: this.config.maximumAge,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const location = await this.processPosition(position);
            this.currentLocation = location;
            this.cacheLocation(location);
            this.notifyLocationUpdates(location);
            resolve(location);
          } catch (error) {
            reject(error);
          }
        },
        async (error) => {
          console.error("Geolocation error:", error);

          // Try fallback methods
          if (this.config.fallbackToIP) {
            try {
              const ipLocation = await this.getLocationFromIP();
              resolve(ipLocation);
              return;
            } catch (ipError) {
              console.error("IP geolocation fallback failed:", ipError);
            }
          }

          // Return cached location if available
          if (
            this.currentLocation &&
            this.isLocationValid(this.currentLocation)
          ) {
            resolve(this.currentLocation);
            return;
          }

          this.notifyErrors(error);
          reject(this.enhanceGeolocationError(error));
        },
        options,
      );
    });
  }

  // Start watching position changes
  startWatchingPosition(): void {
    if (!this.isSupported() || this.watchId !== null) {
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: this.config.enableHighAccuracy,
      timeout: this.config.timeout,
      maximumAge: this.config.maximumAge,
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const location = await this.processPosition(position);
          this.currentLocation = location;
          this.cacheLocation(location);
          this.notifyLocationUpdates(location);
        } catch (error) {
          console.error("Watch position error:", error);
        }
      },
      (error) => {
        console.error("Watch position error:", error);
        this.notifyErrors(error);
      },
      options,
    );
  }

  // Stop watching position changes
  stopWatchingPosition(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Process raw position data
  private async processPosition(
    position: GeolocationPosition,
  ): Promise<Location> {
    const coordinates: Coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude || undefined,
      altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
      heading: position.coords.heading || undefined,
      speed: position.coords.speed || undefined,
    };

    // Get address from coordinates (reverse geocoding)
    const address = await this.reverseGeocode(coordinates);

    return {
      coordinates,
      address,
      timestamp: position.timestamp,
      source: "gps",
    };
  }

  // Reverse geocoding to get address from coordinates
  private async reverseGeocode(coordinates: Coordinates): Promise<Address> {
    try {
      // Using a free geocoding service (in production, use a proper service like Google Maps)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=en`,
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();

      return {
        street: data.locality || "",
        city: data.city || data.locality || "Unknown City",
        state: data.principalSubdivision || "Unknown State",
        country: data.countryName || "Unknown Country",
        postalCode: data.postcode || "",
        countryCode: data.countryCode || "XX",
      };
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);
      return {
        city: "Unknown City",
        state: "Unknown State",
        country: "Unknown Country",
        countryCode: "XX",
      };
    }
  }

  // Get location from IP address as fallback
  private async getLocationFromIP(): Promise<Location> {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) {
        throw new Error("IP geolocation service unavailable");
      }

      const data = await response.json();

      const coordinates: Coordinates = {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 10000, // IP location is less accurate
      };

      const address: Address = {
        city: data.city || "Unknown City",
        state: data.region || "Unknown State",
        country: data.country_name || "Unknown Country",
        postalCode: data.postal || "",
        countryCode: data.country_code || "XX",
      };

      const location: Location = {
        coordinates,
        address,
        timestamp: Date.now(),
        source: "network",
      };

      return location;
    } catch (error) {
      throw new Error("Failed to get location from IP");
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(
    point1: Coordinates,
    point2: Coordinates,
    unit: "km" | "miles" = "km",
  ): number {
    const R = unit === "km" ? 6371 : 3956; // Earth's radius in km or miles
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLng = this.deg2rad(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) *
        Math.cos(this.deg2rad(point2.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Calculate bearing between two points
  calculateBearing(point1: Coordinates, point2: Coordinates): number {
    const dLng = this.deg2rad(point2.longitude - point1.longitude);
    const lat1 = this.deg2rad(point1.latitude);
    const lat2 = this.deg2rad(point2.latitude);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    const bearing = Math.atan2(y, x);
    return ((bearing * 180) / Math.PI + 360) % 360; // Convert to degrees (0-360)
  }

  // Filter items by proximity
  filterByProximity<T extends { coordinates: Coordinates }>(
    items: T[],
    center: Coordinates,
    radiusKm: number,
  ): ProximityResult<T>[] {
    return items
      .map((item) => ({
        item,
        distance: this.calculateDistance(center, item.coordinates, "km"),
        bearing: this.calculateBearing(center, item.coordinates),
        coordinates: item.coordinates,
      }))
      .filter((result) => result.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  // Check if point is within radius
  isWithinRadius(
    point: Coordinates,
    center: Coordinates,
    radiusKm: number,
  ): boolean {
    const distance = this.calculateDistance(point, center, "km");
    return distance <= radiusKm;
  }

  // Enhanced error handling
  private enhanceGeolocationError(error: GeolocationPositionError): Error {
    let message = "Location access failed";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Location access denied by user";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable";
        break;
      case error.TIMEOUT:
        message = "Location request timed out";
        break;
    }

    return new Error(`${message}: ${error.message}`);
  }

  // Cache management
  private cacheLocation(location: Location): void {
    try {
      localStorage.setItem("cached_location", JSON.stringify(location));
    } catch (error) {
      console.warn("Failed to cache location:", error);
    }
  }

  private loadCachedLocation(): void {
    try {
      const cached = localStorage.getItem("cached_location");
      if (cached) {
        const location = JSON.parse(cached);
        if (this.isLocationValid(location)) {
          this.currentLocation = location;
        } else {
          localStorage.removeItem("cached_location");
        }
      }
    } catch (error) {
      console.warn("Failed to load cached location:", error);
      localStorage.removeItem("cached_location");
    }
  }

  private isLocationValid(location: Location): boolean {
    const now = Date.now();
    const age = now - location.timestamp;
    return age < this.config.cacheExpiry;
  }

  // Event listeners
  onLocationUpdate(callback: (location: Location) => void): void {
    this.locationUpdateCallbacks.push(callback);
  }

  onError(callback: (error: GeolocationPositionError) => void): void {
    this.errorCallbacks.push(callback);
  }

  private notifyLocationUpdates(location: Location): void {
    this.locationUpdateCallbacks.forEach((callback) => {
      try {
        callback(location);
      } catch (error) {
        console.error("Location update callback error:", error);
      }
    });
  }

  private notifyErrors(error: GeolocationPositionError): void {
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error("Error callback error:", callbackError);
      }
    });
  }

  // Get current cached location
  getCachedLocation(): Location | null {
    return this.currentLocation;
  }

  // Update configuration
  updateConfig(newConfig: Partial<GeolocationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Cleanup
  destroy(): void {
    this.stopWatchingPosition();
    this.locationUpdateCallbacks = [];
    this.errorCallbacks = [];
    this.currentLocation = null;
  }
}

export const geolocationService = GeolocationService.getInstance();
export default GeolocationService;
