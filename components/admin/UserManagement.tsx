"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  UserX,
  UserCheck,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  UserManagementData,
  useAdminClient,
  formatUserStatus
} from "@/lib/admin/utils";
import { useToast } from "@/hooks/use-toast";

export function UserManagement() {
  const { toast } = useToast();
  const adminClient = useAdminClient();

  const [users, setUsers] = useState<UserManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserManagementData | null>(
    null,
  );
  const [actionReason, setActionReason] = useState("");
  const [newRole, setNewRole] = useState("");

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { users: userData, total } =
        await adminClient.getUserManagementData(
          currentPage,
          ITEMS_PER_PAGE,
          searchQuery,
          roleFilter,
          statusFilter,
        );

      setUsers(userData);
      setTotalUsers(total);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load user data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    userId: string,
    newStatus: "active" | "suspended" | "banned",
  ) => {
    if (!actionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for this action.",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminClient.updateUserStatus(userId, newStatus, actionReason);
      toast({
        title: "Success",
        description: `User status updated to ${newStatus}.`,
      });

      setActionReason("");
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  const handleRoleUpdate = async (userId: string) => {
    if (!newRole) {
      toast({
        title: "Role Required",
        description: "Please select a new role.",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminClient.updateUserRole(userId, newRole);
      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      });

      setNewRole("");
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const exportUsers = async () => {
    try {
      const csv = await adminClient.exportData("users");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Complete",
        description: "User data has been exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting users:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export user data.",
        variant: "destructive",
      });
    }
  };

  const renderUserActions = (user: UserManagementData) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {user.status === "active" && (
          <>
            <DropdownMenuItem
              onClick={() => setSelectedUser(user)}
              className="text-yellow-600"
            >
              <UserX className="w-4 h-4 mr-2" />
              Suspend User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSelectedUser(user)}
              className="text-red-600"
            >
              <Ban className="w-4 h-4 mr-2" />
              Ban User
            </DropdownMenuItem>
          </>
        )}

        {user.status !== "active" && (
          <DropdownMenuItem
            onClick={() => setSelectedUser(user)}
            className="text-green-600"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Reactivate User
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
          <Shield className="w-4 h-4 mr-2" />
          Change Role
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Mail className="w-4 h-4 mr-2" />
          Send Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">
            Manage user, accounts, roles, and status
          </p>
        </div>
        <Button onClick={exportUsers}>
          <Download className="w-4 h-4 mr-2" />
          Export Users
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Users ({totalUsers.toLocaleString()})</CardTitle>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const status = formatUserStatus(user.status);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {user.full_name || "Unnamed User"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.total_bookings} bookings</div>
                            {user.last_active && (
                              <div className="text-gray-600">
                                Last:{" "}
                                {format(new Date(user.last_active), "MMM d")}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ${user.total_spent.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(user.created_at), "MMM, d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>{renderUserActions(user)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of{" "}
                  {totalUsers}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p>{selectedUser.full_name || "Unnamed User"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <Badge variant="secondary">{selectedUser.role}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    className={formatUserStatus(selectedUser.status).color}
                  >
                    {formatUserStatus(selectedUser.status).label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Bookings</Label>
                  <p>{selectedUser.total_bookings}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Spent</Label>
                  <p>${selectedUser.total_spent.toLocaleString()}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Update Status</Label>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-600"
                      >
                        Suspend
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Suspend User</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="space-y-4">
                            <p>
                              This will suspend the user's account. They won't
                              be able to use the platform.
                            </p>
                            <div>
                              <Label>Reason</Label>
                              <Textarea
                                value={actionReason}
                                onChange={(e) =>
                                  setActionReason(e.target.value)
                                }
                                placeholder="Provide a reason for suspension..."
                              />
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleStatusUpdate(selectedUser.id, "suspended")
                          }
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Suspend User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        Ban
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Ban User</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="space-y-4">
                            <p>
                              This will permanently ban the user from the
                              platform.
                            </p>
                            <div>
                              <Label>Reason</Label>
                              <Textarea
                                value={actionReason}
                                onChange={(e) =>
                                  setActionReason(e.target.value)
                                }
                                placeholder="Provide a reason for banning..."
                              />
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleStatusUpdate(selectedUser.id, "banned")
                          }
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ban User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {selectedUser.status !== "active" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600"
                        >
                          Reactivate
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reactivate User</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="space-y-4">
                              <p>This will reactivate the user's account.</p>
                              <div>
                                <Label>Reason</Label>
                                <Textarea
                                  value={actionReason}
                                  onChange={(e) =>
                                    setActionReason(e.target.value)
                                  }
                                  placeholder="Provide a reason for reactivation..."
                                />
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleStatusUpdate(selectedUser.id, "active")
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Reactivate User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>

              {/* Role Update */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Change Role</Label>
                <div className="flex gap-2">
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select new role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumer">Consumer</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => handleRoleUpdate(selectedUser.id)}
                    disabled={!newRole || newRole === selectedUser.role}
                  >
                    Update Role
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
