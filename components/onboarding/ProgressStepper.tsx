import React from "react";
import { OnboardingStep } from "@/lib/onboarding/types";
import { getStepProgress, isStepCompleted } from "@/lib/onboarding/utils";
import {  Circle, ArrowRight } from "lucide-react";

interface ProgressStepperProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  role: "consumer" | "provider";
}

export function ProgressStepper({
  currentStep,
  completedSteps,
  role,
}: ProgressStepperProps) {
  const { current, total, percentage } = getStepProgress(currentStep, role);

  const consumerSteps = [
    { key: "welcome", label: "Welcome", description: "Getting started" },
    {
      key: "profile_setup",
      label: "Profile",
      description: "Basic information",
    },
    { key: "preferences", label: "Preferences", description: "Your interests" },
    { key: "completion", label: "Complete", description: "All done!" },
  ] as const;

  const providerSteps = [
    { key: "welcome", label: "Welcome", description: "Getting started" },
    { key: "profile_setup", label: "Profile", description: "Business info" },
    {
      key: "service_categories",
      label: "Services",
      description: "What you offer",
    },
    {
      key: "service_details",
      label: "Details",
      description: "Service specifics",
    },
    { key: "pricing_setup", label: "Pricing", description: "Rates & payment" },
    { key: "availability", label: "Schedule", description: "When you work" },
    { key: "completion", label: "Complete", description: "All done!" },
  ] as const;

  const steps = role === "consumer" ? consumerSteps : providerSteps;

  const getStepStatus = (
    step: OnboardingStep,
  ): "completed" | "current" | "upcoming" => {
    if (isStepCompleted(step, completedSteps)) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
  };

  const getStepIcon = (step: OnboardingStep, index: number) => {
    const status = getStepStatus(step);

    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "current":
        return (
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {index + 1}
          </div>
        );
      case "upcoming":
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepStyles = (step: OnboardingStep) => {
    const status = getStepStatus(step);

    switch (status) {
      case "completed":
        return "text-green-600";
      case "current":
        return "text-blue-600 font-semibold";
      case "upcoming":
        return "text-gray-400";
    }
  };

  const getConnectorStyles = (index: number) => {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    return index < currentIndex ? "bg-green-600" : "bg-gray-300";
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {current} of {total}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {percentage}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="relative">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center mb-2">
                  {getStepIcon(step.key as OnboardingStep, index)}
                </div>
                <div className="text-center">
                  <div
                    className={`text-sm font-medium ${getStepStyles(step.key as OnboardingStep)}`}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-4 mt-6">
                  <div
                    className={`h-full transition-colors duration-300 ${getConnectorStyles(index)}`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {getStepIcon(step.key as OnboardingStep, index)}
                  <span
                    className={`text-sm whitespace-nowrap ${getStepStyles(step.key as OnboardingStep)}`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector for mobile */}
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Current Step Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-sm font-medium text-blue-900">
            Current Step: {steps.find((s) => s.key === currentStep)?.label}
          </span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          {steps.find((s) => s.key === currentStep)?.description}
        </p>
      </div>
    </div>
  );
}
