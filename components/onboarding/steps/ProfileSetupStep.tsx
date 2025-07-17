import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, MapPin, Phone, User } from "lucide-react";
import { OnboardingStepProps } from "@/lib/onboarding/types";
import { useOnboardingClient } from "@/lib/onboarding/client-utils";

interface ProfileSetupStepProps extends OnboardingStepProps {
  role: "consumer" | "provider";
}

export function ProfileSetupStep({
  onNext,
  initialData,
  role,
}: ProfileSetupStepProps) {
  const { user } = useUser();
  const onboardingClient = useOnboardingClient();

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || user?.fullName || "",
    business_name: initialData?.business_name || "",
    phone: initialData?.phone || user?.phoneNumbers?.[0]?.phoneNumber || "",
    description: initialData?.description || "",
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      zip: initialData?.address?.zip || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (role === "consumer") {
      if (!formData.full_name.trim()) {
        newErrors.full_name = "Full name is required";
      }
    } else {
      if (!formData.business_name.trim()) {
        newErrors.business_name = "Business name is required";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Business description is required";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.address.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (!user?.id) throw new Error("User not found");

      // Save profile data
      const profileData = {
        ...(role === "consumer"
          ? { full_name: formData.full_name }
          : {
              business_name: formData.business_name,
              description: formData.description,
            }),
        phone: formData.phone,
        [role === "consumer" ? "address" : "business_address"]:
          formData.address,
      };

      const saveFunction =
        role === "consumer"
          ? onboardingClient.saveConsumerProfile
          : onboardingClient.saveProviderProfile;

      const success = await saveFunction(user.id, profileData);

      if (success) {
        onNext(formData);
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {role === "consumer"
            ? "Complete Your Profile"
            : "Set Up Your Business Profile"}
        </h2>
        <p className="text-gray-600">
          {role === "consumer"
            ? "Tell us about yourself to help providers serve you better."
            : "Share your business details to attract customers."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name/Business Name */}
        <div className="space-y-2">
          <Label htmlFor={role === "consumer" ? "full_name" : "business_name"}>
            <User className="w-4 h-4 inline mr-2" />
            {role === "consumer" ? "Full Name" : "Business Name"}
          </Label>
          <Input
            id={role === "consumer" ? "full_name" : "business_name"}
            value={
              role === "consumer" ? formData.full_name : formData.business_name
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [role === "consumer" ? "full_name" : "business_name"]:
                  e.target.value,
              }))
            }
            placeholder={
              role === "consumer"
                ? "Enter your full name"
                : "Enter your business name"
            }
            className={
              errors[role === "consumer" ? "full_name" : "business_name"]
                ? "border-red-500"
                : ""
            }
          />
          {errors[role === "consumer" ? "full_name" : "business_name"] && (
            <p className="text-sm text-red-600">
              {errors[role === "consumer" ? "full_name" : "business_name"]}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Enter your phone number"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Business Description (Provider only) */}
      {role === "provider" && (
        <div className="space-y-2">
          <Label htmlFor="description">Business Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe your business and services..."
            rows={3}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      )}

      {/* Address */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {role === "consumer" ? "Your Address" : "Business Address"}
        </Label>

        <div className="space-y-3">
          <Input
            placeholder="Street address"
            value={formData.address.street}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, street: e.target.value },
              }))
            }
            className={errors.street ? "border-red-500" : ""}
          />
          {errors.street && (
            <p className="text-sm text-red-600">{errors.street}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Input
              placeholder="City"
              value={formData.address.city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value },
                }))
              }
              className={errors.city ? "border-red-500" : ""}
            />
            <Input
              placeholder="State"
              value={formData.address.state}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value },
                }))
              }
              className={errors.state ? "border-red-500" : ""}
            />
            <Input
              placeholder="ZIP Code"
              value={formData.address.zip}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, zip: e.target.value },
                }))
              }
              className={errors.zip ? "border-red-500" : ""}
            />
          </div>
          {(errors.city || errors.state || errors.zip) && (
            <p className="text-sm text-red-600">
              Please fill in all address fields
            </p>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center gap-2"
        size="lg"
      >
        {isLoading ? "Saving..." : "Continue"}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
