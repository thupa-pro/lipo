import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Eye,
  Edit3,
  Trash2,
  DollarSign,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Requests - Loconomy",
  description: "Manage your service requests",
};

export default function RequestsPage() {
  const requests = [
    {
      id: 1,
      title: "House Deep Cleaning",
      description:
        "Need a thorough deep cleaning for a 3-bedroom house before guests arrive.",
      category: "Home Cleaning",
      budget: "$150-200",
      location: "San Francisco, CA",
      posted: "2 hours ago",
      responses: 12,
      status: "active",
      urgency: "high",
    },
    {
      id: 2,
      title: "Kitchen Plumbing Repair",
      description: "Leaky faucet and garbage disposal needs fixing.",
      category: "Plumbing",
      budget: "$100-150",
      location: "San Francisco, CA",
      posted: "1 day ago",
      responses: 8,
      status: "in_progress",
      urgency: "medium",
      provider: {
        name: "Mike Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        rating: 4.8,
      },
    },
    {
      id: 3,
      title: "Personal Training Sessions",
      description:
        "Looking for a certified personal trainer for 3x weekly sessions.",
      category: "Fitness",
      budget: "$75/session",
      location: "San Francisco, CA",
      posted: "3 days ago",
      responses: 15,
      status: "completed",
      urgency: "low",
      provider: {
        name: "Emma Thompson",
        avatar: "/placeholder.svg?height=32&width=32",
        rating: 5.0,
      },
    },
    {
      id: 4,
      title: "Garden Landscaping",
      description:
        "Complete garden makeover including new plants and irrigation system.",
      category: "Landscaping",
      budget: "$500-800",
      location: "San Francisco, CA",
      posted: "5 days ago",
      responses: 6,
      status: "cancelled",
      urgency: "low",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Service Requests
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage and track all your service requests
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/request-service">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search your requests..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {requests.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {requests.filter((r) => r.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {requests.filter((r) => r.status === "completed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Responses
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {requests.reduce((acc, r) => acc + r.responses, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {request.title}
                      </h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace("_", " ")}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency} priority
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {request.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {request.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {request.budget}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {request.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {request.posted}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {request.responses} responses
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {request.status === "active" && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Provider Info for In Progress/Completed */}
                {request.provider && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={request.provider.avatar}
                            alt={request.provider.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                            {request.provider.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {request.provider.name}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {request.provider.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      {request.status === "completed" && (
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No service requests yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Create your first service request to get started with finding
                local professionals.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/request-service">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
