"use client";

import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, RotateCcw, AlertCircle, XCircle, Plus } from "lucide-react";
import Link from "next/link";

export default function BookingsPage() {
  const bookings = [
    {
      id: 1,
      service: "Professional, Home Cleaning",
      provider: {
        name: "Sarah, Johnson",
        avatar: "/placeholder.svg",
        rating: 4.9,
        phone: "(555) 123-4567",
      },
      date: "2024-01-25",
      time: "10:00 AM - 12:00 PM",
      status: "confirmed",
      price: "$120",
      address: "123 Main, St, Seattle, WA",
      notes: "Please focus on kitchen and bathrooms",
      bookingRef: "BK001",
    },
    {
      id: 2,
      service: "Plumbing Repair",
      provider: {
        name: "Mike Rodriguez",
        avatar: "/placeholder.svg",
        rating: 4.8,
        phone: "(555) 987-6543",
      },
      date: "2024-01-28",
      time: "2:00 PM - 4:00 PM",
      status: "pending",
      price: "$160",
      address: "123 Main, St, Seattle, WA",
      notes: "Kitchen sink leak repair",
      bookingRef: "BK002",
    },
    {
      id: 3,
      service: "Garden Maintenance",
      provider: {
        name: "Lisa Martinez",
        avatar: "/placeholder.svg",
        rating: 4.7,
        phone: "(555) 456-7890",
      },
      date: "2024-01-20",
      time: "9:00 AM - 12:00 PM",
      status: "completed",
      price: "$210",
      address: "123 Main, St, Seattle, WA",
      notes: "Backyard maintenance and weeding",
      bookingRef: "BK003",
      canReview: true,
    },
    {
      id: 4,
      service: "Tutoring Session",
      provider: {
        name: "David Chen",
        avatar: "/placeholder.svg",
        rating: 4.9,
        phone: "(555) 321-0987",
      },
      date: "2024-01-15",
      time: "4:00 PM - 6:00 PM",
      status: "completed",
      price: "$80",
      address: "Online Session",
      notes: "Math tutoring for high school",
      bookingRef: "BK004",
      canReview: false,
      hasReview: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return CheckCircle;
      case "pending":
        return AlertCircle;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(b.date) >= new Date() &&
      b.status !== "completed" &&
      b.status !== "cancelled",
  );

  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === "completed",
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your service appointments
          </p>
        </div>
        <Link href="/browse">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Book New Service
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card className="text-center p-12">
              <CardContent>
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No upcoming bookings
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ready to book your next service?
                </p>
                <Link href="/browse">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Services
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <Card
                  key={booking.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.provider.avatar} />
                          <AvatarFallback>
                            {booking.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {booking.service}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">
                              {booking.provider.name}
                            </p>
                            <div className="flex items-center gap-1">
                              <OptimizedIcon name="Star" className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-sm">
                                {booking.provider.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={getStatusColor(booking.status)}
                          className="flex items-center gap-1 mb-2"
                        >
                          <StatusIcon className="w-3 h-3" />
                          {booking.status}
                        </Badge>
                        <p className="font-semibold">{booking.price}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <OptimizedIcon name="Clock" className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                      <div className="flex items-start gap-2 md:col-span-2">
                        <BusinessIcons.MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {booking.address}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-muted/50 p-3 rounded-lg mb-4">
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <OptimizedIcon name="Phone" className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <OptimizedIcon name="MessageSquare" className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="destructive">
                          Cancel
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-3">
                      Booking Reference: {booking.bookingRef}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card className="text-center p-12">
              <CardContent>
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No past bookings</h3>
                <p className="text-muted-foreground">
                  Your completed appointments will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.provider.avatar} />
                          <AvatarFallback>
                            {booking.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{booking.service}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">
                              {booking.provider.name}
                            </p>
                            <div className="flex items-center gap-1">
                              <OptimizedIcon name="Star" className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-sm">
                                {booking.provider.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={getStatusColor(booking.status)}
                          className="flex items-center gap-1 mb-2"
                        >
                          <StatusIcon className="w-3 h-3" />
                          {booking.status}
                        </Badge>
                        <p className="font-semibold">{booking.price}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <OptimizedIcon name="Clock" className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Book Again
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                      {booking.canReview && (
                        <Button size="sm">
                          <OptimizedIcon name="Star" className="w-4 h-4 mr-1" />
                          Leave Review
                        </Button>
                      )}
                      {booking.hasReview && (
                        <Badge variant="outline">
                          <OptimizedIcon name="Star" className="w-3 h-3 mr-1" />
                          Reviewed
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground mt-3">
                      Booking Reference: {booking.bookingRef}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
