import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  USER_AI_AGENTS,
  userAIClient,
  type UserAIAgent
} from "@/lib/ai/user-ai-agents";
import { MessageCircle, Send, Minimize2, Maximize2, X, Sparkles, Bot, Lightbulb, Volume2, VolumeX, Copy, ThumbsUp, ThumbsDown, RotateCcw, Mic, Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId?: string;
  isTyping?: boolean;
  isError?: boolean;
  feedback?: "positive" | "negative" | null;
  suggestions?: string[];
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
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [typingEffect, setTypingEffect] = useState<string>("");
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

  const typewriterEffect = (text: string, callback: () => void) => {
    setTypingEffect("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingEffect((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setTypingEffect("");
        callback();
      }
    }, 30);
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

      // Add typing effect
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        agentId: currentAgent.id,
        suggestions: generateSuggestions(response),
      };

      typewriterEffect(response, () => {
        setMessages((prev) => [...prev, assistantMessage]);
      });
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I, apologize, but I'm having trouble connecting right now. Please try, again, or feel free to browse our services while I get back online!`,
        timestamp: new Date(),
        agentId: currentAgent.id,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = (response: string): string[] => {
    const suggestions = [
      "Tell me more about this",
      "Show me alternatives",
      "What else can you help with?",
      "Book this service",
    ];
    return suggestions.slice(0, 2);
  };

  const handleFeedback = (
    messageId: string,
    feedback: "positive" | "negative",
  ) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)),
    );
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const startVoiceInput = () => {
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
      };

      recognition.onend = () => {
        setIsListening(false);
      };
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
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg group relative ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : message.isError
                        ? "bg-red-50 text-red-900 border border-red-200"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 border"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                      <span className="text-lg">
                        {getAgentAvatar(message.agentId!)}
                      </span>
                      <span className="font-medium">
                        {getAgentName(message.agentId!)}
                      </span>
                      {!message.isError && (
                        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyMessage(message.content)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                            title="Copy message"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleFeedback(message.id, "positive")
                            }
                            className={`p-1 hover:bg-green-100 rounded text-gray-500 hover:text-green-600 ${
                              message.feedback === "positive"
                                ? "text-green-600 bg-green-100"
                                : ""
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleFeedback(message.id, "negative")
                            }
                            className={`p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600 ${
                              message.feedback === "negative"
                                ? "text-red-600 bg-red-100"
                                : ""
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(suggestion)}
                          className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <div
                    className={`text-xs mt-2 flex items-center justify-between ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === "user" && (
                      <button
                        onClick={() => handleCopyMessage(message.content)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-500 rounded text-blue-100 hover:text-white transition-all"
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(isLoading || typingEffect) && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg max-w-[85%] border">
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                    <span className="text-lg">{currentAgent.avatar}</span>
                    <span className="font-medium">{currentAgent.name}</span>
                  </div>
                  {typingEffect ? (
                    <div className="text-sm whitespace-pre-wrap">
                      {typingEffect}
                      <span className="animate-pulse">|</span>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2 mb-2">
              <div className="flex-1 relative">
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
                  className="text-sm pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
                {voiceEnabled && (
                  <button
                    onClick={startVoiceInput}
                    disabled={isLoading || isListening}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors ${
                      isListening
                        ? "text-red-600 animate-pulse"
                        : "text-gray-500"
                    }`}
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                size="sm"
                variant="outline"
                className="border-gray-200 hover:border-gray-300"
              >
                <NavigationIcons.Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-sm">
                  <span>Voice Input</span>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`w-8 h-4 rounded-full transition-colors ${
                      voiceEnabled ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        voiceEnabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Zap className="w-3 h-3" />
                  <span>AI-powered by Gemini</span>
                </div>
              </div>
            )}

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
