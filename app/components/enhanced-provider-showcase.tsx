import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import Image from "next/image";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, ThumbsUp, Heart } from "lucide-react";

// Enhanced provider data with new asset series
const eliteProviders = [
  {
    id: 1,
    name: "Michael Chen",
    title: "Elite Technology Consultant",
    specialty: "Smart Home & IoT Integration",
    rating: 5.0,
    reviews: 487,
    completedJobs: 2341,
    responseTime: "< 15 min",
    hourlyRate: "$85/hr",
    location: "Silicon Valley, CA",
    verified: true,
    premium: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    portfolio: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
    badges: ["Top 1% Provider", "Technology Expert", "Premium Certified", "24/7 Available"],
    skills: ["Smart Home Setup", "Network Security", "IoT Integration", "Home Automation"],
    description: "Leading technology consultant specializing in cutting-edge smart home solutions and enterprise-grade security systems."
  },
  {
    id: 2,
    name: "Jessica Williams",
    title: "Premium Interior Designer",
    specialty: "Luxury Residential Design",
    rating: 4.98,
    reviews: 312,
    completedJobs: 1876,
    responseTime: "< 20 min",
    hourlyRate: "$120/hr",
    location: "Manhattan, NY",
    verified: true,
    premium: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b21c?w=150&h=150&fit=crop&crop=face",
    portfolio: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    badges: ["Award Winner", "Luxury Specialist", "Celebrity Trusted", "Media Featured"],
    skills: ["Space Planning", "Color Theory", "Luxury Materials", "Custom Furniture"],
    description: "Award-winning interior designer featured in Architectural Digest, specializing in high-end residential and commercial spaces."
  },
  {
    id: 3,
    name: "David Park",
    title: "Master Automotive Specialist",
    specialty: "Luxury & Performance Vehicles",
    rating: 4.99,
    reviews: 658,
    completedJobs: 3421,
    responseTime: "< 10 min",
    hourlyRate: "$95/hr",
    location: "Beverly Hills, CA",
    verified: true,
    premium: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    portfolio: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    badges: ["Master Certified", "Luxury Specialist", "Factory Trained", "Concierge Service"],
    skills: ["Performance Tuning", "Diagnostics", "Restoration", "Maintenance"],
    description: "Factory-certified master technician specializing in luxury and performance vehicles with over 15 years of experience."
  },
  {
    id: 4,
    name: "Ana Sofia Martinez",
    title: "Elite Wellness Coach",
    specialty: "Holistic Health & Lifestyle",
    rating: 5.0,
    reviews: 423,
    completedJobs: 1987,
    responseTime: "< 25 min",
    hourlyRate: "$75/hr",
    location: "Miami, FL",
    verified: true,
    premium: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    portfolio: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    badges: ["Certified Coach", "Wellness Expert", "Nutrition Specialist", "Mindfulness Trainer"],
    skills: ["Life Coaching", "Nutrition Planning", "Fitness Training", "Stress Management"],
    description: "Certified wellness coach helping clients achieve optimal health through personalized lifestyle and nutrition programs."
  }
];

const providerStats = [
  { icon: Users, label: "Elite Providers", value: "10,000+", color: "text-blue-600" },
  { icon: Star, label: "Average Rating", value: "4.95/5", color: "text-yellow-600" },
  { icon: CheckCircle, label: "Verification Rate", value: "100%", color: "text-green-600" },
  { icon: Award, label: "Premium Certified", value: "85%", color: "text-purple-600" }
];

