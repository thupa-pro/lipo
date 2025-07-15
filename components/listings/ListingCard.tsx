"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  MoreHorizontal,
  Trash2,
  MapPin,
  Clock,
  Star,
  Calendar,
} from "lucide-react";
import { ListingCardProps } from "@/lib/listings/types";
import {
  formatPricingDisplay,
  getStatusColor,
  getStatusText,
} from "@/lib/listings/utils";

export function ListingCard({
  listing,
  onView,
  onEdit,
  onDelete,
  showActions = false,
  className = "",
}: ListingCardProps) {
  const handleView = () => {
    onView?.(listing);
  };

  const handleEdit = () => {
    onEdit?.(listing);
  };

  const handleDelete = () => {
    onDelete?.(listing.id);
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {listing.category}
              </Badge>
              <Badge
                className={`text-xs ${getStatusColor(listing.status)}`}
                variant="secondary"
              >
                {getStatusText(listing.status)}
              </Badge>
            </div>
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Featured Image */}
        {listing.featured_image && (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={listing.featured_image}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {listing.description}
        </p>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-green-600">
            {formatPricingDisplay(listing)}
          </div>
          {listing.duration_minutes && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {Math.round(listing.duration_minutes / 60)}h
            </div>
          )}
        </div>

        {/* Location and Service Area */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="capitalize">
            {listing.location_type === "on_site"
              ? "On-site"
              : listing.location_type === "remote"
                ? "Remote"
                : "Both"}
          </span>
          {listing.service_area?.radius && (
            <span className="ml-1">• {listing.service_area.radius} miles</span>
          )}
        </div>

        {/* Tags */}
        {listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
            {listing.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{listing.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex justify-between items-center w-full text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {listing.view_count}
            </div>
            {listing.booking_count > 0 && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {listing.booking_count}
              </div>
            )}
          </div>

          <div className="text-xs">
            {new Date(listing.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
