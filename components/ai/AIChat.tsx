"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  USER_AI_AGENTS,
  userAIClient,
  type UserAIAgent,
} from "@/lib/ai/user-ai-agents";
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  Bot,
  User,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId?: string;
}

interface AIChatProps {
  agentId?: string; // Specific agent to use
  context?: any; // User context for personalization
  position?: "floating" | "embedded" | "fullwidth";
  theme?: "light" | "dark" | "brand";
  autoOpen?: boolean;
  proactiveMessage?: boolean;
  className?: string;
}

export default function AIChat({
  agentId,
  context = {},
  position = "floating",
  theme = "light",
  autoOpen = false,
  proactiveMessage = true,
  className = "",
}: AIChatProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<UserAIAgent | null>(null);
  const [hasShownProactive, setHasShownProactive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get agent based on context or specific agentId
  useEffect(() => {
    setMounted(true);
    const getRelevantAgent = () => {
      if (agentId) {
        return USER_AI_AGENTS.find((agent) => agent.id === agentId);
      }

      // Auto-select agent based on current page context
      const currentPage = context.currentPage || "homepage";
      return (
        USER_AI_AGENTS.find((agent) => agent.contexts.includes(currentPage)) ||
        USER_AI_AGENTS[0]
      ); // Default to Maya
    };

    setCurrentAgent(getRelevantAgent() || null);
  }, [agentId, context.currentPage]);

  // Show proactive message
  useEffect(() => {
    if (currentAgent && proactiveMessage && !hasShownProactive && isOpen) {
      generateProactiveMessage();
      setHasShownProactive(true);
    }
  }, [currentAgent, isOpen, proactiveMessage, hasShownProactive]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateProactiveMessage = async () => {
    if (!currentAgent) return;

    try {
      const proactiveText = await userAIClient.generateProactiveMessage(
        currentAgent.id,
        { ...context, currentPage: context.currentPage || "homepage" },
      );

      const proactiveMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: proactiveText,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };

      setMessages([proactiveMessage]);
    } catch (error) {
      console.error("Error generating proactive message:", error);
      // Show default greeting
      const greetingMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: currentAgent.greeting,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };
      setMessages([greetingMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await userAIClient.generateResponse(
        currentAgent.id,
        input,
        { ...context, currentPage: context.currentPage || "homepage" },
        messages,
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I'm having trouble connecting right now. Please try again, or feel free to browse our services while I get back online!`,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentAvatar = (agentId: string) => {
    const agent = USER_AI_AGENTS.find((a) => a.id === agentId);
    return agent?.avatar || "��";
  };

  const getAgentName = (agentId: string) => {
    const agent = USER_AI_AGENTS.find((a) => a.id === agentId);
    return agent?.name || "AI Assistant";
  };

  const getThemeClasses = () => {
    const themes = {
      light: "bg-white border-gray-200 text-gray-900",
      dark: "bg-gray-900 border-gray-700 text-white",
      brand:
        "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 text-gray-900",
    };
    return themes[theme];
  };

  const getPositionClasses = () => {
    const positions = {
      floating: "fixed bottom-4 right-4 z-50 w-80 max-h-96",
      embedded: "w-full max-w-md mx-auto",
      fullwidth: "w-full",
    };
    return positions[position];
  };

  if (!mounted || !currentAgent) return null;

  // Floating chat bubble when closed
  if (position === "floating" && !isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`${getPositionClasses()} ${getThemeClasses()} ${className} shadow-xl`}
    >
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl">{currentAgent.avatar}</div>
            <div>
              <h3 className="font-semibold text-sm">{currentAgent.name}</h3>
              <p className="text-xs text-gray-500">{currentAgent.role}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {position === "floating" && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      {!isMinimized && (
        <CardContent className="p-0">
          <div className="h-64 overflow-y-auto px-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                      <span>{getAgentAvatar(message.agentId!)}</span>
                      <span className="font-medium">
                        {getAgentName(message.agentId!)}
                      </span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                    <span>{currentAgent.avatar}</span>
                    <span className="font-medium">{currentAgent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                placeholder={`Message ${currentAgent.name}...`}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && handleSendMessage()
                }
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentAgent.capabilities
                  .slice(0, 2)
                  .map((capability, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setInput(`Help me with ${capability.toLowerCase()}`)
                      }
                      className="text-xs"
                    >
                      <Lightbulb className="h-3 w-3 mr-1" />
                      {capability}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
