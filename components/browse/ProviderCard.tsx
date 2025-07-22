"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  CheckCircle,
  ArrowRight,
  Heart,
  Share2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

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

interface ProviderCardProps {
  provider: Provider;
  viewMode: "grid" | "list";
}

export default function ProviderCard({
  provider,
  viewMode,
}: ProviderCardProps) {
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

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer dark:bg-card dark:border-gray-800">
      <CardContent
        className={`p-4 flex ${viewMode === "list" ? "flex-row gap-4" : "flex-col"}`}
      >
        {/* Provider Info - Top Section (Avatar, Name, Service, Rating) */}
        <div
          className={`flex items-center gap-3 ${viewMode === "list" ? "flex-shrink-0 w-36" : "mb-3"}`}
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
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <CardTitle className="text-base font-semibold">
                {provider.name}
              </CardTitle>
              {provider.verified && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {provider.service}
            </CardDescription>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-slate-700 text-slate-700 dark:fill-white dark:text-white" />
                <span className="font-medium text-xs">{provider.rating}</span>
              </div>
              <span className="text-2xs text-muted-foreground">
                ({provider.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Provider Details - Middle Section (Price, Location, Badges, Description, Stats) */}
        <div
          className={`flex-1 space-y-2 ${viewMode === "list" ? "border-l border-border pl-4 ml-4" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {provider.price}
            </div>
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              {provider.location} • {provider.distance}mi
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {provider.badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="text-2xs rounded-full dark:bg-secondary/50"
              >
                {badge}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {provider.description}
          </p>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-2xs text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <CheckCircle className="w-2.5 h-2.5 text-green-500" />
              {provider.completedJobs} jobs completed
            </div>
            <div className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {provider.availability}
            </div>
            <div className="col-span-2 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {provider.responseTime}
            </div>
          </div>
        </div>

        {/* Action Buttons - Bottom Section */}
        <div
          className={`flex gap-2 mt-3 ${viewMode === "list" ? "flex-col w-28 flex-shrink-0" : "flex-row items-center"}`}
        >
          <Button
            className="flex-1 rounded-md shadow-sm hover:shadow-md transition-all"
            size="sm"
            onClick={() => router.push(`/dashboard`)}
          >
            View Profile
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
      </CardContent>
    </Card>
  );
}
