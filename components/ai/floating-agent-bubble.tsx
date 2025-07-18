"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentCommandInput } from "@/components/ui/agent-command-input";
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2,
  Zap,
  Sparkles,
  Brain,
  User,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  command?: string;
  isTyping?: boolean;
}

interface FloatingAgentBubbleProps {
  className?: string;
  defaultPosition?: "bottom-right" | "bottom-left";
  isDemo?: boolean;
}

export function FloatingAgentBubble({
  className,
  defaultPosition = "bottom-right",
  isDemo = false
}: FloatingAgentBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm your AI assistant. I can help you book services, get recommendations, or answer questions. Try typing `/book` or `/help` to get started!",
      sender: "agent",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize position
  useEffect(() => {
    if (typeof window !== "undefined") {
      const x = defaultPosition === "bottom-right" ? window.innerWidth - 80 : 80;
      const y = window.innerHeight - 80;
      setPosition({ x, y });
    }
  }, [defaultPosition]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update unread count when closed
  useEffect(() => {
    if (!isOpen) {
      const agentMessages = messages.filter(m => m.sender === "agent");
      const lastAgentMessage = agentMessages[agentMessages.length - 1];
      if (lastAgentMessage && lastAgentMessage.id !== "welcome") {
        setUnreadCount(prev => prev + 1);
      }
    } else {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (content: string, command?: any) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      command: command?.name
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = getAIResponse(content, command?.name);
      responses.forEach((response, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `${Date.now()}-${index}`,
            content: response,
            sender: "agent",
            timestamp: new Date()
          }]);
          if (index === responses.length - 1) {
            setIsTyping(false);
          }
        }, index * 1000);
      });
    }, 1000);
  };

  const handleCommandExecute = (command: string, args: string[]) => {
    const commandMessage = `/${command} ${args.join(" ")}`.trim();
    handleSendMessage(commandMessage);
  };

  const getAIResponse = (message: string, command?: string): string[] => {
    if (command) {
      switch (command) {
        case "book":
          return [
            "I'll help you book a service! What type of service are you looking for?",
            "I can show you available providers in your area and help you choose the best time slot."
          ];
        case "cancel":
          return [
            "I can help you cancel a booking. Let me pull up your active bookings...",
            "Which booking would you like to cancel? I'll also help you understand any cancellation policies."
          ];
        case "tip":
          return [
            "Adding a tip is a great way to show appreciation! How much would you like to tip?",
            "Tips are processed securely and go directly to your service provider."
          ];
        case "escalate":
          return [
            "I'll escalate this to our support team right away. Can you provide more details about the issue?",
            "A human support agent will be with you shortly. In the meantime, I'll document everything for them."
          ];
        case "help":
          return [
            "Here are some things I can help you with:",
            "• `/book` - Book a new service\n• `/cancel` - Cancel existing booking\n• `/tip` - Add tip for provider\n• `/escalate` - Get human support\n• `/reschedule` - Change booking time\n• `/review` - Leave a review"
          ];
        default:
          return ["I'm not sure about that command. Try `/help` to see available commands."];
      }
    }

    // Regular message responses
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return ["Hello! How can I assist you today? 👋"];
    }
    if (lowerMessage.includes("help")) {
      return ["I'm here to help! You can ask me about booking services, finding providers, or use slash commands like `/book` for quick actions."];
    }
    if (lowerMessage.includes("find") || lowerMessage.includes("search")) {
      return ["I can help you find services! What are you looking for? I can search by location, service type, or specific requirements."];
    }

    return [
      "I understand you're looking for assistance. I can help you with booking services, finding providers, or managing your account.",
      "Try using commands like `/book` for bookings or just tell me what you need help with!"
    ];
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = bubbleRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - offsetX)),
          y: Math.max(0, Math.min(window.innerHeight - 80, e.clientY - offsetY))
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      <motion.div
        ref={bubbleRef}
        className={cn(
          "fixed z-50 cursor-move",
          isDragging && "cursor-grabbing",
          className
        )}
        style={{ left: position.x, top: position.y }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {!isOpen ? (
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 relative"
            onMouseDown={handleDragStart}
            onClick={() => setIsOpen(true)}
          >
            <div className="relative">
              <Sparkles className="w-8 h-8" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
          </Button>
        ) : null}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-50"
            style={{ 
              left: Math.min(position.x, window.innerWidth - 400),
              top: Math.max(20, position.y - 500)
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className={cn(
              "w-96 h-96 shadow-xl border-2",
              isMinimized && "h-12"
            )}>
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-primary/10 to-blue-500/10">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Brain className="w-5 h-5 text-primary" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">AI Assistant</div>
                    <div className="text-xs text-muted-foreground">
                      {isTyping ? "Typing..." : "Online"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-80">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          message.sender === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.sender === "agent" && (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-3 h-3 text-primary" />
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            "max-w-xs p-2 rounded-lg text-sm",
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.command && (
                            <Badge variant="outline" className="mb-1 text-xs">
                              <Zap className="w-2 h-2 mr-1" />
                              {message.command}
                            </Badge>
                          )}
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>

                        {message.sender === "user" && (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-2 justify-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                        <div className="bg-muted p-2 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t p-3">
                    <AgentCommandInput
                      onSendMessage={handleSendMessage}
                      onCommandExecute={handleCommandExecute}
                      placeholder="Ask me anything or use /commands..."
                      disabled={isTyping}
                      showVoiceInput={true}
                      showCommandSuggestions={true}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}