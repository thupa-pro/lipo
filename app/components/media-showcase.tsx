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
  Maximize2
} from "lucide-react";

// All available media assets organized by category
const mediaAssets = {
  hero: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5813ae9f923e4ec2a07d2e1543fb6d54?alt=media&token=0ef56f97-041d-49cb-9f80-00350ad0d93b&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Professional Service Excellence",
      description: "Premium quality service delivery",
      category: "Hero"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F8010a38e78d1406babeedcbc69aea72d?alt=media&token=1cf23adc-c2b6-4dcb-b339-31e346c86a39&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Elite Professional Network",
      description: "Connecting you with verified experts",
      category: "Hero"
    }
  ],
  services: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fa680612acb3849c2b1f9dc6486f6485f?alt=media&token=0086ec7b-4200-4e6f-b236-6cd8016503ab&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Quality Assurance",
      description: "5-star rated services",
      category: "Services"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fd3c87ccfc1444887934d07fc7e7dab29?alt=media&token=86deb8fe-c92e-47c0-8137-dc0e670dc3ec&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Fast Response",
      description: "Under 30 minutes response time",
      category: "Services"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fb2459d5036794deb84d52bf82ca745cd?alt=media&token=4fdbb222-3123-42c6-841c-0c811ce9f2d7&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Home Services",
      description: "Professional home maintenance",
      category: "Services"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fc84ae154ac94479691e1046893001a2d?alt=media&token=c7099c88-9280-4da7-b35c-b5f58763194c&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Technical Work",
      description: "Expert technical solutions",
      category: "Services"
    }
  ],
  providers: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Ff9b0ad35c687412daf8f1df3626700db?alt=media&token=b1792661-6cc2-414a-9d4c-76917ab8e4d1&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Sarah Mitchell",
      description: "Premium House Cleaning Specialist",
      category: "Providers"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F1e1e8ed62ef9468f99ec1e90b2542a8f?alt=media&token=39c74ba2-4310-43c0-a3a8-ea2bc409b530&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Marcus Rodriguez",
      description: "Licensed Master Plumber",
      category: "Providers"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5bd41b69e1b143908d31f58b14060b98?alt=media&token=5b782adc-7672-41d7-b396-696cef354606&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Emma Thompson",
      description: "Certified Pet Care Specialist",
      category: "Providers"
    }
  ],
  categories: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F6a812cf3fada40e8a56166bfb07c5a39?alt=media&token=d77ca34f-c367-436a-90ed-34fa2898ae6f&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Auto & Transport",
      description: "Professional automotive services",
      category: "Categories"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F2d1b9717651f4661982da5e0f4f11d8c?alt=media&token=018784fd-f15a-4fd5-b3d0-39354815b3cb&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Education & Training",
      description: "Professional tutoring and coaching",
      category: "Categories"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Faa64b10a73474c169cc7fb3fc239e3db?alt=media&token=f032bf2e-d00d-4795-9e44-7fd13eee8daa&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Health & Wellness",
      description: "Fitness and wellness experts",
      category: "Categories"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F6933a12df7534198b49b37c4cae71b5c?alt=media&token=13404641-8e22-40b1-9db5-c9e80c311472&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Creative Services",
      description: "Photography and design experts",
      category: "Categories"
    }
  ],
  testimonials: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fee83a8904a0d4a6d97fa663f79580e9d?alt=media&token=ce032fe6-8214-4b5b-8b63-c2ccf20d9501&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Beauty & Personal Care",
      description: "Premium beauty services",
      category: "Success Stories"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F44e95d003c2e440d8442038d194fd292?alt=media&token=7d8f7b65-9156-4b58-92e4-be0233254eba&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Art & Design",
      description: "Creative excellence delivered",
      category: "Success Stories"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F43c8dbf37a02479a9608fbda54d31476?alt=media&token=eb3aeb01-ab9e-4952-8ce8-d2ebd1fe91e4&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Professional Results",
      description: "Exceptional service outcomes",
      category: "Success Stories"
    }
  ],
  gallery: [
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fde884aceaab54333a2029504284a93ee?alt=media&token=7872437b-ecf7-4b86-9e8e-44ee8aeb0949&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Technical Excellence",
      description: "Precision and expertise",
      category: "Gallery"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F078b2224baae4dbda0602f97374e7368?alt=media&token=794fe7a5-33fd-4a1b-9837-12a71370128c&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Care & Attention",
      description: "Detail-oriented service",
      category: "Gallery"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fcbb96f0619a54f1e9dbbe573fee86619?alt=media&token=0c7e60fa-8d21-4d4a-a476-7c691f913d51&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Professional Standards",
      description: "Industry-leading quality",
      category: "Gallery"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5ff17a00508548d89854319d66ecd561?alt=media&token=5a5c7b4b-2de4-4854-a99f-a678d73fb3d9&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Customer Satisfaction",
      description: "Exceeding expectations",
      category: "Gallery"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F793e26ec4ad84eb5bf7ed547d87c7cd1?alt=media&token=4d0d2f61-0be7-4c6b-981d-e35f2fc0552f&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Innovation & Quality",
      description: "Cutting-edge solutions",
      category: "Gallery"
    },
    {
      url: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5b3a1b8e65bd49ec9d335e62168cf265?alt=media&token=f0548918-c262-48c2-8246-0c91aa4876c6&apiKey=efd5169b47d04c9886e111b6074edfba",
      title: "Excellence Delivered",
      description: "Premium service standards",
      category: "Gallery"
    }
  ]
};

