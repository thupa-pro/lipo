'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import RevolutionaryButton from '@/components/ui/revolutionary-button'
import RevolutionaryCard from '@/components/ui/revolutionary-card'
import RevolutionaryInput from '@/components/ui/revolutionary-input'
import RevolutionaryNav, { sampleNavItems } from '@/components/ui/revolutionary-nav'
import RevolutionaryBentoGrid from '@/components/ui/revolutionary-bento-grid'
import { 
  Sparkles,
  Layers, 
  Palette, 
  MousePointer2, 
  Eye,
  Search,
  Mail,
  Lock,
  Phone,
  Heart,
  TrendingUp,
  BarChart3,
  Calendar,
  Settings } from 'lucide-react'

const RevolutionaryDesignPage = () => {
  const [selectedVariant, setSelectedVariant] = useState<string>('glassmorphic')
  const [buttonState, setButtonState] = useState<'normal' | 'loading' | 'success' | 'error'>('normal')
  const [inputValue, setInputValue] = useState('')
  
  // Sample, bento grid, items
  const bentoItems = [
    {
      id: '1',
      title: 'Analytics Overview',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-bold">+24%</span>
          </div>
          <p className="text-sm opacity-80">User engagement increased this month</p>
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 bg-blue-500/30 rounded-sm" style={{ height: `${Math.random() * 40 + 10}px` }} />
            ))}
          </div>
        </div>
      ),
      size: 'lg' as const,
      expandable: true,
      pattern: 'grid' as const
    },
    {
      id: '2',
      title: 'Quick Actions',
      content: (
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white/10 rounded-lg flex flex-col items-center gap-1">
            <User className="w-4 h-4" />
            <span className="text-xs">Profile</span>
          </div>
          <div className="p-3 bg-white/10 rounded-lg flex flex-col items-center gap-1">
            <Settings className="w-4 h-4" />
            <span className="text-xs">Settings</span>
          </div>
          <div className="p-3 bg-white/10 rounded-lg flex flex-col items-center gap-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Security</span>
          </div>
          <div className="p-3 bg-white/10 rounded-lg flex flex-col items-center gap-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs">Favorites</span>
          </div>
        </div>
      ),
      size: 'md' as const,
      interactive: true,
      pattern: 'dots' as const
    },
    {
      id: '3',
      title: 'Messages',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">5 New Messages</span>
          </div>
          <div className="space-y-1">
            {['Sarah: Hey there!', 'Mike: Project update', 'Team: Meeting at 3pm'].map((msg, i) => (
              <div key={i} className="text-xs p-2 bg-white/5 rounded">
                {msg}
              </div>
            ))}
          </div>
        </div>
      ),
      size: 'sm' as const,
      expandable: true
    },
    {
      id: '4',
      title: 'Calendar',
      content: (
        <div className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <div className="text-lg font-bold">March 15</div>
          <div className="text-sm opacity-80">3 events today</div>
        </div>
      ),
      size: 'sm' as const,
      pattern: 'waves' as const
    },
    {
      id: '5',
      title: 'Performance Stats',
      content: (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-400" />
            <div className="font-bold">98.5%</div>
            <div className="text-xs opacity-80">Uptime</div>
          </div>
          <div>
            <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
            <div className="font-bold">4.9</div>
            <div className="text-xs opacity-80">Rating</div>
          </div>
          <div>
            <Heart className="w-5 h-5 mx-auto mb-1 text-red-400" />
            <div className="font-bold">2.3k</div>
            <div className="text-xs opacity-80">Likes</div>
          </div>
        </div>
      ),
      size: 'xl' as const,
      expandable: true,
      pattern: 'gradient' as const
    }
  ]

  const variants = [
    { id: 'glassmorphic', name: 'Glassmorphic', icon: <Layers className="w-4 h-4" /> },
    { id: 'neumorphic', name: 'Neumorphic', icon: <Palette className="w-4 h-4" /> },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: <Zap className="w-4 h-4" /> },
    { id: 'minimalist', name: 'Minimalist', icon: <Eye className="w-4 h-4" /> },
    { id: 'holographic', name: 'Holographic', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'hyperrealistic', name: 'Hyperrealistic', icon: <MousePointer2 className="w-4 h-4" /> }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Revolutionary Navigation */}
      <RevolutionaryNav
        variant={selectedVariant as any}
        items={sampleNavItems}
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Loconomy</span>
          </div>
        }
        magneticCursor={true}
        voiceSearch={true}
      />

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <motion.section
          className="text-center py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Revolutionary UI/UX Design
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Experience the future of digital design with cutting-edge components that push the boundaries of 
              user, interaction, featuring, glassmorphism, neumorphism, cyberpunk, aesthetics, and immersive 3D effects.
            </p>
          </motion.div>

          {/* Variant Selector */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-lg font-semibold text-white mb-4">Choose Your Design Variant</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {variants.map((variant) => (
                <RevolutionaryButton
                  key={variant.id}
                  variant={selectedVariant === variant.id ? 'claymorphic' : 'glassmorphic'}
                  size="sm"
                  onClick={() => setSelectedVariant(variant.id)}
                  className="transition-all duration-300"
                >
                  {variant.icon}
                  {variant.name}
                </RevolutionaryButton>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Button Showcase */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-8">
            Interactive Button Components
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Button States Demo */}
            <motion.div variants={itemVariants}>
              <RevolutionaryCard
                variant={selectedVariant as any}
                className="p-6 h-full"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Button States</h3>
                <div className="space-y-3">
                  <RevolutionaryButton
                    variant={selectedVariant as any}
                    loading={buttonState === 'loading'}
                    success={buttonState === 'success'}
                    error={buttonState === 'error'}
                    onClick={() => {
                      setButtonState('loading')
                      setTimeout(() => setButtonState(Math.random() > 0.5 ? 'success' : 'error'), 2000)
                      setTimeout(() => setButtonState('normal'), 4000)
                    }}
                    particleEffect={true}
                    soundEnabled={false}
                  >
                    <Zap className="w-4 h-4" />
                    Test States
                  </RevolutionaryButton>
                  
                  <div className="text-sm text-white/60">
                    Click to see, loading, success, and error states with particle effects
                  </div>
                </div>
              </RevolutionaryCard>
            </motion.div>

            {/* Button Sizes */}
            <motion.div variants={itemVariants}>
              <RevolutionaryCard
                variant={selectedVariant as any}
                className="p-6 h-full"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Button Sizes</h3>
                <div className="space-y-3">
                  <RevolutionaryButton variant={selectedVariant as any} size="sm">Small</RevolutionaryButton>
                  <RevolutionaryButton variant={selectedVariant as any} size="md">Medium</RevolutionaryButton>
                  <RevolutionaryButton variant={selectedVariant as any} size="lg">Large</RevolutionaryButton>
                </div>
              </RevolutionaryCard>
            </motion.div>

            {/* Button Variants */}
            <motion.div variants={itemVariants}>
              <RevolutionaryCard
                variant={selectedVariant as any}
                className="p-6 h-full"
              >
                <h3 className="text-lg font-semibold text-white mb-4">All Variants</h3>
                <div className="space-y-2">
                  <RevolutionaryButton variant="glassmorphic" size="sm">Glassmorphic</RevolutionaryButton>
                  <RevolutionaryButton variant="neumorphic" size="sm">Neumorphic</RevolutionaryButton>
                  <RevolutionaryButton variant="cyberpunk" size="sm">Cyberpunk</RevolutionaryButton>
                  <RevolutionaryButton variant="claymorphic" size="sm">Claymorphic</RevolutionaryButton>
                </div>
              </RevolutionaryCard>
            </motion.div>

            {/* Special Effects */}
            <motion.div variants={itemVariants}>
              <RevolutionaryCard
                variant={selectedVariant as any}
                className="p-6 h-full"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Special Effects</h3>
                <div className="space-y-3">
                  <RevolutionaryButton
                    variant={selectedVariant as any}
                    size="sm"
                    particleEffect={true}
                    hapticFeedback={true}
                  >
                    <Sparkles className="w-4 h-4" />
                    Particles
                  </RevolutionaryButton>
                  
                  <RevolutionaryButton
                    variant={selectedVariant as any}
                    size="sm"
                    glowEffect={true}
                  >
                    <Eye className="w-4 h-4" />
                    Glow Effect
                  </RevolutionaryButton>
                </div>
              </RevolutionaryCard>
            </motion.div>
          </div>
        </motion.section>

        {/* Input Showcase */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-8">
            Advanced Input Components
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <RevolutionaryCard variant={selectedVariant as any} className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Smart Search</h3>
                <RevolutionaryInput
                  variant={selectedVariant as any}
                  label="Search Services"
                  placeholder="Try voice search..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  voiceInput={true}
                  glowEffect={true}
                />
              </RevolutionaryCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <RevolutionaryCard variant={selectedVariant as any} className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Form</h3>
                <div className="space-y-4">
                  <RevolutionaryInput
                    variant={selectedVariant as any}
                    label="Email"
                    type="email"
                    leftIcon={<Mail className="w-4 h-4" />}
                    success={true}
                  />
                  <RevolutionaryInput
                    variant={selectedVariant as any}
                    label="Phone"
                    type="tel"
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                </div>
              </RevolutionaryCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <RevolutionaryCard variant={selectedVariant as any} className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Secure Input</h3>
                <RevolutionaryInput
                  variant={selectedVariant as any}
                  label="Password"
                  type="password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  strengthMeter={true}
                  glowEffect={true}
                />
              </RevolutionaryCard>
            </motion.div>
          </div>
        </motion.section>

        {/* Card Showcase */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-8">
            3D Interactive Cards
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {variants.slice(0, 4).map((variant, index) => (
              <motion.div key={variant.id} variants={itemVariants}>
                <RevolutionaryCard
                  variant={variant.id as any}
                  hover3D={true}
                  glowEffect={true}
                  backgroundPattern={index % 2 === 0 ? 'dots' : 'grid'}
                  className="p-6 h-48"
                >
                  <div className="text-center">
                    <div className="mb-4 text-4xl">{variant.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{variant.name}</h3>
                    <p className="text-sm opacity-80">
                      Experience immersive 3D effects with {variant.name.toLowerCase()} styling
                    </p>
                  </div>
                </RevolutionaryCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bento Grid Showcase */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-8">
            Revolutionary Bento Grid Layout
          </motion.h2>
          
          <motion.div variants={itemVariants}>
            <RevolutionaryBentoGrid
              items={bentoItems}
              variant={selectedVariant as any}
              columns={4}
              gap="md"
              dragAndDrop={true}
              immersive3D={true}
            />
          </motion.div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-20"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-12">
            Technology Stack
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Framer Motion', desc: 'Advanced animations' },
              { name: 'Tailwind CSS', desc: 'Utility-first styling' },
              { name: 'TypeScript', desc: 'Type-safe development' },
              { name: 'Next.js 14', desc: 'React framework' },
              { name: 'Web APIs', desc: 'Voice recognition' },
              { name: '3D Transforms', desc: 'Immersive effects' },
              { name: 'Glassmorphism', desc: 'Modern aesthetics' },
              { name: 'Micro-interactions', desc: 'Enhanced UX' }
            ].map((tech, index) => (
              <motion.div key={tech.name} variants={itemVariants}>
                <RevolutionaryCard
                  variant="glassmorphic"
                  className="p-4 text-center h-full"
                  hover3D={true}
                >
                  <h4 className="font-semibold text-white mb-2">{tech.name}</h4>
                  <p className="text-sm text-white/70">{tech.desc}</p>
                </RevolutionaryCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default RevolutionaryDesignPage