import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Info, TrendingUp } from "lucide-react";
import { OnboardingStepProps } from "@/lib/onboarding/types";

interface PricingSetupData {
  pricing_model: "hourly" | "fixed" | "custom";
  base_rate?: number;
  minimum_charge?: number;
  travel_fee?: number;
  payment_methods: string[];
  payment_terms?: string;
  service_guarantee?: string;
}

export function PricingSetupStep({
  onNext,
  onPrev,
  initialData,
  isLastStep,
}: OnboardingStepProps) {
  const [formData, setFormData] = useState<PricingSetupData>({
    pricing_model: "hourly",
    payment_methods: ["credit_card"],
    ...initialData?.pricing_setup,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.pricing_model) {
      newErrors.pricing_model = "Please select a pricing model";
    }

    if (formData.pricing_model !== "custom" && !formData.base_rate) {
      newErrors.base_rate = "Please enter your base rate";
    }

    if (formData.base_rate && formData.base_rate < 10) {
      newErrors.base_rate = "Base rate must be at least $10";
    }

    if (formData.payment_methods.length === 0) {
      newErrors.payment_methods = "Please select at least one payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext({ pricing_setup: formData });
    }
  };

  const handlePaymentMethodToggle = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter((m) => m !== method)
        : [...prev.payment_methods, method],
    }));
  };

  const paymentMethods = [
    { id: "credit_card", label: "Credit/Debit Cards", popular: true },
    { id: "bank_transfer", label: "Bank Transfer", popular: true },
    { id: "paypal", label: "PayPal", popular: false },
    { id: "cash", label: "Cash", popular: false },
    { id: "venmo", label: "Venmo", popular: false },
    { id: "apple_pay", label: "Apple Pay", popular: false },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set Your Pricing
        </h2>
        <p className="text-gray-600">
          Configure how you want to charge for your services
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pricing Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BusinessIcons.DollarSign className="w-5 h-5" />
              Pricing Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={formData.pricing_model}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  pricing_model: value as "hourly" | "fixed" | "custom",
                }))
              }
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <div className="flex-1">
                    <Label
                      htmlFor="hourly"
                      className="font-medium cursor-pointer"
                    >
                      Hourly Rate
                    </Label>
                    <p className="text-sm text-gray-500">
                      Charge by the hour (recommended for most services)
                    </p>
                  </div>
                  <Badge variant="secondary">Popular</Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <div className="flex-1">
                    <Label
                      htmlFor="fixed"
                      className="font-medium cursor-pointer"
                    >
                      Fixed Price
                    </Label>
                    <p className="text-sm text-gray-500">
                      Set a flat rate per service
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="custom" id="custom" />
                  <div className="flex-1">
                    <Label
                      htmlFor="custom"
                      className="font-medium cursor-pointer"
                    >
                      Custom Pricing
                    </Label>
                    <p className="text-sm text-gray-500">
                      Quote each job individually
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
            {errors.pricing_model && (
              <p className="text-sm text-red-600">{errors.pricing_model}</p>
            )}
          </CardContent>
        </Card>

        {/* Rate Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Rate Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.pricing_model !== "custom" && (
              <div className="space-y-2">
                <Label htmlFor="base_rate">
                  {formData.pricing_model === "hourly"
                    ? "Hourly Rate"
                    : "Fixed Price"}{" "}
                  ($)
                </Label>
                <Input
                  id="base_rate"
                  type="number"
                  min="10"
                  step="5"
                  value={formData.base_rate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      base_rate: parseFloat(e.target.value) || undefined,
                    }))
                  }
                  placeholder={
                    formData.pricing_model === "hourly" ? "50" : "100"
                  }
                />
                {errors.base_rate && (
                  <p className="text-sm text-red-600">{errors.base_rate}</p>
                )}
                <p className="text-sm text-gray-500">
                  {formData.pricing_model === "hourly"
                    ? "Your rate per hour of work"
                    : "Your standard service price"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="minimum_charge">Minimum Charge ($)</Label>
              <Input
                id="minimum_charge"
                type="number"
                min="0"
                step="5"
                value={formData.minimum_charge || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minimum_charge: parseFloat(e.target.value) || undefined,
                  }))
                }
                placeholder="25"
              />
              <p className="text-sm text-gray-500">
                Minimum amount you'll charge for any job
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travel_fee">Travel Fee ($)</Label>
              <Input
                id="travel_fee"
                type="number"
                min="0"
                step="5"
                value={formData.travel_fee || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    travel_fee: parseFloat(e.target.value) || undefined,
                  }))
                }
                placeholder="10"
              />
              <p className="text-sm text-gray-500">
                Additional fee for travel (optional)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <p className="text-sm text-gray-600">
            Choose how customers can pay you
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handlePaymentMethodToggle(method.id)}
                className={`
                  cursor-pointer p-3 border-2 rounded-lg transition-all hover:scale-105
                  ${
                    formData.payment_methods.includes(method.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{method.label}</span>
                  {method.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          {errors.payment_methods && (
            <p className="text-sm text-red-600 mt-2">
              {errors.payment_methods}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Additional Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Additional Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Select
              value={formData.payment_terms || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, payment_terms: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due_on_completion">
                  Due on completion
                </SelectItem>
                <SelectItem value="due_in_7_days">Due within 7 days</SelectItem>
                <SelectItem value="due_in_14_days">
                  Due within 14 days
                </SelectItem>
                <SelectItem value="due_in_30_days">
                  Due within 30 days
                </SelectItem>
                <SelectItem value="50_percent_upfront">
                  50% upfront, 50% on completion
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_guarantee">Service Guarantee</Label>
            <Textarea
              id="service_guarantee"
              value={formData.service_guarantee || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  service_guarantee: e.target.value,
                }))
              }
              placeholder="Describe any guarantees or warranties you offer..."
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Optional: Let customers know about your quality guarantee
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Pricing Tips</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Research local competitors to set competitive rates</li>
                <li>• Consider your experience and expertise level</li>
                <li>
                  • Factor in, materials, travel, time, and business expenses
                </li>
                <li>• You can always adjust your rates later</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          {isLastStep ? "Complete Setup" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
