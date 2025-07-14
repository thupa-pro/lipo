"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import ProviderCard from "./ProviderCard"
import { useToast } from "@/components/ui/use-toast"
import React from "react"

interface Provider {
  id: number
  name: string
  service: string
  category: string
  rating: number
  reviews: number
  price: string
  hourlyRate: number
  location: string
  distance: number
  avatar: string
  badges: string[]
  completedJobs: number
  responseTime: string
  availability: string
  description: string
  verified: boolean
}

interface BrowseResultsProps {
  providers: Provider[]
  loading: boolean
  searchQuery: string
  viewMode: "grid" | "list"
}

export default function BrowseResults({ providers, loading, searchQuery, viewMode }: BrowseResultsProps) {
  const { toast } = useToast()

  const handleLoadMore = () => {
    toast({
      title: "Loading more results...",
      description: "More providers are being loaded.",
      variant: "default",
    })
    // In a real app, this would trigger an API call to fetch more data
  }

  return (
    <div className="flex-1">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {searchQuery ? `Results for "${searchQuery}"` : "Browse Services"}
          </h1>
          <p className="text-muted-foreground">
            {loading ? "Searching..." : `${providers.length} providers found`}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse rounded-xl shadow-sm dark:bg-card dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Grid/List */}
      {!loading && (
        <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && providers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No providers found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-md shadow-sm hover:shadow-md transition-all">
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      {!loading && providers.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" onClick={handleLoadMore} className="rounded-lg shadow-md hover:shadow-lg transition-all">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  )
}