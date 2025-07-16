import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  Users,
  MessageCircle,
  Calendar,
  Trophy,
  Heart,
} from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community</h1>
            <p className="text-gray-600 mt-1">
              Connect with local service providers and customers
            </p>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">5,000+</h3>
            <p className="text-gray-600">Active Members</p>
          </Card>
          <Card className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">1,200+</h3>
            <p className="text-gray-600">Discussions</p>
          </Card>
          <Card className="p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">50+</h3>
            <p className="text-gray-600">Events This Month</p>
          </Card>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Local Forums */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Local Forums</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Join discussions with neighbors, ask questions, share
              recommendations, and stay connected with your local community.
            </p>
            <Button className="w-full">Join Discussions</Button>
          </Card>

          {/* Community Events */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold">Community Events</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Discover local events, workshops, and meetups. Connect with
              service providers and learn new skills.
            </p>
            <Button className="w-full" variant="outline">
              View Events
            </Button>
          </Card>

          {/* Provider Spotlights */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <h3 className="text-xl font-semibold">Provider Spotlights</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Meet outstanding local service providers, read their stories, and
              learn about their specialties.
            </p>
            <Button className="w-full" variant="outline">
              Meet Providers
            </Button>
          </Card>

          {/* Community Support */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-semibold">Community Support</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Get help from community moderators, report issues, and access
              community guidelines and resources.
            </p>
            <Button className="w-full" variant="outline">
              Get Support
            </Button>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Connect with neighbors, discover amazing local services, and be part
            of a community that supports local businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Create Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              Browse Community
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
