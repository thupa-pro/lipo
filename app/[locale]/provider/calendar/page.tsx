import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function ProviderCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const bookings = [
    {
      id: 1,
      time: "09:00 AM",
      client: "Sarah, Johnson",
      service: "House, Cleaning",
      duration: "2 hours",
      location: "123 Main St",
      status: "confirmed",
    },
    {
      id: 2,
      time: "02:00 PM",
      client: "Mike Davis",
      service: "Lawn Care",
      duration: "1 hour",
      location: "456 Oak Ave",
      status: "pending",
    },
    {
      id: 3,
      time: "04:30 PM",
      client: "Emma Wilson",
      service: "Home Repair",
      duration: "3 hours",
      location: "789 Pine St",
      status: "confirmed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Calendar & Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your schedule and upcoming appointments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BusinessIcons.Calendar className="h-5 w-5" />
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() - 1),
                        ),
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() + 1),
                        ),
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                Calendar component would be displayed here
                <br />
                Interactive monthly/weekly view with drag & drop scheduling
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <OptimizedIcon name="Clock" className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">
                        {booking.time}
                      </span>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <NavigationIcons.User className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">{booking.client}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.service} • {booking.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <BusinessIcons.MapPin className="h-3 w-3" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
