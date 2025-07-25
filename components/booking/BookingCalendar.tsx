"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  availableDays: string[];
  onSelect: (date: Date, time: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
  urgent?: boolean;
}

export default function BookingCalendar({
  availableDays,
  onSelect,
  selectedDate,
  selectedTime,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateLocal, setSelectedDateLocal] = useState<Date | null>(selectedDate);

  const timeSlots: TimeSlot[] = [
    { time: "08:00", available: true },
    { time: "09:00", available: true },
    { time: "10:00", available: false },
    { time: "11:00", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: false },
    { time: "18:00", available: true, urgent: true },
    { time: "19:00", available: true, urgent: true },
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date >= today && availableDays.includes(dayName);
  };

  const isDateSelected = (date: Date) => {
    return selectedDateLocal && 
           date.toDateString() === selectedDateLocal.toDateString();
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateAvailable(date)) return;
    
    setSelectedDateLocal(date);
    // Clear time selection when date changes
    if (selectedTime) {
      onSelect(date, selectedTime);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDateLocal) return;
    
    onSelect(selectedDateLocal, time);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const today = new Date();
  const canGoPrev = currentMonth.getMonth() >= today.getMonth() && 
                   currentMonth.getFullYear() >= today.getFullYear();

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                disabled={!canGoPrev}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return <div key={index} className="h-10" />;
              }

              const available = isDateAvailable(date);
              const selected = isDateSelected(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <motion.button
                  key={date.toISOString()}
                  whileHover={available ? { scale: 1.05 } : {}}
                  whileTap={available ? { scale: 0.95 } : {}}
                  onClick={() => handleDateSelect(date)}
                  disabled={!available}
                  className={cn(
                    "h-10 w-full rounded-md text-sm font-medium transition-colors relative",
                    available
                      ? "hover:bg-accent hover:text-accent-foreground"
                      : "text-muted-foreground cursor-not-allowed",
                    selected && "bg-primary text-primary-foreground hover:bg-primary",
                    isToday && !selected && "bg-accent text-accent-foreground font-bold"
                  )}
                >
                  {date.getDate()}
                  {isToday && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <AnimatePresence>
        {selectedDateLocal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    Available times for {selectedDateLocal.toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <motion.div
                      key={slot.time}
                      whileHover={slot.available ? { scale: 1.02 } : {}}
                      whileTap={slot.available ? { scale: 0.98 } : {}}
                    >
                      <Button
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={cn(
                          "w-full h-12 flex flex-col items-center justify-center p-2 relative",
                          !slot.available && "opacity-50 cursor-not-allowed",
                          slot.urgent && slot.available && "border-orange-500 text-orange-600 hover:bg-orange-50"
                        )}
                      >
                        <span className="text-sm font-medium">
                          {formatTime(slot.time)}
                        </span>
                        {slot.urgent && slot.available && (
                          <Badge variant="secondary" className="text-xs mt-1 h-4">
                            +20%
                          </Badge>
                        )}
                        {!slot.available && (
                          <span className="text-xs text-muted-foreground">
                            Booked
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span>Urgent (+20% fee)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted rounded-full" />
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}