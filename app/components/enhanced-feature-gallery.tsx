"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Award,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Heart,
  CheckCircle
} from "lucide-react";

// Enhanced feature data with new assets
const enhancedFeatures = [
  {
    id: 1,
    title: "Next-Generation AI Matching",
    description: "Revolutionary artificial intelligence that understands your exact needs and matches you with the perfect service provider in under 30 seconds.",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F62f2ed47e345487a9c84004d484f2578?alt=media&token=25f2fd33-6b78-47d7-8391-f2c51ed72df8&apiKey=efd5169b47d04c9886e111b6074edfba",
    category: "Technology",
    benefits: ["99.5% Match Accuracy", "Instant Results", "Predictive Quality"],
    icon: Zap,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Premium Experience Design",
    description: "Every interaction is crafted for luxury and sophistication, ensuring your service experience exceeds expectations at every touchpoint.",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Ff2b7a918d1c34687a447612c8c1443b4?alt=media&token=773ba395-15fd-4e67-8e89-9e349cf2fd7a&apiKey=efd5169b47d04c9886e111b6074edfba",
    category: "Experience",
    benefits: ["White-Glove Service", "Luxury Standards", "Personalized Touch"],
    icon: Award,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Advanced Technology Integration",
    description: "Cutting-edge tools and platforms that streamline service delivery, ensuring efficiency, transparency, and real-time communication.",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F72a2948a44714670986c189cb968e3f8?alt=media&token=a2c5e895-5704-4d6a-b707-19d7146bdfbc&apiKey=efd5169b47d04c9886e111b6074edfba",
    category: "Innovation",
    benefits: ["Smart Tracking", "Real-Time Updates", "Digital Excellence"],
    icon: Globe,
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 4,
    title: "Elite Provider Network",
    description: "Exclusive access to the top 5% of service providers, all background-verified, insured, and committed to excellence.",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fa738b4a6dcb84cf0ab5403c036edd0fa?alt=media&token=75ceb629-d1c7-45bc-a925-ad7dd9607f22&apiKey=efd5169b47d04c9886e111b6074edfba",
    category: "Network",
    benefits: ["Top 5% Providers", "Full Verification", "Elite Standards"],
    icon: Users,
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: 5,
    title: "Comprehensive Service Solutions",
    description: "From simple tasks to complex projects, our platform covers every service category with unmatched quality and reliability.",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F39067fd145574d73a22b2a1782cb82a7?alt=media&token=4103663f-9618-4cb2-971f-3d3936c5525d&apiKey=efd5169b47d04c9886e111b6074edfba",
    category: "Services",
    benefits: ["End-to-End Solutions", "Quality Guaranteed", "Full Coverage"],
    icon: Shield,
    color: "from-orange-500 to-red-500"
  },
  {
    id: 6,
    title: "Smart Analytics & Insights",
    description: "Data-driven intelligence that continuously improves your service experience and provides actionable insights.",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F0f02702335564a5995e1e145953fba30?alt=media&token=f89bd88c-4624-4816-ae6a-9e0ef03edc0d&apiKey=efd5169b47d04c9886e111b6074edfba",
    category: "Analytics",
    benefits: ["Smart Insights", "Performance Tracking", "Predictive Analytics"],
    icon: TrendingUp,
    color: "from-yellow-500 to-orange-500"
  }
];

const stats = [
  { label: "Success Rate", value: "99.5%", icon: CheckCircle },
  { label: "Customer Satisfaction", value: "4.9/5", icon: Star },
  { label: "Elite Providers", value: "10,000+", icon: Users },
  { label: "Services Completed", value: "500K+", icon: Award }
];

