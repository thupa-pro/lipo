"use client";

import { useState } from "react";
import Image from "next/image";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Play,
  ExternalLink,
  Star,
  Users,
  Heart,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Sparkles,
  Award,
  Shield,
  TrendingUp
} from "lucide-react";

// Original media assets (Series 1)
const originalAssets = {
  hero: [
    {
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      title: "Professional Service Excellence",
      description: "Premium quality service delivery",
      category: "Hero",
      series: 1
    },
    {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      title: "Elite Professional Network",
      description: "Connecting you with verified experts",
      category: "Hero",
      series: 1
    }
  ],
  services: [
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      title: "Quality Assurance",
      description: "5-star rated services",
      category: "Services",
      series: 1
    },
    {
      url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
      title: "Fast Response",
      description: "Under 30 minutes response time",
      category: "Services",
      series: 1
    },
    {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      title: "Home Services",
      description: "Professional home maintenance",
      category: "Services",
      series: 1
    },
    {
      url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
      title: "Technical Work",
      description: "Expert technical solutions",
      category: "Services",
      series: 1
    }
  ],
  providers: [
    {
      url: "https://images.unsplash.com/photo-1494790108755-2616b612b21c?w=150&h=150&fit=crop&crop=face",
      title: "Sarah Mitchell",
      description: "Premium House Cleaning Specialist",
      category: "Providers",
      series: 1
    },
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      title: "Marcus Rodriguez",
      description: "Licensed Master Plumber",
      category: "Providers",
      series: 1
    },
    {
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      title: "Emma Thompson",
      description: "Certified Pet Care Specialist",
      category: "Providers",
      series: 1
    }
  ],
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      title: "Technical Excellence",
      description: "Precision and expertise",
      category: "Gallery",
      series: 1
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F078b2224baae4dbda0602f97374e7368?alt=media&token=794fe7a5-33fd-4a1b-9837-12a71370128c&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Care & Attention",
      description: "Detail-oriented service",
      category: "Gallery",
      series: 1
    }
  ]
};

