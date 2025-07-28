"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Map, List, SlidersHorizontal, Heart, X, ChevronDown, Search, Star, MapPin, Clock, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SmartListingCard from "@/components/ai/SmartListingCard";
import AgentCommandInput from "@/components/ai/AgentCommandInput";
import { InteractiveServiceMap } from "@/components/maps/InteractiveServiceMap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SearchFilters {
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  distance: number;
  availability: string;
  verified: boolean;
  sortBy: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  distance: number;
  responseTime: string;
  availability: string;
  images: string[];
  tags: string[];
  provider: {
    id: string;
    name: string;
    image?: string;
    verified: boolean;
    rating: number;
  };
  bookingCount: number;
  completedJobs: number;
  isNew: boolean;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    category: "all",
    location: "",
    priceRange: [0, 500],
    rating: 0,
    distance: 25,
    availability: "all",
    verified: false,
    sortBy: "relevance"
  });

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Professional House Cleaning",
      description: "Deep cleaning service with eco-friendly products. Trusted by hundreds of satisfied customers.",
      price: 120,
      rating: 4.9,
      reviewCount: 147,
      location: "Downtown San Francisco",
      distance: 2.3,
      responseTime: "Usually responds in 30 minutes",
      availability: "Available Today",
      images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400", "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400"],
      tags: ["Eco-friendly", "Same Day", "Insured"],
      provider: {
        id: "p1",
        name: "Sarah Johnson",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        verified: true,
        rating: 4.9,
      },
      bookingCount: 234,
      completedJobs: 1247,
      isNew: false,
    },
    {
      id: "2",
      title: "Expert Handyman Services",
      description: "Licensed contractor for all your home repair needs. No job too small or too big.",
      price: 85,
      rating: 4.7,
      reviewCount: 89,
      location: "Mission District",
      distance: 4.1,
      responseTime: "Usually responds in 1 hour",
      availability: "Available Tomorrow",
      images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400"],
      tags: ["Licensed", "Insured", "Emergency"],
      provider: {
        id: "p2",
        name: "Mike Chen",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        verified: true,
        rating: 4.7,
      },
      bookingCount: 156,
      completedJobs: 892,
      isNew: false,
    },
    {
      id: "3",
      title: "Personal Fitness Training",
      description: "Certified personal trainer specializing in weight loss and strength training.",
      price: 95,
      rating: 4.8,
      reviewCount: 73,
      location: "Castro District",
      distance: 3.7,
      responseTime: "Usually responds in 45 minutes",
      availability: "Available This Week",
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"],
      tags: ["Certified", "Weight Loss", "Nutrition"],
      provider: {
        id: "p3",
        name: "Elena Rodriguez",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
        verified: false,
        rating: 4.8,
      },
      bookingCount: 89,
      completedJobs: 341,
      isNew: true,
    },
  ];

  const performSearch = useCallback(async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter mock results based on current filters
    let filteredResults = mockResults.filter(result => {
      if (filters.category !== "all" && !result.title.toLowerCase().includes(filters.category.toLowerCase())) {
        return false;
      }
      if (filters.rating > 0 && result.rating < filters.rating) {
        return false;
      }
      if (result.price < filters.priceRange[0] || result.price > filters.priceRange[1]) {
        return false;
      }
      if (filters.distance < result.distance) {
        return false;
      }
      if (filters.verified && !result.provider.verified) {
        return false;
      }
      if (searchQuery && !result.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !result.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

    // Sort results
    switch (filters.sortBy) {
      case "price_low":
        filteredResults.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filteredResults.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case "distance":
        filteredResults.sort((a, b) => a.distance - b.distance);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setResults(filteredResults);
    setLoading(false);
  }, [searchQuery, filters]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Could not get location:", error);
        }
      );
    }
  }, []);

  const handleSaveSearch = () => {
    if (searchQuery && !savedSearches.includes(searchQuery)) {
      setSavedSearches([...savedSearches, searchQuery]);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cleaning", label: "Cleaning" },
    { value: "handyman", label: "Handyman" },
    { value: "fitness", label: "Fitness" },
    { value: "tutoring", label: "Tutoring" },
    { value: "beauty", label: "Beauty" },
    { value: "pet-care", label: "Pet Care" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="What service are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {Object.values(filters).some(v => 
                  v !== "" && v !== "all" && v !== 0 && v !== false && 
                  !Array.isArray(v) || (Array.isArray(v) && (v[0] !== 0 || v[1] !== 500))
                ) && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>

              <div className="flex items-center border border-slate-300 rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="rounded-l-none"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {savedSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(search)}
                className="text-xs"
              >
                {search}
              </Button>
            ))}
            {userLocation && (
              <Button variant="outline" size="sm" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                Near your location
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters({
                          category: "all",
                          location: "",
                          priceRange: [0, 500],
                          rating: 0,
                          distance: 25,
                          availability: "all",
                          verified: false,
                          sortBy: "relevance"
                        })}
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({...filters, priceRange: value as [number, number]})}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Minimum Rating: {filters.rating > 0 ? filters.rating : "Any"}
                      </label>
                      <Slider
                        value={[filters.rating]}
                        onValueChange={([value]) => setFilters({...filters, rating: value})}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Distance: {filters.distance} km
                      </label>
                      <Slider
                        value={[filters.distance]}
                        onValueChange={([value]) => setFilters({...filters, distance: value})}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Verified Only */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Verified Providers Only</label>
                      <Switch
                        checked={filters.verified}
                        onCheckedChange={(checked) => setFilters({...filters, verified: checked})}
                      />
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="price_low">Price: Low to High</SelectItem>
                          <SelectItem value="price_high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="distance">Closest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {loading ? "Searching..." : `${results.length} Services Found`}
                </h2>
                {searchQuery && (
                  <p className="text-slate-600 dark:text-slate-400">
                    Results for "{searchQuery}"
                    <button
                      onClick={handleSaveSearch}
                      className="ml-2 text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      Save this search
                    </button>
                  </p>
                )}
              </div>

              <AgentCommandInput 
                placeholder="Ask AI to help find services..."
                onSubmit={(command) => {
                  console.log("AI Command:", command);
                }}
                className="w-64"
              />
            </div>

            {/* View Toggle Content */}
            {viewMode === "list" ? (
              <div className="space-y-6">
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : results.length > 0 ? (
                  // Search Results
                  results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <SmartListingCard
                        title={result.title}
                        description={result.description}
                        price={result.price}
                        rating={result.rating}
                        reviewCount={result.reviewCount}
                        provider={result.provider}
                        images={result.images}
                        tags={result.tags}
                        distance={result.distance}
                        responseTime={result.responseTime}
                        availability={result.availability}
                        isNew={result.isNew}
                      />
                    </motion.div>
                  ))
                ) : (
                  // No Results
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No services found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Try adjusting your search criteria or explore different categories.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({
                          category: "all",
                          location: "",
                          priceRange: [0, 500],
                          rating: 0,
                          distance: 25,
                          availability: "all",
                          verified: false,
                          sortBy: "relevance"
                        });
                      }}
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                  </motion.div>
                )}
              </div>
            ) : (
              // Map View
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-[600px]">
                  <CardContent className="p-0 h-full">
                    <InteractiveServiceMap
                      className="w-full h-full rounded-lg"
                      category={filters.category === 'all' ? undefined : filters.category}
                      initialLocation={userLocation || undefined}
                      onProviderSelect={(provider) => {
                        console.log('Selected provider:', provider);
                      }}
                      onBookingRequest={(provider, service) => {
                        console.log('Booking request:', provider, service);
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
