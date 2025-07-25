'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Brain,
  Sparkles,
  CheckCircle,
  MapPin,
  Calendar,
  DollarSign, Phone,
  Mail,
  CreditCard,
  Shield,
  Target,
  Settings,
  Headphones,
  Waves,
  Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'

interface VoiceMessage {
  id: string
  type: 'user' | 'assistant'
  text: string
  audio?: string
  timestamp: Date
  intent?: string
  entities?: Record<string, any>
  confidence: number
}

interface BookingContext {
  service?: string
  provider?: string
  date?: string
  time?: string
  location?: string
  price?: number
  duration?: string
  requirements?: string[]
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
  paymentMethod?: string
  status: 'collecting' | 'confirming' | 'complete'
  progress: number
}

interface VoiceCommerceEngineProps {
  isOpen: boolean
  onClose: () => void
  onBookingComplete: (booking: BookingContext) => void
}

const VoiceCommerceEngine: React.FC<VoiceCommerceEngineProps> = ({
  isOpen,
  onClose,
  onBookingComplete
}) => {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [bookingContext, setBookingContext] = useState<BookingContext>({
    status: 'collecting',
    progress: 0
  })
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [volume, setVolume] = useState([75])
  const [speechSpeed, setSpeechSpeed] = useState([1.0])
  const [showTranscript, setShowTranscript] = useState(true)
  const [visualizationData, setVisualizationData] = useState<number[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<any>(null)

  useEffect(() => {
    if (isOpen) {
      initializeVoiceEngine()
      startWelcomeFlow()
    }
    return () => {
      stopListening()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeVoiceEngine = () => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = handleSpeechResult
      recognitionRef.current.onerror = handleSpeechError
      recognitionRef.current.onend = handleSpeechEnd
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis
  }

  const startWelcomeFlow = async () => {
    const welcomeMessage: VoiceMessage = {
      id: '1',
      type: 'assistant',
      text: "Hi! I'm your voice assistant. I can help you book any service just by talking. What service are you looking for today?",
      timestamp: new Date(),
      confidence: 100
    }
    
    setMessages([welcomeMessage])
    
    if (voiceEnabled) {
      await speakMessage(welcomeMessage.text)
    }
  }

  const handleSpeechResult = (event: any) => {
    const transcript = Array.from(event.results)
      .map((result: any) => result[0].transcript)
      .join('')

    if (event.results[event.results.length - 1].isFinal) {
      processUserInput(transcript)
    }
  }

  const handleSpeechError = (event: any) => {
    console.error('Speech recognition error:', event.error)
    setIsListening(false)
  }

  const handleSpeechEnd = () => {
    setIsListening(false)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
      
      // Simulate audio visualization
      const interval = setInterval(() => {
        setVisualizationData(Array.from({ length: 20 }, () => Math.random() * 100))
      }, 100)
      
      setTimeout(() => clearInterval(interval), 5000)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setVisualizationData([])
    }
  }

  const speakMessage = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (synthesisRef.current && voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = speechSpeed[0]
        utterance.volume = volume[0] / 100
        utterance.onend = () => resolve()
        synthesisRef.current.speak(utterance)
      } else {
        resolve()
      }
    })
  }

  const processUserInput = async (input: string) => {
    setIsProcessing(true)
    
    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date(),
      confidence: 95
    }
    
    setMessages(prev => [...prev, userMessage])

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate AI response based on context
    const response = await generateAIResponse(input, bookingContext)
    
    const assistantMessage: VoiceMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      text: response.text,
      timestamp: new Date(),
      intent: response.intent,
      entities: response.entities,
      confidence: response.confidence
    }

    setMessages(prev => [...prev, assistantMessage])
    setBookingContext(response.updatedContext)
    
    if (voiceEnabled) {
      await speakMessage(response.text)
    }
    
    setIsProcessing(false)
  }

  const generateAIResponse = async (input: string, context: BookingContext) => {
    const lowerInput = input.toLowerCase()
    
    // Intent recognition
    let intent = 'unknown'
    const entities: Record<string, any> = {}
    const updatedContext = { ...context }
    let responseText = ''
    
    // Service intent
    if (!context.service) {
      const services = ['cleaning', 'plumbing', 'electrician', 'handyman', 'painting', 'landscaping', 'moving']
      const detectedService = services.find(service => lowerInput.includes(service))
      
      if (detectedService) {
        intent = 'service_selection'
        entities.service = detectedService
        updatedContext.service = detectedService
        updatedContext.progress = 20
        responseText = `Great! I found ${detectedService} services for you. When would you like to schedule this? You can say something like "tomorrow morning" or "next Friday at 2 PM".`
      } else {
        responseText = "I can help you with, cleaning, plumbing, electrical, work, handyman, services, painting, landscaping, or moving. Which service interests you?"
      }
    }
    
    // Date/time intent
    else if (!context.date && (lowerInput.includes('tomorrow') || lowerInput.includes('next') || lowerInput.includes('monday') || lowerInput.includes('today'))) {
      intent = 'schedule_selection'
      
      if (lowerInput.includes('tomorrow')) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        entities.date = tomorrow.toDateString()
        updatedContext.date = tomorrow.toDateString()
      } else if (lowerInput.includes('today')) {
        entities.date = new Date().toDateString()
        updatedContext.date = new Date().toDateString()
      }
      
      // Time extraction
      const timeMatch = lowerInput.match(/(\d{1,2})\s*(am|pm|o'clock)/i)
      if (timeMatch) {
        entities.time = timeMatch[0]
        updatedContext.time = timeMatch[0]
      }
      
      updatedContext.progress = 40
      
      if (updatedContext.time) {
        responseText = `Perfect! I have you scheduled for ${updatedContext.service} on ${updatedContext.date} at ${updatedContext.time}. What's your location or address?`
      } else {
        responseText = `Got, it, ${updatedContext.date}. What time works best for you? You can say something like "2 PM" or "morning".`
      }
    }
    
    // Location intent
    else if (!context.location && (lowerInput.includes('street') || lowerInput.includes('avenue') || lowerInput.includes('drive') || lowerInput.includes('location'))) {
      intent = 'location_selection'
      entities.location = input
      updatedContext.location = input
      updatedContext.progress = 60
      responseText = `Great! I have your location as ${input}. Based on your, needs, I found a provider for $${Math.floor(Math.random() * 100) + 50}. Should I proceed with the booking?`
      updatedContext.price = Math.floor(Math.random() * 100) + 50
    }
    
    // Confirmation intent
    else if (lowerInput.includes('yes') || lowerInput.includes('confirm') || lowerInput.includes('book') || lowerInput.includes('proceed')) {
      intent = 'confirmation'
      updatedContext.status = 'confirming'
      updatedContext.progress = 80
      responseText = `Excellent! To complete your, booking, I'll need your contact information. Can you provide your name and phone number?`
    }
    
    // Contact information
    else if (lowerInput.includes('name') || /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(input)) {
      intent = 'contact_info'
      
      // Extract name
      const nameMatch = input.match(/my name is (\w+)/i)
      if (nameMatch) {
        entities.name = nameMatch[1]
        updatedContext.customerInfo = { ...updatedContext.customerInfo, name: nameMatch[1] }
      }
      
      // Extract phone
      const phoneMatch = input.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/)
      if (phoneMatch) {
        entities.phone = phoneMatch[0]
        updatedContext.customerInfo = { ...updatedContext.customerInfo, phone: phoneMatch[0] }
      }
      
      updatedContext.progress = 95
      
      if (updatedContext.customerInfo?.name && updatedContext.customerInfo?.phone) {
        updatedContext.status = 'complete'
        updatedContext.progress = 100
        responseText = `Perfect! Your ${updatedContext.service} service is booked for ${updatedContext.date} at ${updatedContext.time} at ${updatedContext.location}. Total cost: $${updatedContext.price}. You'll receive a confirmation text at ${updatedContext.customerInfo.phone}. Is there anything else I can help you with?`
      } else {
        responseText = `Thank you! I still need ${!updatedContext.customerInfo?.name ? 'your name' : 'your phone number'} to complete the booking.`
      }
    }
    
    // Default response
    else {
      responseText = "I'm not sure I understood that. Could you please repeat or try rephrasing your request?"
    }

    return {
      text: responseText,
      intent,
      entities,
      confidence: 90,
      updatedContext
    }
  }

  const handleBookingComplete = () => {
    if (bookingContext.status === 'complete') {
      onBookingComplete(bookingContext)
    }
  }

  const resetBooking = () => {
    setBookingContext({
      status: 'collecting',
      progress: 0
    })
    setMessages([])
    startWelcomeFlow()
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Mic className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Voice Commerce</h2>
                <p className="text-indigo-100">Book services with natural conversation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetBooking}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Booking Progress */}
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Booking Progress</span>
                <span className="text-sm text-gray-600">{bookingContext.progress}%</span>
              </div>
              <Progress value={bookingContext.progress} className="w-full" />
              
              {bookingContext.service && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{bookingContext.service}</Badge>
                  {bookingContext.date && <Badge variant="outline">{bookingContext.date}</Badge>}
                  {bookingContext.time && <Badge variant="outline">{bookingContext.time}</Badge>}
                  {bookingContext.location && <Badge variant="outline">{bookingContext.location}</Badge>}
                  {bookingContext.price && <Badge variant="outline">${bookingContext.price}</Badge>}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'assistant' && (
                          <Brain className="h-4 w-4 mt-0.5 text-indigo-600" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.text}</p>
                          {message.intent && (
                            <div className="mt-2 text-xs opacity-75">
                              Intent: {message.intent} ({message.confidence}%)
                            </div>
                          )}
                        </div>
                        {voiceEnabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => speakMessage(message.text)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-indigo-600 animate-pulse" />
                    <span className="text-sm">Processing your request...</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Controls */}
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-center space-x-4">
                {/* Microphone Button */}
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  className={`w-16 h-16 rounded-full ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                
                <div className="text-center">
                  <div className="text-sm font-medium">
                    {isListening ? 'Listening...' : 'Tap to speak'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isProcessing ? 'Processing...' : 'Voice-powered booking'}
                  </div>
                </div>
              </div>

              {/* Audio Visualization */}
              {isListening && visualizationData.length > 0 && (
                <div className="flex items-center justify-center space-x-1 mt-4">
                  {visualizationData.map((height, index) => (
                    <motion.div
                      key={index}
                      className="w-1 bg-indigo-600 rounded-full"
                      animate={{ height: `${Math.max(4, height * 0.3)}px` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="w-80 border-l bg-gray-50 dark:bg-gray-800 p-4 space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Voice Settings
            </h3>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Audio Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Responses</span>
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Volume</span>
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Speech Speed</span>
                    <Zap className="h-4 w-4" />
                  </div>
                  <Slider
                    value={speechSpeed}
                    onValueChange={setSpeechSpeed}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Conversation Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Messages:</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline">{bookingContext.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Completion:</span>
                  <span className="font-medium">{bookingContext.progress}%</span>
                </div>
              </CardContent>
            </Card>

            {bookingContext.status === 'complete' && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Booking Complete!</span>
                  </div>
                  <Button
                    onClick={handleBookingComplete}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Confirm Booking
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Headphones className="h-4 w-4 text-indigo-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-indigo-900 dark:text-indigo-100 mb-1">
                    Voice Tips
                  </p>
                  <ul className="text-indigo-700 dark:text-indigo-200 text-xs space-y-1">
                    <li>• Speak clearly and naturally</li>
                    <li>• Include specific details</li>
                    <li>• Say "yes" or "no" for confirmations</li>
                    <li>• Mention dates like "tomorrow" or "Friday"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VoiceCommerceEngine