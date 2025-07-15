export type ListingStatus = "draft" | "active" | "paused" | "inactive";
export type PricingType = "hourly" | "fixed" | "custom";
export type LocationType = "on_site" | "remote" | "both";

export interface Listing {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];

  // Pricing
  pricing_type: PricingType;
  base_price?: number;
  hourly_rate?: number;
  minimum_hours?: number;

  // Service details
  duration_minutes?: number;
  location_type: LocationType;
  service_area?: {
    type: "radius" | "specific_areas";
    radius?: number;
    areas?: string[];
    coordinates?: { lat: number; lng: number };
  };

  // Media
  images: string[];
  featured_image?: string;

  // Booking settings
  max_bookings_per_day?: number;
  advance_booking_days?: number;
  cancellation_policy?: string;

  // Status and metrics
  status: ListingStatus;
  is_featured: boolean;
  view_count: number;
  booking_count: number;

  // Metadata
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
}

export interface ListingView {
  id: string;
  listing_id: string;
  viewer_id?: string;
  viewer_ip?: string;
  user_agent?: string;
  viewed_at: string;
}

export interface ListingStats {
  total_listings: number;
  active_listings: number;
  draft_listings: number;
  total_views: number;
  total_bookings: number;
}

export interface ListingFormData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  pricing_type: PricingType;
  base_price?: number;
  hourly_rate?: number;
  minimum_hours?: number;
  duration_minutes?: number;
  location_type: LocationType;
  service_area?: {
    type: "radius" | "specific_areas";
    radius?: number;
    areas?: string[];
    coordinates?: { lat: number; lng: number };
  };
  max_bookings_per_day?: number;
  advance_booking_days?: number;
  cancellation_policy?: string;
  status: ListingStatus;
  images?: File[];
  existing_images?: string[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location_type?: LocationType;
  max_price?: number;
  pricing_type?: PricingType;
  sort_by?: "relevance" | "price_low" | "price_high" | "newest" | "popular";
  limit?: number;
  offset?: number;
}

export interface SearchResult extends Listing {
  rank?: number;
  provider_name?: string;
  provider_rating?: number;
}

// Service categories for listings
export const LISTING_CATEGORIES = [
  "Home Maintenance",
  "Cleaning Services",
  "Landscaping",
  "Pet Care",
  "Personal Training",
  "Tutoring",
  "Photography",
  "Event Planning",
  "Auto Services",
  "Beauty & Wellness",
  "Tech Support",
  "Moving Services",
  "Childcare",
  "Elder Care",
  "Food Services",
  "Handyman",
  "Plumbing",
  "Electrical",
  "HVAC",
  "Painting",
  "Other",
] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

// Subcategories for common categories
export const SUBCATEGORIES: Record<string, string[]> = {
  "Home Maintenance": [
    "General Repairs",
    "Appliance Repair",
    "Furniture Assembly",
    "Door/Window Repair",
    "Drywall Repair",
  ],
  "Cleaning Services": [
    "House Cleaning",
    "Office Cleaning",
    "Carpet Cleaning",
    "Window Cleaning",
    "Deep Cleaning",
  ],
  Landscaping: [
    "Lawn Mowing",
    "Garden Design",
    "Tree Trimming",
    "Snow Removal",
    "Irrigation",
  ],
  "Pet Care": [
    "Dog Walking",
    "Pet Sitting",
    "Grooming",
    "Training",
    "Veterinary",
  ],
  "Personal Training": [
    "Fitness Training",
    "Yoga Instruction",
    "Nutrition Coaching",
    "Sports Coaching",
    "Dance Instruction",
  ],
  Tutoring: [
    "Math Tutoring",
    "Language Tutoring",
    "Test Prep",
    "Music Lessons",
    "Art Lessons",
  ],
  Photography: [
    "Portrait Photography",
    "Event Photography",
    "Product Photography",
    "Real Estate Photography",
    "Video Services",
  ],
  "Event Planning": [
    "Wedding Planning",
    "Party Planning",
    "Corporate Events",
    "Catering",
    "Entertainment",
  ],
  "Auto Services": [
    "Car Repair",
    "Oil Changes",
    "Car Wash",
    "Tire Services",
    "Mobile Mechanic",
  ],
  "Beauty & Wellness": [
    "Hair Styling",
    "Massage Therapy",
    "Nail Services",
    "Skin Care",
    "Makeup Services",
  ],
};

// Form validation schemas
export interface ListingValidationError {
  field: string;
  message: string;
}

export interface ListingFormProps {
  listing?: Listing;
  onSubmit: (data: ListingFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ListingsTableProps {
  listings: Listing[];
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
  onStatusChange: (listingId: string, status: ListingStatus) => void;
  onView: (listing: Listing) => void;
  isLoading?: boolean;
}

export interface ListingCardProps {
  listing: Listing;
  onView?: (listing: Listing) => void;
  onEdit?: (listing: Listing) => void;
  onDelete?: (listingId: string) => void;
  showActions?: boolean;
  className?: string;
}
