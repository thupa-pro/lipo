import { createClient } from "@/lib/supabase/server";
import { createClient as createClientClient } from "@/lib/supabase/client";
import {
  Listing,
  ListingFormData,
  ListingStats,
  SearchFilters,
  SearchResult,
  ListingStatus,
  ListingValidationError,
} from "./types";

// Server-side utilities
export async function getProviderListings(
  providerId: string,
): Promise<Listing[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_listings")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching provider listings:", error);
    return [];
  }

  return data || [];
}

export async function getListing(listingId: string): Promise<Listing | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (error || !data) return null;
  return data as Listing;
}

export async function getListingStats(
  providerId: string,
): Promise<ListingStats | null> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_listing_stats", {
    p_provider_id: providerId,
  });

  if (error || !data) return null;
  return data as ListingStats;
}

export async function searchListings(
  filters: SearchFilters,
): Promise<SearchResult[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("search_listings", {
    p_query: filters.query || null,
    p_category: filters.category || null,
    p_location_type: filters.location_type || null,
    p_max_price: filters.max_price || null,
    p_limit: filters.limit || 20,
    p_offset: filters.offset || 0,
  });

  if (error) {
    console.error("Error searching listings:", error);
    return [];
  }

  return data || [];
}

export async function recordListingView(
  listingId: string,
  viewerIp?: string,
  userAgent?: string,
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.rpc("record_listing_view", {
    p_listing_id: listingId,
    p_viewer_ip: viewerIp || null,
    p_user_agent: userAgent || null,
  });

  return !error;
}

