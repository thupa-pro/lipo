"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Upload,
  Image, as ImageIcon,
  DollarSign,
  MapPin,
  Tag,
  AlertCircle
} from "lucide-react";
import {
  ListingFormProps,
  ListingFormData,
  LISTING_CATEGORIES,
  SUBCATEGORIES,
  PricingType,
  LocationType,
  ListingStatus
} from "@/lib/listings/types";
import { validateListingForm, uploadListingImage } from "@/lib/listings/utils";

export function ListingForm({
  listing,
  onSubmit,
  onCancel,
  isLoading = false,
}: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    title: listing?.title || "",
    description: listing?.description || "",
    category: listing?.category || "",
    subcategory: listing?.subcategory || "",
    tags: listing?.tags || [],
    pricing_type: listing?.pricing_type || "hourly",
    base_price: listing?.base_price || undefined,
    hourly_rate: listing?.hourly_rate || undefined,
    minimum_hours: listing?.minimum_hours || 1,
    duration_minutes: listing?.duration_minutes || undefined,
    location_type: listing?.location_type || "on_site",
    service_area: listing?.service_area || { type: "radius", radius: 10 },
    max_bookings_per_day: listing?.max_bookings_per_day || 5,
    advance_booking_days: listing?.advance_booking_days || 30,
    cancellation_policy: listing?.cancellation_policy || "",
    status: listing?.status || "draft",
    images: [],
    existing_images: listing?.images || [],
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUploading, setImageUploading] = useState(false);

  const handleInputChange = (field: keyof ListingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setImageUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // For, now, create a temporary URL. In, production, upload to Supabase
        return URL.createObjectURL(file);
      });

      const imageUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        existing_images: [...(prev.existing_images || []), ...imageUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      existing_images:
        prev.existing_images?.filter((url) => url !== imageUrl) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateListingForm(formData);
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, error) => {
          acc[error.field] = error.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      setErrors(errorMap);
      return;
    }

    await onSubmit(formData);
  };

  const subcategories = formData.category
    ? SUBCATEGORIES[formData.category] || []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Professional House Cleaning Service"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your service in detail. What's included? What makes you unique?"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formData.description.length}/2000 characters</span>
              {errors.description && (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  handleInputChange("category", value);
                  handleInputChange("subcategory", ""); // Reset subcategory
                }}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    handleInputChange("subcategory", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pricing Type *</Label>
            <Select
              value={formData.pricing_type}
              onValueChange={(value: PricingType) =>
                handleInputChange("pricing_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly Rate</SelectItem>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="custom">Custom Pricing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.pricing_type === "hourly" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate *</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate || ""}
                  onChange={(e) =>
                    handleInputChange("hourly_rate", parseFloat(e.target.value))
                  }
                  placeholder="25.00"
                  className={errors.hourly_rate ? "border-red-500" : ""}
                />
                {errors.hourly_rate && (
                  <p className="text-sm text-red-600">{errors.hourly_rate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum_hours">Minimum Hours</Label>
                <Input
                  id="minimum_hours"
                  type="number"
                  min="1"
                  value={formData.minimum_hours || ""}
                  onChange={(e) =>
                    handleInputChange("minimum_hours", parseInt(e.target.value))
                  }
                  placeholder="1"
                />
              </div>
            </div>
          )}

          {formData.pricing_type === "fixed" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price">Fixed Price *</Label>
                <Input
                  id="base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price || ""}
                  onChange={(e) =>
                    handleInputChange("base_price", parseFloat(e.target.value))
                  }
                  placeholder="75.00"
                  className={errors.base_price ? "border-red-500" : ""}
                />
                {errors.base_price && (
                  <p className="text-sm text-red-600">{errors.base_price}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  min="15"
                  value={formData.duration_minutes || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "duration_minutes",
                      parseInt(e.target.value),
                    )
                  }
                  placeholder="60"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location & Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Service Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Location Type</Label>
            <Select
              value={formData.location_type}
              onValueChange={(value: LocationType) =>
                handleInputChange("location_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on_site">
                  On-site (at customer location)
                </SelectItem>
                <SelectItem value="remote">Remote/Online</SelectItem>
                <SelectItem value="both">Both on-site and remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_bookings">Max Bookings per Day</Label>
              <Input
                id="max_bookings"
                type="number"
                min="1"
                max="50"
                value={formData.max_bookings_per_day || ""}
                onChange={(e) =>
                  handleInputChange(
                    "max_bookings_per_day",
                    parseInt(e.target.value),
                  )
                }
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advance_booking">Advance Booking (days)</Label>
              <Input
                id="advance_booking"
                type="number"
                min="1"
                max="365"
                value={formData.advance_booking_days || ""}
                onChange={(e) =>
                  handleInputChange(
                    "advance_booking_days",
                    parseInt(e.target.value),
                  )
                }
                placeholder="30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="images">Upload Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                disabled={imageUploading}
              />
              <label htmlFor="images" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {imageUploading ? "Uploading..." : "Click to upload images"}
                </p>
              </label>
            </div>
          </div>

          {formData.existing_images && formData.existing_images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.existing_images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Service image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => handleRemoveImage(imageUrl)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.status}
            onValueChange={(value: ListingStatus) =>
              handleInputChange("status", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">
                Draft (not visible to customers)
              </SelectItem>
              <SelectItem value="active">
                Active (visible and bookable)
              </SelectItem>
              <SelectItem value="paused">
                Paused (visible but not bookable)
              </SelectItem>
              <SelectItem value="inactive">
                Inactive (hidden from customers)
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : listing
              ? "Update Listing"
              : "Create Listing"}
        </Button>
      </div>
    </form>
  );
}
