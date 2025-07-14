"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  Heart,
  Share2,
  Clock,
  CheckCircle,
  ArrowRight,
  Grid3X3,
  List,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface Provider {
  id: number;
  name: string;
  service: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  hourlyRate: number;
  location: string;
  distance: number;
  avatar: string;
  badges: string[];
  completedJobs: number;
  responseTime: string;
  availability: string;
  description: string;
  verified: boolean;
}

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [location, setLocation] = useState(searchParams?.get("location") || "");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cleaning", label: "Home Cleaning" },
    { value: "handyman", label: "Handyman" },
    { value: "auto", label: "Auto Services" },
    { value: "tutoring", label: "Tutoring" },
    { value: "petcare", label: "Pet Care" },
    { value: "photography", label: "Photography" },
    { value: "beauty", label: "Beauty & Wellness" },
    { value: "design", label: "Art & Design" },
  ];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "distance", label: "Nearest First" },
    { value: "reviews", label: "Most Reviews" },
    { value: "newest", label: "Newest First" },
  ];

  // Mock data - in real app, this would come from API
  const mockProviders: Provider[] = [
    {
      id: 1,
      name: "Sarah Mitchell",
      service: "Professional House Cleaner",
      category: "cleaning",
      rating: 4.9,
      reviews: 127,
      price: "$25/hr",
      hourlyRate: 25,
      location: "Downtown",
      distance: 1.2,
      avatar: "/placeholder.svg?height=60&width=60",
      badges: ["Top Rated", "Background Verified"],
      completedJobs: 89,
      responseTime: "Usually responds within 1 hour",
      availability: "Available today",
      description:
        "Professional cleaning service with 5+ years experience. Eco-friendly products available.",
      verified: true,
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      service: "Licensed Plumber",
      category: "handyman",
      rating: 4.8,
      reviews: 89,
      price: "$45/hr",
      hourlyRate: 45,
      location: "Midtown",
      distance: 2.1,
      avatar: "/placeholder.svg?height=60&width=60",
      badges: ["Licensed", "Emergency Available"],
      completedJobs: 156,
      responseTime: "Usually responds within 30 minutes",
      availability: "Available now",
      description:
        "Licensed plumber with 10+ years experience. Emergency services available 24/7.",
      verified: true,
    },
    {
      id: 3,
      name: "Emma Thompson",
      service: "Certified Pet Sitter",
      category: "petcare",
      rating: 5.0,
      reviews: 156,
      price: "$20/hr",
      hourlyRate: 20,
      location: "Uptown",
      distance: 0.8,
      avatar: "/placeholder.svg?height=60&width=60",
      badges: ["Pet Certified", "Insured"],
      completedJobs: 203,
      responseTime: "Usually responds within 2 hours",
      availability: "Available tomorrow",
      description:
        "Certified pet sitter who loves all animals. References available upon request.",
      verified: true,
    },
    {
      id: 4,
      name: "David Chen",
      service: "Math & Science Tutor",
      category: "tutoring",
      rating: 4.7,
      reviews: 73,
      price: "$35/hr",
      hourlyRate: 35,
      location: "University District",
      distance: 3.2,
      avatar: "/placeholder.svg?height=60&width=60",
      badges: ["PhD", "Online Available"],
      completedJobs: 45,
      responseTime: "Usually responds within 4 hours",
      availability: "Available this week",
      description:
        "PhD in Mathematics with 8 years tutoring experience. Online and in-person sessions.",
      verified: true,
    },
    {
      id: 5,
      name: "Lisa Park",
      service: "Wedding Photographer",
      category: "photography",
      rating: 4.9,
      reviews: 92,
      price: "$150/hr",
      hourlyRate: 150,
      location: "Arts District",
      distance: 4.1,
      avatar: "/placeholder.svg?height=60&width=60",
      badges: ["Award Winner", "Portfolio Available"],
      completedJobs: 67,
      responseTime: "Usually responds within 6 hours",
      availability: "Booking for next month",
      description:
        "Award-winning photographer specializing in weddings and events. 12+ years experience.",
      verified: true,
    },
    {
      id: 6,
      name: "Carlos Martinez",
      service: "Auto Mechanic",
      category: "auto",
      rating: 4.6,
      reviews: 134,
      price: "$40/hr",
      hourlyRate: 40,
      location: "Industrial Area",
      distance: 5.3,
      avatar: "/placeholder.svg?height=60&width=60",
      badges: ["ASE Certified", "Mobile Service"],
      completedJobs: 189,
      responseTime: "Usually responds within 1 hour",
      availability: "Available today",
      description:
        "ASE certified mechanic with mobile service. Specializing in all makes and models.",
      verified: true,
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = mockProviders;

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (provider) =>
            provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.service.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // Filter by category
      if (category !== "all") {
        filtered = filtered.filter(
          (provider) => provider.category === category,
        );
      }

      // Filter by price range
      filtered = filtered.filter(
        (provider) =>
          provider.hourlyRate >= priceRange[0] &&
          provider.hourlyRate <= priceRange[1],
      );

      // Sort results
      switch (sortBy) {
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "price-low":
          filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
          break;
        case "price-high":
          filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
          break;
        case "distance":
          filtered.sort((a, b) => a.distance - b.distance);
          break;
        case "reviews":
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        default:
          break;
      }

      setProviders(filtered);
      setLoading(false);
    }, 800);
  }, [searchQuery, location, category, sortBy, priceRange]);

  const handleSearch = () => {
    // Trigger search with current filters
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto max-w-6xl py-6 px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search services or providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
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

                {/* Quick Filters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Quick Filters
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="verified"
                        className="rounded"
                      />
                      <label htmlFor="verified" className="text-sm">
                        Verified Only
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="available"
                        className="rounded"
                      />
                      <label htmlFor="available" className="text-sm">
                        Available Today
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="toprated"
                        className="rounded"
                      />
                      <label htmlFor="toprated" className="text-sm">
                        Top Rated (4.5+)
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Browse Services"}
                </h1>
                <p className="text-muted-foreground">
                  {loading
                    ? "Searching..."
                    : `${providers.length} providers found`}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-muted rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    : "space-y-4"
                }
              >
                {providers.map((provider) => (
                  <Card
                    key={provider.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent
                      className={`p-6 ${viewMode === "list" ? "flex gap-6" : ""}`}
                    >
                      {/* Provider Info */}
                      <div className={viewMode === "list" ? "flex-1" : ""}>
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={provider.avatar || "/placeholder.svg"}
                              alt={provider.name}
                            />
                            <AvatarFallback>
                              {provider.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">
                                {provider.name}
                              </CardTitle>
                              {provider.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <CardDescription>
                              {provider.service}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-slate-700 text-slate-700 dark:fill-white dark:text-white" />
                                <span className="font-medium">
                                  {provider.rating}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({provider.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-green-600">
                              {provider.price}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {provider.location} • {provider.distance}mi
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {provider.badges.map((badge) => (
                              <Badge
                                key={badge}
                                variant="secondary"
                                className="text-xs"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {provider.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {provider.completedJobs} jobs
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {provider.availability}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            {provider.responseTime}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        className={`flex gap-2 mt-4 ${viewMode === "list" ? "flex-col w-32" : ""}`}
                      >
                        <Button
                          className="flex-1"
                          onClick={() => router.push(`/dashboard`)}
                        >
                          View Profile
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast({
                                title: "Added to favorites!",
                                description: `${provider.name} has been added to your favorites.`,
                                variant: "default",
                              })
                            }
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast({
                                title: "Link copied!",
                                description: `Profile link for ${provider.name} copied to clipboard.`,
                                variant: "default",
                              })
                            }
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && providers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No providers found
                  </h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {!loading && providers.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    toast({
                      title: "Loading more results...",
                      description: "More providers are being loaded.",
                      variant: "default",
                    })
                  }
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
