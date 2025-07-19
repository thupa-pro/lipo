"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartListingCard } from "@/components/ui/smart-listing-card";
import { AgentCommandInput } from "@/components/ui/agent-command-input";

import { WalletSummaryCard } from "@/components/ui/wallet-summary-card";
import { ReviewSummaryAgentBox } from "@/components/ui/review-summary-agent-box";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  CheckCircle, 
  Zap,
  ArrowRight,
  Star,
  Brain
} from "lucide-react";

// Mock data for demonstrations
const mockListingData = {
  id: "1",
  title: "Professional House Cleaning Service",
  description: "Deep cleaning with eco-friendly products. Includes all rooms, bathrooms, and kitchen. Professional team with 5+ years experience.",
  provider: {
    name: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
    verified: true,
    rating: 4.9,
    reviewCount: 127,
    responseTime: "~2h"
  },
  price: {
    amount: 85,
    unit: "session",
    currency: "$"
  },
  location: {
    distance: 2.3,
    area: "Downtown"
  },
  categories: ["House Cleaning", "Deep Clean", "Eco-Friendly", "Insured"],
  aiAnnotations: {
    matchScore: 94,
    reasoningText: "Perfect match based on your preferences for eco-friendly cleaning, location proximity, and provider ratings. High availability and excellent customer reviews.",
    trustScore: 96,
    popularityTrend: "up" as const
  },
  availability: {
    nextSlot: "Tomorrow 2:00 PM",
    isUrgent: false
  },
  images: ["/services/cleaning-1.jpg"]
};

const mockReviews = [
  {
    id: "1",
    rating: 5,
    comment: "Exceptional service! Sarah and her team did an amazing job cleaning our house. Very thorough and professional.",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
    customerName: "Mike Chen",
    serviceType: "House Cleaning"
  },
  {
    id: "2", 
    rating: 5,
    comment: "Great attention to detail and used eco-friendly products as promised. House smelled fresh and clean.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
    customerName: "Lisa Rodriguez",
    serviceType: "Deep Clean"
  },
  {
    id: "3",
    rating: 4,
    comment: "Good service overall. Arrived on time and completed the work efficiently. Would book again.",
    date: "2024-01-05",
    verified: true,
    helpful: 5,
    customerName: "David Kim",
    serviceType: "Regular Cleaning"
  }
];

const mockTransactions = [
  {
    id: "1",
    type: "earning" as const,
    amount: 150,
    description: "House cleaning service completed",
    date: "Jan 15, 2024",
    status: "completed" as const
  },
  {
    id: "2",
    type: "tip" as const,
    amount: 25,
    description: "Customer tip from Mike Chen",
    date: "Jan 15, 2024",
    status: "completed" as const
  },
  {
    id: "3",
    type: "withdrawal" as const,
    amount: 200,
    description: "Bank transfer",
    date: "Jan 14, 2024",
    status: "pending" as const
  }
];

const loyaltyTier = {
  name: "Gold",
  level: 3,
  minEarnings: 5000,
  benefits: ["24/7 support", "10% bonus tips", "Premium tools", "Lower fees"],
  color: "bg-yellow-500"
};

