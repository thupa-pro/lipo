import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, MapPin, Clock, Star } from "lucide-react";
import Link from "next/link";

const mockBookings = [
  {
    id: 1,
    service: "House Cleaning",
    customer: { name: "Sarah Johnson", avatar: "/placeholder.svg" },
    date: "Dec 15, 2024",
    time: "10:00 AM",
    status: "confirmed",
    price: "$85",
    location: "Manhattan, NY",
    rating: null,
  },
  {
    id: 2,
    service: "Handyman Services",
    customer: { name: "Mike Rodriguez", avatar: "/placeholder.svg" },
    date: "Dec 14, 2024",
    time: "2:00 PM",
    status: "completed",
    price: "$120",
    location: "Brooklyn, NY",
    rating: 5,
  },
  {
    id: 3,
    service: "Pet Grooming",
    customer: { name: "Emma Wilson", avatar: "/placeholder.svg" },
    date: "Dec 16, 2024",
    time: "11:00 AM",
    status: "pending",
    price: "$60",
    location: "Queens, NY",
    rating: null,
  },
];

export default function ProviderBookingsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/provider/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Bookings
            </h1>
            <p className="text-muted-foreground">
              Manage your upcoming and completed bookings
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">$1,247</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {mockBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={booking.customer.avatar} />
                      <AvatarFallback>
                        {booking.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{booking.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        with {booking.customer.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium">{booking.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.price}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      {booking.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{booking.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button size="sm">Accept</Button>
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <Button size="sm">View Details</Button>
                      )}
                      {booking.status === "completed" && (
                        <Button size="sm" variant="outline">
                          View Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