// New media assets (Series 2) - Enhanced with professional categorization
const newMediaAssets = {
  hero: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F62f2ed47e345487a9c84004d484f2578?alt=media&token=25f2fd33-6b78-47d7-8391-f2c51ed72df8&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Next-Gen Service Platform",
      description: "Revolutionary AI-powered matching",
      category: "Hero",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Ff2b7a918d1c34687a447612c8c1443b4?alt=media&token=773ba395-15fd-4e67-8e89-9e349cf2fd7a&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Premium Experience",
      description: "Luxury service standards",
      category: "Hero",
      series: 2
    }
  ],
  services: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F72a2948a44714670986c189cb968e3f8?alt=media&token=a2c5e895-5704-4d6a-b707-19d7146bdfbc&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Advanced Technology Services",
      description: "Cutting-edge solutions",
      category: "Services",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F4f06fb5025894aedbccbd66d70680729?alt=media&token=f8b3787f-b405-421a-b91b-cef59461ca20&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Specialized Expertise",
      description: "Domain-specific excellence",
      category: "Services",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F263500866b0d47ffa0800929496a3299?alt=media&token=8c7896a0-2212-40eb-a3e5-a3c4b82965cc&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Premium Installations",
      description: "High-end setup services",
      category: "Services",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F39067fd145574d73a22b2a1782cb82a7?alt=media&token=4103663f-9618-4cb2-971f-3d3936c5525d&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Comprehensive Solutions",
      description: "End-to-end service delivery",
      category: "Services",
      series: 2
    }
  ],
  providers: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fa738b4a6dcb84cf0ab5403c036edd0fa?alt=media&token=75ceb629-d1c7-45bc-a925-ad7dd9607f22&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Michael Chen",
      description: "Elite Technology Consultant",
      category: "Providers",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F176836cccfe44505b22a7c0166f9716b?alt=media&token=7e99e21a-99b3-40fa-844b-d53ac7d1e3bc&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Jessica Williams",
      description: "Premium Interior Designer",
      category: "Providers",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F82f2111f93874f36a1f87ff804f998f0?alt=media&token=e4b0aec7-dde3-41d9-94da-858f6570bdc3&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "David Park",
      description: "Master Automotive Specialist",
      category: "Providers",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F0aea14b5972949d6ba27ec52e20efa7f?alt=media&token=46c4cc60-6820-4bc3-896f-4e0382180249&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Ana Sofia Martinez",
      description: "Elite Wellness Coach",
      category: "Providers",
      series: 2
    }
  ],
  categories: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Faa2fe923c2b44b578b941ca4ccef05fc?alt=media&token=8f332b48-f42a-4da1-bf72-61aed3b752dc&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Luxury Home Services",
      description: "Premium residential solutions",
      category: "Categories",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F2a73db3d76ca426289ed58305bfc5128?alt=media&token=3b04d734-b2d4-48db-8b1f-58a10edc298c&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Business Solutions",
      description: "Enterprise-grade services",
      category: "Categories",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F49e1a5c64ff543e8a9765a63a2af3f24?alt=media&token=766164a4-0f23-4b5e-87c0-f9151bbd1d5e&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Wellness & Lifestyle",
      description: "Personal enhancement services",
      category: "Categories",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fbceb147a58d64defbccd9e65cfbeca5d?alt=media&token=09072496-0a7b-4307-9e08-81e020647630&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Specialty Services",
      description: "Unique expert solutions",
      category: "Categories",
      series: 2
    }
  ],
  innovations: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F32cf0afd6a81401f9397fd8193bc773d?alt=media&token=ec89e5cb-dbf1-4efb-9e01-7a8edcff8cdf&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "AI-Powered Matching",
      description: "Revolutionary service discovery",
      category: "Innovations",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F0f02702335564a5995e1e145953fba30?alt=media&token=f89bd88c-4624-4816-ae6a-9e0ef03edc0d&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Smart Analytics",
      description: "Data-driven insights",
      category: "Innovations",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F4e0f1330c53946eaab774bc379232073?alt=media&token=bef5edcf-c80d-4d9b-9616-ea09f6fa3d57&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Predictive Quality",
      description: "Future-proof service excellence",
      category: "Innovations",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F58c68b3decc54e79ae8dbe240d3fa4e0?alt=media&token=38a445a1-6099-4aa3-8670-b11b59919ca0&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Automated Excellence",
      description: "Streamlined service delivery",
      category: "Innovations",
      series: 2
    }
  ],
  success: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fddb20028f205405aaec7fb537d3891a1?alt=media&token=9b4e9161-10ff-4952-a0fe-87b556db3ec0&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Customer Success Story",
      description: "Exceeding expectations daily",
      category: "Success Stories",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F8899d7efdf5b46618fd1b6f6b15b5291?alt=media&token=b3a07274-0a93-46c5-81f8-d1ef0d22b130&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Transformation Results",
      description: "Life-changing service outcomes",
      category: "Success Stories",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F6fe92d1949eb47fa8423aed6a86b982e?alt=media&token=be999211-9dec-4154-9b78-4d95ad132561&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Excellence Recognition",
      description: "Award-winning service quality",
      category: "Success Stories",
      series: 2
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F1df8c8e11b0c4d9eb852921bb353beea?alt=media&token=104e74dd-8da8-4549-8458-14969921de18&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Client Testimonials",
      description: "Verified customer experiences",
      category: "Success Stories",
      series: 2
    }
  ]
};

// Combine all assets for comprehensive showcase
const allMediaAssets = {
  ...originalAssets,
  ...newMediaAssets
};

// Flatten all assets for easy access
const allAssets = Object.values(allMediaAssets).flat();

