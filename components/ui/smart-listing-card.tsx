"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Zap, 
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartListingCardProps {
  id: string;
  title: string;
  description: string;
  provider: {
    name: string;
    avatar?: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    responseTime: string;
  };
  price: {
    amount: number;
    unit: string;
    currency: string;
  };
  location: {
    distance: number;
    area: string;
  };
  categories: string[];
  aiAnnotations?: {
    matchScore: number;
    reasoningText: string;
    trustScore: number;
    popularityTrend: "up" | "down" | "stable";
  };
  availability: {
    nextSlot: string;
    isUrgent?: boolean;
  };
  images: string[];
  isLiked?: boolean;
  onLike?: () => void;
  onMessage?: () => void;
  onView?: () => void;
  onBook?: () => void;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

export function SmartListingCard({
  id,
  title,
  description,
  provider,
  price,
  location,
  categories,
  aiAnnotations,
  availability,
  images,
  isLiked = false,
  onLike,
  onMessage,
  onView,
  onBook,
  className,
  variant = "default"
}: SmartListingCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "border border-border/50 hover:border-primary/20",
        isFeatured && "ring-2 ring-primary/20 shadow-lg",
        className
      )}
    >
      {/* AI Match Score Badge */}
      {aiAnnotations && (
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            variant="secondary" 
            className={cn(
              "bg-background/90 backdrop-blur-sm",
              aiAnnotations.matchScore >= 90 && "bg-emerald-500/90 text-white",
              aiAnnotations.matchScore >= 80 && aiAnnotations.matchScore < 90 && "bg-blue-500/90 text-white",
              aiAnnotations.matchScore >= 70 && aiAnnotations.matchScore < 80 && "bg-amber-500/90 text-white"
            )}
          >
            <Zap className="w-3 h-3 mr-1" />
            {aiAnnotations.matchScore}% Match
          </Badge>
        </div>
      )}

      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden",
        isCompact ? "h-32" : "h-48"
      )}>
        <img
          src={images[0] || "/placeholder-service.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={onView}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={onMessage}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className={cn(
              "bg-white/90 hover:bg-white",
              isLiked && "text-red-500"
            )}
            onClick={onLike}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
        </div>

        {/* Urgency Badge */}
        {availability.isUrgent && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive" className="animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              Urgent
            </Badge>
          </div>
        )}
      </div>

      <CardContent className={cn("p-4", isCompact && "p-3")}>
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.slice(0, isCompact ? 2 : 3).map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
          {categories.length > (isCompact ? 2 : 3) && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - (isCompact ? 2 : 3)}
            </Badge>
          )}
        </div>

        {/* Title and Description */}
        <h3 className={cn(
          "font-semibold text-foreground line-clamp-2 mb-2",
          isCompact ? "text-sm" : "text-base"
        )}>
          {title}
        </h3>
        
        {!isCompact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Provider Info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className={cn(isCompact ? "h-6 w-6" : "h-8 w-8")}>
            <AvatarImage src={provider.avatar} alt={provider.name} />
            <AvatarFallback className="text-xs">
              {provider.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className={cn(
                "font-medium text-foreground truncate",
                isCompact ? "text-xs" : "text-sm"
              )}>
                {provider.name}
              </span>
              {provider.verified && (
                <Shield className="w-3 h-3 text-blue-500 fill-current" />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{provider.rating}</span>
                <span>({provider.reviewCount})</span>
              </div>
              <span>•</span>
              <span>{provider.responseTime}</span>
            </div>
          </div>
        </div>

        {/* Location and Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{location.distance}km • {location.area}</span>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-foreground">
              {price.currency}{price.amount}
              <span className="text-sm text-muted-foreground">/{price.unit}</span>
            </div>
          </div>
        </div>

        {/* AI Annotations */}
        {aiAnnotations && !isCompact && (
          <div className="bg-muted/30 rounded-lg p-3 mb-3 border border-border/30">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">AI Insights</span>
                  <div className="flex items-center gap-2">
                    {aiAnnotations.popularityTrend === "up" && (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Award className="w-2 h-2 mr-1" />
                      Trust: {aiAnnotations.trustScore}%
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {aiAnnotations.reasoningText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Next: {availability.nextSlot}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          onClick={onBook}
          size={isCompact ? "sm" : "default"}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}