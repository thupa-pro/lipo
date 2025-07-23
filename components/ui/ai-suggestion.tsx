import * as React from \"react\"
import { motion, AnimatePresence } from \"framer-motion\"
import { cva, type VariantProps } from \"class-variance-authority\"
import { Sparkles, Check, X } from \"lucide-react\"

import { cn } from \"@/lib/utils\"
import { Button } from \"@/components/ui/button\"

const aiSuggestionVariants = cva(
  \"relative overflow-hidden transition-all duration-300 group\",
  {
    variants: {
      variant: {
        default: \"bg-glass border border-glass-border backdrop-blur-glass rounded-xl p-4 shadow-glass hover:bg-glass-strong hover:shadow-glass-lg\",
        premium: \"bg-glass border border-glass-border backdrop-blur-glass rounded-xl p-4 shadow-glass-lg hover:bg-glass-strong hover:shadow-premium hover:-translate-y-1\",
        ai: \"bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-4 shadow-lg hover:shadow-glow-primary\",
      },
      size: {
        default: \"p-4\",
        sm: \"p-3\",
        lg: \"p-6\",
      },
      urgency: {
        low: \"\",
        medium: \"ring-2 ring-amber-500/20\",
        high: \"ring-2 ring-red-500/20 animate-glow-pulse\",
      },
    },
    defaultVariants: {
      variant: \"default\",
      size: \"default\",
      urgency: \"low\",
    },
  }
)

export interface AISuggestionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aiSuggestionVariants> {
  title: string
  description?: string
  confidence?: number
  onAccept?: () => void
  onDismiss?: () => void
  actions?: React.ReactNode
  icon?: React.ReactNode
  thinking?: boolean
}

const AISuggestion = React.forwardRef<HTMLDivElement, AISuggestionProps>(
  ({
    className,
    variant,
    size,
    urgency,
    title,
    description,
    confidence,
    onAccept,
    onDismiss,
    actions,
    icon,
    thinking,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)
    
    const handleAccept = () => {
      onAccept?.()
      setIsVisible(false)
    }
    
    const handleDismiss = () => {
      onDismiss?.()
      setIsVisible(false)
    }
    
    if (!isVisible) return null
    
    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: \"spring\", stiffness: 300, damping: 30 }}
          className={cn(aiSuggestionVariants({ variant, size, urgency }), className)}
          {...props}
        >
          {thinking && (
            <div className=\"absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer\" />
          )}
          
          <div className=\"flex items-start gap-3\">
            <div className=\"flex-shrink-0 mt-0.5\">
              {icon || (
                <div className=\"p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500\">
                  <Sparkles className=\"h-4 w-4 text-white\" />
                </div>
              )}
            </div>
            
            <div className=\"flex-1 min-w-0\">
              <div className=\"flex items-center gap-2 mb-1\">
                <h4 className=\"text-sm font-medium text-foreground\">{title}</h4>
                {confidence && (
                  <span className=\"text-xs text-muted-foreground bg-glass-subtle px-2 py-0.5 rounded-full\">
                    {Math.round(confidence * 100)}% confident
                  </span>
                )}
              </div>
              
              {description && (
                <p className=\"text-sm text-muted-foreground mb-3\">{description}</p>
              )}
              
              <div className=\"flex items-center gap-2\">
                {actions || (
                  <>
                    {onAccept && (
                      <Button
                        size=\"sm\"
                        variant=\"premium\"
                        onClick={handleAccept}
                        className=\"h-8 px-3 text-xs\"
                      >
                        <Check className=\"h-3 w-3 mr-1\" />
                        Accept
                      </Button>
                    )}
                    {onDismiss && (
                      <Button
                        size=\"sm\"
                        variant=\"ghost\"
                        onClick={handleDismiss}
                        className=\"h-8 px-3 text-xs\"
                      >
                        <X className=\"h-3 w-3 mr-1\" />
                        Dismiss
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className=\"absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none\" />
        </motion.div>
      </AnimatePresence>
    )
  }
)
AISuggestion.displayName = \"AISuggestion\"

export { AISuggestion, aiSuggestionVariants }