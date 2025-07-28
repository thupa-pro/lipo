import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X } from "lucide-react";
import {
  CalendarDay,
  Booking,
  ProviderAvailability,
  AvailabilityOverride,
  DayOfWeek
} from "@/lib/booking/types";
import {
  useBookingClient,
  formatTime,
  formatDuration,
  getBookingStatusColor,
  getBookingStatusIcon
} from "@/lib/booking/utils";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySettings } from "./AvailabilitySettings";
import { BookingDetailsModal } from "./BookingDetailsModal";

interface ProviderCalendarProps {
  providerId?: string;
  onBookingSelect?: (booking: Booking) => void;
}

export function ProviderCalendar({
  providerId,
  onBookingSelect,
}: ProviderCalendarProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const targetProviderId = providerId || user?.id;

  useEffect(() => {
    if (targetProviderId) {
      loadCalendarData();
    }
  }, [targetProviderId, currentDate]);

  const loadCalendarData = async () => {
    if (!targetProviderId) return;

    setIsLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const days = await bookingClient.getCalendarData(
        targetProviderId,
        year,
        month,
      );

      setCalendarDays(days);
    } catch (error) {
      console.error("Error loading calendar data:", error);
      toast({
        title: "Error",
        description: "Failed to load calendar data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    if (onBookingSelect) {
      onBookingSelect(booking);
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <div
      key={booking.id}
      className={`p-2 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity mb-1 ${getBookingStatusColor(booking.status)}`}
      onClick={() => handleBookingClick(booking)}
    >
      <div className="flex items-center gap-1 mb-1">
        <span>{getBookingStatusIcon(booking.status)}</span>
        <span className="font-medium truncate">
          {formatTime(booking.start_time)}
        </span>
      </div>
      <div className="truncate font-semibold">{booking.service_title}</div>
      <div className="text-xs opacity-75 truncate">
        {formatDuration(booking.duration_minutes)}
      </div>
    </div>
  );

  const renderCalendarDay = (day: CalendarDay, dayIndex: number) => {
    const dayNum = parseInt(day.date.split("-")[2]);
    const isCurrentMonth = day.date.startsWith(
      `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`,
    );

    return (
      <div
        key={day.date}
        className={`
          min-h-[120px] p-2 border border-gray-200 
          ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
          ${day.is_today ? "bg-blue-50 border-blue-300" : ""}
          ${day.is_past ? "opacity-60" : ""}
        `}
      >
        {/* Day number and availability indicator */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-sm font-medium ${day.is_today ? "text-blue-600" : ""}`}
          >
            {dayNum}
          </span>
          {day.has_availability && !day.is_past && (
            <div
              className="w-2 h-2 bg-green-400 rounded-full"
              title="Available"
            />
          )}
        </div>

        {/* Bookings */}
        <div className="space-y-1">
          {day.bookings.slice(0, 3).map(renderBookingCard)}
          {day.bookings.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{day.bookings.length - 3} more
            </div>
          )}
        </div>

        {/* Available slots indicator */}
        {day.available_slots.length > 0 && day.bookings.length === 0 && (
          <div className="text-xs text-green-600 mt-2">
            {day.available_slots.filter((slot) => slot.is_available).length}{" "}
            slots available
          </div>
        )}
      </div>
    );
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate grid to include previous/next month days for complete weeks
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Add previous month days to fill first week
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    0,
  );
  const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const day = previousMonth.getDate() - firstDayOfWeek + i + 1;
    const date = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth(),
      day,
    );
    return {
      date: date.toISOString().split("T")[0],
      day_of_week: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][date.getDay()] as DayOfWeek,
      is_today: false,
      is_past: true,
      has_availability: false,
      bookings: [],
      available_slots: [],
    };
  });

  // Add next month days to fill last week
  const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
  const nextMonthDaysCount = totalCells - daysInMonth - firstDayOfWeek;
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      i + 1,
    );
    return {
      date: date.toISOString().split("T")[0],
      day_of_week: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][date.getDay()] as DayOfWeek,
      is_today: false,
      is_past: false,
      has_availability: false,
      bookings: [],
      available_slots: [],
    };
  });

  const allDays = [...prevMonthDays, ...calendarDays, ...nextMonthDays];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl">{monthYear}</CardTitle>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                disabled={isLoading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                disabled={isLoading}
              >
                Today
              </Button>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <NavigationIcons.Settings className="w-4 h-4 mr-2" / />
                    Availability
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Availability Settings</DialogTitle>
                  </DialogHeader>
                  <AvailabilitySettings
                    providerId={targetProviderId!}
                    onUpdate={loadCalendarData}
                    onClose={() => setShowSettings(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {/* Week day headers */}
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-200"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {allDays.map((day, index) => renderCalendarDay(day, index))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={loadCalendarData}
        />
      )}
    </div>
  );
}
