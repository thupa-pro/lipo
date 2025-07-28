import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, CreditCard, Check, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isSameDay, isAfter, isBefore } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
  duration: number;
  id: string;
}

interface BookingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  current: boolean;
}

interface BookingStepperProps {
  serviceId: string;
  providerId: string;
  serviceName: string;
  providerName: string;
  basePrice: number;
  currency: string;
  onBookingComplete: (bookingData: any) => void;
  onCancel: () => void;
  className?: string;
}

export function BookingStepper({
  serviceId,
  providerId,
  serviceName,
  providerName,
  basePrice,
  currency,
  onBookingComplete,
  onCancel,
  className
}: BookingStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    location: "",
    notes: "",
    contactPhone: "",
    emergencyContact: "",
    specialRequests: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps: BookingStep[] = [
    {
      id: "datetime",
      title: "Select Date & Time",
      description: "Choose when you need the service",
      icon: CalendarIcon,
      completed: selectedDate !== undefined && selectedSlot !== null,
      current: currentStep === 0
    },
    {
      id: "details",
      title: "Service Details",
      description: "Provide location and requirements",
      icon: MapPin,
      completed: bookingDetails.location.length > 0,
      current: currentStep === 1
    },
    {
      id: "contact",
      title: "Contact Info",
      description: "Confirm your contact details",
      icon: User,
      completed: bookingDetails.contactPhone.length > 0,
      current: currentStep === 2
    },
    {
      id: "payment",
      title: "Payment",
      description: "Secure payment and confirmation",
      icon: CreditCard,
      completed: paymentMethod.length > 0 && agreedToTerms,
      current: currentStep === 3
    }
  ];

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      // Simulate API call for available slots
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real, app, this would come from API
      const mockSlots: TimeSlot[] = [
        { id: "1", time: "09:00", available: true, duration: 60, price: basePrice },
        { id: "2", time: "10:30", available: true, duration: 60, price: basePrice },
        { id: "3", time: "12:00", available: false, duration: 60, price: basePrice },
        { id: "4", time: "14:00", available: true, duration: 60, price: basePrice + 10 },
        { id: "5", time: "15:30", available: true, duration: 60, price: basePrice },
        { id: "6", time: "17:00", available: true, duration: 60, price: basePrice + 15 }
      ];
      
      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot || !agreedToTerms) return;

    setIsProcessing(true);
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        serviceId,
        providerId,
        date: selectedDate,
        timeSlot: selectedSlot,
        details: bookingDetails,
        paymentMethod,
        totalPrice: selectedSlot.price || basePrice
      };
      
      onBookingComplete(bookingData);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedDate && selectedSlot;
      case 1:
        return bookingDetails.location.length > 0;
      case 2:
        return bookingDetails.contactPhone.length > 0;
      case 3:
        return paymentMethod.length > 0 && agreedToTerms;
      default:
        return false;
    }
  };

  const totalPrice = selectedSlot?.price || basePrice;

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Book {serviceName}</h2>
            <p className="text-muted-foreground">with {providerName}</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {currency}{totalPrice}
          </Badge>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 min-w-0 flex-shrink-0">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                step.completed ? "bg-primary border-primary text-primary-foreground" :
                step.current ? "border-primary text-primary" :
                "border-muted text-muted-foreground"
              )}>
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className={cn(
                  "font-medium text-sm",
                  step.current ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {step.description}
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const IconComponent = steps[currentStep].icon;
              return <IconComponent className="w-5 h-5" />;
            })()}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 0: Date & Time Selection */}
          {currentStep === 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    isBefore(date, new Date()) || 
                    isAfter(date, addDays(new Date(), 30))
                  }
                  className="rounded-md border"
                />
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Available Times
                  {selectedDate && (
                    <span className="text-sm text-muted-foreground ml-2">
                      for {format(selectedDate, "MMM, dd, yyyy")}
                    </span>
                  )}
                </Label>
                
                {isLoadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <UIIcons.Loader2 className="w-6 h-6 animate-spin" / />
                    <span className="ml-2 text-muted-foreground">Loading slots...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className="flex flex-col h-auto py-3"
                      >
                        <span className="font-medium">{slot.time}</span>
                        <span className="text-xs opacity-70">
                          {slot.duration}min • {currency}{slot.price || basePrice}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Service Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Service Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter the address where service is needed"
                  value={bookingDetails.location}
                  onChange={(e) => setBookingDetails({
                    ...bookingDetails,
                    location: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Special Requirements</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific needs or instructions for the provider"
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails({
                    ...bookingDetails,
                    notes: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Contact Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={bookingDetails.contactPhone}
                  onChange={(e) => setBookingDetails({
                    ...bookingDetails,
                    contactPhone: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  placeholder="Emergency contact (optional)"
                  value={bookingDetails.emergencyContact}
                  onChange={(e) => setBookingDetails({
                    ...bookingDetails,
                    emergencyContact: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-muted/30 rounded-lg p-4 border">
                <h3 className="font-medium mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-medium">{providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, "MMM, dd, yyyy")} at {selectedSlot?.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedSlot?.duration} minutes</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{currency}{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <Label className="text-base font-medium mb-3 block">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>. I understand that payment will be processed securely.
                </Label>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                <OptimizedIcon name="Shield" className="w-4 h-4 text-green-600" />
                <span>Your payment is protected by 256-bit SSL encryption</span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation Buttons */}
        <div className="p-6 border-t flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onCancel : handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 0 ? "Cancel" : "Back"}
          </Button>

          <Button
            onClick={currentStep === steps.length - 1 ? handleBookingSubmit : handleNext}
            disabled={!canProceed() || isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <UIIcons.Loader2 className="w-4 h-4 animate-spin" / />
                Processing...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                <CreditCard className="w-4 h-4" />
                Complete Booking
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}