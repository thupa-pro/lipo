export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  countryCode: string;
}

export interface Location {
  coordinates: Coordinates;
  address: Address;
  timestamp: number;
  source: "gps" | "network" | "manual" | "cache";
}

export interface GeolocationConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  fallbackToIP: boolean;
  cacheExpiry: number;
}

export interface RadiusFilter {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  unit: "km" | "miles";
}

export interface ProximityResult<T> {
  item: T;
  distance: number;
  bearing?: number;
  coordinates: Coordinates;
}

export interface LocationPermission {
  state: "granted" | "denied" | "prompt" | "unknown";
  canRequest: boolean;
  message?: string;
}

export interface HyperlocalOptions {
  maxRadius: number;
  preferredRadius: number;
  urgencyBoost: boolean;
  timeOfDayWeighting: boolean;
  trafficAwareness: boolean;
  personalPreferences: boolean;
}

export interface ProviderWithLocation {
  id: number;
  name: string;
  service: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  hourlyRate: number;
  location: string;
  coordinates: Coordinates;
  avatar: string;
  badges: string[];
  completedJobs: number;
  responseTime: string;
  availability: string;
  description: string;
  verified: boolean;
  urgencyTags?: string[];
  serviceRadius?: number;
  travelTime?: number;
  isAvailableNow?: boolean;
  hyperlocalScore?: number;
}
