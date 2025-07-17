"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Star,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Shield,
  Clock,
  Award,
  Sparkles,
  Heart,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  Users,
  Brain,
  CheckCircle,
  MessageCircle,
  Activity,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// Enhanced provider data with AI-matching features
const allProviders = [
  {
    id: 1,
    name: "Sarah Mitchell",
    service: "House Cleaning",
    category: "cleaning",
    rating: 4.9,
    reviews: 247,
    price: "$35/hr",
    hourlyRate: 35,
    location: "Downtown",
    distance: 1.2,
    verified: true,
    responseTime: "Usually responds in 2 hours",
    completedJobs: 892,
    aiOptimized: true,
    specialty: "Eco-Friendly Cleaning",
    trustScore: 98,
    badges: ["Verified", "Eco-Friendly", "Same-Day"],
    description:
      "Professional eco-friendly cleaning services with 5+ years experience. Specializing in green cleaning products and sustainable practices.",
    availability: "Available Today",
    aiMatchScore: 95,
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    service: "Handyman Services",
    category: "handyman",
    rating: 4.8,
    reviews: 189,
    price: "$45/hr",
    hourlyRate: 45,
    location: "Midtown",
    distance: 2.1,
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 654,
    aiOptimized: true,
    specialty: "Smart Home Setup",
    trustScore: 96,
    badges: ["Verified", "Smart Home", "24/7"],
    description:
      "Expert handyman specializing in smart home installations, electrical work, and general repairs. Licensed and insured.",
    availability: "Available Tomorrow",
    aiMatchScore: 88,
  },
  {
    id: 3,
    name: "Emma Thompson",
    service: "Pet Grooming",
    category: "petcare",
    rating: 5.0,
    reviews: 312,
    price: "$60/session",
    hourlyRate: 60,
    location: "Uptown",
    distance: 3.4,
    verified: true,
    responseTime: "Usually responds in 3 hours",
    completedJobs: 1205,
    aiOptimized: false,
    specialty: "Premium Pet Care",
    trustScore: 99,
    badges: ["Verified", "Premium", "Award Winner"],
    description:
      "Award-winning pet groomer with certifications in breed-specific styling. Gentle approach with anxious pets.",
    availability: "Booking for Next Week",
    aiMatchScore: 92,
  },
  {
    id: 4,
    name: "David Chen",
    service: "Personal Training",
    category: "fitness",
    rating: 4.9,
    reviews: 428,
    price: "$75/session",
    hourlyRate: 75,
    location: "Central",
    distance: 1.8,
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 890,
    aiOptimized: true,
    specialty: "Strength & Conditioning",
    trustScore: 97,
    badges: ["Verified", "Certified", "Nutrition"],
    description:
      "Certified personal trainer specializing in strength training and nutrition coaching. 10+ years experience.",
    availability: "Available Today",
    aiMatchScore: 90,
  },
  {
    id: 5,
    name: "Lisa Wang",
    service: "Tutoring",
    category: "education",
    rating: 4.8,
    reviews: 156,
    price: "$50/hr",
    hourlyRate: 50,
    location: "Westside",
    distance: 2.8,
    verified: true,
    responseTime: "Usually responds in 4 hours",
    completedJobs: 423,
    aiOptimized: true,
    specialty: "Math & Science",
    trustScore: 94,
    badges: ["Verified", "PhD", "K-12"],
    description:
      "PhD in Mathematics with 8 years tutoring experience. Specializing in K-12 math and science subjects.",
    availability: "Available This Week",
    aiMatchScore: 85,
  },
  {
    id: 6,
    name: "Alex Johnson",
    service: "Tech Support",
    category: "technology",
    rating: 4.7,
    reviews: 98,
    price: "$65/hr",
    hourlyRate: 65,
    location: "Tech District",
    distance: 4.2,
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 234,
    aiOptimized: true,
    specialty: "Computer Repair & Setup",
    trustScore: 91,
    badges: ["Verified", "Remote", "Same-Day"],
    description:
      "Certified IT professional providing computer repair, software installation, and tech support services.",
    availability: "Available Today",
    aiMatchScore: 82,
  },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "cleaning", label: "House Cleaning" },
  { value: "handyman", label: "Handyman Services" },
  { value: "petcare", label: "Pet Care" },
  { value: "fitness", label: "Fitness & Wellness" },
  { value: "education", label: "Education & Tutoring" },
  { value: "technology", label: "Technology Support" },
];

