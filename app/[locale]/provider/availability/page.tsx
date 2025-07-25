"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Calendar,
  Plus,
  X,
  Clock
} from "lucide-react";

export default function ProviderAvailabilityPage() {
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "10:00", end: "16:00" },
    sunday: { enabled: false, start: "10:00", end: "16:00" },
  });

  const [breakTimes, setBreakTimes] = useState([
    { start: "12:00", end: "13:00", label: "Lunch Break" },
  ]);

  const [timeSlots, setTimeSlots] = useState({
    duration: "60",
    buffer: "15",
  });

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const updateAvailability = (day: string, field: string, value: any) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value },
    }));
  };

  const addBreak = () => {
    setBreakTimes([
      ...breakTimes,
      { start: "15:00", end: "15:30", label: "Break" },
    ]);
  };

  const removeBreak = (index: number) => {
    setBreakTimes(breakTimes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Save availability settings
    console.log("Saving availability:", {
      availability,
      breakTimes,
      timeSlots,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Availability Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your working hours and time preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map((day) => (
              <div
                key={day}
                className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="w-20">
                  <Label className="font-medium capitalize">{day}</Label>
                </div>

                <Switch
                  checked={
                    availability[day as keyof typeof availability].enabled
                  }
                  onCheckedChange={(checked) =>
                    updateAvailability(day, "enabled", checked)
                  }
                />

                {availability[day as keyof typeof availability].enabled && (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={
                        availability[day as keyof typeof availability].start
                      }
                      onChange={(e) =>
                        updateAvailability(day, "start", e.target.value)
                      }
                      className="w-24"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="time"
                      value={availability[day as keyof typeof availability].end}
                      onChange={(e) =>
                        updateAvailability(day, "end", e.target.value)
                      }
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Slot Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Slot Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Appointment Duration
                </Label>
                <Select
                  value={timeSlots.duration}
                  onValueChange={(value) =>
                    setTimeSlots((prev) => ({ ...prev, duration: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Buffer Time</Label>
                <Select
                  value={timeSlots.buffer}
                  onValueChange={(value) =>
                    setTimeSlots((prev) => ({ ...prev, buffer: value }))
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
              </div>
            </CardContent>
          </Card>

          {/* Break Times */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Break Times</CardTitle>
                <Button size="sm" onClick={addBreak}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Break
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {breakTimes.map((breakTime, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <Input
                    placeholder="Break name"
                    value={breakTime.label}
                    onChange={(e) => {
                      const newBreaks = [...breakTimes];
                      newBreaks[index].label = e.target.value;
                      setBreakTimes(newBreaks);
                    }}
                    className="flex-1"
                  />
                  <Input
                    type="time"
                    value={breakTime.start}
                    onChange={(e) => {
                      const newBreaks = [...breakTimes];
                      newBreaks[index].start = e.target.value;
                      setBreakTimes(newBreaks);
                    }}
                    className="w-24"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={breakTime.end}
                    onChange={(e) => {
                      const newBreaks = [...breakTimes];
                      newBreaks[index].end = e.target.value;
                      setBreakTimes(newBreaks);
                    }}
                    className="w-24"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBreak(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Availability
        </Button>
      </div>
    </div>
  );
}
