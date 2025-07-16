"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  DollarSign,
  MessageSquare,
  Star,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import {
  Booking,
  BookingStatus,
  BookingMessage,
  BookingReview,
} from "@/lib/booking/types";
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
  const { user } = useUser();
  const { toast } = useToast();
  const bookingClient = useBookingClient();

  const [messages, setMessages] = useState<BookingMessage[]>([]);
  const [reviews, setReviews] = useState<BookingReview[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newStatus, setNewStatus] = useState<BookingStatus>(booking.status);
  const [statusNotes, setStatusNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const isProvider = user?.id === booking.provider_id;
  const isCustomer = user?.id === booking.customer_id;
  const canUpdateStatus = isProvider || isCustomer;
  const canSendMessage = isProvider || isCustomer;

  useEffect(() => {
    if (open) {
      loadBookingData();
    }
  }, [open, booking.id]);

  const loadBookingData = async () => {
    try {
      const [messagesData, reviewsData] = await Promise.all([
        bookingClient.getBookingMessages(booking.id),
        bookingClient.getBookingReviews(booking.id),
      ]);

      setMessages(messagesData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error loading booking data:", error);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === booking.status) return;

    setIsUpdating(true);
    try {
      await bookingClient.updateBookingStatus(
        booking.id,
        newStatus,
        statusNotes.trim() || undefined,
      );

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}.`,
      });

      setStatusNotes("");
      if (onUpdate) onUpdate();
      onClose();
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update booking status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await bookingClient.sendBookingMessage(booking.id, newMessage.trim());
      setNewMessage("");
      await loadBookingData();

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to Send",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const getStatusActions = (currentStatus: BookingStatus): BookingStatus[] => {
    if (isProvider) {
      switch (currentStatus) {
        case "pending":
          return ["confirmed", "cancelled"];
        case "confirmed":
          return ["in_progress", "cancelled"];
        case "in_progress":
          return ["completed", "cancelled"];
        default:
          return [];
      }
    } else if (isCustomer) {
      switch (currentStatus) {
        case "pending":
          return ["cancelled"];
        case "confirmed":
          return ["cancelled"];
        default:
          return [];
      }
    }
    return [];
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return format(dateObj, "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  const availableActions = getStatusActions(booking.status);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Booking Details
            <Badge className={getBookingStatusColor(booking.status)}>
              {getBookingStatusIcon(booking.status)} {booking.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              Messages
              {messages.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {messages.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {booking.service_title}
                    </h3>
                    {booking.service_description && (
                      <p className="text-gray-600 mb-4">
                        {booking.service_description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <span>
                          {formatDateTime(
                            booking.booking_date,
                            booking.start_time,
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>
                          {formatTime(booking.start_time)} -{" "}
                          {formatTime(booking.end_time)}(
                          {formatDuration(booking.duration_minutes)})
                        </span>
                      </div>

                      {booking.location_type && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="capitalize">
                            {booking.location_type}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span>${booking.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium">Confirmation Code</Label>
                      <div className="text-lg font-mono bg-gray-100 p-2 rounded">
                        {booking.confirmation_code}
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div>
                        <Label className="font-medium">Special Requests</Label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {booking.special_requests}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Service ({formatDuration(booking.duration_minutes)}):
                    </span>
                    <span>${booking.base_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>${booking.service_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>${booking.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            {canUpdateStatus && availableActions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>New Status</Label>
                      <Select
                        value={newStatus}
                        onValueChange={(value: BookingStatus) =>
                          setNewStatus(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={booking.status}>
                            {booking.status} (current)
                          </SelectItem>
                          {availableActions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes (Optional)</Label>
                      <Textarea
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        placeholder="Add a note about this status change..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || newStatus === booking.status}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Status
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Messages List */}
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user?.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.sender_id === user?.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message_text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_id === user?.id
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {format(
                                new Date(message.created_at),
                                "MMM d, h:mm a",
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Send Message */}
                  {canSendMessage && (
                    <div className="flex gap-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={2}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No reviews yet</p>
                    {booking.status === "completed" && (
                      <p className="text-sm mt-2">
                        Reviews can be left after service completion
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {format(new Date(review.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        {review.review_text && (
                          <p className="text-gray-700">{review.review_text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
