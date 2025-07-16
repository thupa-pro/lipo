"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Booking,
  BookingFormData,
  BookingStatus,
  ProviderAvailability,
  AvailabilityOverride,
  AvailabilityFormData,
  AvailabilityOverrideFormData,
  AvailableSlot,
  BookingStatsResponse,
  BookingFilters,
  CalendarDay,
  DayOfWeek,
  BookingMessage,
  BookingReview,
} from "./types";

export class BookingClient {
  private supabase = createClient();

  // Booking CRUD operations
  async createBooking(data: BookingFormData): Promise<string> {
    const { data: result, error } = await this.supabase.rpc("create_booking", {
      p_listing_id: data.listing_id,
      p_customer_id: (await this.supabase.auth.getUser()).data.user?.id,
      p_booking_date: data.booking_date,
      p_start_time: data.start_time,
      p_duration_minutes: data.duration_minutes,
      p_special_requests: data.special_requests,
    });

    if (error) throw error;
    return result;
  }

  async getBooking(bookingId: string): Promise<Booking | null> {
    const { data, error } = await this.supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return data;
  }

  async getBookings(filters: BookingFilters = {}): Promise<Booking[]> {
    let query = this.supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (filters.status?.length) {
      query = query.in("status", filters.status);
    }

    if (filters.date_from) {
      query = query.gte("booking_date", filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte("booking_date", filters.date_to);
    }

    if (filters.provider_id) {
      query = query.eq("provider_id", filters.provider_id);
    }

    if (filters.customer_id) {
      query = query.eq("customer_id", filters.customer_id);
    }

    if (filters.listing_id) {
      query = query.eq("listing_id", filters.listing_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    notes?: string,
  ): Promise<boolean> {
    const { data, error } = await this.supabase.rpc("update_booking_status", {
      p_booking_id: bookingId,
      p_new_status: newStatus,
      p_notes: notes,
    });

    if (error) throw error;
    return data;
  }

  async getBookingsByConfirmationCode(code: string): Promise<Booking | null> {
    const { data, error } = await this.supabase
      .from("bookings")
      .select("*")
      .eq("confirmation_code", code)
      .single();

    if (error) return null;
    return data;
  }

  // Provider availability management
  async getProviderAvailability(
    providerId: string,
  ): Promise<ProviderAvailability[]> {
    const { data, error } = await this.supabase
      .from("provider_availability")
      .select("*")
      .eq("provider_id", providerId)
      .order("day_of_week");

    if (error) throw error;
    return data || [];
  }

  async setProviderAvailability(
    providerId: string,
    availability: AvailabilityFormData[],
  ): Promise<boolean> {
    // Delete existing availability
    await this.supabase
      .from("provider_availability")
      .delete()
      .eq("provider_id", providerId);

    // Insert new availability
    const availabilityData = availability.map((item) => ({
      provider_id: providerId,
      ...item,
    }));

    const { error } = await this.supabase
      .from("provider_availability")
      .insert(availabilityData);

    if (error) throw error;
    return true;
  }

  async addAvailabilityOverride(
    providerId: string,
    override: AvailabilityOverrideFormData,
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from("availability_overrides")
      .insert({
        provider_id: providerId,
        ...override,
      });

    if (error) throw error;
    return true;
  }

  async getAvailabilityOverrides(
    providerId: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<AvailabilityOverride[]> {
    let query = this.supabase
      .from("availability_overrides")
      .select("*")
      .eq("provider_id", providerId)
      .order("date");

    if (dateFrom) {
      query = query.gte("date", dateFrom);
    }

    if (dateTo) {
      query = query.lte("date", dateTo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async removeAvailabilityOverride(overrideId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("availability_overrides")
      .delete()
      .eq("id", overrideId);

    if (error) throw error;
    return true;
  }

  // Availability checking
  async checkAvailability(
    providerId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const { data, error } = await this.supabase.rpc(
      "check_provider_availability",
      {
        p_provider_id: providerId,
        p_date: date,
        p_start_time: startTime,
        p_end_time: endTime,
      },
    );

    if (error) throw error;
    return data;
  }

  async getAvailableSlots(
    providerId: string,
    date: string,
    slotDurationMinutes: number = 60,
  ): Promise<AvailableSlot[]> {
    const { data, error } = await this.supabase.rpc("get_available_slots", {
      p_provider_id: providerId,
      p_date: date,
      p_slot_duration_minutes: slotDurationMinutes,
    });

    if (error) throw error;
    return data || [];
  }

  // Calendar data
  async getCalendarData(
    providerId: string,
    year: number,
    month: number,
  ): Promise<CalendarDay[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const dateFrom = startDate.toISOString().split("T")[0];
    const dateTo = endDate.toISOString().split("T")[0];

    // Get bookings for the month
    const bookings = await this.getBookings({
      provider_id: providerId,
      date_from: dateFrom,
      date_to: dateTo,
    });

    // Get availability overrides
    const overrides = await this.getAvailabilityOverrides(
      providerId,
      dateFrom,
      dateTo,
    );

    // Get provider's regular availability
    const regularAvailability = await this.getProviderAvailability(providerId);

    // Build calendar days
    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split("T")[0];

    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = this.getDayOfWeek(date.getDay());

      // Get bookings for this date
      const dayBookings = bookings.filter((b) => b.booking_date === dateStr);

      // Check if provider has availability this day
      const hasRegularAvailability = regularAvailability.some(
        (a) => a.day_of_week === dayOfWeek && a.is_available,
      );

      const hasOverride = overrides.some((o) => o.date === dateStr);
      const overrideAvailable = overrides
        .filter((o) => o.date === dateStr)
        .some((o) => o.availability_type === "available");

      const hasAvailability = hasOverride
        ? overrideAvailable
        : hasRegularAvailability;

      // Get available slots for this date
      let availableSlots: AvailableSlot[] = [];
      if (hasAvailability && dateStr >= today) {
        availableSlots = await this.getAvailableSlots(providerId, dateStr);
      }

      days.push({
        date: dateStr,
        day_of_week: dayOfWeek,
        is_today: dateStr === today,
        is_past: dateStr < today,
        has_availability: hasAvailability,
        bookings: dayBookings,
        available_slots: availableSlots,
      });
    }

    return days;
  }

  // Booking statistics
  async getBookingStats(providerId?: string): Promise<BookingStatsResponse> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    const targetId = providerId || userId;

    const filters: BookingFilters = {};
    if (providerId) {
      filters.provider_id = providerId;
    } else {
      filters.customer_id = userId;
    }

    const bookings = await this.getBookings(filters);

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    return {
      total_bookings: bookings.length,
      pending_bookings: bookings.filter((b) => b.status === "pending").length,
      confirmed_bookings: bookings.filter((b) => b.status === "confirmed")
        .length,
      completed_bookings: bookings.filter((b) => b.status === "completed")
        .length,
      cancelled_bookings: bookings.filter((b) => b.status === "cancelled")
        .length,
      total_revenue: bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + b.total_amount, 0),
      this_month_bookings: bookings.filter((b) =>
        b.booking_date.startsWith(currentMonth),
      ).length,
      this_month_revenue: bookings
        .filter(
          (b) =>
            b.booking_date.startsWith(currentMonth) && b.status === "completed",
        )
        .reduce((sum, b) => sum + b.total_amount, 0),
    };
  }

  // Booking messages
  async getBookingMessages(bookingId: string): Promise<BookingMessage[]> {
    const { data, error } = await this.supabase
      .from("booking_messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at");

    if (error) throw error;
    return data || [];
  }

  async sendBookingMessage(
    bookingId: string,
    messageText: string,
    messageType: "text" | "image" | "file" = "text",
    attachments: string[] = [],
  ): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;

    const { error } = await this.supabase.from("booking_messages").insert({
      booking_id: bookingId,
      sender_id: userId,
      message_text: messageText,
      message_type: messageType,
      attachments,
    });

    if (error) throw error;
    return true;
  }

  async markMessagesAsRead(bookingId: string): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;

    const { error } = await this.supabase
      .from("booking_messages")
      .update({
        read_by: this.supabase.rpc("array_append", {
          arr: "read_by",
          elem: userId,
        }),
      })
      .eq("booking_id", bookingId)
      .not("read_by", "cs", `{${userId}}`);

    if (error) throw error;
    return true;
  }

  // Reviews
  async getBookingReviews(bookingId: string): Promise<BookingReview[]> {
    const { data, error } = await this.supabase
      .from("booking_reviews")
      .select("*")
      .eq("booking_id", bookingId);

    if (error) throw error;
    return data || [];
  }

  async createBookingReview(
    bookingId: string,
    revieweeId: string,
    rating: number,
    reviewText?: string,
    categoryRatings?: Record<string, number>,
  ): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;

    const { error } = await this.supabase.from("booking_reviews").insert({
      booking_id: bookingId,
      reviewer_id: userId,
      reviewee_id: revieweeId,
      rating,
      review_text: reviewText,
      category_ratings: categoryRatings,
    });

    if (error) throw error;
    return true;
  }

  // Utility functions
  private getDayOfWeek(dayNum: number): DayOfWeek {
    const days: DayOfWeek[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[dayNum];
  }

  // Real-time subscriptions
  subscribeToBookingUpdates(
    bookingId: string,
    callback: (payload: any) => void,
  ) {
    return this.supabase
      .channel(`booking-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `id=eq.${bookingId}`,
        },
        callback,
      )
      .subscribe();
  }

  subscribeToBookingMessages(
    bookingId: string,
    callback: (payload: any) => void,
  ) {
    return this.supabase
      .channel(`booking-messages-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "booking_messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        callback,
      )
      .subscribe();
  }
}

// Export singleton instance
export const bookingClient = new BookingClient();

// Utility hook for client components
export function useBookingClient() {
  return bookingClient;
}

// Date/time utility functions
export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getBookingStatusColor(status: BookingStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "disputed":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getBookingStatusIcon(status: BookingStatus): string {
  switch (status) {
    case "pending":
      return "⏳";
    case "confirmed":
      return "✅";
    case "in_progress":
      return "🔄";
    case "completed":
      return "🎉";
    case "cancelled":
      return "❌";
    case "disputed":
      return "⚠️";
    default:
      return "❓";
  }
}
