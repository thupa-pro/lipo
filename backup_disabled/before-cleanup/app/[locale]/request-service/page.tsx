"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  Briefcase,
  User,
  Sparkles,
  Brain,
  Shield,
  Zap,
  Heart,
  Target,
  Award,
  TrendingUp,
  Search,
  ArrowRight,
  Eye,
  Phone,
  Mail,
  Camera,
  FileImage,
  Home,
  Wrench,
  PawPrint,
  BookOpen,
  Leaf,
  Truck,
  Car,
  Palette,
  PartyPopper,
  Users,
  Activity,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const serviceCategories = [
  {
    name: "House, Cleaning",
    icon: Home,
    popular: true,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    name: "Handyman Services",
    icon: Wrench,
    popular: true,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    name: "Pet Care",
    icon: PawPrint,
    popular: false,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "Tutoring",
    icon: BookOpen,
    popular: false,
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    name: "Gardening",
    icon: Leaf,
    popular: true,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "Moving & Delivery",
    icon: Truck,
    popular: false,
    gradient: "from-purple-500 to-violet-600",
  },
  {
    name: "Auto Services",
    icon: Car,
    popular: false,
    gradient: "from-slate-500 to-gray-600",
  },
  {
    name: "Beauty & Wellness",
    icon: Palette,
    popular: true,
    gradient: "from-pink-500 to-purple-600",
  },
  {
    name: "Event Services",
    icon: PartyPopper,
    popular: false,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "Other",
    icon: Sparkles,
    popular: false,
    gradient: "from-cyan-500 to-teal-600",
  },
];

const budgetRanges = [
  { range: "Under $50", value: "under-50", popular: false },
  { range: "$50 - $100", value: "50-100", popular: true },
  { range: "$100 - $200", value: "100-200", popular: true },
  { range: "$200 - $500", value: "200-500", popular: false },
  { range: "$500+", value: "500-plus", popular: false },
  { range: "Flexible", value: "flexible", popular: true },
];

const urgencyOptions = [
  {
    label: "ASAP (within 24 hours)",
    value: "asap",
    color: "from-red-500 to-orange-500",
    icon: Zap,
  },
  {
    label: "This week",
    value: "week",
    color: "from-amber-500 to-yellow-500",
    icon: Calendar,
  },
  {
    label: "This month",
    value: "month",
    color: "from-blue-500 to-cyan-500",
    icon: Clock,
  },
  {
    label: "Flexible timing",
    value: "flexible",
    color: "from-emerald-500 to-green-500",
    icon: Heart,
  },
];

const benefits = [
  {
    icon: Brain,
    title: "AI Matching",
    desc: "Smart provider recommendations",
    color: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Verified Pros",
    desc: "100% background checked",
    color: "text-emerald-600",
  },
  {
    icon: Zap,
    title: "Quick Response",
    desc: "Get quotes in minutes",
    color: "text-amber-600",
  },
  {
    icon: Heart,
    title: "Satisfaction Guaranteed",
    desc: "100% money-back guarantee",
    color: "text-rose-600",
  },
];

const featuredStats = [
  {
    label: "Average Response Time",
    value: "< 15min",
    icon: Clock,
    color: "from-blue-500 to-cyan-600",
  },
  {
    label: "Success Rate",
    value: "99.7%",
    icon: CheckCircle,
    color: "from-emerald-500 to-teal-600",
  },
  {
    label: "Active Providers",
    value: "5.2K+",
    icon: Users,
    color: "from-purple-500 to-violet-600",
  },
  {
    label: "Services Completed",
    value: "47K+",
    icon: Award,
    color: "from-indigo-500 to-blue-600",
  },
];

