import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart } from "lucide-react";
import {
  OnboardingStepProps,
  CONSUMER_INTERESTS,
  ConsumerInterest,
} from "@/lib/onboarding/types";
import { useOnboardingClient } from "@/lib/onboarding/utils";

export function PreferencesStep({ onNext, initialData }: OnboardingStepProps) {
  const { user } = useUser();
  const onboardingClient = useOnboardingClient();

  const [preferences, setPreferences] = useState({
    service_categories: initialData?.preferences?.service_categories || [],
    notification_preferences: {
      email: initialData?.preferences?.notification_preferences?.email ?? true,
      sms: initialData?.preferences?.notification_preferences?.sms ?? false,
      push: initialData?.preferences?.notification_preferences?.push ?? true,
    },
    budget_range: {
      min: initialData?.preferences?.budget_range?.min || 25,
      max: initialData?.preferences?.budget_range?.max || 200,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: ConsumerInterest) => {
    setPreferences((prev) => ({
      ...prev,
      service_categories: prev.service_categories.includes(interest)
        ? prev.service_categories.filter((cat) => cat !== interest)
        : [...prev.service_categories, interest],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) throw new Error("User not found");

      // Save preferences to consumer profile
      const success = await onboardingClient.saveConsumerProfile(user.id, {
        preferences,
      });

      if (success) {
        onNext({ preferences });
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Set Your Preferences
        </h2>
        <p className="text-gray-600">
          Help us personalize your experience and show you relevant services.
        </p>
      </div>

      {/* Service Interests */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <Label className="text-lg font-medium">Service Interests</Label>
        </div>
        <p className="text-sm text-gray-600">
          Select the types of services you're most interested in:
        </p>
        <div className="flex flex-wrap gap-2">
          {CONSUMER_INTERESTS.map((interest) => (
            <Badge
              key={interest}
              variant={
                preferences.service_categories.includes(interest)
                  ? "default"
                  : "outline"
              }
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BusinessIcons.DollarSign className="w-5 h-5 text-green-500" / />
          <Label className="text-lg font-medium">Typical Budget Range</Label>
        </div>
        <p className="text-sm text-gray-600">
          What's your typical budget range for services?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_budget">Minimum ($)</Label>
            <input
              id="min_budget"
              type="number"
              min="0"
              step="5"
              value={preferences.budget_range.min}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  budget_range: {
                    ...prev.budget_range,
                    min: parseInt(e.target.value) || 0,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_budget">Maximum ($)</Label>
            <input
              id="max_budget"
              type="number"
              min="0"
              step="5"
              value={preferences.budget_range.max}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  budget_range: {
                    ...prev.budget_range,
                    max: parseInt(e.target.value) || 0,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          This helps us show you services within your price range.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          <Label className="text-lg font-medium">
            Notification Preferences
          </Label>
        </div>
        <p className="text-sm text-gray-600">
          How would you like to receive updates?
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">
                Service, updates, booking, confirmations, and promotions
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.notification_preferences.email}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  notification_preferences: {
                    ...prev.notification_preferences,
                    email: checked,
                  },
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-gray-500">
                Urgent updates and booking reminders
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={preferences.notification_preferences.sms}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  notification_preferences: {
                    ...prev.notification_preferences,
                    sms: checked,
                  },
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500">
                Real-time updates when using the app
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.notification_preferences.push}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  notification_preferences: {
                    ...prev.notification_preferences,
                    push: checked,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex items-center gap-2"
        size="lg"
      >
        {isLoading ? "Saving Preferences..." : "Continue"}
        <UIIcons.ArrowRight className="w-4 h-4" / />
      </Button>
    </div>
  );
}
