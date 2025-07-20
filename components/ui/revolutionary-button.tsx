'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'

interface RevolutionaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glassmorphic' | 'neumorphic' | 'claymorphic' | 'cyberpunk' | 'hyperrealistic'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  success?: boolean
  error?: boolean
  children: React.ReactNode
  glowEffect?: boolean
  particleEffect?: boolean
  soundEnabled?: boolean
  hapticFeedback?: boolean
}

const RevolutionaryButton: React.FC<RevolutionaryButtonProps> = ({
  variant = 'glassmorphic',
  size = 'md',
  loading = false,
  success = false,
  error = false,
  children,
  glowEffect = true,
  particleEffect = false,
  soundEnabled = false,
  hapticFeedback = true,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Motion values for advanced animations
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useSpring(1, { stiffness: 300, damping: 20 })
  const rotate = useTransform(x, [-100, 100], [-5, 5])
  const rotateY = useTransform(y, [-100, 100], [5, -5])

  // Mouse tracking for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (soundEnabled) {
      // Play hover sound
      const audio = new Audio('/sounds/hover.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {}) // Fail silently if audio not available
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    setIsPressed(true)
    
    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    // Sound effect
    if (soundEnabled) {
      const audio = new Audio('/sounds/click.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    }

    // Particle effect
    if (particleEffect) {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }))
        setParticles(newParticles)
        
        // Clean up particles
        setTimeout(() => setParticles([]), 1000)
      }
    }

    setTimeout(() => setIsPressed(false), 150)
    onClick?.(e)
  }

  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = "relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    switch (variant) {
      case 'glassmorphic':
        return cn(
          baseStyles,
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "shadow-lg shadow-black/5 text-white",
          "hover:bg-white/20 hover:border-white/30",
          "dark:bg-black/10 dark:border-white/10 dark:hover:bg-black/20",
          glowEffect && "hover:shadow-xl hover:shadow-blue-500/25"
        )
      
      case 'neumorphic':
        return cn(
          baseStyles,
          "bg-gray-100 text-gray-800 border-none",
          "shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]",
          "hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff]",
          "active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]",
          "dark:bg-gray-800 dark:text-gray-200",
          "dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#2a2a2a]"
        )
      
      case 'claymorphic':
        return cn(
          baseStyles,
          "bg-gradient-to-br from-orange-400 to-pink-400 text-white border-none",
          "shadow-[0_8px_32px_rgba(255,107,107,0.37)] rounded-3xl",
          "hover:shadow-[0_12px_40px_rgba(255,107,107,0.5)]",
          "hover:from-orange-500 hover:to-pink-500"
        )
      
      case 'cyberpunk':
        return cn(
          baseStyles,
          "bg-black text-cyan-400 border border-cyan-400/50",
          "shadow-[0_0_20px_rgba(6,182,212,0.3)] font-mono",
          "hover:bg-cyan-400/10 hover:border-cyan-400",
          "hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]",
          "hover:text-cyan-300",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-cyan-400/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        )
      
      case 'hyperrealistic':
        return cn(
          baseStyles,
          "bg-gradient-to-b from-blue-500 to-blue-600 text-white border-none",
          "shadow-[0_4px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.25)]",
          "hover:from-blue-400 hover:to-blue-500",
          "hover:shadow-[0_6px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]",
          "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]"
        )
      
      default:
        return baseStyles
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-lg'
      case 'md':
        return 'px-4 py-2 text-sm rounded-xl'
      case 'lg':
        return 'px-6 py-3 text-base rounded-xl'
      case 'xl':
        return 'px-8 py-4 text-lg rounded-2xl'
      default:
        return 'px-4 py-2 text-sm rounded-xl'
    }
  }

  const getStateStyles = () => {
    if (success) return 'bg-green-500 text-white border-green-500'
    if (error) return 'bg-red-500 text-white border-red-500'
    if (loading) return 'opacity-75 cursor-not-allowed'
    if (disabled) return 'opacity-50 cursor-not-allowed'
    return ''
  }

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        getVariantStyles(),
        getSizeStyles(),
        getStateStyles(),
        className
      )}
      style={{
        scale,
        rotateX: rotateY,
        rotateY: rotate,
      }}
      whileTap={{ scale: 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}

      {/* Success checkmark */}
      {success && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {/* Error X */}
      {error && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>
      )}

      {/* Button content */}
      <motion.span
        className={cn(
          "relative z-10 flex items-center justify-center gap-2",
          (loading || success || error) && "opacity-0"
        )}
        animate={{
          opacity: (loading || success || error) ? 0 : 1
        }}
      >
        {children}
      </motion.span>

      {/* Glow effect */}
      {glowEffect && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          style={{
            background: variant === 'cyberpunk' 
              ? 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
            filter: 'blur(8px)',
            transform: 'scale(1.05)'
          }}
        />
      )}

      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-inherit"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 50%)'
          }}
        />
      )}

      {/* Particle effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-current rounded-full pointer-events-none"
            initial={{ 
              x: particle.x, 
              y: particle.y,
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: particle.x + (Math.random() - 0.5) * 100,
              y: particle.y + (Math.random() - 0.5) * 100,
              scale: 1,
              opacity: 0 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Shimmer effect for cyberpunk variant */}
      {variant === 'cyberpunk' && (
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.button>
  )
}

export default RevolutionaryButton