"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
  Booking,
  BookingStatus,
  BookingFilters,
  BookingStatsResponse,
} from "@/lib/booking/types";
import {
  useBookingClient,
  formatTime,
  formatDuration,
  getBookingStatusColor,
  getBookingStatusIcon,
} from "@/lib/booking/utils";
import { BookingDetailsModal } from "@/components/booking/BookingDetailsModal";
import { useToast } from "@/hooks/use-toast";

export default function BookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all",
  );
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState<string>("all");

  useEffect(() => {
    if (authLoading) return;
    
    if (!user.isSignedIn) return;
    
    if (user?.id) {
      loadBookingsData();
    }
  }, [user?.id, statusFilter, dateFilter, authLoading]);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user.isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to view your bookings.</p>
        </div>
      </div>
    );
  }

  const loadBookingsData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const filters: BookingFilters = {};

      // Add status filter
      if (statusFilter !== "all") {
        filters.status = [statusFilter];
      }

      // Add date filter
      const now = new Date();
      switch (dateFilter) {
        case "today":
          filters.date_from = format(now, "yyyy-MM-dd");
          filters.date_to = format(now, "yyyy-MM-dd");
          break;
        case "week":
          const weekStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - now.getDay(),
          );
          const weekEnd = new Date(
            weekStart.getTime() + 6 * 24 * 60 * 60 * 1000,
          );
          filters.date_from = format(weekStart, "yyyy-MM-dd");
          filters.date_to = format(weekEnd, "yyyy-MM-dd");
          break;
        case "month":
          filters.date_from = format(
            new Date(now.getFullYear(), now.getMonth(), 1),
            "yyyy-MM-dd",
          );
          filters.date_to = format(
            new Date(now.getFullYear(), now.getMonth() + 1, 0),
            "yyyy-MM-dd",
          );
          break;
      }

      // Check user role and set appropriate filter
      // For now, we'll load both provider and customer bookings
      // In a real app, you'd check the user's role
      filters.customer_id = user.id; // or filters.provider_id = user.id

      const [bookingsData, statsData] = await Promise.all([
        bookingClient.getBookings(filters),
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

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
    try {
      await bookingClient.updateBookingStatus(bookingId, newStatus);
      toast({
        title: "Success",
        description: "Booking status updated successfully!",
      });
      await loadBookingsData();
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    }
  };

  // Filter bookings by tab
  const filterBookingsByTab = (bookings: Booking[]) => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");

    switch (currentTab) {
      case "upcoming":
        return bookings.filter(
          (b) =>
            (b.status === "pending" || b.status === "confirmed") &&
            b.booking_date >= today,
        );
      case "today":
        return bookings.filter((b) => b.booking_date === today);
      case "completed":
        return bookings.filter((b) => b.status === "completed");
      case "cancelled":
        return bookings.filter((b) => b.status === "cancelled");
      default:
        return bookings;
    }
  };

  // Filter by search query
  const filteredBookings = filterBookingsByTab(bookings).filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.service_title.toLowerCase().includes(query) ||
      booking.confirmation_code.toLowerCase().includes(query) ||
      booking.customer_id.toLowerCase().includes(query) ||
      booking.provider_id.toLowerCase().includes(query)
    );
  });

  const renderBookingCard = (booking: Booking) => (
    <Card
      key={booking.id}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedBooking(booking)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{booking.service_title}</h3>
            <p className="text-sm text-gray-600">
              #{booking.confirmation_code}
            </p>
          </div>
          <Badge className={getBookingStatusColor(booking.status)}>
            {getBookingStatusIcon(booking.status)} {booking.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {format(new Date(booking.booking_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                {formatTime(booking.start_time)} (
                {formatDuration(booking.duration_minutes)})
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>${booking.total_amount.toFixed(2)}</span>
            </div>
            {booking.service_address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="truncate">
                  {booking.service_address.city},{" "}
                  {booking.service_address.state}
                </span>
              </div>
            )}
          </div>
        </div>

        {booking.special_requests && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-gray-600 line-clamp-2">
              <strong>Special Requests:</strong> {booking.special_requests}
            </p>
          </div>
        )}

        <div className="flex justify-end mt-3 pt-3 border-t">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage your service bookings and appointments
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_bookings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.this_month_bookings} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_bookings}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completed_bookings}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total_revenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.this_month_revenue.toLocaleString()} this month
              </p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as BookingStatus | "all")
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
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

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bookings Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({filterBookingsByTab(bookings).length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Today ({filterBookingsByTab(bookings).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filterBookingsByTab(bookings).length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({filterBookingsByTab(bookings).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  {currentTab === "all"
                    ? "You don't have any bookings yet. Start by browsing services or creating listings."
                    : `No ${currentTab} bookings match your current filters.`}
                </p>
                {currentTab === "all" && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Services
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