export function EnhancedProviderShowcase() {
  const [selectedProvider, setSelectedProvider] = useState<typeof eliteProviders[0] | null>(null);
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <PremiumSection
      variant="gradient"
      pattern="dots"
      badge={{ icon: Users, text: "Elite Provider Network" }}
      title="Meet Our Premium Professionals"
      description="Connect with the top 5% of service providers who have earned their place in our exclusive network through exceptional service, expertise, and customer satisfaction."
    >
      {/* Provider Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16">
        {providerStats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={index}
              className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <StatIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Provider Grid */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
        {eliteProviders.map((provider, index) => (
          <PremiumCard
            key={provider.id}
            variant="default"
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group"
          >
            {/* Portfolio Header */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <Image
                src={provider.portfolio}
                alt={`${provider.name} portfolio`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Premium Badge */}
              {provider.premium && (
                <Badge className="absolute top-3 lg:top-4 left-3 lg:left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs lg:text-sm">
                  <Award className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}

              {/* Rating Badge */}
              <div className="absolute top-3 lg:top-4 right-3 lg:right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-2.5 lg:px-3 py-1 flex items-center gap-1">
                <OptimizedIcon name="Star" className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">{provider.rating}</span>
              </div>

              {/* Availability Indicator */}
              <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 bg-green-500 text-white rounded-full px-2.5 lg:px-3 py-1 text-xs font-semibold flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Available Now
              </div>
            </div>

            <PremiumCardContent className="p-4 lg:p-6">
              {/* Provider Info */}
              <div className="flex items-start gap-3 lg:gap-4 mb-4 lg:mb-6">
                <Avatar className="h-12 w-12 lg:h-16 lg:w-16 border-3 lg:border-4 border-white dark:border-gray-800 shadow-lg flex-shrink-0">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm lg:text-lg font-bold">
                    {provider.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white truncate">{provider.name}</h3>
                    {provider.verified && (
                      <UIIcons.CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 flex-shrink-0" / />
                    )}
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs lg:text-sm mb-1 truncate">{provider.title}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm truncate">{provider.specialty}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 text-xs lg:text-sm mb-3 lg:mb-4 leading-relaxed line-clamp-3">
                {provider.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-3 lg:mb-4">
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 lg:p-3">
                  <div className="text-sm lg:text-lg font-bold text-green-600">{provider.hourlyRate}</div>
                  <div className="text-xs text-gray-500">Starting Rate</div>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 lg:p-3">
                  <div className="text-sm lg:text-lg font-bold text-blue-600">&lt; 30 mins</div>
                  <div className="text-xs text-gray-500">Response</div>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 lg:p-3">
                  <div className="text-sm lg:text-lg font-bold text-purple-600">{provider.completedJobs.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Jobs Done</div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-3 lg:mb-4">
                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                  {provider.skills.slice(0, 3).map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {provider.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{provider.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Location & Reviews */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-4 lg:mb-6">
                <div className="flex items-center gap-1">
                  <BusinessIcons.MapPin className="w-3 h-3 lg:w-4 lg:h-4" / />
                  <span className="truncate">{provider.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                  {provider.reviews} reviews
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 lg:gap-3">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs lg:text-sm"
                  onClick={() => setSelectedProvider(provider)}
                >
                  View Profile
                  <UIIcons.ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1.5 lg:ml-2" / />
                </Button>
                <Button size="sm" variant="outline" className="px-3 lg:px-4">
                  <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
            </PremiumCardContent>
          </PremiumCard>
        ))}
      </div>

      {/* Enhanced Provider Modal */}
      {selectedProvider && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 lg:p-4"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-gray-900 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Portfolio */}
            <div className="relative h-48 lg:h-64">
              <Image
                src={selectedProvider.portfolio}
                alt={`${selectedProvider.name} portfolio`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProvider(null)}
                className="absolute top-3 lg:top-6 right-3 lg:right-6 rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-lg lg:text-xl"
              >
                ×
              </Button>

              {/* Provider Info Overlay */}
              <div className="absolute bottom-3 lg:bottom-6 left-3 lg:left-6 text-white right-3 lg:right-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                  <Avatar className="h-16 w-16 lg:h-20 lg:w-20 border-3 lg:border-4 border-white shadow-lg">
                    <AvatarImage src={selectedProvider.avatar} alt={selectedProvider.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg lg:text-xl font-bold">
                      {selectedProvider.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl lg:text-2xl font-bold truncate">{selectedProvider.name}</h2>
                      {selectedProvider.verified && <UIIcons.CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 flex-shrink-0" / />}
                    </div>
                    <p className="text-blue-300 font-semibold mb-1 text-sm lg:text-base truncate">{selectedProvider.title}</p>
                    <p className="text-white/90 text-sm lg:text-base truncate">{selectedProvider.specialty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 lg:p-8">
              {/* Tabs */}
              <div className="flex gap-3 lg:gap-4 mb-4 lg:mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {["portfolio", "skills", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 lg:pb-3 px-1 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "portfolio" && (
                <div className="space-y-4 lg:space-y-6">
                  <p className="text-sm lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedProvider.description}
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{selectedProvider.rating}</div>
                      <div className="text-xs lg:text-sm text-gray-500">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{selectedProvider.reviews}</div>
                      <div className="text-xs lg:text-sm text-gray-500">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{selectedProvider.completedJobs.toLocaleString()}</div>
                      <div className="text-xs lg:text-sm text-gray-500">Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{selectedProvider.hourlyRate}</div>
                      <div className="text-xs lg:text-sm text-gray-500">Rate</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Core Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {selectedProvider.skills.map((skill, i) => (
                      <Badge
                        key={i}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Certifications & Badges</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    {selectedProvider.badges.map((badge, i) => (
                      <div key={i} className="flex items-center gap-2 lg:gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg lg:rounded-xl p-3 lg:p-4">
                        <Award className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">{selectedProvider.rating}/5</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <OptimizedIcon name="Star" key={i} className="w-5 h-5 lg:w-6 lg:h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">Based on {selectedProvider.reviews} reviews</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg lg:rounded-xl p-4 lg:p-6">
                    <p className="text-center text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                      Detailed reviews and testimonials would be displayed here in the full implementation.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm lg:text-base">
                  <BusinessIcons.Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" / />
                  Book Now
                </Button>
                <Button size="lg" variant="outline" className="flex-1 sm:flex-none text-sm lg:text-base">
                  <OptimizedIcon name="Phone" className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" />
                  Contact
                </Button>
                <Button size="lg" variant="outline" className="flex-1 sm:flex-none text-sm lg:text-base">
                  <OptimizedIcon name="Mail" className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white">
          <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">Join Our Elite Provider Network</h3>
          <p className="text-sm lg:text-lg opacity-90 mb-4 lg:mb-6 max-w-2xl mx-auto">
            Are you a top-tier service professional? Apply to join our exclusive network of elite providers.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto text-sm lg:text-base">
            Become a Provider
            <UIIcons.ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-1.5 lg:ml-2" / />
          </Button>
        </div>
      </div>
    </PremiumSection>
  );
}
