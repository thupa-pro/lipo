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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Filter,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  MapPin,
  DollarSign,
} from "lucide-react";

export default function ProviderBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const bookings = [
    {
      id: 1,
      customer: {
        name: "Sarah, Johnson",
        phone: "(555) 123-4567",
        avatar: "SJ",
      },
      service: "Professional Home Cleaning",
      date: "2024-01-22",
      time: "10:00 AM - 12:00 PM",
      duration: "2 hours",
      price: "$120",
      status: "confirmed",
      address: "123 Main, St, Seattle, WA",
      notes:
        "Please focus on kitchen and bathrooms. Pet-friendly products preferred.",
    },
    {
      id: 2,
      customer: {
        name: "Mike Rodriguez",
        phone: "(555) 987-6543",
        avatar: "MR",
      },
      service: "Plumbing Repair",
      date: "2024-01-23",
      time: "2:00 PM - 3:30 PM",
      duration: "1.5 hours",
      price: "$160",
      status: "pending",
      address: "456 Oak, Ave, Seattle, WA",
      notes: "Kitchen sink leak. Customer will be working from home.",
    },
    {
      id: 3,
      customer: {
        name: "Lisa Martinez",
        phone: "(555) 456-7890",
        avatar: "LM",
      },
      service: "Garden Maintenance",
      date: "2024-01-25",
      time: "9:00 AM - 12:00 PM",
      duration: "3 hours",
      price: "$210",
      status: "confirmed",
      address: "789 Pine, St, Seattle, WA",
      notes: "Large backyard needs general maintenance and weeding.",
    },
    {
      id: 4,
      customer: {
        name: "David Chen",
        phone: "(555) 321-0987",
        avatar: "DC",
      },
      service: "Home Cleaning",
      date: "2024-01-18",
      time: "1:00 PM - 3:00 PM",
      duration: "2 hours",
      price: "$120",
      status: "completed",
      address: "321 Elm, Dr, Seattle, WA",
      notes: "Regular monthly cleaning. Very satisfied customer.",
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const upcomingBookings = filteredBookings.filter(
    (b) =>
      new Date(b.date) >= new Date() &&
      b.status !== "completed" &&
      b.status !== "cancelled",
  );

  const pastBookings = filteredBookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === "completed",
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground">
          Manage your service appointments and customer interactions
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings by customer or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                <p className="text-muted-foreground">
                  Your upcoming appointments will appear here
                </p>
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
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {booking.customer.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {booking.customer.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {booking.service}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={getStatusColor(booking.status)}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="w-3 h-3" />
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.price}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {booking.address}
                      </span>
                    </div>

                    {booking.notes && (
                      <div className="bg-muted/50 p-3 rounded-lg mb-4">
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
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
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <span className="font-semibold text-muted-foreground">
                            {booking.customer.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {booking.customer.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {booking.service}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={getStatusColor(booking.status)}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="w-3 h-3" />
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{booking.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {booking.status === "completed" && (
                        <Button size="sm" variant="outline">
                          Rebook
                        </Button>
                      )}
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
