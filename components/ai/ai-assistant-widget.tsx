"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  MessageCircle,
  Sparkles,
  Lightbulb,
  Target,
  TrendingUp,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Users,
  Send,
  Minimize2,
  Maximize2,
  X,
  Mic,
  Settings,
  RefreshCw,
  Zap,
  ChevronUp,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Bot,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import {
  userAIClient,
  USER_AI_AGENTS,
  type UserAIAgent,
} from "@/lib/ai/user-ai-agents";

interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  agentId?: string;
  type?: "text" | "suggestion" | "action" | "insight";
  metadata?: any;
  attachments?: any[];
}

interface AIAssistantWidgetProps {
  position?: "floating" | "sidebar" | "inline" | "modal";
  size?: "compact" | "normal" | "large";
  context?: any;
  theme?: "light" | "dark" | "auto";
  showAgentSelector?: boolean;
  enableVoice?: boolean;
  enableFileUpload?: boolean;
  autoSuggest?: boolean;
  persistConversation?: boolean;
  onAction?: (action: string, data: any) => void;
  className?: string;
}

const AI_INSIGHTS = [
  {
    type: "pricing",
    icon: DollarSign,
    title: "Price Optimization",
    description: "Save 15-30% with smart pricing analysis",
    action: "optimize_price",
  },
  {
    type: "timing",
    icon: Calendar,
    title: "Best Booking Times",
    description: "Find the optimal time slots for your service",
    action: "suggest_timing",
  },
  {
    type: "providers",
    icon: Users,
    title: "Provider Matching",
    description: "Get matched with the perfect service provider",
    action: "find_providers",
  },
  {
    type: "location",
    icon: MapPin,
    title: "Location Insights",
    description: "Discover better service areas nearby",
    action: "analyze_location",
  },
];

const QUICK_ACTIONS = [
  { label: "Find a cleaner", query: "I need a house cleaning service" },
  { label: "Book plumber", query: "I have a plumbing emergency" },
  { label: "Compare prices", query: "Show me pricing options" },
  { label: "Check availability", query: "What's available today?" },
  { label: "Get recommendations", query: "Recommend services for me" },
  { label: "Help with booking", query: "Help me complete my booking" },
];

