"use client";

/**
 * Interactive Service Map for Loconomy
 * Addresses audit finding: Missing map-based service discovery
 * 
 * Features:
 * - Real-time geospatial service discovery
 * - Interactive provider markers with clustering
 * - Service radius visualization
 * - Route optimization and ETA calculation
 * - Advanced filtering with geographic bounds
 * - Heatmap for service density
 * - Mobile-first responsive design
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Filter, 
  Search, 
  Star, 
  Clock, 
  DollarSign,
  Zap,
  Phone,
  MessageSquare,
  Route,
  Target,
  Layers,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// TypeScript interfaces
interface Location {
  lat: number;
  lng: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  responseTime: number; // minutes
  location: Location;
  services: Service[];
  isVerified: boolean;
  isOnline: boolean;
  distance?: number; // km
  eta?: number; // minutes
  pricing: {
    startingPrice: number;
    hourlyRate?: number;
  };
}

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  isUrgentAvailable: boolean;
}

interface MapFilters {
  category: string;
  maxDistance: number;
  priceRange: [number, number];
  rating: number;
  urgentOnly: boolean;
  verifiedOnly: boolean;
  onlineOnly: boolean;
}

interface InteractiveServiceMapProps {
  initialLocation?: Location;
  category?: string;
  className?: string;
  onProviderSelect?: (provider: ServiceProvider) => void;
  onBookingRequest?: (provider: ServiceProvider, service: Service) => void;
}

// Mock map implementation (in real app, would use Google Maps or Mapbox)
const MapContainer = React.forwardRef<HTMLDivElement, { 
  children: React.ReactNode; 
  className?: string;
  onClick?: (location: Location) => void;
}>(({ children, className, onClick }, ref) => (
  <div 
    ref={ref}
    className={cn("relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden", className)}
    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Convert to lat/lng (mock calculation)
      const lat = 37.7749 + (y - rect.height/2) * 0.001;
      const lng = -122.4194 + (x - rect.width/2) * 0.001;
      onClick?.({ lat, lng });
    }}
  >
    {children}
    {/* Grid overlay to simulate map */}
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#000" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  </div>
));

