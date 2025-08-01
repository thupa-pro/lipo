import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Scan, Volume2, VolumeX, RotateCcw, Move3D, Maximize, Minimize, XCircle, Info, Sparkles, Eye, Timer, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'

interface ServiceVisualization {
  id: string
  type: 'cleaning' | 'repair' | 'installation' | 'landscaping' | 'painting'
  title: string
  provider: string
  rating: number
  price: number
  duration: string
  preview3D: string
  beforeAfter: {
    before: string
    after: string
  }
  tools: string[]
  steps: string[]
  confidence: number
}

interface ARServiceVisualizerProps {
  service: ServiceVisualization
  isOpen: boolean
  onClose: () => void
  onBookService: (serviceId: string) => void
}

const ARServiceVisualizer: React.FC<ARServiceVisualizerProps> = ({
  service,
  isOpen,
  onClose,
  onBookService
}) => {
  const [isARActive, setIsARActive] = useState(false)
  const [currentView, setCurrentView] = useState<'camera' | 'before' | 'after' | '3d'>('camera')
  const [arProgress, setArProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [arPlaced, setArPlaced] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [scale, setScale] = useState([100])
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isARActive && isOpen) {
      startARSession()
    }
    return () => {
      stopARSession()
    }
  }, [isARActive, isOpen])

  const startARSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Simulate AR initialization
      setIsScanning(true)
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setArProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setArPlaced(true)
          setShowInstructions(false)
        }
      }, 200)

    } catch (error) {
      console.error('Failed to access camera:', error)
    }
  }

  const stopARSession = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsARActive(false)
    setArPlaced(false)
    setIsScanning(false)
    setArProgress(0)
  }

  const resetARView = () => {
    setScale([100])
    setRotation(0)
    setPosition({ x: 50, y: 50 })
  }

  const handleViewChange = (view: typeof currentView) => {
    setCurrentView(view)
    if (view === 'camera') {
      setIsARActive(true)
    } else {
      setIsARActive(false)
    }
  }

  const renderAROverlay = () => {
    if (!arPlaced) return null

    const serviceVisualizations = {
      cleaning: {
        overlay: (
          <div className="absolute inset-0 pointer-events-none">
            {/* Cleaning progress animation */}
            <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 border-2 border-blue-400 rounded-lg bg-blue-100/30 animate-pulse">
              <div className="text-center mt-8">
                <div className="text-blue-800 font-semibold">Deep Clean Zone</div>
                <div className="text-sm text-blue-600">3-4 hours estimated</div>
              </div>
            </div>
            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute h-4 w-4 text-blue-400 animate-bounce"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 20}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )
      },
      repair: {
        overlay: (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-yellow-400 rounded-full bg-yellow-100/30 flex items-center justify-center">
                <div className="text-center">
                  <NavigationIcons.Settings className="h-8 w-8 text-yellow-600 mx-auto animate-spin" / />
                  <div className="text-yellow-800 font-semibold mt-2">Repair Area</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      installation: {
        overlay: (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-1/4 left-1/3 w-1/3 h-1/2 border-2 border-green-400 rounded-lg bg-green-100/30">
              <div className="text-center mt-16">
                <Move3D className="h-8 w-8 text-green-600 mx-auto animate-bounce" />
                <div className="text-green-800 font-semibold">Install Here</div>
                <div className="text-sm text-green-600">Optimal placement</div>
              </div>
            </div>
          </div>
        )
      },
      landscaping: {
        overlay: (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-1/3 border-t-2 border-green-400 bg-green-100/30">
              <div className="grid grid-cols-3 gap-4 p-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 w-8 bg-green-400 rounded-full animate-pulse" 
                       style={{ animationDelay: `${i * 0.3}s` }} />
                ))}
              </div>
              <div className="text-center">
                <div className="text-green-800 font-semibold">Garden Layout</div>
              </div>
            </div>
          </div>
        )
      },
      painting: {
        overlay: (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full">
              {/* Paint coverage simulation */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-200/50 to-blue-400/50 rounded-lg border-2 border-blue-400 animate-pulse">
                <div className="text-center mt-16">
                  <div className="text-blue-800 font-semibold">Paint Coverage</div>
                  <div className="text-sm text-blue-600">Premium finish</div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    return serviceVisualizations[service.type]?.overlay
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50"
    >
      {/* AR Camera View */}
      {currentView === 'camera' && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* AR Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* AR Overlay */}
          {renderAROverlay()}

          {/* Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white/90 p-6 rounded-2xl text-center">
                <Scan className="h-12 w-12 text-blue-600 mx-auto animate-spin mb-4" />
                <h3 className="text-lg font-semibold mb-2">Scanning Environment</h3>
                <Progress value={arProgress} className="w-64 mb-2" />
                <p className="text-sm text-gray-600">
                  Finding optimal placement for {service.title}
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          {showInstructions && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-20 left-4 right-4"
            >
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">AR Instructions</span>
                </div>
                <p className="text-sm text-gray-700">
                  Point your camera at the area where you want the service. 
                  Move slowly to help AR detect the surface.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Before/After Views */}
      {(currentView === 'before' || currentView === 'after') && (
        <div className="relative w-full h-full">
          <img
            src={currentView === 'before' ? service.beforeAfter.before : service.beforeAfter.after}
            alt={`${currentView} service`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={currentView === 'before' ? 'secondary' : 'default'} className="text-lg">
              {currentView === 'before' ? 'Before' : 'After'}
            </Badge>
          </div>
        </div>
      )}

      {/* 3D View */}
      {currentView === '3d' && (
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center transform rotate-12 animate-pulse">
              <Move3D className="h-32 w-32 text-white" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">3D Preview</h3>
            <p className="text-gray-300">Interactive 3D visualization of {service.title}</p>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <XCircle className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-black/50 text-white border-white/30">
            <OptimizedIcon name="Star" className="h-3 w-3 mr-1" />
            {service.rating}
          </Badge>
          <Badge variant="outline" className="bg-black/50 text-white border-white/30">
            <Timer className="h-3 w-3 mr-1" />
            {service.duration}
          </Badge>
          <Badge variant="outline" className="bg-black/50 text-white border-white/30">
            <BusinessIcons.DollarSign className="h-3 w-3 mr-1" / />
            ${service.price}
          </Badge>
        </div>
      </div>

      {/* View Switcher */}
      <div className="absolute top-20 left-4 right-4 z-10">
        <div className="flex bg-black/50 backdrop-blur-sm rounded-xl p-1">
          {[
            { id: 'camera', label: 'AR View', icon: Camera },
            { id: 'before', label: 'Before', icon: Eye },
            { id: 'after', label: 'After', icon: Sparkles },
            { id: '3d', label: '3D', icon: Move3D }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentView === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange(id as typeof currentView)}
              className={`flex-1 ${currentView === id ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* AR Controls */}
      {currentView === 'camera' && arPlaced && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 space-y-4">
            <div className="text-white text-sm font-medium text-center">
              AR Controls
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-white text-xs mb-2">Scale</div>
                <Slider
                  value={scale}
                  onValueChange={setScale}
                  min={50}
                  max={150}
                  step={10}
                  className="w-32"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRotation(rotation + 45)}
                className="w-full text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Rotate
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetARView}
                className="w-full text-white hover:bg-white/20"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Service Info Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">by {service.provider}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${service.price}</div>
              <div className="text-sm text-gray-500">{service.duration}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold mb-2">What's Included</h4>
              <div className="space-y-1">
                {service.tools.map((tool, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <UIIcons.CheckCircle className="h-4 w-4 text-green-500 mr-2" / />
                    {tool}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Process Steps</h4>
              <div className="space-y-1">
                {service.steps.slice(0, 3).map((step, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => onBookService(service.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <BusinessIcons.Calendar className="h-4 w-4 mr-2" / />
              Book Service
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-6"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Sound Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute bottom-6 right-6 bg-black/50 text-white hover:bg-black/70 z-20"
      >
        {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>
    </motion.div>
  )
}

export default ARServiceVisualizer