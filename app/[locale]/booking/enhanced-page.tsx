"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  MapPin,
  Filter,
  SortAsc,
  Heart,
  Eye,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Globe,
  MessageSquare,
  PhoneCall,
  Video,
  Camera,
  Settings,
  Bookmark
} from "lucide-react";

interface Service {
  id: number;
  title: string;
  provider: string;
  rating: number;
  reviews: number;
  price: string;
  duration: string;
  category: string;
  image: string;
  description: string;
  location: string;
  available: boolean;
  featured: boolean;
  verified: boolean;
  instantBooking: boolean;
  tags: string[];
  provider_info: {
    avatar: string;
    experience: string;
    languages: string[];
    response_time: string;
  };
}

export default function EnhancedBookingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteServices, setFavoriteServices] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push(`/${locale}/auth/signin`);
    }
  }, [isLoading, isSignedIn, router, locale]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-2xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Calendar className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Loading Premium Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Finding the perfect professionals for you</p>
        </motion.div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  // Enhanced mock data
  const categories = [
    { id: "all", name: "All Services", count: 247, icon: "🏠" },
    { id: "cleaning", name: "House Cleaning", count: 67, icon: "🧹" },
    { id: "plumbing", name: "Plumbing", count: 43, icon: "🔧" },
    { id: "electrical", name: "Electrical", count: 38, icon: "⚡" },
    { id: "gardening", name: "Gardening", count: 34, icon: "🌱" },
    { id: "beauty", name: "Beauty & Wellness", count: 29, icon: "💆‍♀️" },
    { id: "tech", name: "Tech Support", count: 23, icon: "💻" },
    { id: "fitness", name: "Personal Training", count: 13, icon: "🏋️‍♂️" }
  ];

  const featuredServices: Service[] = [
    {
      id: 1,
      title: "Premium House Deep Cleaning",
      provider: "Elite Cleaning Services",
      rating: 4.9,
      reviews: 234,
      price: "$120-180",
      duration: "3-4 hours",
      category: "cleaning",
      image: "🏠",
      description: "Comprehensive deep cleaning service with eco-friendly products and 100% satisfaction guarantee",
      location: "Downtown & Suburbs",
      available: true,
      featured: true,
      verified: true,
      instantBooking: true,
      tags: ["Eco-friendly", "Same-day", "Insured"],
      provider_info: {
        avatar: "👩‍💼",
        experience: "8+ years",
        languages: ["English", "Spanish"],
        response_time: "< 1 hour"
      }
    },
    {
      id: 2,
      title: "Emergency Plumbing Repair 24/7",
      provider: "RapidFix Plumbing",
      rating: 4.8,
      reviews: 312,
      price: "$150-300",
      duration: "1-3 hours",
      category: "plumbing",
      image: "🚰",
      description: "24/7 emergency plumbing services with licensed professionals and upfront pricing",
      location: "City Wide Coverage",
      available: true,
      featured: true,
      verified: true,
      instantBooking: true,
      tags: ["24/7 Service", "Licensed", "Emergency"],
      provider_info: {
        avatar: "👨‍🔧",
        experience: "12+ years",
        languages: ["English"],
        response_time: "< 30 min"
      }
    },
    {
      id: 3,
      title: "Garden Design & Landscaping",
      provider: "GreenThumb Landscapes",
      rating: 5.0,
      reviews: 156,
      price: "$200-500",
      duration: "4-8 hours",
      category: "gardening",
      image: "🌿",
      description: "Professional garden design and landscaping with sustainable practices and plant warranties",
      location: "Residential Areas",
      available: true,
      featured: true,
      verified: true,
      instantBooking: false,
      tags: ["Design Consultation", "Sustainable", "Warranty"],
      provider_info: {
        avatar: "👨‍🌾",
        experience: "15+ years",
        languages: ["English", "French"],
        response_time: "< 2 hours"
      }
    },
    {
      id: 4,
      title: "Smart Home Electrical Setup",
      provider: "TechWire Electrical",
      rating: 4.7,
      reviews: 189,
      price: "$100-250",
      duration: "2-4 hours",
      category: "electrical",
      image: "🏡",
      description: "Modern electrical installations including smart home automation and energy-efficient solutions",
      location: "Metropolitan Area",
      available: true,
      featured: false,
      verified: true,
      instantBooking: true,
      tags: ["Smart Home", "Energy Efficient", "Certified"],
      provider_info: {
        avatar: "⚡",
        experience: "10+ years",
        languages: ["English"],
        response_time: "< 1 hour"
      }
    },
    {
      id: 5,
      title: "Mobile Spa & Wellness",
      provider: "Serenity Mobile Spa",
      rating: 4.9,
      reviews: 278,
      price: "$180-350",
      duration: "2-5 hours",
      category: "beauty",
      image: "🧖‍♀️",
      description: "Luxury spa treatments in the comfort of your home with certified wellness professionals",
      location: "Premium Locations",
      available: true,
      featured: true,
      verified: true,
      instantBooking: false,
      tags: ["Luxury", "Certified", "Mobile"],
      provider_info: {
        avatar: "🌸",
        experience: "6+ years",
        languages: ["English", "Italian"],
        response_time: "< 3 hours"
      }
    },
    {
      id: 6,
      title: "IT Support & Computer Repair",
      provider: "TechSavvy Solutions",
      rating: 4.6,
      reviews: 145,
      price: "$80-160",
      duration: "1-2 hours",
      category: "tech",
      image: "💻",
      description: "Expert computer repair and IT support for home and small business needs",
      location: "Service Area Wide",
      available: false,
      featured: false,
      verified: true,
      instantBooking: true,
      tags: ["Remote Support", "Data Recovery", "Business"],
      provider_info: {
        avatar: "👨‍💻",
        experience: "7+ years",
        languages: ["English"],
        response_time: "< 45 min"
      }
    }
  ];

  const filteredServices = featuredServices.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (serviceId: number) => {
    router.push(`/${locale}/booking/${serviceId}`);
  };

  const toggleFavorite = (serviceId: number) => {
    setFavoriteServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-ai/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-float-delayed"></div>

      <div className="relative container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 bg-glass border border-glass-border backdrop-blur-glass rounded-full px-6 py-3 mb-6 shadow-glass"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-premium" />
              <span className="text-sm font-medium text-foreground">
                Premium Service Marketplace
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-ai-gradient mb-6">
              Book Elite Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with verified professionals for all your service needs. Quality guaranteed, 
              satisfaction promised, excellence delivered.
            </p>
          </div>

          {/* Enhanced Search */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  placeholder="Search services, providers, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg glass-subtle border-white/40 focus:border-blue-400 rounded-2xl"
                />
                <motion.div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge variant="secondary" className="glass-subtle">
                    AI-Powered
                  </Badge>
                </motion.div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="px-6 py-4 glass-subtle border-white/40 hover:border-purple-300/50">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" className="px-6 py-4 glass-subtle border-white/40 hover:border-blue-300/50">
                  <SortAsc className="w-5 h-5 mr-2" />
                  Sort
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-4 py-4 glass-subtle border-white/40"
                >
                  {viewMode === 'grid' ? '☰' : '⊞'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Service Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'glass-subtle border border-white/40 hover:border-blue-300/50 hover:scale-105'
                }`}
                whileHover={{ scale: selectedCategory === category.id ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <Badge 
                  variant="secondary" 
                  className={selectedCategory === category.id ? 'bg-white/20 text-white' : ''}
                >
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Service Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategory === "all" ? "Featured Services" : `${categories.find(c => c.id === selectedCategory)?.name} Services`}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredServices.length} premium service{filteredServices.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="glass-subtle border-green-200/50 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Verified
              </Badge>
              <Badge className="glass-subtle border-blue-200/50 text-blue-700">
                <Shield className="w-3 h-3 mr-1" />
                Insured
              </Badge>
            </div>
          </div>

          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  layout
                >
                  <Card className={`glass-ultra border-white/40 hover:border-blue-300/50 transition-all duration-300 overflow-hidden group ${
                    service.featured ? 'ring-2 ring-blue-500/20' : ''
                  }`}>
                    {/* Service Header */}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="text-4xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {service.image}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {service.featured && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {service.verified && (
                                <Badge variant="outline" className="border-green-200 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{service.provider}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleFavorite(service.id)}
                            className={`glass-subtle border-white/40 transition-colors ${
                              favoriteServices.includes(service.id) ? 'text-red-500 border-red-200' : ''
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${favoriteServices.includes(service.id) ? 'fill-red-500' : ''}`} />
                          </Button>
                          <Button size="sm" variant="outline" className="glass-subtle border-white/40">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="leading-relaxed">
                        {service.description}
                      </CardDescription>

                      {/* Provider Info */}
                      <div className="flex items-center gap-3 p-3 glass-subtle rounded-xl border border-white/40">
                        <div className="text-2xl">{service.provider_info.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{service.provider_info.experience} experience</span>
                            <span>•</span>
                            <span className="text-gray-600">{service.provider_info.response_time} response</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {service.provider_info.languages.map(lang => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(service.rating)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="font-semibold ml-1">{service.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({service.reviews} reviews)
                          </span>
                        </div>
                        
                        {service.instantBooking && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <Zap className="w-3 h-3 mr-1" />
                            Instant
                          </Badge>
                        )}
                      </div>

                      {/* Service Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs glass-subtle border-white/40">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Price and Availability */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-xl font-bold text-green-600">{service.price}</span>
                        </div>
                        {service.available ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Available Today
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Fully Booked
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          onClick={() => handleBookService(service.id)}
                          disabled={!service.available}
                        >
                          {service.available ? "Book Now" : "Join Waitlist"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="outline" size="sm" className="glass-subtle border-white/40">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="glass-subtle border-white/40">
                          <PhoneCall className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 glass-ultra rounded-3xl flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No services found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or explore different categories to find the perfect service
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSearchQuery("")} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Clear Search
                </Button>
                <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                  View All Categories
                </Button>
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          {filteredServices.length > 0 && (
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="max-w-3xl mx-auto glass-ultra border-white/40">
                <CardContent className="p-10">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                    Request a custom service and we'll connect you with the perfect professional 
                    within 24 hours. No service is too unique for our network.
                  </p>
                  <Button 
                    onClick={() => router.push(`/${locale}/request-service`)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Request Custom Service
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
