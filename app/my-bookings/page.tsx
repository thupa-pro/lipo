import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  Phone,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const bookings = {
  upcoming: [
    {
      id: 1,
      service: "House Cleaning",
      provider: {
        name: "Sarah Mitchell",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
        phone: "(555) 123-4567",
      },
      date: "Dec 15, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "123 Main St, New York, NY",
      price: "$120",
      status: "confirmed",
      notes: "Please bring eco-friendly cleaning supplies",
    },
    {
      id: 2,
      service: "Handyman Services",
      provider: {
        name: "Mike Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        phone: "(555) 987-6543",
      },
      date: "Dec 18, 2024",
      time: "10:00 AM - 12:00 PM",
      location: "123 Main St, New York, NY",
      price: "$150",
      status: "pending",
      notes: "Fix leaky kitchen faucet and bathroom door",
    },
  ],
  completed: [
    {
      id: 3,
      service: "Pet Grooming",
      provider: {
        name: "Emma Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5.0,
        phone: "(555) 456-7890",
      },
      date: "Dec 8, 2024",
      time: "3:00 PM - 4:30 PM",
      location: "Pet Spa Downtown",
      price: "$80",
      status: "completed",
      notes: "Full grooming for Golden Retriever",
    },
    {
      id: 4,
      service: "House Cleaning",
      provider: {
        name: "Sarah Mitchell",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
        phone: "(555) 123-4567",
      },
      date: "Nov 25, 2024",
      time: "1:00 PM - 3:00 PM",
      location: "123 Main St, New York, NY",
      price: "$120",
      status: "completed",
      notes: "Deep cleaning before holiday guests",
    },
  ],
  cancelled: [
    {
      id: 5,
      service: "Lawn Care",
      provider: {
        name: "Green Thumb Services",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.5,
        phone: "(555) 111-2222",
      },
      date: "Dec 1, 2024",
      time: "9:00 AM - 11:00 AM",
      location: "123 Main St, New York, NY",
      price: "$75",
      status: "cancelled",
      notes: "Weather cancellation - rescheduled",
    },
  ],
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "confirmed":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "pending":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your service appointments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {bookings.upcoming.length}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {bookings.completed.length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {bookings.cancelled.length}
              </p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {bookings.upcoming.length +
                  bookings.completed.length +
                  bookings.cancelled.length}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming ({bookings.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({bookings.completed.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({bookings.cancelled.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              {bookings.upcoming.map((booking) => (
                <Card
                  key={booking.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.provider.avatar} />
                          <AvatarFallback>
                            {booking.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {booking.service}
                            </h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-2">
                            with {booking.provider.name}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{booking.provider.rating} rating</span>
                            </div>
                          </div>

                          {booking.notes && (
                            <p className="text-sm bg-muted p-2 rounded-md mb-3">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg text-primary mb-2">
                          {booking.price}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {bookings.completed.map((booking) => (
                <Card
                  key={booking.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.provider.avatar} />
                          <AvatarFallback>
                            {booking.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {booking.service}
                            </h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-2">
                            with {booking.provider.name}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg mb-2">
                          {booking.price}
                        </p>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Rate Service
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            Book Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            <div className="space-y-4">
              {bookings.cancelled.map((booking) => (
                <Card
                  key={booking.id}
                  className="hover:shadow-lg transition-shadow opacity-75"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.provider.avatar} />
                          <AvatarFallback>
                            {booking.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {booking.service}
                            </h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-2">
                            with {booking.provider.name}
                          </p>

                          <div className="text-sm text-muted-foreground">
                            <p>
                              Originally scheduled: {booking.date} at{" "}
                              {booking.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-muted-foreground line-through">
                          {booking.price}
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Rebook
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