// Client-side utilities
export function useListingsClient() {
  const supabase = createClientClient();

  return {
    async getListings(providerId?: string): Promise<Listing[]> {
      let query = supabase
        .from("service_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (providerId) {
        query = query.eq("provider_id", providerId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }

      return data || [];
    },

    async getListing(listingId: string): Promise<Listing | null> {
      const { data, error } = await supabase
        .from("service_listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (error) {
        console.error("Error fetching listing:", error);
        return null;
      }

      return data as Listing;
    },

    async createListing(formData: ListingFormData): Promise<Listing | null> {
      const { data, error } = await supabase
        .from("service_listings")
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory,
          tags: formData.tags,
          pricing_type: formData.pricing_type,
          base_price: formData.base_price,
          hourly_rate: formData.hourly_rate,
          minimum_hours: formData.minimum_hours,
          duration_minutes: formData.duration_minutes,
          location_type: formData.location_type,
          service_area: formData.service_area,
          max_bookings_per_day: formData.max_bookings_per_day,
          advance_booking_days: formData.advance_booking_days,
          cancellation_policy: formData.cancellation_policy,
          status: formData.status,
          images: formData.existing_images || [],
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating listing:", error);
        throw error;
      }

      return data as Listing;
    },

    async updateListing(
      listingId: string,
      formData: ListingFormData,
    ): Promise<Listing | null> {
      const { data, error } = await supabase
        .from("service_listings")
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory,
          tags: formData.tags,
          pricing_type: formData.pricing_type,
          base_price: formData.base_price,
          hourly_rate: formData.hourly_rate,
          minimum_hours: formData.minimum_hours,
          duration_minutes: formData.duration_minutes,
          location_type: formData.location_type,
          service_area: formData.service_area,
          max_bookings_per_day: formData.max_bookings_per_day,
          advance_booking_days: formData.advance_booking_days,
          cancellation_policy: formData.cancellation_policy,
          status: formData.status,
          images: formData.existing_images || [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", listingId)
        .select()
        .single();

      if (error) {
        console.error("Error updating listing:", error);
        throw error;
      }

      return data as Listing;
    },

    async deleteListing(listingId: string): Promise<boolean> {
      const { error } = await supabase
        .from("service_listings")
        .delete()
        .eq("id", listingId);

      if (error) {
        console.error("Error deleting listing:", error);
        throw error;
      }

      return true;
    },

    async updateListingStatus(
      listingId: string,
      status: ListingStatus,
    ): Promise<boolean> {
      const { error } = await supabase.rpc("update_listing_status", {
        p_listing_id: listingId,
        p_status: status,
      });

      if (error) {
        console.error("Error updating listing status:", error);
        throw error;
      }

      return true;
    },

    async getStats(providerId: string): Promise<ListingStats | null> {
      const { data, error } = await supabase.rpc("get_listing_stats", {
        p_provider_id: providerId,
      });

      if (error) {
        console.error("Error fetching listing stats:", error);
        return null;
      }

      return data as ListingStats;
    },

    async searchListings(filters: SearchFilters): Promise<SearchResult[]> {
      const { data, error } = await supabase.rpc("search_listings", {
        p_query: filters.query || null,
        p_category: filters.category || null,
        p_location_type: filters.location_type || null,
        p_max_price: filters.max_price || null,
        p_limit: filters.limit || 20,
        p_offset: filters.offset || 0,
      });

      if (error) {
        console.error("Error searching listings:", error);
        throw error;
      }

      return data || [];
    },
  };
}

// Image upload utilities
export async function uploadListingImage(
  file: File,
  listingId: string,
): Promise<string | null> {
  const supabase = createClientClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${listingId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("listing-images")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("listing-images").getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteListingImage(imageUrl: string): Promise<boolean> {
  const supabase = createClientClient();

  // Extract file path from URL
  const url = new URL(imageUrl);
  const filePath = url.pathname.split("/").slice(-2).join("/"); // Get listing-id/filename.ext

  const { error } = await supabase.storage
    .from("listing-images")
    .remove([filePath]);

  return !error;
}

// Validation utilities
export function validateListingForm(
  data: ListingFormData,
): ListingValidationError[] {
  const errors: ListingValidationError[] = [];

  if (!data.title.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.length < 10) {
    errors.push({
      field: "title",
      message: "Title must be at least 10 characters",
    });
  } else if (data.title.length > 100) {
    errors.push({
      field: "title",
      message: "Title must be less than 100 characters",
    });
  }

  if (!data.description.trim()) {
    errors.push({ field: "description", message: "Description is required" });
  } else if (data.description.length < 50) {
    errors.push({
      field: "description",
      message: "Description must be at least 50 characters",
    });
  } else if (data.description.length > 2000) {
    errors.push({
      field: "description",
      message: "Description must be less than 2000 characters",
    });
  }

  if (!data.category) {
    errors.push({ field: "category", message: "Category is required" });
  }

  // Pricing validation
  if (data.pricing_type === "hourly") {
    if (!data.hourly_rate || data.hourly_rate <= 0) {
      errors.push({
        field: "hourly_rate",
        message: "Hourly rate must be greater than 0",
      });
    }
    if (data.minimum_hours && data.minimum_hours < 1) {
      errors.push({
        field: "minimum_hours",
        message: "Minimum hours must be at least 1",
      });
    }
  } else if (data.pricing_type === "fixed") {
    if (!data.base_price || data.base_price <= 0) {
      errors.push({
        field: "base_price",
        message: "Fixed price must be greater than 0",
      });
    }
  }

  // Duration validation for fixed pricing
  if (
    data.pricing_type === "fixed" &&
    data.duration_minutes &&
    data.duration_minutes < 15
  ) {
    errors.push({
      field: "duration_minutes",
      message: "Duration must be at least 15 minutes",
    });
  }

  // Booking settings validation
  if (
    data.max_bookings_per_day &&
    (data.max_bookings_per_day < 1 || data.max_bookings_per_day > 50)
  ) {
    errors.push({
      field: "max_bookings_per_day",
      message: "Max bookings per day must be between 1 and 50",
    });
  }

  if (
    data.advance_booking_days &&
    (data.advance_booking_days < 1 || data.advance_booking_days > 365)
  ) {
    errors.push({
      field: "advance_booking_days",
      message: "Advance booking days must be between 1 and 365",
    });
  }

  return errors;
}

// Formatting utilities
export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPricingDisplay(listing: Listing): string {
  if (listing.pricing_type === "hourly" && listing.hourly_rate) {
    return `${formatPrice(listing.hourly_rate)}/hour`;
  } else if (listing.pricing_type === "fixed" && listing.base_price) {
    return formatPrice(listing.base_price);
  } else {
    return "Custom pricing";
  }
}

export function getStatusColor(status: ListingStatus): string {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-100";
    case "draft":
      return "text-gray-600 bg-gray-100";
    case "paused":
      return "text-yellow-600 bg-yellow-100";
    case "inactive":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

export function getStatusText(status: ListingStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "draft":
      return "Draft";
    case "paused":
      return "Paused";
    case "inactive":
      return "Inactive";
    default:
      return "Unknown";
  }
}
