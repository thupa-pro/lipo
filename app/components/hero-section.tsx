"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PremiumTypewriter } from "@/components/ui/typewriter-text";
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
  const [typewriterComplete, setTypewriterComplete] = useState(false);
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
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5813ae9f923e4ec2a07d2e1543fb6d54?alt=media&token=0ef56f97-041d-49cb-9f80-00350ad0d93b&apiKey=efd5169b47d04c9886e111b6074edfba"
          alt="Loconomy Hero Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-ai-50/80 to-primary-50/80 dark:from-background/95 dark:via-ai-900/20 dark:to-primary-900/20" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-ai/20 to-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-trust/20 to-ai/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-premium/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-10" />

      <div className="relative container mx-auto px-4 py-16 lg:py-32 z-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 card-glass rounded-full px-4 lg:px-6 py-2 lg:py-3 mb-6 lg:mb-8 animate-fade-in-down">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-amber-500" />
                <span className="text-xs lg:text-sm font-semibold text-ai-gradient">
                  Trusted by 50,000+ Users
                </span>
              </div>
              <div className="w-1 h-3 lg:h-4 bg-border" />
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 lg:w-4 lg:h-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>
              <span className="text-xs lg:text-sm font-medium text-muted-foreground">
                4.9/5
              </span>
            </div>

            {/* Main Headline with Premium Typewriter Effect */}
            <h1 className="mb-6 lg:mb-8 leading-tight typewriter-container relative">
              <PremiumTypewriter
                startDelay={800}
                className="typewriter-text-glow"
              />
              {/* Subtle glow effect that appears during typing */}
              <div className="absolute -inset-4 bg-gradient-to-r from-ai/5 via-primary/5 to-trust/5 rounded-3xl blur-xl opacity-0 animate-pulse pointer-events-none"
                   style={{
                     animation: isVisible ? "fade-in 2s ease-out 2s forwards, pulse 4s ease-in-out 3s infinite" : "none"
                   }} />
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 lg:mb-12 max-w-3xl leading-relaxed font-medium">
              Connect with verified, elite service providers in your area. From
              home maintenance to personal services, experience the future of
              local commerce with AI-powered matching.
            </p>

            {/* Premium Search Bar */}
            <div
              className="max-w-4xl mb-8 lg:mb-12 animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="card-glass rounded-xl lg:rounded-2xl p-2 lg:p-3">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 lg:w-5 lg:h-5" />
                    <Input
                      placeholder="Search premium services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 lg:pl-12 h-12 lg:h-14 border-0 input-glass text-base lg:text-lg font-medium rounded-lg lg:rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 lg:w-5 lg:h-5" />
                    <Input
                      placeholder="Enter your location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 lg:pl-12 h-12 lg:h-14 border-0 input-glass text-base lg:text-lg font-medium rounded-lg lg:rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <Button
                    size="lg"
                    onClick={handleSearch}
                    className="btn-ai-primary h-12 lg:h-14 px-6 lg:px-8 text-white font-semibold rounded-lg lg:rounded-xl w-full lg:w-auto text-sm lg:text-base"
                  >
                    <Search className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" />
                    Find Services
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-3 lg:gap-4 mb-12 lg:mb-16 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 w-full sm:w-auto text-sm lg:text-base"
              >
                <Link href="/request-service">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 lg:mr-2" />
                  Book Instantly
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300 w-full sm:w-auto text-sm lg:text-base"
              >
                <Link href="/become-provider">
                  <Users className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 lg:mr-2" />
                  Earn Premium Income
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-300 w-full sm:w-auto text-sm lg:text-base"
                onClick={() =>
                  toast({
                    title: "Premium Demo",
                    description:
                      "Watch how elite providers deliver exceptional service",
                    variant: "default",
                  })
                }
              >
                <Play className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 lg:mr-2" />
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
                  <div className="font-bold text-sm">&lt; 30 mins</div>
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
