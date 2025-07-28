import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Target, TrendingUp, Sparkles, Eye, Car, Utensils, Wrench, Paintbrush, Scissors, Heart, RefreshCw, Bell, XCircle, Info } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

interface PredictedService {
  id: string
  title: string
  category: string
  provider: string
  rating: number
  price: number
  confidence: number
  reasoning: string[]
  urgency: 'low' | 'medium' | 'high'
  timeWindow: string
  icon: React.ElementType
  estimatedBookingTime: string
  similarUsers: number
  trendingScore: number
  personalizedDiscount?: number
}

interface UserContext {
  location: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  season: 'spring' | 'summer' | 'fall' | 'winter'
  weather: string
  dayOfWeek: string
  recentActivity: string[]
  preferences: string[]
  bookingHistory: string[]
  budgetRange: [number, number]
}

interface PredictiveServiceMatcherProps {
  userContext: UserContext
  onServiceSelect: (service: PredictedService) => void
  onDismiss: (serviceId: string) => void
}

const PredictiveServiceMatcher: React.FC<PredictiveServiceMatcherProps> = ({
  userContext,
  onServiceSelect,
  onDismiss
}) => {
  const [predictions, setPredictions] = useState<PredictedService[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showingDetails, setShowingDetails] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const serviceIcons = {
    'Home Cleaning': Home,
    'Auto Maintenance': Car,
    'Food Delivery': Utensils,
    'Handyman': Wrench,
    'Painting': Paintbrush,
    'Hair & Beauty': Scissors,
    'Health & Wellness': Heart
  }

  useEffect(() => {
    generatePredictions()
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        generatePredictions()
      }, 300000) // Refresh every 5 minutes
      
      return () => clearInterval(interval)
    }
  }, [userContext, autoRefresh])

  const generatePredictions = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis progress
    const steps = [
      'Analyzing user behavior patterns...',
      'Processing location and time context...',
      'Evaluating seasonal trends...',
      'Cross-referencing with similar users...',
      'Calculating service urgency...',
      'Optimizing recommendations...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setAnalysisProgress(((i + 1) / steps.length) * 100)
    }

    // Generate mock predictions based on context
    const mockPredictions = generateContextualPredictions(userContext)
    setPredictions(mockPredictions)
    setIsAnalyzing(false)
  }

  const generateContextualPredictions = (context: UserContext): PredictedService[] => {
    const baseServices = [
      {
        id: '1',
        title: 'Weekly Home Cleaning',
        category: 'Home Cleaning',
        provider: 'CleanPro Services',
        rating: 4.8,
        price: 85,
        icon: Home,
        estimatedBookingTime: '2-3 hours',
        similarUsers: 124,
        trendingScore: 85
      },
      {
        id: '2',
        title: 'Car Oil Change & Inspection',
        category: 'Auto Maintenance',
        provider: 'QuickFix Auto',
        rating: 4.6,
        price: 45,
        icon: Car,
        estimatedBookingTime: '1 hour',
        similarUsers: 89,
        trendingScore: 72
      },
      {
        id: '3',
        title: 'Grocery Delivery',
        category: 'Food Delivery',
        provider: 'FreshMart Express',
        rating: 4.7,
        price: 25,
        icon: Utensils,
        estimatedBookingTime: '30 minutes',
        similarUsers: 156,
        trendingScore: 91
      },
      {
        id: '4',
        title: 'Furniture Assembly',
        category: 'Handyman',
        provider: 'FixIt Experts',
        rating: 4.9,
        price: 75,
        icon: Wrench,
        estimatedBookingTime: '2 hours',
        similarUsers: 67,
        trendingScore: 78
      },
      {
        id: '5',
        title: 'Interior Wall Painting',
        category: 'Painting',
        provider: 'ColorCraft Painters',
        rating: 4.8,
        price: 120,
        icon: Paintbrush,
        estimatedBookingTime: '4-6 hours',
        similarUsers: 43,
        trendingScore: 69
      },
      {
        id: '6',
        title: 'Haircut & Styling',
        category: 'Hair & Beauty',
        provider: 'Style Studio',
        rating: 4.7,
        price: 55,
        icon: Scissors,
        estimatedBookingTime: '1 hour',
        similarUsers: 98,
        trendingScore: 83
      },
      {
        id: '7',
        title: 'Personal Training Session',
        category: 'Health & Wellness',
        provider: 'FitLife Trainers',
        rating: 4.9,
        price: 65,
        icon: Heart,
        estimatedBookingTime: '1 hour',
        similarUsers: 76,
        trendingScore: 88
      }
    ]

    // Apply contextual scoring and filtering
    return baseServices.map(service => {
      let confidence = 60
      const reasoning: string[] = []
      let urgency: 'low' | 'medium' | 'high' = 'low'
      let timeWindow = 'Next 7 days'
      let personalizedDiscount: number | undefined = undefined

      // Time-based predictions
      if (context.timeOfDay === 'morning' && service.category === 'Health & Wellness') {
        confidence += 20
        reasoning.push('Users often book fitness services in the morning')
      }
      
      if (context.timeOfDay === 'evening' && service.category === 'Food Delivery') {
        confidence += 25
        reasoning.push('High demand for food delivery during dinner time')
        urgency = 'high'
        timeWindow = 'Next 2 hours'
      }

      // Day-based predictions
      if (context.dayOfWeek === 'Saturday' && service.category === 'Home Cleaning') {
        confidence += 30
        reasoning.push('Weekend is prime time for home cleaning services')
        urgency = 'medium'
        timeWindow = 'This weekend'
      }

      // Seasonal predictions
      if (context.season === 'spring' && service.category === 'Painting') {
        confidence += 25
        reasoning.push('Spring is popular season for home improvement projects')
        personalizedDiscount = 15
      }

      // Weather-based predictions
      if (context.weather === 'rainy' && service.category === 'Food Delivery') {
        confidence += 20
        reasoning.push('Rainy weather increases demand for delivery services')
        urgency = 'high'
      }

      // Location-based predictions
      if (context.location === 'suburban' && service.category === 'Auto Maintenance') {
        confidence += 15
        reasoning.push('Suburban residents frequently need auto services')
      }

      // Booking history analysis
      if (context.bookingHistory.includes(service.category)) {
        confidence += 35
        reasoning.push('You have previously booked similar services')
        personalizedDiscount = 10
      }

      // Recent activity analysis
      if (context.recentActivity.some(activity => 
        activity.toLowerCase().includes(service.category.toLowerCase().split(' ')[0])
      )) {
        confidence += 25
        reasoning.push('Based on your recent browsing activity')
      }

      // Budget compatibility
      if (service.price >= context.budgetRange[0] && service.price <= context.budgetRange[1]) {
        confidence += 15
        reasoning.push('Within your preferred budget range')
      }

      // Trending services boost
      if (service.trendingScore > 80) {
        confidence += 10
        reasoning.push('Currently trending in your area')
      }

      // Popular with similar users
      if (service.similarUsers > 100) {
        confidence += 10
        reasoning.push('Popular with users similar to you')
      }

      return {
        ...service,
        confidence: Math.min(confidence, 95),
        reasoning,
        urgency,
        timeWindow,
        personalizedDiscount
      }
    })
    .filter(service => service.confidence > 65)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 80) return 'text-blue-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Service Predictions</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Services you might need based on smart analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <span className="text-sm">Auto-refresh</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <Bell className="h-4 w-4" />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generatePredictions}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
            <span className="font-semibold">AI Analysis in Progress</span>
          </div>
          <Progress value={analysisProgress} className="w-full mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analyzing {Object.keys(userContext).length} data points to predict your service needs...
          </p>
        </motion.div>
      )}

      {/* Context Summary */}
      {!isAnalyzing && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Analysis Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <BusinessIcons.MapPin className="h-4 w-4 text-blue-600" />
                <span>{userContext.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <OptimizedIcon name="Clock" className="h-4 w-4 text-green-600" />
                <span>{userContext.timeOfDay}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BusinessIcons.Calendar className="h-4 w-4 text-purple-600" />
                <span>{userContext.dayOfWeek}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span>{userContext.weather}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {predictions.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Service Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <service.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{service.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {service.provider}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <OptimizedIcon name="Star" className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{service.rating}</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ${service.price}
                        {service.personalizedDiscount && (
                          <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 rounded">
                            -{service.personalizedDiscount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Confidence & Urgency */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Confidence:</span>
                      <span className={`font-semibold ${getConfidenceColor(service.confidence)}`}>
                        {service.confidence}%
                      </span>
                    </div>
                    
                    <Badge className={getUrgencyColor(service.urgency)}>
                      {service.urgency.toUpperCase()} PRIORITY
                    </Badge>
                  </div>

                  {/* Time Window */}
                  <div className="flex items-center space-x-2 mb-4">
                    <OptimizedIcon name="Clock" className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Best time to book: {service.timeWindow}</span>
                  </div>

                  {/* Reasoning Preview */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Why we recommend this:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {service.reasoning.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                          <span>{reason}</span>
                        </div>
                      ))}
                      {service.reasoning.length > 2 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-purple-600"
                          onClick={() => setShowingDetails(
                            showingDetails === service.id ? null : service.id
                          )}
                        >
                          +{service.reasoning.length - 2} more reasons
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Detailed Reasoning */}
                  <AnimatePresence>
                    {showingDetails === service.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="text-sm space-y-1">
                          {service.reasoning.slice(2).map((reason, idx) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Social Proof */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <NavigationIcons.User className="h-4 w-4" />
                      <span>{service.similarUsers} similar users booked this</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Trending: {service.trendingScore}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onServiceSelect(service)}
                      className="flex-1"
                    >
                      <BusinessIcons.Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDismiss(service.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>

                {/* Confidence Indicator */}
                <div 
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600"
                  style={{ width: `${service.confidence}%` }}
                />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!isAnalyzing && predictions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No predictions available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try updating your preferences or activity to get personalized recommendations
          </p>
          <Button onClick={generatePredictions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Predictions
          </Button>
        </motion.div>
      )}

      {/* Footer Info */}
      {predictions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                How predictions work
              </p>
              <p className="text-blue-700 dark:text-blue-200">
                Our AI analyzes your, location, time, patterns, weather, booking, history, and behavior 
                of similar users to predict services you might need. Predictions update automatically 
                as context changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictiveServiceMatcher