'use client'

import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RevolutionaryCardProps {
  children: React.ReactNode
  variant?: 'glassmorphic' | 'neumorphic' | 'hyperrealistic' | 'holographic' | 'cyberpunk'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover3D?: boolean
  glowEffect?: boolean
  borderGradient?: boolean
  backgroundPattern?: 'dots' | 'grid' | 'waves' | 'none'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const RevolutionaryCard: React.FC<RevolutionaryCardProps> = ({
  children,
  variant = 'glassmorphic',
  size = 'md',
  hover3D = true,
  glowEffect = true,
  borderGradient = false,
  backgroundPattern = 'none',
  className,
  onClick,
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for 3D effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 })
  const scale = useSpring(1, { stiffness: 300, damping: 30 })

  // Transform values
  const shadowX = useTransform(rotateY, [-30, 30], [-40, 40])
  const shadowY = useTransform(rotateX, [-30, 30], [-40, 40])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hover3D || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotateXValue = (e.clientY - centerY) / 10
    const rotateYValue = (e.clientX - centerX) / 10

    rotateX.set(-rotateXValue)
    rotateY.set(rotateYValue)
    scale.set(1.05)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const getVariantStyles = () => {
    const baseStyles = "relative overflow-hidden transition-all duration-300"

    switch (variant) {
      case 'glassmorphic':
        return cn(
          baseStyles,
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "shadow-lg shadow-black/5",
          "hover:bg-white/15 hover:border-white/30",
          "dark:bg-black/10 dark:border-white/10 dark:hover:bg-black/15"
        )

      case 'neumorphic':
        return cn(
          baseStyles,
          "bg-gray-100 border-none",
          "shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]",
          "hover:shadow-[25px_25px_50px_#d1d9e6,-25px_-25px_50px_#ffffff]",
          "dark:bg-gray-800",
          "dark:shadow-[20px_20px_40px_#1a1a1a,-20px_-20px_40px_#2a2a2a]"
        )

      case 'hyperrealistic':
        return cn(
          baseStyles,
          "bg-gradient-to-br from-white to-gray-100 border border-gray-200",
          "shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]",
          "hover:shadow-[0_12px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "dark:from-gray-800 dark:to-gray-900 dark:border-gray-700"
        )

      case 'holographic':
        return cn(
          baseStyles,
          "bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20",
          "border border-gradient-to-r from-purple-400 to-pink-400",
          "backdrop-blur-xl shadow-lg",
          "hover:from-purple-400/30 hover:via-pink-400/30 hover:to-blue-400/30",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
        )

      case 'cyberpunk':
        return cn(
          baseStyles,
          "bg-black/90 border border-cyan-400/50",
          "shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_30px_rgba(6,182,212,0.1)]",
          "hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]",
          "text-cyan-400"
        )

      default:
        return baseStyles
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-4 rounded-lg'
      case 'md':
        return 'p-6 rounded-xl'
      case 'lg':
        return 'p-8 rounded-2xl'
      case 'xl':
        return 'p-10 rounded-3xl'
      default:
        return 'p-6 rounded-xl'
    }
  }

  const getBackgroundPattern = () => {
    switch (backgroundPattern) {
      case 'dots':
        return {
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }
      case 'waves':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }
      default:
        return {}
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        getVariantStyles(),
        getSizeStyles(),
        onClick && !disabled && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        ...getBackgroundPattern()
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={disabled ? undefined : onClick}
      whileTap={onClick && !disabled ? { scale: 0.98 } : undefined}
    >
      {/* Border gradient overlay */}
      {borderGradient && (
        <div className="absolute inset-0 rounded-inherit p-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
          <div className="w-full h-full bg-current rounded-inherit" />
        </div>
      )}

      {/* Glow effect */}
      {glowEffect && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          style={{
            background: variant === 'cyberpunk' 
              ? 'radial-gradient(circle at center, rgba(6,182,212,0.3) 0%, transparent 70%)'
              : variant === 'holographic'
              ? 'radial-gradient(circle at center, rgba(147,51,234,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            zIndex: -1
          }}
        />
      )}

      {/* Dynamic shadow for 3D effect */}
      {hover3D && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-inherit opacity-20"
          style={{
            background: 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
            transform: `translate(${shadowX.get()}px, ${shadowY.get()}px) translateZ(-50px)`,
            zIndex: -2
          }}
        />
      )}

      {/* Holographic shimmer effect */}
      {variant === 'holographic' && (
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      )}

      {/* Cyberpunk scan lines */}
      {variant === 'cyberpunk' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent bg-[length:100%_4px] animate-pulse" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Floating particles for enhanced effect */}
      {variant === 'holographic' && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default RevolutionaryCard