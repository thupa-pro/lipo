import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Mic, MicOff, Sparkles, Brain, Zap, Lightbulb, Crown, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COPY } from "@/lib/content/copy";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "suggestion" | "action" | "result";
  metadata?: any;
}

interface AIAssistantProps {
  className?: string;
  userType?: "customer" | "provider";
  context?: {
    currentPage?: string;
    userLocation?: string;
    recentActivity?: any[];
  };
}

const QUICK_ACTIONS = [
  { icon: Search, label: "Find Services", command: "/search", description: "Discover elite providers" },
  { icon: Calendar, label: "Book Now", command: "/book", description: "Schedule instantly" },
  { icon: DollarSign, label: "Get Pricing", command: "/price", description: "Compare rates" },
  { icon: MessageSquare, label: "Ask Question", command: "/help", description: "Get assistance" }
];

const CONTEXTUAL_SUGGESTIONS = {
  customer: [
    "Find me a house cleaner for this weekend",
    "What's the best rated plumber near me?", 
    "Schedule a dog walker for next week",
    "Compare tutoring prices in my area"
  ],
  provider: [
    "How can I increase my bookings?",
    "What's the optimal pricing for my service?",
    "Show me my performance analytics",
    "Help me improve my profile"
  ]
};

export function EnhancedAIAssistant({ 
  className = "",
  userType = "customer",
  context = {}
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: COPY.ai.agent.welcome,
      sender: "ai",
      timestamp: new Date(),
      type: "text"
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string, isCommand = false) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: isCommand ? "action" : "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(content, userType, context);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleQuickAction = (action: any) => {
    sendMessage(action.command, true);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would integrate with Web Speech API
  };

  const generateAIResponse = (userInput: string, userType: string, context: any): Message => {
    const lowerInput = userInput.toLowerCase();
    
    // Command responses
    if (lowerInput.startsWith('/')) {
      return handleSlashCommand(userInput, userType);
    }
    
    // Service search
    if (lowerInput.includes('find') || lowerInput.includes('search')) {
      return {
        id: Date.now().toString(),
        content: "🔍 I'm searching for elite providers in your area. Based on your request, I found several highly-rated professionals. Would you like me to show you the top matches?",
        sender: "ai",
        timestamp: new Date(),
        type: "result",
        metadata: {
          suggestions: [
            "Show me the top 3 providers",
            "Filter by availability today",
            "Compare pricing options"
          ]
        }
      };
    }
    
    // Booking requests
    if (lowerInput.includes('book') || lowerInput.includes('schedule')) {
      return {
        id: Date.now().toString(),
        content: "📅 I'll help you book that service! I can check availability and handle the entire booking process. Let me find the best providers and show you available time slots.",
        sender: "ai",
        timestamp: new Date(),
        type: "action",
        metadata: {
          nextSteps: [
            "Check provider availability",
            "Compare time slots",
            "Confirm booking details"
          ]
        }
      };
    }
    
    // Pricing questions
    if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return {
        id: Date.now().toString(),
        content: "💰 I can provide real-time pricing based on your location and service needs. Our AI analyzes market rates to ensure fair pricing. Would you like me to get quotes from multiple providers?",
        sender: "ai",
        timestamp: new Date(),
        type: "result",
        metadata: {
          features: [
            "Compare multiple quotes",
            "Market rate analysis",
            "Transparent pricing breakdown"
          ]
        }
      };
    }
    
    // Default helpful response
    return {
      id: Date.now().toString(),
      content: `I understand you're looking for help with "${userInput}". As your AI concierge, I can assist with finding services, booking appointments, answering questions, and managing your account. What specific help do you need?`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      metadata: {
        suggestions: [
          "Find local services",
          "Book an appointment", 
          "Get pricing information",
          "Ask about our platform"
        ]
      }
    };
  };

  const handleSlashCommand = (command: string, userType: string): Message => {
    const cmd = command.split(' ')[0].toLowerCase();
    
    const responses = {
      '/search': "🔍 **Search Mode Activated**\n\nI'm ready to find elite providers for you. Just tell me what service you need and I'll show you the best matches in your area.",
      '/book': "📅 **Booking Assistant Ready**\n\nI'll guide you through the entire booking process. What service would you like to schedule?",
      '/price': "💰 **Pricing Intelligence**\n\nI can provide real-time market pricing for any service. What would you like pricing information for?",
      '/help': `🤝 **AI Concierge at Your Service**\n\n${COPY.ai.agent.capabilities}\n\n${COPY.ai.agent.features.join('\n')}`
    };
    
    return {
      id: Date.now().toString(),
      content: responses[cmd as keyof typeof responses] || "I didn't recognize that command. Try /search, /book, /price, or /help",
      sender: "ai",
      timestamp: new Date(),
      type: "action"
    };
  };

  const formatMessageContent = (message: Message) => {
    const lines = message.content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      return <div key={index} className="mb-1">{line}</div>;
    });
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="h-[600px] flex flex-col bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 border-blue-200/50 dark:border-blue-800/30">
        {/* Header */}
        <CardHeader className="border-b border-blue-200/50 dark:border-blue-800/30 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Elite AI Concierge</h3>
                <p className="text-blue-100 text-sm">Your intelligent service assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-blue-100">Online</span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${
                  message.sender === "user" 
                    ? "bg-blue-600 text-white rounded-2xl rounded-br-md" 
                    : "bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-2xl rounded-bl-md"
                } p-4 shadow-lg`}>
                  {message.sender === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        AI Concierge
                      </span>
                      {message.type === "action" && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Action
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className={message.sender === "user" ? "text-white" : "text-slate-700 dark:text-slate-300"}>
                    {formatMessageContent(message)}
                  </div>

                  {/* Message Metadata */}
                  {message.metadata && (
                    <div className="mt-3 space-y-2">
                      {message.metadata.suggestions && (
                        <div className="flex flex-wrap gap-2">
                          {message.metadata.suggestions.map((suggestion: string, index: number) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-7"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {message.metadata.features && (
                        <div className="space-y-1">
                          {message.metadata.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <UIIcons.CheckCircle className="w-3 h-3 text-emerald-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {message.metadata.nextSteps && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Next steps:</p>
                          {message.metadata.nextSteps.map((step: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                              </div>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-blue-100" : "text-slate-400"
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-2xl rounded-bl-md p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Suggestions & Quick Actions */}
        {showSuggestions && (
          <div className="px-6 py-4 border-t border-blue-200/50 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-950/30">
            <div className="space-y-4">
              {/* Quick Actions */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  🚀 Quick Actions
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {QUICK_ACTIONS.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="h-auto p-3 flex flex-col items-center gap-2 text-center"
                    >
                      <action.icon className="w-4 h-4" />
                      <div>
                        <div className="text-xs font-medium">{action.label}</div>
                        <div className="text-xs text-slate-500">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contextual Suggestions */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  💡 Try asking me:
                </p>
                <div className="flex flex-wrap gap-2">
                  {CONTEXTUAL_SUGGESTIONS[userType].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-8 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      "{suggestion}"
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-blue-200/50 dark:border-blue-800/30 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask me anything... (try /search, /book, /price, or /help)"
                className="pr-12 h-12 rounded-xl border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 ${
                  isListening ? "text-red-500" : "text-slate-400"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="h-12 w-12 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              {isTyping ? (
                <UIIcons.Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>💡 Tip: Use slash commands like /search or /book for instant actions</span>
            <div className="flex items-center gap-1">
              <OptimizedIcon name="Shield" className="w-3 h-3" />
              <span>Secure AI</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default EnhancedAIAssistant;
