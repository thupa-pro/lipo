import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, MicOff, Sparkles, Bot, Copy, ThumbsUp, ThumbsDown, Zap, X, Minimize2, Maximize2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    sources?: string[]
    actions?: Array<{
      label: string
      action: () => void
      variant?: "primary" | "secondary"
    }>
  }
}

interface AIChatOpsProps {
  isOpen: boolean
  onToggle: () => void
  initialContext?: string
  placeholder?: string
  className?: string
  variant?: "floating" | "embedded" | "fullscreen"
  onMessageSent?: (message: string) => void
  onAIResponse?: (response: string) => void
}

export function AIChatOps({
  isOpen,
  onToggle,
  initialContext = "",
  placeholder = "Ask me anything about your service...",
  className,
  variant = "floating",
  onMessageSent,
  onAIResponse
}: AIChatOpsProps) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Initialize with context message if provided
  React.useEffect(() => {
    if (initialContext && messages.length === 0) {
      setMessages([{
        id: "initial",
        type: "system",
        content: `I'm here to help you with ${initialContext}. What would you like to know?`,
        timestamp: new Date()
      }])
    }
  }, [initialContext, messages.length])

  const simulateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Smart response generation based on keywords
    let response = ""
    let confidence = 0.8
    let actions: any[] = []
    
    if (userMessage.toLowerCase().includes("pricing") || userMessage.toLowerCase().includes("price")) {
      response = "Based on similar services in your area, I recommend pricing your service between $75-$95. This range has 23% higher booking rates."
      confidence = 0.92
      actions = [
        { label: "Update Pricing", action: () => console.log("Update pricing"), variant: "primary" },
        { label: "View Analysis", action: () => console.log("View analysis"), variant: "secondary" }
      ]
    } else if (userMessage.toLowerCase().includes("booking") || userMessage.toLowerCase().includes("schedule")) {
      response = "I notice you have 3 open time slots this week. Would you like me to optimize your availability to increase bookings?"
      confidence = 0.85
      actions = [
        { label: "Optimize Schedule", action: () => console.log("Optimize"), variant: "primary" }
      ]
    } else if (userMessage.toLowerCase().includes("photo") || userMessage.toLowerCase().includes("image")) {
      response = "Adding high-quality photos can increase your booking rate by up to 40%. I can guide you through taking professional-looking photos with your phone."
      confidence = 0.89
      actions = [
        { label: "Photo Guide", action: () => console.log("Photo guide"), variant: "primary" }
      ]
    } else {
      response = "I understand you're asking about your service. Let me analyze your current setup and provide personalized recommendations."
      confidence = 0.75
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content: response,
      timestamp: new Date(),
      metadata: {
        confidence,
        actions,
        sources: ["User Data Analysis", "Market Trends", "Best Practices"]
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    onMessageSent?.(userMessage.content)

    try {
      const aiResponse = await simulateAIResponse(userMessage.content)
      setMessages(prev => [...prev, aiResponse])
      onAIResponse?.(aiResponse.content)
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // In a real implementation, this would start/stop speech recognition
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const provideFeedback = (messageId: string, feedback: "positive" | "negative") => {
    console.log(`Feedback for ${messageId}: ${feedback}`)
    // In a real implementation, this would send feedback to improve AI
  }

  const getMessageIcon = (type: Message["type"]) => {
    switch (type) {
      case "ai":
        return <Bot className="h-4 w-4" />
      case "user":
        return <NavigationIcons.User className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getMessageStyles = (type: Message["type"]) => {
    switch (type) {
      case "ai":
        return "bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50"
      case "user":
        return "bg-glass border-glass-border ml-8"
      default:
        return "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 text-center"
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="ai"
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-glow-primary"
      >
        <OptimizedIcon name="MessageSquare" className="h-6 w-6" />
      </Button>
    )
  }

  const chatContent = (
    <Card 
      variant={variant === "floating" ? "glass" : "default"} 
      className={cn(
        "flex flex-col h-full",
        variant === "floating" && "shadow-glass-lg"
      )}
    >
      {/* Header */}
      <CardHeader variant="compact" className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Thinking..." : "Online"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {variant === "floating" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto space-y-4 max-h-96">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "p-3 rounded-xl border",
                    getMessageStyles(message.type)
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{message.content}</p>
                      
                      {/* AI Metadata */}
                      {message.type === "ai" && message.metadata && (
                        <div className="mt-3 space-y-2">
                          {/* Confidence */}
                          {message.metadata.confidence && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-glass rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                                  style={{ width: `${message.metadata.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(message.metadata.confidence * 100)}% confident
                              </span>
                            </div>
                          )}
                          
                          {/* Actions */}
                          {message.metadata.actions && message.metadata.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {message.metadata.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  variant={action.variant === "primary" ? "premium" : "ghost"}
                                  size="sm"
                                  onClick={action.action}
                                  className="h-7 px-3 text-xs"
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Message Actions */}
                      {message.type === "ai" && (
                        <div className="flex items-center gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => provideFeedback(message.id, "positive")}
                            className="h-6 w-6"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => provideFeedback(message.id, "negative")}
                            className="h-6 w-6"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading Message */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50"
              >
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex items-center gap-2">
                    <UIIcons.Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="flex-shrink-0 p-4 border-t border-glass-border">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  variant="glass"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  disabled={isLoading}
                  className="pr-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6",
                    isListening && "text-red-500"
                  )}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
              </div>
              <Button
                variant="premium"
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  )

  if (variant === "floating") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "fixed bottom-20 right-6 z-50 w-80",
          isMinimized ? "h-auto" : "h-96",
          className
        )}
      >
        {chatContent}
      </motion.div>
    )
  }

  return (
    <div className={cn("h-full", className)}>
      {chatContent}
    </div>
  )
}

// Hook for managing AI chat state
export function useAIChatOps() {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleChat = React.useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const openChat = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeChat = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    toggleChat,
    openChat,
    closeChat
  }
}
