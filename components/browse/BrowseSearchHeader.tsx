import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid3X3, List } from "lucide-react"
import React from "react"

interface BrowseSearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  location: string
  setLocation: (loc: string) => void
  handleSearch: () => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  loading: boolean
}

export default function BrowseSearchHeader({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  handleSearch,
  viewMode,
  setViewMode,
  loading,
}: BrowseSearchHeaderProps) {
  return (
    <div className="bg-muted/50 border-b border-border dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" / />
                <Input
                  placeholder="Search services or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-md shadow-sm dark:bg-input"
                />
              </div>
              <div className="relative flex-1">
                <BusinessIcons.MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" / />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 rounded-md shadow-sm dark:bg-input"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} className="rounded-md shadow-sm transition-all hover:shadow-md">
                {loading ? <UIIcons.Loader2 className="w-4 h-4 animate-spin" / /> : <NavigationIcons.Search className="w-4 h-4" / />}
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-md shadow-sm transition-all hover:shadow-md"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-md shadow-sm transition-all hover:shadow-md"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}