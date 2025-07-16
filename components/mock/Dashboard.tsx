"use client";

import React, { useEffect, useState } from 'react';
import { useMockAuth, MockUser } from '@/lib/mock/auth';
import { mockDataStore, Listing, Booking } from '@/lib/mock/data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user, signOut } = useMockAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      mockDataStore.getListings().then(setListings);
      mockDataStore.getBookingsForUser(user.id).then(setBookings);
    }
  }, [user]);

  if (!user) {
    return null; // Should be handled by RoleGate, but as a fallback
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mock Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-4">
            <Button asChild variant="outline">
                <Link href="/mock-auth">Auth Controls</Link>
            </Button>
            <Button onClick={signOut}>Sign Out</Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Role: {user.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Email:</strong> {user.email}</p>
            <p className="mt-2">
              <strong>Subscription:</strong>
              <Badge className="ml-2">{user.subscriptionPlan}</Badge>
            </p>
          </CardContent>
        </Card>

        {/* Listings Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {listings.length > 0 ? (
              <ul className="space-y-2">
                {listings.map(listing => (
                  <li key={listing.id} className="p-2 border rounded-md">
                    <p className="font-semibold">{listing.title}</p>
                    <p>${listing.price}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No listings found.</p>
            )}
          </CardContent>
        </Card>

        {/* Bookings Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.map(booking => (
                  <li key={booking.id} className="p-4 border rounded-lg">
                    <p className="font-bold">Booking #{booking.id.slice(-6)}</p>
                    <p>Status: <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>{booking.status}</Badge></p>
                    <p>From: {new Date(booking.startTime).toLocaleString()}</p>
                    <p>To: {new Date(booking.endTime).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no bookings.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
