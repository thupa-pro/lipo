import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Brain, Lightbulb, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AIContextualModalProps {
  isOpen: boolean
  onClose: () => void
  context: {
    page: string
    userAction: string
    sessionData?: Record<string, any>
  }
  aiSuggestions: Array<{
    id: string
    title: string
    description: string
    confidence: number
    action: () => void
    icon?: React.ReactNode
    variant?: "suggestion" | "warning" | "opportunity"
  }>
  className?: string
}

export function AIContextualModal({ 
  isOpen, 
  onClose, 
  context, 
  aiSuggestions,
  className 
}: AIContextualModalProps) {
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<string | null>(null)
  const [processingAction, setProcessingAction] = React.useState(false)

  const handleSuggestionAction = async (suggestion: any) => {
    setSelectedSuggestion(suggestion.id)
    setProcessingAction(true)
    
    try {
      await suggestion.action()
      // Show success state briefly before closing
      setTimeout(() => {
        setProcessingAction(false)
        onClose()
      }, 1500)
    } catch (error) {
      setProcessingAction(false)
      // Handle error state
    }
  }

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "warning":
        return "border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20"
      case "opportunity":
        return "border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-950/20"
      default:
        return "border-blue-200/50 bg-blue-50/50 dark:bg-blue-950/20"
    }
  }

  const getVariantIcon = (variant: string, customIcon?: React.ReactNode) => {
    if (customIcon) return customIcon
    
    switch (variant) {
      case "warning":
        return <Lightbulb className="h-4 w-4 text-amber-600" />
      case "opportunity":
        return <UIIcons.ArrowRight className="h-4 w-4 text-emerald-600" />
      default:
        return <Brain className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-modal-backdrop bg-black/20 backdrop-blur-md"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "w-full max-w-2xl max-h-[80vh] overflow-hidden",
                className
              )}
            >
              <Card variant="premium" className="relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 p-1 rounded-lg glass-medium hover:glass-strong transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-ai">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">AI Assistant</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your activity on <span className="font-medium">{context.page}</span>
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Context Summary */}
                  <div className="p-3 rounded-lg bg-glass border border-glass-border">
                    <p className="text-sm">
                      <span className="font-medium">Context:</span> {context.userAction}
                    </p>
                  </div>

                  {/* AI Suggestions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Smart Suggestions</h4>
                    
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-200 cursor-pointer group",
                          getVariantStyles(suggestion.variant || "suggestion"),
                          selectedSuggestion === suggestion.id && processingAction && "animate-pulse",
                          "hover:shadow-md hover:-translate-y-0.5"
                        )}
                        onClick={() => !processingAction && handleSuggestionAction(suggestion)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getVariantIcon(suggestion.variant || "suggestion", suggestion.icon)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{suggestion.title}</h5>
                              <span className="text-xs bg-glass px-2 py-0.5 rounded-full">
                                {Math.round(suggestion.confidence * 100)}% confident
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {suggestion.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <div 
                                  className="h-1 w-16 bg-gradient-to-r from-success-500 to-ai-500 rounded-full"
                                  style={{ width: `${suggestion.confidence * 64}px` }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  confidence
                                </span>
                              </div>

                              {selectedSuggestion === suggestion.id && processingAction ? (
                                <div className="flex items-center gap-2 text-xs text-success-600">
                                  <Check className="h-3 w-3" />
                                  Processing...
                                </div>
                              ) : (
                                <UIIcons.ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Learning Note */}
                  <div className="mt-6 p-3 rounded-lg bg-glass-subtle border border-glass-border">
                    <p className="text-xs text-muted-foreground">
                      💡 <span className="font-medium">AI Learning:</span> These suggestions improve based on your choices and outcomes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for triggering contextual modals
export function useAIContextualModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [context, setContext] = React.useState<any>(null)
  const [suggestions, setSuggestions] = React.useState<any[]>([])

  const showModal = React.useCallback((newContext: any, newSuggestions: any[]) => {
    setContext(newContext)
    setSuggestions(newSuggestions)
    setIsOpen(true)
  }, [])

  const hideModal = React.useCallback(() => {
    setIsOpen(false)
    // Clear after animation
    setTimeout(() => {
      setContext(null)
      setSuggestions([])
    }, 300)
  }, [])

  return {
    isOpen,
    context,
    suggestions,
    showModal,
    hideModal,
    AIContextualModal: context ? (
      <AIContextualModal
        isOpen={isOpen}
        onClose={hideModal}
        context={context}
        aiSuggestions={suggestions}
      />
    ) : null
  }
}
