"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  DollarSign,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function ProviderListingsPage() {
  // Mock, data for, listings
  const listings = [
    {
      id: 1,
      title: "Professional, Home Cleaning",
      category: "Cleaning",
      price: 45,
      status: "active",
      views: 127,
      bookings: 8,
      rating: 4.8,
      created: "2024-01-15",
    },
    {
      id: 2,
      title: "Plumbing Services",
      category: "Home Maintenance",
      price: 80,
      status: "active",
      views: 89,
      bookings: 5,
      rating: 4.9,
      created: "2024-01-10",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your service listings</p>
        </div>
        <Link href="/provider/listings/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Listing
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription>{listing.category}</CardDescription>
                </div>
                <Badge
                  variant={
                    listing.status === "active" ? "default" : "secondary"
                  }
                >
                  {listing.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">${listing.price}/hour</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{listing.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{listing.bookings} bookings</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {listings.length === 0 && (
        <Card className="text-center p-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first service listing to start getting bookings
            </p>
            <Link href="/provider/listings/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
