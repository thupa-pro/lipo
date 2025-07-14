// Realistic seed data for Loconomy platform

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
  joinDate: string;
  verificationStatus: "verified" | "pending" | "unverified";
  rating: number;
  totalBookings: number;
  isProvider: boolean;
  badges: string[];
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: {
    type: "fixed" | "hourly" | "custom";
    amount: number;
    currency: string;
  };
  duration: string;
  images: string[];
  availability: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  lastUpdated: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  notes?: string;
  address: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  rating: number;
  title: string;
  comment: string;
  photos?: string[];
  categories: {
    punctuality: number;
    quality: number;
    communication: number;
    professionalism: number;
    value: number;
  };
  isVerified: boolean;
  createdAt: string;
  helpfulVotes: number;
}

// Realistic user data
export const seedUsers: User[] = [
  {
    id: "user-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    bio: "Busy working mom who loves finding reliable local services. Always looking for trusted professionals to help with home maintenance and family needs.",
    location: {
      address: "2847 Maple Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94115",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    joinDate: "2023-03-15",
    verificationStatus: "verified",
    rating: 4.9,
    totalBookings: 47,
    isProvider: false,
    badges: ["trusted-customer", "frequent-booker", "verified-profile"],
  },
  {
    id: "user-002",
    firstName: "Marcus",
    lastName: "Rodriguez",
    email: "marcus.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Licensed handyman with 15+ years experience. Specializing in home repairs, painting, and general maintenance. Pride myself on quality work and reliability.",
    location: {
      address: "1523 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      coordinates: { lat: 37.7849, lng: -122.4094 },
    },
    joinDate: "2022-08-20",
    verificationStatus: "verified",
    rating: 4.8,
    totalBookings: 189,
    isProvider: true,
    badges: [
      "verified-professional",
      "background-checked",
      "top-rated-pro",
      "5-year-member",
    ],
  },
  {
    id: "user-003",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@email.com",
    phone: "+1 (555) 345-6789",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Professional house cleaner and organizer. Eco-friendly products, attention to detail, and flexible scheduling. Making homes sparkle one room at a time!",
    location: {
      address: "892 Pine Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94108",
      coordinates: { lat: 37.7749, lng: -122.4094 },
    },
    joinDate: "2023-01-10",
    verificationStatus: "verified",
    rating: 4.9,
    totalBookings: 156,
    isProvider: true,
    badges: [
      "verified-professional",
      "eco-friendly",
      "top-rated-pro",
      "quick-responder",
    ],
  },
  {
    id: "user-004",
    firstName: "David",
    lastName: "Thompson",
    email: "david.thompson@email.com",
    phone: "+1 (555) 456-7890",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Tech professional new to the area. Love using technology to make life easier and connect with trusted local service providers.",
    location: {
      address: "756 Mission Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      coordinates: { lat: 37.7849, lng: -122.4194 },
    },
    joinDate: "2024-01-20",
    verificationStatus: "verified",
    rating: 4.7,
    totalBookings: 12,
    isProvider: false,
    badges: ["verified-profile", "new-member"],
  },
];

// Realistic service data
export const seedServices: Service[] = [
  {
    id: "service-001",
    providerId: "user-002",
    title: "Complete Home Handyman Services",
    description:
      "Professional handyman services including plumbing repairs, electrical work, painting, drywall repair, and general home maintenance. Licensed, insured, and experienced with 15+ years in the business. I take pride in quality workmanship and clean, professional service.",
    category: "Home Improvement",
    subcategory: "Handyman Services",
    price: {
      type: "hourly",
      amount: 75,
      currency: "USD",
    },
    duration: "2-8 hours",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
    ],
    availability: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    tags: ["licensed", "insured", "experienced", "reliable", "quality-work"],
    rating: 4.8,
    reviewCount: 89,
    isPopular: true,
    lastUpdated: "2024-01-15",
  },
  {
    id: "service-002",
    providerId: "user-003",
    title: "Professional House Cleaning & Organization",
    description:
      "Thorough, eco-friendly house cleaning services with attention to every detail. Standard cleaning includes all rooms, bathrooms, kitchen deep clean, and dusting. Optional add-ons: inside oven, inside fridge, windows, and organization services. All supplies included.",
    category: "Cleaning",
    subcategory: "House Cleaning",
    price: {
      type: "fixed",
      amount: 120,
      currency: "USD",
    },
    duration: "2-4 hours",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585659722983-f2b39e7c7b1c?w=400&h=300&fit=crop",
    ],
    availability: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    tags: [
      "eco-friendly",
      "detailed",
      "supplies-included",
      "flexible",
      "organized",
    ],
    rating: 4.9,
    reviewCount: 134,
    isPopular: true,
    lastUpdated: "2024-01-18",
  },
  {
    id: "service-003",
    providerId: "user-005",
    title: "Professional Dog Walking & Pet Care",
    description:
      "Reliable pet care services including daily dog walks, pet sitting, feeding, and basic grooming. Insured and bonded with excellent references. Your pets will receive loving care and attention while you're away. Available for regular or one-time services.",
    category: "Pet Care",
    subcategory: "Dog Walking",
    price: {
      type: "fixed",
      amount: 35,
      currency: "USD",
    },
    duration: "30-60 minutes",
    images: [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=300&fit=crop",
    ],
    availability: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    tags: ["insured", "bonded", "references", "reliable", "pet-lover"],
    rating: 4.7,
    reviewCount: 67,
    isPopular: false,
    lastUpdated: "2024-01-12",
  },
];

