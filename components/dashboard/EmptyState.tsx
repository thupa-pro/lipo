"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  Users,
  Star,
  Brain,
  Heart,
  Award,
  Gift,
  MapPin,
  Shield,
  Zap,
  Link
} from "lucide-react";
importfrom "next/link";

interface EmptyStateProps {
  type: "bookings" | "providers" | "payments" | "messages";
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

const emptyStateConfig = {
  bookings: {
    icon: Calendar,
    title: "No bookings yet",
    description: "Start your journey with premium local services",
    actionText: "Find Services Now",
    actionHref: "/browse",
    benefits: [
      { icon: Brain, text: "AI-powered matching" },
      { icon: Shield, text: "100% verified providers" },
      { icon: Star, text: "5-star quality guarantee" },
      { icon: Zap, text: "Instant booking" },
    ],
    stats: [
      { value: "2.1M+", label: "Happy customers" },
      { value: "98%", label: "Satisfaction rate" },
      { value: "24/7", label: "Support available" },
    ],
  },
  providers: {
    icon: Users,
    title: "No providers found",
    description: "Adjust your filters or try a different search",
    actionText: "Browse All Services",
    actionHref: "/browse",
    benefits: [
      { icon: Search, text: "Expanded search area" },
      { icon: MapPin, text: "Nearby locations" },
      { icon: Award, text: "Top-rated professionals" },
      { icon: Heart, text: "Perfect matches" },
    ],
    stats: [
      { value: "5.2K+", label: "Active providers" },
      { value: "12M+", label: "AI matches made" },
      { value: "<2hrs", label: "Avg response time" },
    ],
  },
  payments: {
    icon: Gift,
    title: "No payment history",
    description:
      "Your payment history will appear here after your first booking",
    actionText: "Book Your First Service",
    actionHref: "/browse",
    benefits: [
      { icon: Shield, text: "Secure payments" },
      { icon: Zap, text: "Instant processing" },
      { icon: Award, text: "Best price guarantee" },
      { icon: Brain, text: "Smart pricing" },
    ],
    stats: [
      { value: "$0", label: "Fees" },
      { value: "256-bit", label: "Encryption" },
      { value: "100%", label: "Secure" },
    ],
  },
  messages: {
    icon: Sparkles,
    title: "No messages yet",
    description: "Connect with providers and start conversations",
    actionText: "Find Providers",
    actionHref: "/browse",
    benefits: [
      { icon: Zap, text: "Real-time messaging" },
      { icon: Shield, text: "Secure communication" },
      { icon: Star, text: "Direct provider contact" },
      { icon: Brain, text: "AI-assisted support" },
    ],
    stats: [
      { value: "<1min", label: "Response time" },
      { value: "24/7", label: "Availability" },
      { value: "100%", label: "Private" },
    ],
  },
};

export default function EmptyState({
  type,
  title,
  description,
  actionText,
  actionHref,
  className = "",
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const IconComponent = config.icon;

  return (
    <div className={`py-12 sm:py-16 px-4 sm:px-6 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-full blur-xl opacity-20 dark:opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-600 dark:to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4">
            {title || config.title}
          </h3>
          <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
            {description || config.description}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {config.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-blue-200/50 dark:border-white/10"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 dark:from-violet-500/20 dark:to-purple-500/20 rounded-xl flex items-center justify-center">
                <benefit.icon className="w-5 h-5 text-blue-600 dark:text-violet-400" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 text-center">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center gap-8 mb-8 opacity-80">
          {config.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25 px-8 py-4 text-base sm:text-lg h-12 sm:h-14"
            asChild
          >
            <Link href={actionHref || config.actionHref}>
              <Sparkles className="w-5 h-5 mr-2" />
              {actionText || config.actionText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Join thousands of satisfied customers who trust our platform
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-600 dark:text-gray-400">
              Verified & Secure
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-600 dark:text-gray-400">
              4.9★ Average Rating
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-slate-600 dark:text-gray-400">
              100% Satisfaction
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for dashboard-specific empty state with metrics
export function DashboardEmptyState() {
  return (
    <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-lg">
      <CardContent className="p-0">
        <EmptyState type="bookings" />
      </CardContent>
    </Card>
  );
}

// Helper component for provider search empty state
export function ProviderSearchEmptyState() {
  return (
    <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-lg">
      <CardContent className="p-0">
        <EmptyState type="providers" />
      </CardContent>
    </Card>
  );
}
