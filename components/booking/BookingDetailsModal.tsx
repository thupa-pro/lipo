"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { Booking, BookingStatus } from "@/lib/booking/types";
import {
  useBookingClient,
  formatTime,
  formatDuration,
  getBookingStatusColor,
  getBookingStatusIcon,
} from "@/lib/booking/utils";
import { useToast } from "@/hooks/use-toast";

interface BookingDetailsModalProps {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function BookingDetailsModal({
  booking,
  open,
  onClose,
  onUpdate,
}: BookingDetailsModalProps) {
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState<BookingStatus>(booking.status);

  const handleStatusUpdate = async () => {
    if (newStatus === booking.status && !notes.trim()) {
      toast({
        title: "No Changes",
        description: "No status or notes changes to save.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await bookingClient.updateBookingStatus(
        booking.id,
        newStatus,
        notes.trim() || undefined,
      );

      toast({
        title: "Success",
        description: "Booking updated successfully!",
      });

      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsUpdating(true);
    try {
      await bookingClient.updateBookingStatus(
        booking.id,
        "cancelled",
        notes.trim() || "Booking cancelled",
      );

      toast({
        title: "Booking Cancelled",
        description: "The booking has been cancelled successfully.",
      });

      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions: {
    value: BookingStatus;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "pending", label: "Pending", icon: <Clock className="w-4 h-4" /> },
    {
      value: "confirmed",
      label: "Confirmed",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: "in_progress",
      label: "In Progress",
      icon: <PlayCircle className="w-4 h-4" />,
    },
    {
      value: "completed",
      label: "Completed",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: <XCircle className="w-4 h-4" />,
    },
    {
      value: "disputed",
      label: "Disputed",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];

  const canUpdateStatus =
    booking.status !== "completed" && booking.status !== "cancelled";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{getBookingStatusIcon(booking.status)}</span>
            Booking Details - #{booking.confirmation_code}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Booking Information</span>
                  <Badge className={getBookingStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">
                          {format(
                            new Date(booking.booking_date),
                            "EEEE, MMMM d, yyyy",
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Date</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">
                          {formatTime(booking.start_time)} -{" "}
                          {formatTime(booking.end_time)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDuration(booking.duration_minutes)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">
                          ${booking.total_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Base: ${booking.base_price.toFixed(2)} + Service Fee:
                          ${booking.service_fee.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {booking.service_address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <div className="font-medium">Service Location</div>
                          <div className="text-sm text-gray-600">
                            {booking.service_address.street}
                            <br />
                            {booking.service_address.city},{" "}
                            {booking.service_address.state}{" "}
                            {booking.service_address.zip}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <div className="font-medium">Confirmation Code</div>
                        <div className="text-sm text-gray-600 font-mono">
                          {booking.confirmation_code}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.special_requests && (
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <div className="font-medium">Special Requests</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {booking.special_requests}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-medium text-lg">
                    {booking.service_title}
                  </h3>
                  {booking.service_description && (
                    <p className="text-gray-600 mt-2">
                      {booking.service_description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes & Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.customer_notes && (
                  <div>
                    <Label className="text-sm font-medium">
                      Customer Notes
                    </Label>
                    <div className="mt-1 p-3 bg-blue-50 rounded-lg text-sm">
                      {booking.customer_notes}
                    </div>
                  </div>
                )}

                {booking.provider_notes && (
                  <div>
                    <Label className="text-sm font-medium">
                      Provider Notes
                    </Label>
                    <div className="mt-1 p-3 bg-green-50 rounded-lg text-sm">
                      {booking.provider_notes}
                    </div>
                  </div>
                )}

                {booking.cancellation_reason && (
                  <div>
                    <Label className="text-sm font-medium">
                      Cancellation Reason
                    </Label>
                    <div className="mt-1 p-3 bg-red-50 rounded-lg text-sm">
                      {booking.cancellation_reason}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            {canUpdateStatus && (
              <Card>
                <CardHeader>
                  <CardTitle>Update Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={newStatus}
                      onValueChange={(value) =>
                        setNewStatus(value as BookingStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.icon}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this update..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Booking"
                      )}
                    </Button>

                    {booking.status !== "cancelled" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Booking
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this booking? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancelBooking}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Yes, Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Customer</div>
                    <div className="text-sm text-gray-600">
                      Customer ID: {booking.customer_id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Provider</div>
                    <div className="text-sm text-gray-600">
                      Provider ID: {booking.provider_id}
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Booking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>
                      {format(new Date(booking.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>

                  {booking.confirmed_at && (
                    <div className="flex justify-between">
                      <span>Confirmed:</span>
                      <span>
                        {format(
                          new Date(booking.confirmed_at),
                          "MMM d, h:mm a",
                        )}
                      </span>
                    </div>
                  )}

                  {booking.started_at && (
                    <div className="flex justify-between">
                      <span>Started:</span>
                      <span>
                        {format(new Date(booking.started_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                  )}

                  {booking.completed_at && (
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span>
                        {format(
                          new Date(booking.completed_at),
                          "MMM d, h:mm a",
                        )}
                      </span>
                    </div>
                  )}

                  {booking.cancelled_at && (
                    <div className="flex justify-between text-red-600">
                      <span>Cancelled:</span>
                      <span>
                        {format(
                          new Date(booking.cancelled_at),
                          "MMM d, h:mm a",
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {booking.status === "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Post-Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Star className="w-4 h-4 mr-2" />
                    View Reviews
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Payment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
