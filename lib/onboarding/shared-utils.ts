import { OnboardingStep } from "./types";

// Step progression logic (shared between client and server)
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
