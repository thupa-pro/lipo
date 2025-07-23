"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
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
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const serviceCategories = [
  { name: "House, Cleaning", icon: "🏠", popular: true },
  { name: "Handyman, Services", icon: "🔧", popular: true },
  { name: "Pet, Care", icon: "🐕", popular: false },
  { name: "Tutoring", icon: "📚", popular: false },
  { name: "Gardening", icon: "🌱", popular: true },
  { name: "Moving & Delivery", icon: "📦", popular: false },
  { name: "Auto, Services", icon: "🚗", popular: false },
  { name: "Beauty & Wellness", icon: "💅", popular: true },
  { name: "Event Services", icon: "🎉", popular: false },
  { name: "Other", icon: "✨", popular: false },
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
  },
  { label: "This week", value: "week", color: "from-amber-500 to-yellow-500" },
  { label: "This month", value: "month", color: "from-blue-500 to-cyan-500" },
  {
    label: "Flexible timing",
    value: "flexible",
    color: "from-emerald-500 to-green-500",
  },
];

const benefits = [
  { icon: Brain, title: "AI Matching", desc: "Smart provider recommendations" },
  { icon: Shield, title: "Verified Pros", desc: "100% background checked" },
  { icon: Zap, title: "Quick Response", desc: "Get quotes in minutes" },
  {
    icon: Heart,
    title: "Satisfaction Guaranteed",
    desc: "100% money-back guarantee",
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
    preferredDate: null as Date | null,
    contactMethod: "both",
    phone: "",
    email: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.category)
          errors.category = "Please select a service category";
        break;
      case 2:
        if (!formData.title?.trim()) errors.title = "Service title is required";
        if (!formData.description?.trim())
          errors.description = "Description is required";
        if (!formData.location?.trim())
          errors.location = "Location is required";
        break;
      case 3:
        if (!formData.budget) errors.budget = "Please select a budget range";
        if (!formData.urgency) errors.urgency = "Please select timeline";
        break;
      case 4:
        if (!formData.email?.trim()) errors.email = "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          errors.email = "Please enter a valid email address";
        }
        if (formData.phone && !/^[\d\s\(\)\-\+]+$/.test(formData.phone)) {
          errors.phone = "Please enter a valid phone number";
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setValidationErrors({});
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

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-6 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              AI-Powered Service Matching
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Request Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Perfect Service
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get matched with
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              verified professionals{" "}
            </span>
            in minutes. Our AI finds the best match for your needs.
          </p>

          {/* Benefits Bar */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 opacity-80">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <benefit.icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm text-slate-600 dark:text-gray-300">
                  {benefit.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600 dark:text-gray-300">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-slate-500 dark:text-gray-400">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Form Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30" />
            <Card className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 shadow-2xl rounded-3xl">
              <CardContent className="p-8">
                {/* Step 1: Service Category */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
                        What service do you need?
                      </h2>
                      <p className="text-slate-600 dark:text-gray-300">
                        Choose the category that best describes your service
                        request
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {serviceCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              category: category.name,
                            })
                          }
                          className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                            formData.category === category.name
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                              : "border-slate-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-white mb-1">
                            {category.name}
                          </div>
                          {category.popular && (
                            <Badge className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs">
                              Popular
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Service Details */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
                        Tell us about your project
                      </h2>
                      <p className="text-slate-600 dark:text-gray-300">
                        Provide details so we can match you with the right
                        professionals
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label
                          htmlFor="title"
                          className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block"
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
                          className="h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block"
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
                          className="min-h-32 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="location"
                          className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block"
                        >
                          Location *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                            className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Budget & Timeline */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
                        Budget & Timeline
                      </h2>
                      <p className="text-slate-600 dark:text-gray-300">
                        Help us find providers that match your budget and
                        schedule
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <Label className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-4 block">
                          Budget Range *
                        </Label>
                        <div className="space-y-3">
                          {budgetRanges.map((budget, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  budget: budget.value,
                                })
                              }
                              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                                formData.budget === budget.value
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                  : "border-slate-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/5"
                              }`}
                            >
                              <span className="font-medium text-slate-800 dark:text-white">
                                {budget.range}
                              </span>
                              {budget.popular && (
                                <Badge className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs">
                                  Popular
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-4 block">
                          When do you need this done? *
                        </Label>
                        <div className="space-y-3">
                          {urgencyOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  urgency: option.value,
                                })
                              }
                              className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                                formData.urgency === option.value
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                  : "border-slate-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${option.color}`}
                                />
                                <span className="font-medium text-slate-800 dark:text-white">
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

                {/* Step 4: Contact Information */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
                        How can providers reach you?
                      </h2>
                      <p className="text-slate-600 dark:text-gray-300">
                        We'll share your contact info only with verified
                        professionals
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block"
                          >
                            Email Address *
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                              className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-lg font-medium text-slate-700 dark:text-gray-300 mb-3 block"
                          >
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                              className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Summary Card */}
                      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 rounded-2xl p-6 border border-blue-200/50 dark:border-white/10">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <Eye className="w-5 h-5 text-blue-500" />
                          Request Summary
                        </h3>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-gray-300">
                          <div>
                            <strong>Service:</strong> {formData.category}
                          </div>
                          <div>
                            <strong>Title:</strong>{" "}
                            {formData.title || "Not specified"}
                          </div>
                          <div>
                            <strong>Location:</strong>{" "}
                            {formData.location || "Not specified"}
                          </div>
                          <div>
                            <strong>Budget:</strong>{" "}
                            {budgetRanges.find(
                              (b) => b.value === formData.budget,
                            )?.range || "Not specified"}
                          </div>
                          <div>
                            <strong>Timeline:</strong>{" "}
                            {urgencyOptions.find(
                              (u) => u.value === formData.urgency,
                            )?.label || "Not specified"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
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
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.email || isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-600 dark:text-gray-300">
                  Secure & Private
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-slate-600 dark:text-gray-300">
                  4.9��� Average Rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-600 dark:text-gray-300">
                  100% Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
