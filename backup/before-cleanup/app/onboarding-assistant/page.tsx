"use client";

import OnboardingChatAssistant from "@/components/ai/OnboardingChatAssistant";

export default function OnboardingAssistantPage() {
  const handleStepComplete = (stepId: string) => {
    console.log("Step completed:", stepId);
  };

  const handleOnboardingComplete = () => {
    console.log("Onboarding completed!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Onboarding Assistant Demo</h1>
          <p className="text-gray-600 mt-2">
            Experience our AI-powered onboarding chat assistant that guides new users through setup
          </p>
        </div>
        
        <OnboardingChatAssistant 
          position="embedded"
          userType="customer"
          onStepComplete={handleStepComplete}
          onOnboardingComplete={handleOnboardingComplete}
        />
      </div>
    </div>
  );
}