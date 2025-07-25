"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  TrendingUp,
  Users,
  Play,
  Sparkles,
  Shield,
  ArrowRight,
  Star,
  Clock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5813ae9f923e4ec2a07d2e1543fb6d54?alt=media&token=0ef56f97-041d-49cb-9f80-00350ad0d93b&apiKey=efd5169b47d04c9886e111b6074edfba"
          alt="Loconomy Hero Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-100/80 dark:from-slate-950/90 dark:via-blue-950/90 dark:to-indigo-950/90" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-10" />

      <div className="relative container mx-auto px-4 py-20 lg:py-32 z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 glass-strong rounded-full px-6 py-3 mb-8 animate-fade-in-down">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Trusted by 50,000+ Users
                </span>
              </div>
              <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-slate-700 text-slate-700 dark:fill-white dark:text-white"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                4.9/5
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="text-hero-premium">Premium Local Services</span>
              <br />
              <span className="text-gray-900 dark:text-white">
                At Your Fingertips
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl leading-relaxed font-medium">
              Connect with verified, elite service providers in your area. From
              home maintenance to personal services, experience the future of
              local commerce with AI-powered matching.
            </p>

            {/* Premium Search Bar */}
            <div
              className="max-w-4xl mb-12 animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="glass-ultra rounded-2xl p-3 shadow-2xl">
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search premium services (e.g., 'luxury house cleaning')"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-lg font-medium rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Enter your location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-12 h-14 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-lg font-medium rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <Button
                    size="lg"
                    onClick={handleSearch}
                    className="h-14 px-8 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Find Services
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div
              className="flex flex-wrap gap-4 mb-16 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300"
              >
                <Link href="/request-service">
                  <Clock className="w-4 h-4 mr-2" />
                  Book Instantly
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300"
              >
                <Link href="/become-provider">
                  <Users className="w-4 h-4 mr-2" />
                  Earn Premium Income
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-300"
                onClick={() =>
                  toast({
                    title: "Premium Demo",
                    description:
                      "Watch how elite providers deliver exceptional service",
                    variant: "default",
                  })
                }
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Content - Featured Images */}
          <div className="relative">
            {/* Main Hero Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F8010a38e78d1406babeedcbc69aea72d?alt=media&token=1cf23adc-c2b6-4dcb-b339-31e346c86a39&apiKey=efd5169b47d04c9886e111b6074edfba"
                alt="Professional Service Provider"
                width={600}
                height={400}
                className="object-cover w-full h-auto"
              />
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -top-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 max-w-48">
              <div className="flex items-center gap-3">
                <Image
                  src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fa680612acb3849c2b1f9dc6486f6485f?alt=media&token=0086ec7b-4200-4e6f-b236-6cd8016503ab&apiKey=efd5169b47d04c9886e111b6074edfba"
                  alt="Service Quality"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-sm">5.0 Rating</div>
                  <div className="text-xs text-gray-500">Premium Quality</div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -bottom-8 -right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 max-w-48">
              <div className="flex items-center gap-3">
                <Image
                  src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fd3c87ccfc1444887934d07fc7e7dab29?alt=media&token=86deb8fe-c92e-47c0-8137-dc0e670dc3ec&apiKey=efd5169b47d04c9886e111b6074edfba"
                  alt="Fast Service"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-sm">< 30 mins</div>
                  <div className="text-xs text-gray-500">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-20 animate-slide-in-up"
          style={{ animationDelay: "0.9s" }}
        >
          {[
            {
              icon: Users,
              value: "50K+",
              label: "Active Users",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Shield,
              value: "250K+",
              label: "Jobs Completed",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: Star,
              value: "4.9",
              label: "Average Rating",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: MapPin,
              value: "1,200+",
              label: "Cities Served",
              color: "from-purple-500 to-pink-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-strong rounded-2xl p-6 hover:scale-105 transition-all duration-300 group"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-black mb-2 gradient-text">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}