import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Brain, TrendingDown, TrendingUp, AlertCircle, Target, Sparkles, BarChart3, PiggyBank, Zap } from "lucide-react";

interface PriceInsight {
  currentPrice: number;
  suggestedPrice: number;
  savings: number;
  savingsPercentage: number;
  confidence: number;
  reasoning: string[];
  marketData: {
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    demandLevel: "low" | "medium" | "high";
  };
  timingRecommendations: {
    bestDay: string;
    bestTime: string;
    peakTimes: string[];
    offPeakTimes: string[];
  };
  alternativeOptions: Array<{
    title: string;
    price: number;
    savings: number;
    tradeoffs: string[];
  }>;
}

interface PriceOptimizerProps {
  serviceType: string;
  location?: string;
  preferredDate?: string;
  budget?: number;
  flexibility?: "low" | "medium" | "high";
  onOptimizationComplete?: (insight: PriceInsight) => void;
}

export default function PriceOptimizer({
  serviceType,
  location = "New, York, NY",
  preferredDate,
  budget,
  flexibility = "medium",
  onOptimizationComplete,
}: PriceOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceInsight, setPriceInsight] = useState<PriceInsight | null>(null);
  const [userBudget, setUserBudget] = useState(budget || 0);
  const [flexibilityLevel, setFlexibilityLevel] = useState(flexibility);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const analyzePricing = async () => {
    setIsAnalyzing(true);

    // Simulate AI price analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockInsight: PriceInsight = {
      currentPrice: 150,
      suggestedPrice: 115,
      savings: 35,
      savingsPercentage: 23,
      confidence: 87,
      reasoning: [
        "Booking on Tuesday instead of Friday reduces price by 15%",
        "Off-peak hours (10 AM - 2 PM) offer 12% savings",
        "Similar quality providers in nearby areas cost 18% less",
        "Bundling with related services can save additional 8%",
      ],
      marketData: {
        averagePrice: 145,
        lowestPrice: 85,
        highestPrice: 220,
        demandLevel: "medium",
      },
      timingRecommendations: {
        bestDay: "Tuesday",
        bestTime: "11:00 AM",
        peakTimes: ["Friday 5-7 PM", "Saturday 9-11 AM", "Sunday 2-4 PM"],
        offPeakTimes: [
          "Tuesday 10 AM-2 PM",
          "Wednesday 9 AM-12 PM",
          "Thursday 1-4 PM",
        ],
      },
      alternativeOptions: [
        {
          title: "Bundle with home organization",
          price: 180,
          savings: 25,
          tradeoffs: ["Longer service time", "Additional service included"],
        },
        {
          title: "New provider with intro offer",
          price: 95,
          savings: 55,
          tradeoffs: [
            "Fewer reviews",
            "Limited availability",
            "First-time booking discount",
          ],
        },
        {
          title: "Flexible timing (provider choice)",
          price: 125,
          savings: 25,
          tradeoffs: ["Less control over timing", "May require rescheduling"],
        },
      ],
    };

    setPriceInsight(mockInsight);
    setIsAnalyzing(false);
    onOptimizationComplete?.(mockInsight);

    toast({
      title: "💡 Price Analysis Complete",
      description: `Found ${mockInsight.savingsPercentage}% savings opportunity!`,
      variant: "default",
    });
  };

  useEffect(() => {
    setMounted(true);
    if (serviceType) {
      analyzePricing();
    }
  }, [serviceType, location, preferredDate]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full">
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const getDemandColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-emerald-600 bg-emerald-100";
      case "high":
        return "text-red-600 bg-red-100";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-teal-600";
    return "text-red-600";
  };

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
            <CardTitle className="text-xl">AI Price Analysis</CardTitle>
          </div>
          <CardDescription>
            Analyzing market data and finding the best pricing opportunities...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-slate-600">
                Scanning 500+ providers in your area...
              </span>
            </div>
            <Progress value={33} className="w-full" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-slate-600">
                Analyzing pricing trends and patterns...
              </span>
            </div>
            <Progress value={66} className="w-full" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-slate-600">
                Generating personalized recommendations...
              </span>
            </div>
            <Progress value={90} className="w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!priceInsight) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Price Optimizer
          </CardTitle>
          <CardDescription>
            Let AI analyze the market to find you the best prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Your Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter your budget"
                value={userBudget}
                onChange={(e) => setUserBudget(Number(e.target.value))}
              />
            </div>

            <Button onClick={analyzePricing} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Prices
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Main Price Insight */}
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-6 h-6 text-green-600" />
              <CardTitle className="text-xl text-green-800">
                Smart Savings Found!
              </CardTitle>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <UIIcons.CheckCircle className="w-3 h-3 mr-1" />
              {priceInsight.confidence}% Confidence
            </Badge>
          </div>
          <CardDescription className="text-green-700">
            AI analysis found significant savings opportunities for your{" "}
            {serviceType} booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-slate-900">
                ${priceInsight.suggestedPrice}
              </div>
              <div className="text-sm text-slate-600">Optimized Price</div>
              <div className="flex items-center justify-center gap-1 text-green-600">
                <TrendingDown className="w-4 h-4" />
                <span className="font-medium">
                  {priceInsight.savingsPercentage}% less
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">
                ${priceInsight.savings}
              </div>
              <div className="text-sm text-slate-600">Total Savings</div>
              <div className="text-xs text-slate-500">
                vs. original ${priceInsight.currentPrice}
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {priceInsight.marketData.demandLevel.toUpperCase()}
              </div>
              <div className="text-sm text-slate-600">Market Demand</div>
              <Badge
                className={getDemandColor(priceInsight.marketData.demandLevel)}
              >
                Current Level
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reasoning and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Reasoning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Insights
            </CardTitle>
            <CardDescription>
              How we found these savings opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {priceInsight.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700 flex-1">{reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timing Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BusinessIcons.Calendar className="w-5 h-5 text-purple-600" />
              Optimal Timing
            </CardTitle>
            <CardDescription>
              Best times to book for maximum savings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Best Day
                </Label>
                <div className="text-lg font-semibold text-purple-600">
                  {priceInsight.timingRecommendations.bestDay}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Best Time
                </Label>
                <div className="text-lg font-semibold text-purple-600">
                  {priceInsight.timingRecommendations.bestTime}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Off-Peak Times
              </Label>
              <div className="flex flex-wrap gap-2">
                {priceInsight.timingRecommendations.offPeakTimes.map(
                  (time, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      {time}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Market Analysis
          </CardTitle>
          <CardDescription>
            Current market pricing for {serviceType} in {location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold text-slate-900">
                ${priceInsight.marketData.averagePrice}
              </div>
              <div className="text-sm text-slate-600">Average Price</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold text-green-600">
                ${priceInsight.marketData.lowestPrice}
              </div>
              <div className="text-sm text-slate-600">Lowest Price</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold text-red-600">
                ${priceInsight.marketData.highestPrice}
              </div>
              <div className="text-sm text-slate-600">Highest Price</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold text-blue-600">
                ${priceInsight.suggestedPrice}
              </div>
              <div className="text-sm text-slate-600">Your Price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Alternative Options
          </CardTitle>
          <CardDescription>
            Other ways to save even more on your booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {priceInsight.alternativeOptions.map((option, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">{option.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-900">
                    ${option.price}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    Save ${option.savings}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-600">
                  Trade-offs:
                </Label>
                <ul className="text-sm text-slate-600 space-y-1">
                  {option.tradeoffs.map((tradeoff, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            toast({
              title: "🎯 Booking with Optimized Price",
              description: `Proceeding with ${serviceType} at $${priceInsight.suggestedPrice}`,
              variant: "default",
            });
          }}
        >
          <Zap className="w-4 h-4 mr-2" />
          Book at Optimized Price (${priceInsight.suggestedPrice})
        </Button>

        <Button variant="outline" onClick={analyzePricing}>
          <Brain className="w-4 h-4 mr-2" />
          Re-analyze
        </Button>
      </div>
    </div>
  );
}
