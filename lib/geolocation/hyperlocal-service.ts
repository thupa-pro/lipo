import { geolocationService } from "./geolocation-service";
import type {
  Coordinates,
  Location,
  HyperlocalOptions,
  ProviderWithLocation,
  ProximityResult,
} from "./types";

interface HyperlocalMatch {
  provider: ProviderWithLocation;
  distance: number;
  relevanceScore: number;
  urgencyScore: number;
  availabilityScore: number;
  timeToArrival: number;
  hyperlocalFactors: {
    neighborhoodMatch: number;
    localExperience: number;
    responseTime: number;
    proximityBoost: number;
  };
}

interface DiscoveryFilters {
  category?: string;
  urgency?: "low" | "medium" | "high" | "emergency";
  priceRange?: { min: number; max: number };
  rating?: number;
  availability?: "now" | "today" | "this_week" | "flexible";
  radius?: number;
  verified?: boolean;
}

class HyperlocalService {
  private static instance: HyperlocalService;
  private currentLocation: Location | null = null;
  private discoveryCallbacks: ((results: HyperlocalMatch[]) => void)[] = [];
  private locationWatchActive = false;

  private defaultOptions: HyperlocalOptions = {
    maxRadius: 25, // km
    preferredRadius: 5, // km
    urgencyBoost: true,
    timeOfDayWeighting: true,
    trafficAwareness: true,
    personalPreferences: true,
  };

  private constructor() {
    this.initializeLocationTracking();
  }

  static getInstance(): HyperlocalService {
    if (!HyperlocalService.instance) {
      HyperlocalService.instance = new HyperlocalService();
    }
    return HyperlocalService.instance;
  }

  private async initializeLocationTracking(): Promise<void> {
    // Subscribe to location updates
    geolocationService.onLocationUpdate((location) => {
      this.currentLocation = location;
      this.notifyLocationChange();
    });

    // Try to get initial location
    try {
      const location = geolocationService.getCachedLocation();
      if (location) {
        this.currentLocation = location;
      } else {
        this.currentLocation = await geolocationService.getCurrentPosition();
      }
    } catch (error) {
      console.warn("Failed to get initial location:", error);
    }
  }

  async startHyperlocalDiscovery(
    providers: ProviderWithLocation[],
    filters: DiscoveryFilters = {},
    options: Partial<HyperlocalOptions> = {},
  ): Promise<HyperlocalMatch[]> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    if (!this.currentLocation) {
      try {
        this.currentLocation = await geolocationService.getCurrentPosition();
      } catch (error) {
        throw new Error("Location access required for hyperlocal discovery");
      }
    }

    // Start watching location if not already active
    if (!this.locationWatchActive) {
      geolocationService.startWatchingPosition();
      this.locationWatchActive = true;
    }

