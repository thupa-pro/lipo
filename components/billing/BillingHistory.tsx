"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Download,
  Search,
  Filter,
  Receipt,
  ExternalLink,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { billingClient } from "@/lib/billing/utils";
import type { Invoice } from "@/lib/billing/types";

export function BillingHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const response = await billingClient.getInvoices(50); // Load more invoices for history
      if (response.success) {
        setInvoices(response.data || []);
      }
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error("Failed to load billing history");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    setDownloadingInvoice(invoiceId);
    try {
      const response = await billingClient.downloadInvoice(invoiceId);
      if (response.success && response.data) {
        // Create a blob and download
        const link = document.createElement("a");
        link.href = response.data;
        link.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Invoice downloaded successfully");
      } else {
        toast.error("Failed to download invoice");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "open":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-600" />;
      case "uncollectible":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "void":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-600";
      case "open":
        return "bg-blue-100 text-blue-600";
      case "draft":
        return "bg-gray-100 text-gray-600";
      case "uncollectible":
        return "bg-red-100 text-red-600";
      case "void":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatCurrency(invoice.total, invoice.currency).includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const invoiceDate = new Date(invoice.created * 1000);
      const now = new Date();

      switch (dateFilter) {
        case "last_month":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          matchesDate = invoiceDate >= lastMonth;
          break;
        case "last_3_months":
          const last3Months = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            1,
          );
          matchesDate = invoiceDate >= last3Months;
          break;
        case "last_year":
          const lastYear = new Date(now.getFullYear() - 1, 0, 1);
          matchesDate = invoiceDate >= lastYear;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalAmount = filteredInvoices.reduce(
    (sum, invoice) => sum + invoice.total,
    0,
  );
  const paidAmount = filteredInvoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.total, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.length} total invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                totalAmount,
                filteredInvoices[0]?.currency || "USD",
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time billing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                paidAmount,
                filteredInvoices[0]?.currency || "USD",
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View and download your invoices and billing statements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="uncollectible">Uncollectible</SelectItem>
                <SelectItem value="void">Void</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Button */}
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Invoices Table */}
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No invoices found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Your invoices will appear here once you have billing activity"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                          <span>{invoice.number || invoice.id.slice(-8)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(invoice.created)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </div>
                        {invoice.amountDue > 0 && invoice.status === "open" && (
                          <div className="text-sm text-red-600">
                            Due:{" "}
                            {formatCurrency(
                              invoice.amountDue,
                              invoice.currency,
                            )}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={cn(
                            "flex items-center gap-1 w-fit",
                            getStatusColor(invoice.status),
                          )}
                        >
                          {getStatusIcon(invoice.status)}
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="max-w-xs truncate">
                          {invoice.description ||
                            `Invoice for ${formatDate(invoice.periodStart)} - ${formatDate(invoice.periodEnd)}`}
                        </div>
                        {invoice.lines.data.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {invoice.lines.data[0].description}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {invoice.hostedInvoiceUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(invoice.hostedInvoiceUrl, "_blank")
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            disabled={downloadingInvoice === invoice.id}
                          >
                            {downloadingInvoice === invoice.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>

                          {invoice.invoicePdf && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(invoice.invoicePdf, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
