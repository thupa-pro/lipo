"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  Bot,
  Lightbulb, ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw
  MapPin,
  Briefcase,
  Users,
  Settings,
  HelpCircle,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "quick_action" | "progress_update" | "suggestion";
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
  suggestions?: string[];
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  category: "profile" | "preferences" | "verification" | "setup";
}

interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  userType?: "customer" | "provider";
  estimatedTimeRemaining: number;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Loconomy",
    description: "Let's get you started",
    completed: true,
    current: false,
    category: "profile",
  },
  {
    id: "user_type",
    title: "Choose Your Role",
    description: "Are you looking for services or providing them?",
    completed: true,
    current: false,
    category: "profile",
  },
  {
    id: "basic_info",
    title: "Basic Information",
    description: "Tell us about yourself",
    completed: false,
    current: true,
    category: "profile",
  },
  {
    id: "preferences",
    title: "Set Preferences",
    description: "Customize your experience",
    completed: false,
    current: false,
    category: "preferences",
  },
  {
    id: "verification",
    title: "Verify Account",
    description: "Secure your account",
    completed: false,
    current: false,
    category: "verification",
  },
  {
    id: "setup_complete",
    title: "You're All Set!",
    description: "Start exploring Loconomy",
    completed: false,
    current: false,
    category: "setup",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "👋 Welcome to Loconomy! I'm your personal onboarding assistant. I'm here to help you get set up quickly and easily. What would you like to know first?",
    timestamp: new Date(),
    type: "text",
    suggestions: [
      "How does Loconomy work?",
      "What information do I need to provide?",
      "How long does setup take?",
      "What can I do after setup?",
    ],
  },
];

const QUICK_RESPONSES = {
  "How does Loconomy work?": "Loconomy connects you with trusted local service providers in your area. Whether you need house cleaning, handyman services, or tutoring, we make it easy to find, book, and pay for services you need.",
  "What information do I need to provide?": "Just the basics! We'll need your name, location, and what type of services interest you. If you're a service provider, we'll also ask about your skills and experience.",
  "How long does setup take?": "Most users complete setup in under 5 minutes! I'll guide you through each step, and you can always take breaks and come back later.",
  "What can I do after setup?": "Once set up, you can browse services, read reviews, book appointments, message providers, and much more. Providers can create listings and start accepting bookings right away!",
};

interface OnboardingChatAssistantProps {
  onStepComplete?: (stepId: string) => void;
  onOnboardingComplete?: () => void;
  userType?: "customer" | "provider";
  position?: "floating" | "embedded" | "fullwidth";
  autoStart?: boolean;
}

export default function OnboardingChatAssistant({
  onStepComplete,
  onOnboardingComplete,
  userType = "customer",
  position = "embedded",
  autoStart = true,
}: OnboardingChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 2,
    totalSteps: ONBOARDING_STEPS.length,
    completedSteps: ["welcome", "user_type"],
    userType,
    estimatedTimeRemaining: 3,
  });
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI typing and response
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);

    // Check for quick responses
    if (QUICK_RESPONSES[userMessage as keyof typeof QUICK_RESPONSES]) {
      return QUICK_RESPONSES[userMessage as keyof typeof QUICK_RESPONSES];
    }

    // Context-aware responses based on onboarding progress
    const currentStepId = ONBOARDING_STEPS[progress.currentStep]?.id;
    
    if (userMessage.toLowerCase().includes("help") || userMessage.toLowerCase().includes("stuck")) {
      return "No worries! I'm here to help. What specific part are you having trouble with? I can guide you through any step or answer questions about the process.";
    }

    if (userMessage.toLowerCase().includes("skip") || userMessage.toLowerCase().includes("later")) {
      return "That's okay! You can always come back to complete your profile later. However, completing it now will help us provide better matches and recommendations. Would you like to continue with just the essential information?";
    }

    if (currentStepId === "basic_info") {
      return "Great! For the basic information step, I'll need your full name, location (city and state), and a brief description of what services you're interested in. This helps us personalize your experience. Ready to start?";
    }

    if (currentStepId === "preferences") {
      return "Perfect! Now let's set up your preferences. This includes things like your preferred service radius, price range, and any specific requirements you have. These settings help us show you the most relevant options.";
    }

    // Generic helpful response
    return "I understand! Let me help you with that. Based on where you are in the onboarding process, I'd recommend focusing on completing your basic information first. This will unlock more features and better recommendations. Would you like me to guide you through the next step?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Get AI response
    const aiResponse = await simulateAIResponse(userMessage.content);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
      actions: [
        { label: "Continue Setup", action: "continue_onboarding", primary: true },
        { label: "Learn More", action: "learn_more" },
      ],
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleQuickResponse = async (response: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    const aiResponse = await simulateAIResponse(response);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "continue_onboarding":
        const nextStep = ONBOARDING_STEPS.find(step => !progress.completedSteps.includes(step.id));
        if (nextStep) {
          toast.success(`Continuing with: ${nextStep.title}`);
          onStepComplete?.(nextStep.id);
        }
        break;
      case "learn_more":
        window.open("/how-it-works", "_blank");
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info("Voice input activated - speak now!");
    } else {
      toast.info("Voice input stopped");
    }
  };

  const restartOnboarding = () => {
    setProgress({
      currentStep: 0,
      totalSteps: ONBOARDING_STEPS.length,
      completedSteps: [],
      userType,
      estimatedTimeRemaining: 5,
    });
    setMessages(INITIAL_MESSAGES);
    toast.success("Onboarding restarted!");
  };

  const progressPercentage = (progress.completedSteps.length / progress.totalSteps) * 100;

  if (position === "floating" && isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white border rounded-lg shadow-lg",
        position === "floating" && "fixed bottom-4 right-4 w-96 h-[600px] z-50",
        position === "embedded" && "w-full max-w-4xl mx-auto",
        position === "fullwidth" && "w-full h-full"
      )}
    >
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-lg">Onboarding Assistant</CardTitle>
              <p className="text-sm text-gray-600">
                {isTyping ? "Typing..." : "Online • Ready to help"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={restartOnboarding}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            {position === "floating" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span>Onboarding Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Step {progress.currentStep + 1} of {progress.totalSteps}</span>
            <span>~{progress.estimatedTimeRemaining} min remaining</span>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-0">
        <div className={cn(
          "overflow-y-auto p-4 space-y-4",
          position === "floating" && "h-80",
          position === "embedded" && "h-96",
          position === "fullwidth" && "h-[calc(100vh-300px)]"
        )}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === "user" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-900"
                )}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickResponse(suggestion)}
                          className="block w-full text-left text-xs p-2 bg-white/20 hover:bg-white/30 rounded border"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {message.actions && (
                    <div className="mt-3 flex gap-2">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={action.primary ? "default" : "outline"}
                          onClick={() => handleAction(action.action)}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything about getting started..."
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0",
                  isListening && "text-red-500"
                )}
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              <span>Powered by AI • Instant help available</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 border rounded">Enter</kbd>
              <span>to send</span>
            </div>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
}