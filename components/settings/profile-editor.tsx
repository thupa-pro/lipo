"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Upload,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Globe,
  Calendar,
  User
} from "lucide-react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences: {
    theme: string;
    language: string;
    timezone: string;
    currency: string;
  };
}

interface ProfileEditorProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  isLoading: boolean;
}

export function ProfileEditor({
  profile,
  onUpdate,
  isLoading,
}: ProfileEditorProps) {
  const [localProfile, setLocalProfile] = useState(profile);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = {};

    switch (field) {
      case "firstName":
        if (!value.trim()) errors.firstName = "First name is required";
        else if (value.trim().length < 2)
          errors.firstName = "First name must be at least 2 characters";
        break;
      case "lastName":
        if (!value.trim()) errors.lastName = "Last name is required";
        else if (value.trim().length < 2)
          errors.lastName = "Last name must be at least 2 characters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) errors.email = "Email is required";
        else if (!emailRegex.test(value))
          errors.email = "Please enter a valid email address";
        break;
      case "phone":
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (value && !phoneRegex.test(value))
          errors.phone = "Please enter a valid phone number";
        break;
      case "zipCode":
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (value && !zipRegex.test(value))
          errors.zipCode = "Please enter a valid ZIP code";
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: errors[field] || "" }));
    return !errors[field];
  };

  const handleInputChange = (field: string, value: string) => {
    setLocalProfile((prev) => {
      const updated = { ...prev };
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        updated[parent as keyof UserProfile] = {
          ...updated[parent as keyof UserProfile],
          [child]: value,
        } as any;
      } else {
        updated[field as keyof UserProfile] = value as any;
      }
      return updated;
    });

    validateField(field, value);
    onUpdate(localProfile);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        setLocalProfile((prev) => ({ ...prev, avatar: newAvatar }));
        onUpdate({ ...localProfile, avatar: newAvatar });
        setIsEditingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getMissingFields = () => {
    const missing = [];
    if (!localProfile.firstName) missing.push("First name");
    if (!localProfile.lastName) missing.push("Last name");
    if (!localProfile.phone) missing.push("Phone number");
    if (!localProfile.bio) missing.push("Bio");
    if (!localProfile.location.address) missing.push("Address");
    return missing;
  };

  const missingFields = getMissingFields();

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profile Strength</span>
              <span className="text-sm text-muted-foreground">
                {profileCompletion}%
              </span>
            </div>
            <Progress value={profileCompletion} className="w-full" />

            {missingFields.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Complete your profile by adding: {missingFields.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={localProfile.avatar} />
                <AvatarFallback>
                  {localProfile.firstName[0]}
                  {localProfile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-medium">
                {localProfile.firstName} {localProfile.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Member since January 2024
              </p>
              <Badge variant="outline" className="mt-2">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={localProfile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                className={validationErrors.firstName ? "border-red-500" : ""}
              />
              {validationErrors.firstName && (
                <p className="text-sm text-red-500">
                  {validationErrors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={localProfile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                className={validationErrors.lastName ? "border-red-500" : ""}
              />
              {validationErrors.lastName && (
                <p className="text-sm text-red-500">
                  {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={localProfile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 ${validationErrors.email ? "border-red-500" : ""}`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={localProfile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`pl-10 ${validationErrors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={localProfile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell others about yourself..."
              rows={4}
              maxLength={500}
            />
            <div className="text-right text-sm text-muted-foreground">
              {localProfile.bio.length}/500
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={localProfile.location.address}
              onChange={(e) =>
                handleInputChange("location.address", e.target.value)
              }
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={localProfile.location.city}
                onChange={(e) =>
                  handleInputChange("location.city", e.target.value)
                }
                placeholder="San Francisco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={localProfile.location.state}
                onValueChange={(value) =>
                  handleInputChange("location.state", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={localProfile.location.zipCode}
                onChange={(e) =>
                  handleInputChange("location.zipCode", e.target.value)
                }
                placeholder="94105"
                className={validationErrors.zipCode ? "border-red-500" : ""}
              />
              {validationErrors.zipCode && (
                <p className="text-sm text-red-500">
                  {validationErrors.zipCode}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={localProfile.preferences.language}
              onValueChange={(value) =>
                handleInputChange("preferences.language", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                <SelectItem value="fr">🇫🇷 French</SelectItem>
                <SelectItem value="de">🇩🇪 German</SelectItem>
                <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select
              value={localProfile.preferences.timezone}
              onValueChange={(value) =>
                handleInputChange("preferences.timezone", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time (PT)
                </SelectItem>
                <SelectItem value="America/Denver">
                  Mountain Time (MT)
                </SelectItem>
                <SelectItem value="America/Chicago">
                  Central Time (CT)
                </SelectItem>
                <SelectItem value="America/New_York">
                  Eastern Time (ET)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={localProfile.preferences.currency}
              onValueChange={(value) =>
                handleInputChange("preferences.currency", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">🇪🇺 Euro (EUR)</SelectItem>
                <SelectItem value="GBP">🇬🇧 British Pound (GBP)</SelectItem>
                <SelectItem value="CAD">🇨🇦 Canadian Dollar (CAD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={localProfile.preferences.theme}
              onValueChange={(value) =>
                handleInputChange("preferences.theme", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