export function MediaShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSeries, setSelectedSeries] = useState<number | "All">("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<typeof allAssets[0] | null>(null);

  const categories = ["All", "Hero", "Services", "Providers", "Categories", "Innovations", "Success Stories"];
  const series = ["All", 1, 2];
  
  const filteredAssets = allAssets.filter(asset => {
    const categoryMatch = selectedCategory === "All" || asset.category === selectedCategory;
    const seriesMatch = selectedSeries === "All" || asset.series === selectedSeries;
    return categoryMatch && seriesMatch;
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(filteredAssets.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(filteredAssets.length / 4)) % Math.ceil(filteredAssets.length / 4));
  };

  const visibleAssets = filteredAssets.slice(currentSlide * 4, (currentSlide + 1) * 4);

  return (
    <PremiumSection
      variant="gradient"
      pattern="dots"
      badge={{ icon: Camera, text: "Ultimate Media Showcase" }}
      title="Premium Visual Experience"
      description="Explore our complete collection of premium services, elite providers, cutting-edge innovations, and exceptional results through this comprehensive visual showcase."
    >
      {/* Enhanced Filter Controls */}
      <div className="space-y-4 lg:space-y-6 mb-8 lg:mb-12">
        {/* Series Filter */}
        <div className="text-center">
          <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-gray-900 dark:text-white">Collection Series</h3>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
            {series.map((seriesOption) => (
              <Button
                key={seriesOption}
                variant={selectedSeries === seriesOption ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedSeries(seriesOption);
                  setCurrentSlide(0);
                }}
                className={`rounded-full transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 ${
                  selectedSeries === seriesOption
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                    : "hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                }`}
              >
                {seriesOption === "All" ? "All Collections" : `Series ${seriesOption}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="text-center">
          <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-gray-900 dark:text-white">Content Categories</h3>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentSlide(0);
                }}
                className={`rounded-full transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : "hover:bg-blue-50 dark:hover:bg-blue-950/20"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Media Grid with Carousel */}
      <div className="relative">
        {/* Navigation Arrows - Hide on mobile */}
        {filteredAssets.length > 4 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg items-center justify-center"
            >
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </>
        )}

        {/* Enhanced Media Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-0 lg:px-12">
          {visibleAssets.map((asset, index) => (
            <PremiumCard
              key={`${asset.url}-${index}`}
              variant="default"
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 touch-manipulation"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src={asset.url}
                  alt={asset.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Series Badge */}
                <Badge className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold">
                  Series {asset.series}
                </Badge>

                {/* Category Badge */}
                <Badge className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 dark:bg-black/90 text-gray-800 dark:text-white backdrop-blur-sm text-xs">
                  {asset.category}
                </Badge>

                {/* Expand Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <Maximize2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 text-white">
                  <h3 className="font-bold text-sm lg:text-base mb-1 leading-tight line-clamp-2">{asset.title}</h3>
                  <p className="text-xs opacity-90 leading-relaxed line-clamp-2">{asset.description}</p>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>

        {/* Slide Indicators */}
        {filteredAssets.length > 4 && (
          <div className="flex justify-center gap-2 mt-6 lg:mt-8">
            {Array.from({ length: Math.ceil(filteredAssets.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                  index === currentSlide
                    ? "bg-blue-600 scale-125 shadow-lg"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Statistics Display */}
      <div className="mt-12 lg:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {[
          { icon: Camera, value: `${allAssets.length}+`, label: "Premium Visuals", color: "from-blue-500 to-cyan-500" },
          { icon: Users, value: `${allMediaAssets.providers?.length || 0}+`, label: "Elite Providers", color: "from-purple-500 to-pink-500" },
          { icon: Sparkles, value: "2", label: "Asset Series", color: "from-emerald-500 to-teal-500" },
          { icon: Star, value: "5.0", label: "Quality Rating", color: "from-yellow-500 to-orange-500" },
          { icon: Award, value: "100%", label: "Premium Standard", color: "from-red-500 to-rose-500" }
        ].map((stat, index) => (
          <div
            key={index}
            className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${stat.color} rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <stat.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
              {stat.value}
            </div>
            <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal for Selected Asset */}
      {selectedAsset && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 lg:p-4"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-white dark:bg-gray-900 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[50vh] lg:h-[60vh]">
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.title}
                fill
                className="object-cover"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAsset(null)}
                className="absolute top-3 lg:top-6 right-3 lg:right-6 rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-black/90 backdrop-blur-sm hover:bg-white dark:hover:bg-black text-gray-900 dark:text-white text-lg lg:text-xl"
              >
                ×
              </Button>
              <div className="absolute top-3 lg:top-6 left-3 lg:left-6 flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs lg:text-sm">
                  Series {selectedAsset.series}
                </Badge>
                <Badge className="bg-white/90 dark:bg-black/90 text-gray-800 dark:text-white backdrop-blur-sm text-xs lg:text-sm">
                  {selectedAsset.category}
                </Badge>
              </div>
            </div>
            <div className="p-4 lg:p-8">
              <h3 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-3">
                {selectedAsset.title}
              </h3>
              <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 leading-relaxed">
                {selectedAsset.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto text-sm lg:text-base">
                  <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" />
                  View Service
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm lg:text-base">
                  <Play className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" />
                  Learn More
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm lg:text-base">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" />
                  Save to Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Showing {filteredAssets.length} premium assets
          </span>
          {selectedCategory !== "All" && (
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              {selectedCategory}
            </Badge>
          )}
          {selectedSeries !== "All" && (
            <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
              Series {selectedSeries}
            </Badge>
          )}
        </div>
      </div>
    </PremiumSection>
  );
}
