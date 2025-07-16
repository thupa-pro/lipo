import React from "react";
import { Metadata } from "next";
import { BookingDashboard } from "@/components/booking/BookingDashboard";

export const metadata: Metadata = {
  title: "My Bookings - Loconomy",
  description: "View and manage your service bookings",
};

export default function BookingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            View and manage your upcoming and past bookings
          </p>
        </div>

        <BookingDashboard />
      </div>
    </div>
  );
}
