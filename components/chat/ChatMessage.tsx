import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, ThumbsUp, ThumbsDown, Copy, Check, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ChatMessage as ChatMessageType } from "@/lib/ai-chat/types";

interface ChatMessageProps {
  message: ChatMessageType;
  onReaction?: (messageId: string, reaction: "helpful" | "not_helpful") => void;
}

export function ChatMessage({ message, onReaction }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [userReaction, setUserReaction] = useState<
    "helpful" | "not_helpful" | null
  >(message.reactions?.user_reaction || null);

  const isAssistant = message.sender === "assistant";
  const isWelcome = message.metadata?.isWelcome;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Message copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleReaction = (reaction: "helpful" | "not_helpful") => {
    if (userReaction === reaction) return; // Don't allow duplicate reactions

    setUserReaction(reaction);
    onReaction?.(message.id, reaction);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const renderMessageContent = () => {
    // Split content by newlines and render with proper formatting
    const lines = message.content.split("\n");

    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          if (!line.trim()) return <br key={index} />;

          // Handle bullet points
          if (line.trim().startsWith("•")) {
            return (
              <div key={index} className="flex items-start space-x-2 ml-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{line.replace("•", "").trim()}</span>
              </div>
            );
          }

          // Handle bold text (markdown-style)
          if (line.includes("**")) {
            const parts = line.split("**");
            return (
              <p key={index} className="leading-relaxed">
                {parts.map((part, partIndex) =>
                  partIndex % 2 === 1 ? (
                    <strong
                      key={partIndex}
                      className="font-semibold text-gray-900"
                    >
                      {part}
                    </strong>
                  ) : (
                    <span key={partIndex}>{part}</span>
                  ),
                )}
              </p>
            );
          }

          return (
            <p key={index} className="leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (!message.metadata?.suggestions) return null;

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {message.metadata.suggestions.map((suggestion: any) => (
          <Button
            key={suggestion.id}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              if (
                suggestion.metadata?.actionType === "navigate" &&
                suggestion.metadata?.targetUrl
              ) {
                window.location.href = suggestion.metadata.targetUrl;
              }
            }}
          >
            {suggestion.text}
            {suggestion.metadata?.actionType === "navigate" && (
              <ExternalLink className="ml-1 h-3 w-3" />
            )}
          </Button>
        ))}
      </div>
    );
  };

  const renderMetadata = () => {
    if (!message.metadata) return null;

    const { confidence, sources, onboardingStep } = message.metadata;

    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {confidence && (
          <Badge variant="secondary" className="text-xs">
            {Math.round(confidence * 100)}% confidence
          </Badge>
        )}
        {onboardingStep && (
          <Badge variant="outline" className="text-xs">
            Step: {onboardingStep}
          </Badge>
        )}
        {sources && sources.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {sources.length} source{sources.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isAssistant ? "justify-start" : "justify-end",
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/ai-assistant.png" />
          <AvatarFallback className="bg-blue-100">
            <Bot className="h-4 w-4 text-blue-600" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[85%] space-y-1",
          isAssistant ? "items-start" : "items-end",
        )}
      >
        {/* Message bubble */}
        <Card
          className={cn(
            "relative",
            isAssistant
              ? "bg-white border-gray-200"
              : "bg-blue-500 border-blue-500 text-white",
            isWelcome && "border-blue-300 bg-blue-50",
          )}
        >
          {isWelcome && (
            <div className="absolute -top-2 -left-2">
              <div className="bg-blue-500 text-white rounded-full p-1">
                <Sparkles className="h-3 w-3" />
              </div>
            </div>
          )}

          <CardContent className="p-3">
            <div
              className={cn(
                "text-sm",
                isAssistant
                  ? isWelcome
                    ? "text-blue-900"
                    : "text-gray-900"
                  : "text-white",
              )}
            >
              {renderMessageContent()}
            </div>

            {isAssistant && renderActionButtons()}
            {isAssistant && renderMetadata()}
          </CardContent>
        </Card>

        {/* Message actions and timestamp */}
        <div
          className={cn(
            "flex items-center gap-2 px-1",
            isAssistant ? "justify-start" : "justify-end",
          )}
        >
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <OptimizedIcon name="Clock" className="h-3 w-3" />
            {formatTime(message.timestamp)}
          </span>

          {/* Action buttons - only show on hover for assistant messages */}
          {isAssistant && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>

              {/* Reaction buttons */}
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0 hover:bg-green-100",
                    userReaction === "helpful" && "bg-green-100 text-green-600",
                  )}
                  onClick={() => handleReaction("helpful")}
                  disabled={userReaction !== null}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0 hover:bg-red-100",
                    userReaction === "not_helpful" && "bg-red-100 text-red-600",
                  )}
                  onClick={() => handleReaction("not_helpful")}
                  disabled={userReaction !== null}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reaction feedback */}
        {userReaction && isAssistant && (
          <div className="text-xs text-muted-foreground px-1">
            Thank you for your feedback!
            {userReaction === "helpful" ? " 😊" : " We'll work on improving."}
          </div>
        )}
      </div>

      {!isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-gray-100">
            <NavigationIcons.User className="h-4 w-4 text-gray-600" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