const sortOptions = [
  { value: "aiMatch", label: "AI Match Score" },
  { value: "rating", label: "Highest Rated" },
  { value: "price", label: "Lowest Price" },
  { value: "distance", label: "Closest Distance" },
  { value: "availability", label: "Available Now" },
  { value: "reviews", label: "Most Reviews" },
];

interface FilterState {
  category: string;
  priceRange: [number, number];
  sortBy: string;
  verifiedOnly: boolean;
  availableToday: boolean;
  topRated: boolean;
  aiOptimized: boolean;
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Current Location");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 200],
    sortBy: "aiMatch",
    verifiedOnly: false,
    availableToday: false,
    topRated: false,
    aiOptimized: false,
  });

  // Advanced filtering and sorting logic
  const filteredProviders = useMemo(() => {
    let filtered = [...allProviders];

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.specialty
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          provider.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (provider) => provider.category === filters.category,
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (provider) =>
        provider.hourlyRate >= filters.priceRange[0] &&
        provider.hourlyRate <= filters.priceRange[1],
    );

    // Quick filters
    if (filters.verifiedOnly) {
      filtered = filtered.filter((provider) => provider.verified);
    }

    if (filters.availableToday) {
      filtered = filtered.filter(
        (provider) => provider.availability === "Available Today",
      );
    }

    if (filters.topRated) {
      filtered = filtered.filter((provider) => provider.rating >= 4.5);
    }

    if (filters.aiOptimized) {
      filtered = filtered.filter((provider) => provider.aiOptimized);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "aiMatch":
          return b.aiMatchScore - a.aiMatchScore;
        case "rating":
          return b.rating - a.rating;
        case "price":
          return a.hourlyRate - b.hourlyRate;
        case "distance":
          return a.distance - b.distance;
        case "availability":
          return a.availability === "Available Today" ? -1 : 1;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, filters]);

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Search Complete",
        description: `Found ${filteredProviders.length} providers matching your criteria`,
      });
    }, 1000);
  };

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 200],
      sortBy: "aiMatch",
      verifiedOnly: false,
      availableToday: false,
      topRated: false,
      aiOptimized: false,
    });
    setSearchQuery("");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "all") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) count++;
    if (filters.verifiedOnly) count++;
    if (filters.availableToday) count++;
    if (filters.topRated) count++;
    if (filters.aiOptimized) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Search Header */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 border-b border-slate-200/50 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-6">
              <Brain className="w-4 h-4 text-blue-500 dark:text-violet-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                AI-Powered Matching Engine
              </span>
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-violet-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Find Your Perfect Service Provider
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-gray-300 mb-8">
              Discover verified professionals matched to your exact needs with
              our AI-powered platform
            </p>

            {/* Enhanced Search Interface */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-2 border border-blue-200/50 dark:border-white/20 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-3 p-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search services or providers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl text-base"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <div className="relative flex-1 sm:flex-initial sm:w-48">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl text-base"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="sticky top-4 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-violet-400" />
                    <h2 className="text-lg font-bold">Filters</h2>
                  </div>
                  {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                        {activeFilterCount} active
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Service Category
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="rounded-2xl border-slate-200 dark:border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Price Range: ${filters.priceRange[0]} - $
                      {filters.priceRange[1]}/hr
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: value as [number, number],
                        }))
                      }
                      max={200}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Sort By
                    </label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, sortBy: value }))
                      }
                    >
                      <SelectTrigger className="rounded-2xl border-slate-200 dark:border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Quick Filters
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="verified"
                          checked={filters.verifiedOnly}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              verifiedOnly: !!checked,
                            }))
                          }
                          className="rounded-md"
                        />
                        <label
                          htmlFor="verified"
                          className="text-sm flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4 text-emerald-500" />
                          Verified Only
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="available"
                          checked={filters.availableToday}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              availableToday: !!checked,
                            }))
                          }
                          className="rounded-md"
                        />
                        <label
                          htmlFor="available"
                          className="text-sm flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-blue-500" />
                          Available Today
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="toprated"
                          checked={filters.topRated}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              topRated: !!checked,
                            }))
                          }
                          className="rounded-md"
                        />
                        <label
                          htmlFor="toprated"
                          className="text-sm flex items-center gap-2"
                        >
                          <Star className="w-4 h-4 text-amber-500" />
                          Top Rated (4.5+)
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="aioptimized"
                          checked={filters.aiOptimized}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              aiOptimized: !!checked,
                            }))
                          }
                          className="rounded-md"
                        />
                        <label
                          htmlFor="aioptimized"
                          className="text-sm flex items-center gap-2"
                        >
                          <Brain className="w-4 h-4 text-purple-500" />
                          AI Optimized
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Browse Services"}
                  {filters.sortBy === "aiMatch" && (
                    <Badge className="bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Matched
                    </Badge>
                  )}
                </h2>
                <p className="text-slate-600 dark:text-gray-400">
                  {loading
                    ? "Searching..."
                    : `${filteredProviders.length} providers found`}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden rounded-2xl"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                <div className="flex rounded-2xl border border-slate-200 dark:border-white/20 overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={i}
                    className="animate-pulse bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && filteredProviders.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {filteredProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent
                      className={`p-6 relative z-10 ${viewMode === "list" ? "flex items-center gap-6" : ""}`}
                    >
                      {/* Provider Avatar & Basic Info */}
                      <div
                        className={`flex items-start gap-4 ${viewMode === "list" ? "flex-shrink-0" : "mb-4"}`}
                      >
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-4 border-white dark:border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <AvatarImage
                              src={`/placeholder.svg?height=64&width=64`}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white font-bold text-lg">
                              {provider.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {provider.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center">
                              <Shield className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {provider.aiOptimized && (
                            <div className="absolute -top-1 -left-1 w-6 h-6 bg-purple-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center animate-pulse">
                              <Brain className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">
                                {provider.name}
                              </h3>
                              <p className="text-slate-600 dark:text-gray-300 font-medium">
                                {provider.service}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-gray-400">
                                {provider.specialty}
                              </p>
                            </div>
                            {viewMode === "grid" && (
                              <div className="text-right">
                                <p className="font-black text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                  {provider.price}
                                </p>
                                {filters.sortBy === "aiMatch" && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Brain className="w-3 h-3 text-purple-500" />
                                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                      {provider.aiMatchScore}% match
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-slate-800 dark:text-white">
                                {provider.rating}
                              </span>
                              <span className="text-slate-500 dark:text-gray-400 text-sm">
                                ({provider.reviews})
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 dark:text-gray-400 text-sm">
                              <MapPin className="w-3 h-3" />
                              <span>{provider.distance}mi away</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {provider.badges.slice(0, 3).map((badge) => (
                              <Badge
                                key={badge}
                                variant="secondary"
                                className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Description & Actions */}
                      <div
                        className={viewMode === "list" ? "flex-1 min-w-0" : ""}
                      >
                        <p className="text-sm text-slate-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {provider.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg">
                            Contact Provider
                            <MessageCircle className="w-4 h-4 ml-2" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 dark:text-gray-500 mb-4">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-slate-600 dark:text-gray-400">
                    No providers found
                  </h3>
                  <p className="text-slate-500 dark:text-gray-500">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
                <Button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl px-6 py-3 font-semibold"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {!loading && filteredProviders.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 px-8 py-3"
                >
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
