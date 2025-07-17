"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Search,
  Sparkles,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Zap,
  Filter,
  SortDesc,
  RefreshCw,
  Mic,
  Camera,
  Upload,
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Shield,
  Award,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviews: number;
  price: { amount: number; unit: string };
  location: string;
  distance: number;
  responseTime: string;
  availability: string;
  verified: boolean;
  aiScore: number;
  aiReason: string;
  tags: string[];
  features: string[];
  category: string;
  trending: boolean;
  newProvider: boolean;
  previouslyBooked: boolean;
  instantBook: boolean;
}

interface AIServiceDiscoveryProps {
  onServiceSelect?: (service: ServiceProvider) => void;
  context?: any;
  initialQuery?: string;
  showAdvancedFeatures?: boolean;
}

export default function AIServiceDiscovery({
  onServiceSelect,
  context = {},
  initialQuery = "",
  showAdvancedFeatures = true,
}: AIServiceDiscoveryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("ai_score");
  const [aiInsight, setAIInsight] = useState("");
  const [searchMode, setSearchMode] = useState<"text" | "voice" | "image">(
    "text",
  );
  const [isListening, setIsListening] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    distance: 10,
    availability: "any",
    rating: 0,
    verified: false,
  });
  const { toast } = useToast();

  const mockServices: ServiceProvider[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      title: "Premium Home Cleaning Expert",
      rating: 4.9,
      reviews: 127,
      price: { amount: 85, unit: "per visit" },
      location: "Manhattan, NY",
      distance: 2.3,
      responseTime: "< 1 hour",
      availability: "Available today",
      verified: true,
      aiScore: 98,
      aiReason:
        "Perfect match for eco-friendly cleaning with your pet preferences",
      tags: ["Eco-friendly", "Pet-safe", "Insured", "Same-day"],
      features: ["Green products", "Pet experience", "Satisfaction guarantee"],
      category: "Cleaning",
      trending: false,
      newProvider: false,
      previouslyBooked: true,
      instantBook: true,
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg",
      title: "Emergency Plumbing Specialist",
      rating: 4.8,
      reviews: 89,
      price: { amount: 120, unit: "per hour" },
      location: "Brooklyn, NY",
      distance: 4.7,
      responseTime: "30 minutes",
      availability: "24/7 Emergency",
      verified: true,
      aiScore: 95,
      aiReason: "Specializes in your building type with emergency availability",
      tags: ["24/7", "Licensed", "Emergency", "Warranty"],
      features: ["Emergency service", "Upfront pricing", "2-year warranty"],
      category: "Plumbing",
      trending: true,
      newProvider: false,
      previouslyBooked: false,
      instantBook: false,
    },
    {
      id: "3",
      name: "Alex Thompson",
      avatar: "/placeholder.svg",
      title: "Personal Fitness Coach",
      rating: 4.9,
      reviews: 156,
      price: { amount: 75, unit: "per session" },
      location: "Central Park, NY",
      distance: 1.8,
      responseTime: "2 hours",
      availability: "Next week",
      verified: true,
      aiScore: 92,
      aiReason: "Excellent for beginners with outdoor workout expertise",
      tags: ["Certified", "Beginner-friendly", "Outdoor", "Flexible"],
      features: ["Custom plans", "Nutrition guidance", "Progress tracking"],
      category: "Fitness",
      trending: false,
      newProvider: true,
      previouslyBooked: false,
      instantBook: true,
    },
  ];

  const performAISearch = async (searchQuery: string) => {
    setIsLoading(true);
    setAIInsight("");

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // AI-powered filtering and ranking
    let filteredServices = [...mockServices];

    if (searchQuery.toLowerCase().includes("clean")) {
      filteredServices = filteredServices.filter(
        (s) => s.category === "Cleaning",
      );
    } else if (
      searchQuery.toLowerCase().includes("plumb") ||
      searchQuery.toLowerCase().includes("leak")
    ) {
      filteredServices = filteredServices.filter(
        (s) => s.category === "Plumbing",
      );
    } else if (
      searchQuery.toLowerCase().includes("fit") ||
      searchQuery.toLowerCase().includes("train")
    ) {
      filteredServices = filteredServices.filter(
        (s) => s.category === "Fitness",
      );
    }

    // Apply filters
    filteredServices = filteredServices.filter((service) => {
      return (
        service.price.amount >= filters.priceRange[0] &&
        service.price.amount <= filters.priceRange[1] &&
        service.distance <= filters.distance &&
        service.rating >= filters.rating &&
        (!filters.verified || service.verified)
      );
    });

    // Sort by selected criteria
    switch (sortBy) {
      case "ai_score":
        filteredServices.sort((a, b) => b.aiScore - a.aiScore);
        break;
      case "price_low":
        filteredServices.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case "price_high":
        filteredServices.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case "rating":
        filteredServices.sort((a, b) => b.rating - a.rating);
        break;
      case "distance":
        filteredServices.sort((a, b) => a.distance - b.distance);
        break;
    }

    setServices(filteredServices);

    // Generate AI insight
    const insights = [
      `I found ${filteredServices.length} providers that match your needs. I've prioritized those with ${searchQuery.includes("eco") ? "eco-friendly practices" : "high ratings"} in your area.`,
      `Based on your search for "${searchQuery}", I've ranked providers by their specialization and availability. The top matches have immediate availability.`,
      `Your search criteria led me to focus on ${filters.verified ? "verified" : "highly-rated"} providers within ${filters.distance} miles. All shown options meet your requirements.`,
    ];

    setAIInsight(insights[Math.floor(Math.random() * insights.length)]);
    setIsLoading(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      performAISearch(query);
    }
  };

  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      setIsListening(true);
      setSearchMode("voice");
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        setSearchMode("text");
        performAISearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSearchMode("text");
        toast({
          title: "Voice search failed",
          description: "Please try again or use text search",
          variant: "destructive",
        });
      };
    } else {
      toast({
        title: "Voice search not supported",
        description: "Please use text search instead",
        variant: "destructive",
      });
    }
  };

  const handleImageSearch = () => {
    toast({
      title: "🔮 Coming Soon!",
      description:
        "AI image search will help you find services by uploading photos",
      variant: "default",
    });
  };

  useEffect(() => {
    if (initialQuery) {
      performAISearch(initialQuery);
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* AI Search Header */}
      <Card className="border-gradient-to-r from-blue-200 to-purple-200 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Service Discovery</CardTitle>
              <CardDescription>
                Powered by intelligent matching and personalized recommendations
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe what you need... (e.g., 'eco-friendly house cleaning for pet owner')"
                className="pl-10 pr-20 h-12 text-base"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              {showAdvancedFeatures && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={startVoiceSearch}
                    disabled={isListening}
                    className={`p-2 h-8 w-8 ${isListening ? "text-red-500 animate-pulse" : "text-gray-500"}`}
                    title="Voice search"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleImageSearch}
                    className="p-2 h-8 w-8 text-gray-500"
                    title="Image search (coming soon)"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Search</span>
                </div>
              )}
            </Button>
          </div>

          {/* Search Mode Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg animate-fade-in">
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Listening... Speak naturally about what you need</span>
            </div>
          )}

          {/* Quick Filters & Sort */}
          <div className="flex items-center gap-4 text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <SortDesc className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded px-2 py-1 text-sm bg-white"
              >
                <option value="ai_score">AI Match Score</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Distance (miles)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.distance}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        distance: parseInt(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">
                    {filters.distance} miles
                  </span>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.0}>4.0+ Stars</option>
                    <option value={3.5}>3.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        availability: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                  >
                    <option value="any">Any Time</option>
                    <option value="today">Available Today</option>
                    <option value="week">This Week</option>
                    <option value="emergency">Emergency/24-7</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          verified: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    Verified Only
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insight */}
      {aiInsight && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600 rounded-full">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">AI Insight</h4>
              <p className="text-sm text-blue-800">{aiInsight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border hover:border-blue-300 group relative overflow-hidden">
                  {/* Special Badges */}
                  <div className="absolute top-4 right-4 z-10 space-y-1">
                    {service.trending && (
                      <Badge className="bg-teal-100 text-teal-700 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {service.newProvider && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        ✨ New
                      </Badge>
                    )}
                    {service.previouslyBooked && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        Previous
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6 space-y-4">
                    {/* Provider Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                        <AvatarImage src={service.avatar} alt={service.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {service.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          {service.verified && (
                            <Shield className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{service.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">
                              {service.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({service.reviews})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {service.distance} mi
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Score */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">
                          AI Match Score
                        </span>
                        <Badge className="bg-blue-600 text-white">
                          {service.aiScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-600">
                        {service.aiReason}
                      </p>
                    </div>

                    {/* Price & Availability */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">
                          ${service.price.amount}
                        </span>
                        <span className="text-sm text-gray-500">
                          {service.price.unit}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          service.availability.includes("Available") ||
                          service.availability.includes("Emergency")
                            ? "border-green-200 text-green-700 bg-green-50"
                            : "border-gray-200 text-gray-700 bg-gray-50"
                        }`}
                      >
                        {service.availability}
                      </Badge>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {service.tags.slice(0, 3).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => onServiceSelect?.(service)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="sm"
                      >
                        {service.instantBook ? (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Instant Book
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 mr-2" />
                            Request Booking
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="px-3">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : query && !isLoading ? (
          <Card className="text-center p-12">
            <CardContent>
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find more options.
              </p>
              <Button
                onClick={() => {
                  setQuery("");
                  setServices([]);
                  setFilters({
                    priceRange: [0, 500],
                    distance: 10,
                    availability: "any",
                    rating: 0,
                    verified: false,
                  });
                }}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Search
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
