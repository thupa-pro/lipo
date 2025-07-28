import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XCircle, Eye, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface Job {
  id: string;
  title: string;
  category: string;
  customer: string;
  provider: string | null;
  status:
    | "open"
    | "assigned"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "disputed";
  price: number;
  postedDate: string;
  scheduledDate: string | null;
  location: string;
}

export default function ServiceJobManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { toast } = useToast();

  // Mock job data
  const mockJobs: Job[] = [
    {
      id: "job-1",
      title: "Deep House Cleaning",
      category: "Cleaning",
      customer: "Alice Johnson",
      provider: "Sarah Mitchell",
      status: "in-progress",
      price: 120,
      postedDate: "2024-04-15",
      scheduledDate: "2024-04-20",
      location: "Downtown, NY",
    },
    {
      id: "job-2",
      title: "Emergency Pipe Repair",
      category: "Handyman",
      customer: "Bob Smith",
      provider: "Mike Rodriguez",
      status: "disputed",
      price: 250,
      postedDate: "2024-04-10",
      scheduledDate: "2024-04-10",
      location: "Midtown, CA",
    },
    {
      id: "job-3",
      title: "Weekly Dog Walking",
      category: "Pet Care",
      customer: "Charlie Brown",
      provider: "Emma Thompson",
      status: "assigned",
      price: 80,
      postedDate: "2024-04-18",
      scheduledDate: "2024-04-22",
      location: "Uptown, IL",
    },
    {
      id: "job-4",
      title: "Website Development",
      category: "Design",
      customer: "Diana Prince",
      provider: null,
      status: "open",
      price: 1500,
      postedDate: "2024-04-19",
      scheduledDate: null,
      location: "Remote",
    },
    {
      id: "job-5",
      title: "Car Oil Change",
      category: "Auto Services",
      customer: "Eve Adams",
      provider: "Carlos Martinez",
      status: "completed",
      price: 75,
      postedDate: "2024-04-01",
      scheduledDate: "2024-04-05",
      location: "Houston, TX",
    },
    {
      id: "job-6",
      title: "Furniture Assembly",
      category: "Handyman",
      customer: "Frank White",
      provider: null,
      status: "cancelled",
      price: 100,
      postedDate: "2024-04-12",
      scheduledDate: "2024-04-15",
      location: "Seattle, WA",
    },
  ];

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.provider &&
        job.provider.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      job.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getJobStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "assigned":
        return "bg-purple-100 text-purple-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      case "disputed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleViewDetails = (jobId: string) => {
    toast({
      title: "View Job Details",
      description: `Opening details for job ID: ${jobId}`,
      variant: "default",
    });
    // In a real, app, navigate to a job details page
  };

  const handleUpdateStatus = (jobId: string, newStatus: Job["status"]) => {
    toast({
      title: "Job Status Updated",
      description: `Job ID: ${jobId} status changed to ${newStatus}.`,
      variant: "default",
    });
    // In a real, app, update job status in backend
  };

  const handleResolveConflict = (jobId: string) => {
    toast({
      title: "Resolve Conflict",
      description: `Initiating conflict resolution for job ID: ${jobId}.`,
      variant: "destructive",
    });
    // In a real, app, open a dispute resolution interface
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <BusinessIcons.Briefcase className="w-9 h-9 text-orange-600" />
            Service & Job Management
          </h1>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <UIIcons.ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Oversee all service, requests, bookings, and job statuses across the
          platform.
        </p>

        {/* Job Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Jobs
                </CardTitle>
                <div className="text-4xl font-bold mt-2 text-blue-800 dark:text-blue-200">
                  {mockJobs.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +200 this month
                </p>
              </div>
              <BusinessIcons.Briefcase className="w-12 h-12 text-blue-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Jobs
                </CardTitle>
                <div className="text-4xl font-bold mt-2 text-green-800 dark:text-green-200">
                  {mockJobs.filter((j) => j.status === "completed").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  92% completion rate
                </p>
              </div>
              <UIIcons.CheckCircle className="w-12 h-12 text-green-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Disputed Jobs
                </CardTitle>
                <div className="text-4xl font-bold mt-2 text-red-800 dark:text-red-200">
                  {mockJobs.filter((j) => j.status === "disputed").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires immediate attention
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-600 opacity-30" />
            </CardContent>
          </Card>
        </div>

        {/* Job List and Filters */}
        <Card className="shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BusinessIcons.Briefcase className="w-6 h-6 text-primary" />
              All Jobs
            </CardTitle>
            <CardDescription>
              Browse, filter, and manage all service requests and bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by job, title, customer, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="handyman">Handyman</SelectItem>
                  <SelectItem value="pet care">Pet Care</SelectItem>
                  <SelectItem value="auto services">Auto Services</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <NavigationIcons.Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    No jobs found matching your criteria.
                  </p>
                  <p className="text-sm">
                    Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <NavigationIcons.Users className="w-3 h-3" />
                            Customer: {job.customer}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <BusinessIcons.Briefcase className="w-3 h-3" />
                            Provider: {job.provider || "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-4">
                        <div className="text-right md:text-left">
                          <Badge variant="outline" className="capitalize mb-1">
                            {job.category}
                          </Badge>
                          <Badge className={getJobStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <BusinessIcons.Calendar className="w-3 h-3" />
                            {job.scheduledDate || job.postedDate}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(job.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            onValueChange={(value: Job["status"]) =>
                              handleUpdateStatus(job.id, value)
                            }
                          >
                            <SelectTrigger className="w-10 h-10 p-0 flex items-center justify-center">
                              <RefreshCcw className="w-4 h-4" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                              <SelectItem value="disputed">Disputed</SelectItem>
                            </SelectContent>
                          </Select>
                          {job.status === "disputed" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleResolveConflict(job.id)}
                            >
                              <OptimizedIcon name="MessageSquare" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <Card className="mt-10 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-950/30 dark:to-teal-950/30 shadow-xl border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-3 text-blue-800 dark:text-blue-200">
              Streamline Your Service Operations
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Efficiently manage all service requests and ensure smooth job
              completion with powerful tools.
            </p>
            <Button
              size="lg"
              variant="default"
              asChild
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/admin">
                Back to Admin Dashboard <UIIcons.ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
