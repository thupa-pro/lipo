"use client";

import { useRouter } from "next/navigation";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  Award,
  CheckCircle,
  Star,
  Clock,
  ThumbsUp
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
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b21c?w=150&h=150&fit=crop&crop=face",
    badges: ["Top Rated", "Background Verified", "Insured"],
    completedJobs: 1289,
    responseTime: "< 30 min",
    verified: true,
    backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    service: "Licensed Master Plumber",
    rating: 4.96,
    reviews: 512,
    price: "$65/hr",
    location: "Metro Area",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    badges: ["Master Licensed", "Emergency 24/7", "Insured"],
    completedJobs: 2156,
    responseTime: "< 15 min",
    verified: true,
    backgroundImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop"
  },
  {
    id: 3,
    name: "Emma Thompson",
    service: "Certified Pet Care Specialist",
    rating: 5.0,
    reviews: 423,
    price: "$24/hr",
    location: "Uptown Area",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    badges: ["Pet Certified", "Bonded", "Background Checked"],
    completedJobs: 1876,
    responseTime: "< 45 min",
    verified: true,
    backgroundImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop"
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
            {/* Background Image Header */}
            <div className="relative h-32 overflow-hidden">
              <Image
                src={provider.backgroundImage}
                alt={`${provider.name} work`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Verified Badge */}
              {provider.verified && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-semibold">Verified</span>
                  </div>
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{provider.rating}</span>
              </div>
            </div>

            <div className="relative p-6">
              {/* Provider Avatar */}
              <div className="flex items-center gap-4 mb-6 -mt-8">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-800 shadow-lg">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                    {provider.service}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      ({provider.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {provider.price}
                  </div>
                  <div className="text-xs text-gray-500">Starting Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {provider.responseTime}
                  </div>
                  <div className="text-xs text-gray-500">Response Time</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.badges.map((badge, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  {provider.completedJobs.toLocaleString()} jobs
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => router.push(`/providers/${provider.id}`)}
              >
                View Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </PremiumCard>
        ))}
      </div>

      {/* View All Providers CTA */}
      <div className="text-center mt-12">
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => router.push('/browse')}
          className="hover:bg-blue-50 dark:hover:bg-blue-950/20"
        >
          View All Elite Providers
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </PremiumSection>
  );
}
