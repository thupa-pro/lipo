import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, TrendingUp } from "lucide-react";

interface ProviderReputationProps {
  provider: {
    id: string;
    name: string;
    avatar?: string;
    category: string;
    rating: number;
    totalReviews: number;
    completionRate: number;
    responseTime: string;
    joinedDate: string;
    location: string;
    verifications: string[];
    recentReviews: Array<{
      rating: number;
      comment: string;
      date: string;
      customerName: string;
    }>;
    stats: {
      totalJobs: number;
      repeatCustomers: number;
      avgJobValue: number;
      onTimeRate: number;
    };
    trustScore: number;
    badges: string[];
  };
}

export default function ProviderReputationScorecard({
  provider,
}: ProviderReputationProps) {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "top performer":
        return <Award className="w-3 h-3" />;
      case "quick responder":
        return <OptimizedIcon name="Clock" className="w-3 h-3" />;
      case "customer favorite":
        return <NavigationIcons.Users className="w-3 h-3" / />;
      default:
        return <UIIcons.CheckCircle className="w-3 h-3" / />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-white">
                <AvatarImage src={provider.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-white text-blue-600 text-lg font-semibold">
                  {provider.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                <p className="text-blue-100">{provider.category}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <BusinessIcons.MapPin className="w-4 h-4 mr-1" / />
                    {provider.location}
                  </div>
                  <div className="flex items-center">
                    <BusinessIcons.Calendar className="w-4 h-4 mr-1" / />
                    Since {provider.joinedDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTrustScoreColor(provider.trustScore)}`}
              >
                <OptimizedIcon name="Shield" className="w-4 h-4 mr-1" />
                Trust Score: {provider.trustScore}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <OptimizedIcon name="Star" className="w-5 h-5 text-slate-700 dark:text-white fill-current" />
              </div>
              <div className="text-2xl font-bold">{provider.rating}</div>
              <div className="text-sm text-gray-600">
                {provider.totalReviews} reviews
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UIIcons.CheckCircle className="w-5 h-5 text-green-500" / />
              </div>
              <div className="text-2xl font-bold">
                {provider.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <OptimizedIcon name="Clock" className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{provider.responseTime}</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">
                {provider.stats.totalJobs}
              </div>
              <div className="text-sm text-gray-600">Jobs Completed</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {provider.badges.map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                {getBadgeIcon(badge)}
                <span>{badge}</span>
              </Badge>
            ))}
          </div>

          {/* Verifications */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <OptimizedIcon name="Shield" className="w-4 h-4 mr-2 text-green-600" />
              Verifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {provider.verifications.map((verification, index) => (
                <Badge key={index} className="bg-green-100 text-green-700">
                  <UIIcons.CheckCircle className="w-3 h-3 mr-1" / />
                  {verification}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>On-Time Completion</span>
                <span className="font-medium">
                  {provider.stats.onTimeRate}%
                </span>
              </div>
              <Progress value={provider.stats.onTimeRate} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Customer Satisfaction</span>
                <span className="font-medium">
                  {((provider.rating / 5) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={(provider.rating / 5) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Repeat Customer Rate</span>
                <span className="font-medium">
                  {Math.round(
                    (provider.stats.repeatCustomers /
                      provider.stats.totalJobs) *
                      100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (provider.stats.repeatCustomers / provider.stats.totalJobs) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">Average Job Value</div>
              <div className="text-xl font-bold text-green-600">
                ${provider.stats.avgJobValue}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <OptimizedIcon name="MessageSquare" className="w-5 h-5 mr-2" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {provider.recentReviews.slice(0, 3).map((review, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <OptimizedIcon name="Star"
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-slate-700 dark:text-white fill-current" : "text-gray-300 dark:text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">"{review.comment}"</p>
                <p className="text-xs text-gray-500">- {review.customerName}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trust Score Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <OptimizedIcon name="Shield" className="w-5 h-5 mr-2" />
            Trust Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Ratings</div>
                <div className="font-semibold">25 points</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Completion Rate</div>
                <div className="font-semibold">30 points</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Verifications</div>
                <div className="font-semibold">20 points</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Experience</div>
                <div className="font-semibold">15 points</div>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">Total Trust Score</div>
              <div
                className={`text-2xl font-bold ${getTrustScoreColor(provider.trustScore).split(" ")[0]}`}
              >
                {provider.trustScore}/100
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
