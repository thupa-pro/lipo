"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Save,
  RotateCcw,
} from "lucide-react";

export default function ProviderAvailabilityPage() {
  const [isGenerallyAvailable, setIsGenerallyAvailable] = useState(true);
  const [selectedDay, setSelectedDay] = useState("monday");

  const daysOfWeek = [
    { id: "monday", name: "Monday" },
    { id: "tuesday", name: "Tuesday" },
    { id: "wednesday", name: "Wednesday" },
    { id: "thursday", name: "Thursday" },
    { id: "friday", name: "Friday" },
    { id: "saturday", name: "Saturday" },
    { id: "sunday", name: "Sunday" },
  ];

  const defaultSchedule = {
    monday: { available: true, start: "09:00", end: "17:00" },
    tuesday: { available: true, start: "09:00", end: "17:00" },
    wednesday: { available: true, start: "09:00", end: "17:00" },
    thursday: { available: true, start: "09:00", end: "17:00" },
    friday: { available: true, start: "09:00", end: "17:00" },
    saturday: { available: false, start: "10:00", end: "14:00" },
    sunday: { available: false, start: "10:00", end: "14:00" },
  };

  const [schedule, setSchedule] = useState(defaultSchedule);

  const timeSlots = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  const upcomingBookings = [
    {
      id: 1,
      date: "2024-01-22",
      time: "10:00 AM",
      service: "Home Cleaning",
      customer: "Sarah J.",
      duration: "2 hours",
    },
    {
      id: 2,
      date: "2024-01-23",
      time: "2:00 PM",
      service: "Plumbing Repair",
      customer: "Mike R.",
      duration: "1.5 hours",
    },
    {
      id: 3,
      date: "2024-01-25",
      time: "9:00 AM",
      service: "Garden Maintenance",
      customer: "Lisa M.",
      duration: "3 hours",
    },
  ];

  const blockedDates = [
    { date: "2024-01-24", reason: "Personal time off" },
    { date: "2024-01-30", reason: "Equipment maintenance" },
  ];

  const updateDaySchedule = (
    day: string,
    field: string,
    value: string | boolean,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const saveSchedule = () => {
    console.log("Saving schedule:", schedule);
    // In a real app, this would save to backend
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Availability Settings</h1>
        <p className="text-muted-foreground">
          Manage your working hours and availability
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              Set your regular working hours for each day
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isGenerallyAvailable}
                onCheckedChange={setIsGenerallyAvailable}
              />
              <Label>Available for bookings</Label>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day) => (
              <div
                key={day.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20">
                    <Label className="font-medium">{day.name}</Label>
                  </div>
                  <Switch
                    checked={
                      schedule[day.id as keyof typeof schedule].available
                    }
                    onCheckedChange={(checked) =>
                      updateDaySchedule(day.id, "available", checked)
                    }
                  />
                </div>

                {schedule[day.id as keyof typeof schedule].available && (
                  <div className="flex items-center space-x-2">
                    <Select
                      value={schedule[day.id as keyof typeof schedule].start}
                      onValueChange={(value) =>
                        updateDaySchedule(day.id, "start", value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">to</span>
                    <Select
                      value={schedule[day.id as keyof typeof schedule].end}
                      onValueChange={(value) =>
                        updateDaySchedule(day.id, "end", value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <Button onClick={saveSchedule}>
                <Save className="w-4 h-4 mr-2" />
                Save Schedule
              </Button>
              <Button
                variant="outline"
                onClick={() => setSchedule(defaultSchedule)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Block Time Off
            </Button>
            <Button className="w-full" variant="outline">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Set Special Hours
            </Button>
            <Button className="w-full" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Emergency Override
            </Button>

            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">Current Status</Label>
              <div className="mt-2">
                <Badge variant={isGenerallyAvailable ? "default" : "secondary"}>
                  {isGenerallyAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{booking.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.customer} • {booking.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Blocked Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Blocked Dates</CardTitle>
            <CardDescription>Days when you're unavailable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blockedDates.map((blocked, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{blocked.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {blocked.reason}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Blocked Date
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
