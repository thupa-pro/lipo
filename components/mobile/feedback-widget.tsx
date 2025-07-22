"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Smile,
  Meh,
  Frown,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Send, TrendingUp,
  BarChart3
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentEmoji {
  id: string;
  emoji: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

interface FeedbackData {
  rating: number;
  sentiment: string;
  feedback: string;
  category: string;
  timestamp: Date;
}

interface FeedbackWidgetProps {
  onSubmit?: (feedback: FeedbackData) => void;
  onClose?: () => void;
  serviceId?: string;
  providerId?: string;
  className?: string;
}

const sentimentEmojis: SentimentEmoji[] = [
  {
    id: "very-negative",
    emoji: Frown,
    label: "Very Dissatisfied",
    value: 1,
    color: "text-red-600",
    bgColor:
      "bg-red-100 hover:bg-red-200 dark:bg-red-950/20 dark:hover:bg-red-950/30",
  },
  {
    id: "negative",
    emoji: ThumbsDown,
    label: "Dissatisfied",
    value: 2,
    color: "text-orange-600",
    bgColor:
      "bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/20 dark:hover:bg-orange-950/30",
  },
  {
    id: "neutral",
    emoji: Meh,
    label: "Neutral",
    value: 3,
    color: "text-yellow-600",
    bgColor:
      "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/30",
  },
  {
    id: "positive",
    emoji: ThumbsUp,
    label: "Satisfied",
    value: 4,
    color: "text-blue-600",
    bgColor:
      "bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/20 dark:hover:bg-blue-950/30",
  },
  {
    id: "very-positive",
    emoji: Heart,
    label: "Very Satisfied",
    value: 5,
    color: "text-emerald-600",
    bgColor:
      "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30",
  },
];

export function FeedbackWidget({
  onSubmit,
  onClose,
  serviceId,
  providerId,
  className,
}: FeedbackWidgetProps) {
  const [selectedSentiment, setSelectedSentiment] =
    useState<SentimentEmoji | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<{
    score: number;
    confidence: number;
    keywords: string[];
  } | null>(null);

  useEffect(() => {
    if (feedback.length > 10) {
      // Simulate sentiment analysis
      const keywords = extractKeywords(feedback);
      const score = calculateSentimentScore(feedback);
      const confidence = Math.random() * 0.3 + 0.7; // 70-100%

      setSentimentAnalysis({
        score,
        confidence,
        keywords,
      });
    } else {
      setSentimentAnalysis(null);
    }
  }, [feedback]);

  const extractKeywords = (text: string): string[] => {
    const positiveWords = [
      "great",
      "excellent",
      "amazing",
      "perfect",
      "wonderful",
      "fantastic",
      "love",
      "best",
      "awesome",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "hate",
      "worst",
      "disappointing",
      "poor",
    ];

    const words = text.toLowerCase().split(/\W+/);
    const foundKeywords: string[] = [];

    words.forEach((word) => {
      if (positiveWords.includes(word) || negativeWords.includes(word)) {
        foundKeywords.push(word);
      }
    });

    return foundKeywords.slice(0, 3); // Limit to 3 keywords
  };

  const calculateSentimentScore = (text: string): number => {
    const positiveWords = [
      "great",
      "excellent",
      "amazing",
      "perfect",
      "wonderful",
      "fantastic",
      "love",
      "best",
      "awesome",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "hate",
      "worst",
      "disappointing",
      "poor",
    ];

    const words = text.toLowerCase().split(/\W+/);
    let score = 0;

    words.forEach((word) => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });

    // Normalize to 0-1 range
    return Math.max(0, Math.min(1, (score + 5) / 10));
  };

  const getSentimentLabel = (score: number): string => {
    if (score >= 0.8) return "Very Positive";
    if (score >= 0.6) return "Positive";
    if (score >= 0.4) return "Neutral";
    if (score >= 0.2) return "Negative";
    return "Very Negative";
  };

  const getSentimentColor = (score: number): string => {
    if (score >= 0.8) return "text-emerald-600";
    if (score >= 0.6) return "text-blue-600";
    if (score >= 0.4) return "text-yellow-600";
    if (score >= 0.2) return "text-orange-600";
    return "text-red-600";
  };

  const handleSubmit = async () => {
    if (!selectedSentiment || !feedback.trim()) return;

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        rating: selectedSentiment.value,
        sentiment: selectedSentiment.id,
        feedback: feedback.trim(),
        category: serviceId || "general",
        timestamp: new Date(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSubmit?.(feedbackData);
      setIsSubmitted(true);

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose?.();
      }, 3000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card
        className={cn(
          "border-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
          className,
        )}
      >
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
          <h3 className="text-lg font-bold mb-2 text-emerald-700 dark:text-emerald-300">
            Thank You!
          </h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Your feedback helps us improve our service quality.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-0 shadow-xl", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold">Share Your Experience</h3>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Sentiment Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">
            How was your experience?
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {sentimentEmojis.map((sentiment) => {
              const Icon = sentiment.emoji;
              const isSelected = selectedSentiment?.id === sentiment.id;

              return (
                <Button
                  key={sentiment.id}
                  variant="ghost"
                  onClick={() => setSelectedSentiment(sentiment)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 h-auto rounded-xl transition-all duration-300",
                    sentiment.bgColor,
                    isSelected && "ring-2 ring-blue-500 scale-105 shadow-lg",
                  )}
                >
                  <Icon className={cn("w-6 h-6", sentiment.color)} />
                  <span className="text-xs font-medium text-center leading-tight">
                    {sentiment.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Feedback Text */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">
            Tell us more (optional)
          </h4>
          <Textarea
            placeholder="Share your thoughts about the service quality, provider professionalism, or any suggestions..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-24 resize-none border-2 focus:border-blue-300 transition-colors"
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{feedback.length}/500 characters</span>
            {feedback.length > 10 && (
              <span className="text-blue-600">AI analyzing sentiment...</span>
            )}
          </div>
        </div>

        {/* Sentiment Analysis Results */}
        {sentimentAnalysis && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold">
                AI Sentiment Analysis
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Sentiment</div>
                <div
                  className={cn(
                    "text-sm font-bold",
                    getSentimentColor(sentimentAnalysis.score),
                  )}
                >
                  {getSentimentLabel(sentimentAnalysis.score)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Confidence</div>
                <div className="text-sm font-bold text-blue-600">
                  {(sentimentAnalysis.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {sentimentAnalysis.keywords.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Key Words
                </div>
                <div className="flex gap-1 flex-wrap">
                  {sentimentAnalysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedSentiment || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 transition-all duration-300 hover:shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </div>
          )}
        </Button>

        {/* Privacy Note */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Your feedback is confidential and helps improve our service quality.
        </p>
      </CardContent>
    </Card>
  );
}
