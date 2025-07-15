import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Briefcase } from "lucide-react";
import { OnboardingStepProps } from "@/lib/onboarding/types";

export function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Loconomy!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's get you set up with everything you need to make the most of our
          hyperlocal marketplace platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              For Consumers
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Find local service providers
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Book services instantly
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Rate and review experiences
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Secure payments
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6 border border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              For Providers
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              List your services
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Manage bookings & schedule
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Build your reputation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Grow your business
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          This setup will take about 5 minutes and will help us personalize your
          experience.
        </p>
        <Button
          onClick={() => onNext()}
          className="flex items-center gap-2 px-8 py-3 text-lg"
          size="lg"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
