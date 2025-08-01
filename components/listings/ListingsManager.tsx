import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Filter, TrendingUp, Eye,  } from "lucide-react";
import { ListingsTable } from "./ListingsTable";
import { ListingForm } from "./ListingForm";
import { ListingCard } from "./ListingCard";
import {
  Listing,
  ListingFormData,
  ListingStatus,
  ListingStats,
} from "@/lib/listings/types";
import { useListingsClient } from "@/lib/listings/utils";
import { useToast } from "@/components/ui/use-toast";

export function ListingsManager() {
  const { user } = useUser();
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
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

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
    // TODO: Navigate to public listing view
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

  return (
    <div className="space-y-8">
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

      {/* Stats Cards */}
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
              <p className="text-xs text-muted-foreground">
                {stats.active_listings} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_views}</div>
              <p className="text-xs text-muted-foreground">All time views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <BusinessIcons.Calendar className="h-4 w-4 text-muted-foreground" / />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_bookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Draft Listings
              </CardTitle>
              <BusinessIcons.DollarSign className="h-4 w-4 text-muted-foreground" / />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft_listings}</div>
              <p className="text-xs text-muted-foreground">Ready to publish</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" / />
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
              onValueChange={(value) => setViewMode(value as "table" | "grid")}
            >
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="grid">Grid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* Listings Display */}
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
                  <p className="text-gray-500">No listings found.</p>
                </div>
              )}
            </div>
          )}
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
