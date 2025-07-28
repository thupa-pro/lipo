import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
;
import {
  OnboardingStepProps,
  SERVICE_CATEGORIES,
  ServiceCategory,
} from "@/lib/onboarding/types";
import { useOnboardingClient } from "@/lib/onboarding/utils";

export function ServiceCategoriesStep({
  onNext,
  initialData,
}: OnboardingStepProps) {
  const { user } = useUser();
  const onboardingClient = useOnboardingClient();

  const [selectedCategories, setSelectedCategories] = useState<
    ServiceCategory[]
  >(initialData?.categories || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleCategory = (category: ServiceCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
    setError("");
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      setError("Please select at least one service category");
      return;
    }

    setIsLoading(true);
    try {
      if (!user?.id) throw new Error("User not found");

      // Save categories to provider profile
      const success = await onboardingClient.saveProviderProfile(user.id, {
        categories: selectedCategories,
      });

      if (success) {
        onNext({ categories: selectedCategories });
      } else {
        throw new Error("Failed to save categories");
      }
    } catch (error) {
      console.error("Error saving categories:", error);
      setError("Failed to save categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <BusinessIcons.Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Select Your Service Categories
        </h2>
        <p className="text-gray-600">
          Choose the types of services your business offers. You can always add
          more later.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">
          Service Categories ({selectedCategories.length} selected)
        </Label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SERVICE_CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={
                selectedCategories.includes(category) ? "default" : "outline"
              }
              className="cursor-pointer transition-all hover:scale-105 justify-center py-3 px-4 text-center"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {selectedCategories.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Selected Categories:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="default" className="bg-blue-600">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">
          💡 Tips for choosing categories:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Select all categories that apply to your business</li>
          <li>• Choose broadly - you can specify details in the next step</li>
          <li>• More categories = more visibility to potential customers</li>
          <li>
            • You can add or remove categories anytime from your dashboard
          </li>
        </ul>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading || selectedCategories.length === 0}
        className="w-full flex items-center gap-2"
        size="lg"
      >
        {isLoading ? "Saving Categories..." : "Continue to Service Details"}
        <UIIcons.ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
