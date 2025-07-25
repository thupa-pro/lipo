"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Edit,
  MoreHorizontal,
  Play,
  Pause,
  Archive,
  TrendingUp,
  Trash2
} from "lucide-react";
import {
  Listing,
  ListingStatus,
  ListingsTableProps
} from "@/lib/listings/types";
import {
  formatPricingDisplay,
  getStatusColor,
  getStatusText,
  formatPrice
} from "@/lib/listings/utils";

export function ListingsTable({
  listings,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
  isLoading = false,
}: ListingsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  const handleDeleteClick = (listingId: string) => {
    setListingToDelete(listingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (listingToDelete) {
      onDelete(listingToDelete);
      setListingToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleStatusChange = (listingId: string, newStatus: ListingStatus) => {
    onStatusChange(listingId, newStatus);
  };

  const getStatusActions = (listing: Listing) => {
    const actions = [];

    if (listing.status === "draft") {
      actions.push(
        <DropdownMenuItem
          key="activate"
          onClick={() => handleStatusChange(listing.id, "active")}
          className="text-green-600"
        >
          <Play className="w-4 h-4 mr-2" />
          Activate
        </DropdownMenuItem>,
      );
    }

    if (listing.status === "active") {
      actions.push(
        <DropdownMenuItem
          key="pause"
          onClick={() => handleStatusChange(listing.id, "paused")}
          className="text-yellow-600"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </DropdownMenuItem>,
      );
    }

    if (listing.status === "paused") {
      actions.push(
        <DropdownMenuItem
          key="activate"
          onClick={() => handleStatusChange(listing.id, "active")}
          className="text-green-600"
        >
          <Play className="w-4 h-4 mr-2" />
          Activate
        </DropdownMenuItem>,
      );
    }

    if (listing.status !== "inactive") {
      actions.push(
        <DropdownMenuItem
          key="deactivate"
          onClick={() => handleStatusChange(listing.id, "inactive")}
          className="text-red-600"
        >
          <Archive className="w-4 h-4 mr-2" />
          Deactivate
        </DropdownMenuItem>,
      );
    }

    return actions;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No listings yet
        </h3>
        <p className="text-gray-600 mb-4">
          Start by creating your first service listing to attract customers.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 line-clamp-1">
                      {listing.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {listing.description}
                    </div>
                    {listing.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {listing.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {listing.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{listing.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {listing.category}
                    </div>
                    {listing.subcategory && (
                      <div className="text-xs text-gray-500">
                        {listing.subcategory}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {formatPricingDisplay(listing)}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {listing.pricing_type}
                      {listing.minimum_hours &&
                        listing.pricing_type === "hourly" && (
                          <span> • {listing.minimum_hours}h min</span>
                        )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    className={getStatusColor(listing.status)}
                    variant="secondary"
                  >
                    {getStatusText(listing.status)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{listing.view_count}</div>
                    {listing.booking_count > 0 && (
                      <div className="text-xs text-gray-500">
                        {listing.booking_count} bookings
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-gray-600">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(listing)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(listing)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>

                      {getStatusActions(listing).length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          {getStatusActions(listing)}
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(listing.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot
              be undone. All associated bookings and data will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
