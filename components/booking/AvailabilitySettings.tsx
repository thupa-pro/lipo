"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar, as CalendarIcon,
  Plus,
  X,
  Save,
  Copy,
  RotateCcw,
  Info
} from "lucide-react";
import { format } from "date-fns";
import {
  ProviderAvailability,
  AvailabilityOverride,
  AvailabilityFormData,
  AvailabilityOverrideFormData,
  DayOfWeek,
  AvailabilityType
} from "@/lib/booking/types";
import { useBookingClient } from "@/lib/booking/utils";
import { useToast } from "@/hooks/use-toast";

interface AvailabilitySettingsProps {
  providerId: string;
  onUpdate?: () => void;
  onClose?: () => void;
}

interface DaySchedule {
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  is_available: boolean;
  break_duration_minutes: number;
}

const defaultSchedule: DaySchedule = {
  day_of_week: "monday",
  start_time: "09:00",
  end_time: "17:00",
  is_available: true,
  break_duration_minutes: 30,
};

const weekDays: { key: DayOfWeek; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export function AvailabilitySettings({
  providerId,
  onUpdate,
  onClose,
}: AvailabilitySettingsProps) {
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(
    weekDays.map((day) => ({ ...defaultSchedule, day_of_week: day.key })),
  );
  const [overrides, setOverrides] = useState<AvailabilityOverride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Override form state
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [overrideType, setOverrideType] = useState<AvailabilityType>("blocked");
  const [overrideStartTime, setOverrideStartTime] = useState("09:00");
  const [overrideEndTime, setOverrideEndTime] = useState("17:00");
  const [overrideReason, setOverrideReason] = useState("");

  useEffect(() => {
    loadAvailabilityData();
  }, [providerId]);

  const loadAvailabilityData = async () => {
    setIsLoading(true);
    try {
      const [availability, overrideData] = await Promise.all([
        bookingClient.getProviderAvailability(providerId),
        bookingClient.getAvailabilityOverrides(providerId),
      ]);

      // Convert availability to schedule format
      if (availability.length > 0) {
        const schedule = weekDays.map((day) => {
          const dayAvailability = availability.find(
            (a) => a.day_of_week === day.key,
          );
          return {
            day_of_week: day.key,
            start_time: dayAvailability?.start_time || "09:00",
            end_time: dayAvailability?.end_time || "17:00",
            is_available: dayAvailability?.is_available ?? true,
            break_duration_minutes:
              dayAvailability?.break_duration_minutes || 30,
          };
        });
        setWeeklySchedule(schedule);
      }

      setOverrides(overrideData);
    } catch (error) {
      console.error("Error loading availability data:", error);
      toast({
        title: "Error",
        description: "Failed to load availability settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (dayKey: DayOfWeek) => {
    setWeeklySchedule((prev) =>
      prev.map((day) =>
        day.day_of_week === dayKey
          ? { ...day, is_available: !day.is_available }
          : day,
      ),
    );
  };

  const handleDayTimeChange = (
    dayKey: DayOfWeek,
    field: "start_time" | "end_time",
    value: string,
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((day) =>
        day.day_of_week === dayKey ? { ...day, [field]: value } : day,
      ),
    );
  };

  const handleBreakDurationChange = (dayKey: DayOfWeek, minutes: number) => {
    setWeeklySchedule((prev) =>
      prev.map((day) =>
        day.day_of_week === dayKey
          ? { ...day, break_duration_minutes: minutes }
          : day,
      ),
    );
  };

  const applyToAllDays = (sourceDay: DayOfWeek) => {
    const source = weeklySchedule.find((d) => d.day_of_week === sourceDay);
    if (!source) return;

    setWeeklySchedule((prev) =>
      prev.map((day) => ({
        ...day,
        start_time: source.start_time,
        end_time: source.end_time,
        is_available: source.is_available,
        break_duration_minutes: source.break_duration_minutes,
      })),
    );

    toast({
      title: "Applied to All Days",
      description: `${sourceDay} schedule copied to all days.`,
    });
  };

  const setBusinessHours = () => {
    setWeeklySchedule((prev) =>
      prev.map((day, index) => ({
        ...day,
        start_time: "09:00",
        end_time: "17:00",
        is_available: index < 5, // Monday-Friday only
        break_duration_minutes: 30,
      })),
    );

    toast({
      title: "Business Hours Set",
      description: "Monday-Friday 9 AM to 5 PM with 30-minute breaks.",
    });
  };

  const saveWeeklySchedule = async () => {
    setIsSaving(true);
    try {
      const availabilityData: AvailabilityFormData[] = weeklySchedule.map(
        (day) => ({
          day_of_week: day.day_of_week,
          start_time: day.start_time,
          end_time: day.end_time,
          is_available: day.is_available,
          break_duration_minutes: day.break_duration_minutes,
        }),
      );

      await bookingClient.setProviderAvailability(providerId, availabilityData);

      toast({
        title: "Success",
        description: "Weekly schedule saved successfully!",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        title: "Error",
        description: "Failed to save weekly schedule.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addOverride = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date for the override.",
        variant: "destructive",
      });
      return;
    }

    try {
      const overrideData: AvailabilityOverrideFormData = {
        date: format(selectedDate, "yyyy-MM-dd"),
        start_time:
          overrideType === "available" ? overrideStartTime : undefined,
        end_time: overrideType === "available" ? overrideEndTime : undefined,
        availability_type: overrideType,
        reason: overrideReason || undefined,
      };

      await bookingClient.addAvailabilityOverride(providerId, overrideData);

      toast({
        title: "Success",
        description: "Availability override added successfully!",
      });

      // Reset form
      setSelectedDate(undefined);
      setOverrideReason("");
      setOverrideType("blocked");

      // Reload data
      await loadAvailabilityData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error adding override:", error);
      toast({
        title: "Error",
        description: "Failed to add availability override.",
        variant: "destructive",
      });
    }
  };

  const removeOverride = async (overrideId: string) => {
    try {
      await bookingClient.removeAvailabilityOverride(overrideId);

      toast({
        title: "Success",
        description: "Availability override removed successfully!",
      });

      await loadAvailabilityData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error removing override:", error);
      toast({
        title: "Error",
        description: "Failed to remove availability override.",
        variant: "destructive",
      });
    }
  };

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
    const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    return { value: time, label: displayTime };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="overrides">Date Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button variant="outline" onClick={setBusinessHours}>
                  <Clock className="w-4 h-4 mr-2" />
                  Standard Business Hours
                </Button>
                <Button
                  variant="outline"
                  onClick={() => applyToAllDays("monday")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Monday to All
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Use these presets to quickly configure your schedule, then
                customize individual days as needed.
              </p>
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weeklySchedule.map((day) => (
                <div
                  key={day.day_of_week}
                  className={`p-4 border rounded-lg ${
                    day.is_available
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={day.is_available}
                        onCheckedChange={() => handleDayToggle(day.day_of_week)}
                      />
                      <Label className="font-medium capitalize">
                        {day.day_of_week}
                      </Label>
                      {day.is_available && (
                        <Badge variant="secondary" className="text-xs">
                          Available
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyToAllDays(day.day_of_week)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  {day.is_available && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">Start Time</Label>
                        <Select
                          value={day.start_time}
                          onValueChange={(value) =>
                            handleDayTimeChange(
                              day.day_of_week,
                              "start_time",
                              value,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">End Time</Label>
                        <Select
                          value={day.end_time}
                          onValueChange={(value) =>
                            handleDayTimeChange(
                              day.day_of_week,
                              "end_time",
                              value,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Break Duration</Label>
                        <Select
                          value={day.break_duration_minutes.toString()}
                          onValueChange={(value) =>
                            handleBreakDurationChange(
                              day.day_of_week,
                              parseInt(value),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No breaks</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button onClick={saveWeeklySchedule} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Schedule
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="overrides" className="space-y-6">
          {/* Add Override */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Date Override</CardTitle>
              <p className="text-sm text-gray-600">
                Override your regular schedule for specific dates
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Override Type</Label>
                  <Select
                    value={overrideType}
                    onValueChange={(value) =>
                      setOverrideType(value as AvailabilityType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blocked">
                        Blocked (Not Available)
                      </SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="break">Break Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {overrideType === "available" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Select
                      value={overrideStartTime}
                      onValueChange={setOverrideStartTime}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>End Time</Label>
                    <Select
                      value={overrideEndTime}
                      onValueChange={setOverrideEndTime}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div>
                <Label>Reason (Optional)</Label>
                <Input
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., Holiday, Vacation, Special hours..."
                />
              </div>

              <Button onClick={addOverride} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Override
              </Button>
            </CardContent>
          </Card>

          {/* Existing Overrides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Existing Overrides</CardTitle>
            </CardHeader>
            <CardContent>
              {overrides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Info className="w-8 h-8 mx-auto mb-2" />
                  <p>No date overrides set</p>
                  <p className="text-sm">
                    Add overrides above to modify your schedule for specific
                    dates
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {overrides.map((override) => (
                    <div
                      key={override.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {format(new Date(override.date), "PPP")}
                        </div>
                        <div className="text-sm text-gray-600">
                          {override.availability_type === "available" && (
                            <>
                              Available {override.start_time} -{" "}
                              {override.end_time}
                            </>
                          )}
                          {override.availability_type === "blocked" && (
                            <>Blocked (Not Available)</>
                          )}
                          {override.availability_type === "break" && (
                            <>Break Time</>
                          )}
                          {override.reason && <span> • {override.reason}</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOverride(override.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
