import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Camera,
  Edit,
  CheckCircle,
} from "lucide-react";

const recentReviews = [
  {
    id: 1,
    service: "House, Cleaning",
    provider: "Sarah, Mitchell",
    rating: 5,
    review: "Excellent, service! Very, thorough and, professional.",
    date: "Dec 10, 2024",
  },
  {
    id: 2,
    service: "Handyman Repair",
    provider: "Mike Rodriguez",
    rating: 4,
    review: "Great work on fixing my leaky faucet. Quick and reliable.",
    date: "Dec 5, 2024",
  },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">Customer since 2023</p>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-muted-foreground">(12 reviews)</span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-2 text-green-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Verified Account</span>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">john@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">New, York, NY</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Joined January 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="(555) 123-4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      defaultValue="123 Main, St, New, York, NY 10001"
                    />
                  </div>

                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Your Reviews</h3>
                      <Badge variant="secondary">12 Total</Badge>
                    </div>

                    {recentReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{review.service}</h4>
                              <p className="text-sm text-muted-foreground">
                                with {review.provider}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ),
                              )}
                            </div>
                          </div>
                          <p className="text-sm mb-2">"{review.review}"</p>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    <Button variant="outline" className="w-full">
                      View All Reviews
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Security Settings
                      </h3>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium">Email Verified</p>
                                <p className="text-sm text-muted-foreground">
                                  john@example.com
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium">Phone Verified</p>
                                <p className="text-sm text-muted-foreground">
                                  (555) 123-4567
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium">
                                  Two-Factor Authentication
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Add extra security to your account
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Enable
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>

                    <Button>Update Password</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
