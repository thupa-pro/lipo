"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AIServiceDiscovery from "@/components/ai/ai-service-discovery";
import AIAssistantWidget from "@/components/ai/ai-assistant-widget";
import {
  Star,
  MapPin,
  Zap,
  Shield,
  Users,
  Sparkles,
  Search,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function ComplexPage() {
  const stats = [
    {
      label: "Active Users",
      value: "2.1M",
      icon: Users,
      trend: "+12%",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Services Completed",
      value: "850K",
      icon: CheckCircle,
      trend: "+8%",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Average Rating",
      value: "4.9",
      icon: Star,
      trend: "+0.2",
      color: "from-yellow-500 to-orange-600",
    },
    {
      label: "Global Reach",
      value: "180",
      icon: Home,
      trend: "Countries",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  const categories = [
    {
      name: "Home Services",
      icon: Home,
      count: "12.5K",
      color: "from-blue-500 to-indigo-600",
      popular: true,
    },
    {
      name: "Health & Wellness",
      icon: Heart,
      count: "8.7K",
      color: "from-pink-500 to-rose-600",
      popular: true,
    },
    {
      name: "Technology",
      icon: Brain,
      count: "4.8K",
      color: "from-green-500 to-emerald-600",
      popular: false,
    },
    {
      name: "Transportation",
      icon: Home,
      count: "3.1K",
      color: "from-blue-500 to-teal-600",
      popular: false,
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm finds the perfect service provider for your specific needs.",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All service providers are thoroughly vetted and verified for quality and reliability.",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability and immediate confirmation.",
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "We guarantee satisfaction with our 5-star quality promise and money-back guarantee.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Trusted by 2.1M+ Users Globally
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Elite Service
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Discovery
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with AI-matched, verified local professionals who deliver
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}exceptional quality service{" "}
            </span>
            right in your neighborhood.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              asChild
              className="h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-500"
            >
              <Link href="/browse">
                <Search className="w-5 h-5 mr-3" />
                Find Services Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"
            >
              <Link href="/become-provider">Become a Provider</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-gray-300 mb-2">
                    {stat.label}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Service Discovery Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                AI-Powered Discovery
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of service discovery with intelligent matching and personalized recommendations
            </p>
          </div>
          
          {/* Clean AI Service Discovery - NO function props */}
          <AIServiceDiscovery
            context={{ currentPage: "homepage", location: "Global" }}
            showAdvancedFeatures={true}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-800 dark:text-white">
              Popular Categories
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400">
              Discover services across our most popular categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 text-sm mb-3">
                    {category.count} providers
                  </p>
                  {category.popular && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                      Popular
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-800 dark:text-white">
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400">
              Experience the difference with our cutting-edge features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clean AI Assistant Widget - NO function props */}
      <AIAssistantWidget
        position="floating"
        size="normal"
        context={{
          currentPage: "homepage",
          userType: "visitor",
          location: "Global",
        }}
        theme="auto"
        showAgentSelector={true}
        enableVoice={true}
        autoSuggest={true}
        persistConversation={true}
      />
    </div>
  );
}