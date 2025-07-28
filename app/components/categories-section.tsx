"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  Home,
  Wrench,
  Car,
  GraduationCap,
  Heart,
  Camera,
  Scissors,
  Paintbrush,
  ArrowRight,
  Sparkles,
  Star,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Users,
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  MapPin,
  Award,
  CheckCircle
} from "lucide-react";

const categories = [
  {
    icon: Home,
    name: "Home Services",
    shortName: "Home",
    count: "2,400+",
    rating: 4.9,
    trending: true,
    description: "Premium home cleaning, maintenance & repairs",
    subcategories: ["Cleaning", "Plumbing", "Electrical", "HVAC"],
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    lightGradient: "from-emerald-400 via-teal-400 to-cyan-400",
    bgGradient: "from-emerald-50 via-teal-50 to-cyan-50",
    darkBgGradient: "from-emerald-950/30 via-teal-950/30 to-cyan-950/30",
    features: ["Verified Professionals", "Same-day Service", "Quality Guarantee"],
    popularity: 95,
    color: "emerald"
  },
  {
    icon: Wrench,
    name: "Professional Work",
    shortName: "Professional",
    count: "1,800+",
    rating: 4.8,
    trending: true,
    description: "Expert handyman, electrical & plumbing services",
    subcategories: ["Handyman", "Electrical", "Plumbing", "Construction"],
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    lightGradient: "from-blue-400 via-indigo-400 to-purple-400",
    bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
    darkBgGradient: "from-blue-950/30 via-indigo-950/30 to-purple-950/30",
    features: ["Licensed Experts", "Emergency Available", "Fixed Pricing"],
    popularity: 88,
    color: "blue"
  },
  {
    icon: Car,
    name: "Auto & Transport",
    shortName: "Auto",
    count: "1,200+",
    rating: 4.7,
    trending: false,
    description: "Car wash, repairs & delivery services",
    subcategories: ["Car Wash", "Repairs", "Delivery", "Maintenance"],
    gradient: "from-orange-500 via-red-500 to-pink-500",
    lightGradient: "from-orange-400 via-red-400 to-pink-400",
    bgGradient: "from-orange-50 via-red-50 to-pink-50",
    darkBgGradient: "from-orange-950/30 via-red-950/30 to-pink-950/30",
    features: ["Mobile Service", "Real-time Tracking", "Warranty Included"],
    popularity: 82,
    color: "orange"
  },
  {
    icon: GraduationCap,
    name: "Education",
    shortName: "Education",
    count: "900+",
    rating: 4.9,
    trending: true,
    description: "Expert tutoring, coaching & training",
    subcategories: ["Tutoring", "Music", "Languages", "Skills"],
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    lightGradient: "from-violet-400 via-purple-400 to-fuchsia-400",
    bgGradient: "from-violet-50 via-purple-50 to-fuchsia-50",
    darkBgGradient: "from-violet-950/30 via-purple-950/30 to-fuchsia-950/30",
    features: ["Certified Teachers", "Flexible Schedule", "Progress Tracking"],
    popularity: 90,
    color: "violet"
  },
  {
    icon: Heart,
    name: "Health & Wellness",
    shortName: "Health",
    count: "750+",
    rating: 4.8,
    trending: true,
    description: "Fitness, therapy & nutrition experts",
    subcategories: ["Fitness", "Therapy", "Nutrition", "Wellness"],
    gradient: "from-rose-500 via-pink-500 to-red-500",
    lightGradient: "from-rose-400 via-pink-400 to-red-400",
    bgGradient: "from-rose-50 via-pink-50 to-red-50",
    darkBgGradient: "from-rose-950/30 via-pink-950/30 to-red-950/30",
    features: ["Health Certified", "Personalized Plans", "Holistic Approach"],
    popularity: 85,
    color: "rose"
  },
  {
    icon: Camera,
    name: "Creative Services",
    shortName: "Creative",
    count: "650+",
    rating: 4.9,
    trending: false,
    description: "Photography, design & event services",
    subcategories: ["Photography", "Design", "Events", "Video"],
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    lightGradient: "from-cyan-400 via-sky-400 to-blue-400",
    bgGradient: "from-cyan-50 via-sky-50 to-blue-50",
    darkBgGradient: "from-cyan-950/30 via-sky-950/30 to-blue-950/30",
    features: ["Portfolio Verified", "Creative Excellence", "Custom Solutions"],
    popularity: 78,
    color: "cyan"
  },
  {
    icon: Scissors,
    name: "Beauty & Personal",
    shortName: "Beauty",
    count: "550+",
    rating: 4.8,
    trending: true,
    description: "Hair, makeup & spa services",
    subcategories: ["Hair", "Makeup", "Spa", "Nails"],
    gradient: "from-amber-500 via-yellow-500 to-lime-500",
    lightGradient: "from-amber-400 via-yellow-400 to-lime-400",
    bgGradient: "from-amber-50 via-yellow-50 to-lime-50",
    darkBgGradient: "from-amber-950/30 via-yellow-950/30 to-lime-950/30",
    features: ["Licensed Stylists", "Premium Products", "Relaxing Experience"],
    popularity: 80,
    color: "amber"
  },
  {
    icon: Paintbrush,
    name: "Art & Design",
    shortName: "Art",
    count: "450+",
    rating: 4.7,
    trending: false,
    description: "Interior design, art & crafts",
    subcategories: ["Interior", "Art", "Crafts", "Decor"],
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    lightGradient: "from-green-400 via-emerald-400 to-teal-400",
    bgGradient: "from-green-50 via-emerald-50 to-teal-50",
    darkBgGradient: "from-green-950/30 via-emerald-950/30 to-teal-950/30",
    features: ["Design Expertise", "Custom Creations", "Artistic Vision"],
    popularity: 75,
    color: "green"
  }
];

