"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, ArrowLeft, MapPin, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-200 mb-4">404</div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Oops! Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for seems to have taken a different route.
          </p>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <MapPin className="w-6 h-6 mr-2 text-blue-600" />
              Let's Get You Back on Track
            </CardTitle>
            <CardDescription>
              Here are some helpful ways to find what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/">
                  <Home className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Go Home</span>
                  <span className="text-sm text-gray-500">Back to the main page</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/browse">
                  <Search className="w-6 h-6 text-green-600" />
                  <span className="font-medium">Browse Services</span>
                  <span className="text-sm text-gray-500">Find what you need</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/help">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                  <span className="font-medium">Get Help</span>
                  <span className="text-sm text-gray-500">Visit our help center</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/contact">
                  <MapPin className="w-6 h-6 text-orange-600" />
                  <span className="font-medium">Contact Us</span>
                  <span className="text-sm text-gray-500">We're here to help</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-gray-600">
            Looking for something specific? Try using our search or browse our popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/about">About</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/careers">Careers</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/become-provider">Become a Provider</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/safety">Safety</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Button asChild size="lg" className="shadow-md">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Take Me Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}