"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal } from "lucide-react"
import React from "react"

interface BrowseFiltersProps {
  category: string
  setCategory: (category: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  sortBy: string
  setSortBy: (sort: string) => void
  categories: { value: string; label: string }[]
  sortOptions: { value: string; label: string }[]
}

export default function BrowseFilters({
  category,
  setCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  categories,
  sortOptions,
}: BrowseFiltersProps) {
  return (
    <div className="lg:w-80">
      <Card className="card-glass">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-md shadow-sm dark:bg-input transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg dark:bg-popover">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="transition-colors hover:bg-accent hover:text-accent-foreground">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">
              Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={200}
              min={0}
              step={5}
              className="mt-2 [&>span:first-child]:h-2 [&>span:first-child]:rounded-full [&>span:first-child]:bg-secondary [&>span:first-child>span]:bg-primary [&>span:last-child]:h-5 [&>span:last-child]:w-5 [&>span:last-child]:rounded-full [&>span:last-child]:border-2 [&>span:last-child]:border-primary [&>span:last-child]:bg-background transition-colors"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="rounded-md shadow-sm dark:bg-input transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg dark:bg-popover">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="transition-colors hover:bg-accent hover:text-accent-foreground">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Quick Filters</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="verified" className="rounded text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="verified" className="text-sm text-muted-foreground">
                  Verified Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="available" className="rounded text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="available" className="text-sm text-muted-foreground">
                  Available Today
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="toprated" className="rounded text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="toprated" className="text-sm text-muted-foreground">
                  Top Rated (4.5+)
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
