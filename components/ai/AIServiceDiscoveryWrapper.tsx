"use client";

import React, { useCallback } from "react";
import AIServiceDiscovery from "./ai-service-discovery";

interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviews: number;
  price: { amount: number; unit: string };
  location: string;
  distance: number;
  responseTime: string;
  availability: string;
  verified: boolean;
  aiScore: number;
  aiReason: string;
  tags: string[];
  features: string[];
  category: string;
  trending: boolean;
  newProvider: boolean;
  previouslyBooked: boolean;
  instantBook: boolean;
}

interface AIServiceDiscoveryWrapperProps {
  context?: Record<string, any>;
  initialQuery?: string;
  showAdvancedFeatures?: boolean;
}

export function AIServiceDiscoveryWrapper({
  context = {},
  initialQuery = "",
  showAdvancedFeatures = true,
}: AIServiceDiscoveryWrapperProps) {
  // Client Component function handler
  const handleServiceSelect = useCallback((service: ServiceProvider) => {
    console.log("Selected service:", service);
    // Handle service selection logic here
    // This can include navigation, state updates, etc.
  }, []);

  return (
    <AIServiceDiscovery
      context={context}
      initialQuery={initialQuery}
      showAdvancedFeatures={showAdvancedFeatures}
      onServiceSelect={handleServiceSelect}
    />
  );
}

export default AIServiceDiscoveryWrapper;