    return this.performHyperlocalMatching(providers, filters, mergedOptions);
  }

  private async performHyperlocalMatching(
    providers: ProviderWithLocation[],
    filters: DiscoveryFilters,
    options: HyperlocalOptions,
  ): Promise<HyperlocalMatch[]> {
    if (!this.currentLocation) {
      throw new Error("Current location not available");
    }

    const userCoords = this.currentLocation.coordinates;

    // Filter providers by basic criteria first
    let filteredProviders = this.applyBasicFilters(providers, filters);

    // Filter by distance
    const maxRadius = filters.radius || options.maxRadius;
    filteredProviders = filteredProviders.filter((provider) => {
      const distance = geolocationService.calculateDistance(
        userCoords,
        provider.coordinates,
        "km",
      );
      return distance <= maxRadius;
    });

    // Calculate hyperlocal matches
    const matches: HyperlocalMatch[] = [];

    for (const provider of filteredProviders) {
      const match = await this.calculateHyperlocalMatch(
        provider,
        userCoords,
        filters,
        options,
      );
      matches.push(match);
    }

    // Sort by overall relevance score
    matches.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return matches;
  }

  private applyBasicFilters(
    providers: ProviderWithLocation[],
    filters: DiscoveryFilters,
  ): ProviderWithLocation[] {
    return providers.filter((provider) => {
      // Category filter
      if (filters.category && provider.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        if (provider.hourlyRate < min || provider.hourlyRate > max) {
          return false;
        }
      }

      // Rating filter
      if (filters.rating && provider.rating < filters.rating) {
        return false;
      }

      // Verified filter
      if (filters.verified && !provider.verified) {
        return false;
      }

      // Availability filter
      if (filters.availability) {
        switch (filters.availability) {
          case "now":
            return provider.isAvailableNow === true;
          case "today":
            return (
              provider.availability.includes("today") || provider.isAvailableNow
            );
          case "this_week":
            return (
              provider.availability.includes("week") ||
              provider.availability.includes("today") ||
              provider.isAvailableNow
            );
          default:
            break;
        }
      }

      return true;
    });
  }

  private async calculateHyperlocalMatch(
    provider: ProviderWithLocation,
    userCoords: Coordinates,
    filters: DiscoveryFilters,
    options: HyperlocalOptions,
  ): Promise<HyperlocalMatch> {
    const distance = geolocationService.calculateDistance(
      userCoords,
      provider.coordinates,
      "km",
    );

    // Calculate individual scoring components
    const proximityScore = this.calculateProximityScore(distance, options);
    const urgencyScore = this.calculateUrgencyScore(provider, filters, options);
    const availabilityScore = this.calculateAvailabilityScore(
      provider,
      filters,
    );
    const qualityScore = this.calculateQualityScore(provider);
    const hyperlocalFactors = this.calculateHyperlocalFactors(
      provider,
      distance,
    );

    // Calculate overall relevance score
    let relevanceScore = 0;
    relevanceScore += proximityScore * 0.3;
    relevanceScore += urgencyScore * 0.2;
    relevanceScore += availabilityScore * 0.2;
    relevanceScore += qualityScore * 0.15;
    relevanceScore += hyperlocalFactors.neighborhoodMatch * 0.15;

    // Apply time-based weighting if enabled
    if (options.timeOfDayWeighting) {
      const timeBoost = this.getTimeOfDayBoost();
      relevanceScore *= timeBoost;
    }

    // Estimate time to arrival
    const timeToArrival = await this.estimateTimeToArrival(
      provider,
      distance,
      options,
    );

    return {
      provider,
      distance,
      relevanceScore: Math.round(relevanceScore * 100) / 100,
      urgencyScore,
      availabilityScore,
      timeToArrival,
      hyperlocalFactors,
    };
  }

  private calculateProximityScore(
    distance: number,
    options: HyperlocalOptions,
  ): number {
    const { preferredRadius, maxRadius } = options;

    if (distance <= preferredRadius) {
      // Perfect score for preferred radius
      return 100;
    } else if (distance <= maxRadius) {
      // Linear decrease from preferred to max radius
      const ratio = (maxRadius - distance) / (maxRadius - preferredRadius);
      return Math.max(0, ratio * 100);
    }

    return 0;
  }

  private calculateUrgencyScore(
    provider: ProviderWithLocation,
    filters: DiscoveryFilters,
    options: HyperlocalOptions,
  ): number {
    if (!filters.urgency || !options.urgencyBoost) {
      return 50; // Neutral score
    }

    let score = 50;

    // Boost based on urgency level
    switch (filters.urgency) {
      case "emergency":
        score = 100;
        break;
      case "high":
        score = 85;
        break;
      case "medium":
        score = 65;
        break;
      case "low":
        score = 40;
        break;
    }

    // Adjust based on provider's urgency capabilities
    if (
      provider.urgencyTags?.includes("emergency") &&
      filters.urgency === "emergency"
    ) {
      score *= 1.2;
    }
    if (
      provider.isAvailableNow &&
      ["emergency", "high"].includes(filters.urgency)
    ) {
      score *= 1.1;
    }

    return Math.min(100, score);
  }

  private calculateAvailabilityScore(
    provider: ProviderWithLocation,
    filters: DiscoveryFilters,
  ): number {
    let score = 50;

    if (provider.isAvailableNow) {
      score += 30;
    }

    // Parse response time for scoring
    const responseTime = provider.responseTime.toLowerCase();
    if (
      responseTime.includes("instant") ||
      responseTime.includes("immediate")
    ) {
      score += 20;
    } else if (responseTime.includes("minute")) {
      score += 15;
    } else if (responseTime.includes("hour")) {
      score += 10;
    }

    // Match with requested availability
    if (filters.availability) {
      const availability = provider.availability.toLowerCase();
      switch (filters.availability) {
        case "now":
          if (provider.isAvailableNow) score += 20;
          break;
        case "today":
          if (availability.includes("today") || provider.isAvailableNow)
            score += 15;
          break;
        case "this_week":
          if (availability.includes("week")) score += 10;
          break;
      }
    }

    return Math.min(100, score);
  }

  private calculateQualityScore(provider: ProviderWithLocation): number {
    let score = 0;

    // Rating component (0-50 points)
    score += (provider.rating / 5) * 50;

    // Review count component (0-20 points)
    const reviewBonus = Math.min(20, (provider.reviews / 100) * 20);
    score += reviewBonus;

    // Completed jobs component (0-20 points)
    const jobsBonus = Math.min(20, (provider.completedJobs / 500) * 20);
    score += jobsBonus;

    // Verification bonus (0-10 points)
    if (provider.verified) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private calculateHyperlocalFactors(
    provider: ProviderWithLocation,
    distance: number,
  ): HyperlocalMatch["hyperlocalFactors"] {
    // Neighborhood match based on distance zones
    let neighborhoodMatch = 0;
    if (distance <= 2)
      neighborhoodMatch = 100; // Same neighborhood
    else if (distance <= 5)
      neighborhoodMatch = 80; // Adjacent neighborhoods
    else if (distance <= 10)
      neighborhoodMatch = 60; // Same district
    else if (distance <= 15)
      neighborhoodMatch = 40; // Same city area
    else neighborhoodMatch = 20; // Same city/region

    // Local experience based on completed jobs and time in area
    const localExperience = Math.min(100, (provider.completedJobs / 200) * 100);

    // Response time scoring
    const responseTimeText = provider.responseTime.toLowerCase();
    let responseTime = 50;
    if (responseTimeText.includes("instant")) responseTime = 100;
    else if (responseTimeText.includes("5 min")) responseTime = 90;
    else if (responseTimeText.includes("15 min")) responseTime = 80;
    else if (responseTimeText.includes("30 min")) responseTime = 70;
    else if (responseTimeText.includes("1 hour")) responseTime = 60;

    // Proximity boost for very close providers
    const proximityBoost =
      distance <= 1 ? 100 : Math.max(0, 100 - distance * 10);

    return {
      neighborhoodMatch,
      localExperience,
      responseTime,
      proximityBoost,
    };
  }

  private getTimeOfDayBoost(): number {
    // Return neutral boost on server-side to prevent hydration mismatch
    if (typeof window === "undefined") return 1.0;

    const hour = new Date().getHours();

    // Peak hours: 9-11 AM and 2-5 PM (1.1x boost)
    if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 17)) {
      return 1.1;
    }

    // Off-peak hours: 6-8 AM, 12-1 PM, 6-8 PM (1.05x boost)
    if (
      (hour >= 6 && hour <= 8) ||
      (hour >= 12 && hour <= 13) ||
      (hour >= 18 && hour <= 20)
    ) {
      return 1.05;
    }

    // Early morning/late evening (0.95x)
    if (hour < 6 || hour > 22) {
      return 0.95;
    }

    return 1.0; // Normal hours
  }

  private async estimateTimeToArrival(
    provider: ProviderWithLocation,
    distance: number,
    options: HyperlocalOptions,
  ): Promise<number> {
    // Base travel time calculation (assuming 30 km/h average speed in urban areas)
    let travelTime = (distance / 30) * 60; // minutes

    // Add provider response time
    const responseTime = this.parseResponseTime(provider.responseTime);

    // Add service radius consideration
    if (provider.serviceRadius && distance > provider.serviceRadius) {
      travelTime *= 1.2; // 20% penalty for being outside normal service area
    }

    // Traffic awareness adjustment
    if (options.trafficAwareness) {
      const trafficMultiplier = this.getTrafficMultiplier();
      travelTime *= trafficMultiplier;
    }

    return Math.round(responseTime + travelTime);
  }

  private parseResponseTime(responseTimeText: string): number {
    const text = responseTimeText.toLowerCase();

    if (text.includes("instant") || text.includes("immediate")) return 0;
    if (text.includes("5 min")) return 5;
    if (text.includes("15 min")) return 15;
    if (text.includes("30 min")) return 30;
    if (text.includes("1 hour")) return 60;
    if (text.includes("2 hour")) return 120;

    return 30; // Default assumption
  }

  private getTrafficMultiplier(): number {
    // Return neutral multiplier on server-side to prevent hydration mismatch
    if (typeof window === "undefined") return 1.0;

    const hour = new Date().getHours();
    const day = new Date().getDay();

    // Weekend traffic is generally lighter
    if (day === 0 || day === 6) {
      return 0.9;
    }

    // Rush hour traffic
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 1.5;
    }

    // Moderate traffic
    if ((hour >= 10 && hour <= 16) || (hour >= 20 && hour <= 22)) {
      return 1.2;
    }

    return 1.0; // Normal traffic
  }

  // Real-time discovery updates
  onDiscoveryUpdate(callback: (results: HyperlocalMatch[]) => void): void {
    this.discoveryCallbacks.push(callback);
  }

  private notifyLocationChange(): void {
    // Trigger discovery updates when location changes significantly
    this.discoveryCallbacks.forEach((callback) => {
      try {
        // Note: In practice, you'd re-run discovery with cached parameters
        // callback(updatedResults);
      } catch (error) {
        console.error("Discovery callback error:", error);
      }
    });
  }

  // Get current location for external use
  getCurrentLocation(): Location | null {
    return this.currentLocation;
  }

  // Update discovery options
  updateOptions(newOptions: Partial<HyperlocalOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...newOptions };
  }

  // Stop location tracking
  stopDiscovery(): void {
    if (this.locationWatchActive) {
      geolocationService.stopWatchingPosition();
      this.locationWatchActive = false;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopDiscovery();
    this.discoveryCallbacks = [];
    this.currentLocation = null;
  }
}

export const hyperlocalService = HyperlocalService.getInstance();
export default HyperlocalService;
export type { HyperlocalMatch, DiscoveryFilters };
