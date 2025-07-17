import {
  Listing,
  ListingFormData,
  ListingStatus,
  ListingValidationError,
} from "./types";

// Validation utilities (shared between client and server)
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

// Formatting utilities (shared between client and server)
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
