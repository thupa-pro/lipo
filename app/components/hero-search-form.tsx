"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OptimizedIcon } from "@/lib/icons/optimized-icons";
import { useToast } from "@/components/ui/use-toast";

interface HeroSearchFormProps {
  locale: string;
}

export function HeroSearchForm({ locale }: HeroSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const searchContent = {
    en: {
      servicePlaceholder: "Search services...",
      locationPlaceholder: "Enter your location",
      searchButton: "Find Services",
      quickActions: ["Home Cleaning", "Handyman", "Pet Care", "Tutoring"]
    },
    es: {
      servicePlaceholder: "Buscar servicios...",
      locationPlaceholder: "Ingresa tu ubicación",
      searchButton: "Buscar Servicios",
      quickActions: ["Limpieza", "Handyman", "Cuidado Mascotas", "Tutoría"]
    }
  };

  const content = searchContent[locale as keyof typeof searchContent] || searchContent.en;

  const handleSearch = async () => {
    if (!searchQuery.trim() && !location.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a service or location to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    
    try {
      await router.push(`/${locale}/browse?${params.toString()}`);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Unable to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (service: string) => {
    setSearchQuery(service);
    setTimeout(() => {
      const params = new URLSearchParams();
      params.set("q", service);
      if (location) params.set("location", location);
      router.push(`/${locale}/browse?${params.toString()}`);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Main Search Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <OptimizedIcon 
              name="Search" 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
            />
            <Input
              placeholder={content.servicePlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 border-0 bg-gray-50 text-lg font-medium rounded-xl focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
          
          <div className="relative flex-1">
            <OptimizedIcon 
              name="MapPin" 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
            />
            <Input
              placeholder={content.locationPlaceholder}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 border-0 bg-gray-50 text-lg font-medium rounded-xl focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
          
          <Button
            size="lg"
            onClick={handleSearch}
            disabled={isLoading}
            className="h-14 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 rounded-xl font-semibold w-full lg:w-auto"
          >
            {isLoading ? (
              <OptimizedIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <OptimizedIcon name="Search" className="w-5 h-5 mr-2" />
            )}
            {content.searchButton}
          </Button>
        </div>
      </div>

      {/* Quick Search Pills */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
        {content.quickActions.map((service, index) => (
          <button
            key={index}
            onClick={() => handleQuickSearch(service)}
            className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium text-gray-700 hover:bg-white/80 hover:border-violet-200 hover:text-violet-700 transition-all duration-200"
          >
            {service}
          </button>
        ))}
      </div>
    </div>
  );
}