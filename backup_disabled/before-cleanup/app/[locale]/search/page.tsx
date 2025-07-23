"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Filter,
  Map,
  List,
  SlidersHorizontal,
  Star,
  Clock,
  DollarSign,
  Shield,
  Zap,
  Heart,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SmartListingCard from "@/components/ai/SmartListingCard";
import AgentCommandInput from "@/components/ai/AgentCommandInput";

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
  isTrending: boolean;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    category: "all",
    location: "",
    priceRange: [0, 500],
    rating: 0,
    distance: 25,
    availability: "all",
    verified: false,
    sortBy: "relevance",
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cleaning", label: "🧹 Cleaning" },
    { value: "plumbing", label: "🔧 Plumbing" },
    { value: "electrical", label: "⚡ Electrical" },
    { value: "handyman", label: "🔨 Handyman" },
    { value: "gardening", label: "🌱 Gardening" },
    { value: "painting", label: "🎨 Painting" },
    { value: "tutoring", label: "📚 Tutoring" },
    { value: "fitness", label: "💪 Fitness" },
    { value: "beauty", label: "💄 Beauty" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "rating", label: "Highest Rated" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "distance", label: "Nearest First" },
    { value: "newest", label: "Newest First" },
  ];

  // Get user's current location
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
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Professional House Cleaning",
      description: "Deep cleaning service for your home with eco-friendly products. Reliable, thorough, and affordable.",
      price: 75,
      rating: 4.9,
      reviewCount: 127,
      location: "Downtown",
      distance: 2.3,
      responseTime: "15",
      availability: "Today",
      images: ["/api/placeholder/300/200"],
      tags: ["eco-friendly", "insured", "same-day"],
      provider: {
        id: "p1",
        name: "Sarah Johnson",
        image: "/api/placeholder/40/40",
        verified: true,
        rating: 4.9,
      },
      bookingCount: 45,
      completedJobs: 200,
      isNew: false,
      isTrending: true,
    },
    {
      id: "2",
      title: "Emergency Plumbing Services",
      description: "24/7 emergency plumbing repairs. Licensed, insured, and ready to help with any plumbing emergency.",
      price: 125,
      rating: 4.8,
      reviewCount: 89,
      location: "Midtown",
      distance: 1.8,
      responseTime: "30",
      availability: "24/7",
      images: ["/api/placeholder/300/200"],
      tags: ["24/7", "licensed", "emergency"],
      provider: {
        id: "p2",
        name: "Mike's Plumbing",
        image: "/api/placeholder/40/40",
        verified: true,
        rating: 4.8,
      },
      bookingCount: 32,
      completedJobs: 150,
      isNew: false,
      isTrending: false,
    },
    {
      id: "3",
      title: "Certified Electrician",
      description: "Electrical, installations, repairs, and maintenance. Safety-first approach with competitive pricing.",
      price: 95,
      rating: 4.7,
      reviewCount: 56,
      location: "Uptown",
      distance: 3.1,
      responseTime: "45",
      availability: "Tomorrow",
      images: ["/api/placeholder/300/200"],
      tags: ["certified", "safety-first", "warranty"],
      provider: {
        id: "p3",
        name: "Power Solutions",
        image: "/api/placeholder/40/40",
        verified: true,
        rating: 4.7,
      },
      bookingCount: 28,
      completedJobs: 85,
      isNew: true,
      isTrending: false,
    },
  ];

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply filters to mock results
      let filteredResults = [...mockResults];
      
      if (filters.category !== "all") {
        filteredResults = filteredResults.filter(result => 
          result.title.toLowerCase().includes(filters.category)
        );
      }
      
      if (filters.rating > 0) {
        filteredResults = filteredResults.filter(result => result.rating >= filters.rating);
      }
      
      if (filters.verified) {
        filteredResults = filteredResults.filter(result => result.provider.verified);
      }
      
      // Sort results
      switch (filters.sortBy) {
        case "rating":
          filteredResults.sort((a, b) => b.rating - a.rating);
          break;
        case "price_low":
          filteredResults.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          filteredResults.sort((a, b) => b.price - a.price);
          break;
        case "distance":
          filteredResults.sort((a, b) => a.distance - b.distance);
          break;
        default:
          // Keep relevance order
          break;
      }
      
      setResults(filteredResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      location: "",
      priceRange: [0, 500],
      rating: 0,
      distance: 25,
      availability: "all",
      verified: false,
      sortBy: "relevance",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-2xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Find Local Services on Loconomy
          </h1>
          <p className="text-muted-foreground">
            Discover trusted providers in your area with AI-powered matching
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <AgentCommandInput
                placeholder="Search for services... or try '/find cleaning'"
                currentPage="search"
                className="h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {Object.values(filters).some(v => 
                v !== "all" && v !== "" && v !== 0 && v !== false && 
                !(Array.isArray(v) && v[0] === 0 && v[1] === 500)
              ) && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-10"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="h-10"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Search Filters</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) => handleFilterChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => handleFilterChange("priceRange", value)}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    {/* Minimum Rating */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Minimum Rating: {filters.rating || "Any"}⭐
                      </label>
                      <Slider
                        value={[filters.rating]}
                        onValueChange={([value]) => handleFilterChange("rating", value)}
                        max={5}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Distance */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Distance: {filters.distance} miles
                      </label>
                      <Slider
                        value={[filters.distance]}
                        onValueChange={([value]) => handleFilterChange("distance", value)}
                        max={50}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Verified Only */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verified"
                        checked={filters.verified}
                        onCheckedChange={(checked) => handleFilterChange("verified", checked)}
                      />
                      <label htmlFor="verified" className="text-sm font-medium">
                        Verified providers only
                      </label>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort by</label>
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => handleFilterChange("sortBy", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="flex gap-6">
          {/* Results List */}
          <div className="flex-1">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-4"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {isLoading ? "Searching..." : `${results.length} services found`}
                </h2>
                {userLocation && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Near your location
                  </p>
                )}
              </div>
            </motion.div>

            {/* Results Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-80" />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {results.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SmartListingCard
                        listing={listing}
                        onBook={(listing) => console.log("Book:", listing)}
                        onFavorite={(listing) => console.log("Favorite:", listing)}
                        onMessage={(listing) => console.log("Message:", listing)}
                        showAIAnnotations={true}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Results */}
            {!isLoading && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search filters or location
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>

          {/* Map View (when enabled) */}
          {viewMode === "map" && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-96 hidden lg:block"
            >
              <Card className="sticky top-20 h-[600px]">
                <CardContent className="p-0 h-full">
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Interactive map coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}