// Flatten all assets for easy access
const allAssets = Object.values(mediaAssets).flat();

export function MediaShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<typeof allAssets[0] | null>(null);

  const categories = ["All", "Hero", "Services", "Providers", "Categories", "Success Stories", "Gallery"];
  
  const filteredAssets = selectedCategory === "All" 
    ? allAssets 
    : allAssets.filter(asset => asset.category === selectedCategory);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(filteredAssets.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(filteredAssets.length / 3)) % Math.ceil(filteredAssets.length / 3));
  };

  const visibleAssets = filteredAssets.slice(currentSlide * 3, (currentSlide + 1) * 3);

  return (
    <PremiumSection
      variant="gradient"
      pattern="dots"
      badge={{ icon: Camera, text: "Media Showcase" }}
      title="Experience Premium Quality"
      description="Explore our comprehensive collection of premium services, elite providers, and exceptional results through this visual showcase."
    >
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory(category);
              setCurrentSlide(0);
            }}
            className={`rounded-full transition-all duration-300 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                : "hover:bg-blue-50 dark:hover:bg-blue-950/20"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Media Grid with Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        {filteredAssets.length > 3 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Media Cards */}
        <div className="grid md:grid-cols-3 gap-8 px-8">
          {visibleAssets.map((asset, index) => (
            <PremiumCard
              key={`${asset.url}-${index}`}
              variant="default"
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl overflow-hidden"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={asset.url}
                  alt={asset.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 text-gray-800 dark:text-white backdrop-blur-sm">
                  {asset.category}
                </Badge>

                {/* Expand Icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{asset.title}</h3>
                  <p className="text-sm opacity-90">{asset.description}</p>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>

        {/* Slide Indicators */}
        {filteredAssets.length > 3 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(filteredAssets.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Statistics Display */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Camera, value: `${allAssets.length}+`, label: "Premium Visuals" },
          { icon: Users, value: `${mediaAssets.providers.length}+`, label: "Elite Providers" },
          { icon: Star, value: "5.0", label: "Quality Rating" },
          { icon: Heart, value: "100%", label: "Satisfaction" }
        ].map((stat, index) => (
          <div
            key={index}
            className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Selected Asset */}
      {selectedAsset && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-96">
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
                className="absolute top-4 right-4 rounded-full w-10 h-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm"
              >
                ×
              </Button>
            </div>
            <div className="p-6">
              <Badge className="mb-3">{selectedAsset.category}</Badge>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedAsset.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedAsset.description}
              </p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Service
                </Button>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PremiumSection>
  );
}
