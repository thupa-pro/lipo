import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Heart, Sparkles, TrendingUp, Award, MessageCircle } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AIAnnotation {
  type: 'fast_response' | 'high_rating' | 'trending' | 'verified' | 'local_hero' | 'new_talent' | 'premium';
  label: string;
  icon: React.ReactNode;
  color: string;
  confidence: number;
}

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  rating: number;
  reviewCount: number;
  location: string;
  responseTime?: string;
  availability?: string;
  images?: string[];
  tags?: string[];
  provider: {
    id: string;
    name: string;
    image?: string;
    verified?: boolean;
    rating?: number;
  };
  bookingCount?: number;
  completedJobs?: number;
  isNew?: boolean;
  isTrending?: boolean;
}

interface SmartListingCardProps {
  listing: ServiceListing;
  onBook?: (listing: ServiceListing) => void;
  onFavorite?: (listing: ServiceListing) => void;
  onMessage?: (listing: ServiceListing) => void;
  className?: string;
  showAIAnnotations?: boolean;
}

export default function SmartListingCard({
  listing,
  onBook,
  onFavorite,
  onMessage,
  className = "",
  showAIAnnotations = true
}: SmartListingCardProps) {
  const [annotations, setAnnotations] = useState<AIAnnotation[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Generate AI annotations based on listing data
  useEffect(() => {
    const generatedAnnotations: AIAnnotation[] = [];

    // Fast Response annotation
    if (listing.responseTime && parseInt(listing.responseTime) <= 30) {
      generatedAnnotations.push({
        type: 'fast_response',
        label: '⚡ Fast Response',
        icon: <Zap className="w-3 h-3" />,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        confidence: 0.95
      });
    }

    // High Rating annotation
    if (listing.rating >= 4.8 && listing.reviewCount >= 10) {
      generatedAnnotations.push({
        type: 'high_rating',
        label: '⭐ 5-Star Pro',
        icon: <OptimizedIcon name="Star" className="w-3 h-3" />,
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
        confidence: 0.92
      });
    }

    // Trending annotation
    if (listing.isTrending || (listing.bookingCount && listing.bookingCount > 20)) {
      generatedAnnotations.push({
        type: 'trending',
        label: '📈 Trending',
        icon: <TrendingUp className="w-3 h-3" />,
        color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400',
        confidence: 0.88
      });
    }

    // Verified annotation
    if (listing.provider.verified) {
      generatedAnnotations.push({
        type: 'verified',
        label: '✓ Verified Pro',
        icon: <OptimizedIcon name="Shield" className="w-3 h-3" />,
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        confidence: 1.0
      });
    }

    // Local Hero annotation (high local rating + many jobs)
    if (listing.completedJobs && listing.completedJobs > 50 && listing.rating >= 4.7) {
      generatedAnnotations.push({
        type: 'local_hero',
        label: '🏆 Local Hero',
        icon: <Award className="w-3 h-3" />,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        confidence: 0.85
      });
    }

    // New Talent annotation
    if (listing.isNew && listing.rating >= 4.5) {
      generatedAnnotations.push({
        type: 'new_talent',
        label: '✨ New Talent',
        icon: <Sparkles className="w-3 h-3" />,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        confidence: 0.75
      });
    }

    // Premium annotation (high price + high rating)
    if (listing.price > 100 && listing.rating >= 4.8) {
      generatedAnnotations.push({
        type: 'premium',
        label: '💎 Premium',
        icon: <OptimizedIcon name="Star" className="w-3 h-3" />,
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
        confidence: 0.82
      });
    }

    // Limit to top 2 annotations to avoid clutter
    setAnnotations(generatedAnnotations.slice(0, 2));
  }, [listing]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(listing);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-slate-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {listing.title.charAt(0)}
                  </span>
                </div>
              </div>
            )}

            {/* AI Annotations Overlay */}
            {showAIAnnotations && annotations.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {annotations.map((annotation, index) => (
                  <motion.div
                    key={annotation.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge
                      className={`${annotation.color} text-xs font-medium shadow-sm backdrop-blur-sm`}
                    >
                      {annotation.icon}
                      <span className="ml-1">{annotation.label}</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Favorite Button */}
            <motion.button
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
              onClick={handleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isFavorited 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-600 dark:text-gray-400'
                }`} 
              />
            </motion.button>

            {/* Price Badge */}
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-white/90 dark:bg-gray-900/90 text-slate-800 dark:text-gray-200 font-bold backdrop-blur-sm">
                {listing.currency || '$'}{listing.price}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Title and Rating */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-gray-200 line-clamp-1">
                {listing.title}
              </h3>
              <div className="flex items-center gap-1 ml-2">
                <OptimizedIcon name="Star" className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                  {listing.rating}
                </span>
                <span className="text-xs text-slate-500 dark:text-gray-400">
                  ({listing.reviewCount})
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 mb-3">
              {listing.description}
            </p>

            {/* Provider Info */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={listing.provider.image} />
                <AvatarFallback className="text-xs">
                  {listing.provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-700 dark:text-gray-300">
                {listing.provider.name}
              </span>
              {listing.provider.verified && (
                <OptimizedIcon name="Shield" className="w-3 h-3 text-green-500" />
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <BusinessIcons.MapPin className="w-3 h-3" />
                {listing.location}
              </div>
              {listing.responseTime && (
                <div className="flex items-center gap-1">
                  <OptimizedIcon name="Clock" className="w-3 h-3" />
                  {listing.responseTime}min response
                </div>
              )}
              {listing.completedJobs && (
                <div className="flex items-center gap-1">
                  <NavigationIcons.Users className="w-3 h-3" />
                  {listing.completedJobs} jobs
                </div>
              )}
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {listing.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {listing.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{listing.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => onBook?.(listing)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                size="sm"
              >
                Book Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessage?.(listing)}
                className="px-3"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover Effect - Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-lg"
      />
    </motion.div>
  );
}