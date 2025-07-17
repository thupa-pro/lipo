import { createClient } from "@/lib/supabase/client";
import {
  Listing,
  ListingFormData,
  ListingStats,
  SearchFilters,
  SearchResult,
  ListingStatus,
} from "./types";

// Client-side utilities hook
export function useListingsClient() {
  const supabase = createClient();

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
  const supabase = createClient();

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
  const supabase = createClient();

  // Extract file path from URL
  const url = new URL(imageUrl);
  const filePath = url.pathname.split("/").slice(-2).join("/"); // Get listing-id/filename.ext

  const { error } = await supabase.storage
    .from("listing-images")
    .remove([filePath]);

  return !error;
}
