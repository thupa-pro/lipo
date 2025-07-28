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
import { MessageCircle, Send, Minimize2, Maximize2, X, Sparkles, Bot, Lightbulb, Volume2, VolumeX, Copy, ThumbsUp, ThumbsDown, RotateCcw, Mic, Zap, Brain, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  sentiment?: "positive" | "neutral" | "negative";
}

interface AIChatProps {
  agentId?: string;
  context?: any;
  position?: "floating" | "embedded" | "fullwidth";
  theme?: "light" | "dark" | "brand";
  autoOpen?: boolean;
  proactiveMessage?: boolean;
  className?: string;
}

export default function EnhancedAIChat({
  agentId,
  context = {},
  position = "floating",
  theme = "brand",
  autoOpen = false,
  proactiveMessage = true,
  className = "",
}: AIChatProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
  const [showQuickActions, setShowQuickActions] = useState(true);
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
        sentiment: "positive",
      };

      setMessages([proactiveMessage]);
    } catch (error) {
      console.error("Error generating proactive message:", error);
      // Show default greeting
      const greetingMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `👋 Hi! I'm ${currentAgent.name}, your AI assistant. I'm here to help you with anything on Loconomy. What can I help you with today?`,
        timestamp: new Date(),
        agentId: currentAgent.id,
        sentiment: "positive",
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
    setShowQuickActions(false);

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
        sentiment: "positive",
      };

      typewriterEffect(response, () => {
        setMessages((prev) => [...prev, assistantMessage]);
      });
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I'm having trouble connecting right now. Please try again, or feel free to browse our services while I get back online!`,
        timestamp: new Date(),
        agentId: currentAgent.id,
        isError: true,
        sentiment: "negative",
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
      "Compare options",
      "Get pricing details"
    ];
    return suggestions.slice(0, 3);
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
    return agent?.avatar || "🤖";
  };

  const getAgentName = (agentId: string) => {
    const agent = USER_AI_AGENTS.find((a) => a.id === agentId);
    return agent?.name || "AI Assistant";
  };

  const getThemeClasses = () => {
    const themes = {
      light: "glass-ultra border-white/20 text-gray-900 shadow-2xl backdrop-blur-xl",
      dark: "glass-ultra border-white/10 text-white shadow-2xl backdrop-blur-xl",
      brand: "glass-ultra border-blue-200/30 text-gray-900 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-blue-50/90 to-purple-50/90",
    };
    return themes[theme];
  };

  const getPositionClasses = () => {
    const positions = {
      floating: `fixed bottom-4 right-4 z-50 transition-all duration-700 ease-out transform ${isExpanded ? 'w-[420px] max-h-[700px] scale-100' : 'w-80 max-h-96 scale-100'} ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`,
      embedded: "w-full max-w-md mx-auto",
      fullwidth: "w-full",
    };
    return positions[position];
  };

  const quickActions = [
    { icon: Bot, label: "Book a Service", action: () => setInput("Help me book a service") },
    { icon: Sparkles, label: "Find Providers", action: () => setInput("Find providers near me") },
    { icon: Star, label: "Special Offers", action: () => setInput("Show me special offers") },
    { icon: Shield, label: "Safety Info", action: () => setInput("Tell me about safety") },
  ];

  if (!mounted || !currentAgent) return null;

  // Floating chat bubble when closed
  if (position === "floating" && !isOpen) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 group overflow-hidden"
          size="icon"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
          <MessageCircle className="h-7 w-7 text-white z-10 relative" />
        </Button>
        
        {/* Agent indicator */}
        <motion.div
          className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm font-bold">{currentAgent.avatar}</span>
        </motion.div>

        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
        
        {/* Notification badge */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-xs text-white font-bold">1</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className={`${getPositionClasses()} ${getThemeClasses()} ${className} overflow-hidden border-2`}>
        {/* Enhanced Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-b border-white/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white shadow-lg border-2 border-white/30"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {currentAgent.avatar}
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              </div>
              <div>
                <h3 className="font-bold text-base bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {currentAgent.name}
                </h3>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  {currentAgent.role} • AI-Powered
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-xs">
                    {[...Array(5)].map((_, i) => (
                      <OptimizedIcon name="Star" key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">24/7 Available</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {position === "floating" && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hover:bg-blue-500/20 transition-all duration-300 hover:scale-105"
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="hover:bg-purple-500/20 transition-all duration-300 hover:scale-105"
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
                    className="hover:bg-red-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Agent capabilities preview */}
          {!isMinimized && (
            <motion.div
              className="mt-3 flex flex-wrap gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentAgent.capabilities.slice(0, 3).map((capability, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 glass-subtle rounded-full text-blue-600 border border-blue-200/50"
                >
                  {capability}
                </span>
              ))}
            </motion.div>
          )}
        </CardHeader>

        {/* Messages Area */}
        {!isMinimized && (
          <CardContent className="p-0">
            <div className={`${isExpanded ? 'h-[480px]' : 'h-72'} overflow-y-auto px-4 py-3 space-y-4 transition-all duration-500 custom-scrollbar`}>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.1 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl group relative backdrop-blur-sm border ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-lg border-blue-200/30"
                          : message.isError
                            ? "glass-subtle text-red-900 border-red-200/50 bg-red-50/80"
                            : "glass-subtle text-gray-900 border-white/40 shadow-md"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                            {getAgentAvatar(message.agentId!)}
                          </div>
                          <span className="font-semibold">
                            {getAgentName(message.agentId!)}
                          </span>
                          <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopyMessage(message.content)}
                              className="p-1 hover:bg-gray-200/50 rounded text-gray-500 hover:text-gray-700 transition-colors"
                              title="Copy message"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "positive")}
                              className={`p-1 hover:bg-green-100/50 rounded text-gray-500 hover:text-green-600 transition-colors ${
                                message.feedback === "positive" ? "text-green-600 bg-green-100/50" : ""
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "negative")}
                              className={`p-1 hover:bg-red-100/50 rounded text-gray-500 hover:text-red-600 transition-colors ${
                                message.feedback === "negative" ? "text-red-600 bg-red-100/50" : ""
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      
                      {message.suggestions && (
                        <motion.div
                          className="mt-3 flex flex-wrap gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInput(suggestion)}
                              className="text-xs px-3 py-1 bg-blue-100/80 hover:bg-blue-200/80 text-blue-700 rounded-full transition-all duration-200 hover:scale-105 border border-blue-200/50"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </motion.div>
                      )}
                      
                      <div className={`text-xs mt-3 flex items-center justify-between ${
                        message.role === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        <div className="flex items-center gap-2">
                          <OptimizedIcon name="Clock" className="w-3 h-3" />
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                        </div>
                        {message.sentiment && (
                          <div className={`w-2 h-2 rounded-full ${
                            message.sentiment === "positive" ? "bg-green-400" :
                            message.sentiment === "negative" ? "bg-red-400" : "bg-gray-400"
                          }`}></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {(isLoading || typingEffect) && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="glass-subtle p-4 rounded-2xl max-w-[85%] border border-white/40 shadow-md">
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm animate-pulse">
                        {currentAgent.avatar}
                      </div>
                      <span className="font-semibold">{currentAgent.name} is typing...</span>
                    </div>
                    {typingEffect ? (
                      <div className="text-sm whitespace-pre-wrap">
                        {typingEffect}
                        <span className="animate-pulse ml-1">|</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-blue-600 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-purple-600 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-pink-600 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showQuickActions && messages.length === 0 && (
              <motion.div
                className="px-4 py-3 border-t border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs text-gray-500 mb-3 font-medium">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={action.action}
                      className="p-3 glass-subtle rounded-xl hover:scale-105 transition-all duration-200 border border-white/30 group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <action.icon className="w-5 h-5 mx-auto mb-1 text-blue-600 group-hover:text-purple-600 transition-colors" />
                      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Input Area */}
            <div className="p-4 border-t border-white/30 bg-gradient-to-r from-gray-50/90 to-blue-50/90 backdrop-blur-sm">
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInput(e.target.value)
                    }
                    placeholder={`Ask ${currentAgent.name} anything...`}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    disabled={isLoading}
                    className="text-sm pr-12 glass-subtle border-white/40 focus:border-blue-400 focus:ring-blue-200/50 placeholder:text-gray-400 rounded-xl"
                  />
                  {voiceEnabled && (
                    <button
                      onClick={startVoiceInput}
                      disabled={isLoading || isListening}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-200/50 transition-colors ${
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
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl px-4"
                >
                  {isLoading ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  size="sm"
                  variant="outline"
                  className="border-white/40 hover:border-gray-300 hover:scale-105 transition-all duration-200 rounded-xl"
                >
                  <NavigationIcons.Settings className="h-4 w-4" />
                </Button>
              </div>

              {/* Enhanced Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    className="glass-ultra border border-white/40 rounded-xl p-4 space-y-3"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-blue-600" />
                        <span>Voice Input</span>
                      </div>
                      <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          voiceEnabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: voiceEnabled ? 24 : 2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span>AI-powered by Gemini</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-green-500" />
                        <span>37+ Languages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <OptimizedIcon name="Shield" className="w-3 h-3 text-blue-500" />
                        <span>Secure & Private</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
