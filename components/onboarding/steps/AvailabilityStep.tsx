import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  Calendar, Info, Clock, CheckCircle} from "lucide-react";
import { OnboardingStepProps } from "@/lib/onboarding/types";

interface DaySchedule {
  available: boolean;
  start: string;
  end: string;
}

interface AvailabilityData {
  schedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  buffer_time: number;
  advance_booking_days: number;
  max_bookings_per_day: number;
  instant_booking: boolean;
}

const defaultSchedule: DaySchedule = {
  available: true,
  start: "09:00",
  end: "17:00",
};

const defaultUnavailable: DaySchedule = {
  available: false,
  start: "09:00",
  end: "17:00",
};

export function AvailabilityStep({
  onNext,
  onPrev,
  initialData,
  isLastStep,
}: OnboardingStepProps) {
  const [formData, setFormData] = useState<AvailabilityData>({
    schedule: {
      monday: defaultSchedule,
      tuesday: defaultSchedule,
      wednesday: defaultSchedule,
      thursday: defaultSchedule,
      friday: defaultSchedule,
      saturday: defaultUnavailable,
      sunday: defaultUnavailable,
    },
    buffer_time: 15,
    advance_booking_days: 7,
    max_bookings_per_day: 8,
    instant_booking: false,
    ...initialData?.availability,
  });

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ] as const;

  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
    const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    return { value: time, label: displayTime };
  });

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          available:
            !prev.schedule[day as keyof typeof prev.schedule].available,
        },
      },
    }));
  };

  const handleTimeChange = (
    day: string,
    field: "start" | "end",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          [field]: value,
        },
      },
    }));
  };

  const applyToAllDays = () => {
    const mondaySchedule = formData.schedule.monday;
    setFormData((prev) => ({
      ...prev,
      schedule: Object.keys(prev.schedule).reduce(
        (acc, day) => ({
          ...acc,
          [day]: { ...mondaySchedule },
        }),
        {} as any,
      ),
    }));
  };

  const setBusinessHours = () => {
    const businessSchedule: DaySchedule = {
      available: true,
      start: "09:00",
      end: "17:00",
    };

    setFormData((prev) => ({
      ...prev,
      schedule: {
        monday: businessSchedule,
        tuesday: businessSchedule,
        wednesday: businessSchedule,
        thursday: businessSchedule,
        friday: businessSchedule,
        saturday: defaultUnavailable,
        sunday: defaultUnavailable,
      },
    }));
  };

  const handleSubmit = () => {
    onNext({ availability: formData });
  };

  const availableDays = Object.values(formData.schedule).filter(
    (day) => day.available,
  ).length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set Your Availability
        </h2>
        <p className="text-gray-600">
          Let customers know when you're available to work
        </p>
      </div>

      {/* Quick Setup */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Quick Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={setBusinessHours}
              className="flex-1"
            >
              <Clock className="w-4 h-4 mr-2" />
              Standard Business Hours
            </Button>
            <Button
              variant="outline"
              onClick={applyToAllDays}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Copy Monday to All Days
            </Button>
          </div>
          <p className="text-sm text-blue-700">
            Use these presets to quickly set your, schedule, then customize as
            needed
          </p>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Schedule
          </CardTitle>
          <p className="text-sm text-gray-600">
            Available {availableDays} day{availableDays !== 1 ? "s" : ""} per
            week
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {days.map(({ key, label }) => {
            const daySchedule = formData.schedule[key];
            return (
              <div
                key={key}
                className={`p-4 border rounded-lg ${
                  daySchedule.available
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={daySchedule.available}
                      onCheckedChange={() => handleDayToggle(key)}
                      id={`${key}-available`}
                    />
                    <Label
                      htmlFor={`${key}-available`}
                      className="font-medium cursor-pointer"
                    >
                      {label}
                    </Label>
                    {daySchedule.available && (
                      <Badge variant="secondary" className="text-xs">
                        Available
                      </Badge>
                    )}
                  </div>

                  {daySchedule.available && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={daySchedule.start}
                        onValueChange={(value) =>
                          handleTimeChange(key, "start", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-gray-500">to</span>

                      <Select
                        value={daySchedule.end}
                        onValueChange={(value) =>
                          handleTimeChange(key, "end", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buffer_time">Buffer Time Between Bookings</Label>
              <Select
                value={formData.buffer_time.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    buffer_time: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Time between appointments for travel/setup
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_bookings">Max Bookings Per Day</Label>
              <Input
                id="max_bookings"
                type="number"
                min="1"
                max="20"
                value={formData.max_bookings_per_day}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    max_bookings_per_day: parseInt(e.target.value) || 1,
                  }))
                }
              />
              <p className="text-sm text-gray-500">
                Maximum number of jobs you'll accept per day
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advance Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="advance_booking">How Far in Advance?</Label>
              <Select
                value={formData.advance_booking_days.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    advance_booking_days: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                  <SelectItem value="60">2 months</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                How far ahead customers can book
              </p>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="instant_booking" className="font-medium">
                  Instant Booking
                </Label>
                <p className="text-sm text-gray-500">
                  Let customers book immediately without approval
                </p>
              </div>
              <Switch
                id="instant_booking"
                checked={formData.instant_booking}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    instant_booking: checked,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-2">
                Your Availability Summary
              </h4>
              <div className="space-y-1 text-sm text-green-800">
                <p>• Available {availableDays} days per week</p>
                <p>• Up to {formData.max_bookings_per_day} bookings per day</p>
                <p>
                  • {formData.buffer_time} minute buffer between appointments
                </p>
                <p>
                  • Customers can book up to {formData.advance_booking_days}{" "}
                  days in advance
                </p>
                <p>
                  • {formData.instant_booking ? "Instant" : "Manual"} booking
                  approval
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Remember</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• You can update your availability anytime</li>
                <li>• Block specific dates when you're not available</li>
                <li>• Customers will see your real-time availability</li>
                <li>• Consider peak demand times in your area</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          {isLastStep ? "Complete Setup" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
