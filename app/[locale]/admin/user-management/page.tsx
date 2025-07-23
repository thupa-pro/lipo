"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  XCircle,
  Edit,
  Eye,
  UserPlus,
  UserX,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: "customer" | "provider" | "admin"
  status: "active" | "suspended" | "pending"
  lastActive: string
  avatar: string
}

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const { toast } = useToast()

  // Mock user data
  const mockUsers: User[] = [
    {
      id: "user-1",
      name: "Alice Johnson",
      email: "alice.j@example.com",
      phone: "+1 (555) 101-2000",
      location: "New, York, NY",
      role: "customer",
      status: "active",
      lastActive: "2 hours ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-2",
      name: "Bob Smith",
      email: "bob.s@example.com",
      phone: "+1 (555) 102-2001",
      location: "Los, Angeles, CA",
      role: "provider",
      status: "active",
      lastActive: "15 minutes ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-3",
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      phone: "+1 (555) 103-2002",
      location: "Chicago, IL",
      role: "customer",
      status: "suspended",
      lastActive: "3 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-4",
      name: "Diana Prince",
      email: "diana.p@example.com",
      phone: "+1 (555) 104-2003",
      location: "Miami, FL",
      role: "provider",
      status: "pending",
      lastActive: "5 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-5",
      name: "Eve Adams",
      email: "eve.a@example.com",
      phone: "+1 (555) 105-2004",
      location: "Houston, TX",
      role: "admin",
      status: "active",
      lastActive: "Just now",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-6",
      name: "Frank White",
      email: "frank.w@example.com",
      phone: "+1 (555) 106-2005",
      location: "Seattle, WA",
      role: "customer",
      status: "active",
      lastActive: "1 day ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getUserStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "suspended":
        return "bg-red-100 text-red-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleViewEdit = (userId: string) => {
    toast({
      title: "View/Edit User",
      description: `Opening profile for user ID: ${userId}`,
      variant: "default",
    })
    // In a real, app, navigate to a user edit page
  }

  const handleSuspendActivate = (userId: string, currentStatus: User["status"]) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active"
    toast({
      title: "User Status Updated",
      description: `User ID: ${userId} status changed to ${newStatus}.`,
      variant: newStatus === "suspended" ? "destructive" : "default",
    })
    // In a real, app, update user status in backend
  }

  const handleChangeRole = (userId: string, newRole: User["role"]) => {
    toast({
      title: "User Role Updated",
      description: `User ID: ${userId} role changed to ${newRole}.`,
      variant: "default",
    })
    // In a real, app, update user role in backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-9 h-9 text-blue-600" />
            User Management
          </h1>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Comprehensive tools for overseeing and managing all user accounts on the Loconomy platform.
        </p>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <div className="text-4xl font-bold mt-2 text-blue-800 dark:text-blue-200">{mockUsers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">+50 new this month</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                <div className="text-4xl font-bold mt-2 text-green-800 dark:text-green-200">
                  {mockUsers.filter((u) => u.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">85% engagement rate</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending/Suspended</CardTitle>
                <div className="text-4xl font-bold mt-2 text-yellow-800 dark:text-yellow-200">
                  {mockUsers.filter((u) => u.status === "pending" || u.status === "suspended").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </div>
              <UserX className="w-12 h-12 text-yellow-600 opacity-30" />
            </CardContent>
          </Card>
        </div>

        {/* User List and Filters */}
        <Card className="shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6 text-primary" />
              All Users
            </CardTitle>
            <CardDescription>Browse, filter, and manage all user accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by, name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No users found matching your criteria.</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{user.email}</span>
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-4">
                        <div className="text-right md:text-left">
                          <Badge variant="outline" className="capitalize mb-1">
                            {user.role}
                          </Badge>
                          <Badge className={getUserStatusColor(user.status)}>{user.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {user.lastActive}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewEdit(user.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={user.status === "active" ? "destructive" : "default"}
                            onClick={() => handleSuspendActivate(user.id, user.status)}
                          >
                            {user.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          <Select onValueChange={(value: User["role"]) => handleChangeRole(user.id, value)}>
                            <SelectTrigger className="w-10 h-10 p-0 flex items-center justify-center">
                              <Briefcase className="w-4 h-4" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="provider">Provider</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
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
        <Card className="mt-10 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-950/30 dark:to-green-950/30 shadow-xl border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-3 text-blue-800 dark:text-blue-200">
              Efficiently Manage Your User Base
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Maintain a healthy and secure community with powerful user management tools at your fingertips.
            </p>
            <Button size="lg" variant="default" asChild className="shadow-md hover:shadow-lg transition-all">
              <Link href="/admin">Back to Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}