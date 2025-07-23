"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Eye,
  Calendar,
  DollarSign,
  BarChart3,
  Star,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { ListingsTable } from "@/components/listings/ListingsTable";
import { ListingForm } from "@/components/listings/ListingForm";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  Listing,
  ListingFormData,
  ListingStatus,
  ListingStats,
} from "@/lib/listings/types";
import { useListingsClient } from "@/lib/listings/utils";
import { useToast } from "@/hooks/use-toast";

export default function ListingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const listingsClient = useListingsClient();

  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<ListingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "all">(
    "all",
  );
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user.isSignedIn) return;
    
    if (user?.id) {
      loadData();
    }
  }, [user?.id, authLoading]);

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
          <p className="text-gray-600">You need to be signed in to manage your listings.</p>
        </div>
      </div>
    );
  }

  const loadData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [listingsData, statsData] = await Promise.all([
        listingsClient.getListings(user.id),
        listingsClient.getStats(user.id),
      ]);

      setListings(listingsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading listings data:", error);
      toast({
        title: "Error",
        description: "Failed to load listings data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateListing = () => {
    setEditingListing(null);
    setIsFormOpen(true);
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: ListingFormData) => {
    setIsSubmitting(true);
    try {
      if (editingListing) {
        await listingsClient.updateListing(editingListing.id, formData);
        toast({
          title: "Success",
          description: "Listing updated successfully!",
        });
      } else {
        await listingsClient.createListing(formData);
        toast({
          title: "Success",
          description: "Listing created successfully!",
        });
      }

      setIsFormOpen(false);
      setEditingListing(null);
      await loadData();
    } catch (error) {
      console.error("Error saving listing:", error);
      toast({
        title: "Error",
        description: "Failed to save listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await listingsClient.deleteListing(listingId);
      toast({
        title: "Success",
        description: "Listing deleted successfully!",
      });
      await loadData();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (
    listingId: string,
    newStatus: ListingStatus,
  ) => {
    try {
      await listingsClient.updateListingStatus(listingId, newStatus);
      toast({
        title: "Success",
        description: "Listing status updated successfully!",
      });
      await loadData();
    } catch (error) {
      console.error("Error updating listing status:", error);
      toast({
        title: "Error",
        description: "Failed to update listing status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewListing = (listing: Listing) => {
    // Navigate to public listing view
    window.open(`/listings/${listing.id}`, "_blank");
  };

  // Filter listings based on search and status
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-1">
            Manage your service listings and track performance
          </p>
        </div>
        <Button
          onClick={handleCreateListing}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Listing
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_listings}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {stats.active_listings} active
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {stats.draft_listings} draft
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_views.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_bookings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.average_rating ? stats.average_rating.toFixed(1) : "N/A"}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= (stats.average_rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      {listings.length === 0 && !isLoading && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create Your First Listing
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Start attracting customers by creating detailed service listings.
              Showcase what you offer and set your pricing.
            </p>
            <Button onClick={handleCreateListing} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Listing
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      {listings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ListingStatus | "all")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "table" | "grid")
                }
              >
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Listings Display */}
      {listings.length > 0 && (
        <Card>
          <CardContent className="p-6">
            {viewMode === "table" ? (
              <ListingsTable
                listings={filteredListings}
                onEdit={handleEditListing}
                onDelete={handleDeleteListing}
                onStatusChange={handleStatusChange}
                onView={handleViewListing}
                isLoading={isLoading}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onView={handleViewListing}
                    onEdit={handleEditListing}
                    onDelete={handleDeleteListing}
                    showActions={true}
                  />
                ))}
                {filteredListings.length === 0 && !isLoading && (
                  <div className="col-span-full text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      No listings found
                    </p>
                    <p className="text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tips and Resources */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            💡 Tips for Better Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Great Photos</h4>
              <p className="text-blue-800">
                Add high-quality photos showcasing your work. Listings with
                photos get 3x more views.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                Clear Descriptions
              </h4>
              <p className="text-blue-800">
                Write detailed descriptions explaining what's, included, your
                process, and what makes you special.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                Competitive Pricing
              </h4>
              <p className="text-blue-800">
                Research local competitors and price competitively. You can
                always adjust rates later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Listing Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingListing ? "Edit Listing" : "Create New Listing"}
            </DialogTitle>
          </DialogHeader>
          <ListingForm
            listing={editingListing || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
