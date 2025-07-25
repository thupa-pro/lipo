"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Heart,
  Share,
  MessageCircle,
  Shield,
  CreditCard,
  ArrowLeft,
  Info,
  AlertCircle,
  Badge as BadgeIcon,
  Phone,
  Mail,
  Camera,
  Award,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BookingCalendar from "@/components/booking/BookingCalendar";
import PaymentForm from "@/components/booking/PaymentForm";
import { toast } from "@/hooks/use-toast";

interface ServiceDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: "fixed" | "hourly";
  duration: number;
  category: string;
  images: string[];
  tags: string[];
  location: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  availability: string[];
  provider: {
    id: string;
    name: string;
    image?: string;
    bio: string;
    verified: boolean;
    rating: number;
    joinedDate: string;
    responseRate: number;
    completedJobs: number;
    badges: string[];
    contact: {
      phone?: string;
      email?: string;
    };
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    date: string;
    customer: {
      name: string;
      image?: string;
    };
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface BookingState {
  selectedDate: Date | null;
  selectedTime: string | null;
  notes: string;
  address: string;
  contactMethod: "phone" | "message";
  urgency: "standard" | "urgent";
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedDate: null,
    selectedTime: null,
    notes: "",
    address: "",
    contactMethod: "message",
    urgency: "standard",
  });

  // Mock service data
  const mockService: ServiceDetails = {
    id: params.serviceId as string,
    title: "Professional House Cleaning",
    description: "Comprehensive house cleaning service with eco-friendly products. Our team provides thorough cleaning including all, rooms, bathrooms, kitchen deep, clean, and optional add-ons like inside, oven, inside, fridge, and window cleaning.",
    price: 75,
    priceType: "fixed",
    duration: 3,
    category: "cleaning",
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
    ],
    tags: ["eco-friendly", "insured", "same-day", "background-checked"],
    location: "Downtown Area",
    rating: 4.9,
    reviewCount: 127,
    completedJobs: 200,
    responseTime: "15 minutes",
    availability: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    provider: {
      id: "provider-1",
      name: "Sarah Johnson",
      image: "/api/placeholder/80/80",
      bio: "Professional cleaner with 8+ years of experience. Specialized in eco-friendly cleaning solutions and deep cleaning services. Background checked and fully insured.",
      verified: true,
      rating: 4.9,
      joinedDate: "2020-03-15",
      responseRate: 98,
      completedJobs: 200,
      badges: ["Top Rated", "Fast Response", "Eco-Friendly", "Background Checked"],
      contact: {
        phone: "+1 (555) 123-4567",
        email: "sarah@cleanpro.com",
      },
    },
    reviews: [
      {
        id: "1",
        rating: 5,
        comment: "Excellent service! Sarah was punctual, professional, and did an amazing job cleaning our house. Everything was spotless and she used eco-friendly products as promised. Highly recommended!",
        date: "2024-01-15",
        customer: {
          name: "Jessica M.",
          image: "/api/placeholder/40/40",
        },
      },
      {
        id: "2",
        rating: 5,
        comment: "Great attention to detail and very reliable. This is the third time I've booked Sarah and she consistently delivers high-quality work. Will definitely book again!",
        date: "2024-01-10",
        customer: {
          name: "Michael R.",
          image: "/api/placeholder/40/40",
        },
      },
    ],
    faqs: [
      {
        question: "What cleaning supplies do you use?",
        answer: "We use eco-friendly, non-toxic cleaning products that are safe for children and pets. All supplies are included in the service price.",
      },
      {
        question: "How long does a typical cleaning take?",
        answer: "A standard house cleaning typically takes 2-4 hours depending on the size of your home and the level of cleaning required.",
      },
      {
        question: "Are you insured and bonded?",
        answer: "Yes, we are fully insured and bonded. All our cleaners are background-checked and covered by comprehensive liability insurance.",
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setService(mockService);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBookingState(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: time,
    }));
  };

  const handleBookingSubmit = () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=" + window.location.pathname);
      return;
    }

    if (!bookingState.selectedDate || !bookingState.selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Choose your preferred appointment slot to continue.",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const calculateTotal = () => {
    const basePrice = service?.price || 0;
    const urgencyFee = bookingState.urgency === "urgent" ? basePrice * 0.2 : 0;
    const serviceFee = basePrice * 0.1;
    return {
      basePrice,
      urgencyFee,
      serviceFee,
      total: basePrice + urgencyFee + serviceFee,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-xl mx-auto p-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Service not found</h1>
          <p className="text-muted-foreground mb-4">The service you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/search")}>
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto p-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={service.images[currentImageIndex]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {service.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorited ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Service Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="provider">Provider</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Title and Basic Info */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                          {service.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {service.rating} ({service.reviewCount} reviews)
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {service.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            ~{service.duration}h duration
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          ${service.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.priceType === "hourly" ? "per hour" : "fixed price"}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Key Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle>What's Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Professional cleaning supplies included",
                          "Eco-friendly, non-toxic products",
                          "All rooms and common areas",
                          "Bathroom deep cleaning",
                          "Kitchen appliance cleaning",
                          "Vacuum and mop all floors",
                          "Dust all surfaces and furniture",
                          "Take out trash and recycling",
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="provider" className="space-y-6 mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={service.provider.image} />
                          <AvatarFallback>
                            {service.provider.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{service.provider.name}</h3>
                            {service.provider.verified && (
                              <Badge variant="default" className="gap-1">
                                <Shield className="w-3 h-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {service.provider.rating} rating
                            </div>
                            <div>{service.provider.completedJobs} completed jobs</div>
                            <div>{service.provider.responseRate}% response rate</div>
                          </div>
                          <p className="text-muted-foreground">{service.provider.bio}</p>
                        </div>
                      </div>

                      {/* Provider Badges */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Credentials & Badges</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.provider.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="gap-1">
                              <Award className="w-3 h-3" />
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Contact Options */}
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        {service.provider.contact.phone && (
                          <Button variant="outline" className="flex-1">
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews ({service.reviewCount})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {service.reviews.map((review) => (
                        <div key={review.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={review.customer.image} />
                              <AvatarFallback>
                                {review.customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{review.customer.name}</h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                              <p className="text-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faq" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {service.faqs.map((faq, index) => (
                        <div key={index} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Book This Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!showPayment ? (
                    <>
                      {/* Date & Time Selection */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Select Date & Time
                        </Label>
                        <BookingCalendar
                          availableDays={service.availability}
                          onSelect={handleDateTimeSelect}
                          selectedDate={bookingState.selectedDate}
                          selectedTime={bookingState.selectedTime}
                        />
                      </div>

                      {/* Service Location */}
                      <div>
                        <Label htmlFor="address" className="text-sm font-medium">
                          Service Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="Enter your address"
                          value={bookingState.address}
                          onChange={(e) =>
                            setBookingState(prev => ({ ...prev, address: e.target.value }))
                          }
                          className="mt-2"
                        />
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <Label htmlFor="notes" className="text-sm font-medium">
                          Special Instructions (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Any specific requirements or notes..."
                          value={bookingState.notes}
                          onChange={(e) =>
                            setBookingState(prev => ({ ...prev, notes: e.target.value }))
                          }
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      {/* Pricing Summary */}
                      <div className="space-y-3 pt-4 border-t border-border">
                        <div className="flex justify-between text-sm">
                          <span>Service fee</span>
                          <span>${calculateTotal().basePrice}</span>
                        </div>
                        {bookingState.urgency === "urgent" && (
                          <div className="flex justify-between text-sm">
                            <span>Urgent booking fee (20%)</span>
                            <span>${calculateTotal().urgencyFee.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>Platform fee</span>
                          <span>${calculateTotal().serviceFee.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${calculateTotal().total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Book Button */}
                      <Button
                        onClick={handleBookingSubmit}
                        className="w-full"
                        size="lg"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Continue to Payment
                      </Button>

                      {/* Trust & Safety */}
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Your payment is protected. Funds are held in escrow until service completion.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <PaymentForm
                      service={service}
                      bookingDetails={bookingState}
                      total={calculateTotal().total}
                      onSuccess={() => {
                        toast({
                          title: "Booking confirmed!",
                          description: "You'll receive a confirmation email shortly.",
                        });
                        router.push(`/${locale}/customer/bookings`);
                      }}
                      onCancel={() => setShowPayment(false)}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}