"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Award,
  Flag,
  Heart,
  MoreHorizontal,
  Calendar,
  Verified,
  TrendingUp,
  Users,
  Medal,
  Trophy,
  CheckCircle,
  Shield,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  customer: {
    id: string;
    name: string;
    image?: string;
    totalReviews: number;
    isVerified: boolean;
  };
  service: {
    id: string;
    title: string;
    category: string;
  };
  response?: {
    content: string;
    date: string;
    providerName: string;
  };
  images?: string[];
}

interface TrustBadge {
  id: string;
  type: "verification" | "achievement" | "safety" | "experience";
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  criteria: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  recentReviews: Review[];
  trustScore: number;
  verificationLevel: "basic" | "verified" | "premium";
}

interface ReviewSystemProps {
  providerId: string;
  showSubmitForm?: boolean;
  isProvider?: boolean;
}

export default function ReviewSystem({ providerId, showSubmitForm = false, isProvider = false }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [trustBadges, setTrustBadges] = useState<TrustBadge[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [filter, setFilter] = useState<"all" | "verified" | "recent">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "helpful" | "rating">("newest");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockReviews: Review[] = [
    {
      id: "1",
      rating: 5,
      comment: "Exceptional service! Sarah was punctual, professional, and thorough. Our house has never been cleaner. She brought eco-friendly products as promised and paid attention to every detail. Highly recommend!",
      date: "2024-01-15",
      helpful: 12,
      notHelpful: 0,
      verified: true,
      customer: {
        id: "c1",
        name: "Jessica Thompson",
        image: "/api/placeholder/40/40",
        totalReviews: 23,
        isVerified: true,
      },
      service: {
        id: "s1",
        title: "Professional House Cleaning",
        category: "Cleaning",
      },
      response: {
        content: "Thank you so much Jessica! It was a pleasure working with you. I'm glad you're happy with the results!",
        date: "2024-01-15",
        providerName: "Sarah Johnson",
      },
      images: ["/api/placeholder/200/150", "/api/placeholder/200/150"],
    },
    {
      id: "2",
      rating: 5,
      comment: "Outstanding work! Very reliable and trustworthy. This was my third booking with Sarah and she consistently delivers excellent results.",
      date: "2024-01-10",
      helpful: 8,
      notHelpful: 1,
      verified: true,
      customer: {
        id: "c2",
        name: "Michael Rodriguez",
        image: "/api/placeholder/40/40",
        totalReviews: 15,
        isVerified: true,
      },
      service: {
        id: "s1",
        title: "Professional House Cleaning",
        category: "Cleaning",
      },
    },
    {
      id: "3",
      rating: 4,
      comment: "Good service overall. Arrived on time and did a thorough job. Would book again.",
      date: "2024-01-08",
      helpful: 5,
      notHelpful: 0,
      verified: false,
      customer: {
        id: "c3",
        name: "Emily Chen",
        image: "/api/placeholder/40/40",
        totalReviews: 7,
        isVerified: false,
      },
      service: {
        id: "s2",
        title: "Deep House Cleaning",
        category: "Cleaning",
      },
    },
  ];

  const mockStats: ReviewStats = {
    totalReviews: 127,
    averageRating: 4.9,
    ratingDistribution: {
      5: 95,
      4: 25,
      3: 5,
      2: 1,
      1: 1,
    },
    recentReviews: mockReviews,
    trustScore: 98,
    verificationLevel: "premium",
  };

  const mockTrustBadges: TrustBadge[] = [
    {
      id: "1",
      type: "verification",
      title: "Identity Verified",
      description: "Government-issued ID verified",
      icon: <Shield className="w-4 h-4" />,
      earned: true,
      earnedDate: "2023-01-15",
      criteria: "Submit valid government ID and pass identity verification",
    },
    {
      id: "2",
      type: "verification",
      title: "Background Checked",
      description: "Criminal background check completed",
      icon: <CheckCircle className="w-4 h-4" />,
      earned: true,
      earnedDate: "2023-01-20",
      criteria: "Pass comprehensive background check",
    },
    {
      id: "3",
      type: "achievement",
      title: "Top Rated Pro",
      description: "Consistently high ratings (4.8+ stars)",
      icon: <Star className="w-4 h-4" />,
      earned: true,
      earnedDate: "2023-06-01",
      criteria: "Maintain 4.8+ star rating with 50+ reviews",
    },
    {
      id: "4",
      type: "achievement",
      title: "Elite Provider",
      description: "Top 5% of providers on platform",
      icon: <Award className="w-4 h-4" />,
      earned: true,
      earnedDate: "2023-09-15",
      criteria: "Rank in top 5% based on, ratings, reliability, and customer satisfaction",
    },
    {
      id: "5",
      type: "experience",
      title: "Veteran Provider",
      description: "1+ years on, platform, 100+ bookings",
      icon: <Medal className="w-4 h-4" />,
      earned: true,
      earnedDate: "2024-01-01",
      criteria: "Complete 100+ bookings with 1+ years of active service",
    },
    {
      id: "6",
      type: "achievement",
      title: "Customer Favorite",
      description: "High repeat customer rate (80%+)",
      icon: <Heart className="w-4 h-4" />,
      earned: true,
      earnedDate: "2023-11-01",
      criteria: "Achieve 80%+ repeat customer rate",
    },
    {
      id: "7",
      type: "safety",
      title: "Insured Professional",
      description: "Liability insurance verified",
      icon: <Shield className="w-4 h-4" />,
      earned: true,
      earnedDate: "2023-01-25",
      criteria: "Provide proof of valid liability insurance",
    },
    {
      id: "8",
      type: "achievement",
      title: "Fast Response",
      description: "90%+ response rate within 1 hour",
      icon: <TrendingUp className="w-4 h-4" />,
      earned: false,
      criteria: "Maintain 90%+ response rate within 1 hour for 30 days",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      setStats(mockStats);
      setTrustBadges(mockTrustBadges);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) return;

    const review: Review = {
      id: `review-${Date.now()}`,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0,
      verified: true,
      customer: {
        id: "current-user",
        name: "Current User",
        totalReviews: 5,
        isVerified: true,
      },
      service: {
        id: "current-service",
        title: "Current Service",
        category: "Service",
      },
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 0, comment: "" });
  };

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpful: helpful ? review.helpful + 1 : review.helpful,
          notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful,
        };
      }
      return review;
    }));
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              className={`w-4 h-4 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "verification":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "achievement":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "safety":
        return "bg-green-100 text-green-800 border-green-200";
      case "experience":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredReviews = reviews.filter(review => {
    switch (filter) {
      case "verified":
        return review.verified;
      case "recent":
        return new Date(review.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "helpful":
        return b.helpful - a.helpful;
      case "rating":
        return b.rating - a.rating;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Trust & Verification Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trustBadges.filter(badge => badge.earned).map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg border ${getBadgeColor(badge.type)} transition-all cursor-pointer`}
                title={badge.description}
              >
                <div className="flex items-center gap-2 mb-1">
                  {badge.icon}
                  <span className="text-xs font-medium">{badge.title}</span>
                </div>
                <p className="text-xs opacity-80">{badge.description}</p>
                {badge.earnedDate && (
                  <p className="text-xs opacity-60 mt-1">
                    Earned {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating Overview */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats.averageRating}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(stats.averageRating)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.totalReviews} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-2">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <Progress
                      value={(stats.ratingDistribution[stars] / stats.totalReviews) * 100}
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-muted-foreground w-8">
                      {stats.ratingDistribution[stars]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust Score */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {stats.trustScore}%
                </div>
                <p className="text-sm font-medium mb-2">Trust Score</p>
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {stats.verificationLevel} verified
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Submission Form */}
      {showSubmitForm && (
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              {renderStars(newReview.rating, true, (rating) =>
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                placeholder="Share your experience..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmitReview} disabled={newReview.rating === 0}>
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Reviews</CardTitle>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Reviews</option>
                <option value="verified">Verified Only</option>
                <option value="recent">Recent (30 days)</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-border last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.customer.image} />
                    <AvatarFallback>
                      {review.customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{review.customer.name}</h4>
                        {review.customer.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Flag className="w-4 h-4 mr-2" />
                            Report Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {review.service.title}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-3">{review.comment}</p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id, true)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id, false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Not Helpful ({review.notHelpful})
                      </Button>
                    </div>

                    {review.response && (
                      <div className="bg-muted rounded-lg p-4 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Response from {review.response.providerName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.response.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.response.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}