"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MarketingLogo } from "@/components/ui/logo";
import {
  Search,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Play,
  Users,
  Brain,
  Globe,
  TrendingUp,
  Heart,
  Target,
  Award,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className="font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function EnhancedHeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      value: 2100000,
      suffix: "+",
      label: "Active Users",
      icon: Users,
      color: "from-blue-500 to-purple-600",
    },
    {
      value: 50,
      suffix: "M+",
      label: "AI Matches",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
    },
    {
      value: 99.7,
      suffix: "%",
      label: "Trust Score",
      icon: Shield,
      color: "from-emerald-500 to-teal-600",
    },
    {
      value: 180,
      suffix: "",
      label: "Countries",
      icon: Globe,
      color: "from-orange-500 to-red-600",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Smart algorithms connect you with perfect service providers"
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All providers are background-checked and verified"
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability"
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee or your money back"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with Animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/50 dark:to-purple-950/30">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-white/20 dark:bg-white/10 rounded-full animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Logo & Brand Badge */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center justify-center mb-6">
              <MarketingLogo className="h-16 w-auto" />
            </div>
            
            <Badge 
              variant="outline" 
              className="px-6 py-2 bg-white/80 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-medium">Trusted by 2.1M+ Users Globally</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </Badge>
          </div>

          {/* Main Headline */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-none mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                Local Services
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Connect with <span className="font-bold text-blue-600 dark:text-blue-400">verified professionals</span> through our{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">AI-powered platform</span> for premium local services
            </p>
          </div>

          {/* Search Bar */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="What service do you need? (e.g., plumber, cleaning, tutor)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-16 pr-32 text-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Search
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["House Cleaning", "Plumbing", "Tutoring", "Pet Care", "Landscaping"].map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-700/80 cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
                asChild
              >
                <Link href="/browse">
                  Explore Services
                  <Zap className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto h-14 px-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/demo" className="flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className={`transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                      <AnimatedCounter
                        end={stat.value}
                        suffix={stat.suffix}
                        duration={2000 + index * 200}
                      />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className={`transform transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border-slate-200/30 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}