import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, TrendingDown, TrendingUp, Brain, Target, XCircle, Sparkles, Handshake, BarChart3 } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'

interface ServiceData {
  id: string
  title: string
  provider: string
  originalPrice: number
  category: string
  rating: number
  completedJobs: number
  responseTime: string
  marketPrice: number
  demandLevel: 'low' | 'medium' | 'high'
  flexibilityScore: number
}

interface NegotiationMessage {
  id: string
  sender: 'user' | 'ai'
  message: string
  price?: number
  timestamp: Date
  reasoning?: string
  confidence: number
}

interface AIHagglingEngineProps {
  service: ServiceData
  onAcceptDeal: (finalPrice: number) => void
  onDeclineDeal: () => void
  isOpen: boolean
  onClose: () => void
}

const AISmartHaggling: React.FC<AIHagglingEngineProps> = ({
  service,
  onAcceptDeal,
  onDeclineDeal,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<NegotiationMessage[]>([])
  const [userOffer, setUserOffer] = useState<number>(service.originalPrice * 0.8)
  const [currentAIPrice, setCurrentAIPrice] = useState<number>(service.originalPrice)
  const [negotiationRound, setNegotiationRound] = useState(0)
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [negotiationStatus, setNegotiationStatus] = useState<'active' | 'success' | 'failed'>('active')
  const [aiPersonality, setAiPersonality] = useState<'friendly' | 'business' | 'flexible'>('friendly')
  const [marketInsights, setMarketInsights] = useState({
    avgPrice: service.marketPrice,
    priceFlexibility: service.flexibilityScore,
    demandScore: 75,
    competitorCount: 12
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeNegotiation()
    }
  }, [isOpen])

  const initializeNegotiation = () => {
    const initialMessage: NegotiationMessage = {
      id: '1',
      sender: 'ai',
      message: `Hi! I'm your AI negotiation assistant for ${service.title}. I can see you're interested in this service. The listed price is $${service.originalPrice}, but I'm authorized to work with you on pricing. What would be a fair price for you?`,
      timestamp: new Date(),
      confidence: 95
    }
    setMessages([initialMessage])
  }

  const generateAIResponse = (userPrice: number): NegotiationMessage => {
    const priceGap = Math.abs(currentAIPrice - userPrice)
    const percentageDiff = (priceGap / currentAIPrice) * 100
    
    let response = ''
    let newAIPrice = currentAIPrice
    let confidence = 85

    if (userPrice >= currentAIPrice * 0.95) {
      // User offer is very close to current AI price
      response = `That's a great offer! I can accept $${userPrice} for this service. This is a fair deal considering the provider's excellent rating of ${service.rating}/5 and ${service.completedJobs} completed jobs.`
      newAIPrice = userPrice
      setNegotiationStatus('success')
      confidence = 98
    } else if (userPrice >= currentAIPrice * 0.85) {
      // Reasonable counteroffer
      const counterOffer = Math.round(currentAIPrice - (priceGap * 0.6))
      response = `I appreciate your offer of $${userPrice}. Looking at market data and the provider's track, record, I can come down to $${counterOffer}. This service typically ranges from $${service.marketPrice - 20} to $${service.marketPrice + 30} in your area.`
      newAIPrice = counterOffer
      confidence = 90
    } else if (userPrice >= currentAIPrice * 0.7) {
      // Low but workable offer
      const counterOffer = Math.round(currentAIPrice - (priceGap * 0.4))
      response = `Your offer of $${userPrice} is below market, rate, but I understand budget constraints. I can offer $${counterOffer} as a compromise. This provider has a ${service.responseTime} response time and excellent reviews.`
      newAIPrice = counterOffer
      confidence = 75
    } else {
      // Very low offer
      if (negotiationRound >= 3) {
        response = `I've tried to work with, you, but $${userPrice} is too far below the service value. My final offer is $${Math.round(currentAIPrice * 0.8)}. This is the lowest I can go while ensuring quality service.`
        newAIPrice = Math.round(currentAIPrice * 0.8)
        confidence = 60
      } else {
        response = `I understand you're looking for a good, deal, but $${userPrice} is significantly below market value. The average price for similar services is $${service.marketPrice}. I can offer $${Math.round(currentAIPrice * 0.9)} considering your budget needs.`
        newAIPrice = Math.round(currentAIPrice * 0.9)
        confidence = 70
      }
    }

    setCurrentAIPrice(newAIPrice)
    
    return {
      id: Date.now().toString(),
      sender: 'ai',
      message: response,
      price: newAIPrice,
      timestamp: new Date(),
      reasoning: generateReasoning(userPrice, newAIPrice),
      confidence
    }
  }

  const generateReasoning = (userPrice: number, aiPrice: number): string => {
    const factors = [
      `Provider rating: ${service.rating}/5`,
      `Market average: $${service.marketPrice}`,
      `Demand level: ${service.demandLevel}`,
      `Completed jobs: ${service.completedJobs}`
    ]
    return `Factors considered: ${factors.join(', ')}`
  }

  const handleMakeOffer = async () => {
    if (userOffer <= 0) return

    setIsNegotiating(true)
    
    const userMessage: NegotiationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: `I'd like to offer $${userOffer} for this service.`,
      price: userOffer,
      timestamp: new Date(),
      confidence: 100
    }

    setMessages(prev => [...prev, userMessage])
    setNegotiationRound(prev => prev + 1)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userOffer)
      setMessages(prev => [...prev, aiResponse])
      setIsNegotiating(false)
    }, 1500)
  }

  const handleAcceptDeal = () => {
    onAcceptDeal(currentAIPrice)
  }

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getSavingsPercentage = () => {
    return Math.round(((service.originalPrice - currentAIPrice) / service.originalPrice) * 100)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Smart Haggling</h2>
                <p className="text-blue-100">Negotiate the best price with AI</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Service Info */}
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">by {service.provider}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${currentAIPrice}
                  </div>
                  {getSavingsPercentage() > 0 && (
                    <div className="text-sm text-green-500">
                      {getSavingsPercentage()}% savings
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p>{message.message}</p>
                      {message.price && (
                        <div className="mt-2 flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            ${message.price}
                          </Badge>
                          <div className="text-xs opacity-75">
                            Confidence: {message.confidence}%
                          </div>
                        </div>
                      )}
                      {message.reasoning && (
                        <p className="text-xs mt-1 opacity-75">{message.reasoning}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isNegotiating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">AI is analyzing your offer...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {negotiationStatus === 'active' && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BusinessIcons.DollarSign className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium">Your Offer:</span>
                    <Input
                      type="number"
                      value={userOffer}
                      onChange={(e) => setUserOffer(Number(e.target.value))}
                      className="w-24"
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${Math.round(service.originalPrice * 0.5)}</span>
                      <span>${service.originalPrice}</span>
                    </div>
                    <Slider
                      value={[userOffer]}
                      onValueChange={([value]) => setUserOffer(value)}
                      min={Math.round(service.originalPrice * 0.5)}
                      max={service.originalPrice}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleMakeOffer}
                      disabled={isNegotiating}
                      className="flex-1"
                    >
                      {isNegotiating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Negotiating...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Make Offer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Success/Deal Actions */}
            {negotiationStatus === 'success' && (
              <div className="p-4 border-t bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={handleAcceptDeal}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UIIcons.CheckCircle className="h-4 w-4 mr-2" />
                    Accept Deal (${currentAIPrice})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onDeclineDeal}
                  >
                    Keep Negotiating
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Market Intelligence Sidebar */}
          <div className="w-80 border-l bg-gray-50 dark:bg-gray-800 p-4 space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Market Intelligence
            </h3>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Price Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Original Price:</span>
                  <span className="font-medium">${service.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Market Average:</span>
                  <span className="font-medium">${service.marketPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Current Offer:</span>
                  <span className="font-medium text-blue-600">${currentAIPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Your Savings:</span>
                  <span className="font-medium text-green-600">
                    ${service.originalPrice - currentAIPrice}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Provider Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Rating:</span>
                  <span className="font-medium">{service.rating}/5 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Jobs Completed:</span>
                  <span className="font-medium">{service.completedJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Response Time:</span>
                  <span className="font-medium">{service.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Flexibility:</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={service.flexibilityScore} className="w-16 h-2" />
                    <span className="text-xs">{service.flexibilityScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Market Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Demand Level:</span>
                  <Badge className={getDemandColor(service.demandLevel)}>
                    {service.demandLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Competitors:</span>
                  <span className="font-medium">{marketInsights.competitorCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Negotiation Round:</span>
                  <span className="font-medium">{negotiationRound}/5</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    AI Tip
                  </p>
                  <p className="text-blue-700 dark:text-blue-200 mt-1">
                    This provider typically accepts offers 15-20% below listing price. 
                    Your current offer is in the sweet spot!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AISmartHaggling