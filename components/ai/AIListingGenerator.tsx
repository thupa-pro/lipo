import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

// AI-Powered Listing Generator for Loconomy
// Creates complete service listings with AI-generated, content, pricing, and optimization

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Wand2, Sparkles, Brain, ImageIcon, Tag, TrendingUp, AlertCircle, RefreshCw, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceListing, ServiceCategory, ServicePricing } from '@/types/loconomy';
import { useToast } from '@/hooks/use-toast';

interface AIListingGeneratorProps {
  tenantId: string;
  providerId: string;
  onListingGenerated?: (listing: Partial<ServiceListing>) => void;
  className?: string;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

interface AIGenerationRequest {
  serviceType: string;
  briefDescription: string;
  targetAudience: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location: string;
  specialFeatures?: string[];
  aiOptions: {
    generateTitle: boolean;
    generateDescription: boolean;
    generateTags: boolean;
    generatePricing: boolean;
    optimizeForSEO: boolean;
    marketAnalysis: boolean;
  };
}

interface AIGenerationResult {
  title: string;
  description: string;
  tags: string[];
  pricing: ServicePricing;
  category: ServiceCategory;
  marketInsights: MarketInsights;
  optimizations: AIOptimization[];
}

interface MarketInsights {
  competitorPricing: {
    min: number;
    max: number;
    average: number;
  };
  demandLevel: 'low' | 'medium' | 'high';
  seasonality: SeasonalTrend[];
  suggestedKeywords: string[];
  localTrends: LocalTrend[];
}

interface SeasonalTrend {
  season: string;
  demandMultiplier: number;
  description: string;
}

interface LocalTrend {
  trend: string;
  impact: 'positive' | 'neutral' | 'negative';
  description: string;
}

interface AIOptimization {
  type: 'pricing' | 'content' | 'timing' | 'targeting';
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
  implementation: string;
}

function AIListingGenerator({
  tenantId,
  providerId,
  onListingGenerated,
  className
}: AIListingGeneratorProps) {
  const { toast } = useToast();
  
  // Form state
  const [request, setRequest] = useState<AIGenerationRequest>({
    serviceType: '',
    briefDescription: '',
    targetAudience: '',
    location: '',
    specialFeatures: [],
    aiOptions: {
      generateTitle: true,
      generateDescription: true,
      generateTags: true,
      generatePricing: true,
      optimizeForSEO: true,
      marketAnalysis: true,
    }
  });

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [generationResult, setGenerationResult] = useState<AIGenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  // Initialize generation steps
  useEffect(() => {
    setGenerationSteps([
      {
        id: 'analyze',
        title: 'Market Analysis',
        description: 'Analyzing local market data and competition',
        status: 'pending',
        progress: 0
      },
      {
        id: 'generate',
        title: 'Content Generation',
        description: 'Creating AI-optimized title and description',
        status: 'pending',
        progress: 0
      },
      {
        id: 'pricing',
        title: 'Pricing Optimization',
        description: 'Calculating competitive pricing strategy',
        status: 'pending',
        progress: 0
      },
      {
        id: 'tags',
        title: 'SEO & Tags',
        description: 'Generating search-optimized tags and keywords',
        status: 'pending',
        progress: 0
      },
      {
        id: 'insights',
        title: 'Strategic Insights',
        description: 'Providing market insights and recommendations',
        status: 'pending',
        progress: 0
      }
    ]);
  }, []);

  const updateRequest = useCallback((updates: Partial<AIGenerationRequest>) => {
    setRequest(prev => ({ ...prev, ...updates }));
  }, []);

  const updateAIOptions = useCallback((option: keyof AIGenerationRequest['aiOptions'], value: boolean) => {
    setRequest(prev => ({
      ...prev,
      aiOptions: {
        ...prev.aiOptions,
        [option]: value
      }
    }));
  }, []);

  const addSpecialFeature = useCallback((feature: string) => {
    if (feature.trim()) {
      setRequest(prev => ({
        ...prev,
        specialFeatures: [...(prev.specialFeatures || []), feature.trim()]
      }));
    }
  }, []);

  const removeSpecialFeature = useCallback((index: number) => {
    setRequest(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures?.filter((_, i) => i !== index) || []
    }));
  }, []);

  const simulateAIGeneration = useCallback(async () => {
    setIsGenerating(true);
    setActiveTab('generation');

    try {
      // Simulate step-by-step AI generation
      for (let i = 0; i < generationSteps.length; i++) {
        setGenerationSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'processing' } : step
          )
        );

        // Simulate processing time with progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setGenerationSteps(prev => 
            prev.map((step, index) => 
              index === i ? { ...step, progress } : step
            )
          );
        }

        setGenerationSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'completed', progress: 100 } : step
          )
        );
      }

      // Generate AI result
      const result: AIGenerationResult = {
        title: generateAITitle(request),
        description: generateAIDescription(request),
        tags: generateAITags(request),
        pricing: generateAIPricing(request),
        category: generateAICategory(request),
        marketInsights: generateMarketInsights(request),
        optimizations: generateOptimizations(request)
      };

      setGenerationResult(result);
      setActiveTab('result');

      toast({
        title: "✨ AI Generation Complete!",
        description: "Your service listing has been optimized with AI insights.",
      });

      onListingGenerated?.(result);

    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation Error",
        description: "There was an error generating your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [request, generationSteps, onListingGenerated, toast]);

  const canGenerate = request.serviceType && request.briefDescription && request.location;

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            AI Listing Generator
          </CardTitle>
          <CardDescription>
            Create a, complete, optimized service listing in minutes with AI-powered content generation and market analysis.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Input Details
          </TabsTrigger>
          <TabsTrigger value="generation" disabled={!isGenerating} className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Generation
          </TabsTrigger>
          <TabsTrigger value="result" disabled={!generationResult} className="flex items-center gap-2">
            <UIIcons.CheckCircle className="w-4 h-4" />
            Generated Listing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Information</CardTitle>
              <CardDescription>
                Provide basic details about your service. Our AI will enhance and optimize everything else.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    placeholder="e.g., House, Cleaning, Dog, Walking, Tutoring"
                    value={request.serviceType}
                    onChange={(e) => updateRequest({ serviceType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Service Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San, Francisco, CA"
                    value={request.location}
                    onChange={(e) => updateRequest({ location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="briefDescription">Brief Description *</Label>
                <Textarea
                  id="briefDescription"
                  placeholder="Describe your service in a few sentences. What makes it special?"
                  value={request.briefDescription}
                  onChange={(e) => updateRequest({ briefDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Busy, professionals, Families with, pets, Students"
                  value={request.targetAudience}
                  onChange={(e) => updateRequest({ targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Special Features</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {request.specialFeatures?.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => removeSpecialFeature(index)}
                    >
                      {feature} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add special features (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialFeature(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI Options
              </CardTitle>
              <CardDescription>
                Choose what aspects you'd like AI to generate and optimize.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(request.aiOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {getAIOptionDescription(key)}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateAIOptions(key as keyof AIGenerationRequest['aiOptions'], checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={simulateAIGeneration}
              disabled={!canGenerate || isGenerating}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Listing
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 animate-pulse" />
                AI Generation in Progress
              </CardTitle>
              <CardDescription>
                Our AI is analyzing market data and creating your optimized listing...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generationSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                        step.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        step.status === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
                        'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {step.status === 'completed' ? (
                          <UIIcons.CheckCircle className="w-4 h-4 text-green-600" />
                        ) : step.status === 'processing' ? (
                          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                        ) : step.status === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {step.status === 'completed' ? '100%' : 
                       step.status === 'processing' ? `${step.progress}%` : '0%'}
                    </div>
                  </div>
                  {step.status === 'processing' && (
                    <Progress value={step.progress} className="w-full" />
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-6">
          {generationResult && (
            <GeneratedListingResult 
              result={generationResult}
              originalRequest={request}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get AI option descriptions
function getAIOptionDescription(key: string): string {
  const descriptions = {
    generateTitle: 'Create an SEO-optimized, compelling title',
    generateDescription: 'Write a, detailed, professional description',
    generateTags: 'Generate relevant tags and keywords',
    generatePricing: 'Suggest competitive pricing based on market data',
    optimizeForSEO: 'Optimize content for search engine visibility',
    marketAnalysis: 'Include local market insights and trends'
  };
  return descriptions[key as keyof typeof descriptions] || '';
}

// Generated Listing Result Component
function GeneratedListingResult({ 
  result, 
  originalRequest 
}: { 
  result: AIGenerationResult;
  originalRequest: AIGenerationRequest;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UIIcons.CheckCircle className="w-5 h-5 text-green-600" />
            Generated Listing Preview
          </CardTitle>
          <CardDescription>
            Review your AI-generated listing and make any adjustments before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">TITLE</Label>
            <h3 className="text-xl font-semibold mt-1">{result.title}</h3>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium text-muted-foreground">DESCRIPTION</Label>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {result.description}
            </p>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium text-muted-foreground">TAGS & KEYWORDS</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">CATEGORY</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">{result.category.icon}</span>
                <span className="font-medium">{result.category.name}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">PRICING</Label>
              <div className="flex items-center gap-2 mt-1">
                <BusinessIcons.DollarSign className="w-4 h-4" />
                <span className="font-medium">
                  ${result.pricing.basePrice} {result.pricing.type === 'hourly' ? '/hour' : ''}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">${result.marketInsights.competitorPricing.average}</div>
              <div className="text-sm text-muted-foreground">Average Market Price</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold capitalize">{result.marketInsights.demandLevel}</div>
              <div className="text-sm text-muted-foreground">Demand Level</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{result.optimizations.length}</div>
              <div className="text-sm text-muted-foreground">AI Optimizations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.optimizations.map((optimization, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge 
                  variant={optimization.impact === 'high' ? 'default' : optimization.impact === 'medium' ? 'secondary' : 'outline'}
                  className="mt-0.5"
                >
                  {optimization.impact} impact
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{optimization.suggestion}</p>
                  <p className="text-xs text-muted-foreground mt-1">{optimization.implementation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Publish Listing
          </Button>
        </div>
      </div>
    </div>
  );
}

// Mock AI generation functions (in, production, these would call actual AI APIs)
function generateAITitle(request: AIGenerationRequest): string {
  const serviceType = request.serviceType;
  const location = request.location;
  return `Professional ${serviceType} Services in ${location} - Trusted & Reliable`;
}

function generateAIDescription(request: AIGenerationRequest): string {
  return `Looking for top-quality ${request.serviceType.toLowerCase()} services in ${request.location}? ${request.briefDescription} Our experienced team specializes in ${request.targetAudience ? `serving ${request.targetAudience.toLowerCase()}` : 'providing exceptional service'} with attention to detail and customer satisfaction. ${request.specialFeatures?.length ? `Special features include: ${request.specialFeatures.join(', ')}.` : ''} Book now for, reliable, professional service you can trust.`;
}

function generateAITags(request: AIGenerationRequest): string[] {
  const baseTag = request.serviceType.toLowerCase().replace(/\s+/g, '-');
  const locationTag = request.location.toLowerCase().replace(/\s+/g, '-');
  return [
    baseTag,
    `${baseTag}-${locationTag}`,
    'professional-service',
    'trusted-provider',
    'local-business',
    'quality-service',
    ...(request.specialFeatures || [])
  ];
}

function generateAIPricing(request: AIGenerationRequest): ServicePricing {
  return {
    type: 'hourly',
    basePrice: 75,
    currency: 'USD',
    aiOptimized: true,
    dynamicPricing: false
  };
}

function generateAICategory(request: AIGenerationRequest): ServiceCategory {
  return {
    id: 'general-services',
    name: 'General Services',
    slug: 'general-services',
    icon: '🔧',
    aiKeywords: ['service', 'professional', 'local'],
    tenantSpecific: false
  };
}

function generateMarketInsights(request: AIGenerationRequest): MarketInsights {
  return {
    competitorPricing: {
      min: 50,
      max: 120,
      average: 85
    },
    demandLevel: 'high',
    seasonality: [
      {
        season: 'Spring',
        demandMultiplier: 1.2,
        description: 'Higher demand during spring cleaning season'
      }
    ],
    suggestedKeywords: ['professional', 'reliable', 'experienced', 'local'],
    localTrends: [
      {
        trend: 'Eco-friendly services',
        impact: 'positive',
        description: 'Growing demand for environmentally conscious options'
      }
    ]
  };
}

function generateOptimizations(request: AIGenerationRequest): AIOptimization[] {
  return [
    {
      type: 'pricing',
      suggestion: 'Consider offering package deals for repeat customers',
      impact: 'medium',
      implementation: 'Add tiered pricing options with discounts for multiple bookings'
    },
    {
      type: 'content',
      suggestion: 'Highlight eco-friendly practices in your description',
      impact: 'high',
      implementation: 'Add a section about sustainable methods and green products'
    },
    {
      type: 'timing',
      suggestion: 'Promote spring specials during seasonal demand peak',
      impact: 'medium',
      implementation: 'Create limited-time offers for March-May period'
    }
  ];
}

export default AIListingGenerator;
