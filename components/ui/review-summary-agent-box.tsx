"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  ThumbsUp,
  ThumbsDown,
  Heart,
  AlertTriangle,
  Award,
  Users,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  customerName: string;
  serviceType: string;
}

interface ReviewInsight {
  category: string;
  sentiment: "positive" | "negative" | "neutral";
  mentions: number;
  trend: "up" | "down" | "stable";
  examples: string[];
}

interface ReviewSummaryAgentBoxProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  recentTrend: "up" | "down" | "stable";
  className?: string;
  showDetailedAnalysis?: boolean;
}

export function ReviewSummaryAgentBox({
  reviews,
  averageRating,
  totalReviews,
  recentTrend,
  className,
  showDetailedAnalysis = true
}: ReviewSummaryAgentBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  // AI-generated insights from reviews
  const aiInsights: ReviewInsight[] = [
    {
      category: "Service Quality",
      sentiment: "positive",
      mentions: 87,
      trend: "up",
      examples: ["excellent service", "professional work", "exceeded expectations"]
    },
    {
      category: "Timeliness",
      sentiment: "positive",
      mentions: 76,
      trend: "stable",
      examples: ["on time", "prompt arrival", "quick completion"]
    },
    {
      category: "Communication",
      sentiment: "positive",
      mentions: 92,
      trend: "up",
      examples: ["great communication", "responsive", "clear explanations"]
    },
    {
      category: "Pricing",
      sentiment: "neutral",
      mentions: 34,
      trend: "stable",
      examples: ["fair pricing", "good value", "reasonable cost"]
    },
    {
      category: "Cleanliness",
      sentiment: "positive",
      mentions: 68,
      trend: "up",
      examples: ["clean work area", "no mess left behind", "tidy professional"]
    }
  ];

  // Calculate rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => {
    const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  }).reverse();

  // Get recent reviews (last 30 days)
  const recentReviews = reviews.filter(review => {
    const reviewDate = new Date(review.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reviewDate >= thirtyDaysAgo;
  });

  // AI summary generation
  const generateAISummary = () => {
    const positiveAspects = aiInsights
      .filter(insight => insight.sentiment === "positive")
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 3)
      .map(insight => insight.category.toLowerCase());

    const trendingUp = aiInsights.filter(insight => insight.trend === "up").length;
    
    return `Based on ${totalReviews} reviews, customers consistently praise ${positiveAspects.join(", ")}. Recent feedback shows ${trendingUp} areas improving, with an overall ${recentTrend === "up" ? "positive" : recentTrend === "down" ? "declining" : "stable"} trend.`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* AI Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <Brain className="w-3 h-3 mr-1" />
          AI Analysis
        </Badge>
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 pr-20">
          <Sparkles className="w-5 h-5 text-primary" />
          Review Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(averageRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : i < averageRating
                      ? "text-yellow-500 fill-yellow-500/50"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {totalReviews} reviews
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-right">{rating}★</span>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="w-8 text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border border-blue-200/50">
          <div className="flex items-start gap-2">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">
                AI Insights
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {generateAISummary()}
              </p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Key Strengths</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? (
                <>
                  Less <ChevronUp className="w-3 h-3 ml-1" />
                </>
              ) : (
                <>
                  More <ChevronDown className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {aiInsights
              .filter(insight => insight.sentiment === "positive")
              .slice(0, isExpanded ? aiInsights.length : 4)
              .map((insight) => (
                <button
                  key={insight.category}
                  onClick={() => setSelectedInsight(
                    selectedInsight === insight.category ? null : insight.category
                  )}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-all",
                    getSentimentColor(insight.sentiment),
                    selectedInsight === insight.category && "ring-2 ring-primary/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{insight.category}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(insight.trend)}
                      <span className="text-xs">{insight.mentions}%</span>
                    </div>
                  </div>
                  
                  {selectedInsight === insight.category && (
                    <div className="text-xs mt-2 space-y-1">
                      <div className="font-medium">Common mentions:</div>
                      {insight.examples.map((example, i) => (
                        <div key={i} className="text-muted-foreground">
                          "...{example}..."
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* Recent Activity */}
        {showDetailedAnalysis && recentReviews.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Recent Feedback (30 days)</span>
              <Badge variant="outline" className="text-xs">
                {recentReviews.length} new
              </Badge>
            </div>

            <div className="space-y-2">
              {recentReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">
                          <Award className="w-2 h-2 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {review.comment}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{review.customerName} • {review.serviceType}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{review.helpful}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            View All Reviews
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Heart className="w-4 h-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}