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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Star,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Shield,
  Clock,
  Zap
} from "lucide-react";

interface ServiceRecommendation {
  id: string;
  title: string;
  provider: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    verified: boolean;
    responseTime: string;
  };
  category: string;
  price: {
    amount: number;
    unit: string;
    currency: string;
  };
  location: string;
  distance: number;
  availability: string;
  aiConfidence: number;
  aiReason: string;
  matchScore: number;
  tags: string[];
  features: string[];
  previouslyBooked?: boolean;
  trending?: boolean;
  newProvider?: boolean;
}

interface SmartRecommendationsProps {
  userId?: string;
  location?: string;
  preferences?: any;
  context?: "homepage" | "browse" | "dashboard" | "request-service";
  maxRecommendations?: number;
  showAIInsights?: boolean;
  onRecommendationClick?: (recommendation: ServiceRecommendation) => void;
}

export default function SmartRecommendations({
  userId,
  location = "New, York, NY",
  preferences = {},
  context = "homepage",
  maxRecommendations = 6,
  showAIInsights = true,
  onRecommendationClick,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    ServiceRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAIInsight] = useState("");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  // Simulated AI-powered recommendations
  const generateRecommendations = async () => {
    setIsLoading(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockRecommendations: ServiceRecommendation[] = [
      {
        id: "1",
        title: "Premium Home Cleaning Service",
        provider: {
          name: "Sarah Chen",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.9,
          reviews: 127,
          verified: true,
          responseTime: "< 1 hour",
        },
        category: "Home Cleaning",
        price: { amount: 85, unit: "per visit", currency: "USD" },
        location: "Manhattan, NY",
        distance: 2.3,
        availability: "Available today",
        aiConfidence: 95,
        aiReason:
          "Perfect match based on your previous bookings and preferences for eco-friendly cleaning",
        matchScore: 98,
        tags: ["Eco-friendly", "Pet-safe", "Insured"],
        features: [
          "Same-day booking",
          "Satisfaction guarantee",
          "Premium supplies",
        ],
        previouslyBooked: true,
        trending: false,
      },
      {
        id: "2",
        title: "Expert Plumbing Repairs",
        provider: {
          name: "Mike Rodriguez",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.8,
          reviews: 89,
          verified: true,
          responseTime: "30 minutes",
        },
        category: "Plumbing",
        price: { amount: 120, unit: "per hour", currency: "USD" },
        location: "Brooklyn, NY",
        distance: 4.7,
        availability: "Emergency available",
        aiConfidence: 92,
        aiReason:
          "Highly rated emergency plumber with expertise in your building type",
        matchScore: 94,
        tags: ["24/7 Emergency", "Licensed", "Warranty"],
        features: ["Emergency service", "Upfront pricing", "2-year warranty"],
        trending: true,
      },
      {
        id: "3",
        title: "Personal Training & Fitness",
        provider: {
          name: "Alex Thompson",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.9,
          reviews: 156,
          verified: true,
          responseTime: "2 hours",
        },
        category: "Fitness",
        price: { amount: 75, unit: "per session", currency: "USD" },
        location: "Central, Park, NY",
        distance: 1.8,
        availability: "Next week",
        aiConfidence: 88,
        aiReason:
          "Specializes in beginners and has excellent reviews for motivation",
        matchScore: 91,
        tags: ["Certified", "Beginner-friendly", "Outdoor"],
        features: [
          "Custom workout plans",
          "Nutrition guidance",
          "Progress tracking",
        ],
        newProvider: true,
      },
      {
        id: "4",
        title: "Handyman Services",
        provider: {
          name: "David Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.7,
          reviews: 203,
          verified: true,
          responseTime: "4 hours",
        },
        category: "Home Repair",
        price: { amount: 95, unit: "per hour", currency: "USD" },
        location: "Queens, NY",
        distance: 6.2,
        availability: "Tomorrow",
        aiConfidence: 85,
        aiReason:
          "Jack-of-all-trades with experience in your specific requests",
        matchScore: 87,
        tags: ["Multi-skilled", "Same-day", "Tools included"],
        features: ["Free estimates", "Same-day service", "Tool provision"],
      },
      {
        id: "5",
        title: "Dog Walking & Pet Care",
        provider: {
          name: "Emma Wilson",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 5.0,
          reviews: 67,
          verified: true,
          responseTime: "1 hour",
        },
        category: "Pet Care",
        price: { amount: 25, unit: "per walk", currency: "USD" },
        location: "Manhattan, NY",
        distance: 1.5,
        availability: "Available now",
        aiConfidence: 96,
        aiReason:
          "Perfect for your Golden, Retriever, with great references from similar dog breeds",
        matchScore: 96,
        tags: ["Dog specialist", "Insured", "References"],
        features: ["GPS tracking", "Photo updates", "Flexible scheduling"],
      },
      {
        id: "6",
        title: "Interior Design Consultation",
        provider: {
          name: "Isabella Martinez",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.8,
          reviews: 94,
          verified: true,
          responseTime: "6 hours",
        },
        category: "Interior Design",
        price: { amount: 150, unit: "per consultation", currency: "USD" },
        location: "Manhattan, NY",
        distance: 3.1,
        availability: "Next week",
        aiConfidence: 90,
        aiReason:
          "Expertise in modern minimalist style that matches your Pinterest boards",
        matchScore: 93,
        tags: ["Modern style", "Budget-friendly", "Virtual options"],
        features: [
          "3D visualizations",
          "Shopping list",
          "Virtual consultations",
        ],
      },
    ];

    setRecommendations(mockRecommendations.slice(0, maxRecommendations));

    // Generate AI insight
    const insights = [
      "Based on your booking, history, I've prioritized eco-friendly and highly-rated providers in your area.",
      "I noticed you prefer quick response, times, so I've highlighted providers who respond within hours.",
      "Your past reviews show you value quality over, price, so I've focused on premium-rated services.",
      "Since you often book last-minute, I've included providers with same-day availability.",
    ];

    setAIInsight(insights[Math.floor(Math.random() * insights.length)]);
    setIsLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    generateRecommendations();
  }, [userId, location, preferences, maxRecommendations]);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const handleBookNow = (recommendation: ServiceRecommendation) => {
    toast({
      title: "🚀 Booking Initiated",
      description: `Connecting you with ${recommendation.provider.name}...`,
      variant: "default",
    });

    onRecommendationClick?.(recommendation);
  };

  const handleRefreshRecommendations = () => {
    toast({
      title: "🧠 AI Refreshing",
      description: "Getting fresh recommendations tailored for you...",
      variant: "default",
    });
    generateRecommendations();
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: maxRecommendations }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-white dark:bg-slate-800">
              <CardHeader className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with AI insight */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Recommendations
            </h2>
            <Badge
              variant="secondary"
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Personalized
            </Badge>
          </div>
          {showAIInsights && aiInsight && (
            <p className="text-sm text-slate-600 dark:text-gray-300 max-w-2xl bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                AI Insight:
              </span>{" "}
              {aiInsight}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          onClick={handleRefreshRecommendations}
          disabled={isLoading}
          className="shrink-0"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.id}
            className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 group relative overflow-hidden bg-white dark:bg-slate-800"
          >
            {/* Special badges */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              {recommendation.trending && (
                <Badge
                  variant="secondary"
                  className="bg-teal-100 text-teal-700 text-xs"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
              {recommendation.newProvider && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 text-xs"
                >
                  ✨ New
                </Badge>
              )}
              {recommendation.previouslyBooked && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 text-xs"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Booked before
                </Badge>
              )}
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                    <AvatarImage
                      src={recommendation.provider.avatar}
                      alt={recommendation.provider.name}
                    />
                    <AvatarFallback className="bg-blue-600 text-white font-medium">
                      {recommendation.provider.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {recommendation.provider.name}
                      </h3>
                      {recommendation.provider.verified && (
                        <Shield className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        <span className="font-medium">
                          {recommendation.provider.rating}
                        </span>
                        <span className="text-slate-500 dark:text-gray-400">
                          ({recommendation.provider.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CardTitle className="text-lg text-slate-900 dark:text-white line-clamp-2">
                {recommendation.title}
              </CardTitle>

              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{recommendation.distance} mi</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{recommendation.provider.responseTime}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* AI Match Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    AI Match Score
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200"
                  >
                    {recommendation.matchScore}%
                  </Badge>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  {recommendation.aiReason}
                </p>
              </div>

              {/* Price and Availability */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ${recommendation.price.amount}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-gray-400">
                    {recommendation.price.unit}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    recommendation.availability.includes("Available")
                      ? "border-green-200 text-green-700 bg-green-50"
                      : "border-slate-200 text-slate-700 bg-slate-50"
                  }`}
                >
                  {recommendation.availability}
                </Badge>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {recommendation.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleBookNow(recommendation)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA for more recommendations */}
      <div className="text-center">
        <Button
          variant="ghost"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          onClick={() => (window.location.href = "/browse")}
        >
          View All Services
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
