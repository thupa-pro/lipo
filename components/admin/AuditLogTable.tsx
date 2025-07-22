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
  DialogTitle
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Activity,
  Database
} from "lucide-react";
import { format } from "date-fns";
import { AuditLogEntry, useAdminClient } from "@/lib/admin/utils";
import { useToast } from "@/hooks/use-toast";

export function AuditLogTable() {
  const { toast } = useToast();
  const adminClient = useAdminClient();

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    loadAuditLogs();
  }, [currentPage, actionFilter, userFilter, dateFrom, dateTo]);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const { logs: logData, total } = await adminClient.getAuditLogs(
        currentPage,
        ITEMS_PER_PAGE,
        actionFilter,
        userFilter,
        dateFrom,
        dateTo,
      );

      setLogs(logData);
      setTotalLogs(total);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to load audit logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportLogs = async () => {
    try {
      const csv = await adminClient.exportData("analytics");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit_logs_${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Complete",
        description: "Audit logs have been exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting logs:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export audit logs.",
        variant: "destructive",
      });
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "text-green-600 bg-green-100";
      case "update":
        return "text-blue-600 bg-blue-100";
      case "delete":
        return "text-red-600 bg-red-100";
      case "login":
        return "text-purple-600 bg-purple-100";
      case "logout":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const totalPages = Math.ceil(totalLogs / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Audit Logs</h2>
          <p className="text-gray-600">
            Track all system activities and user actions
          </p>
        </div>
        <Button onClick={exportLogs}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="User ID..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />

            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Audit Logs ({totalLogs.toLocaleString()})</CardTitle>
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
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.entity_type}</div>
                          <div className="text-sm text-gray-600">
                            {log.entity_id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.user_email}</div>
                          <div className="text-sm text-gray-600">
                            {log.user_id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {log.ip_address || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(log.created_at), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-gray-600">
                          {format(new Date(log.created_at), "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalLogs)} of{" "}
                  {totalLogs}
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

      {/* Log Details Modal */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Action
                  </div>
                  <Badge className={getActionColor(selectedLog.action)}>
                    {selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Entity Type
                  </div>
                  <div>{selectedLog.entity_type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Entity ID
                  </div>
                  <div className="font-mono text-sm">
                    {selectedLog.entity_id}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">User</div>
                  <div>{selectedLog.user_email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    IP Address
                  </div>
                  <div className="font-mono text-sm">
                    {selectedLog.ip_address || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Timestamp
                  </div>
                  <div>{format(new Date(selectedLog.created_at), "PPpp")}</div>
                </div>
              </div>

              {selectedLog.user_agent && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    User Agent
                  </div>
                  <div className="text-sm bg-gray-100 p-2 rounded">
                    {selectedLog.user_agent}
                  </div>
                </div>
              )}

              {selectedLog.changes &&
                Object.keys(selectedLog.changes).length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      Changes
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(selectedLog.changes, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