// Realistic booking data
export const seedBookings: Booking[] = [
  {
    id: "booking-001",
    serviceId: "service-001",
    customerId: "user-001",
    providerId: "user-002",
    status: "completed",
    scheduledDate: "2024-01-10",
    scheduledTime: "09:00",
    totalAmount: 300,
    paymentStatus: "paid",
    createdAt: "2024-01-08",
    notes: "Need to fix leaky kitchen faucet and patch hole in bathroom wall",
    address: "2847 Maple Street, San Francisco, CA 94115",
  },
  {
    id: "booking-002",
    serviceId: "service-002",
    customerId: "user-004",
    providerId: "user-003",
    status: "confirmed",
    scheduledDate: "2024-01-25",
    scheduledTime: "10:00",
    totalAmount: 120,
    paymentStatus: "pending",
    createdAt: "2024-01-20",
    notes: "Deep clean for move-in, include inside of fridge and oven",
    address: "756 Mission Street, San Francisco, CA 94103",
  },
  {
    id: "booking-003",
    serviceId: "service-003",
    customerId: "user-001",
    providerId: "user-005",
    status: "completed",
    scheduledDate: "2024-01-15",
    scheduledTime: "12:00",
    totalAmount: 35,
    paymentStatus: "paid",
    createdAt: "2024-01-14",
    notes: "30-minute walk for Bella, she's very friendly but pulls on leash",
    address: "2847 Maple Street, San Francisco, CA 94115",
  },
];

// Realistic review data
export const seedReviews: Review[] = [
  {
    id: "review-001",
    bookingId: "booking-001",
    customerId: "user-001",
    providerId: "user-002",
    serviceId: "service-001",
    rating: 5,
    title: "Excellent work, highly recommend!",
    comment:
      "Marcus did an amazing job fixing our kitchen faucet and patching the bathroom wall. He arrived on time, was very professional, and cleaned up after himself. The quality of work exceeded our expectations. Will definitely book again!",
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    ],
    categories: {
      punctuality: 5,
      quality: 5,
      communication: 5,
      professionalism: 5,
      value: 4,
    },
    isVerified: true,
    createdAt: "2024-01-10",
    helpfulVotes: 12,
  },
  {
    id: "review-002",
    bookingId: "booking-003",
    customerId: "user-001",
    providerId: "user-005",
    serviceId: "service-003",
    rating: 4,
    title: "Great with our dog!",
    comment:
      "Really happy with the dog walking service. Bella came back tired and happy, and the walker sent cute photos during the walk. Only minor issue was arriving 10 minutes late, but they communicated ahead of time.",
    categories: {
      punctuality: 3,
      quality: 5,
      communication: 4,
      professionalism: 4,
      value: 5,
    },
    isVerified: true,
    createdAt: "2024-01-15",
    helpfulVotes: 5,
  },
];

// Popular categories and their statistics
export const popularCategories = [
  {
    name: "House Cleaning",
    icon: "🏠",
    totalServices: 245,
    avgPrice: 120,
    avgRating: 4.7,
    growthRate: 23.5,
  },
  {
    name: "Handyman Services",
    icon: "🔧",
    totalServices: 189,
    avgPrice: 85,
    avgRating: 4.6,
    growthRate: 18.2,
  },
  {
    name: "Pet Care",
    icon: "🐕",
    totalServices: 156,
    avgPrice: 45,
    avgRating: 4.8,
    growthRate: 31.7,
  },
  {
    name: "Tutoring",
    icon: "📚",
    totalServices: 134,
    avgPrice: 65,
    avgRating: 4.9,
    growthRate: 28.1,
  },
  {
    name: "Moving Help",
    icon: "📦",
    totalServices: 98,
    avgPrice: 95,
    avgRating: 4.5,
    growthRate: 15.3,
  },
];

// Platform statistics
export const platformStats = {
  totalUsers: 15247,
  totalProviders: 4892,
  totalBookings: 89456,
  totalRevenue: 2847593,
  avgRating: 4.7,
  repeatCustomerRate: 73.2,
  onTimeRate: 94.5,
  customerSatisfaction: 96.8,
};

// Testimonials
export const testimonials = [
  {
    id: "testimonial-001",
    userId: "user-001",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Loconomy has been a game-changer for our family. Finding reliable, vetted professionals in our area used to be such a hassle. Now I can book services with confidence knowing they're background-checked and highly rated.",
    location: "San Francisco, CA",
    serviceUsed: "House Cleaning",
  },
  {
    id: "testimonial-002",
    userId: "user-002",
    name: "Marcus Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "As a service provider, Loconomy has helped me grow my business significantly. The platform makes it easy to connect with customers who value quality work, and the payment system is seamless.",
    location: "San Francisco, CA",
    serviceUsed: "Handyman Services",
  },
  {
    id: "testimonial-003",
    userId: "user-004",
    name: "David Thompson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Moving to a new city can be overwhelming, but Loconomy made it so much easier to find trusted local services. The verification process gives me peace of mind that I'm working with legitimate professionals.",
    location: "San Francisco, CA",
    serviceUsed: "Multiple Services",
  },
];
