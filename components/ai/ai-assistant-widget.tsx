"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageCircle,
  Send,
  Bot,
  Minimize2,
  Maximize2,
  X,
  User
} from "lucide-react";

// Clean, interface - NO, function props, at all
interface AIAssistantWidgetProps {
  position?: "floating" | "sidebar" | "bottom";
  size?: "small" | "normal" | "large";
  context?: Record<string, any>;
  theme?: "light" | "dark" | "auto";
  showAgentSelector?: boolean;
  enableVoice?: boolean;
  autoSuggest?: boolean;
  persistConversation?: boolean;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function AIAssistantWidget({
  position = "floating",
  size = "normal",
  context = {},
  theme = "auto",
  showAgentSelector = true,
  enableVoice = true,
  autoSuggest = true,
  persistConversation = true,
}: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Internal action handler - no external function needed
  const handleAction = useCallback((action: string, data?: any) => {
    console.log("AI Assistant action:", action, data);
    
    switch (action) {
      case "send_message":
        handleSendMessage();
        break;
      case "clear_chat":
        setMessages([]);
        toast({ title: "Chat cleared" });
        break;
      case "export_chat":
        toast({ title: "Chat exported" });
        break;
      default:
        console.log("Unknown action:", action);
    }
  }, [toast]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're looking for help with "${inputValue}". Let me assist you with that.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  }, [inputValue]);

  const getPositionClasses = () => {
    switch (position) {
      case "floating":
        return "fixed bottom-6 right-6 z-50";
      case "sidebar":
        return "fixed right-0 top-0 h-full z-40";
      case "bottom":
        return "fixed bottom-0 left-0 right-0 z-40";
      default:
        return "fixed bottom-6 right-6 z-50";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-80 h-96";
      case "normal":
        return "w-96 h-[500px]";
      case "large":
        return "w-[500px] h-[600px]";
      default:
        return "w-96 h-[500px]";
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`${getPositionClasses()} rounded-full w-14 h-14 shadow-lg`}
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`${getPositionClasses()} ${getSizeClasses()} shadow-xl`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg">AI Assistant</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-full p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Hello! How can I help you today?</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%]`}>
                  {message.role === "assistant" && (
                    <Bot className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <User className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <Bot className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("clear_chat")}
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("export_chat")}
              >
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}