type ViewMode = 'grid' | 'list';

export function CategoriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const CategoryCard = ({ category, index }: { category: typeof categories[0], index: number }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: viewMode === 'grid' ? -8 : -2,
        transition: { duration: 0.2 }
      }}
      className={`
        group relative overflow-hidden rounded-2xl cursor-pointer glass-ultra border border-glass-border-strong
        ${viewMode === 'grid' ? 'aspect-[4/5]' : 'aspect-auto h-32 flex'}
        ${selectedCategory === index ? 'ring-2 ring-ai-500/50 ring-offset-2 ring-offset-background shadow-glow-ai' : ''}
        shadow-glass-sm hover:shadow-glass-lg neural-card interactive-lift transition-all duration-300
      `}
      onHoverStart={() => setHoveredIndex(index)}
      onHoverEnd={() => setHoveredIndex(null)}
      onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.darkBgGradient} dark:opacity-60 opacity-0 transition-opacity duration-300`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} dark:opacity-0 opacity-40 transition-opacity duration-300`} />
      
      {/* Icon Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-5 dark:opacity-10">
          <category.icon className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className={`relative z-10 p-4 h-full flex ${viewMode === 'grid' ? 'flex-col justify-between' : 'items-center gap-4'}`}>
        {/* Header */}
        <div className={`flex items-start justify-between ${viewMode === 'list' ? 'flex-1 w-48' : ''}`}>
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                inline-flex items-center justify-center rounded-xl neural-raised shadow-glow-ai
                ${viewMode === 'grid' ? 'w-12 h-12' : 'w-10 h-10'}
                bg-gradient-to-br ${category.lightGradient} hover:shadow-glow-lg transition-all duration-300
              `}
            >
              <category.icon className={`text-white ${viewMode === 'grid' ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </motion.div>

            {/* Category Info */}
            <div className={viewMode === 'list' ? 'flex-1' : ''}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-bold text-white ${viewMode === 'grid' ? 'text-lg' : 'text-base'}`}>
                  {viewMode === 'grid' ? category.name : category.shortName}
                </h3>
                {category.trending && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30 text-xs px-2 py-0.5">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Hot
                  </Badge>
                )}
              </div>
              
              {/* Rating & Count */}
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{category.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{category.count}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popularity Indicator (Grid Only) */}
          {viewMode === 'grid' && (
            <div className="text-right">
              <div className="text-xs text-gray-300 mb-1">Popular</div>
              <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.popularity}%` }}
                  transition={{ duration: 1.2, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full"
                />
              </div>
              <div className="text-xs text-gray-300 mt-1">{category.popularity}%</div>
            </div>
          )}
        </div>

        {/* Description & Features (Grid Only) */}
        {viewMode === 'grid' && (
          <>
            <div className="space-y-3 flex-1">
              <p className="text-sm text-gray-200 leading-relaxed line-clamp-2">
                {category.description}
              </p>
              
              {/* Subcategories */}
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                  <span
                    key={subIndex}
                    className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm text-white/90 rounded-lg border border-white/20"
                  >
                    {sub}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm text-white/90 rounded-lg border border-white/20">
                    +{category.subcategories.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {category.features.slice(0, 2).map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* List View Content */}
        {viewMode === 'list' && (
          <div className="flex-1 flex items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <p className="text-sm text-gray-200 line-clamp-1">{category.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                {category.features.slice(0, 2).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-white">{category.popularity}%</div>
              <div className="text-xs text-gray-300">Popular</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center justify-between gap-2 p-3 
            bg-white/10 backdrop-blur-sm rounded-xl border border-white/20
            hover:bg-white/20 transition-all duration-200
            ${viewMode === 'list' ? 'ml-4 w-32' : ''}
          `}
        >
          <span className="text-sm font-medium text-white">
            {viewMode === 'grid' ? 'Explore' : 'View'}
          </span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </motion.div>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
        />
      </div>

      {/* Selection Indicator */}
      <AnimatePresence>
        {selectedCategory === index && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-20"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <section className="relative py-24 overflow-hidden theme-ai glass-subtle">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-violet-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full border border-blue-500/20 dark:border-blue-400/30 mb-6">
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Elite Service Categories</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Discover Premium
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Service Categories
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Access world-class service providers across diverse categories, all verified and vetted for excellence. 
            Find the perfect match for your needs with our intelligent categorization system.
          </p>
        </motion.div>

        {/* Search & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search elite categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-strong neural-input focus:shadow-glow-ai focus:border-ai-400 dark:focus:border-ai-500 transition-all duration-200"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{categories.length} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>8,750+ Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Verified Quality</span>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid/List */}
        <motion.div
          ref={containerRef}
          layout
          className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or browse all categories
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              asChild 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/browse" className="flex items-center gap-2">
                Explore All Categories
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Link href="/become-provider" className="flex items-center gap-2">
                Become a Provider
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Join 50,000+ satisfied customers who trust Loconomy for their service needs
          </p>
        </motion.div>
      </div>
    </section>
  );
}
