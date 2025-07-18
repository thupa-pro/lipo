"use server";

import { createClient } from "@/lib/supabase/server";
import {
  Listing,
  ListingFormData,
  ListingStats,
  SearchFilters,
  SearchResult,
  ListingStatus,
} from "./types";

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

  const { data: listings, error: listingsError } = await supabase
    .from("service_listings")
    .select("status")
    .eq("provider_id", providerId);

  if (listingsError) return null;

  const { data: views, error: viewsError } = await supabase
    .from("listing_views")
    .select("listing_id")
    .in(
      "listing_id",
      listings?.map((l) => l.id) || [],
    );

  if (viewsError) return null;

  return {
    total: listings?.length || 0,
    active: listings?.filter((l) => l.status === "active").length || 0,
    draft: listings?.filter((l) => l.status === "draft").length || 0,
    paused: listings?.filter((l) => l.status === "paused").length || 0,
    total_views: views?.length || 0,
  };
}

export async function createListing(
  providerId: string,
  formData: ListingFormData,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_listings")
    .insert({
      provider_id: providerId,
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}

export async function updateListing(
  listingId: string,
  formData: Partial<ListingFormData>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("service_listings")
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteListing(
  listingId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("service_listings")
    .delete()
    .eq("id", listingId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateListingStatus(
  listingId: string,
  status: ListingStatus,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("service_listings")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function searchListings(
  filters: SearchFilters,
): Promise<SearchResult> {
  const supabase = createClient();

  let query = supabase
    .from("service_listings")
    .select("*")
    .eq("status", "active");

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.subcategory) {
    query = query.eq("subcategory", filters.subcategory);
  }

  if (filters.location) {
    query = query.ilike("service_areas", `%${filters.location}%`);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("base_price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("base_price", filters.maxPrice);
  }

  if (filters.sortBy) {
    const ascending = filters.sortOrder === "asc";
    query = query.order(filters.sortBy, { ascending });
  }

  const from = ((filters.page || 1) - 1) * (filters.limit || 10);
  const to = from + (filters.limit || 10) - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error searching listings:", error);
    return {
      listings: [],
      total: 0,
      page: filters.page || 1,
      totalPages: 0,
    };
  }

  return {
    listings: data || [],
    total: count || 0,
    page: filters.page || 1,
    totalPages: Math.ceil((count || 0) / (filters.limit || 10)),
  };
}