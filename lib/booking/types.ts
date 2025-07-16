// Booking system types for Loconomy

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export type AvailabilityType = "available" | "booked" | "blocked" | "break";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type LocationType = "on_site" | "remote" | "both";

export interface ProviderAvailability {
  id: string;
  provider_id: string;
  day_of_week: DayOfWeek;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
  break_duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityOverride {
  id: string;
  provider_id: string;
  date: string; // YYYY-MM-DD format
  start_time?: string; // HH:MM format, null for all-day
  end_time?: string; // HH:MM format, null for all-day
  availability_type: AvailabilityType;
  reason?: string;
  created_at: string;
}

export interface ServiceAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;

  // Relationships
  listing_id: string;
  provider_id: string;
  customer_id: string;

  // Booking details
  booking_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  duration_minutes: number;

  // Service information
  service_title: string;
  service_description?: string;
  special_requests?: string;

  // Pricing
  base_price: number;
  service_fee: number;
  total_amount: number;

  // Status and metadata
  status: BookingStatus;
  confirmation_code: string;
  cancellation_reason?: string;

  // Communication
  customer_notes?: string;
  provider_notes?: string;

  // Location
  location_type?: LocationType;
  service_address?: ServiceAddress;

  // Timestamps
  confirmed_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingReview {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;

  rating: number; // 1-5
  review_text?: string;
  category_ratings?: Record<string, number>; // {communication: 5, quality: 4, etc.}

  is_verified: boolean;
  is_public: boolean;

  created_at: string;
  updated_at: string;
}

export interface BookingMessage {
  id: string;
  booking_id: string;
  sender_id: string;

  message_text: string;
  message_type: "text" | "image" | "file" | "system";
  attachments: string[];

  // System messages
  is_system_message: boolean;
  system_event_type?: string;

  // Read status
  read_by: string[];

  created_at: string;
}

export interface AvailableSlot {
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  is_available: boolean;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  day_of_week: DayOfWeek;
  is_today: boolean;
  is_past: boolean;
  has_availability: boolean;
  bookings: Booking[];
  available_slots: AvailableSlot[];
}

// Form data types
export interface BookingFormData {
  listing_id: string;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  special_requests?: string;
}

export interface AvailabilityFormData {
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  is_available: boolean;
  break_duration_minutes?: number;
}

export interface AvailabilityOverrideFormData {
  date: string;
  start_time?: string;
  end_time?: string;
  availability_type: AvailabilityType;
  reason?: string;
}

// API response types
export interface BookingCreateResponse {
  booking_id: string;
  confirmation_code: string;
  total_amount: number;
  status: BookingStatus;
}

export interface BookingStatsResponse {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  this_month_bookings: number;
  this_month_revenue: number;
}

// Calendar view types
export interface CalendarView {
  year: number;
  month: number;
  days: CalendarDay[];
  provider_id?: string; // For provider calendar view
}

// Booking filters
export interface BookingFilters {
  status?: BookingStatus[];
  date_from?: string;
  date_to?: string;
  provider_id?: string;
  customer_id?: string;
  listing_id?: string;
}

// Availability search params
export interface AvailabilitySearchParams {
  provider_id: string;
  date: string;
  duration_minutes?: number;
  preferred_times?: string[]; // Array of HH:MM strings
}

// Booking conflict resolution
export interface BookingConflict {
  type: "time_overlap" | "unavailable" | "past_date" | "outside_hours";
  message: string;
  conflicting_booking?: Booking;
  suggested_times?: AvailableSlot[];
}

// Provider dashboard data
export interface ProviderBookingDashboard {
  upcoming_bookings: Booking[];
  today_bookings: Booking[];
  pending_bookings: Booking[];
  stats: BookingStatsResponse;
  recent_reviews: BookingReview[];
  availability_gaps: AvailableSlot[];
}

// Customer booking history
export interface CustomerBookingHistory {
  upcoming_bookings: Booking[];
  past_bookings: Booking[];
  stats: {
    total_bookings: number;
    total_spent: number;
    favorite_providers: string[];
    average_rating_given: number;
  };
}

// Real-time booking updates
export interface BookingUpdate {
  booking_id: string;
  type: "status_change" | "message" | "time_change" | "cancellation";
  old_value?: any;
  new_value?: any;
  updated_by: string;
  timestamp: string;
  notification_message: string;
}

// Booking notification types
export type BookingNotificationType =
  | "booking_request"
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_reminder"
  | "booking_started"
  | "booking_completed"
  | "review_received"
  | "payment_received";

export interface BookingNotification {
  id: string;
  user_id: string;
  booking_id: string;
  type: BookingNotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
