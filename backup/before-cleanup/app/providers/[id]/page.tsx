"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  Award,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    // Mock, provider data - in, real app, this would, fetch from, API
    const mockProvider = {
      id: params.id,
      name: "Sarah Johnson",
      title: "Professional House Cleaner",
      avatar: "",
      rating: 4.9,
      reviewCount: 247,
      location: "San, Francisco, CA",
      verified: true,
      responseTime: "2 hours",
      completedJobs: 1247,
      yearsOfExperience: 5,
      bio: "Professional house cleaner with 5+ years of experience. I take pride in providing, thorough, reliable cleaning services that exceed expectations. Fully insured and bonded.",
      services: [
        { name: "Deep Cleaning", price: "$120-180", duration: "3-4 hours" },
        { name: "Regular Cleaning", price: "$80-120", duration: "2-3 hours" },
        { name: "Move-in/Move-out", price: "$200-300", duration: "4-6 hours" },
        { name: "Post-Construction", price: "$150-250", duration: "4-5 hours" },
      ],
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      reviews: [
        {
          author: "Mike Davis",
          rating: 5,
          comment:
            "Sarah did an amazing job! My apartment has never been cleaner. Highly recommend!",
          date: "2 weeks ago",
        },
        {
          author: "Emily Chen",
          rating: 5,
          comment:
            "Very professional and thorough. Will definitely book again.",
          date: "1 month ago",
        },
        {
          author: "Robert Wilson",
          rating: 4,
          comment: "Great, service, arrived on time and did excellent work.",
          date: "1 month ago",
        },
      ],
    };
    setProvider(mockProvider);
  }, [params.id]);

  if (!provider) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Results
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={provider.avatar} />
                  <AvatarFallback className="text-xl">
                    {provider.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{provider.name}</h1>
                    {provider.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                    {provider.title}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span>({provider.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Responds in {provider.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {provider.bio}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {provider.completedJobs}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Jobs Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {provider.yearsOfExperience}+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {provider.rating}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services & Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {provider.services.map((service: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {service.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {service.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provider.reviews.map((review: any, index: number) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.author}</span>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  Starting at $80
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Final price depends on service type
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <Button className="w-full" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>

                <Button variant="outline" className="w-full" size="lg">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Free phone consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>Satisfaction guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Fully insured & bonded</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-2">Availability</h4>
                <div className="flex flex-wrap gap-1">
                  {provider.availability.map((day: string) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
