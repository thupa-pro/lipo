"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Award,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params['id'];

  // Mock data - in a real app, this would be fetched based on the ID
  const listing = {
    id: listingId,
    title: "Professional Home Cleaning Service",
    description:
      "Experienced cleaning professional offering comprehensive home cleaning services. I provide thorough cleaning using eco-friendly products and pay attention to every detail. Whether you need a one-time deep clean or regular maintenance, I'm here to help keep your home spotless.",
    category: "Cleaning",
    price: 45,
    duration: "2-3 hours typical",
    location: "Seattle, WA",
    rating: 4.8,
    reviewCount: 127,
    bookingCount: 89,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    provider: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviewCount: 156,
      memberSince: "2022",
      verified: true,
      responseTime: "Usually responds within 2 hours",
    },
    features: [
      "Eco-friendly products",
      "Fully insured and bonded",
      "Flexible scheduling",
      "Same-day availability",
      "Pet-friendly cleaning",
    ],
    reviews: [
      {
        id: 1,
        customer: "Mike R.",
        rating: 5,
        comment:
          "Exceptional service! Sarah did an amazing job cleaning our home. Very thorough and professional.",
        date: "2024-01-15",
      },
      {
        id: 2,
        customer: "Lisa M.",
        rating: 5,
        comment:
          "Highly recommend! Great attention to detail and very reliable. Will definitely book again.",
        date: "2024-01-10",
      },
      {
        id: 3,
        customer: "David C.",
        rating: 4,
        comment:
          "Good service overall. House was clean and Sarah was very professional.",
        date: "2024-01-08",
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Service images would display here
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                    <Badge variant="secondary">{listing.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{listing.rating}</span>
                    <span className="text-muted-foreground">
                      ({listing.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {listing.location}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground">{listing.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">${listing.price}/hour</p>
                    <p className="text-sm text-muted-foreground">
                      Starting price
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{listing.duration}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">
                      {listing.bookingCount} bookings
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-3">What's included:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                {listing.reviewCount} reviews with an average of{" "}
                {listing.rating} stars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listing.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {review.customer.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{review.customer}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-500 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {review.comment}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Provider Info */}
          <Card>
            <CardHeader>
              <CardTitle>About the Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={listing.provider.avatar} />
                  <AvatarFallback>
                    {listing.provider.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{listing.provider.name}</h3>
                    {listing.provider.verified && (
                      <Award className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-sm">{listing.provider.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({listing.provider.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Member since {listing.provider.memberSince}</p>
                <p>{listing.provider.responseTime}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Card */}
          <Card>
            <CardHeader>
              <CardTitle>Book This Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">${listing.price}/hour</div>
                <p className="text-sm text-muted-foreground">Starting price</p>
              </div>

              <Button className="w-full" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Button>

              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Provider
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                You won't be charged until service is confirmed
              </div>
            </CardContent>
          </Card>

          {/* Safety Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Safety & Trust</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Identity verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Background checked</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Insured & bonded</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
