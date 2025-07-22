import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Shield,
  Clock,
  Award,
  Sparkles,
  Heart,
  ChevronRight,
  Zap,
  Target,
  Eye,
  TrendingUp,
  Users,
  Brain,
  CheckCircle,
  PlayCircle,
  MessageCircle,
  Activity,
  Globe,
} from "lucide-react";
import Link from "next/link";

const providers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    service: "House Cleaning",
    rating: 4.9,
    reviews: 247,
    price: "$35/hr",
    location: "Downtown",
    distance: "1.2 miles",
    verified: true,
    responseTime: "Usually responds in 2 hours",
    completedJobs: 892,
    aiOptimized: true,
    specialty: "Eco-Friendly Cleaning",
    trustScore: 98,
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    service: "Handyman Services",
    rating: 4.8,
    reviews: 189,
    price: "$45/hr",
    location: "Midtown",
    distance: "2.1 miles",
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 654,
    aiOptimized: true,
    specialty: "Smart Home Setup",
    trustScore: 96,
  },
  {
    id: 3,
    name: "Emma Thompson",
    service: "Pet Grooming",
    rating: 5.0,
    reviews: 312,
    price: "$60/session",
    location: "Uptown",
    distance: "3.4 miles",
    verified: true,
    responseTime: "Usually responds in 3 hours",
    completedJobs: 1205,
    aiOptimized: false,
    specialty: "Premium Pet Care",
    trustScore: 99,
  },
  {
    id: 4,
    name: "David Chen",
    service: "Personal Training",
    rating: 4.9,
    reviews: 428,
    price: "$75/session",
    location: "Central",
    distance: "1.8 miles",
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 890,
    aiOptimized: true,
    specialty: "Strength & Conditioning",
    trustScore: 97,
  },
];

const categories = [
  {
    name: "Home Cleaning",
    count: "2.4K",
    trend: "+12%",
    popular: true,
    icon: Shield,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    name: "Handyman",
    count: "1.8K",
    trend: "+8%",
    popular: true,
    icon: Award,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    name: "Pet Care",
    count: "0.9K",
    trend: "+15%",
    popular: false,
    icon: Heart,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "Fitness",
    count: "1.2K",
    trend: "+22%",
    popular: true,
    icon: Activity,
    gradient: "from-purple-500 to-violet-600",
  },
  {
    name: "Tutoring",
    count: "0.7K",
    trend: "+18%",
    popular: false,
    icon: Brain,
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    name: "Tech Support",
    count: "0.5K",
    trend: "+25%",
    popular: false,
    icon: Zap,
    gradient: "from-cyan-500 to-teal-600",
  },
];

const featuredStats = [
  {
    label: "Active Providers",
    value: "5.2K",
    icon: Users,
    trend: "+23%",
    color: "from-blue-500 to-cyan-600",
  },
  {
    label: "Services Completed",
    value: "47K",
    icon: CheckCircle,
    trend: "+185%",
    color: "from-emerald-500 to-teal-600",
  },
  {
    label: "AI Matches",
    value: "12.3M",
    icon: Brain,
    trend: "+312%",
    color: "from-purple-500 to-violet-600",
  },
  {
    label: "Avg Response",
    value: "<2h",
    icon: Clock,
    trend: "Real-time",
    color: "from-pink-500 to-rose-600",
  },
];

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
      {/* Animated Background - Same as Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              5.2K+ Elite Professionals Available Now
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Discover
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Excellence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with AI-matched, verified local professionals who deliver
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              exceptional quality service{" "}
            </span>
            right in your neighborhood.
          </p>

          {/* Search Interface */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-2 border border-blue-200/50 dark:border-white/20 shadow-xl">
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Find trusted local help near you..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-lg"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25">
                    Find Services
                    <MapPin className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500 group"
            >
              <Search className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Browse All Services
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
              asChild
            >
              <Link href="/request-service">
                Post a Request
                <ChevronRight className="w-5 h-5 ml-3" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 dark:opacity-60">
            {[
              { icon: Shield, text: "Verified Professionals" },
              { icon: Award, text: "5-Star Quality" },
              { icon: Zap, text: "Instant Booking" },
              { icon: Users, text: "Trusted Community" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300"
              >
                <item.icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Live Platform Stats
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time metrics from our revolutionary platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredStats.map((stat, index) => (
              <Card
                key={index}
                className="relative bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8 group hover:bg-white/10 transition-all duration-500 hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`,
                  }}
                />
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 mb-3 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-sm text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Service Categories
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find trusted professionals across all the services you need in
              your local area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl p-6 group hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                />
                <CardContent className="p-0 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    {category.popular && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-gray-400 text-sm">
                      {category.count} professionals
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                        {category.trend}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Featured Providers
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Meet some of our top-rated professionals ready to serve you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {providers.map((provider) => (
              <Card
                key={provider.id}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-[1.02] overflow-hidden shadow-xl hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardContent className="p-10 relative z-10">
                  <div className="flex items-start gap-8">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-white dark:border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <AvatarImage
                          src={`/placeholder.svg?height=96&width=96`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 dark:from-violet-600 dark:to-purple-600 text-white font-bold text-2xl">
                          {provider.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {provider.verified && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {provider.aiOptimized && (
                        <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg animate-pulse">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-bold text-2xl text-slate-800 dark:text-white">
                              {provider.name}
                            </h3>
                            {provider.verified && (
                              <Badge className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-3 py-1">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified Pro
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-gray-300 font-semibold text-lg mb-2">
                            {provider.service}
                          </p>
                          <p className="text-slate-500 dark:text-gray-400">
                            {provider.specialty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-3xl bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {provider.price}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm text-slate-500 dark:text-gray-400 font-medium">
                              Trust: {provider.trustScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                            <span className="font-bold text-slate-800 dark:text-white text-lg">
                              {provider.rating}
                            </span>
                          </div>
                          <span className="text-slate-500 dark:text-gray-400">
                            ({provider.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {provider.location} • {provider.distance}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-bold py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25 hover:scale-105">
                          Contact Provider
                          <MessageCircle className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 p-4 hover:scale-110"
                        >
                          <Heart className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur-2xl opacity-10 dark:opacity-20" />
            <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-blue-200/50 dark:border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                  Ready to Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Perfect Match?
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                Join over 2 million users who trust our platform to connect them
                with exceptional local professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
                  asChild
                >
                  <Link href="/request-service">
                    <Search className="w-5 h-5 mr-3" />
                    Request Service Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
                  asChild
                >
                  <Link href="/become-provider">
                    <Heart className="w-5 h-5 mr-3" />
                    Join as Provider
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
