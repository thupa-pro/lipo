"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  CheckCircle,
  AlertTriangle,
  X,
  FileText,
  Building,
  Award,
  MapPin,
  Shield,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface VerificationStatus {
  type:
    | "identity"
    | "address"
    | "business"
    | "background"
    | "insurance"
    | "license";
  status: "verified" | "pending" | "in_progress" | "rejected" | "expired";
  completedAt?: Date;
  expiresAt?: Date;
}

interface VerificationStatusIndicatorProps {
  verifications: VerificationStatus[];
  providerId?: string;
  showDetailed?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const verificationTypes = {
  identity: {
    icon: User,
    label: "Identity",
    description: "Government ID verified",
    color: "blue",
  },
  address: {
    icon: MapPin,
    label: "Address",
    description: "Proof of address verified",
    color: "green",
  },
  business: {
    icon: Building,
    label: "Business",
    description: "Business license verified",
    color: "purple",
  },
  background: {
    icon: Shield,
    label: "Background",
    description: "Background check completed",
    color: "red",
  },
  insurance: {
    icon: Award,
    label: "Insurance",
    description: "Insurance coverage verified",
    color: "orange",
  },
  license: {
    icon: FileText,
    label: "License",
    description: "Professional license verified",
    color: "cyan",
  },
};

export function VerificationStatusIndicator({
  verifications,
  providerId,
  showDetailed = false,
  size = "md",
  className,
}: VerificationStatusIndicatorProps) {
  const verifiedCount = verifications.filter(
    (v) => v.status === "verified",
  ).length;
  const totalCount = verifications.length;
  const verificationPercentage =
    totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0;

  const getStatusIcon = (status: VerificationStatus["status"]) => {
    switch (status) {
      case "verified":
        return CheckCircle;
      case "in_progress":
        return Clock;
      case "rejected":
        return X;
      case "expired":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: VerificationStatus["status"]) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "rejected":
        return "text-red-600";
      case "expired":
        return "text-orange-600";
      default:
        return "text-gray-400";
    }
  };

  const getBadgeVariant = (status: VerificationStatus["status"]) => {
    switch (status) {
      case "verified":
        return "default";
      case "in_progress":
        return "secondary";
      case "rejected":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "outline";
    }
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  if (!showDetailed) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge
            className={cn(
              "cursor-pointer hover:opacity-80 transition-opacity",
              verificationPercentage >= 80
                ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                : verificationPercentage >= 50
                  ? "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200",
              sizeClasses[size],
              className,
            )}
          >
            <Shield className="w-3 h-3 mr-1" />
            {verifiedCount}/{totalCount} Verified
          </Badge>
        </PopoverTrigger>

        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-semibold mb-1">
                Verification Status
              </div>
              <div className="text-sm text-muted-foreground">
                {verifiedCount} of {totalCount} verifications completed
              </div>
            </div>

            <div className="space-y-3">
              {verifications.map((verification) => {
                const typeInfo = verificationTypes[verification.type];
                const StatusIcon = getStatusIcon(verification.status);
                const TypeIcon = typeInfo.icon;

                return (
                  <div
                    key={verification.type}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {typeInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusIcon
                        className={cn(
                          "w-4 h-4",
                          getStatusColor(verification.status),
                        )}
                      />
                      <Badge
                        variant={getBadgeVariant(verification.status)}
                        className="text-xs"
                      >
                        {verification.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {verificationPercentage < 100 && providerId && (
              <div className="pt-3 border-t">
                <Link href="/verification">
                  <Button size="sm" className="w-full">
                    <Shield className="w-3 h-3 mr-1" />
                    Complete Verification
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Verification Status</h3>
        <Badge variant="outline">
          {verifiedCount}/{totalCount} Complete
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {verifications.map((verification) => {
          const typeInfo = verificationTypes[verification.type];
          const StatusIcon = getStatusIcon(verification.status);
          const TypeIcon = typeInfo.icon;

          return (
            <div
              key={verification.type}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                verification.status === "verified"
                  ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                  : verification.status === "rejected"
                    ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-700",
              )}
            >
              <TypeIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{typeInfo.label}</span>
                  <StatusIcon
                    className={cn(
                      "w-4 h-4",
                      getStatusColor(verification.status),
                    )}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {typeInfo.description}
                </p>

                {verification.completedAt && (
                  <p className="text-xs text-muted-foreground">
                    Verified {verification.completedAt.toLocaleDateString()}
                  </p>
                )}

                {verification.expiresAt && (
                  <p className="text-xs text-orange-600">
                    Expires {verification.expiresAt.toLocaleDateString()}
                  </p>
                )}
              </div>

              <Badge
                variant={getBadgeVariant(verification.status)}
                className="text-xs flex-shrink-0"
              >
                {verification.status}
              </Badge>
            </div>
          );
        })}
      </div>

      {verificationPercentage < 100 && providerId && (
        <div className="pt-3 border-t">
          <Link href="/verification">
            <Button size="sm" className="w-full">
              <Shield className="w-3 h-3 mr-1" />
              Complete Missing Verifications
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
