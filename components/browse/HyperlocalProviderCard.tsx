"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  CheckCircle,
  ArrowRight,
  Heart,
  Share2,
  Navigation2,
  Award,
  Clock,
  Star,
  Zap
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { HyperlocalMatch } from "@/lib/geolocation/hyperlocal-service";

interface HyperlocalProviderCardProps {
  match: HyperlocalMatch;
  viewMode: "grid" | "list";
  showHyperlocalScore?: boolean;
  showDetailedMetrics?: boolean;
}

export default function HyperlocalProviderCard({
  match,
  viewMode,
  showHyperlocalScore = true,
  showDetailedMetrics = false,
}: HyperlocalProviderCardProps) {
  const {
    provider,
    distance,
    relevanceScore,
    timeToArrival,
    hyperlocalFactors,
  } = match;
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToFavorites = () => {
    toast({
      title: "Added to favorites!",
      description: `${provider.name} has been added to your favorites.`,
      variant: "default",
    });
  };

  const handleShareProfile = () => {
    toast({
      title: "Link copied!",
      description: `Profile link for ${provider.name} copied to clipboard.`,
      variant: "default",
    });
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getDistanceColor = (dist: number) => {
    if (dist <= 2) return "text-green-600 dark:text-green-400";
    if (dist <= 5) return "text-blue-600 dark:text-blue-400";
    if (dist <= 10) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const formatTimeToArrival = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getHyperlocalBadges = () => {
    const badges = [];

    if (hyperlocalFactors.neighborhoodMatch >= 80) {
      badges.push({ text: "Same Area", color: "bg-green-100 text-green-800" });
    }

    if (distance <= 2) {
      badges.push({ text: "Very Close", color: "bg-blue-100 text-blue-800" });
    }

    if (timeToArrival <= 30) {
      badges.push({
        text: "Quick Response",
        color: "bg-purple-100 text-purple-800",
      });
    }

    if (provider.isAvailableNow) {
      badges.push({
        text: "Available Now",
        color: "bg-orange-100 text-orange-800",
      });
    }

    if (hyperlocalFactors.localExperience >= 70) {
      badges.push({
        text: "Local Expert",
        color: "bg-indigo-100 text-indigo-800",
      });
    }

    return badges.slice(0, 3); // Show max 3 badges
  };

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer dark:bg-card dark:border-gray-800 group">
      <CardContent
        className={`p-4 flex ${viewMode === "list" ? "flex-row gap-4" : "flex-col"}`}
      >
        {/* Provider Header */}
        <div
          className={`flex items-center gap-3 ${viewMode === "list" ? "flex-shrink-0 w-40" : "mb-3"}`}
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage
              src={provider.avatar || "/placeholder.svg"}
              alt={provider.name}
            />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {provider.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <CardTitle className="text-base font-semibold truncate">
                {provider.name}
              </CardTitle>
              {provider.verified && (
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground truncate">
              {provider.service}
            </CardDescription>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-current text-yellow-500" />
                <span className="font-medium text-xs">{provider.rating}</span>
              </div>
              <span className="text-2xs text-muted-foreground">
                ({provider.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 space-y-3 ${viewMode === "list" ? "border-l border-border pl-4 ml-4" : ""}`}
        >
          {/* Price and Location Row */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {provider.price}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className={`flex items-center gap-0.5 ${getDistanceColor(distance)}`}
              >
                <Navigation2 className="w-3 h-3" />
                <span className="font-medium">{distance.toFixed(1)}km</span>
              </div>
              <div className="flex items-center gap-0.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatTimeToArrival(timeToArrival)}</span>
              </div>
            </div>
          </div>

          {/* Hyperlocal Score */}
          {showHyperlocalScore && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Match Score</span>
                <span
                  className={`text-xs font-bold ${getRelevanceColor(relevanceScore)}`}
                >
                  {relevanceScore}%
                </span>
              </div>
              <Progress value={relevanceScore} className="h-1.5" />
            </div>
          )}

          {/* Hyperlocal Badges */}
          <div className="flex flex-wrap gap-1">
            {getHyperlocalBadges().map((badge, index) => (
              <Badge
                key={index}
                className={`text-2xs rounded-full ${badge.color}`}
                variant="secondary"
              >
                {badge.text}
              </Badge>
            ))}
            {provider.badges.slice(0, 2).map((badge) => (
              <Badge
                key={badge}
                variant="outline"
                className="text-2xs rounded-full"
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {provider.description}
          </p>

          {/* Detailed Metrics */}
          {showDetailedMetrics && (
            <div className="grid grid-cols-2 gap-2 text-2xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Local Experience
                  </span>
                  <span className="font-medium">
                    {hyperlocalFactors.localExperience}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Neighborhood</span>
                  <span className="font-medium">
                    {hyperlocalFactors.neighborhoodMatch}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">
                    {hyperlocalFactors.responseTime}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Proximity Boost</span>
                  <span className="font-medium">
                    {hyperlocalFactors.proximityBoost}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-2xs text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <CheckCircle className="w-2.5 h-2.5 text-green-500" />
              {provider.completedJobs} jobs
            </div>
            <div className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {provider.availability}
            </div>
            <div className="col-span-2 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {provider.location}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex gap-2 mt-3 ${viewMode === "list" ? "flex-col w-28 flex-shrink-0" : "flex-row items-center"}`}
        >
          <Button
            className="flex-1 rounded-md shadow-sm hover:shadow-md transition-all group-hover:bg-primary/90"
            size="sm"
            onClick={() => router.push(`/providers/${provider.id}`)}
          >
            View Details
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="xs"
              onClick={handleAddToFavorites}
              className="rounded-md shadow-sm hover:shadow-md transition-all"
            >
              <Heart className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={handleShareProfile}
              className="rounded-md shadow-sm hover:shadow-md transition-all"
            >
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Hyperlocal Indicators */}
        {showHyperlocalScore && (
          <div className="absolute top-2 right-2 flex gap-1">
            {relevanceScore >= 90 && (
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                <Award className="w-2.5 h-2.5 mr-1" />
                Top Match
              </Badge>
            )}
            {distance <= 1 && (
              <Badge className="bg-blue-500 text-white border-0">
                <Zap className="w-2.5 h-2.5 mr-1" />
                Ultra Close
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
