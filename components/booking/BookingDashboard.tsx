import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, AlertCircle, TrendingUp } from "lucide-react";
import {
  Booking,
  BookingStatus,
  BookingStatsResponse,
  BookingFilters
} from "@/lib/booking/types";
import {
  useBookingClient,
  formatTime,
  formatDate,
  formatDuration,
  getBookingStatusColor,
  getBookingStatusIcon
} from "@/lib/booking/utils";
import { useToast } from "@/hooks/use-toast";
import { BookingDetailsModal } from "./BookingDetailsModal";

export function BookingDashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStatsResponse | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all",
  );
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (user?.id) {
      loadBookingsData();
    }
  }, [user?.id]);

  const loadBookingsData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [bookingsData, statsData] = await Promise.all([
        bookingClient.getBookings({ customer_id: user.id }),
        bookingClient.getBookingStats(),
      ]);

      setBookings(bookingsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading bookings data:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const filterBookings = (bookings: Booking[]) => {
    let filtered = bookings;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.service_title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.confirmation_code
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    return filtered;
  };

  const getBookingsByTab = (tab: string) => {
    const today = new Date().toISOString().split("T")[0];

    switch (tab) {
      case "upcoming":
        return bookings.filter(
          (booking) =>
            booking.booking_date >= today &&
            !["cancelled", "completed"].includes(booking.status),
        );
      case "past":
        return bookings.filter(
          (booking) =>
            booking.booking_date < today ||
            ["cancelled", "completed"].includes(booking.status),
        );
      case "pending":
        return bookings.filter((booking) => booking.status === "pending");
      default:
        return bookings;
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Card
      key={booking.id}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleBookingClick(booking)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {booking.service_title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Confirmation: {booking.confirmation_code}
            </p>
          </div>
          <Badge className={getBookingStatusColor(booking.status)}>
            {getBookingStatusIcon(booking.status)} {booking.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BusinessIcons.Calendar className="w-4 h-4 text-gray-500" / />
            <span>{formatDate(booking.booking_date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <OptimizedIcon name="Clock" className="w-4 h-4 text-gray-500" />
            <span>
              {formatTime(booking.start_time)} (
              {formatDuration(booking.duration_minutes)})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BusinessIcons.DollarSign className="w-4 h-4 text-gray-500" / />
            <span>${booking.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {booking.special_requests && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <strong>Special Requests:</strong> {booking.special_requests}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderEmptyState = (tab: string) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <BusinessIcons.Calendar className="w-8 h-8 text-gray-400" / />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {tab} bookings
      </h3>
      <p className="text-gray-500 mb-4">
        {tab === "upcoming"
          ? "You don't have any upcoming bookings yet."
          : tab === "past"
            ? "You haven't completed any bookings yet."
            : "No pending bookings at the moment."}
      </p>
      <Button
        variant="outline"
        onClick={() => (window.location.href = "/browse")}
      >
        Browse Services
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredBookings = filterBookings(getBookingsByTab(activeTab));

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <NavigationIcons.Users className="h-4 w-4 text-muted-foreground" / />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_bookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_bookings}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <UIIcons.CheckCircle className="h-4 w-4 text-muted-foreground" / />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completed_bookings}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <BusinessIcons.DollarSign className="h-4 w-4 text-muted-foreground" / />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total_revenue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">All time spending</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" / />
                <Input
                  placeholder="Search by service or confirmation code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value: BookingStatus | "all") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bookings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming
            {stats && stats.confirmed_bookings > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                {stats.confirmed_bookings}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {stats && stats.pending_bookings > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                {stats.pending_bookings}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredBookings.length === 0 ? (
            renderEmptyState("upcoming")
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredBookings.length === 0 ? (
            renderEmptyState("past")
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredBookings.length === 0 ? (
            renderEmptyState("pending")
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={loadBookingsData}
        />
      )}
    </div>
  );
}