export default function RequestServicePage() {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    location: "",
    budget: "",
    urgency: "",
    preferredDate: "",
    contactMethod: "both",
    phone: "",
    email: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "🎉 Service Request Submitted!",
      description:
        "We're matching you with the perfect professionals. You'll hear from us within 15 minutes!",
      variant: "default",
    });

    setIsSubmitting(false);
  };

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

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Hero Header */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/95 dark:bg-slate-800/80 backdrop-blur-xl border border-blue-300/60 dark:border-blue-400/30 mb-8 group hover:bg-blue-50/80 dark:hover:bg-slate-700/60 transition-all duration-500 shadow-xl">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              AI-Powered Service Matching • 99.7% Success Rate
            </span>
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
              Request Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300 bg-clip-text text-transparent">
              Perfect Service
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            Get matched with
            <span className="text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text font-semibold">
              {" "}
              AI-verified professionals{" "}
            </span>
            in under 15 minutes. Our intelligent matching finds the best fit for
            your needs.
          </p>

          {/* Benefits Bar */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${benefit.color === "text-blue-600" ? "from-blue-500 to-cyan-500" : benefit.color === "text-emerald-600" ? "from-emerald-500 to-teal-500" : benefit.color === "text-amber-600" ? "from-amber-500 to-orange-500" : "from-rose-500 to-pink-500"} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {benefit.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {benefit.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStats.map((stat, index) => (
              <Card
                key={index}
                className="relative bg-white/95 dark:bg-slate-800/80 backdrop-blur-xl border-blue-300/50 dark:border-blue-400/30 rounded-3xl p-6 group hover:bg-blue-50/60 dark:hover:bg-slate-700/60 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`,
                  }}
                />
                <CardContent className="p-0 relative z-10 text-center">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-black mb-1 text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="max-w-5xl mx-auto">
          {/* Enhanced Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Step {currentStep} of {totalSteps}
                </span>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {currentStep === 1 && "Choose your service category"}
                  {currentStep === 2 && "Tell us about your project"}
                  {currentStep === 3 && "Set budget and timeline"}
                  {currentStep === 4 && "Contact information"}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {Math.round((currentStep / totalSteps) * 100)}%
                </span>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Complete
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Enhanced Main Form Card */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-500 dark:via-indigo-500 dark:to-blue-700 rounded-3xl blur-xl opacity-15 dark:opacity-25" />
            <Card className="relative bg-white/98 dark:bg-slate-800/90 backdrop-blur-xl border-blue-300/60 dark:border-blue-400/30 shadow-2xl rounded-3xl">
              <CardContent className="p-10">
                {/* Step 1: Enhanced Service Category */}
                {currentStep === 1 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        What service do you need?
                      </h2>
                      <p className="text-xl text-slate-700 dark:text-slate-300">
                        Choose the category that best describes your service
                        request
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {serviceCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              category: category.name,
                            })
                          }
                          className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 ${
                            formData.category === category.name
                              ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 shadow-xl"
                              : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                          >
                            <category.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {category.name}
                          </div>
                          {category.popular && (
                            <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                              Popular
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Enhanced Service Details */}
                {currentStep === 2 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        Tell us about your project
                      </h2>
                      <p className="text-xl text-slate-700 dark:text-slate-300">
                        Provide details so we can match you with the right
                        professionals
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <Label
                          htmlFor="title"
                          className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 block"
                        >
                          Service Title *
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g., Deep cleaning for 3-bedroom house"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="h-14 bg-white/70 dark:bg-slate-700/50 border-blue-300 dark:border-blue-400/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 text-lg"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 block"
                        >
                          Project Description *
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your project in detail. Include any specific, requirements, preferences, or concerns..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="min-h-32 bg-white/70 dark:bg-slate-700/50 border-blue-300 dark:border-blue-400/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 resize-none text-lg"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="location"
                          className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 block"
                        >
                          Location *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500 dark:text-slate-400" />
                          <Input
                            id="location"
                            placeholder="Enter your address or zip code"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: e.target.value,
                              })
                            }
                            className="pl-14 h-14 bg-white/70 dark:bg-slate-700/50 border-blue-300 dark:border-blue-400/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 text-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Enhanced Budget & Timeline */}
                {currentStep === 3 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        Budget & Timeline
                      </h2>
                      <p className="text-xl text-slate-700 dark:text-slate-300">
                        Help us find providers that match your budget and
                        schedule
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10">
                      <div>
                        <Label className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 block">
                          Budget Range *
                        </Label>
                        <div className="space-y-4">
                          {budgetRanges.map((budget, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  budget: budget.value,
                                })
                              }
                              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                                formData.budget === budget.value
                                  ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 shadow-xl"
                                  : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-slate-700/30"
                              }`}
                            >
                              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                {budget.range}
                              </span>
                              {budget.popular && (
                                <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                                  Popular
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 block">
                          When do you need this done? *
                        </Label>
                        <div className="space-y-4">
                          {urgencyOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  urgency: option.value,
                                })
                              }
                              className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                                formData.urgency === option.value
                                  ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 shadow-xl"
                                  : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-slate-700/30"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${option.color} flex items-center justify-center shadow-lg`}
                                >
                                  <option.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                  {option.label}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Enhanced Contact Information */}
                {currentStep === 4 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        How can providers reach you?
                      </h2>
                      <p className="text-xl text-slate-700 dark:text-slate-300">
                        We'll share your contact info only with verified
                        professionals
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 block"
                          >
                            Email Address *
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500 dark:text-slate-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="pl-14 h-14 bg-white/70 dark:bg-slate-700/50 border-blue-300 dark:border-blue-400/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 text-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 block"
                          >
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500 dark:text-slate-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="(555) 123-4567"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              className="pl-14 h-14 bg-white/70 dark:bg-slate-700/50 border-blue-300 dark:border-blue-400/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 text-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Summary Card */}
                      <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-8 border border-blue-300/50 dark:border-blue-400/30 shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                          <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          Request Summary
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 text-slate-700 dark:text-slate-300">
                          <div className="space-y-3">
                            <div>
                              <strong className="text-slate-900 dark:text-slate-100">
                                Service:
                              </strong>{" "}
                              {formData.category || "Not selected"}
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-slate-100">
                                Title:
                              </strong>{" "}
                              {formData.title || "Not specified"}
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-slate-100">
                                Location:
                              </strong>{" "}
                              {formData.location || "Not specified"}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <strong className="text-slate-900 dark:text-slate-100">
                                Budget:
                              </strong>{" "}
                              {budgetRanges.find(
                                (b) => b.value === formData.budget,
                              )?.range || "Not specified"}
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-slate-100">
                                Timeline:
                              </strong>{" "}
                              {urgencyOptions.find(
                                (u) => u.value === formData.urgency,
                              )?.label || "Not specified"}
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-slate-100">
                                Contact:
                              </strong>{" "}
                              {formData.email || "Not provided"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Navigation Buttons */}
                <div className="flex items-center justify-between mt-16 pt-8 border-t border-slate-300 dark:border-slate-600">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="rounded-2xl border-blue-300 dark:border-blue-400/40 hover:bg-blue-50 dark:hover:bg-slate-700/50 hover:border-blue-500 dark:hover:border-blue-300 transition-all duration-300 px-8 py-3 text-lg font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 && !formData.category) ||
                        (currentStep === 2 &&
                          (!formData.title ||
                            !formData.description ||
                            !formData.location)) ||
                        (currentStep === 3 &&
                          (!formData.budget || !formData.urgency))
                      }
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-400 dark:hover:to-indigo-500 text-white rounded-2xl font-bold px-8 py-3 text-lg transition-all duration-300 shadow-lg hover:shadow-blue-600/30 dark:hover:shadow-blue-500/30 hover:scale-105"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.email || isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-400 dark:hover:to-indigo-500 text-white rounded-2xl font-bold px-8 py-3 text-lg transition-all duration-300 shadow-lg hover:shadow-blue-600/30 dark:hover:shadow-blue-500/30 hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-blue-300/50 dark:border-blue-400/30 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    Secure & Private
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    SSL encrypted
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    4.9★ Average Rating
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    From 47K+ reviews
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    100% Verified
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Background checked
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA for browsing */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-8 border border-blue-300/50 dark:border-blue-400/30">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Want to browse providers first?
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Explore our verified professionals and find the perfect match
                for your needs.
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-blue-300 dark:border-blue-400/40 hover:bg-blue-50 dark:hover:bg-slate-700/50 hover:border-blue-500 dark:hover:border-blue-300 transition-all duration-300 px-8 py-3 text-lg font-semibold text-slate-800 dark:text-slate-200"
              >
                <Link href="/browse">
                  <Search className="w-5 h-5 mr-3" />
                  Browse Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