export default function AIAssistantWidget({
  position = "floating",
  size = "normal",
  context = {},
  theme = "auto",
  showAgentSelector = true,
  enableVoice = true,
  enableFileUpload = false,
  autoSuggest = true,
  persistConversation = true,
  onAction,
  className = "",
}: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<UserAIAgent | null>(null);
  const [showInsights, setShowInsights] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize AI agent based on context
  useEffect(() => {
    setMounted(true);
    const contextPage = context.currentPage || "homepage";
    const relevantAgent =
      USER_AI_AGENTS.find((agent) => agent.contexts.includes(contextPage)) ||
      USER_AI_AGENTS[0]; // Default to Maya

    setCurrentAgent(relevantAgent);

    // Load persisted conversation
    if (persistConversation) {
      const saved = localStorage.getItem("ai-assistant-conversation");
      if (saved) {
        try {
          const conversation = JSON.parse(saved);
          setMessages(conversation);
        } catch (e) {
          console.warn("Failed to load conversation:", e);
        }
      }
    }

    // Generate proactive greeting
    if (relevantAgent && messages.length === 0) {
      generateProactiveGreeting(relevantAgent);
    }
  }, [context.currentPage]);

  // Save conversation to localStorage
  useEffect(() => {
    if (persistConversation && messages.length > 0) {
      localStorage.setItem(
        "ai-assistant-conversation",
        JSON.stringify(messages.slice(-20)),
      ); // Keep last 20 messages
    }
  }, [messages, persistConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateProactiveGreeting = async (agent: UserAIAgent) => {
    try {
      const greeting = await userAIClient.generateProactiveMessage(
        agent.id,
        context,
      );
      const systemMessage: AIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
        agentId: agent.id,
        type: "text",
      };
      setMessages([systemMessage]);
    } catch (error) {
      // Fallback to default greeting
      const systemMessage: AIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: agent.greeting,
        timestamp: new Date(),
        agentId: agent.id,
        type: "text",
      };
      setMessages([systemMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentAgent) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await userAIClient.generateResponse(
        currentAgent.id,
        input,
        { ...context, deviceType: getDeviceType() },
        messages,
      );

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        agentId: currentAgent.id,
        type: "text",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Generate follow-up suggestions
      if (autoSuggest) {
        generateSuggestions(response);
      }
    } catch (error) {
      console.error("AI response error:", error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date(),
        agentId: currentAgent.id,
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = (response: string) => {
    const baseSuggestions = [
      "Tell me more about this",
      "Show me alternatives",
      "What else can you help with?",
      "Book this service",
      "Compare prices",
      "Check availability",
    ];

    // AI-powered suggestion generation based on response content
    let contextSuggestions = [];
    if (response.includes("price") || response.includes("cost")) {
      contextSuggestions.push("Optimize pricing", "Compare alternatives");
    }
    if (response.includes("book") || response.includes("schedule")) {
      contextSuggestions.push("Check calendar", "Book now");
    }
    if (response.includes("provider") || response.includes("service")) {
      contextSuggestions.push("View profile", "Read reviews");
    }

    setSuggestions([...contextSuggestions, ...baseSuggestions].slice(0, 4));
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice input failed",
          description: "Please try again or type your message",
          variant: "destructive",
        });
      };
    }
  };

  const handleInsightAction = (insight: (typeof AI_INSIGHTS)[0]) => {
    onAction?.(insight.action, { context, currentAgent });

    // Add action message to conversation
    const actionMessage: AIMessage = {
      id: Date.now().toString(),
      role: "system",
      content: `Initiating ${insight.title}...`,
      timestamp: new Date(),
      type: "action",
      metadata: { action: insight.action },
    };
    setMessages((prev) => [...prev, actionMessage]);
  };

  const getDeviceType = () => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  };

  const getSizeClasses = () => {
    const sizes = {
      compact: "w-72 h-96",
      normal: "w-80 h-[32rem]",
      large: "w-96 h-[40rem]",
    };
    return sizes[size];
  };

  const getPositionClasses = () => {
    const positions = {
      floating: "fixed bottom-4 right-4 z-50",
      sidebar: "h-full",
      inline: "w-full",
      modal: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
    };
    return positions[position];
  };

  if (!mounted || !currentAgent) return null;

  // Floating chat bubble when closed
  if (position === "floating" && !isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        size="icon"
      >
        <Brain className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className={`${getPositionClasses()} ${className} animate-scale-in`}>
      <Card
        className={`${getSizeClasses()} shadow-2xl border-gray-200 bg-white/95 backdrop-blur-sm`}
      >
        {/* Header */}
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                  {currentAgent.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-900">
                  {currentAgent.name}
                </CardTitle>
                <p className="text-xs text-gray-600">{currentAgent.role}</p>
              </div>
              <Badge className="bg-green-100 text-green-700 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
            </div>

            {position === "floating" && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3 w-3" />
                  ) : (
                    <Minimize2 className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-full">
            {/* AI Insights */}
            {showInsights && messages.length <= 1 && (
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    AI Insights
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowInsights(false)}
                    className="h-5 w-5 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AI_INSIGHTS.slice(0, 4).map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleInsightAction(insight)}
                        className="p-2 text-left bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-3 h-3 text-blue-600 group-hover:text-blue-700" />
                          <span className="text-xs font-medium text-gray-700">
                            {insight.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {insight.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg group relative ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : message.type === "action"
                          ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                          : "bg-gray-100 text-gray-900 border"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                        <span>{currentAgent.avatar}</span>
                        <span className="font-medium">{currentAgent.name}</span>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-1 flex items-center justify-between ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.role === "assistant" && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Copy className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-green-100 rounded text-green-600">
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-red-100 rounded text-red-600">
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-100 p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                      <span>{currentAgent.avatar}</span>
                      <span className="font-medium">{currentAgent.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !isLoading && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                <div className="grid grid-cols-2 gap-1">
                  {QUICK_ACTIONS.slice(0, 4).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(action.query)}
                      className="text-xs p-2 text-left bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message ${currentAgent.name}...`}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                    className="text-sm pr-8"
                  />
                  {enableVoice && (
                    <button
                      onClick={handleVoiceInput}
                      disabled={isLoading || isListening}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                        isListening
                          ? "text-red-600 animate-pulse"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
