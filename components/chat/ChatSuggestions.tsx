"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lightbulb, HelpCircle, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatSuggestion } from "@/lib/ai-chat/types";

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSuggestionClick: (suggestion: ChatSuggestion) => void;
  className?: string;
}

export function ChatSuggestions({
  suggestions,
  onSuggestionClick,
  className,
}: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "quick_reply":
        return <ArrowRight className="h-3 w-3" />;
      case "action":
        return <Zap className="h-3 w-3" />;
      case "onboarding":
        return <Settings className="h-3 w-3" />;
      case "help":
        return <HelpCircle className="h-3 w-3" />;
      default:
        return <Lightbulb className="h-3 w-3" />;
    }
  };

  const getSuggestionVariant = (type: string) => {
    switch (type) {
      case "action":
        return "default";
      case "onboarding":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "action":
        return "border-blue-200 hover:border-blue-300 hover:bg-blue-50";
      case "onboarding":
        return "border-green-200 hover:border-green-300 hover:bg-green-50";
      case "help":
        return "border-purple-200 hover:border-purple-300 hover:bg-purple-50";
      default:
        return "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    }
  };

  // Group suggestions by type for better organization
  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      const type = suggestion.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(suggestion);
      return acc;
    },
    {} as Record<string, ChatSuggestion[]>,
  );

  const typeLabels = {
    quick_reply: "Quick Replies",
    action: "Actions",
    onboarding: "Getting Started",
    help: "Help Topics",
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>Suggested actions:</span>
      </div>

      {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
        <div key={type} className="space-y-2">
          {Object.keys(groupedSuggestions).length > 1 && (
            <div className="text-xs font-medium text-muted-foreground">
              {typeLabels[type as keyof typeof typeLabels] || type}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {typeSuggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                variant={getSuggestionVariant(suggestion.type) as any}
                size="sm"
                onClick={() => onSuggestionClick(suggestion)}
                className={cn(
                  "flex items-center gap-2 text-sm transition-all duration-200 hover:scale-105",
                  getSuggestionColor(suggestion.type),
                )}
              >
                {getSuggestionIcon(suggestion.type)}
                <span>{suggestion.text}</span>

                {suggestion.metadata?.priority &&
                  suggestion.metadata.priority > 7 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      Popular
                    </Badge>
                  )}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Show tip for first-time users */}
      {suggestions.some((s) => s.type === "onboarding") && (
        <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-start gap-2">
          <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <div className="font-medium text-blue-900">💡 Tip</div>
            <div className="text-blue-700">
              Click on any suggestion above to get personalized help and
              guidance through your journey.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
