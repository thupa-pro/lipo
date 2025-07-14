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
import SmartRecommendations from "@/components/ai/smart-recommendations";
import PriceOptimizer from "@/components/ai/price-optimizer";
import AIChat from "@/components/ai/AIChat";
import {
  Brain,
  Sparkles,
  Target,
  PiggyBank,
  Zap,
  Star,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";

const aiFeatures = [
  {
    title: "Smart Service Matching",
    description:
      "AI analyzes your preferences, location, and past bookings to recommend the perfect service providers.",
    icon: Brain,
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "Price Optimization",
    description:
      "Get the best prices with AI-powered market analysis and timing recommendations.",
    icon: PiggyBank,
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    title: "Quality Prediction",
    description:
      "AI predicts service quality based on provider history and customer feedback patterns.",
    icon: Star,
    color: "text-purple-600 bg-purple-100",
  },
  {
    title: "Smart Scheduling",
    description:
      "Find optimal booking times for better rates and provider availability.",
    icon: Target,
    color: "text-teal-600 bg-teal-100",
  },
];

export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Demo
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Experience AI in Action
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Discover how artificial intelligence transforms the way you find,
            book, and manage local services. Try our AI features below to see
            the future of service marketplaces.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/browse">
                <Sparkles className="w-5 h-5 mr-2" />
                Try AI Matching
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:border-blue-500 hover:bg-blue-50"
              asChild
            >
              <Link href="/request-service">
                Get Recommendations
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              AI Features Demo
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore how artificial intelligence enhances every aspect of the
              service booking experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {aiFeatures.map((feature, index) => (
              <Card
                key={feature.title}
                className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live AI Recommendations Demo */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Live AI Recommendations
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              See how our AI selects and ranks service providers based on your
              needs
            </p>
          </div>

          <SmartRecommendations
            location="New York, NY"
            context="homepage"
            maxRecommendations={3}
            showAIInsights={true}
          />
        </div>
      </section>

      {/* AI Price Optimizer Demo */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              AI Price Optimization
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Watch our AI analyze market data to find you the best prices and
              optimal booking times
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <PriceOptimizer
              serviceType="House Cleaning"
              location="New York, NY"
              flexibility="medium"
            />
          </div>
        </div>
      </section>

      {/* AI Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              AI Performance Metrics
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Real-world results from our AI-powered matching system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  94%
                </div>
                <div className="text-slate-600 dark:text-slate-400 mb-2">
                  Match Accuracy
                </div>
                <div className="text-sm text-emerald-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% this month
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <PiggyBank className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  $247
                </div>
                <div className="text-slate-600 dark:text-slate-400 mb-2">
                  Avg. Savings
                </div>
                <div className="text-sm text-emerald-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Per user/year
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  2.3s
                </div>
                <div className="text-slate-600 dark:text-slate-400 mb-2">
                  Response Time
                </div>
                <div className="text-sm text-emerald-600 flex items-center justify-center gap-1">
                  <Shield className="w-4 h-4" />
                  99.9% uptime
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience AI-Powered Services?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who are already saving time and money with
            our intelligent service matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/auth/signup">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Today
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/browse">
                <Brain className="w-5 h-5 mr-2" />
                Browse Services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <AIChat
        agentId="maya"
        context={{ currentPage: "ai-demo" }}
        position="floating"
        theme="brand"
        autoOpen={false}
        proactiveMessage={true}
      />
    </div>
  );
}
