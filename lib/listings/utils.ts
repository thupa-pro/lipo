import { createClient } from "@/lib/supabase/server";
import { Listing, ListingStats, SearchFilters, SearchResult } from "./types";

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
