"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ProgressStepper } from "./ProgressStepper";
import {
  OnboardingFlowProps,
  OnboardingStep,
  OnboardingProgress,
} from "@/lib/onboarding/types";
import { getNextStep, getPreviousStep } from "@/lib/onboarding/shared-utils";
import { useOnboardingClient } from "@/lib/onboarding/client-utils";

// Import step components
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProfileSetupStep } from "./steps/ProfileSetupStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { ServiceCategoriesStep } from "./steps/ServiceCategoriesStep";
import { ServiceDetailsStep } from "./steps/ServiceDetailsStep";
import { PricingSetupStep } from "./steps/PricingSetupStep";
import { AvailabilityStep } from "./steps/AvailabilityStep";
import { CompletionStep } from "./steps/CompletionStep";

export function OnboardingFlow({
  role,
  initialProgress,
  onComplete,
}: OnboardingFlowProps) {
  const { user } = useUser();
  const router = useRouter();
  const onboardingClient = useOnboardingClient();

  const [progress, setProgress] = useState<OnboardingProgress | null>(
    initialProgress || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  // Load progress if not provided
  useEffect(() => {
    if (!initialProgress && user?.id) {
      loadProgress();
    }
  }, [user?.id, initialProgress]);

  const loadProgress = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const userProgress = await onboardingClient.getProgress(user.id);
      setProgress(userProgress);
      if (userProgress?.data) {
        setStepData(userProgress.data);
      }
    } catch (error) {
      console.error("Error loading onboarding progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (
    step: OnboardingStep,
    data?: Record<string, any>,
  ) => {
    if (!user?.id) return false;

    setIsLoading(true);
    try {
      const success = await onboardingClient.updateProgress(
        user.id,
        step,
        data,
      );
      if (success) {
        // Reload progress to get updated state
        await loadProgress();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (data?: Record<string, any>) => {
    if (!progress) return;

    const currentStep = progress.current_step;
    const newStepData = { ...stepData, ...data };
    setStepData(newStepData);

    // Update current step as completed
    const success = await updateProgress(currentStep, newStepData);
    if (!success) return;

    const nextStep = getNextStep(currentStep, role);
    if (nextStep) {
      // Move to next step
      await updateProgress(nextStep, newStepData);
    } else {
      // Onboarding complete
      if (onComplete) {
        onComplete(newStepData);
      } else {
        // Default redirect based on role
        router.push(role === "provider" ? "/provider/dashboard" : "/dashboard");
      }
    }
  };

  const handlePrev = async () => {
    if (!progress) return;

    const prevStep = getPreviousStep(progress.current_step, role);
    if (prevStep) {
      await updateProgress(prevStep, stepData);
    }
  };

  const renderCurrentStep = () => {
    if (!progress) return null;

    const currentStep = progress.current_step;
    const stepProps = {
      onNext: handleNext,
      onPrev: handlePrev,
      initialData: stepData,
      isLastStep: getNextStep(currentStep, role) === null,
      currentStep,
    };

    switch (currentStep) {
      case "welcome":
        return <WelcomeStep {...stepProps} />;
      case "profile_setup":
        return <ProfileSetupStep {...stepProps} role={role} />;
      case "preferences":
        return <PreferencesStep {...stepProps} />;
      case "service_categories":
        return <ServiceCategoriesStep {...stepProps} />;
      case "service_details":
        return <ServiceDetailsStep {...stepProps} />;
      case "pricing_setup":
        return <PricingSetupStep {...stepProps} />;
      case "availability":
        return <AvailabilityStep {...stepProps} />;
      case "completion":
        return <CompletionStep {...stepProps} role={role} />;
      default:
        return <div>Unknown step: {currentStep}</div>;
    }
  };

  if (isLoading && !progress) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!progress) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            Unable to load onboarding progress. Please try again.
          </p>
          <Button onClick={loadProgress}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <ProgressStepper
            currentStep={progress.current_step}
            completedSteps={progress.completed_steps}
            role={role}
          />
        </CardHeader>
      </Card>

      {/* Current Step Content */}
      <Card>
        <CardContent className="p-8">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={
                isLoading ||
                getPreviousStep(progress.current_step, role) === null
              }
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isLoading && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
