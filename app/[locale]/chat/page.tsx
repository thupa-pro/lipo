"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Settings,
  HelpCircle,
  Lightbulb,
  Star,
  Clock,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Import AI chat components
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSuggestions } from "@/components/chat/ChatSuggestions";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { OnboardingProgress } from "@/components/chat/OnboardingProgress";

// AI chat client
import { aiChatClient } from "@/lib/ai-chat/utils";
import type {
  ChatConversation,
  ChatMessage as ChatMessageType,
  ChatSuggestion,
  OnboardingStep,
} from "@/lib/ai-chat/types";

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load conversations and initialize chat on mount
  useEffect(() => {
    initializeChat();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-save conversation
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      saveConversation();
    }
  }, [messages, activeConversationId]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      // Load existing conversations
      const conversationsResponse = await aiChatClient.getConversations();
      if (conversationsResponse.success) {
        setConversations(conversationsResponse.data || []);

        // If no conversations exist, create a welcome conversation
        if (
          !conversationsResponse.data ||
          conversationsResponse.data.length === 0
        ) {
          await createNewConversation();
        } else {
          // Load the most recent conversation
          const latestConversation = conversationsResponse.data[0];
          await loadConversation(latestConversation.id);
        }
      }

      // Load onboarding progress
      const onboardingResponse = await aiChatClient.getOnboardingProgress();
      if (onboardingResponse.success) {
        setOnboardingSteps(onboardingResponse.data || []);
      }

      // Load initial suggestions
      await loadSuggestions();
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Failed to initialize chat assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await aiChatClient.createConversation({
        title: "Getting Started",
        type: "onboarding",
        context: { step: "welcome" },
      });

      if (response.success && response.data) {
        const newConversation = response.data;
        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);

        // Send welcome message
        const welcomeMessage: ChatMessageType = {
          id: "welcome-msg",
          content: `👋 Welcome to Loconomy! I'm your AI assistant here to help you get started.\n\nI can help you with:\n• Setting up your profile\n• Understanding how our platform works\n• Finding the right services\n• Booking your first appointment\n• Answering any questions you have\n\nWhat would you like to know first?`,
          sender: "assistant",
          timestamp: new Date().toISOString(),
          conversationId: newConversation.id,
          type: "text",
          metadata: { isWelcome: true },
        };

        setMessages([welcomeMessage]);
        await loadSuggestions("welcome");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create new conversation");
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const response =
        await aiChatClient.getConversationMessages(conversationId);

      if (response.success) {
        setActiveConversationId(conversationId);
        setMessages(response.data || []);
        await loadSuggestions();
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (
    content: string,
    type: "text" | "suggestion" = "text",
  ) => {
    if (!content.trim() || !activeConversationId) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
      conversationId: activeConversationId,
      type,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setSuggestions([]);

    try {
      // Send message to AI and get response
      const response = await aiChatClient.sendMessage(
        activeConversationId,
        content,
        type,
      );

      if (response.success && response.data) {
        const assistantMessage: ChatMessageType = {
          id: `assistant-${Date.now()}`,
          content: response.data.content,
          sender: "assistant",
          timestamp: new Date().toISOString(),
          conversationId: activeConversationId,
          type: "text",
          metadata: response.data.metadata,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update suggestions based on response
        if (response.data.suggestions) {
          setSuggestions(response.data.suggestions);
        } else {
          await loadSuggestions();
        }

        // Update onboarding progress if applicable
        if (response.data.onboardingUpdate) {
          await refreshOnboardingProgress();
        }

        // Update conversation title if needed
        if (response.data.conversationUpdate) {
          await refreshConversations();
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsTyping(false);
    }
  };

  const loadSuggestions = async (context?: string) => {
    try {
      const response = await aiChatClient.getSuggestions(
        activeConversationId,
        context,
      );
      if (response.success) {
        setSuggestions(response.data || []);
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
  };

  const saveConversation = async () => {
    if (!activeConversationId) return;

    try {
      await aiChatClient.updateConversation(activeConversationId, {
        lastMessageAt: new Date().toISOString(),
        messageCount: messages.length,
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  const refreshOnboardingProgress = async () => {
    try {
      const response = await aiChatClient.getOnboardingProgress();
      if (response.success) {
        setOnboardingSteps(response.data || []);
      }
    } catch (error) {
      console.error("Error refreshing onboarding progress:", error);
    }
  };

  const refreshConversations = async () => {
    try {
      const response = await aiChatClient.getConversations();
      if (response.success) {
        setConversations(response.data || []);
      }
    } catch (error) {
      console.error("Error refreshing conversations:", error);
    }
  };

  const handleMessageReaction = async (
    messageId: string,
    reaction: "helpful" | "not_helpful",
  ) => {
    try {
      await aiChatClient.addMessageReaction(messageId, reaction);
      toast.success(
        reaction === "helpful"
          ? "Thanks for the feedback!"
          : "Feedback received",
      );
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const clearConversation = async () => {
    if (!activeConversationId) return;

    try {
      await aiChatClient.clearConversation(activeConversationId);
      setMessages([]);
      await loadSuggestions("fresh_start");
      toast.success("Conversation cleared");
    } catch (error) {
      console.error("Error clearing conversation:", error);
      toast.error("Failed to clear conversation");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );
  const completedSteps = onboardingSteps.filter(
    (step) => step.completed,
  ).length;
  const totalSteps = onboardingSteps.length;
  const onboardingProgress =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onConversationSelect={loadConversation}
            onNewConversation={createNewConversation}
            onToggleSidebar={() => setShowSidebar(false)}
          />

          <Separator />

          <OnboardingProgress
            steps={onboardingSteps}
            progress={onboardingProgress}
            completedSteps={completedSteps}
            totalSteps={totalSteps}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(true)}
                  className="mr-2"
                >
                  ☰
                </Button>
              )}
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-assistant.png" />
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  {activeConversation?.title || "Ready to help you get started"}
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Smart Assistant
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                disabled={messages.length === 0}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4" ref={chatContainerRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading conversation...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Start a conversation
                </h3>
                <p className="text-muted-foreground mb-6">
                  Ask me anything about getting started with Loconomy!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onReaction={handleMessageReaction}
                />
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-6 py-2">
            <ChatSuggestions
              suggestions={suggestions}
              onSuggestionClick={(suggestion) =>
                sendMessage(suggestion.text, "suggestion")
              }
            />
          </div>
        )}

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={(message) => sendMessage(message)}
            isLoading={isTyping}
            placeholder="Ask me anything about Loconomy..."
          />

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>✨ AI-powered assistance</span>
              <span>🔒 Your conversations are private</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
