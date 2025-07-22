"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar,
  MapPin, Filter,
  SortAsc,
  Heart,
  Eye,
  Users,
  DollarSign
  ArrowRight
} from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Booking Services...</h2>
          <p className="text-gray-600 dark:text-gray-400">Finding the perfect service providers for you</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  // Mock data for demonstration
  const categories = [
    { id: "all", name: "All Services", count: 150 },
    { id: "cleaning", name: "House Cleaning", count: 45 },
    { id: "plumbing", name: "Plumbing", count: 32 },
    { id: "electrical", name: "Electrical", count: 28 },
    { id: "gardening", name: "Gardening", count: 25 },
    { id: "beauty", name: "Beauty & Wellness", count: 20 }
  ];

  const featuredServices = [
    {
      id: 1,
      title: "Professional House Cleaning",
      provider: "Sarah's Cleaning Service",
      rating: 4.9,
      reviews: 156,
      price: "$80-120",
      duration: "2-3 hours",
      category: "cleaning",
      image: "🧹",
      description: "Deep cleaning service for your entire home",
      location: "Downtown Area",
      available: true
    },
    {
      id: 2,
      title: "Emergency Plumbing Repair",
      provider: "Mike's Plumbing Pros",
      rating: 4.8,
      reviews: 243,
      price: "$100-200",
      duration: "1-2 hours",
      category: "plumbing",
      image: "🔧",
      description: "24/7 emergency plumbing services",
      location: "City Wide",
      available: true
    },
    {
      id: 3,
      title: "Garden Landscaping",
      provider: "Green Gardens Co.",
      rating: 5.0,
      reviews: 89,
      price: "$150-300",
      duration: "4-6 hours",
      category: "gardening",
      image: "🌱",
      description: "Complete garden design and maintenance",
      location: "Suburban Areas",
      available: true
    },
    {
      id: 4,
      title: "Electrical Installation",
      provider: "ElectricPro Services",
      rating: 4.7,
      reviews: 178,
      price: "$75-150",
      duration: "1-3 hours",
      category: "electrical",
      image: "⚡",
      description: "Safe and certified electrical work",
      location: "Metropolitan Area",
      available: true
    },
    {
      id: 5,
      title: "Mobile Spa Service",
      provider: "Bliss Beauty Mobile",
      rating: 4.9,
      reviews: 134,
      price: "$120-250",
      duration: "2-4 hours",
      category: "beauty",
      image: "💆‍♀️",
      description: "Relaxing spa treatments at your home",
      location: "Premium Areas",
      available: true
    },
    {
      id: 6,
      title: "Home Security Setup",
      provider: "SecureHome Pro",
      rating: 4.8,
      reviews: 92,
      price: "$200-400",
      duration: "3-5 hours",
      category: "security",
      image: "🔒",
      description: "Professional security system installation",
      location: "All Areas",
      available: false
    }
  ];

  const filteredServices = featuredServices.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (serviceId: number) => {
    router.push(`/${locale}/booking/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Book Elite Services 🌟
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with verified professionals for all your service needs. Quality guaranteed, satisfaction promised.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for services, providers, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            <Button variant="outline" className="px-6">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="px-6">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Service Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Featured Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {selectedCategory === "all" ? "Featured Services" : `${categories.find(c => c.id === selectedCategory)?.name} Services`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{service.image}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{service.provider}</p>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{service.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({service.reviews} reviews)
                      </span>
                    </div>

                    {/* Location and Duration */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    {/* Price and Availability */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">{service.price}</span>
                      </div>
                      {service.available ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Busy
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1"
                        onClick={() => handleBookService(service.id)}
                        disabled={!service.available}
                      >
                        {service.available ? "Book Now" : "Join Waitlist"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No services found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search criteria or explore different categories
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
                <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                  View All Categories
                </Button>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {filteredServices.length > 0 && (
            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Request a custom service and we'll connect you with the perfect professional
                  </p>
                  <Button 
                    onClick={() => router.push(`/${locale}/request-service`)}
                    className="bg-gradient-to-r from-violet-600 to-blue-600"
                  >
                    Request Custom Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}