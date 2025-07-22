"use client";

import { useRouter } from "next/navigation";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  ArrowRight,
  Award
} from "lucide-react";

const featuredProviders = [
  {
    id: 1,
    name: "Sarah Mitchell",
    service: "Premium House Cleaning",
    rating: 4.98,
    reviews: 347,
    price: "$28/hr",
    location: "Downtown District",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    badges: ["Top Rated", "Background Verified", "Insured"],
    completedJobs: 1289,
    responseTime: "< 30 min",
    verified: true,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    service: "Licensed Master Plumber",
    rating: 4.96,
    reviews: 512,
    price: "$65/hr",
    location: "Metro Area",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    badges: ["Master Licensed", "Emergency 24/7", "Insured"],
    completedJobs: 2156,
    responseTime: "< 15 min",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Thompson",
    service: "Certified Pet Care Specialist",
    rating: 5.0,
    reviews: 423,
    price: "$24/hr",
    location: "Uptown Area",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    badges: ["Pet Certified", "Bonded", "Background Checked"],
    completedJobs: 1876,
    responseTime: "< 45 min",
    verified: true,
  },
];

export default function ProvidersSection() {
  const router = useRouter();

  return (
    <PremiumSection
      variant="gradient"
      badge={{ icon: Award, text: "Elite Providers" }}
      title="Meet Our Top-Rated Professionals"
      description="These exceptional providers have earned their place among our elite network through outstanding service and customer satisfaction."
    >
      <div className="grid md:grid-cols-3 gap-8">
        {featuredProviders.map((provider, index) => (
          <PremiumCard
            key={provider.id}
            variant="default"
            className="border-0 shadow-2xl overflow-hidden group"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="relative p-8 pb-4">
              {/* Verified Badge */}
              {provider.verified && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 badge-premium">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs">Verified</span>
                  </div>
                </div>
              )}

              {/* Provider Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {provider.service}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-slate-700 text-slate-700 dark:fill-white dark:text-white" />
                      <span className="font-bold text-sm">
                        {provider.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({provider.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {provider.price}
                  </div>
                  <div className="text-xs text-gray-500">Starting Rate</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {provider.responseTime}
                  </div>
                  <div className="text-xs text-gray-500">Response Time</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {provider.badges.map((badge, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs badge-secondary"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Location & Jobs */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {provider.location}
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {provider.completedJobs.toLocaleString()} jobs
                </div>
              </div>

              <Button
                variant="premium"
                className="w-full"
                onClick={() => router.push(`/dashboard`)}
              >
                View Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </PremiumCard>
        ))}
      </div>
    </PremiumSection>
  );
}
