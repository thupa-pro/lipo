"use client";

import { useState, useEffect } from "react";
import { useInternationalDetection } from "@/hooks/use-international-detection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Phone,
  DollarSign,
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  country: string;
  currency: string;
}

export default function InternationalContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
    country: "",
    currency: "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    isDetecting,
    isDetected,
    country,
    currency,
    phoneCode,
    formatCurrency,
    formatPhone,
    validatePhone,
  } = useInternationalDetection({
    enableGeolocation: true,
    fallbackToIP: true,
    onDetectionComplete: (result) => {
      setFormData((prev) => ({
        ...prev,
        country: result.country,
        currency: result.currency,
      }));
    },
  });

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number format for your country";
    }

    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", {
        ...formData,
        formattedPhone: formatPhone(formData.phone),
        formattedBudget: formatCurrency(parseFloat(formData.budget) || 0),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Currency options based on detected country
  const getCurrencyOptions = () => {
    const budgetRanges = [
      { value: "1000", label: formatCurrency(1000) },
      { value: "5000", label: formatCurrency(5000) },
      { value: "10000", label: formatCurrency(10000) },
      { value: "25000", label: formatCurrency(25000) },
      { value: "50000", label: formatCurrency(50000) },
      { value: "100000", label: formatCurrency(100000) },
    ];
    return budgetRanges;
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-4">
            Your message has been submitted successfully. We'll get back to you
            soon.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>
              Submitted from: <strong>{country}</strong>
            </p>
            <p>
              Phone: <strong>{formatPhone(formData.phone)}</strong>
            </p>
            <p>
              Budget:{" "}
              <strong>
                {formatCurrency(parseFloat(formData.budget) || 0)}
              </strong>
            </p>
          </div>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                budget: "",
                message: "",
                country: country || "",
                currency: currency || "",
              });
            }}
            className="mt-4"
          >
            Submit Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Detection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Detection
          </CardTitle>
          <CardDescription>
            We've automatically detected your location to provide localized
            formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {isDetecting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Detecting your location...</span>
              </div>
            ) : isDetected ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>
                  Detected: <strong>{country}</strong>
                </span>
                <Badge variant="outline">
                  {currency} • {phoneCode}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Location detection failed - using defaults</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we'll respond with localized information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone Number with Auto-formatting */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
                {phoneCode && (
                  <Badge variant="outline" className="text-xs">
                    {phoneCode}
                  </Badge>
                )}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={
                  phoneCode
                    ? `${phoneCode} XXX-XXX-XXXX`
                    : "Enter your phone number"
                }
                className={errors.phone ? "border-red-500" : ""}
              />
              {formData.phone && isDetected && (
                <div className="text-sm text-muted-foreground">
                  Formatted: <strong>{formatPhone(formData.phone)}</strong>
                  {validatePhone(formData.phone) ? (
                    <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 inline ml-2" />
                  )}
                </div>
              )}
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Budget with Currency Formatting */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Project Budget
                {currency && (
                  <Badge variant="outline" className="text-xs">
                    {currency}
                  </Badge>
                )}
              </Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => handleInputChange("budget", value)}
              >
                <SelectTrigger
                  className={errors.budget ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  {isDetected ? (
                    getCurrencyOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="1000">$1,000</SelectItem>
                      <SelectItem value="5000">$5,000</SelectItem>
                      <SelectItem value="10000">$10,000</SelectItem>
                      <SelectItem value="25000">$25,000</SelectItem>
                      <SelectItem value="50000">$50,000</SelectItem>
                      <SelectItem value="100000">$100,000+</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.budget && (
                <p className="text-red-500 text-sm">{errors.budget}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tell us about your project..."
                rows={4}
                className={errors.message ? "border-red-500" : ""}
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>

            {/* Localization Info */}
            {isDetected && (
              <Alert>
                <AlertDescription>
                  <strong>Localization Active:</strong> Your phone number and
                  budget will be formatted according to {country} standards.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
