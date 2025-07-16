import React from "react";
import { Metadata } from "next";
import { ProviderCalendar } from "@/components/booking/ProviderCalendar";

export const metadata: Metadata = {
  title: "Calendar - Provider Dashboard",
  description: "Manage your availability and view upcoming bookings",
};

export default function ProviderCalendarPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Calendar & Availability
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your availability and view upcoming bookings in calendar view
          </p>
        </div>

        <ProviderCalendar />
      </div>
    </div>
  );
}
