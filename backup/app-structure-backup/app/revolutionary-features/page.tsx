'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Eye, 
  Mic, 
  Target, 
  Zap,
  Sparkles,
  Rocket,
  Star,
  Play,
  ChevronRight,
  ArrowRight,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Camera,
  Volume2,
  Scan,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AISmartHaggling from '@/components/ai/AISmartHaggling'
import ComputerVisionScanner from '@/components/ai/ComputerVisionScanner'
import ARServiceVisualizer from '@/components/ar/ARServiceVisualizer'
import PredictiveServiceMatcher from '@/components/ai/PredictiveServiceMatcher'
import VoiceCommerceEngine from '@/components/voice/VoiceCommerceEngine'

const RevolutionaryFeaturesPage = () => {
  // Component visibility states
  const [showHaggling, setShowHaggling] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showAR, setShowAR] = useState(false)
  const [showVoice, setShowVoice] = useState(false)

  // Mock data for demos
  const mockService = {
    id: '1',
    title: 'Professional House Cleaning',
    provider: 'CleanPro Services',
    originalPrice: 120,
    category: 'Home Cleaning',
    rating: 4.8,
    completedJobs: 156,
    responseTime: 'within 2 hours',
    marketPrice: 115,
    demandLevel: 'high' as const,
    flexibilityScore: 85
  }

  const mockARService = {
    id: 'ar1',
    type: 'cleaning' as const,
    title: 'Deep House Cleaning',
    provider: 'CleanPro Services',
    rating: 4.8,
    price: 120,
    duration: '3-4 hours',
    preview3D: '/mock-3d-preview.jpg',
    beforeAfter: {
      before: '/mock-before.jpg',
      after: '/mock-after.jpg'
    },
    tools: ['Eco-friendly products', 'Professional equipment', 'Insurance included'],
    steps: ['Assessment', 'Deep cleaning', 'Quality check', 'Final walkthrough'],
    confidence: 92
  }

  const mockUserContext = {
    location: 'Downtown SF',
    timeOfDay: 'evening' as const,
    season: 'fall' as const,
    weather: 'clear',
    dayOfWeek: 'Saturday',
    recentActivity: ['cleaning services', 'home maintenance'],
    preferences: ['eco-friendly', 'professional', 'weekend availability'],
    bookingHistory: ['Home Cleaning', 'Handyman'],
    budgetRange: [50, 150] as [number, number]
  }

  const features = [
    {
      id: 'haggling',
      title: 'AI Smart Haggling Engine',
      description: 'Negotiate service prices with intelligent AI agents that understand market dynamics',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      stats: ['95% Success Rate', '20% Average Savings', 'Real-time Market Data'],
      demo: () => setShowHaggling(true),
      highlights: [
        'Market-aware pricing algorithms',
        'Personality-driven negotiations',
        'Real-time competitor analysis',
        'Smart reasoning engine'
      ]
    },
    {
      id: 'vision',
      title: 'Computer Vision Listing Scanner',
      description: 'Upload photos and instantly generate complete service listings with AI analysis',
      icon: Eye,
      color: 'from-purple-500 to-pink-600',
      stats: ['92% Accuracy', 'Instant Generation', '15+ Categories'],
      demo: () => setShowScanner(true),
      highlights: [
        'Object & context recognition',
        'Automated pricing suggestions',
        'Smart categorization',
        'Market demand analysis'
      ]
    },
    {
      id: 'ar',
      title: 'AR Service Visualization',
      description: 'See services in your actual space before booking with immersive AR technology',
      icon: Scan,
      color: 'from-green-500 to-blue-600',
      stats: ['3D Visualization', 'Real-time AR', 'Before/After Views'],
      demo: () => setShowAR(true),
      highlights: [
        'Spatial environment mapping',
        'Interactive 3D previews',
        'Before/after comparisons',
        'Real-time adjustments'
      ]
    },
    {
      id: 'voice',
      title: 'Voice Commerce Engine',
      description: 'Complete entire service bookings through natural voice conversations',
      icon: Mic,
      color: 'from-indigo-500 to-purple-600',
      stats: ['Natural Language', 'End-to-end Booking', 'Multi-intent Recognition'],
      demo: () => setShowVoice(true),
      highlights: [
        'Conversational AI interface',
        'Intent & entity extraction',
        'Context-aware responses',
        'Hands-free booking flow'
      ]
    },
    {
      id: 'predictive',
      title: 'Predictive Service Matching',
      description: 'AI predicts what services you need before you even search',
      icon: Target,
      color: 'from-yellow-500 to-red-600',
      stats: ['85% Accuracy', 'Real-time Analysis', 'Contextual AI'],
      demo: () => {}, // Embedded below
      highlights: [
        'Behavioral pattern analysis',
        'Time & location context',
        'Weather-based predictions',
        'Personalized recommendations'
      ]
    }
  ]

  const handleAcceptDeal = (finalPrice: number) => {
    alert(`Deal accepted! Final price: $${finalPrice}`)
    setShowHaggling(false)
  }

  const handleDeclineDeal = () => {
    setShowHaggling(false)
  }

  const handleListingGenerated = (listing: any) => {
    alert(`Listing generated: ${listing.title} - $${listing.suggestedPrice}`)
    setShowScanner(false)
  }

  const handleBookService = (serviceId: string) => {
    alert(`Booking service: ${serviceId}`)
    setShowAR(false)
  }

  const handleBookingComplete = (booking: any) => {
    alert(`Booking complete! Service: ${booking.service}`)
    setShowVoice(false)
  }

  const handleServiceSelect = (service: any) => {
    alert(`Selected service: ${service.title}`)
  }

  const handleDismiss = (serviceId: string) => {
    console.log(`Dismissed service: ${serviceId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Rocket className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Revolutionary
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Features
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              Experience the future of hyperlocal services with cutting-edge, AI, AR, and voice technologies 
              that transform how you, discover, negotiate, and book services.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Eye className="h-4 w-4 mr-2" />
                Computer Vision
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Mic className="h-4 w-4 mr-2" />
                Voice Commerce
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Scan className="h-4 w-4 mr-2" />
                AR Visualization
              </Badge>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Play className="h-5 w-5 mr-2" />
              Explore Features
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.slice(0, 4).map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-10`}>
                        <feature.icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {feature.stats.map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stat}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      Key Features:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Demo Button */}
                  <Button 
                    onClick={feature.demo}
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 transition-opacity group-hover:scale-105 transition-transform`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Predictive Service Matching Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-yellow-500 to-red-600" />
            <CardHeader>
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-red-600 bg-opacity-10">
                  <Target className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Predictive Service Matching</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI predicts what services you need before you even search
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <PredictiveServiceMatcher
                userContext={mockUserContext}
                onServiceSelect={handleServiceSelect}
                onDismiss={handleDismiss}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Powered by Cutting-Edge Technology
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Machine Learning', icon: Brain, desc: 'Advanced AI algorithms' },
              { name: 'Computer Vision', icon: Eye, desc: 'Real-time image analysis' },
              { name: 'Voice AI', icon: Mic, desc: 'Natural language processing' },
              { name: 'Augmented Reality', icon: Scan, desc: 'Immersive visualization' }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
              >
                <tech.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Component Modals */}
      <AISmartHaggling
        service={mockService}
        onAcceptDeal={handleAcceptDeal}
        onDeclineDeal={handleDeclineDeal}
        isOpen={showHaggling}
        onClose={() => setShowHaggling(false)}
      />

      <ComputerVisionScanner
        onListingGenerated={handleListingGenerated}
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />

      <ARServiceVisualizer
        service={mockARService}
        isOpen={showAR}
        onClose={() => setShowAR(false)}
        onBookService={handleBookService}
      />

      <VoiceCommerceEngine
        isOpen={showVoice}
        onClose={() => setShowVoice(false)}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  )
}

export default RevolutionaryFeaturesPage