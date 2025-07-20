"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  MapPin, 
  Star, 
  Shield, 
  Users, 
  Sparkles,
  Zap,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  Brain,
  Heart,
  Home,
  Quote,
  Phone,
  Camera,
  Wrench,
  Car,
  Laptop
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const stats = [
    { label: "Active Users", value: "2.1M+", icon: Users, trend: "+12%" },
    { label: "Services Completed", value: "850K+", icon: CheckCircle, trend: "+8%" },
    { label: "Average Rating", value: "4.9", icon: Star, trend: "+0.2" },
    { label: "Countries", value: "180+", icon: MapPin, trend: "Global" },
  ];

  const categories = [
    { name: "Home Services", icon: Home, count: "12.5K", color: "from-blue-500 to-indigo-600" },
    { name: "Health & Wellness", icon: Heart, count: "8.7K", color: "from-pink-500 to-rose-600" },
    { name: "Tech Support", icon: Laptop, count: "4.8K", color: "from-green-500 to-emerald-600" },
    { name: "Auto Services", icon: Car, count: "3.2K", color: "from-purple-500 to-violet-600" },
    { name: "Photography", icon: Camera, count: "2.9K", color: "from-yellow-500 to-orange-600" },
    { name: "Repairs", icon: Wrench, count: "5.1K", color: "from-red-500 to-pink-600" },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm finds the perfect service provider for your specific needs and location.",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All service providers are thoroughly vetted, verified, and continuously monitored for quality.",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability and immediate confirmation.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support to ensure your experience is always smooth.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "Found the perfect house cleaning service in minutes. The AI matching really works!",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      content: "The quality of professionals on this platform is exceptional. Highly recommended!",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Emily Rodriguez",
      role: "Busy Parent",
      content: "Saved me hours of searching. The instant booking feature is a game-changer.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
  ];

  const featuredServices = [
    {
      name: "Alex Thompson",
      service: "Premium Home Cleaning",
      rating: 4.9,
      reviews: 127,
      price: "$85/visit",
      location: "Manhattan, NY",
      verified: true,
      tags: ["Eco-friendly", "Insured", "Same-day"],
      avatar: "/placeholder.svg"
    },
    {
      name: "Maria Garcia",
      service: "Professional Photography",
      rating: 5.0,
      reviews: 89,
      price: "$150/hour",
      location: "Brooklyn, NY", 
      verified: true,
      tags: ["Wedding", "Portrait", "Event"],
      avatar: "/placeholder.svg"
    },
    {
      name: "David Kim",
      service: "Tech Support & Repair",
      rating: 4.8,
      reviews: 156,
      price: "$90/hour",
      location: "Queens, NY",
      verified: true,
      tags: ["24/7", "Certified", "Mobile"],
      avatar: "/placeholder.svg"
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
        <div className="max-w-6xl mx-auto text-center">
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
              Local Services
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Redefined
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

          {/* Search Interface */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-2 border border-blue-200/50 dark:border-white/20 shadow-xl">
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Find trusted local help near you..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-lg"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-8 py-3 font-semibold">
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
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-500"
              asChild
            >
              <Link href="/browse">
                <Search className="w-5 h-5 mr-3" />
                Find Services Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"
              asChild
            >
              <Link href="/become-provider">Become a Provider</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 dark:opacity-60">
            {[
              { icon: Shield, text: "Verified Professionals" },
              { icon: Star, text: "5-Star Quality" },
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
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-800 dark:text-white">
              Trusted by Millions
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400">
              Join our growing community of satisfied customers and verified professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <p className="text-slate-600 dark:text-gray-300 text-sm">
                    {category.count} providers
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-800 dark:text-white">
              Featured Professionals
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400">
              Meet some of our top-rated service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={service.avatar} alt={service.name} />
                      <AvatarFallback>{service.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg truncate">{service.name}</CardTitle>
                        {service.verified && (
                          <Shield className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{service.service}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{service.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
                  </div>

                  <div className="text-lg font-bold text-green-600">
                    {service.price}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {service.location}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {service.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" variant="outline">
                    View Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-800 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400">
              Get connected with the perfect service provider in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Tell Us What You Need",
                description: "Describe your service requirements and let our AI find the perfect match",
                icon: Search
              },
              {
                step: "02", 
                title: "Get Matched Instantly",
                description: "Our intelligent system connects you with verified professionals in your area",
                icon: Brain
              },
              {
                step: "03",
                title: "Book & Enjoy",
                description: "Schedule your service and enjoy professional, reliable results",
                icon: CheckCircle
              }
            ].map((step, index) => (
              <Card key={index} className="text-center bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
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

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-800 dark:text-white">
              What Our Customers Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400">
              Hear from satisfied customers who found their perfect service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 border-none text-white">
            <CardContent className="p-12">
              <h2 className="text-4xl font-black mb-6">
                Ready to Find Your Perfect Service Provider?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join millions of satisfied customers and start your journey today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-8 py-4 font-bold"
                  asChild
                >
                  <Link href="/browse">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 rounded-2xl px-8 py-4 font-bold"
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
