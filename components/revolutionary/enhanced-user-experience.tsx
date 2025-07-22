"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Sparkles,
  Target, 
  Award, Brain,
  Heart,
  Eye,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Accessibility,
  Search,
  Filter,
  ArrowRight
  CheckCircle
  MapPin
  Phone,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { advancedAIEngine } from '@/lib/ai/advanced-intelligence-engine';
import { ultraOptimizationEngine } from '@/lib/performance/ultra-optimization-engine';

// Enhanced types for revolutionary UX
interface SmartServiceCard {
  id: string;
  title: string;
  provider: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  availability: 'immediate' | 'today' | 'this-week' | 'custom';
  distance: number;
  tags: string[];
  aiScore: number;
  personalizedReason: string;
}

interface VoiceInteraction {
  isListening: boolean;
  transcript: string;
  confidence: number;
  intent: string;
}

interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  voiceNavigation: boolean;
  screenReader: boolean;
}

// Revolutionary Smart Search Component
export const SmartSearchExperience: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [voiceSearch, setVoiceSearch] = useState<VoiceInteraction>({
    isListening: false,
    transcript: '',
    confidence: 0,
    intent: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Voice search functionality
  const toggleVoiceSearch = useCallback(() => {
    if (!voiceSearch.isListening) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  }, [voiceSearch.isListening]);

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceSearch(prev => ({ ...prev, isListening: true }));
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setVoiceSearch(prev => ({
          ...prev,
          transcript,
          confidence: event.results[event.results.length - 1][0].confidence
        }));
        
        setQuery(transcript);
      };

      recognition.onerror = () => {
        setVoiceSearch(prev => ({ ...prev, isListening: false }));
      };

      recognition.start();
    }
  };

  const stopVoiceRecognition = () => {
    setVoiceSearch(prev => ({ ...prev, isListening: false }));
  };

  // AI-powered search suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          // In a real implementation, this would call the AI engine
          const mockSuggestions = [
            'Premium home cleaning services near me',
            'Elite personal trainers with 5-star ratings',
            'Luxury car detailing today',
            'Professional massage therapy available now'
          ];
          setSuggestions(mockSuggestions);
        } catch (error) {
          console.error('Search suggestions error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What service are you looking for? Try voice search..."
            className="pl-12 pr-16 py-4 text-lg rounded-2xl border-2 focus:border-violet-500 transition-all duration-300"
            onFocus={() => {
              ultraOptimizationEngine.predictivePreload('search_input_focus', {
                userEngagement: 0.9,
                isReturningUser: true
              });
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoiceSearch}
            className={`absolute right-2 p-2 rounded-xl transition-all duration-300 ${
              voiceSearch.isListening 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'hover:bg-gray-100'
            }`}
          >
            {voiceSearch.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
        </div>

        {/* Voice feedback */}
        <AnimatePresence>
          {voiceSearch.isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-red-50 rounded-xl border border-red-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-red-600 font-medium">Listening...</span>
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-6 bg-red-400 rounded-full"
                      animate={{
                        height: [6, 24, 6],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
              {voiceSearch.transcript && (
                <p className="text-gray-600 mt-2">{voiceSearch.transcript}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI-powered suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setQuery(suggestion)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{suggestion}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Intelligent Service Discovery Grid
export const IntelligentServiceGrid: React.FC<{
  services: SmartServiceCard[];
  onServiceSelect: (service: SmartServiceCard) => void;
}> = ({ services, onServiceSelect }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleCardHover = useCallback((serviceId: string) => {
    setHoveredCard(serviceId);
    // Trigger predictive loading
    ultraOptimizationEngine.predictivePreload('hover_service_card', {
      serviceId,
      userEngagement: 0.8
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* View controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-violet-100 text-violet-700">
            <Brain className="w-4 h-4 mr-1" />
            AI-Curated Results
          </Badge>
          <span className="text-sm text-gray-600">
            {services.length} premium services found
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Service grid */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {services.map((service, index) => (
          <EnhancedServiceCard
            key={service.id}
            service={service}
            index={index}
            isHovered={hoveredCard === service.id}
            onHover={() => handleCardHover(service.id)}
            onLeave={() => setHoveredCard(null)}
            onClick={() => onServiceSelect(service)}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Service Card with Micro-interactions
const EnhancedServiceCard: React.FC<{
  service: SmartServiceCard;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}> = ({ service, index, isHovered, onHover, onLeave, onClick, viewMode }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(mouseY, { stiffness: 400, damping: 40 });
  const rotateY = useSpring(mouseX, { stiffness: 400, damping: 40 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateXValue = (e.clientY - centerY) / 10;
    const rotateYValue = (e.clientX - centerX) / 10;
    
    mouseX.set(rotateYValue);
    mouseY.set(-rotateXValue);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    onLeave();
  }, [mouseX, mouseY, onLeave]);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
        onClick={onClick}
        onHoverStart={onHover}
        onHoverEnd={onLeave}
      >
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                AI {Math.round(service.aiScore * 100)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.provider}</p>
                <p className="text-sm text-violet-600 mt-1">{service.personalizedReason}</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${service.price}</div>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{service.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">({service.reviews})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0">
        {/* AI Score indicator */}
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
              <Brain className="w-3 h-3 mr-1" />
              AI {Math.round(service.aiScore * 100)}%
            </Badge>
          </motion.div>
        </div>

        {/* Image with overlay effects */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick action buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 flex space-x-2"
              >
                <Button size="sm" className="flex-1 bg-white/90 text-gray-900 hover:bg-white">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button size="sm" className="flex-1 bg-white/90 text-gray-900 hover:bg-white">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Service info */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-violet-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.provider}</p>
            </div>

            {/* Personalized insight */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="p-3 bg-violet-50 rounded-lg border border-violet-100"
            >
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-violet-700">{service.personalizedReason}</p>
              </div>
            </motion.div>

            {/* Metrics */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{service.rating}</span>
                <span className="text-gray-500">({service.reviews})</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{service.distance}mi</span>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Available {service.availability}
                </span>
              </div>
              
              <div className="text-2xl font-bold text-gray-900">
                ${service.price}
              </div>
            </div>

            {/* Action button */}
            <Button 
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Book Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Accessibility-First Interface Controls
export const AccessibilityControls: React.FC = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    voiceNavigation: false,
    screenReader: false
  });

  const [isOpen, setIsOpen] = useState(false);

  const updatePreference = (key: keyof AccessibilityPreferences) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      
      // Apply changes to DOM
      if (key === 'highContrast') {
        document.documentElement.classList.toggle('high-contrast', updated.highContrast);
      } else if (key === 'largeText') {
        document.documentElement.classList.toggle('large-text', updated.largeText);
      } else if (key === 'reducedMotion') {
        document.documentElement.classList.toggle('reduced-motion', updated.reducedMotion);
      }
      
      return updated;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Accessibility button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-colors"
        aria-label="Accessibility Options"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Controls panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80"
          >
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Accessibility Options
            </h3>
            
            <div className="space-y-4">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <button
                    onClick={() => updatePreference(key as keyof AccessibilityPreferences)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                These settings enhance your experience and are saved locally.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Real-time Performance Dashboard
export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    score: 100,
    lcp: 0,
    fid: 0,
    cls: 0,
    cacheHitRate: 0.85
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      const report = ultraOptimizationEngine.getPerformanceReport();
      setMetrics({
        score: report.analysis.score,
        lcp: report.metrics.largestContentfulPaint,
        fid: report.metrics.firstInputDelay,
        cls: report.metrics.cumulativeLayoutShift,
        cacheHitRate: report.cacheStats.hitRate
      });
    };

    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 left-6 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-50"
        aria-label="Show Performance Dashboard"
      >
        <Zap className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 left-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Overall score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{metrics.score}</div>
          <div className="text-sm text-gray-600">Performance Score</div>
          <Progress value={metrics.score} className="mt-2" />
        </div>
        
        {/* Core Web Vitals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{Math.round(metrics.lcp)}ms</div>
            <div className="text-xs text-gray-600">LCP</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{Math.round(metrics.fid)}ms</div>
            <div className="text-xs text-gray-600">FID</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{metrics.cls.toFixed(3)}</div>
            <div className="text-xs text-gray-600">CLS</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{Math.round(metrics.cacheHitRate * 100)}%</div>
            <div className="text-xs text-gray-600">Cache Hit</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Export all components
export default {
  SmartSearchExperience,
  IntelligentServiceGrid,
  AccessibilityControls,
  PerformanceDashboard
};