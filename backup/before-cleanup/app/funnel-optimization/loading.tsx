import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FunnelOptimizationLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-24 h-6" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-md" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="w-96 h-10 mx-auto mb-2" />
          <Skeleton className="w-80 h-6 mx-auto mb-6" />
          <div className="flex items-center justify-center space-x-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-16 h-8 mx-auto mb-1" />
                <Skeleton className="w-20 h-4 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Impact Metrics Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-80 h-4" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center space-y-3">
                  <Skeleton className="w-16 h-8 mx-auto" />
                  <Skeleton className="w-12 h-4 mx-auto" />
                  <Skeleton className="w-20 h-6 mx-auto" />
                  <Skeleton className="w-16 h-8 mx-auto" />
                  <Skeleton className="w-24 h-4 mx-auto" />
                  <Skeleton className="w-full h-2 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-80 h-4" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-32 h-5" />
                        <Skeleton className="w-full h-4" />
                        <div className="flex space-x-2">
                          <Skeleton className="w-16 h-5 rounded-full" />
                          <Skeleton className="w-12 h-5 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="flex-1 h-10 rounded-md" />
            ))}
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="w-48 h-6 mb-2" />
              <Skeleton className="w-80 h-4" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="w-32 h-5" />
                        <Skeleton className="w-16 h-5" />
                      </div>
                      <Skeleton className="w-full h-2 rounded-full" />
                      <div className="flex space-x-2">
                        <Skeleton className="w-20 h-4 rounded-full" />
                        <Skeleton className="w-16 h-4 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
