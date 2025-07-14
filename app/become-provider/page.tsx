"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  DollarSign,
  Users,
  Clock,
  Shield,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Brain,
  Zap,
  Heart,
  Target,
  Award,
  Crown,
  Star,
  Rocket,
  Eye,
  Calendar,
  FileText,
  Camera,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface ProviderApplication {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
  };
  serviceInfo: {
    category: string;
    services: string[];
    experience: string;
    description: string;
  };
  businessInfo: {
    businessName: string;
    licenseNumber: string;
    insurance: boolean;
    pricing: string;
  };
  verification: {
    documents: File[];
    agreement: boolean;
    backgroundCheck: boolean;
  };
}

const serviceCategories = [
  {
    name: "House Cleaning",
    icon: "🏠",
    commission: "12%",
    demand: "High",
    earnings: "$2,500",
  },
  {
    name: "Handyman Services",
    icon: "🔧",
    commission: "10%",
    demand: "Very High",
    earnings: "$3,200",
  },
  {
    name: "Pet Care",
    icon: "🐕",
    commission: "15%",
    demand: "Medium",
    earnings: "$1,800",
  },
  {
    name: "Tutoring",
    icon: "📚",
    commission: "8%",
    demand: "High",
    earnings: "$2,800",
  },
  {
    name: "Gardening",
    icon: "🌱",
    commission: "12%",
    demand: "Medium",
    earnings: "$2,100",
  },
  {
    name: "Beauty & Wellness",
    icon: "💅",
    commission: "10%",
    demand: "High",
    earnings: "$2,900",
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Earn More",
    description: "Average providers earn 40% more than traditional methods",
    stat: "$3,200/month",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Users,
    title: "Quality Clients",
    description: "AI-matched customers who value your expertise",
    stat: "4.9★ Rating",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "Full Protection",
    description: "Comprehensive insurance and payment protection",
    stat: "100% Covered",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Brain,
    title: "Smart Tools",
    description: "AI-powered insights to grow your business",
    stat: "50% Growth",
    gradient: "from-indigo-500 to-purple-600",
  },
];

const steps = [
  {
    number: "01",
    title: "Quick Application",
    description: "Complete our streamlined application in under 10 minutes",
    icon: FileText,
    timeframe: "5-10 minutes",
  },
  {
    number: "02",
    title: "Verification Process",
    description: "We verify your credentials and run background checks",
    icon: Shield,
    timeframe: "24-48 hours",
  },
  {
    number: "03",
    title: "Profile Optimization",
    description: "AI helps optimize your profile for maximum visibility",
    icon: Brain,
    timeframe: "15 minutes",
  },
  {
    number: "04",
    title: "Start Earning",
    description: "Get matched with quality clients and start growing",
    icon: Rocket,
    timeframe: "Immediately",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    service: "House Cleaning",
    rating: 5,
    content:
      "Loconomy tripled my bookings in the first month. The AI matching is incredible!",
    earnings: "+250% income",
    avatar: "SC",
    location: "San Francisco, CA",
  },
  {
    name: "Mike Rodriguez",
    service: "Handyman",
    rating: 5,
    content:
      "Best decision I made for my business. Quality clients and fair pricing.",
    earnings: "+180% income",
    avatar: "MR",
    location: "Austin, TX",
  },
  {
    name: "Emma Thompson",
    service: "Pet Grooming",
    rating: 5,
    content:
      "The platform handles everything so I can focus on what I do best.",
    earnings: "+320% income",
    avatar: "ET",
    location: "Seattle, WA",
  },
];

export default function BecomeProviderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showApplication, setShowApplication] = useState(false);
  const [formData, setFormData] = useState<ProviderApplication>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
    },
    serviceInfo: {
      category: "",
      services: [],
      experience: "",
      description: "",
    },
    businessInfo: {
      businessName: "",
      licenseNumber: "",
      insurance: false,
      pricing: "",
    },
    verification: {
      documents: [],
      agreement: false,
      backgroundCheck: false,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const totalSteps = 4;

  const handleStartApplication = () => {
    setShowApplication(true);
  };

  const handleSubmitApplication = () => {
    toast({
      title: "🎉 Application Submitted!",
      description:
        "We'll review your application and get back to you within 24 hours.",
      variant: "default",
    });

    setTimeout(() => {
      router.push("/provider-resources");
    }, 2000);
  };

  if (showApplication) {
    // Application form would go here - keeping it simple for space
    return (
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 shadow-2xl rounded-3xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                    Provider Application
                  </h2>
                  <p className="text-slate-600 dark:text-gray-300">
                    This is a simplified version. The full application form
                    would have {totalSteps} steps.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className="h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block">
                      Service Category *
                    </Label>
                    <Select>
                      <SelectTrigger className="h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl">
                        <SelectValue placeholder="Choose your service category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((category, index) => (
                          <SelectItem key={index} value={category.name}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSubmitApplication}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Submit Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
              Join 50K+ Successful Providers
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Grow Your Business
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Beyond Limits
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join the elite network of service providers who earn
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              40% more{" "}
            </span>
            with AI-powered client matching and premium tools.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center mx-auto mb-3`}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  {benefit.stat}
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  {benefit.title}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              onClick={handleStartApplication}
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
            >
              <Rocket className="w-5 h-5 mr-3" />
              Start Application
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Play className="w-5 h-5 mr-3" />
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 dark:opacity-60">
            {[
              { icon: Shield, text: "100% Verified" },
              { icon: DollarSign, text: "Guaranteed Payments" },
              { icon: Brain, text: "AI-Powered Growth" },
              { icon: Award, text: "Elite Network" },
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

      {/* Service Categories Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Choose Your Category
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find your perfect category and see potential earnings with real
              market data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardContent className="p-8 relative z-10">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                      {category.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-gray-400">
                          Commission:
                        </span>
                        <Badge className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">
                          {category.commission}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-gray-400">
                          Demand:
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-white">
                          {category.demand}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-gray-400">
                          Avg. Earnings:
                        </span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {category.earnings}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                      onClick={handleStartApplication}
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                How to Get Started
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of successful providers in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-8 relative z-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-3">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                    <Clock className="w-3 h-3 mr-1" />
                    {step.timeframe}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Real providers, real results. See how Loconomy transforms
              businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        {testimonial.service}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-emerald-400 text-emerald-400"
                      />
                    ))}
                  </div>

                  <p className="text-slate-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>

                  <Badge className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {testimonial.earnings}
                  </Badge>
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
                  Ready to Transform
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Your Business?
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                Join the elite network of providers who earn more, work smarter,
                and grow faster with Loconomy.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  onClick={handleStartApplication}
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
                >
                  <Crown className="w-5 h-5 mr-3" />
                  Apply Now - It's Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
                  onClick={() => router.push("/provider-resources")}
                >
                  <Eye className="w-5 h-5 mr-3" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
