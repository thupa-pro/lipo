import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar as CalendarIcon, CreditCard, MessageCircle, AlertCircle, Heart, Sparkles, Award, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface Provider {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  avatar: string;
  verified: boolean;
  specialty: string;
  badges: string[];
  responseTime: string;
  completedJobs: number;
}

interface BookingConfirmationProps {
  provider: Provider;
  onConfirm: (bookingDetails: any) => void;
  onCancel: () => void;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const serviceDurations = [
  { label: "1 hour", value: 1, price: 1 },
  { label: "2 hours", value: 2, price: 2 },
  { label: "3 hours", value: 3, price: 3 },
  { label: "4 hours", value: 4, price: 4 },
  { label: "Half day (4+ hours)", value: 5, price: 5 },
  { label: "Full day", value: 8, price: 8 },
];

export default function BookingConfirmation({
  provider,
  onConfirm,
  onCancel,
}: BookingConfirmationProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const selectedDurationObj = serviceDurations.find(
    (d) => d.value.toString() === selectedDuration,
  );

  const subtotal = selectedDurationObj
    ? provider.hourlyRate * selectedDurationObj.price
    : 0;
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + serviceFee;

  const isFormValid = selectedDate && selectedTime && selectedDuration;

  const handleConfirmBooking = async () => {
    if (!isFormValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsConfirming(true);

    try {
      // Simulate booking confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const bookingDetails = {
        provider,
        date: selectedDate,
        time: selectedTime,
        duration: selectedDurationObj,
        specialRequests,
        pricing: {
          subtotal,
          serviceFee,
          total,
        },
      };

      onConfirm(bookingDetails);

      toast({
        title: "🎉 Booking Confirmed!",
        description: `Your appointment with ${provider.name} has been scheduled`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  // Disable past dates and weekends for demo
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-6">
            <UIIcons.CheckCircle className="w-4 h-4 text-emerald-500" / />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Secure Booking Process
            </span>
            <OptimizedIcon name="Shield" className="w-4 h-4 text-emerald-500" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Confirm Your Booking
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-gray-300">
            Review details and schedule your service appointment
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Provider Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-20 h-20 border-4 border-white dark:border-white/20 shadow-lg">
                      <AvatarImage src={provider.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white font-bold text-xl">
                        {provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {provider.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center">
                        <OptimizedIcon name="Shield" className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1">{provider.name}</h3>
                  <p className="text-slate-600 dark:text-gray-300 mb-2">
                    {provider.service}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
                    {provider.specialty}
                  </p>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <OptimizedIcon name="Star" className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{provider.rating}</span>
                      <span className="text-slate-500 text-sm">
                        ({provider.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BusinessIcons.MapPin className="w-4 h-4 text-slate-500" / />
                      <span className="text-sm text-slate-500">
                        {provider.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mb-6">
                    {provider.badges.slice(0, 3).map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-gray-400">
                        Hourly Rate:
                      </span>
                      <span className="font-bold text-lg">
                        ${provider.hourlyRate}/hr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-gray-400">
                        Response Time:
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {provider.responseTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-gray-400">
                        Jobs Completed:
                      </span>
                      <span className="font-semibold">
                        {provider.completedJobs}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-slate-300 dark:border-white/20"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Provider
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-slate-300 dark:border-white/20"
                  >
                    <OptimizedIcon name="Phone" className="w-4 h-4 mr-2" />
                    Call Provider
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-violet-400" />
                      Select Date
                    </h3>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full sm:w-auto justify-start text-left font-normal h-12 rounded-2xl",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setCalendarOpen(false);
                          }}
                          disabled={disabledDates}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {selectedDate && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                        ✓ {format(selectedDate, "EEEE, MMMM, do, yyyy")}
                      </p>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <OptimizedIcon name="Clock" className="w-5 h-5 text-blue-600 dark:text-violet-400" />
                      Select Time
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className={cn(
                            "rounded-2xl transition-all duration-300",
                            selectedTime === time
                              ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg"
                              : "border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10",
                          )}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    {selectedTime && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                        ✓ {selectedTime} selected
                      </p>
                    )}
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-violet-400" />
                      Service Duration
                    </h3>
                    <Select
                      value={selectedDuration}
                      onValueChange={setSelectedDuration}
                    >
                      <SelectTrigger className="rounded-2xl border-slate-200 dark:border-white/20 h-12">
                        <SelectValue placeholder="Choose duration" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {serviceDurations.map((duration) => (
                          <SelectItem
                            key={duration.value}
                            value={duration.value.toString()}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{duration.label}</span>
                              <span className="ml-4 font-semibold">
                                ${provider.hourlyRate * duration.price}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedDurationObj && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                        ✓ {selectedDurationObj.label} - $
                        {provider.hourlyRate * selectedDurationObj.price}
                      </p>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-600 dark:text-violet-400" />
                      Special Requests (Optional)
                    </h3>
                    <textarea
                      placeholder="Any specific requirements or notes for the provider..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full h-24 p-4 rounded-2xl border border-slate-200 dark:border-white/20 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    />
                  </div>

                  {/* Pricing Summary */}
                  {selectedDurationObj && (
                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 rounded-2xl p-6 border border-blue-200/50 dark:border-white/10">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-violet-400" />
                        Pricing Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Service ({selectedDurationObj.label})</span>
                          <span className="font-semibold">${subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600 dark:text-gray-400">
                          <span>Service Fee (5%)</span>
                          <span>${serviceFee}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-blue-600 dark:text-violet-400">
                            ${total}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Validation Alert */}
                  {!isFormValid && (
                    <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-700 dark:text-amber-300">
                        Please select a, date, time, and duration to continue
                        with your booking.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                    <Button
                      variant="outline"
                      onClick={onCancel}
                      className="w-full sm:w-auto rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmBooking}
                      disabled={!isFormValid || isConfirming}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg h-12"
                    >
                      {isConfirming ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Confirming Booking...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Confirm Booking ${total}
                          <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-white/10">
            <div className="flex items-center gap-2">
              <OptimizedIcon name="Shield" className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600 dark:text-gray-300">
                Secure Payment
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UIIcons.CheckCircle className="w-5 h-5 text-blue-500" / />
              <span className="text-sm text-slate-600 dark:text-gray-300">
                Instant Confirmation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-slate-600 dark:text-gray-300">
                Satisfaction Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
