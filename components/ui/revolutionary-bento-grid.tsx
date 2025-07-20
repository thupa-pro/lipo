'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GripVertical, Maximize2, Minimize2, X, Plus } from 'lucide-react'

interface BentoItem {
  id: string
  title: string
  content: React.ReactNode
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  priority?: number
  color?: string
  pattern?: 'dots' | 'grid' | 'waves' | 'gradient' | 'none'
  interactive?: boolean
  expandable?: boolean
}

interface RevolutionaryBentoGridProps {
  items: BentoItem[]
  variant?: 'glassmorphic' | 'neumorphic' | 'cyberpunk' | 'minimalist' | 'holographic'
  columns?: 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  dragAndDrop?: boolean
  autoResize?: boolean
  immersive3D?: boolean
  onItemChange?: (items: BentoItem[]) => void
  className?: string
}

const RevolutionaryBentoGrid: React.FC<RevolutionaryBentoGridProps> = ({
  items,
  variant = 'glassmorphic',
  columns = 4,
  gap = 'md',
  dragAndDrop = true,
  autoResize = true,
  immersive3D = true,
  onItemChange,
  className
}) => {
  const [gridItems, setGridItems] = useState<BentoItem[]>(items)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const getSizeClass = (size: BentoItem['size']) => {
    switch (size) {
      case 'sm':
        return 'col-span-1 row-span-1'
      case 'md':
        return 'col-span-2 row-span-1'
      case 'lg':
        return 'col-span-2 row-span-2'
      case 'xl':
        return 'col-span-3 row-span-2'
      case 'full':
        return `col-span-full row-span-1`
      default:
        return 'col-span-1 row-span-1'
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'glassmorphic':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg'
      case 'neumorphic':
        return 'bg-gray-100 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-gray-800 dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#2a2a2a]'
      case 'cyberpunk':
        return 'bg-black/90 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
      case 'minimalist':
        return 'bg-white border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700'
      case 'holographic':
        return 'bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 backdrop-blur-xl border border-white/30'
      default:
        return ''
    }
  }

  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-2'
      case 'md':
        return 'gap-4'
      case 'lg':
        return 'gap-6'
      case 'xl':
        return 'gap-8'
      default:
        return 'gap-4'
    }
  }

  const handleReorder = (newOrder: BentoItem[]) => {
    setGridItems(newOrder)
    onItemChange?.(newOrder)
  }

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId)
  }

  const removeItem = (itemId: string) => {
    const newItems = gridItems.filter(item => item.id !== itemId)
    setGridItems(newItems)
    onItemChange?.(newItems)
  }

  return (
    <div className={cn("relative", className)}>
      {dragAndDrop ? (
        <Reorder.Group
          axis="y"
          values={gridItems}
          onReorder={handleReorder}
          className={cn(
            "grid auto-rows-fr",
            columns === 2 ? "grid-cols-2" :
            columns === 3 ? "grid-cols-3" :
            columns === 4 ? "grid-cols-4" :
            columns === 5 ? "grid-cols-5" :
            columns === 6 ? "grid-cols-6" : "grid-cols-4",
            getGapClass()
          )}
          ref={gridRef}
        >
          {gridItems.map((item, index) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className={cn(
                "relative group",
                getSizeClass(item.size)
              )}
              whileDrag={{ scale: 1.05, zIndex: 50 }}
              dragListener={false}
            >
              <BentoCard
                item={item}
                variant={variant}
                isHovered={hoveredItem === item.id}
                isExpanded={expandedItem === item.id}
                immersive3D={immersive3D}
                onHover={(id) => setHoveredItem(id)}
                onExpand={toggleExpand}
                onRemove={removeItem}
                dragAndDrop={dragAndDrop}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div
          className={cn(
            "grid auto-rows-fr",
            columns === 2 ? "grid-cols-2" :
            columns === 3 ? "grid-cols-3" :
            columns === 4 ? "grid-cols-4" :
            columns === 5 ? "grid-cols-5" :
            columns === 6 ? "grid-cols-6" : "grid-cols-4",
            getGapClass()
          )}
          ref={gridRef}
        >
          {gridItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative group",
                getSizeClass(item.size)
              )}
            >
              <BentoCard
                item={item}
                variant={variant}
                isHovered={hoveredItem === item.id}
                isExpanded={expandedItem === item.id}
                immersive3D={immersive3D}
                onHover={(id) => setHoveredItem(id)}
                onExpand={toggleExpand}
                onRemove={removeItem}
                dragAndDrop={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Expanded Item Modal */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedItem(null)}
          >
            <motion.div
              className="w-full max-w-4xl h-full max-h-[80vh] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 overflow-auto"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {gridItems.find(item => item.id === expandedItem)?.title}
                </h2>
                <button
                  onClick={() => setExpandedItem(null)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="text-white/80">
                {gridItems.find(item => item.id === expandedItem)?.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface BentoCardProps {
  item: BentoItem
  variant: string
  isHovered: boolean
  isExpanded: boolean
  immersive3D: boolean
  onHover: (id: string | null) => void
  onExpand: (id: string) => void
  onRemove: (id: string) => void
  dragAndDrop: boolean
}

const BentoCard: React.FC<BentoCardProps> = ({
  item,
  variant,
  isHovered,
  isExpanded,
  immersive3D,
  onHover,
  onExpand,
  onRemove,
  dragAndDrop
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const getPatternStyles = (pattern: BentoItem['pattern']) => {
    switch (pattern) {
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
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        }
      default:
        return {}
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'glassmorphic':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/15'
      case 'neumorphic':
        return 'bg-gray-100 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] dark:bg-gray-800 dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#2a2a2a]'
      case 'cyberpunk':
        return 'bg-black/90 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'
      case 'minimalist':
        return 'bg-white border border-gray-200 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border-gray-700'
      case 'holographic':
        return 'bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 backdrop-blur-xl border border-white/30 hover:from-purple-400/30 hover:via-pink-400/30 hover:to-blue-400/30'
      default:
        return ''
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!immersive3D || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotateX = (e.clientY - centerY) / 20
    const rotateY = (e.clientX - centerX) / 20

    cardRef.current.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    if (!immersive3D || !cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    onHover(null)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative h-full min-h-[120px] rounded-xl overflow-hidden cursor-pointer group transition-all duration-300",
        getVariantStyles(),
        item.color && `bg-${item.color}-500/20 border-${item.color}-400/50`
      )}
      style={item.pattern ? { ...getPatternStyles(item.pattern) } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: immersive3D ? 0 : -2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => onHover(item.id)}
      onClick={() => item.expandable && onExpand(item.id)}
    >
      {/* Drag Handle */}
      {dragAndDrop && (
        <motion.div
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          whileHover={{ scale: 1.1 }}
          style={{ cursor: 'grab' }}
          onPointerDown={(e) => {
            e.preventDefault()
            // Enable drag
          }}
        >
          <GripVertical className="w-4 h-4 text-white/60" />
        </motion.div>
      )}

      {/* Controls */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {item.expandable && (
          <motion.button
            className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onExpand(item.id)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3 text-white/80" /> : <Maximize2 className="w-3 h-3 text-white/80" />}
          </motion.button>
        )}
        <motion.button
          className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(item.id)
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-3 h-3 text-red-400" />
        </motion.button>
      </div>

      {/* Glow Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
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

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className={cn(
            "font-semibold text-sm",
            variant === 'cyberpunk' ? "text-cyan-400" : "text-white dark:text-gray-100"
          )}>
            {item.title}
          </h3>
          {item.priority && (
            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
              P{item.priority}
            </span>
          )}
        </div>
        
        <div className={cn(
          "flex-1 text-sm",
          variant === 'cyberpunk' ? "text-cyan-300/80" : "text-white/80 dark:text-gray-300"
        )}>
          {item.content}
        </div>
      </div>

      {/* Interactive Overlay */}
      {item.interactive && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <Plus className="w-8 h-8 text-white/60" />
        </div>
      )}

      {/* Holographic Effect */}
      {variant === 'holographic' && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
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

      {/* Cyberpunk Scan Lines */}
      {variant === 'cyberpunk' && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent bg-[length:100%_4px] animate-pulse" />
        </div>
      )}
    </motion.div>
  )
}

export default RevolutionaryBentoGrid