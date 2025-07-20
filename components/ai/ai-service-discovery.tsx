"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Search,
  Star,
  MapPin,
  Shield,
  Heart,
  ArrowRight,
} from "lucide-react";

// Clean interface - NO function props at all
interface AIServiceDiscoveryProps {
  context?: Record<string, any>;
  initialQuery?: string;
  showAdvancedFeatures?: boolean;
}

interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviews: number;
  price: { amount: number; unit: string };
  location: string;
  verified: boolean;
  tags: string[];
}

export default function AIServiceDiscovery({
  context = {},
  initialQuery = "",
  showAdvancedFeatures = true,
}: AIServiceDiscoveryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Internal service selection - no external function needed
  const handleServiceSelect = useCallback((service: ServiceProvider) => {
    console.log("Selected service:", service);
    toast({
      title: "Service Selected",
      description: `You selected ${service.name} - ${service.title}`,
    });
  }, [toast]);

  const mockServices: ServiceProvider[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      title: "Premium Home Cleaning Expert",
      rating: 4.9,
      reviews: 127,
      price: { amount: 85, unit: "per visit" },
      location: "Manhattan, NY",
      verified: true,
      tags: ["Eco-friendly", "Pet-safe", "Insured"],
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg",
      title: "Emergency Plumbing Specialist",
      rating: 4.8,
      reviews: 89,
      price: { amount: 120, unit: "per hour" },
      location: "Brooklyn, NY",
      verified: true,
      tags: ["24/7", "Licensed", "Emergency"],
    },
  ];

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, [query]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold">AI-Powered Service Discovery</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the perfect local service providers using intelligent matching
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What service do you need?"
                className="text-lg py-3"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 py-3"
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={service.avatar} alt={service.name} />
                  <AvatarFallback>{service.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg truncate">{service.name}</CardTitle>
                    {service.verified && (
                      <Shield className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{service.title}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{service.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="text-lg font-bold text-green-600">
                ${service.price.amount} {service.price.unit}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {service.location}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {service.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleServiceSelect(service)}
                className="w-full"
                variant="outline"
              >
                Select Provider
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insight */}
      {query && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">AI Recommendation</h4>
                <p className="text-blue-800">
                  Based on your search for "{query}", I found {mockServices.length} highly-rated 
                  providers in your area. All shown options are verified and available today.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}