export function EnhancedFeatureGallery() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % enhancedFeatures.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = enhancedFeatures[activeFeature].icon;

  return (
    <PremiumSection
      variant="default"
      pattern="grid"
      badge={{ icon: Sparkles, text: "Enhanced Features" }}
      title="Revolutionary Service Platform"
      description="Experience the future of local services with our cutting-edge platform that combines AI intelligence, premium quality, and unmatched user experience."
    >
      {/* Main Feature Showcase */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 lg:mb-20">
        {/* Feature Content */}
        <div className={`space-y-6 lg:space-y-8 order-2 lg:order-1 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="space-y-3 lg:space-y-4">
            <Badge className={`bg-gradient-to-r ${enhancedFeatures[activeFeature].color} text-white px-3 py-1.5 lg:px-4 lg:py-2 text-sm lg:text-base`}>
              <ActiveIcon className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 lg:mr-2" />
              {enhancedFeatures[activeFeature].category}
            </Badge>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {enhancedFeatures[activeFeature].title}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {enhancedFeatures[activeFeature].description}
            </p>
          </div>

          {/* Feature Benefits */}
          <div className="space-y-2.5 lg:space-y-3">
            {enhancedFeatures[activeFeature].benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2.5 lg:gap-3">
                <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-r ${enhancedFeatures[activeFeature].color} flex items-center justify-center flex-shrink-0`}>
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <span className="text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-3 lg:pt-4">
            <Button size="lg" className={`bg-gradient-to-r ${enhancedFeatures[activeFeature].color} hover:shadow-lg transition-all duration-300 w-full sm:w-auto text-sm lg:text-base`}>
              Experience Now
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-1.5 lg:ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm lg:text-base">
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature Image */}
        <div className="relative order-1 lg:order-2">
          <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl">
            <Image
              src={enhancedFeatures[activeFeature].image}
              alt={enhancedFeatures[activeFeature].title}
              width={600}
              height={400}
              className="object-cover w-full h-auto aspect-[3/2] transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Floating Badge - Hide on mobile, show on tablet+ */}
          <div className="hidden sm:block absolute -top-4 lg:-top-6 -right-4 lg:-right-6 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-xl p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-r ${enhancedFeatures[activeFeature].color} flex items-center justify-center`}>
                <ActiveIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs lg:text-sm text-gray-900 dark:text-white truncate">Feature {activeFeature + 1}</div>
                <div className="text-xs text-gray-500 truncate">{enhancedFeatures[activeFeature].category}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-12 lg:mb-16">
        {enhancedFeatures.map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(index)}
              className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 text-left min-h-[100px] lg:min-h-[120px] touch-manipulation ${
                index === activeFeature
                  ? `border-transparent bg-gradient-to-r ${feature.color} text-white shadow-lg scale-105`
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:scale-102"
              }`}
            >
              <FeatureIcon className={`w-5 h-5 lg:w-6 lg:h-6 mb-2 ${index === activeFeature ? "text-white" : "text-gray-600 dark:text-gray-400"}`} />
              <h4 className={`font-semibold text-xs lg:text-sm mb-1 line-clamp-2 ${index === activeFeature ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {feature.title}
              </h4>
              <p className={`text-xs line-clamp-1 ${index === activeFeature ? "text-white/90" : "text-gray-500 dark:text-gray-400"}`}>
                {feature.category}
              </p>
            </button>
          );
        })}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <PremiumCard
              key={index}
              variant="glass"
              className="text-center p-4 lg:p-8 hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <StatIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </PremiumCard>
          );
        })}
      </div>

      {/* Additional Feature Highlights */}
      <div className="grid md:grid-cols-2 gap-8">
        <PremiumCard variant="glass" className="p-8">
          <div className="flex items-start gap-6">
            <Image
              src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F58c68b3decc54e79ae8dbe240d3fa4e0?alt=media&token=38a445a1-6099-4aa3-8670-b11b59919ca0&apiKey=efd5169b47d04c9886e111b6074edfba"
              alt="Automated Excellence"
              width={120}
              height={120}
              className="rounded-2xl object-cover"
            />
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Automated Excellence</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Streamlined processes ensure consistent, high-quality service delivery every time.</p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <Heart className="w-4 h-4" />
                Customer Favorite
              </div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="glass" className="p-8">
          <div className="flex items-start gap-6">
            <Image
              src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F4e0f1330c53946eaab774bc379232073?alt=media&token=bef5edcf-c80d-4d9b-9616-ea09f6fa3d57&apiKey=efd5169b47d04c9886e111b6074edfba"
              alt="Predictive Quality"
              width={120}
              height={120}
              className="rounded-2xl object-cover"
            />
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Predictive Quality</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">AI-powered insights predict and prevent issues before they occur, ensuring seamless experiences.</p>
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                <Star className="w-4 h-4" />
                AI-Powered
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Experience the Future?</h3>
          <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've discovered the perfect balance of technology, quality, and service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </PremiumSection>
  );
}
