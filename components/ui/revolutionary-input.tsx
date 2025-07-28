import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Mic, MicOff, Eye, EyeOff, Check, X } from "lucide-react"

interface RevolutionaryInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  variant?: 'glassmorphic' | 'neumorphic' | 'cyberpunk' | 'minimalist' | 'hyperrealistic'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  error?: string
  success?: boolean
  loading?: boolean
  voiceInput?: boolean
  strengthMeter?: boolean // for, password fields
  adaptiveLabel?: boolean
  glowEffect?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onVoiceInput?: (transcript: string) => void
}

const RevolutionaryInput: React.FC<RevolutionaryInputProps> = ({
  label,
  variant = 'glassmorphic',
  size = 'md',
  error,
  success,
  loading,
  voiceInput = false,
  strengthMeter = false,
  adaptiveLabel = true,
  glowEffect = true,
  leftIcon,
  rightIcon,
  type = 'text',
  value,
  onChange,
  onVoiceInput,
  className,
  placeholder,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const hasValue = value !== undefined ? value.toString().length > 0 : false
  const shouldFloatLabel = adaptiveLabel && (isFocused || hasValue)
  const isPasswordField = type === 'password'

  // Initialize speech recognition
  useEffect(() => {
    if (voiceInput && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onVoiceInput?.(transcript)
        if (inputRef.current) {
          const event = new Event('input', { bubbles: true })
          inputRef.current.value = transcript
          inputRef.current.dispatchEvent(event)
        }
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [voiceInput, onVoiceInput])

  // Calculate password strength
  useEffect(() => {
    if (strengthMeter && isPasswordField && value) {
      const password = value.toString()
      let strength = 0
      
      if (password.length >= 8) strength += 25
      if (password.match(/[a-z]/)) strength += 25
      if (password.match(/[A-Z]/)) strength += 25
      if (password.match(/[0-9]/)) strength += 25
      if (password.match(/[^a-zA-Z0-9]/)) strength += 25
      
      setPasswordStrength(Math.min(strength, 100))
    }
  }, [value, strengthMeter, isPasswordField])

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const getVariantStyles = () => {
    const baseStyles = "w-full transition-all duration-300 focus:outline-none"
    
    switch (variant) {
      case 'glassmorphic':
        return cn(
          baseStyles,
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "text-white placeholder-white/60",
          "focus:bg-white/15 focus:border-white/40",
          error ? "border-red-400/50 focus:border-red-400" : "",
          success ? "border-green-400/50 focus:border-green-400" : "",
          "dark:bg-black/10 dark:border-white/10"
        )
      
      case 'neumorphic':
        return cn(
          baseStyles,
          "bg-gray-100 border-none text-gray-800",
          "shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]",
          "focus:shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff]",
          "dark:bg-gray-800 dark:text-gray-200",
          "dark:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#2a2a2a]"
        )
      
      case 'cyberpunk':
        return cn(
          baseStyles,
          "bg-black/90 border border-cyan-400/50 text-cyan-400",
          "placeholder-cyan-400/60 font-mono",
          "focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
          error ? "border-red-400 text-red-400" : "",
          success ? "border-green-400 text-green-400" : ""
        )
      
      case 'minimalist':
        return cn(
          baseStyles,
          "bg-transparent border-b-2 border-gray-300 rounded-none",
          "text-gray-900 placeholder-gray-500",
          "focus:border-blue-500",
          error ? "border-red-500" : "",
          success ? "border-green-500" : "",
          "dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        )
      
      case 'hyperrealistic':
        return cn(
          baseStyles,
          "bg-gradient-to-b from-white to-gray-50 border border-gray-200",
          "text-gray-900 placeholder-gray-500",
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]",
          "focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)]",
          "dark:from-gray-800 dark:to-gray-900 dark:border-gray-600 dark:text-white"
        )
      
      default:
        return baseStyles
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm rounded-lg'
      case 'md':
        return 'px-4 py-3 text-base rounded-xl'
      case 'lg':
        return 'px-5 py-4 text-lg rounded-xl'
      case 'xl':
        return 'px-6 py-5 text-xl rounded-2xl'
      default:
        return 'px-4 py-3 text-base rounded-xl'
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500'
    if (passwordStrength < 50) return 'bg-orange-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = () => {
    if (passwordStrength < 25) return 'Weak'
    if (passwordStrength < 50) return 'Fair'
    if (passwordStrength < 75) return 'Good'
    return 'Strong'
  }

  return (
    <div className="relative">
      {/* Floating Label */}
      {label && adaptiveLabel && (
        <motion.label
          className={cn(
            "absolute left-0 pointer-events-none transition-all duration-200 z-10",
            shouldFloatLabel
              ? "top-0 text-xs font-medium opacity-80 transform -translate-y-2"
              : "top-1/2 text-base transform -translate-y-1/2",
            variant === 'minimalist' ? "left-0" : "left-4",
            variant === 'cyberpunk' ? "text-cyan-400" : "text-gray-600 dark:text-gray-400",
            error ? "text-red-500" : "",
            success ? "text-green-500" : ""
          )}
          animate={{
            y: shouldFloatLabel ? -8 : 0,
            scale: shouldFloatLabel ? 0.85 : 1,
            x: shouldFloatLabel && variant !== 'minimalist' ? -8 : 0
          }}
        >
          {label}
        </motion.label>
      )}

      {/* Static Label */}
      {label && !adaptiveLabel && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={inputRef}
          type={isPasswordField && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={!adaptiveLabel || shouldFloatLabel ? placeholder : ''}
          disabled={disabled || loading}
          className={cn(
            getVariantStyles(),
            getSizeStyles(),
            leftIcon && "pl-10",
            (rightIcon || isPasswordField || voiceInput || loading || success || error) && "pr-12",
            variant === 'minimalist' && shouldFloatLabel && "pt-6",
            className
          )}
          whileFocus={{ scale: 1.02 }}
          {...props}
        />

        {/* Glow Effect */}
        {glowEffect && isFocused && (
          <motion.div
            className="absolute inset-0 rounded-inherit pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            style={{
              background: variant === 'cyberpunk' 
                ? 'linear-gradient(90deg, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0.1) 100%)'
                : 'linear-gradient(90deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.1) 100%)',
              filter: 'blur(8px)',
              zIndex: -1
            }}
          />
        )}

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Loading */}
          {loading && (
            <UIIcons.Loader2 className="w-4 h-4 animate-spin text-gray-400" / />
          )}

          {/* Success */}
          {success && !loading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-4 h-4 text-green-500" />
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <X className="w-4 h-4 text-red-500" />
            </motion.div>
          )}

          {/* Password Toggle */}
          {isPasswordField && !loading && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Voice Input */}
          {voiceInput && recognitionRef.current && !loading && (
            <motion.button
              type="button"
              onClick={handleVoiceToggle}
              className={cn(
                "transition-colors",
                isListening ? "text-red-500" : "text-gray-400 hover:text-gray-600"
              )}
              animate={{
                scale: isListening ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 1,
                repeat: isListening ? Infinity : 0
              }}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>
          )}

          {/* Custom Right Icon */}
          {rightIcon && !loading && !success && !error && !isPasswordField && !voiceInput && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Password Strength Meter */}
      {strengthMeter && isPasswordField && hasValue && (
        <motion.div
          className="mt-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={cn("h-full rounded-full transition-all duration-300", getStrengthColor())}
                initial={{ width: 0 }}
                animate={{ width: `${passwordStrength}%` }}
              />
            </div>
            <span className={cn(
              "text-xs font-medium",
              passwordStrength < 50 ? "text-red-500" : passwordStrength < 75 ? "text-yellow-500" : "text-green-500"
            )}>
              {getStrengthLabel()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-sm text-red-500 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-full left-0 mt-2 flex items-center gap-2 text-sm text-blue-500"
          >
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-4 bg-blue-500 rounded-full"
                  animate={{
                    scaleY: [1, 2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            Listening...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RevolutionaryInput