"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Flag,
  Eye,
  XCircle,
  AlertTriangle, MoreHorizontal,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  ContentFlag,
  useAdminClient,
  formatFlagStatus
} from "@/lib/admin/utils";
import { useToast } from "@/hooks/use-toast";

export function ContentModeration() {
  const { toast } = useToast();
  const adminClient = useAdminClient();

  const [flags, setFlags] = useState<ContentFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFlags, setTotalFlags] = useState(0);
  const [selectedFlag, setSelectedFlag] = useState<ContentFlag | null>(null);
  const [contentDetails, setContentDetails] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadFlags();
  }, [currentPage, statusFilter, typeFilter]);

  const loadFlags = async () => {
    setIsLoading(true);
    try {
      const { flags: flagData, total } = await adminClient.getContentFlags(
        currentPage,
        ITEMS_PER_PAGE,
        statusFilter,
        typeFilter,
      );

      setFlags(flagData);
      setTotalFlags(total);
    } catch (error) {
      console.error("Error loading flags:", error);
      toast({
        title: "Error",
        description: "Failed to load content flags.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlagReview = async (
    flagId: string,
    action: "approve" | "reject" | "dismiss",
  ) => {
    try {
      await adminClient.reviewContentFlag(flagId, action, reviewNotes);

      const actionMessages = {
        approve: "Content flag approved and content removed.",
        reject: "Content flag rejected - no action taken.",
        dismiss: "Content flag dismissed.",
      };

      toast({
        title: "Success",
        description: actionMessages[action],
      });

      setReviewNotes("");
      setSelectedFlag(null);
      await loadFlags();
    } catch (error) {
      console.error("Error reviewing flag:", error);
      toast({
        title: "Error",
        description: "Failed to review content flag.",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async () => {
    if (selectedFlags.length === 0 || !bulkAction) {
      toast({
        title: "Invalid Selection",
        description: "Please select flags and an action.",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminClient.bulkModerationAction(
        selectedFlags,
        bulkAction as "approve" | "reject" | "dismiss",
      );

      toast({
        title: "Bulk Action Complete",
        description: `${selectedFlags.length} flags have been ${bulkAction}d.`,
      });

      setSelectedFlags([]);
      setBulkAction("");
      await loadFlags();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action.",
        variant: "destructive",
      });
    }
  };

  const handleViewContent = async (flag: ContentFlag) => {
    setSelectedFlag(flag);
    try {
      const details = await adminClient.getContentDetails(
        flag.content_type,
        flag.content_id,
      );
      setContentDetails(details);
    } catch (error) {
      console.error("Error loading content details:", error);
      setContentDetails(null);
    }
  };

  const handleSelectFlag = (flagId: string, checked: boolean) => {
    if (checked) {
      setSelectedFlags([...selectedFlags, flagId]);
    } else {
      setSelectedFlags(selectedFlags.filter((id) => id !== flagId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFlags(flags.map((flag) => flag.id));
    } else {
      setSelectedFlags([]);
    }
  };

  const renderFlagActions = (flag: ContentFlag) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleViewContent(flag)}>
          <Eye className="w-4 h-4 mr-2" />
          View Content
        </DropdownMenuItem>

        {flag.status === "pending" && (
          <>
            <DropdownMenuItem
              onClick={() => handleFlagReview(flag.id, "approve")}
              className="text-red-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Remove
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFlagReview(flag.id, "reject")}
              className="text-green-600"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Flag
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFlagReview(flag.id, "dismiss")}
              className="text-gray-600"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Dismiss
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const totalPages = Math.ceil(totalFlags / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Moderation</h2>
          <p className="text-gray-600">Review and moderate flagged content</p>
        </div>

        {/* Bulk Actions */}
        {selectedFlags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedFlags.length} selected
            </span>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bulk action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve All</SelectItem>
                <SelectItem value="reject">Reject All</SelectItem>
                <SelectItem value="dismiss">Dismiss All</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleBulkAction} disabled={!bulkAction}>
              Apply
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="listing">Listings</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="profile">Profiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Flags Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Content Flags ({totalFlags.toLocaleString()})</CardTitle>
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
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedFlags.length === flags.length &&
                          flags.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Flag Reason</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flags.map((flag) => {
                    const status = formatFlagStatus(flag.status);
                    return (
                      <TableRow key={flag.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFlags.includes(flag.id)}
                            onCheckedChange={(checked) =>
                              handleSelectFlag(flag.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-red-500" />
                            <div>
                              <div className="font-medium">
                                {flag.content_type} #
                                {flag.content_id.slice(0, 8)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {flag.reason}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{flag.content_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{flag.flag_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {flag.reported_by?.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(flag.created_at), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>{renderFlagActions(flag)}</TableCell>
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
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalFlags)} of{" "}
                  {totalFlags}
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

      {/* Content Review Modal */}
      {selectedFlag && (
        <Dialog
          open={!!selectedFlag}
          onOpenChange={() => setSelectedFlag(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Flagged Content</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Flag Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Flag Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Content Type
                      </Label>
                      <p>{selectedFlag.content_type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Flag Type</Label>
                      <p>{selectedFlag.flag_type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Reported Date
                      </Label>
                      <p>{format(new Date(selectedFlag.created_at), "PPP")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge
                        className={formatFlagStatus(selectedFlag.status).color}
                      >
                        {formatFlagStatus(selectedFlag.status).label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Reason</Label>
                    <p>{selectedFlag.reason}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Content Preview */}
              {contentDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(contentDetails, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Actions */}
              {selectedFlag.status === "pending" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Moderation Action</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Review Notes</Label>
                      <Textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes about your decision..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Remove Content
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Content</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will approve the flag and permanently remove
                              the content from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleFlagReview(selectedFlag.id, "approve")
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove Content
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleFlagReview(selectedFlag.id, "reject")
                        }
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Flag
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleFlagReview(selectedFlag.id, "dismiss")
                        }
                      >
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
