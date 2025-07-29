"use client";

import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { XCircle, Eye, Flag, Ban } from "lucide-react";
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface ReportedContent {
  id: string
  type: "review" | "profile" | "message" | "job_post"
  reportedBy: string
  reportedUser: string
  reason: string
  contentSnippet: string
  status: "pending" | "reviewed" | "action_taken"
  timestamp: string
}

export default function ContentModerationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("pending")

  const { toast } = useToast()

  // Mock reported content data
  const mockReportedContent: ReportedContent[] = [
    {
      id: "rep-1",
      type: "review",
      reportedBy: "Customer A",
      reportedUser: "Provider X",
      reason: "Offensive language",
      contentSnippet: "This provider used extremely rude language and was unprofessional...",
      status: "pending",
      timestamp: "2 hours ago",
    },
    {
      id: "rep-2",
      type: "profile",
      reportedBy: "User B",
      reportedUser: "Provider Y",
      reason: "Misleading information",
      contentSnippet: "Provider claims to be licensed but is not. No valid license number.",
      status: "pending",
      timestamp: "1 day ago",
    },
    {
      id: "rep-3",
      type: "message",
      reportedBy: "Provider C",
      reportedUser: "Customer Z",
      reason: "Spam/Solicitation",
      contentSnippet: "Customer keeps sending unsolicited offers outside the platform.",
      status: "pending",
      timestamp: "5 hours ago",
    },
    {
      id: "rep-4",
      type: "job_post",
      reportedBy: "User D",
      reportedUser: "Customer W",
      reason: "Inappropriate content",
      contentSnippet: "Job post contains explicit or illegal requests.",
      status: "reviewed",
      timestamp: "3 days ago",
    },
    {
      id: "rep-5",
      type: "review",
      reportedBy: "Customer E",
      reportedUser: "Provider V",
      reason: "Fake review",
      contentSnippet: "This review seems, fake, very generic and similar to others.",
      status: "action_taken",
      timestamp: "1 week ago",
    },
  ]

  const filteredContent = mockReportedContent.filter((item) => {
    const matchesSearch =
      item.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportedUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || item.type === filterType
    const matchesStatus = filterStatus === "all" || item.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: ReportedContent["status"]) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700"
      case "reviewed":
        return "bg-yellow-100 text-yellow-700"
      case "action_taken":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleViewContent = (contentId: string) => {
    toast({
      title: "View Content",
      description: `Opening content for ID: ${contentId}`,
      variant: "default",
    })
    // In a real, app, open a modal or navigate to the content
  }

  const handleApprove = (contentId: string) => {
    toast({
      title: "Content Approved",
      description: `Content ID: ${contentId} has been approved.`,
      variant: "default",
    })
    // In a real, app, update status in backend
  }

  const handleReject = (contentId: string) => {
    toast({
      title: "Content Rejected",
      description: `Content ID: ${contentId} has been rejected and removed.`,
      variant: "destructive",
    })
    // In a real, app, remove content and update status
  }

  const handleBanUser = (userId: string) => {
    toast({
      title: "User Banned",
      description: `User: ${userId} has been banned from the platform.`,
      variant: "destructive",
    })
    // In a real, app, ban the user
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <OptimizedIcon name="Shield" className="w-9 h-9 text-trust-600" />
            Content & Moderation
          </h1>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <UIIcons.ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Ensure platform integrity by moderating user-generated, content, reviews, and profiles.
        </p>

        {/* Moderation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-glass-ai interactive-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
                <div className="text-4xl font-bold mt-2 text-red-800 dark:text-red-200">
                  {mockReportedContent.filter((c) => c.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Requires immediate review</p>
              </div>
              <Flag className="w-12 h-12 text-red-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="card-glass-premium interactive-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Reviewed Content</CardTitle>
                <div className="text-4xl font-bold mt-2 text-yellow-800 dark:text-yellow-200">
                  {mockReportedContent.filter((c) => c.status === "reviewed").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
              </div>
              <Eye className="w-12 h-12 text-yellow-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="card-glass-success interactive-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Action Taken</CardTitle>
                <div className="text-4xl font-bold mt-2 text-green-800 dark:text-green-200">
                  {mockReportedContent.filter((c) => c.status === "action_taken").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Resolved issues</p>
              </div>
              <UIIcons.CheckCircle className="w-12 h-12 text-green-600 opacity-30" />
            </CardContent>
          </Card>
        </div>

        {/* Reported Content List and Filters */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Flag className="w-6 h-6 text-primary" />
              Reported Content
            </CardTitle>
            <CardDescription>Review and take action on reported user-generated content.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by, content, user, or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                  <SelectItem value="job_post">Job Post</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="action_taken">Action Taken</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <NavigationIcons.Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No reported content found matching your criteria.</p>
                  <p className="text-sm">All clear! Or try adjusting your filters.</p>
                </div>
              ) : (
                filteredContent.map((item) => (
                  <Card key={item.id} className="card-glass-trust border-l-4 border-l-trust-500 interactive-hover">
                    <CardContent className="p-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">{item.type}</Badge>
                          <Badge className={getStatusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Report from {item.reportedBy} against {item.reportedUser}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Reason: {item.reason}</p>
                        <p className="text-sm text-foreground italic line-clamp-2">"{item.contentSnippet}"</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <OptimizedIcon name="Clock" className="w-3 h-3" />
                          {item.timestamp}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewContent(item.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {item.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(item.id)}>
                              <UIIcons.CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="secondary" onClick={() => handleBanUser(item.reportedUser)}>
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <Card className="card-glass-premium mt-10">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-3 text-trust-gradient">
              Maintain a Safe and Trustworthy Platform
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Proactively moderate content and ensure a positive experience for all users.
            </p>
            <Button size="lg" variant="default" asChild className="shadow-md hover:shadow-lg transition-all">
              <Link href="/admin">Back to Admin Dashboard <UIIcons.ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
