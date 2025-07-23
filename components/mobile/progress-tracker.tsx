"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  MapPin,
  Calendar,
  CreditCard,
  MessageSquare,
  AlertCircle,
  Truck,
  Home,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  timestamp?: Date;
  icon: React.ComponentType<{ className?: string }>;
  estimatedTime?: string;
}

interface Transaction {
  id: string;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  providerName: string;
  providerAvatar?: string;
  estimatedCompletion: Date;
  amount: string;
  steps: ProgressStep[];
}

interface ProgressTrackerProps {
  transactionId?: string;
  className?: string;
}

export function ProgressTracker({
  transactionId = "default",
  className,
}: ProgressTrackerProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching transaction data
    const mockTransaction: Transaction = {
      id: transactionId,
      title: "Premium House Cleaning",
      description: "Deep cleaning service for 3-bedroom apartment",
      currentStep: 2,
      totalSteps: 6,
      status: "in-progress",
      providerName: "Sarah Mitchell",
      providerAvatar: "/placeholder.svg?height=40&width=40",
      estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      amount: "$125.00",
      steps: [
        {
          id: "booking",
          title: "Booking Confirmed",
          description: "Your service request has been accepted",
          status: "completed",
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          icon: CheckCircle,
        },
        {
          id: "preparation",
          title: "Provider Preparing",
          description:
            "Sarah is gathering supplies and heading to your location",
          status: "completed",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          icon: User,
        },
        {
          id: "travel",
          title: "En Route",
          description: "Provider is traveling to your location",
          status: "current",
          icon: Truck,
          estimatedTime: "15 min",
        },
        {
          id: "service",
          title: "Service in Progress",
          description: "Cleaning service will begin shortly",
          status: "upcoming",
          icon: Home,
          estimatedTime: "2 hours",
        },
        {
          id: "completion",
          title: "Service Completed",
          description: "Quality check and final cleanup",
          status: "upcoming",
          icon: CheckCircle,
        },
        {
          id: "payment",
          title: "Payment & Review",
          description: "Automatic payment and rate your experience",
          status: "upcoming",
          icon: Star,
        },
      ],
    };

    setTimeout(() => {
      setTransaction(mockTransaction);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTransaction((prev) => {
        if (!prev || prev.currentStep >= prev.totalSteps) return prev;

        // Move to next step
        const newCurrentStep = Math.min(prev.currentStep + 1, prev.totalSteps);
        const updatedSteps = prev.steps.map((step, index) => ({
          ...step,
          status:
            index < newCurrentStep
              ? ("completed" as const)
              : index === newCurrentStep
                ? ("current" as const)
                : ("upcoming" as const),
          timestamp: index === newCurrentStep - 1 ? new Date() : step.timestamp,
        }));

        return {
          ...prev,
          currentStep: newCurrentStep,
          steps: updatedSteps,
          status:
            newCurrentStep >= prev.totalSteps ? "completed" : "in-progress",
        };
      });
    }, 45000); // Update every 45 seconds for demo

    return () => clearInterval(interval);
  }, [transactionId]);

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "text-emerald-600";
      case "in-progress":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transaction) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Transaction not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardContent className="p-6">
        {/* Transaction Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">{transaction.title}</h3>
            <Badge
              className={cn("px-2 py-1", getStatusColor(transaction.status))}
            >
              {getStatusBadge(transaction.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {transaction.description}
          </p>

          {/* Provider Info */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {transaction.providerName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {transaction.providerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Service Provider
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-emerald-600">
                {transaction.amount}
              </p>
              <p className="text-xs text-muted-foreground">Total Cost</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {transaction.currentStep} of {transaction.totalSteps} steps
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(transaction.currentStep / transaction.totalSteps) * 100}%`,
                }}
              />
            </div>
            {/* Progress indicator */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-lg transition-all duration-1000"
              style={{
                left: `${(transaction.currentStep / transaction.totalSteps) * 100}%`,
              }}
            />
          </div>

          {/* Estimated completion */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Started {formatTime(transaction.steps[0].timestamp!)}</span>
            <span>
              Est. completion: {formatTime(transaction.estimatedCompletion)}
            </span>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Timeline</h4>
          {transaction.steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isUpcoming = step.status === "upcoming";

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-start gap-4 p-3 rounded-lg transition-all duration-300",
                  isCompleted && "bg-emerald-50 dark:bg-emerald-950/10",
                  isCurrent &&
                    "bg-blue-50 dark:bg-blue-950/10 ring-2 ring-blue-200 dark:ring-blue-800",
                  isUpcoming && "bg-gray-50 dark:bg-gray-800/50",
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted && "bg-emerald-500 text-white",
                    isCurrent && "bg-blue-500 text-white animate-pulse",
                    isUpcoming &&
                      "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5
                      className={cn(
                        "font-medium text-sm",
                        isCompleted && "text-emerald-700 dark:text-emerald-300",
                        isCurrent && "text-blue-700 dark:text-blue-300",
                        isUpcoming && "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {step.title}
                    </h5>
                    {step.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(step.timestamp)}
                      </span>
                    )}
                    {step.estimatedTime && isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        {step.estimatedTime}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs",
                      isCompleted && "text-emerald-600 dark:text-emerald-400",
                      isCurrent && "text-blue-600 dark:text-blue-400",
                      isUpcoming && "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Status indicator */}
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
                {isCurrent && (
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 animate-spin" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Provider
          </Button>
          {transaction.status === "in-progress" && (
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Track Live
            </Button>
          )}
        </div>

        {/* Real-time indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Real-time tracking active</span>
        </div>
      </CardContent>
    </Card>
  );
}
