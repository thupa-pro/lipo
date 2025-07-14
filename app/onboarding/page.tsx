"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { PremiumButton } from "@/components/ui/premium-button";
import {
  GlassmorphismCard,
  GlassmorphismCardContent,
  GlassmorphismCardDescription,
  GlassmorphismCardHeader,
  GlassmorphismCardTitle,
} from "@/components/ui/glassmorphism-card";
import {
  Brain,
  MapPin,
  Home,
  Car,
  Dumbbell,
  Scissors,
  Wrench,
  Baby,
  Dog,
  Camera,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Target,
  Heart,
  Shield,
  Crown,
  Gift,
} from "lucide-react";

interface UserPreferences {
  location: string;
  serviceTypes: string[];
  budget: string;
  frequency: string;
  priorities: string[];
  personalInfo: {
    hasKids: boolean;
    hasPets: boolean;
    homeType: string;
    lifestyle: string;
  };
}

export default function PremiumOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    location: "",
    serviceTypes: [],
    budget: "",
    frequency: "",
    priorities: [],
    personalInfo: {
      hasKids: false,
      hasPets: false,
      homeType: "",
      lifestyle: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const serviceCategories = [
    {
      id: "cleaning",
      name: "Home Cleaning",
      icon: Home,
      description: "Regular house cleaning",
    },
    {
      id: "maintenance",
      name: "Home Maintenance",
      icon: Wrench,
      description: "Repairs & upkeep",
    },
    {
      id: "fitness",
      name: "Personal Training",
      icon: Dumbbell,
      description: "Fitness & wellness",
    },
    {
      id: "beauty",
      name: "Beauty & Grooming",
      icon: Scissors,
      description: "Hair, nails, spa",
    },
    {
      id: "automotive",
      name: "Car Services",
      icon: Car,
      description: "Auto care & repair",
    },
    {
      id: "childcare",
      name: "Childcare",
      icon: Baby,
      description: "Babysitting & tutoring",
    },
    {
      id: "petcare",
      name: "Pet Care",
      icon: Dog,
      description: "Walking, grooming, sitting",
    },
    {
      id: "photography",
      name: "Photography",
      icon: Camera,
      description: "Events & portraits",
    },
  ];

  const budgetRanges = [
    {
      id: "budget",
      label: "Budget-friendly",
      range: "$25-75",
      description: "Great value options",
    },
    {
      id: "standard",
      label: "Standard",
      range: "$75-150",
      description: "Quality services",
    },
    {
      id: "premium",
      label: "Premium",
      range: "$150-300",
      description: "High-end providers",
    },
    {
      id: "luxury",
      label: "Luxury",
      range: "$300+",
      description: "Exclusive experiences",
    },
  ];

  const priorities = [
    { id: "price", name: "Best Price", icon: Target },
    { id: "quality", name: "Highest Quality", icon: Star },
    { id: "speed", name: "Quick Response", icon: Zap },
    { id: "reliability", name: "Reliability", icon: Shield },
    { id: "reviews", name: "Great Reviews", icon: Heart },
  ];

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

  const handleServiceToggle = (serviceId: string) => {
    setPreferences((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceId)
        ? prev.serviceTypes.filter((id) => id !== serviceId)
        : [...prev.serviceTypes, serviceId],
    }));
  };

  const handlePriorityToggle = (priorityId: string) => {
    setPreferences((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(priorityId)
        ? prev.priorities.filter((id) => id !== priorityId)
        : [...prev.priorities, priorityId],
    }));
  };

  const handleFinish = async () => {
    setIsLoading(true);

    // Simulate AI profile creation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    toast({
      title: "🎉 Profile Created!",
      description:
        "Your AI-powered service preferences have been set up successfully!",
      variant: "default",
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GlassmorphismCard variant="premium" className="mx-auto max-w-2xl">
            <GlassmorphismCardHeader className="text-center">
              <GlassmorphismCardTitle>
                Welcome to Loconomy! 🎉
              </GlassmorphismCardTitle>
              <GlassmorphismCardDescription>
                Let's personalize your experience with AI-powered
                recommendations
              </GlassmorphismCardDescription>
            </GlassmorphismCardHeader>
            <GlassmorphismCardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white font-medium">
                  What's your location?
                </Label>
                <Input
                  id="location"
                  placeholder="Enter your city or ZIP code"
                  value={preferences.location}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
              </div>

              <div className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/90">
                    <Brain className="w-4 h-4" />
                    AI-Powered Matching
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Shield className="w-4 h-4" />
                    Verified Providers
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Zap className="w-4 h-4" />
                    Instant Booking
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Gift className="w-4 h-4" />
                    Special Offers
                  </div>
                </div>
              </div>
            </GlassmorphismCardContent>
          </GlassmorphismCard>
        );

      case 2:
        return (
          <Card className="mx-auto max-w-4xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                What services interest you?
              </CardTitle>
              <CardDescription>
                Select all that apply - our AI will learn your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {serviceCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = preferences.serviceTypes.includes(
                    category.id,
                  );

                  return (
                    <div
                      key={category.id}
                      onClick={() => handleServiceToggle(category.id)}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-center space-y-3">
                        <div
                          className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">
                            {category.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {category.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-blue-500 mx-auto" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle>What's your typical budget?</CardTitle>
              <CardDescription>
                This helps us show you the most relevant options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={preferences.budget}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, budget: value }))
                }
                className="space-y-3"
              >
                {budgetRanges.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <RadioGroupItem value={budget.id} id={budget.id} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={budget.id}
                          className="font-medium cursor-pointer"
                        >
                          {budget.label}
                        </Label>
                        <Badge variant="secondary">{budget.range}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {budget.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle>What matters most to you?</CardTitle>
              <CardDescription>
                Select your top priorities (choose up to 3)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorities.map((priority) => {
                  const Icon = priority.icon;
                  const isSelected = preferences.priorities.includes(
                    priority.id,
                  );
                  const isDisabled =
                    !isSelected && preferences.priorities.length >= 3;

                  return (
                    <div
                      key={priority.id}
                      onClick={() =>
                        !isDisabled && handlePriorityToggle(priority.id)
                      }
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/25"
                          : isDisabled
                            ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:scale-105"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-purple-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{priority.name}</h3>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-purple-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-center text-sm text-slate-500">
                {preferences.priorities.length}/3 priorities selected
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle>Tell us a bit more about you</CardTitle>
              <CardDescription>
                This helps our AI provide even better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Do you have kids?
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasKids"
                      checked={preferences.personalInfo.hasKids}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            hasKids: !!checked,
                          },
                        }))
                      }
                    />
                    <Label htmlFor="hasKids" className="text-sm">
                      Yes, I have children
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Do you have pets?
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPets"
                      checked={preferences.personalInfo.hasPets}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            hasPets: !!checked,
                          },
                        }))
                      }
                    />
                    <Label htmlFor="hasPets" className="text-sm">
                      Yes, I have pets
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Home Type</Label>
                <RadioGroup
                  value={preferences.personalInfo.homeType}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, homeType: value },
                    }))
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  {["Apartment", "House", "Condo", "Townhouse"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.toLowerCase()} id={type} />
                      <Label htmlFor={type} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Lifestyle</Label>
                <RadioGroup
                  value={preferences.personalInfo.lifestyle}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lifestyle: value },
                    }))
                  }
                  className="space-y-2"
                >
                  {[
                    { id: "busy", label: "Very busy - need convenience" },
                    { id: "flexible", label: "Flexible schedule" },
                    { id: "quality", label: "Quality over speed" },
                    { id: "budget", label: "Budget-conscious" },
                  ].map((lifestyle) => (
                    <div
                      key={lifestyle.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={lifestyle.id} id={lifestyle.id} />
                      <Label htmlFor={lifestyle.id} className="text-sm">
                        {lifestyle.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 py-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Let's Set Up Your Profile
            </h1>
            <p className="text-slate-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Progress
              value={progress}
              className="h-3 bg-white/50 rounded-full"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Getting Started</span>
              <span>Complete</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <PremiumButton
              variant="premium"
              onClick={handleFinish}
              loading={isLoading}
              rightIcon={<Crown className="w-4 h-4" />}
              className="px-8"
            >
              {isLoading ? "Creating Your Profile..." : "Complete Setup"}
            </PremiumButton>
          ) : (
            <PremiumButton
              variant="default"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              disabled={
                (currentStep === 1 && !preferences.location) ||
                (currentStep === 2 && preferences.serviceTypes.length === 0) ||
                (currentStep === 3 && !preferences.budget) ||
                (currentStep === 4 && preferences.priorities.length === 0)
              }
            >
              Next Step
            </PremiumButton>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index + 1 <= currentStep
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
