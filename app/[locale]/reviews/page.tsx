import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { TrendingUp, Award, BarChart3, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Reviews & Ratings - Loconomy",
  description: "Manage, reviews, ratings, and feedback, from customers",
};

// Mock, data for, reviews
const mockReviews = [
  {
    id: "1",
    bookingId: "booking_1",
    customer: {
      id: "customer_1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      isAnonymous: false,
      totalReviews: 23,
    },
    provider: {
      id: "provider_1",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    service: {
      title: "House Deep Cleaning",
      category: "Cleaning",
    },
    rating: 5,
    title: "Exceptional cleaning service!",
    content:
      "Mike did an absolutely fantastic job cleaning my house. He was punctual, professional, and paid attention to every detail. My house has never looked better! I will definitely book his services again.",
    wouldRecommend: true,
    categories: {
      punctuality: 5,
      quality: 5,
      communication: 5,
      professionalism: 5,
      value: 4,
    },
    photos: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    createdAt: new Date("2024-12-10"),
    helpfulCount: 12,
    hasUserVoted: false,
    userVoteType: null,
    isVerified: true,
    providerResponse: {
      content:
        "Thank you so much for the wonderful, review, Sarah! It was a pleasure working with you and I'm thrilled that you're happy with the results. Looking forward to helping you again!",
      createdAt: new Date("2024-12-11"),
    },
  },
  {
    id: "2",
    bookingId: "booking_2",
    customer: {
      id: "customer_2",
      name: "Anonymous User",
      avatar: "",
      isAnonymous: true,
      totalReviews: 8,
    },
    provider: {
      id: "provider_2",
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    service: {
      title: "Personal Training Session",
      category: "Fitness",
    },
    rating: 4,
    title: "Great workout session",
    content:
      "Emma is a knowledgeable trainer who pushed me to achieve my goals. The session was well-structured and challenging. Only minor issue was the location was a bit hard to find.",
    wouldRecommend: true,
    categories: {
      punctuality: 4,
      quality: 5,
      communication: 4,
      professionalism: 5,
      value: 4,
    },
    photos: [],
    createdAt: new Date("2024-12-08"),
    helpfulCount: 7,
    hasUserVoted: false,
    userVoteType: null,
    isVerified: true,
  },
  {
    id: "3",
    bookingId: "booking_3",
    customer: {
      id: "customer_3",
      name: "David Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      isAnonymous: false,
      totalReviews: 45,
    },
    provider: {
      id: "provider_3",
      name: "Lisa Parker",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    service: {
      title: "Kitchen Plumbing Repair",
      category: "Plumbing",
    },
    rating: 3,
    title: "Job completed but with issues",
    content:
      "Lisa fixed the main issue with my kitchen, sink, but there were some minor leaks that needed additional attention. Communication could have been better about the timeline.",
    wouldRecommend: false,
    categories: {
      punctuality: 3,
      quality: 3,
      communication: 2,
      professionalism: 4,
      value: 3,
    },
    photos: ["/placeholder.svg?height=100&width=100"],
    createdAt: new Date("2024-12-05"),
    helpfulCount: 3,
    hasUserVoted: false,
    userVoteType: null,
    isVerified: true,
    providerResponse: {
      content:
        "Thank you for your, feedback, David. I apologize for the communication issues and the additional work needed. I've taken note of your concerns and will ensure better service in the future.",
      createdAt: new Date("2024-12-06"),
    },
  },
  {
    id: "4",
    bookingId: "booking_4",
    customer: {
      id: "customer_4",
      name: "Maria Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      isAnonymous: false,
      totalReviews: 12,
    },
    provider: {
      id: "provider_1",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    service: {
      title: "Apartment Cleaning",
      category: "Cleaning",
    },
    rating: 5,
    title: "Outstanding service as always!",
    content:
      "This is my third time booking with Mike and he never disappoints. Reliable, thorough, and always leaves my apartment spotless. Highly recommend to anyone looking for quality cleaning services!",
    wouldRecommend: true,
    categories: {
      punctuality: 5,
      quality: 5,
      communication: 5,
      professionalism: 5,
      value: 5,
    },
    photos: [],
    createdAt: new Date("2024-12-03"),
    helpfulCount: 18,
    hasUserVoted: false,
    userVoteType: null,
    isVerified: true,
  },
];

const stats = {
  averageRating: 4.3,
  totalReviews: 247,
  responseRate: 89,
  averageResponseTime: "2.5 hours",
  recommendationRate: 87,
  verifiedReviews: 234,
};

const ratingTrends = [
  { month: "Jul", rating: 4.1 },
  { month: "Aug", rating: 4.2 },
  { month: "Sep", rating: 4.0 },
  { month: "Oct", rating: 4.3 },
  { month: "Nov", rating: 4.4 },
  { month: "Dec", rating: 4.3 },
];

export default function ReviewsPage() {
  const handleHelpfulVote = (
    reviewId: string,
    type: "helpful" | "not_helpful",
  ) => {
    console.log(`Voting ${type} for review ${reviewId}`);
    // Implement API call to record vote
  };

  const handleReport = (reviewId: string) => {
    console.log(`Reporting review ${reviewId}`);
    // Implement report functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Reviews & Ratings
          </h1>
          <p className="text-muted-foreground">
            Monitor customer feedback and maintain service quality
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">
                      {stats.averageRating}
                    </span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <OptimizedIcon name="Star"
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(stats.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <OptimizedIcon name="Star" className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  <p className="text-xs text-green-600 mt-1">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <OptimizedIcon name="MessageSquare" className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Response Rate
                  </p>
                  <p className="text-2xl font-bold">{stats.responseRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg: {stats.averageResponseTime}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Recommendations
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.recommendationRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.verifiedReviews} verified
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Trends Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Rating Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-4">
              {ratingTrends.map((trend, index) => {
                const height = (trend.rating / 5) * 100;
                return (
                  <div
                    key={trend.month}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md mb-2 flex items-end justify-center text-white text-xs font-medium py-1"
                      style={{ height: `${height}%` }}
                    >
                      {trend.rating}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {trend.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Management Tabs */}
        <Tabs defaultValue="all-reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="pending-response">Pending Response</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all-reviews" className="space-y-6">
            <ReviewsList
              reviews={mockReviews}
              showProviderInfo={true}
              onHelpfulVote={handleHelpfulVote}
              onReport={handleReport}
            />
          </TabsContent>

          <TabsContent value="pending-response" className="space-y-6">
            <ReviewsList
              reviews={mockReviews.filter((review) => !review.providerResponse)}
              showProviderInfo={true}
              onHelpfulVote={handleHelpfulVote}
              onReport={handleReport}
            />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <ReviewsList
              reviews={mockReviews.filter((review) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return review.createdAt >= weekAgo;
              })}
              showProviderInfo={true}
              onHelpfulVote={handleHelpfulVote}
              onReport={handleReport}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = mockReviews.filter(
                        (r) => r.rating === rating,
                      ).length;
                      const percentage = (count / mockReviews.length) * 100;

                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="w-4">{rating}</span>
                          <OptimizedIcon name="Star" className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.keys(mockReviews[0]?.categories || {}).map(
                      (category) => {
                        const avgRating =
                          mockReviews.reduce(
                            (sum, review) =>
                              sum +
                              review.categories[
                                category as keyof typeof review.categories
                              ],
                            0,
                          ) / mockReviews.length;

                        return (
                          <div
                            key={category}
                            className="flex items-center justify-between"
                          >
                            <span className="capitalize font-medium">
                              {category}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <OptimizedIcon name="Star"
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(avgRating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">
                                {avgRating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {stats.responseRate}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Response Rate
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.averageResponseTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Avg Response Time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Review Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Photo Reviews</span>
                      <Badge variant="secondary">
                        {mockReviews.filter((r) => r.photos.length > 0).length}{" "}
                        reviews
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Repeat Customers</span>
                      <Badge variant="secondary">
                        {
                          mockReviews.filter((r) => r.customer.totalReviews > 5)
                            .length
                        }{" "}
                        customers
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Anonymous Reviews</span>
                      <Badge variant="secondary">
                        {
                          mockReviews.filter((r) => r.customer.isAnonymous)
                            .length
                        }{" "}
                        reviews
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
