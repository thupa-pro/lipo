import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageCircle, Archive, MoreHorizontal, X, Bot, HelpCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatConversation } from "@/lib/ai-chat/types";

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  onToggleSidebar: () => void;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onToggleSidebar,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "onboarding" | "support" | "general"
  >("all");

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || conversation.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "onboarding":
        return <NavigationIcons.Settings className="h-4 w-4 text-blue-500" / />;
      case "support":
        return <HelpCircle className="h-4 w-4 text-orange-500" />;
      case "general":
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
      case "booking_help":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "onboarding":
        return "Getting Started";
      case "support":
        return "Support";
      case "general":
        return "General";
      case "booking_help":
        return "Booking Help";
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "archived":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filterCounts = {
    all: conversations.length,
    onboarding: conversations.filter((c) => c.type === "onboarding").length,
    support: conversations.filter((c) => c.type === "support").length,
    general: conversations.filter((c) => c.type === "general").length,
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            AI Assistant
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-muted-foreground hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" / />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {(["all", "onboarding", "support", "general"] as const).map(
            (filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="text-xs"
              >
                {filter === "all" ? "All" : getTypeLabel(filter)}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filterCounts[filter]}
                </Badge>
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchQuery
                  ? "No matching conversations"
                  : "No conversations yet"}
              </p>
              {!searchQuery && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={onNewConversation}
                  className="mt-2"
                >
                  Start your first conversation
                </Button>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 group",
                  activeConversationId === conversation.id &&
                    "bg-blue-50 border border-blue-200",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="shrink-0 mt-0.5">
                      {getConversationIcon(conversation.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              getStatusColor(conversation.status),
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(conversation.type)}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{conversation.messageCount} messages</span>
                          {conversation.lastMessageAt && (
                            <>
                              <span>•</span>
                              <span>
                                {formatTime(conversation.lastMessageAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Priority indicator */}
                      {conversation.priority === "high" && (
                        <div className="flex items-center gap-1 mt-1">
                          <OptimizedIcon name="Star" className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">
                            High Priority
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {conversation.tags && conversation.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {conversation.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {conversation.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{conversation.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* More actions */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle conversation options
                    }}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <div>✨ AI-powered assistance</div>
          <div>Available 24/7 to help you</div>
        </div>
      </div>
    </div>
  );
}
