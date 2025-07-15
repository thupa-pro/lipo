import React from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingStep } from "@/lib/onboarding/types";
import { getStepProgress, isStepCompleted } from "@/lib/onboarding/utils";

interface ProgressStepperProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  role: "consumer" | "provider";
  className?: string;
}

const STEP_LABELS: Record<OnboardingStep, string> = {
  welcome: "Welcome",
  profile_setup: "Profile",
  preferences: "Preferences",
  service_categories: "Categories",
  service_details: "Service Details",
  pricing_setup: "Pricing",
  availability: "Availability",
  completion: "Complete",
};

export function ProgressStepper({
  currentStep,
  completedSteps,
  role,
  className,
}: ProgressStepperProps) {
  const consumerSteps: OnboardingStep[] = [
    "welcome",
    "profile_setup",
    "preferences",
    "completion",
  ];

  const providerSteps: OnboardingStep[] = [
    "welcome",
    "profile_setup",
    "service_categories",
    "service_details",
    "pricing_setup",
    "availability",
    "completion",
  ];

  const steps = role === "consumer" ? consumerSteps : providerSteps;
  const { current, total, percentage } = getStepProgress(currentStep, role);

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {current} of {total}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {percentage}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step, completedSteps);
          const isCurrent = step === currentStep;
          const isAccessible = index <= steps.indexOf(currentStep);

          return (
            <div key={step} className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  {
                    "bg-blue-600 text-white": isCurrent && !isCompleted,
                    "bg-green-600 text-white": isCompleted,
                    "bg-gray-200 text-gray-500":
                      !isAccessible && !isCurrent && !isCompleted,
                    "bg-gray-100 text-gray-700 border-2 border-gray-300":
                      isAccessible && !isCurrent && !isCompleted,
                  },
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4 fill-current" />
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-16 leading-tight",
                  {
                    "text-blue-600": isCurrent,
                    "text-green-600": isCompleted,
                    "text-gray-500":
                      !isAccessible && !isCurrent && !isCompleted,
                    "text-gray-700": isAccessible && !isCurrent && !isCompleted,
                  },
                )}
              >
                {STEP_LABELS[step]}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute h-0.5 w-full max-w-16 mt-4 transition-all duration-200",
                    {
                      "bg-green-600": isCompleted,
                      "bg-blue-600":
                        isCurrent && index < steps.indexOf(currentStep),
                      "bg-gray-200":
                        !isCompleted && index >= steps.indexOf(currentStep),
                    },
                  )}
                  style={{
                    left: `${((index + 0.5) / steps.length) * 100}%`,
                    width: `${(1 / steps.length) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
