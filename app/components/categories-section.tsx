"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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
  ChevronRight
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
    bgGradient: "from-emerald-50 to-teal-50",
    darkBgGradient: "from-emerald-950/50 to-teal-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fb2459d5036794deb84d52bf82ca745cd?alt=media&token=4fdbb222-3123-42c6-841c-0c811ce9f2d7&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Verified Professionals", "Same-day Service", "Quality Guarantee"],
    popularity: 95
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
    bgGradient: "from-blue-50 to-indigo-50",
    darkBgGradient: "from-blue-950/50 to-indigo-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fc84ae154ac94479691e1046893001a2d?alt=media&token=c7099c88-9280-4da7-b35c-b5f58763194c&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Licensed Experts", "Emergency Available", "Fixed Pricing"],
    popularity: 88
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
    bgGradient: "from-orange-50 to-red-50",
    darkBgGradient: "from-orange-950/50 to-red-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F6a812cf3fada40e8a56166bfb07c5a39?alt=media&token=d77ca34f-c367-436a-90ed-34fa2898ae6f&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Mobile Service", "Real-time Tracking", "Warranty Included"],
    popularity: 82
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
    bgGradient: "from-violet-50 to-purple-50",
    darkBgGradient: "from-violet-950/50 to-purple-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F2d1b9717651f4661982da5e0f4f11d8c?alt=media&token=018784fd-f15a-4fd5-b3d0-39354815b3cb&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Certified Teachers", "Flexible Schedule", "Progress Tracking"],
    popularity: 90
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
    bgGradient: "from-rose-50 to-pink-50",
    darkBgGradient: "from-rose-950/50 to-pink-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Faa64b10a73474c169cc7fb3fc239e3db?alt=media&token=f032bf2e-d00d-4795-9e44-7fd13eee8daa&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Health Certified", "Personalized Plans", "Holistic Approach"],
    popularity: 85
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
    bgGradient: "from-cyan-50 to-sky-50",
    darkBgGradient: "from-cyan-950/50 to-sky-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F6933a12df7534198b49b37c4cae71b5c?alt=media&token=13404641-8e22-40b1-9db5-c9e80c311472&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Portfolio Verified", "Creative Excellence", "Custom Solutions"],
    popularity: 78
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
    bgGradient: "from-amber-50 to-yellow-50",
    darkBgGradient: "from-amber-950/50 to-yellow-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fee83a8904a0d4a6d97fa663f79580e9d?alt=media&token=ce032fe6-8214-4b5b-8b63-c2ccf20d9501&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Licensed Stylists", "Premium Products", "Relaxing Experience"],
    popularity: 80
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
    bgGradient: "from-green-50 to-emerald-50",
    darkBgGradient: "from-green-950/50 to-emerald-950/50",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F44e95d003c2e440d8442038d194fd292?alt=media&token=7d8f7b65-9156-4b58-92e4-be0233254eba&apiKey=efd5169b47d04c9886e111b6074edfba",
    features: ["Design Expertise", "Custom Creations", "Artistic Vision"],
    popularity: 75
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
        y: -8,
        transition: { duration: 0.2 }
      }}
      className={`
        group relative overflow-hidden rounded-2xl cursor-pointer
        ${viewMode === 'grid' ? 'aspect-[4/5]' : 'aspect-[3/1] flex'}
        ${selectedCategory === index ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
      `}
      onHoverStart={() => setHoveredIndex(index)}
      onHoverEnd={() => setHoveredIndex(null)}
      onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.darkBgGradient} dark:opacity-100 opacity-0 transition-opacity duration-300`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} dark:opacity-0 opacity-100 transition-opacity duration-300`} />
      
      {/* Image Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          style={{
            filter: 'brightness(0.7) saturate(1.2)',
            opacity: hoveredIndex === index ? 0.9 : 0.6
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className={`relative z-10 p-6 h-full flex ${viewMode === 'grid' ? 'flex-col justify-between' : 'items-center gap-6'}`}>
        {/* Header */}
        <div className={`flex items-start justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`
                inline-flex items-center justify-center rounded-xl shadow-lg
                ${viewMode === 'grid' ? 'w-12 h-12' : 'w-10 h-10'}
                bg-gradient-to-br ${category.gradient}
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
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
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
                  <span>{category.count} providers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popularity Bar */}
          {viewMode === 'grid' && (
            <div className="text-right">
              <div className="text-xs text-gray-300 mb-1">Popularity</div>
              <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.popularity}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-white to-gray-200 rounded-full"
                />
              </div>
              <div className="text-xs text-gray-300 mt-1">{category.popularity}%</div>
            </div>
          )}
        </div>

        {/* Description & Features */}
        {viewMode === 'grid' && (
          <>
            <div className="space-y-3">
              <p className="text-sm text-gray-200 leading-relaxed">
                {category.description}
              </p>
              
              {/* Subcategories */}
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                  <span
                    key={subIndex}
                    className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20"
                  >
                    {sub}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20">
                    +{category.subcategories.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {category.features.slice(0, 2).map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2 text-xs text-gray-300">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* List View Content */}
        {viewMode === 'list' && (
          <div className="flex-1 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-200">{category.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                {category.features.slice(0, 2).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-white">{category.popularity}% Popular</div>
              <div className="text-xs text-gray-300">{category.count} providers</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center justify-between gap-2 p-3 
            bg-white/10 backdrop-blur-sm rounded-xl border border-white/20
            hover:bg-white/20 transition-all duration-200
            ${viewMode === 'list' ? 'ml-4' : ''}
          `}
        >
          <span className="text-sm font-medium text-white">
            {viewMode === 'grid' ? 'Explore Services' : 'View'}
          </span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </motion.div>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
        />
      </div>

      {/* Selection Indicator */}
      <AnimatePresence>
        {selectedCategory === index && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-blue-500" />
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1">
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
              className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
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