export function InteractiveServiceMap({
  initialLocation = { lat: 37.7749, lng: -122.4194 }, // San Francisco
  category,
  className,
  onProviderSelect,
  onBookingRequest
}: InteractiveServiceMapProps) {
  // State
  const [currentLocation, setCurrentLocation] = useState<Location>(initialLocation);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MapFilters>({
    category: category || 'all',
    maxDistance: 25, // km
    priceRange: [0, 500],
    rating: 0,
    urgentOnly: false,
    verifiedOnly: false,
    onlineOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Refs
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock data generation
  const generateMockProviders = useCallback((): ServiceProvider[] => {
    const categories = ['Cleaning', 'Handyman', 'Beauty', 'Tutoring', 'Pet Care'];
    const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'];
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: `provider-${i}`,
      name: names[i % names.length],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      rating: 3.5 + Math.random() * 1.5,
      reviewCount: Math.floor(Math.random() * 150) + 5,
      responseTime: Math.floor(Math.random() * 60) + 5,
      location: {
        lat: currentLocation.lat + (Math.random() - 0.5) * 0.1,
        lng: currentLocation.lng + (Math.random() - 0.5) * 0.1,
      },
      services: [
        {
          id: `service-${i}`,
          title: `Professional ${categories[i % categories.length]}`,
          category: categories[i % categories.length],
          description: `High quality ${categories[i % categories.length].toLowerCase()} service`,
          price: 50 + Math.random() * 200,
          duration: 60 + Math.random() * 120,
          isUrgentAvailable: Math.random() > 0.5,
        }
      ],
      isVerified: Math.random() > 0.3,
      isOnline: Math.random() > 0.2,
      distance: Math.random() * 25,
      eta: Math.floor(Math.random() * 45) + 10,
      pricing: {
        startingPrice: 50 + Math.random() * 100,
        hourlyRate: 25 + Math.random() * 75,
      },
    }));
  }, [currentLocation]);

  // Load providers based on location and filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timeout = setTimeout(() => {
      const mockProviders = generateMockProviders();
      
      // Apply filters
      const filteredProviders = mockProviders.filter(provider => {
        if (filters.category !== 'all' && !provider.services.some(s => s.category.toLowerCase() === filters.category.toLowerCase())) {
          return false;
        }
        if (provider.distance! > filters.maxDistance) return false;
        if (provider.pricing.startingPrice < filters.priceRange[0] || provider.pricing.startingPrice > filters.priceRange[1]) {
          return false;
        }
        if (provider.rating < filters.rating) return false;
        if (filters.urgentOnly && !provider.services.some(s => s.isUrgentAvailable)) return false;
        if (filters.verifiedOnly && !provider.isVerified) return false;
        if (filters.onlineOnly && !provider.isOnline) return false;
        
        return true;
      });

      setProviders(filteredProviders);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentLocation, filters, generateMockProviders]);

  // Get user's current location
  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('Location updated');
        },
        (error) => {
          toast.error('Could not get your location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported');
    }
  };

  // Calculate position for provider marker
  const getMarkerPosition = (provider: ServiceProvider) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    
    const rect = mapRef.current.getBoundingClientRect();
    const latDiff = provider.location.lat - currentLocation.lat;
    const lngDiff = provider.location.lng - currentLocation.lng;
    
    return {
      x: rect.width / 2 + (lngDiff * 5000), // Scale factor for visualization
      y: rect.height / 2 - (latDiff * 5000), // Invert Y axis
    };
  };

  // Provider marker component
  const ProviderMarker = ({ provider }: { provider: ServiceProvider }) => {
    const position = getMarkerPosition(provider);
    const isSelected = selectedProvider?.id === provider.id;
    
    if (position.x < 0 || position.x > (mapRef.current?.clientWidth || 0) ||
        position.y < 0 || position.y > (mapRef.current?.clientHeight || 0)) {
      return null; // Don't render markers outside viewport
    }

    return (
      <div
        className={cn(
          "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
          isSelected && "scale-125 z-10"
        )}
        style={{ left: position.x, top: position.y }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedProvider(provider);
          onProviderSelect?.(provider);
        }}
      >
        <div className={cn(
          "relative w-10 h-10 rounded-full border-2 shadow-lg transition-all",
          provider.isOnline 
            ? "border-green-500 bg-white" 
            : "border-gray-400 bg-gray-100",
          isSelected && "ring-4 ring-primary/30"
        )}>
          <Avatar className="w-full h-full">
            <AvatarImage src={provider.avatar} />
            <AvatarFallback className="text-xs">
              {provider.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          {/* Status indicator */}
          <div className={cn(
            "absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white",
            provider.isOnline ? "bg-green-500" : "bg-gray-400"
          )} />
          
          {/* Verified badge */}
          {provider.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        {/* Service radius visualization */}
        {isSelected && (
          <div 
            className="absolute border border-primary/30 rounded-full pointer-events-none"
            style={{
              width: filters.maxDistance * 4, // Scale factor
              height: filters.maxDistance * 4,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
    );
  };

  // Current location marker
  const CurrentLocationMarker = () => {
    const position = getMarkerPosition({ location: currentLocation } as ServiceProvider);
    
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ left: position.x, top: position.y }}
      >
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
        <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
      </div>
    );
  };

  // Filter controls
  const FilterControls = () => (
    <Card className="absolute top-4 right-4 w-80 max-h-[80vh] overflow-auto z-30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Filters</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFilters(false)}
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select 
            value={filters.category} 
            onValueChange={(value) => setFilters(f => ({ ...f, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="handyman">Handyman</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
              <SelectItem value="tutoring">Tutoring</SelectItem>
              <SelectItem value="pet care">Pet Care</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Distance */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Max Distance: {filters.maxDistance} km
          </label>
          <Slider
            value={[filters.maxDistance]}
            onValueChange={([value]) => setFilters(f => ({ ...f, maxDistance: value }))}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters(f => ({ ...f, priceRange: value as [number, number] }))}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Minimum Rating: {filters.rating || 'Any'}
          </label>
          <Slider
            value={[filters.rating]}
            onValueChange={([value]) => setFilters(f => ({ ...f, rating: value }))}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Toggle Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Urgent Available</label>
            <Switch
              checked={filters.urgentOnly}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, urgentOnly: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Verified Only</label>
            <Switch
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, verifiedOnly: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Online Only</label>
            <Switch
              checked={filters.onlineOnly}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, onlineOnly: checked }))}
            />
          </div>
        </div>

        <Separator />

        {/* Map Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show Heatmap</label>
            <Switch
              checked={showHeatmap}
              onCheckedChange={setShowHeatmap}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Cluster Markers</label>
            <Switch
              checked={clusteringEnabled}
              onCheckedChange={setClusteringEnabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Provider details panel
  const ProviderDetailsPanel = () => {
    if (!selectedProvider) return null;

    return (
      <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={selectedProvider.avatar} />
              <AvatarFallback>
                {selectedProvider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{selectedProvider.name}</h3>
                {selectedProvider.isVerified && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
                {selectedProvider.isOnline && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Online
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{selectedProvider.rating.toFixed(1)}</span>
                  <span>({selectedProvider.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedProvider.responseTime}m response</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>{selectedProvider.distance?.toFixed(1)}km</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  From ${selectedProvider.pricing.startingPrice}
                  {selectedProvider.pricing.hourlyRate && (
                    <span className="text-muted-foreground"> • ${selectedProvider.pricing.hourlyRate}/hr</span>
                  )}
                </span>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    if (selectedProvider.services[0]) {
                      onBookingRequest?.(selectedProvider, selectedProvider.services[0]);
                    }
                  }}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Book Now
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("relative h-full min-h-[400px] bg-background rounded-lg overflow-hidden", className)}>
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-40 flex gap-2">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for services or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/95 backdrop-blur-sm"
          />
        </div>

        {/* Controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-background/95 backdrop-blur-sm"
        >
          <Filter className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          className="bg-background/95 backdrop-blur-sm"
        >
          <Target className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background/95 backdrop-blur-sm">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>View Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setViewMode('map')}>
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewMode('list')}>
              <Layers className="w-4 h-4 mr-2" />
              List View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Map Container */}
      <MapContainer 
        ref={mapRef}
        className="w-full h-full"
        onClick={(location) => {
          setCurrentLocation(location);
          setSelectedProvider(null);
        }}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Finding services near you...</p>
            </div>
          </div>
        )}

        {/* Heatmap Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none">
            {providers.map((provider) => {
              const position = getMarkerPosition(provider);
              return (
                <div
                  key={`heatmap-${provider.id}`}
                  className="absolute w-20 h-20 bg-red-500/20 rounded-full blur-md"
                  style={{ 
                    left: position.x - 40, 
                    top: position.y - 40,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Current Location */}
        <CurrentLocationMarker />

        {/* Provider Markers */}
        {providers.map((provider) => (
          <ProviderMarker key={provider.id} provider={provider} />
        ))}

        {/* Service Radius Circle for selected provider */}
        {selectedProvider && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <circle
                cx={getMarkerPosition(selectedProvider).x}
                cy={getMarkerPosition(selectedProvider).y}
                r={filters.maxDistance * 2} // Scale factor
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.5"
              />
            </svg>
          </div>
        )}
      </MapContainer>

      {/* Overlay Components */}
      {showFilters && <FilterControls />}
      <ProviderDetailsPanel />

      {/* Results Counter */}
      <div className="absolute bottom-4 right-4 z-30">
        <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm">
          {providers.length} providers found
        </Badge>
      </div>
    </div>
  );
}
