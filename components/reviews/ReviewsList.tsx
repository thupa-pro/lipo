"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Star,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  CheckCircle,
  Flag,
  MoreHorizontal,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  bookingId: string;
  customer: {
    id: string;
    name: string;
    avatar: string;
    isAnonymous: boolean;
    totalReviews: number;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
  service: {
    title: string;
    category: string;
  };
  rating: number;
  title: string;
  content: string;
  wouldRecommend: boolean;
  categories: {
    punctuality: number;
    quality: number;
    communication: number;
    professionalism: number;
    value: number;
  };
  photos: string[];
  createdAt: Date;
  helpfulCount: number;
  hasUserVoted: boolean;
  userVoteType: "helpful" | "not_helpful" | null;
  isVerified: boolean;
  providerResponse?: {
    content: string;
    createdAt: Date;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  providerId?: string;
  showProviderInfo?: boolean;
  onHelpfulVote?: (reviewId: string, type: "helpful" | "not_helpful") => void;
  onReport?: (reviewId: string) => void;
  className?: string;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "lowest_rated", label: "Lowest Rated" },
  { value: "most_helpful", label: "Most Helpful" },
];

const filterOptions = [
  { value: "all", label: "All Reviews" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
  { value: "recommended", label: "Recommended" },
  { value: "verified", label: "Verified Only" },
];

export function ReviewsList({
  reviews,
  providerId,
  showProviderInfo = false,
  onHelpfulVote,
  onReport,
  className,
}: ReviewsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Filter by provider if specified
    if (providerId) {
      filtered = filtered.filter((review) => review.provider.id === providerId);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(query) ||
          review.content.toLowerCase().includes(query) ||
          review.service.title.toLowerCase().includes(query) ||
          review.customer.name.toLowerCase().includes(query),
      );
    }

    // Apply rating/type filter
    if (filterBy !== "all") {
      if (filterBy === "recommended") {
        filtered = filtered.filter((review) => review.wouldRecommend);
      } else if (filterBy === "verified") {
        filtered = filtered.filter((review) => review.isVerified);
      } else {
        const rating = parseInt(filterBy);
        filtered = filtered.filter((review) => review.rating === rating);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "highest_rated":
          return b.rating - a.rating;
        case "lowest_rated":
          return a.rating - b.rating;
        case "most_helpful":
          return b.helpfulCount - a.helpfulCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, providerId, searchQuery, sortBy, filterBy]);

  const averageRating = useMemo(() => {
    if (filteredAndSortedReviews.length === 0) return 0;
    return (
      filteredAndSortedReviews.reduce((sum, review) => sum + review.rating, 0) /
      filteredAndSortedReviews.length
    );
  }, [filteredAndSortedReviews]);

  const ratingDistribution = useMemo(() => {
    const distribution = [0, 0, 0, 0, 0];
    filteredAndSortedReviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  }, [filteredAndSortedReviews]);

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              rating >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleHelpfulVote = (
    reviewId: string,
    type: "helpful" | "not_helpful",
  ) => {
    onHelpfulVote?.(reviewId, type);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
                </span>
                {renderStars(Math.round(averageRating), "md")}
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedReviews.length} review
                {filteredAndSortedReviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map((count, index) => {
                const rating = 5 - index;
                const percentage =
                  filteredAndSortedReviews.length > 0
                    ? (count / filteredAndSortedReviews.length) * 100
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-6">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  {Math.round(
                    (filteredAndSortedReviews.filter((r) => r.wouldRecommend)
                      .length /
                      Math.max(filteredAndSortedReviews.length, 1)) *
                      100,
                  )}
                  % recommend
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm">
                  {filteredAndSortedReviews.filter((r) => r.isVerified).length}{" "}
                  verified reviews
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Avg response time: 2 hours</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
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

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterBy !== "all"
                  ? "Try adjusting your search or filters"
                  : "Be the first to leave a review!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            review.customer.isAnonymous
                              ? undefined
                              : review.customer.avatar
                          }
                          alt={review.customer.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {review.customer.isAnonymous
                            ? "A"
                            : review.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {review.customer.isAnonymous
                              ? "Anonymous User"
                              : review.customer.name}
                          </h4>
                          {review.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {renderStars(review.rating)}
                          <span>{formatDate(review.createdAt)}</span>
                          {showProviderInfo && (
                            <span>• Service: {review.service.title}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {review.wouldRecommend && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      )}

                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h5 className="font-medium mb-2">{review.title}</h5>
                    <p className="text-muted-foreground">{review.content}</p>
                  </div>

                  {/* Category Ratings */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg px-4">
                    {Object.entries(review.categories).map(
                      ([category, rating]) => (
                        <div key={category} className="text-center">
                          <p className="text-xs text-muted-foreground capitalize mb-1">
                            {category}
                          </p>
                          <div className="flex justify-center">
                            {renderStars(rating)}
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Photos */}
                  {review.photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}

                  {/* Provider Response */}
                  {review.providerResponse && (
                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={review.provider.avatar}
                            alt={review.provider.name}
                          />
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {review.provider.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {review.provider.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Provider
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.providerResponse.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">
                        {review.providerResponse.content}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulVote(review.id, "helpful")}
                        className={cn(
                          "flex items-center gap-1",
                          review.userVoteType === "helpful" && "text-green-600",
                        )}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpfulCount})
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReport?.(review.id)}
                      >
                        <Flag className="w-4 h-4" />
                        Report
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {review.customer.totalReviews} reviews by this user
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
