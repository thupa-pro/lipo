"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  CalendarIcon,
  MapPin,
  DollarSign,
  User, AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { BookingFormData, AvailableSlot } from "@/lib/booking/types";
import { Listing } from "@/lib/listings/types";
import {
  useBookingClient,
  formatTime,
  formatDuration
} from "@/lib/booking/utils";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  listing: Listing;
  onSuccess?: (bookingId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function BookingForm({
  listing,
  onSuccess,
  onCancel,
  className,
}: BookingFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [duration, setDuration] = useState<number>(60); // Default 1 hour
  const [specialRequests, setSpecialRequests] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate, duration]);

  const loadAvailableSlots = async () => {
    if (!selectedDate || !listing.provider_id) return;

    setIsLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const slots = await bookingClient.getAvailableSlots(
        listing.provider_id,
        dateStr,
        duration,
      );

      setAvailableSlots(slots);
      setSelectedSlot(null); // Reset selected slot when slots change
    } catch (error) {
      console.error("Error loading available slots:", error);
      toast({
        title: "Error",
        description: "Failed to load available time slots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const calculatePrice = () => {
    if (!listing) return 0;

    if (listing.pricing_type === "hourly") {
      return (listing.hourly_rate || 0) * (duration / 60);
    } else {
      return listing.base_price || 0;
    }
  };

  const calculateServiceFee = () => {
    return calculatePrice() * 0.05; // 5% service fee
  };

  const calculateTotal = () => {
    return calculatePrice() + calculateServiceFee();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book this service.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time slot.",
        variant: "destructive",
      });
      return;
    }

    const formData: BookingFormData = {
      listing_id: listing.id,
      booking_date: selectedDate.toISOString().split("T")[0],
      start_time: selectedSlot.start_time,
      duration_minutes: duration,
      special_requests: specialRequests.trim() || undefined,
    };

    setIsSubmitting(true);
    try {
      const bookingId = await bookingClient.createBooking(formData);

      toast({
        title: "Booking Created!",
        description: "Your booking request has been sent to the provider.",
      });

      if (onSuccess) {
        onSuccess(bookingId);
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description:
          error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSlotsByTime = availableSlots.filter(
    (slot) => slot.is_available,
  );
  const isFormValid = selectedDate && selectedSlot && duration > 0;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Book This Service
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{listing.location_type || "On-site"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>
                    {listing.pricing_type === "hourly"
                      ? `$${listing.hourly_rate}/hour`
                      : `$${listing.base_price} fixed`}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label htmlFor="duration">Service Duration</Label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={
                      (date) =>
                        date < new Date() ||
                        date < new Date(Date.now() - 86400000) // Disable past dates
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="space-y-2">
                <Label>Available Time Slots</Label>
                {isLoadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading available times...</span>
                  </div>
                ) : availableSlotsByTime.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableSlotsByTime.map((slot, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={selectedSlot === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                        className="justify-center"
                      >
                        {formatTime(slot.start_time)}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <p>No available time slots for this date.</p>
                    <p className="text-sm">Please try a different date.</p>
                  </div>
                )}
              </div>
            )}

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="special-requests">
                Special Requests (Optional)
              </Label>
              <Textarea
                id="special-requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any specific requirements or notes for the provider..."
                rows={3}
              />
            </div>

            {/* Price Breakdown */}
            {selectedSlot && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price Breakdown
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Service ({formatDuration(duration)}):</span>
                    <span>${calculatePrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (5%):</span>
                    <span>${calculateServiceFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Summary */}
            {selectedDate && selectedSlot && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Booking Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Date:</strong>{" "}
                    {format(selectedDate, "EEEE, MMMM, d, yyyy")}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(selectedSlot.start_time)}{" "}
                    - {formatTime(selectedSlot.end_time)}
                  </p>
                  <p>
                    <strong>Duration:</strong> {formatDuration(duration)}
                  </p>
                  <p>
                    <strong>Total Cost:</strong> ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  "Book Now"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
