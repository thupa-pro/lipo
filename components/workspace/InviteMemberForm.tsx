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
import { Mail, Loader2 } from "lucide-react";
import { InviteMemberRequest, MemberRole } from "@/lib/workspace/types";
import { getRoleDisplayName } from "@/lib/workspace/utils";

interface InviteMemberFormProps {
  onSubmit: (data: InviteMemberRequest) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  email: string;
  role: MemberRole;
  message: string;
}

export function InviteMemberForm({
  onSubmit,
  onCancel,
}: InviteMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      role: "member",
      message: "",
    },
  });

  const selectedRole = watch("role");

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const inviteData: InviteMemberRequest = {
        email: data.email.trim(),
        role: data.role,
        message: data.message.trim() || undefined,
      };

      await onSubmit(inviteData);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions: { value: MemberRole; description: string }[] = [
    {
      value: "member",
      description: "Can view and edit, content, create listings and bookings",
    },
    {
      value: "manager",
      description: "Can manage team members and workspace content",
    },
    {
      value: "admin",
      description: "Can manage workspace settings and all members",
    },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
          placeholder="colleague@example.com"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          Role <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedRole}
          onValueChange={(value: MemberRole) => setValue("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {getRoleDisplayName(option.value)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("role")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Personal Message (Optional)</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Add a personal message to the invitation..."
          rows={3}
        />
        <p className="text-xs text-gray-500">
          This message will be included in the invitation email.
        </p>
      </div>

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
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
