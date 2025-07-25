'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  Home,
  Settings,
  HelpCircle,
  Mic,
  Star,
  User
} from "lucide-react";
import Link from 'next/link'

interface NavItem {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
  badge?: number
  submenu?: NavItem[]
}

interface RevolutionaryNavProps {
  variant?: 'glassmorphic' | 'cyberpunk' | 'minimalist' | 'holographic' | 'floating'
  items: NavItem[]
  logo?: React.ReactNode
  magneticCursor?: boolean
  adaptiveTheme?: boolean
  voiceSearch?: boolean
  className?: string
}

const RevolutionaryNav: React.FC<RevolutionaryNavProps> = ({
  variant = 'glassmorphic',
  items,
  logo,
  magneticCursor = true,
  adaptiveTheme = true,
  voiceSearch = false,
  className
}) => {
  const [activeItem, setActiveItem] = useState<string>('')
  const [hoveredItem, setHoveredItem] = useState<string>('')
  const [showSubmenu, setShowSubmenu] = useState<string>('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  
  const navRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Cursor animation
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const cursorScale = useSpring(1, { stiffness: 300, damping: 30 })

  // Initialize voice recognition
  useEffect(() => {
    if (voiceSearch && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
      }
      
      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }
  }, [voiceSearch])

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!magneticCursor || !cursorRef.current) return
      
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorX, cursorY, magneticCursor])

  const handleVoiceSearch = () => {
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
    const baseStyles = "relative transition-all duration-300 z-50"
    
    switch (variant) {
      case 'glassmorphic':
        return cn(
          baseStyles,
          "bg-white/10 backdrop-blur-xl border-b border-white/20",
          "dark:bg-black/10 dark:border-white/10"
        )
      
      case 'cyberpunk':
        return cn(
          baseStyles,
          "bg-black/95 border-b border-cyan-400/50",
          "shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        )
      
      case 'minimalist':
        return cn(
          baseStyles,
          "bg-white/80 backdrop-blur-sm border-b border-gray-200",
          "dark:bg-gray-900/80 dark:border-gray-700"
        )
      
      case 'holographic':
        return cn(
          baseStyles,
          "bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20",
          "backdrop-blur-xl border-b border-gradient-to-r from-purple-400 to-pink-400"
        )
      
      case 'floating':
        return cn(
          baseStyles,
          "bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl",
          "dark:bg-gray-900/90 dark:border-white/10",
          "mx-4 mt-4 mb-0"
        )
      
      default:
        return baseStyles
    }
  }

  const getItemStyles = (isActive: boolean, isHovered: boolean) => {
    const baseStyles = "relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
    
    switch (variant) {
      case 'glassmorphic':
        return cn(
          baseStyles,
          isActive && "bg-white/20 text-white",
          isHovered && !isActive && "bg-white/10",
          "text-white/80 hover:text-white"
        )
      
      case 'cyberpunk':
        return cn(
          baseStyles,
          isActive && "bg-cyan-400/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
          isHovered && !isActive && "bg-cyan-400/10 text-cyan-300",
          "text-cyan-400/80 font-mono"
        )
      
      case 'minimalist':
        return cn(
          baseStyles,
          isActive && "bg-blue-500 text-white",
          isHovered && !isActive && "bg-gray-100 dark:bg-gray-800",
          "text-gray-700 dark:text-gray-300"
        )
      
      case 'holographic':
        return cn(
          baseStyles,
          isActive && "bg-gradient-to-r from-purple-400/30 to-pink-400/30 text-white",
          isHovered && !isActive && "bg-white/10",
          "text-white/80"
        )
      
      case 'floating':
        return cn(
          baseStyles,
          isActive && "bg-blue-500 text-white shadow-lg",
          isHovered && !isActive && "bg-gray-100 dark:bg-gray-800",
          "text-gray-700 dark:text-gray-300"
        )
      
      default:
        return baseStyles
    }
  }

  return (
    <>
      {/* Custom Cursor */}
      {magneticCursor && (
        <motion.div
          ref={cursorRef}
          className="fixed w-4 h-4 bg-blue-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
          style={{
            x: cursorX,
            y: cursorY,
            scale: cursorScale
          }}
          animate={{
            opacity: hoveredItem ? 1 : 0
          }}
        />
      )}

      <motion.nav
        ref={navRef}
        className={cn(getVariantStyles(), className)}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => {
                setHoveredItem('logo')
                cursorScale.set(1.5)
              }}
              onMouseLeave={() => {
                setHoveredItem('')
                cursorScale.set(1)
              }}
            >
              {logo}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredItem(item.id)
                    cursorScale.set(1.2)
                    if (item.submenu) setShowSubmenu(item.id)
                  }}
                  onMouseLeave={() => {
                    setHoveredItem('')
                    cursorScale.set(1)
                    if (item.submenu) setShowSubmenu('')
                  }}
                >
                  <motion.div
                    className={getItemStyles(activeItem === item.id, hoveredItem === item.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-2"
                      onClick={() => setActiveItem(item.id)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <motion.span
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                      {item.submenu && <ChevronDown className="w-4 h-4" />}
                    </Link>

                    {/* Magnetic effect */}
                    {hoveredItem === item.id && magneticCursor && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-blue-500/20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                      />
                    )}
                  </motion.div>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.submenu && showSubmenu === item.id && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 py-2 shadow-xl"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {subItem.icon}
                              {subItem.label}
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <motion.button
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5 text-white/80" />
                </motion.button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-80 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                          autoFocus
                        />
                        {voiceSearch && (
                          <motion.button
                            onClick={handleVoiceSearch}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isListening ? "bg-red-500 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
                            )}
                            animate={{
                              scale: isListening ? [1, 1.1, 1] : 1
                            }}
                            transition={{
                              duration: 1,
                              repeat: isListening ? Infinity : 0
                            }}
                          >
                            <Mic className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <motion.button
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-white/80" />
                <motion.span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </motion.button>

              {/* Profile */}
              <motion.button
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5 text-white/80" />
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="container mx-auto px-4 py-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="py-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => {
                        setActiveItem(item.id)
                        setIsMobileOpen(false)
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Holographic animation */}
        {variant === 'holographic' && (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
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
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent bg-[length:100%_4px] animate-pulse" />
          </div>
        )}
      </motion.nav>
    </>
  )
}

// Sample navigation items
export const sampleNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: <Home className="w-4 h-4" />
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    icon: <Star className="w-4 h-4" />,
    submenu: [
      { id: 'cleaning', label: 'Cleaning', href: '/services/cleaning', icon: <Home className="w-4 h-4" /> },
      { id: 'maintenance', label: 'Maintenance', href: '/services/maintenance', icon: <Settings className="w-4 h-4" /> }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: <Bell className="w-4 h-4" />,
    badge: 3
  },
  {
    id: 'help',
    label: 'Help',
    href: '/help',
    icon: <HelpCircle className="w-4 h-4" />
  }
]

export default RevolutionaryNav