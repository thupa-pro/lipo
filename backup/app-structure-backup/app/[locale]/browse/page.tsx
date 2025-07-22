"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Grid,
  List,
  Sparkles,
  Heart,
  Brain,
  MessageCircle,
} from "lucide-react";

// Sample provider data
const providers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    service: "House Cleaning",
    category: "cleaning",
    rating: 4.9,
    reviews: 127,
    price: "$35/hr",
    hourlyRate: 35,
    location: "Downtown",
    distance: 2.1,
    verified: true,
    responseTime: "Usually responds in 2 hours",
    completedJobs: 89,
    specialty: "Deep Cleaning",
    trustScore: 98,
    badges: ["Verified", "Top Rated", "Eco-Friendly"],
    description: "Professional house cleaning with eco-friendly products. 5+ years experience.",
    availability: "Available Today",
    avatar: "/api/placeholder/64/64",
  },
  {
    id: 2,
    name: "Mike Johnson",
    service: "Handyman Services",
    category: "handyman",
    rating: 4.8,
    reviews: 203,
    price: "$45/hr",
    hourlyRate: 45,
    location: "Midtown",
    distance: 3.5,
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 156,
    specialty: "Home Repairs",
    trustScore: 95,
    badges: ["Verified", "Licensed", "Insured"],
    description: "Licensed handyman specializing in home repairs and maintenance.",
    availability: "Available This Week",
    avatar: "/api/placeholder/64/64",
  },
  {
    id: 3,
    name: "Luna Martinez",
    service: "Pet Walking",
    category: "petcare",
    rating: 5.0,
    reviews: 78,
    price: "$25/hr",
    hourlyRate: 25,
    location: "Park District",
    distance: 1.8,
    verified: true,
    responseTime: "Usually responds in 30 minutes",
    completedJobs: 234,
    specialty: "Dog Walking & Pet Sitting",
    trustScore: 99,
    badges: ["Verified", "Pet Certified", "Background Check"],
    description: "Certified pet care specialist with extensive experience in dog training.",
    availability: "Available Today",
    avatar: "/api/placeholder/64/64",
  },
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Search Header */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 border-b border-slate-200/50 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-6">
              <Brain className="w-4 h-4 text-blue-500 dark:text-violet-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                AI-Powered Matching Engine
              </span>
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-violet-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Find Your Perfect Service Provider
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover top-rated local professionals for all your needs. Our AI matches you with the perfect service provider based on your preferences and location.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Search for services, providers, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-6 text-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-white/20 dark:border-gray-700/50 shadow-lg focus:shadow-xl transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {filteredProviders.length} Service Providers Found
              </h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                AI Matched
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Providers Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredProviders.map((provider) => (
              <Card
                key={provider.id}
                className="group relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className={`p-6 relative z-10 ${viewMode === "list" ? "flex items-center gap-6" : ""}`}>
                  {/* Provider Avatar & Basic Info */}
                  <div className={`flex items-start gap-4 ${viewMode === "list" ? "flex-shrink-0" : "mb-4"}`}>
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-white dark:border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white font-bold text-lg">
                          {provider.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Online Status */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-black flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                          {provider.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                        </div>
                      </div>
                      
                      <p className="text-blue-600 dark:text-violet-400 font-semibold mb-2">
                        {provider.service}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{provider.rating}</span>
                          <span>({provider.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Details */}
                  <div className={`space-y-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex flex-wrap gap-2">
                      {provider.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {provider.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {provider.price}
                        </span>
                        <span className="text-sm text-gray-500">per hour</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-950/30"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No providers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}