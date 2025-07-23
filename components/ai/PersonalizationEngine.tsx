"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Heart,
  MapPin,
  Star,
  Brain,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  Filter,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SmartListingCard from "./SmartListingCard";

interface PersonalizedRecommendation {
  id: string;
  type: "service" | "provider" | "category" | "deal";
  title: string;
  subtitle: string;
  reason: string;
  confidence: number;
  priority: "high" | "medium" | "low";
  data: any;
  category: string;
  location: string;
  estimatedTime?: string;
  saving?: number;
  urgency?: boolean;
}

interface SmartNudge {
  id: string;
  type: "seasonal" | "location" | "behavior" | "reminder" | "deal";
  title: string;
  message: string;
  action: string;
  actionUrl: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
  dismissible: boolean;
  expiresAt?: Date;
}

interface UserPreferences {
  favoriteCategories: string[];
  priceRange: [number, number];
  preferredProviders: string[];
  locationPreference: string;
  availabilityPreference: string[];
  lastBookings: string[];
  searchHistory: string[];
}

interface PersonalizationEngineProps {
  userId?: string;
  location?: string;
  context?: "home" | "search" | "profile" | "booking";
  showNudges?: boolean;
  limit?: number;
}

export default function PersonalizationEngine({
  userId,
  location,
  context = "home",
  showNudges = true,
  limit = 6,
}: PersonalizationEngineProps) {
  const { user, isSignedIn } = useAuth();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [nudges, setNudges] = useState<SmartNudge[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedNudges, setDismissedNudges] = useState<string[]>([]);

  // Mock user preferences
  const mockPreferences: UserPreferences = {
    favoriteCategories: ["cleaning", "handyman", "gardening"],
    priceRange: [50, 200],
    preferredProviders: ["provider-1", "provider-2"],
    locationPreference: "Downtown",
    availabilityPreference: ["weekends", "evenings"],
    lastBookings: ["cleaning", "plumbing", "cleaning"],
    searchHistory: ["house cleaning", "emergency plumbing", "garden maintenance"],
  };

  // Mock recommendations based on AI analysis
  const mockRecommendations: PersonalizedRecommendation[] = [
    {
      id: "1",
      type: "service",
      title: "Weekly House Cleaning",
      subtitle: "Sarah Johnson - Professional Cleaner",
      reason: "Based on your recent bookings and high satisfaction with cleaning services",
      confidence: 95,
      priority: "high",
      category: "cleaning",
      location: "Downtown",
      estimatedTime: "2-3 hours",
      saving: 15,
      data: {
        id: "service-1",
        title: "Professional House Cleaning",
        price: 75,
        rating: 4.9,
        provider: {
          name: "Sarah Johnson",
          image: "/api/placeholder/40/40",
          verified: true,
        },
        image: "/api/placeholder/300/200",
        availability: "This week",
      },
    },
    {
      id: "2",
      type: "provider",
      title: "Mike's Handyman Services",
      subtitle: "Highly rated near you",
      reason: "Popular in your area with 4.8★ rating and specializes in home repairs",
      confidence: 88,
      priority: "medium",
      category: "handyman",
      location: "Midtown",
      estimatedTime: "1-4 hours",
      data: {
        id: "provider-2",
        name: "Mike Rodriguez",
        rating: 4.8,
        completedJobs: 156,
        specialties: ["electrical", "plumbing", "carpentry"],
        image: "/api/placeholder/40/40",
        verified: true,
      },
    },
    {
      id: "3",
      type: "deal",
      title: "Spring Garden Cleanup",
      subtitle: "20% off this month",
      reason: "Seasonal service popular in your area - limited time offer",
      confidence: 82,
      priority: "medium",
      category: "gardening",
      location: "Your area",
      saving: 30,
      urgency: true,
      data: {
        id: "deal-1",
        originalPrice: 150,
        discountedPrice: 120,
        provider: "Green Thumb Landscaping",
        validUntil: "2024-02-29",
        services: ["lawn care", "tree trimming", "garden cleanup"],
      },
    },
    {
      id: "4",
      type: "category",
      title: "Pet Care Services",
      subtitle: "New category trending in your area",
      reason: "Based on your neighborhood activity and similar users' preferences",
      confidence: 75,
      priority: "low",
      category: "pet-care",
      location: "Nearby",
      data: {
        services: ["dog walking", "pet sitting", "grooming"],
        averagePrice: 25,
        topProviders: 8,
        newCategory: true,
      },
    },
    {
      id: "5",
      type: "service",
      title: "Emergency Plumbing",
      subtitle: "24/7 Available",
      reason: "You searched for plumbing recently - save this for future emergencies",
      confidence: 90,
      priority: "high",
      category: "plumbing",
      location: "Citywide",
      data: {
        id: "service-5",
        title: "Emergency Plumbing Repair",
        price: 125,
        rating: 4.7,
        provider: {
          name: "Rapid Response Plumbing",
          image: "/api/placeholder/40/40",
          verified: true,
        },
        availability: "24/7",
        emergency: true,
      },
    },
    {
      id: "6",
      type: "service",
      title: "Monthly Deep Clean",
      subtitle: "Premium cleaning package",
      reason: "Upgrade from your regular cleaning - includes appliances and deep sanitization",
      confidence: 78,
      priority: "medium",
      category: "cleaning",
      location: "Downtown",
      estimatedTime: "4-5 hours",
      data: {
        id: "service-6",
        title: "Premium Deep Cleaning",
        price: 150,
        rating: 4.9,
        provider: {
          name: "Elite Clean Pro",
          image: "/api/placeholder/40/40",
          verified: true,
        },
        features: ["Appliance cleaning", "Deep sanitization", "Window cleaning"],
      },
    },
  ];

  // Smart nudges based on behavior and context
  const mockNudges: SmartNudge[] = [
    {
      id: "1",
      type: "seasonal",
      title: "Spring Cleaning Season",
      message: "It's peak season for deep cleaning! Book now to secure your preferred time slot.",
      action: "Browse Cleaning Services",
      actionUrl: "/search?category=cleaning",
      icon: <Sparkles className="w-4 h-4" />,
      priority: "medium",
      dismissible: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "behavior",
      title: "Complete Your Review",
      message: "Share your experience with Sarah's cleaning service to help other customers.",
      action: "Write Review",
      actionUrl: "/reviews/create",
      icon: <Star className="w-4 h-4" />,
      priority: "high",
      dismissible: true,
    },
    {
      id: "3",
      type: "location",
      title: "New Providers in Your Area",
      message: "3 new highly-rated providers just joined in Downtown. Check them out!",
      action: "Explore New Providers",
      actionUrl: "/search?filter=new&location=downtown",
      icon: <MapPin className="w-4 h-4" />,
      priority: "low",
      dismissible: true,
    },
    {
      id: "4",
      type: "deal",
      title: "Limited Time Offer",
      message: "Your favorite provider Sarah is offering 15% off for repeat customers this week!",
      action: "Book Now",
      actionUrl: "/booking/provider-1",
      icon: <DollarSign className="w-4 h-4" />,
      priority: "high",
      dismissible: false,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      type: "reminder",
      title: "Maintenance Reminder",
      message: "It's been 3 months since your last deep clean. Time for a refresh?",
      action: "Schedule Cleaning",
      actionUrl: "/search?category=cleaning&type=deep",
      icon: <Clock className="w-4 h-4" />,
      priority: "medium",
      dismissible: true,
    },
  ];

  useEffect(() => {
    // Simulate AI recommendation engine
    setTimeout(() => {
      setUserPreferences(mockPreferences);
      setRecommendations(mockRecommendations.slice(0, limit));
      setNudges(mockNudges.filter(nudge => !dismissedNudges.includes(nudge.id)));
      setIsLoading(false);
    }, 1000);
  }, [limit, dismissedNudges]);

  const dismissNudge = (nudgeId: string) => {
    setDismissedNudges(prev => [...prev, nudgeId]);
    setNudges(prev => prev.filter(nudge => nudge.id !== nudgeId));
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "service":
        return <Zap className="w-4 h-4" />;
      case "provider":
        return <Users className="w-4 h-4" />;
      case "category":
        return <Target className="w-4 h-4" />;
      case "deal":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Nudges */}
      {showNudges && nudges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Smart Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nudges.slice(0, 4).map((nudge) => (
              <motion.div
                key={nudge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-lg border-l-4 ${
                  nudge.priority === "high"
                    ? "border-red-400 bg-red-50"
                    : nudge.priority === "medium"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-blue-400 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      {nudge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{nudge.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {nudge.message}
                      </p>
                      <Button size="sm" variant="outline" className="text-xs">
                        {nudge.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  {nudge.dismissible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNudge(nudge.id)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Recommended For You
          </h3>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {getRecommendationIcon(rec.type)}
                      </div>
                      <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                        {rec.confidence}% match
                      </Badge>
                    </div>
                    {rec.urgency && (
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        Limited Time
                      </Badge>
                    )}
                  </div>

                  <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">{rec.subtitle}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {rec.location}
                    </div>
                    {rec.estimatedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.estimatedTime}
                      </div>
                    )}
                    {rec.saving && (
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="w-3 h-3" />
                        Save ${rec.saving}
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-purple-500 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{rec.reason}</p>
                    </div>
                  </div>

                  {/* Service-specific data */}
                  {rec.type === "service" && rec.data && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={rec.data.provider?.image} />
                          <AvatarFallback>
                            {rec.data.provider?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">${rec.data.price}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{rec.data.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Deal-specific data */}
                  {rec.type === "deal" && rec.data && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-green-600">
                            ${rec.data.discountedPrice}
                          </span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ${rec.data.originalPrice}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Until {new Date(rec.data.validUntil).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    {rec.type === "service" ? "Book Now" : 
                     rec.type === "provider" ? "View Profile" : 
                     rec.type === "deal" ? "Claim Deal" : "Explore"}
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Preferences Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userPreferences && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Favorite Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {userPreferences.favoriteCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Booking Pattern</h4>
                <p className="text-sm text-muted-foreground">
                  Most active on {userPreferences.availabilityPreference.join(", ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Preferred budget: ${userPreferences.priceRange[0]} - ${userPreferences.priceRange[1]}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <p className="text-sm text-muted-foreground">
                  {userPreferences.lastBookings.length} bookings this month
                </p>
                <p className="text-sm text-muted-foreground">
                  Trending: {userPreferences.searchHistory[0]}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
