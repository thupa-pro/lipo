import { createClient as createClientClient } from "@/lib/supabase/client";
import {
  OnboardingProgress,
  OnboardingStep,
  ConsumerProfile,
  ProviderProfile,
} from "./types";

// Client-side utilities
export function useOnboardingClient() {
  const supabase = createClientClient();

  return {
    async getProgress(userId: string): Promise<OnboardingProgress | null> {
      const { data, error } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) return null;
      return data as OnboardingProgress;
    },

    async updateProgress(
      userId: string,
      step: OnboardingStep,
      data?: Record<string, any>,
    ): Promise<boolean> {
      const { error } = await supabase.rpc("update_onboarding_progress", {
        p_user_id: userId,
        p_step: step,
        p_data: data || {},
      });

      return !error;
    },

    async saveConsumerProfile(
      userId: string,
      profile: Partial<ConsumerProfile>,
    ): Promise<boolean> {
      const { error } = await supabase.from("consumer_profiles").upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });

      return !error;
    },

    async saveProviderProfile(
      userId: string,
      profile: Partial<ProviderProfile>,
    ): Promise<boolean> {
      const { error } = await supabase.from("provider_profiles").upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });

      return !error;
    },
  };
}

// Step progression logic
export function getNextStep(
  currentStep: OnboardingStep,
  role: "consumer" | "provider",
): OnboardingStep | null {
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
  const currentIndex = steps.indexOf(currentStep);

  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null;
  }

  return steps[currentIndex + 1];
}

export function getPreviousStep(
  currentStep: OnboardingStep,
  role: "consumer" | "provider",
): OnboardingStep | null {
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
  const currentIndex = steps.indexOf(currentStep);

  if (currentIndex <= 0) {
    return null;
  }

  return steps[currentIndex - 1];
}

export function getStepProgress(
  currentStep: OnboardingStep,
  role: "consumer" | "provider",
): { current: number; total: number; percentage: number } {
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
  const current = steps.indexOf(currentStep) + 1;
  const total = steps.length;
  const percentage = Math.round((current / total) * 100);

  return { current, total, percentage };
}

export function isStepCompleted(
  step: OnboardingStep,
  completedSteps: OnboardingStep[],
): boolean {
  return completedSteps.includes(step);
}

export function canAccessStep(
  targetStep: OnboardingStep,
  currentStep: OnboardingStep,
  completedSteps: OnboardingStep[],
  role: "consumer" | "provider",
): boolean {
  // Can always access completed steps
  if (isStepCompleted(targetStep, completedSteps)) {
    return true;
  }

  // Can access current step
  if (targetStep === currentStep) {
    return true;
  }

  // Can access next step if current step is completed
  const nextStep = getNextStep(currentStep, role);
  if (targetStep === nextStep && isStepCompleted(currentStep, completedSteps)) {
    return true;
  }

  return false;
}
