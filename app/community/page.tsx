import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Calendar,
  Star,
  Heart,
  Share2,
} from "lucide-react";
import Link from "next/link";

const communityPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Mitchell",
      avatar: "/placeholder.svg",
      badge: "Top Provider",
    },
    title: "Tips for excellent customer service",
    content: "Sharing some insights from my 3 years on the platform...",
    likes: 24,
    comments: 8,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg",
      badge: "Verified",
    },
    title: "How I grew my handyman business",
    content:
      "Started with 0 reviews, now I'm fully booked. Here's what worked...",
    likes: 45,
    comments: 12,
    timeAgo: "1 day ago",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Community
              </h1>
              <p className="text-muted-foreground">
                Connect with fellow providers and customers
              </p>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">2.1M+</p>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">150K+</p>
              <p className="text-sm text-muted-foreground">Discussions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-muted-foreground">Helpful Content</p>
            </CardContent>
          </Card>
        </div>

        {/* Community Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Provider Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Connect with other service providers, share tips, and grow your
                business.
              </p>
              <div className="space-y-2">
                <Button className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Business Tips & Strategies
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Provider Success Stories
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Local Meetups & Events
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Forum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Get advice from other customers and share your experiences.</p>
              <div className="space-y-2">
                <Button className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Service Reviews & Recommendations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Questions & Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Community Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Discussions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Discussions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {communityPosts.map((post) => (
              <div key={post.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{post.author.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.author.badge}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {post.timeAgo}
                      </span>
                    </div>
                    <h3 className="font-medium mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-500">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Join Community CTA */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6">
              Connect with thousands of providers and customers sharing
              knowledge and experiences.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/signup">Join Community</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">Community Guidelines</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
