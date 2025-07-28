import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Circle, Trophy, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/lib/ai-chat/types";

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  progress: number;
  completedSteps: number;
  totalSteps: number;
}

export function OnboardingProgress({
  steps,
  progress,
  completedSteps,
  totalSteps,
}: OnboardingProgressProps) {
  if (steps.length === 0) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "profile":
        return "👤";
      case "preferences":
        return "⚙️";
      case "verification":
        return "✅";
      case "first_booking":
        return "📅";
      case "platform_tour":
        return "🗺️";
      default:
        return "📋";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "profile":
        return "text-blue-600 bg-blue-100";
      case "preferences":
        return "text-purple-600 bg-purple-100";
      case "verification":
        return "text-green-600 bg-green-100";
      case "first_booking":
        return "text-orange-600 bg-orange-100";
      case "platform_tour":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressMessage = () => {
    if (progress === 100) {
      return "🎉 Onboarding complete! You're all set to use Loconomy.";
    } else if (progress >= 75) {
      return "🚀 Almost there! Just a few more steps to complete.";
    } else if (progress >= 50) {
      return "💪 Great progress! You're halfway through onboarding.";
    } else if (progress >= 25) {
      return "👍 Good start! Keep going to unlock all features.";
    } else {
      return "🌟 Welcome! Let's get you started with Loconomy.";
    }
  };

  const nextStep = steps.find((step) => !step.completed && step.required);
  const totalEstimatedTime = steps
    .filter((step) => !step.completed)
    .reduce((total, step) => total + step.estimatedMinutes, 0);

  return (
    <Card className="mx-4 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Onboarding Progress
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {completedSteps}/{totalSteps}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {getProgressMessage()}
          </p>
        </div>

        {/* Next Step Highlight */}
        {nextStep && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-lg">
                {getCategoryIcon(nextStep.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-blue-900">
                    Next Step
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {nextStep.estimatedMinutes}m
                  </Badge>
                </div>
                <p className="text-sm text-blue-800 mb-2">{nextStep.title}</p>
                <p className="text-xs text-blue-600 mb-2">
                  {nextStep.description}
                </p>
                {nextStep.actionUrl && (
                  <Button
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => (window.location.href = nextStep.actionUrl!)}
                  >
                    Start Now
                    <UIIcons.ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Steps List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              All Steps
            </span>
            {totalEstimatedTime > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <OptimizedIcon name="Clock" className="h-3 w-3" />
                <span>{totalEstimatedTime}m remaining</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {steps.slice(0, 6).map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  step.completed
                    ? "bg-green-50 border border-green-200"
                    : "hover:bg-gray-50",
                )}
              >
                <div className="shrink-0">
                  {step.completed ? (
                    <UIIcons.CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        step.completed ? "text-green-900" : "text-gray-900",
                      )}
                    >
                      {step.title}
                    </span>
                    <div className="flex items-center gap-1">
                      {step.required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {step.estimatedMinutes}m
                      </span>
                    </div>
                  </div>

                  {step.checklistItems && step.checklistItems.length > 0 && (
                    <div className="mt-1">
                      <div className="text-xs text-muted-foreground">
                        {
                          step.checklistItems.filter((item) => item.completed)
                            .length
                        }
                        /{step.checklistItems.length} completed
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <span className="text-lg">
                    {getCategoryIcon(step.category)}
                  </span>
                </div>
              </div>
            ))}

            {steps.length > 6 && (
              <div className="text-center py-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  Show {steps.length - 6} more steps
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Section */}
        {progress === 100 && (
          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">
                Congratulations!
              </span>
            </div>
            <p className="text-sm text-yellow-800 mb-2">
              You've completed your onboarding! You're now ready to make the
              most of Loconomy.
            </p>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500 text-white">
                <OptimizedIcon name="Star" className="h-3 w-3 mr-1" />
                Onboarding Champion
              </Badge>
              <Badge variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                Power User
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {completedSteps}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {totalSteps - completedSteps}
            </div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
