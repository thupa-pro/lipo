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

// Client-side utilities
export function useListingsClient() {
  const supabase = createClientClient();

  return {
    async getProviderListings(providerId: string): Promise<Listing[]> {
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
    },

    async getListing(listingId: string): Promise<Listing | null> {
      const { data, error } = await supabase
        .from("service_listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (error || !data) return null;
      return data as Listing;
    },

    async createListing(
      providerId: string,
      formData: ListingFormData,
    ): Promise<{ success: boolean; id?: string; error?: string }> {
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
    },

    async updateListing(
      listingId: string,
      formData: Partial<ListingFormData>,
    ): Promise<{ success: boolean; error?: string }> {
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
    },

    async deleteListing(
      listingId: string,
    ): Promise<{ success: boolean; error?: string }> {
      const { error } = await supabase
        .from("service_listings")
        .delete()
        .eq("id", listingId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    },

    async updateListingStatus(
      listingId: string,
      status: ListingStatus,
    ): Promise<{ success: boolean; error?: string }> {
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
    },

    async searchListings(filters: SearchFilters): Promise<SearchResult> {
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
    },
  };
}

// Validation helpers
export function validateListingData(
  data: Partial<ListingFormData>,
): ListingValidationError[] {
  const errors: ListingValidationError[] = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push({
      field: "title",
      message: "Title must be at least 5 characters long",
    });
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.push({
      field: "description",
      message: "Description must be at least 20 characters long",
    });
  }

  if (!data.category) {
    errors.push({
      field: "category",
      message: "Category is required",
    });
  }

  if (!data.subcategory) {
    errors.push({
      field: "subcategory",
      message: "Subcategory is required",
    });
  }

  if (data.base_price !== undefined && data.base_price < 0) {
    errors.push({
      field: "base_price",
      message: "Base price must be a positive number",
    });
  }

  if (!data.service_areas || data.service_areas.length === 0) {
    errors.push({
      field: "service_areas",
      message: "At least one service area is required",
    });
  }

  return errors;
}

// Helper functions
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function getListingStatusColor(status: ListingStatus): string {
  switch (status) {
    case "active":
      return "green";
    case "draft":
      return "gray";
    case "paused":
      return "yellow";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
}

export function getListingStatusLabel(status: ListingStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "draft":
      return "Draft";
    case "paused":
      return "Paused";
    case "rejected":
      return "Rejected";
    default:
      return "Unknown";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateListingUrl(listing: Listing): string {
  const slug = slugify(listing.title);
  return `/listings/${listing.id}/${slug}`;
}

// Search and filter helpers
export function buildSearchQuery(filters: SearchFilters): string {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.location) params.set("location", filters.location);
  if (filters.minPrice !== undefined)
    params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", filters.maxPrice.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.page && filters.page > 1)
    params.set("page", filters.page.toString());
  if (filters.limit && filters.limit !== 10)
    params.set("limit", filters.limit.toString());

  return params.toString();
}

export function parseSearchQuery(searchParams: URLSearchParams): SearchFilters {
  return {
    category: searchParams.get("category") || undefined,
    subcategory: searchParams.get("subcategory") || undefined,
    location: searchParams.get("location") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sortBy: (searchParams.get("sortBy") as any) || "created_at",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };
}

// Category helpers (these would typically come from a categories config)
export const CATEGORIES = [
  "Home & Garden",
  "Health & Wellness",
  "Business Services",
  "Personal Care",
  "Events & Entertainment",
  "Automotive",
  "Technology",
  "Education",
] as const;

export const SUBCATEGORIES: Record<string, string[]> = {
  "Home & Garden": [
    "Cleaning",
    "Landscaping",
    "Repairs & Maintenance",
    "Interior Design",
    "Pest Control",
  ],
  "Health & Wellness": [
    "Personal Training",
    "Massage Therapy",
    "Nutrition Counseling",
    "Mental Health",
  ],
  "Business Services": [
    "Accounting",
    "Legal Services",
    "Marketing",
    "Consulting",
    "Web Development",
  ],
  "Personal Care": ["Hair & Beauty", "Pet Care", "Childcare", "Elder Care"],
  "Events & Entertainment": [
    "Photography",
    "Catering",
    "Music & DJ",
    "Event Planning",
  ],
  Automotive: ["Car Repair", "Car Washing", "Towing", "Inspection"],
  Technology: ["Computer Repair", "Phone Repair", "IT Support", "Setup"],
  Education: ["Tutoring", "Music Lessons", "Language Learning", "Test Prep"],
};

export function getCategorySubcategories(category: string): string[] {
  return SUBCATEGORIES[category] || [];
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'published':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'pending':
    case 'draft':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'inactive':
    case 'archived':
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    case 'rejected':
    case 'suspended':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
}

export function getStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'pending':
      return 'Pending Review';
    case 'draft':
      return 'Draft';
    case 'inactive':
      return 'Inactive';
    case 'archived':
      return 'Archived';
    case 'rejected':
      return 'Rejected';
    case 'suspended':
      return 'Suspended';
    case 'published':
      return 'Published';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function formatPricingDisplay(pricing: any): string {
  if (!pricing) return 'Contact for pricing';
  
  if (typeof pricing === 'string') return pricing;
  
  if (pricing.type === 'fixed') {
    return `$${pricing.amount}`;
  }
  
  if (pricing.type === 'range') {
    return `$${pricing.min} - $${pricing.max}`;
  }
  
  if (pricing.type === 'hourly') {
    return `$${pricing.rate}/hour`;
  }
  
  return 'Contact for pricing';
}

export function validateListingForm(data: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }
  
  if (!data.category) {
    errors.category = 'Please select a category';
  }
  
  if (!data.location) {
    errors.location = 'Please provide a location';
  }
  
  if (!data.pricing || !data.pricing.type) {
    errors.pricing = 'Please specify pricing information';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
