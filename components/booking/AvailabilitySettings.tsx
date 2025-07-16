"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  ProviderAvailability,
  AvailabilityOverride,
  AvailabilityFormData,
  AvailabilityOverrideFormData,
  DayOfWeek,
  AvailabilityType,
} from "@/lib/booking/types";
import { useBookingClient } from "@/lib/booking/utils";
import { useToast } from "@/hooks/use-toast";

interface AvailabilitySettingsProps {
  providerId: string;
  onUpdate?: () => void;
  onClose?: () => void;
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  const display = new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { value: time, label: display };
});

export function AvailabilitySettings({
  providerId,
  onUpdate,
  onClose,
}: AvailabilitySettingsProps) {
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [regularAvailability, setRegularAvailability] = useState<
    AvailabilityFormData[]
  >([]);
  const [overrides, setOverrides] = useState<AvailabilityOverride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Override form state
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [overrideType, setOverrideType] = useState<AvailabilityType>("blocked");
  const [overrideStartTime, setOverrideStartTime] = useState("");
  const [overrideEndTime, setOverrideEndTime] = useState("");
  const [overrideReason, setOverrideReason] = useState("");

  useEffect(() => {
    loadAvailabilityData();
  }, [providerId]);

  const loadAvailabilityData = async () => {
    setIsLoading(true);
    try {
      const [availability, overridesData] = await Promise.all([
        bookingClient.getProviderAvailability(providerId),
        bookingClient.getAvailabilityOverrides(providerId),
      ]);

      // Convert to form data
      const formData: AvailabilityFormData[] = DAYS_OF_WEEK.map((day) => {
        const existing = availability.find((a) => a.day_of_week === day.value);
        return {
          day_of_week: day.value,
          start_time: existing?.start_time || "09:00",
          end_time: existing?.end_time || "17:00",
          is_available: existing?.is_available ?? false,
          break_duration_minutes: existing?.break_duration_minutes || 0,
        };
      });

      setRegularAvailability(formData);
      setOverrides(overridesData);
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

  const updateDayAvailability = (
    dayOfWeek: DayOfWeek,
    field: keyof AvailabilityFormData,
    value: any,
  ) => {
    setRegularAvailability((prev) =>
      prev.map((day) =>
        day.day_of_week === dayOfWeek ? { ...day, [field]: value } : day,
      ),
    );
  };

  const saveRegularAvailability = async () => {
    setIsSaving(true);
    try {
      await bookingClient.setProviderAvailability(
        providerId,
        regularAvailability,
      );

      toast({
        title: "Success",
        description: "Regular availability updated successfully.",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        title: "Error",
        description: "Failed to save availability settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addOverride = async () => {
    if (!selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a date for the override.",
        variant: "destructive",
      });
      return;
    }

    const overrideData: AvailabilityOverrideFormData = {
      date: selectedDate.toISOString().split("T")[0],
      availability_type: overrideType,
      start_time: overrideStartTime || undefined,
      end_time: overrideEndTime || undefined,
      reason: overrideReason || undefined,
    };

    try {
      await bookingClient.addAvailabilityOverride(providerId, overrideData);

      toast({
        title: "Success",
        description: "Availability override added successfully.",
      });

      // Reset form
      setSelectedDate(undefined);
      setOverrideType("blocked");
      setOverrideStartTime("");
      setOverrideEndTime("");
      setOverrideReason("");

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
        description: "Availability override removed successfully.",
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

  const setAllDaysAvailable = (available: boolean) => {
    setRegularAvailability((prev) =>
      prev.map((day) => ({ ...day, is_available: available })),
    );
  };

  const copyDaySettings = (fromDay: DayOfWeek, toDay: DayOfWeek) => {
    const sourceDay = regularAvailability.find(
      (d) => d.day_of_week === fromDay,
    );
    if (sourceDay) {
      updateDayAvailability(toDay, "start_time", sourceDay.start_time);
      updateDayAvailability(toDay, "end_time", sourceDay.end_time);
      updateDayAvailability(toDay, "is_available", sourceDay.is_available);
      updateDayAvailability(
        toDay,
        "break_duration_minutes",
        sourceDay.break_duration_minutes,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Tabs defaultValue="regular" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular">Regular Schedule</TabsTrigger>
          <TabsTrigger value="overrides">Date Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="regular" className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAllDaysAvailable(true)}
                >
                  Enable All Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAllDaysAvailable(false)}
                >
                  Disable All Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    DAYS_OF_WEEK.slice(1, 6).forEach(
                      (
                        day, // Mon-Fri
                      ) => copyDaySettings("monday", day.value),
                    );
                  }}
                >
                  Copy Monday to Weekdays
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAYS_OF_WEEK.map((day) => {
                const dayData = regularAvailability.find(
                  (d) => d.day_of_week === day.value,
                );
                if (!dayData) return null;

                return (
                  <div
                    key={day.value}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-24">
                      <Label className="font-medium">{day.label}</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={dayData.is_available}
                        onCheckedChange={(checked) =>
                          updateDayAvailability(
                            day.value,
                            "is_available",
                            checked,
                          )
                        }
                      />
                      <span className="text-sm">Available</span>
                    </div>

                    {dayData.is_available && (
                      <>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <Select
                            value={dayData.start_time}
                            onValueChange={(value) =>
                              updateDayAvailability(
                                day.value,
                                "start_time",
                                value,
                              )
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span>to</span>

                          <Select
                            value={dayData.end_time}
                            onValueChange={(value) =>
                              updateDayAvailability(
                                day.value,
                                "end_time",
                                value,
                              )
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Break (min):</Label>
                          <Input
                            type="number"
                            value={dayData.break_duration_minutes}
                            onChange={(e) =>
                              updateDayAvailability(
                                day.value,
                                "break_duration_minutes",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-20"
                            min="0"
                            max="480"
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={saveRegularAvailability} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overrides" className="space-y-4">
          {/* Add Override */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Date Override</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Override Type</Label>
                    <Select
                      value={overrideType}
                      onValueChange={(value: AvailabilityType) =>
                        setOverrideType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="break">Break</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {overrideType !== "blocked" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Select
                            value={overrideStartTime}
                            onValueChange={setOverrideStartTime}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Start" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Select
                            value={overrideEndTime}
                            onValueChange={setOverrideEndTime}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="End" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Reason (Optional)</Label>
                    <Input
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g., Vacation, Special hours, etc."
                    />
                  </div>

                  <Button
                    onClick={addOverride}
                    disabled={!selectedDate}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Override
                  </Button>
                </div>
              </div>
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
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No date overrides set</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {overrides.map((override) => (
                    <div
                      key={override.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            override.availability_type === "available"
                              ? "default"
                              : override.availability_type === "blocked"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {override.availability_type}
                        </Badge>

                        <div>
                          <p className="font-medium">
                            {format(
                              new Date(override.date),
                              "EEEE, MMMM d, yyyy",
                            )}
                          </p>
                          {override.start_time && override.end_time && (
                            <p className="text-sm text-gray-600">
                              {new Date(
                                `2000-01-01T${override.start_time}`,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}{" "}
                              -{" "}
                              {new Date(
                                `2000-01-01T${override.end_time}`,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          )}
                          {override.reason && (
                            <p className="text-sm text-gray-500">
                              {override.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOverride(override.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
