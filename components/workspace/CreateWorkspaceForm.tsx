import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown, Check, Enterprise } from "lucide-react";
import {
  CreateWorkspaceRequest,
  WorkspaceType,
  WORKSPACE_TYPE_CONFIG,
  WORKSPACE_VALIDATION,
} from "@/lib/workspace/types";
import {
  useWorkspaceClient,
  generateWorkspaceSlug,
  validateWorkspaceSlug,
} from "@/lib/workspace/utils";
import { useToast } from "@/hooks/use-toast";

interface CreateWorkspaceFormProps {
  onSuccess: (workspace: any) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  slug: string;
  type: WorkspaceType;
  description: string;
  website_url: string;
  timezone: string;
  country: string;
}

export function CreateWorkspaceForm({
  onSuccess,
  onCancel,
}: CreateWorkspaceFormProps) {
  const { toast } = useToast();
  const workspaceClient = useWorkspaceClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<WorkspaceType>("team");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      slug: "",
      type: "team",
      description: "",
      website_url: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      country: "",
    },
  });

  const watchedName = watch("name");
  const watchedSlug = watch("slug");

  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchedName && !watchedSlug) {
      const generatedSlug = generateWorkspaceSlug(watchedName);
      setValue("slug", generatedSlug);
    }
  }, [watchedName, watchedSlug, setValue]);

  const getTypeIcon = (type: WorkspaceType) => {
    switch (type) {
      case "personal":
        return <NavigationIcons.Users className="w-5 h-5" / />;
      case "team":
        return <Building2 className="w-5 h-5" />;
      case "business":
        return <BusinessIcons.Briefcase className="w-5 h-5" / />;
      case "enterprise":
        return <Enterprise className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const workspaceData: CreateWorkspaceRequest = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        type: data.type,
        description: data.description.trim() || undefined,
        website_url: data.website_url.trim() || undefined,
        timezone: data.timezone,
        country: data.country.trim() || undefined,
      };

      const workspace = await workspaceClient.createWorkspace(workspaceData);

      toast({
        title: "Workspace Created",
        description: `${workspace.name} has been created successfully!`,
      });

      onSuccess(workspace);
    } catch (error: any) {
      console.error("Error creating workspace:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Workspace Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Choose Workspace Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(WORKSPACE_TYPE_CONFIG).map(([type, config]) => (
            <Card
              key={type}
              className={`cursor-pointer transition-all ${
                selectedType === type
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => {
                setSelectedType(type as WorkspaceType);
                setValue("type", type as WorkspaceType);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md ${config.color}`}>
                    {getTypeIcon(type as WorkspaceType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{config.name}</h3>
                      {selectedType === type && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {config.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {config.features.slice(0, 2).map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature.replace(/_/g, " ")}
                        </Badge>
                      ))}
                      {config.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{config.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <input type="hidden" {...register("type")} />
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Workspace Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name", {
              required: "Workspace name is required",
              minLength: {
                value: WORKSPACE_VALIDATION.name.minLength,
                message: `Name must be at least ${WORKSPACE_VALIDATION.name.minLength} characters`,
              },
              maxLength: {
                value: WORKSPACE_VALIDATION.name.maxLength,
                message: `Name must be less than ${WORKSPACE_VALIDATION.name.maxLength} characters`,
              },
            })}
            placeholder="My Company"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">
            URL Slug <span className="text-red-500">*</span>
          </Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
              loconomy.com/
            </span>
            <Input
              id="slug"
              {...register("slug", {
                required: "URL slug is required",
                validate: (value) =>
                  validateWorkspaceSlug(value) ||
                  "Invalid slug format. Use lowercase, letters, numbers, and hyphens only.",
              })}
              placeholder="my-company"
              className={`rounded-l-none ${errors.slug ? "border-red-500" : ""}`}
            />
          </div>
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
          <p className="text-xs text-gray-500">
            This will be your workspace URL. Use lowercase, letters, numbers, and
            hyphens.
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description", {
            maxLength: {
              value: WORKSPACE_VALIDATION.description.maxLength,
              message: `Description must be less than ${WORKSPACE_VALIDATION.description.maxLength} characters`,
            },
          })}
          placeholder="What does your workspace do?"
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Optional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            {...register("website_url")}
            placeholder="https://example.com"
            type="url"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            {...register("country")}
            placeholder="United States"
          />
        </div>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={watch("timezone")}
          onValueChange={(value) => setValue("timezone", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">
              UTC (Coordinated Universal Time)
            </SelectItem>
            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
            <SelectItem value="America/Los_Angeles">
              Pacific Time (PT)
            </SelectItem>
            <SelectItem value="Europe/London">London (GMT)</SelectItem>
            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
            <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" {...register("timezone")} />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <UIIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" / />
              Creating...
            </>
          ) : (
            "Create Workspace"
          )}
        </Button>
      </div>
    </form>
  );
}
