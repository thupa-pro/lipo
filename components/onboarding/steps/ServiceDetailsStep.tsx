import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Award, CreditCard } from "lucide-react";
import { OnboardingStepProps } from "@/lib/onboarding/types";
import { useOnboardingClient } from "@/lib/onboarding/utils";

export function ServiceDetailsStep({
  onNext,
  initialData,
}: OnboardingStepProps) {
  const { user } = useUser();
  const onboardingClient = useOnboardingClient();

  const [formData, setFormData] = useState({
    business_type: initialData?.business_type || "",
    certifications: initialData?.certifications || [],
    insurance_info: {
      provider: initialData?.insurance_info?.provider || "",
      policy_number: initialData?.insurance_info?.policy_number || "",
      expiry_date: initialData?.insurance_info?.expiry_date || "",
    },
    payment_methods: initialData?.payment_methods || ["cash"],
    service_areas: initialData?.service_areas || [
      {
        name: "Primary Service Area",
        radius: 10,
        coordinates: { lat: 0, lng: 0 },
      },
    ],
  });

  const [newCertification, setNewCertification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessTypes = [
    "Sole Proprietorship",
    "LLC",
    "Corporation",
    "Partnership",
    "Independent Contractor",
    "Other",
  ];

  const paymentMethodOptions = [
    "cash",
    "check",
    "venmo",
    "paypal",
    "zelle",
    "credit_card",
  ];

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const togglePaymentMethod = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter((m) => m !== method)
        : [...prev.payment_methods, method],
    }));
  };

  const updateServiceArea = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      service_areas: [
        {
          ...prev.service_areas[0],
          [field]: value,
        },
      ],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.business_type) {
      newErrors.business_type = "Business type is required";
    }

    if (formData.payment_methods.length === 0) {
      newErrors.payment_methods = "Select at least one payment method";
    }

    if (!formData.service_areas[0].name.trim()) {
      newErrors.service_area_name = "Service area name is required";
    }

    if (formData.service_areas[0].radius <= 0) {
      newErrors.service_area_radius = "Service radius must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (!user?.id) throw new Error("User not found");

      // Save service details to provider profile
      const success = await onboardingClient.saveProviderProfile(
        user.id,
        formData,
      );

      if (success) {
        onNext(formData);
      } else {
        throw new Error("Failed to save service details");
      }
    } catch (error) {
      console.error("Error saving service details:", error);
      setErrors({
        submit: "Failed to save service details. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Service Details & Credentials
        </h2>
        <p className="text-gray-600">
          Add important details that help customers trust and find your
          business.
        </p>
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <Label htmlFor="business_type">Business Type</Label>
        <Select
          value={formData.business_type}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, business_type: value }))
          }
        >
          <SelectTrigger
            className={errors.business_type ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select your business type" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.business_type && (
          <p className="text-sm text-red-600">{errors.business_type}</p>
        )}
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <Label className="text-lg font-medium">
            Certifications & Licenses
          </Label>
        </div>
        <p className="text-sm text-gray-600">
          Add any relevant, certifications, licenses, or qualifications.
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Enter certification name"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCertification()}
          />
          <Button type="button" variant="outline" onClick={addCertification}>
            Add
          </Button>
        </div>

        {formData.certifications.length > 0 && (
          <div className="space-y-2">
            {formData.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span className="text-sm">{cert}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insurance Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <OptimizedIcon name="Shield" className="w-5 h-5 text-blue-500" />
          <Label className="text-lg font-medium">
            Insurance Information (Optional)
          </Label>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insurance_provider">Insurance Provider</Label>
            <Input
              id="insurance_provider"
              placeholder="e.g., State Farm"
              value={formData.insurance_info.provider}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  insurance_info: {
                    ...prev.insurance_info,
                    provider: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy_number">Policy Number</Label>
            <Input
              id="policy_number"
              placeholder="Policy number"
              value={formData.insurance_info.policy_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  insurance_info: {
                    ...prev.insurance_info,
                    policy_number: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.insurance_info.expiry_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  insurance_info: {
                    ...prev.insurance_info,
                    expiry_date: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-500" />
          <Label className="text-lg font-medium">
            Accepted Payment Methods
          </Label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {paymentMethodOptions.map((method) => (
            <div
              key={method}
              onClick={() => togglePaymentMethod(method)}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                formData.payment_methods.includes(method)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-sm font-medium capitalize">
                {method.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
        {errors.payment_methods && (
          <p className="text-sm text-red-600">{errors.payment_methods}</p>
        )}
      </div>

      {/* Service Area */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">Primary Service Area</Label>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area_name">Area Name</Label>
            <Input
              id="area_name"
              placeholder="e.g., Downtown Metro Area"
              value={formData.service_areas[0].name}
              onChange={(e) => updateServiceArea("name", e.target.value)}
              className={errors.service_area_name ? "border-red-500" : ""}
            />
            {errors.service_area_name && (
              <p className="text-sm text-red-600">{errors.service_area_name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="service_radius">Service Radius (miles)</Label>
            <Input
              id="service_radius"
              type="number"
              min="1"
              max="100"
              value={formData.service_areas[0].radius}
              onChange={(e) =>
                updateServiceArea("radius", parseInt(e.target.value))
              }
              className={errors.service_area_radius ? "border-red-500" : ""}
            />
            {errors.service_area_radius && (
              <p className="text-sm text-red-600">
                {errors.service_area_radius}
              </p>
            )}
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex items-center gap-2"
        size="lg"
      >
        {isLoading ? "Saving Details..." : "Continue to Pricing"}
        <UIIcons.ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
