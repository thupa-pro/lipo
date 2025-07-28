import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Scan, Eye, Brain, Sparkles, Tag, Edit, Save, Download, Share2, Trash2 } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'

interface ScanResult {
  id: string
  category: string
  title: string
  description: string
  suggestedPrice: number
  priceRange: [number, number]
  confidence: number
  detectedObjects: string[]
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  marketDemand: 'high' | 'medium' | 'low'
  tags: string[]
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface ComputerVisionScannerProps {
  onListingGenerated: (listing: ScanResult) => void
  isOpen: boolean
  onClose: () => void
}

const ComputerVisionScanner: React.FC<ComputerVisionScannerProps> = ({
  onListingGenerated,
  isOpen,
  onClose
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<ScanResult | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedResult, setEditedResult] = useState<ScanResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((files: File[]) => {
    setSelectedImages(files)
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
    
    // Cleanup previous URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const simulateAIScan = async (): Promise<ScanResult> => {
    // Simulate progressive AI analysis
    const steps = [
      { progress: 10, message: 'Analyzing image composition...' },
      { progress: 25, message: 'Detecting objects and materials...' },
      { progress: 45, message: 'Identifying service categories...' },
      { progress: 65, message: 'Analyzing market data...' },
      { progress: 80, message: 'Generating pricing recommendations...' },
      { progress: 95, message: 'Finalizing listing details...' },
      { progress: 100, message: 'Scan complete!' }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setScanProgress(step.progress)
    }

    // Mock AI-generated result based on common service categories
    const mockResults: ScanResult[] = [
      {
        id: '1',
        category: 'Home Cleaning',
        title: 'Deep House Cleaning Service',
        description: 'Professional deep cleaning service for residential homes. Includes, kitchen, bathrooms, living, areas and bedrooms. All eco-friendly products used. Perfect for move-in/move-out cleaning or seasonal deep cleans.',
        suggestedPrice: 120,
        priceRange: [90, 180],
        confidence: 92,
        detectedObjects: ['furniture', 'kitchen appliances', 'bathroom fixtures', 'carpets'],
        condition: 'good',
        marketDemand: 'high',
        tags: ['deep cleaning', 'eco-friendly', 'residential', 'professional'],
        estimatedTime: '3-4 hours',
        difficulty: 'medium'
      },
      {
        id: '2',
        category: 'Handyman Services',
        title: 'Furniture Assembly & Installation',
        description: 'Expert furniture assembly and installation service. Specializing in IKEA, furniture, shelving, units, TV, mounting, and home organization systems. Tools and hardware included.',
        suggestedPrice: 85,
        priceRange: [60, 120],
        confidence: 88,
        detectedObjects: ['furniture pieces', 'tools', 'hardware', 'instruction manuals'],
        condition: 'excellent',
        marketDemand: 'medium',
        tags: ['assembly', 'furniture', 'installation', 'IKEA'],
        estimatedTime: '2-3 hours',
        difficulty: 'easy'
      },
      {
        id: '3',
        category: 'Landscaping',
        title: 'Garden Maintenance & Lawn Care',
        description: 'Complete lawn and garden maintenance service including, mowing, trimming, weeding, and seasonal cleanup. Equipment and disposal included. Regular maintenance schedules available.',
        suggestedPrice: 75,
        priceRange: [50, 110],
        confidence: 85,
        detectedObjects: ['grass', 'plants', 'garden tools', 'outdoor space'],
        condition: 'good',
        marketDemand: 'high',
        tags: ['lawn care', 'gardening', 'maintenance', 'outdoor'],
        estimatedTime: '2-3 hours',
        difficulty: 'medium'
      }
    ]

    return mockResults[Math.floor(Math.random() * mockResults.length)]
  }

  const handleStartScan = async () => {
    if (selectedImages.length === 0) return

    setIsScanning(true)
    setScanProgress(0)
    setScanResults(null)

    try {
      const result = await simulateAIScan()
      setScanResults(result)
      setEditedResult(result)
    } catch (error) {
      console.error('Scan failed:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleEditField = (field: keyof ScanResult, value: any) => {
    if (editedResult) {
      setEditedResult({ ...editedResult, [field]: value })
    }
  }

  const handleSaveListing = () => {
    if (editedResult) {
      onListingGenerated(editedResult)
      onClose()
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Vision Scanner</h2>
                <p className="text-purple-100">Upload photos to generate instant listings</p>
              </div>
            </div>
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

        <div className="flex h-[80vh]">
          {/* Upload Area */}
          <div className="flex-1 p-6">
            {!scanResults ? (
              <div className="space-y-6">
                {/* Image Upload */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors"
                >
                  {previewUrls.length === 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Camera className="h-16 w-16 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Upload Service Photos
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Drag & drop images or click to browse
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Browse Files
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => cameraInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 h-8 w-8 p-0"
                              onClick={() => {
                                const newImages = selectedImages.filter((_, i) => i !== index)
                                const newUrls = previewUrls.filter((_, i) => i !== index)
                                setSelectedImages(newImages)
                                setPreviewUrls(newUrls)
                                URL.revokeObjectURL(url)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={handleStartScan}
                        disabled={isScanning}
                        className="bg-purple-600 hover:bg-purple-700"
                        size="lg"
                      >
                        {isScanning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Scan className="h-4 w-4 mr-2" />
                            Start AI Analysis
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Scanning Progress */}
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                      <span className="font-medium">AI Processing...</span>
                    </div>
                    <Progress value={scanProgress} className="w-full" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {scanProgress < 100 ? 'Analyzing image content and generating listing...' : 'Complete!'}
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Results Display */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Generated Listing</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {isEditing ? 'Preview' : 'Edit'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveListing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save Listing
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Service Title
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedResult?.title || ''}
                              onChange={(e) => handleEditField('title', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <h4 className="text-lg font-semibold mt-1">
                              {editedResult?.title}
                            </h4>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          {isEditing ? (
                            <Textarea
                              value={editedResult?.description || ''}
                              onChange={(e) => handleEditField('description', e.target.value)}
                              className="mt-1"
                              rows={4}
                            />
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {editedResult?.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                          </label>
                          <Badge variant="secondary" className="mt-1">
                            <Tag className="h-3 w-3 mr-1" />
                            {editedResult?.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Suggested Price
                          </label>
                          {isEditing ? (
                            <div className="mt-1 space-y-2">
                              <Input
                                type="number"
                                value={editedResult?.suggestedPrice || 0}
                                onChange={(e) => handleEditField('suggestedPrice', Number(e.target.value))}
                              />
                              <div className="text-sm text-gray-500">
                                Range: ${editedResult?.priceRange[0]} - ${editedResult?.priceRange[1]}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-1">
                              <div className="text-2xl font-bold text-green-600">
                                ${editedResult?.suggestedPrice}
                              </div>
                              <div className="text-sm text-gray-500">
                                Range: ${editedResult?.priceRange[0]} - ${editedResult?.priceRange[1]}
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estimated Time
                          </label>
                          <div className="flex items-center mt-1">
                            <OptimizedIcon name="Clock" className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{editedResult?.estimatedTime}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Market Demand
                          </label>
                          <Badge className={`mt-1 ${getDemandColor(editedResult?.marketDemand || 'low')}`}>
                            {editedResult?.marketDemand?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Service Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {editedResult?.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Detected Elements
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {editedResult?.detectedObjects.map((object, index) => (
                            <Badge key={index} variant="secondary">
                              {object}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Analysis Sidebar */}
          <div className="w-80 border-l bg-gray-50 dark:bg-gray-800 p-4 space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Analysis
            </h3>

            {scanResults && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Confidence Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Progress value={scanResults.confidence} className="flex-1" />
                      <span className={`font-medium ${getConfidenceColor(scanResults.confidence)}`}>
                        {scanResults.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Based on image analysis and market data
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Service Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Condition:</span>
                        <Badge variant={scanResults.condition === 'excellent' ? 'default' : 'secondary'}>
                          {scanResults.condition}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Difficulty:</span>
                        <Badge variant="outline">
                          {scanResults.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        AI Recommendations
                      </p>
                      <ul className="text-blue-700 dark:text-blue-200 mt-1 text-xs space-y-1">
                        <li>• Price is competitive for your area</li>
                        <li>• High demand service category</li>
                        <li>• Consider offering package deals</li>
                        <li>• Include before/after photos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Eye className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-purple-900 dark:text-purple-100">
                    How it works
                  </p>
                  <ul className="text-purple-700 dark:text-purple-200 mt-1 text-xs space-y-1">
                    <li>1. Upload, clear, well-lit photos</li>
                    <li>2. AI analyzes objects and context</li>
                    <li>3. Generates listing with market data</li>
                    <li>4. Edit and customize as needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  )
}

export default ComputerVisionScanner