export default function MissingComponentsDemo() {
  // const [showBookingStepper, setShowBookingStepper] = React.useState(false);

  const handleSendMessage = (message: string, command?: any) => {
    console.log("Message sent:", message, command);
  };

  const handleCommandExecute = (command: string, args: string[]) => {
    console.log("Command executed:", command, args);
  };

  // const handleBookingComplete = (bookingData: any) => {
  //   console.log("Booking completed:", bookingData);
  //   setShowBookingStepper(false);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto py-8 px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Missing Components Demo
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            AI-Native UI Components
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcasing the newly implemented components that complete the Loconomy AI-native experience
          </p>
        </div>

        {/* Component Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Implementation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "SmartListingCard",
                "AgentCommandInput", 
                // "BookingStepper", // Temporarily disabled
                "WalletSummaryCard",
                "ReviewSummaryAgentBox",
                "FloatingAgentBubble",
                "StickyBottomNav",
                "ThemeConfiguration"
              ].map((component) => (
                <div key={component} className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{component}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SmartListingCard Demo */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">SmartListingCard</h2>
            <Badge variant="outline">AI-Annotated</Badge>
          </div>
          <p className="text-muted-foreground">
            Responsive, AI-enhanced service listing cards with match scores, trust indicators, and interactive elements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SmartListingCard 
              {...mockListingData}
              variant="default"
              onLike={() => console.log("Liked")}
              onMessage={() => console.log("Message")}
              onView={() => console.log("View")}
              onBook={() => console.log("Book")}
            />
            <SmartListingCard 
              {...mockListingData}
              variant="compact"
              title="Quick Plumbing Fix"
              description="Emergency plumbing repairs available 24/7"
              onLike={() => console.log("Liked")}
              onMessage={() => console.log("Message")}
              onView={() => console.log("View")}
              onBook={() => console.log("Book")}
            />
            <SmartListingCard 
              {...mockListingData}
              variant="featured"
              title="Premium Landscaping"
              description="Transform your outdoor space with professional landscaping"
              onLike={() => console.log("Liked")}
              onMessage={() => console.log("Message")}
              onView={() => console.log("View")}
              onBook={() => console.log("Book")}
            />
          </div>
        </section>

        <Separator />

        {/* AgentCommandInput Demo */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">AgentCommandInput</h2>
            <Badge variant="outline">Slash Commands</Badge>
          </div>
          <p className="text-muted-foreground">
            Intelligent input component with command parsing, voice input, and auto-suggestions.
          </p>
          
          <Card className="max-w-2xl">
            <CardContent className="p-6">
              <AgentCommandInput
                onSendMessage={handleSendMessage}
                onCommandExecute={handleCommandExecute}
                placeholder="Try typing '/book', '/cancel', or '/help'..."
                showVoiceInput={true}
                showCommandSuggestions={true}
              />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <strong>Available commands:</strong> /book, /cancel, /tip, /escalate, /reschedule, /review
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* BookingStepper Demo - Temporarily Disabled */}
        {/*
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">BookingStepper</h2>
            <Badge variant="outline">Real-time Slots</Badge>
          </div>
          <p className="text-muted-foreground">
            Step-by-step booking flow with real-time availability checking and payment integration.
          </p>
          
          <Card className="max-w-md">
            <CardContent className="p-6">
              <p className="text-muted-foreground">BookingStepper component temporarily disabled for build fixes.</p>
            </CardContent>
          </Card>
        </section>
        */}

        <Separator />

        {/* WalletSummaryCard Demo */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">WalletSummaryCard</h2>
            <Badge variant="outline">Loyalty System</Badge>
          </div>
          <p className="text-muted-foreground">
            Comprehensive wallet overview with earnings, tips, loyalty tiers, and transaction history.
          </p>
          
          <div className="max-w-md">
            <WalletSummaryCard
              balance={1247.50}
              totalEarnings={3420.75}
              totalTips={285.30}
              pendingAmount={150.00}
              currency="$"
              loyaltyTier={loyaltyTier}
              nextTierProgress={75}
              recentTransactions={mockTransactions}
              onViewAll={() => console.log("View all transactions")}
              onWithdraw={() => console.log("Withdraw funds")}
              onAddFunds={() => console.log("Add funds")}
            />
          </div>
        </section>

        <Separator />

        {/* ReviewSummaryAgentBox Demo */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">ReviewSummaryAgentBox</h2>
            <Badge variant="outline">AI Analysis</Badge>
          </div>
          <p className="text-muted-foreground">
            AI-powered review analysis with sentiment detection, trend analysis, and actionable insights.
          </p>
          
          <div className="max-w-2xl">
            <ReviewSummaryAgentBox
              reviews={mockReviews}
              averageRating={4.8}
              totalReviews={127}
              recentTrend="up"
              showDetailedAnalysis={true}
            />
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-muted-foreground pt-8">
          <p>All components are fully responsive and include dark mode support</p>
          <p className="text-sm mt-2">Check the bottom-right corner for the floating AI agent bubble!</p>
        </div>
      </div>
    </div>
  );
}