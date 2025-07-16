"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Users, Briefcase, ArrowRight } from "lucide-react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useOnboardingClient } from "@/lib/onboarding/utils";
import { OnboardingProgress } from "@/lib/onboarding/types";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const onboardingClient = useOnboardingClient();

  const [selectedRole, setSelectedRole] = useState<
    "consumer" | "provider" | null
  >(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // Get role from URL params if provided
  const roleParam = searchParams.get("role") as "consumer" | "provider" | null;

  useEffect(() => {
    if (isLoaded && user) {
      loadProgress();
    } else if (isLoaded && !user) {
      // Redirect to sign in if not authenticated
      router.push("/auth/signin?redirectTo=/onboarding");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (roleParam && ["consumer", "provider"].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  const loadProgress = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const userProgress = await onboardingClient.getProgress(user.id);
      setProgress(userProgress);

      if (userProgress?.role) {
        setSelectedRole(userProgress.role);
      }
    } catch (error) {
      console.error("Error loading onboarding progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeOnboarding = async (role: "consumer" | "provider") => {
    if (!user?.id) return;

    setIsInitializing(true);
    try {
      const success = await onboardingClient.updateProgress(
        user.id,
        "welcome",
        {
          role,
          started_at: new Date().toISOString(),
        },
      );

      if (success) {
        await loadProgress();
        toast({
          title: "Onboarding Started",
          description: `Let's set up your ${role} account!`,
        });
      } else {
        throw new Error("Failed to initialize onboarding");
      }
    } catch (error) {
      console.error("Error initializing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to start onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRoleSelection = async () => {
    if (selectedRole) {
      await initializeOnboarding(selectedRole);
    }
  };

  const handleOnboardingComplete = (data: Record<string, any>) => {
    toast({
      title: "🎉 Welcome to Loconomy!",
      description: "Your account has been set up successfully.",
    });

    // Redirect based on role
    setTimeout(() => {
      if (selectedRole === "provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/dashboard");
      }
    }, 1000);
  };

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If we have progress and a role, show the onboarding flow
  if (progress && selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="container mx-auto">
          <OnboardingFlow
            role={selectedRole}
            initialProgress={progress}
            onComplete={handleOnboardingComplete}
          />
        </div>
      </div>
    );
  }

  // Role selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Loconomy!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            The hyperlocal marketplace connecting communities
          </p>
          <p className="text-gray-500">
            Let's get you set up. What brings you here today?
          </p>
        </div>

        {/* Role Selection */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Choose Your Account Type
            </h2>

            <RadioGroup
              value={selectedRole || ""}
              onValueChange={(value) =>
                setSelectedRole(value as "consumer" | "provider")
              }
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Consumer Option */}
              <div
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                  selectedRole === "consumer"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedRole("consumer")}
              >
                <RadioGroupItem
                  value="consumer"
                  id="consumer"
                  className="absolute top-4 right-4"
                />
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      I'm a Customer
                    </h3>
                    <p className="text-gray-600 mb-4">
                      I want to find and book local services
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Find trusted local providers</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Book services instantly</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Secure payments & reviews</span>
                    </div>
                  </div>
                  {selectedRole === "consumer" && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>

              {/* Provider Option */}
              <div
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                  selectedRole === "provider"
                    ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/25"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedRole("provider")}
              >
                <RadioGroupItem
                  value="provider"
                  id="provider"
                  className="absolute top-4 right-4"
                />
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Briefcase className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      I'm a Service Provider
                    </h3>
                    <p className="text-gray-600 mb-4">
                      I want to offer my services to local customers
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>List your services</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Manage bookings & calendar</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Grow your business</span>
                    </div>
                  </div>
                  {selectedRole === "provider" && (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            </RadioGroup>

            {/* Continue Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleRoleSelection}
                disabled={!selectedRole || isInitializing}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting up your account...
                  </>
                ) : (
                  <>
                    Continue Setup
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform Benefits */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-center mb-6">
              Why Choose Loconomy?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Local Community</h4>
                <p className="text-sm text-gray-600">
                  Connect with trusted neighbors and local businesses
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Secure Platform</h4>
                <p className="text-sm text-gray-600">
                  Verified providers, secure payments, and reliable service
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Easy to Use</h4>
                <p className="text-sm text-gray-600">
                  Simple booking, clear communication, and hassle-free
                  experience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
