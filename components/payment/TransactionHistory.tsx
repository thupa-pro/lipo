"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Receipt,
  CreditCard,
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  AlertTriangle,
  X,
  ExternalLink,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  type:
    | "payment"
    | "refund"
    | "payout"
    | "fee"
    | "chargeback"
    | "dispute_resolution";
  status: "completed" | "pending" | "failed" | "disputed" | "cancelled";
  amount: number;
  currency: string;
  description: string;
  timestamp: Date;

  // Participants
  customer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };

  // Payment details
  paymentMethod?: {
    type: "card" | "bank" | "wallet" | "crypto";
    last4?: string;
    brand?: string;
    accountInfo?: string;
  };

  // Service details
  service?: {
    id: string;
    title: string;
    category: string;
  };

  // Transaction metadata
  fees?: {
    platform: number;
    processing: number;
    total: number;
  };

  // Related transactions
  relatedTransactionId?: string;
  escrowTransactionId?: string;

  // Dispute information
  dispute?: {
    id: string;
    reason: string;
    status: "open" | "investigating" | "resolved";
    resolution?: string;
  };

  // Receipt and documentation
  receiptUrl?: string;
  invoiceUrl?: string;

  // Internal tracking
  internalNotes?: string;
  tags?: string[];
}

interface TransactionHistoryProps {
  userType: "customer" | "provider" | "admin";
  userId?: string;
  className?: string;
}

export function TransactionHistory({
  userType,
  userId,
  className,
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize with mock data
  React.useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: "tx_001",
        type: "payment",
        status: "completed",
        amount: 125.0,
        currency: "USD",
        description: "House Deep Cleaning Service",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        customer: {
          id: "customer_1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        provider: {
          id: "provider_1",
          name: "Mike Rodriguez",
          email: "mike@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        paymentMethod: {
          type: "card",
          last4: "4242",
          brand: "Visa",
        },
        service: {
          id: "service_1",
          title: "House Deep Cleaning",
          category: "Cleaning",
        },
        fees: {
          platform: 6.25,
          processing: 3.75,
          total: 10.0,
        },
        escrowTransactionId: "escrow_001",
        receiptUrl: "/receipts/tx_001.pdf",
        tags: ["completed", "cleaning"],
      },
      {
        id: "tx_002",
        type: "payout",
        status: "completed",
        amount: 115.0,
        currency: "USD",
        description: "Payout for House Cleaning Service",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        provider: {
          id: "provider_1",
          name: "Mike Rodriguez",
          email: "mike@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        paymentMethod: {
          type: "bank",
          accountInfo: "Bank of America ****1234",
        },
        relatedTransactionId: "tx_001",
        receiptUrl: "/receipts/tx_002.pdf",
        tags: ["payout", "bank_transfer"],
      },
      {
        id: "tx_003",
        type: "refund",
        status: "completed",
        amount: 85.0,
        currency: "USD",
        description: "Refund for Cancelled Handyman Service",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        customer: {
          id: "customer_2",
          name: "David Chen",
          email: "david@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        provider: {
          id: "provider_2",
          name: "Emma Thompson",
          email: "emma@example.com",
        },
        paymentMethod: {
          type: "card",
          last4: "5555",
          brand: "Mastercard",
        },
        service: {
          id: "service_2",
          title: "Handyman Repair",
          category: "Repair",
        },
        relatedTransactionId: "tx_004",
        receiptUrl: "/receipts/tx_003.pdf",
        tags: ["refund", "cancelled"],
      },
      {
        id: "tx_004",
        type: "payment",
        status: "disputed",
        amount: 200.0,
        currency: "USD",
        description: "Garden Landscaping Service",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        customer: {
          id: "customer_3",
          name: "Maria Santos",
          email: "maria@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        provider: {
          id: "provider_3",
          name: "Alex Wilson",
          email: "alex@example.com",
        },
        paymentMethod: {
          type: "card",
          last4: "1111",
          brand: "American Express",
        },
        service: {
          id: "service_3",
          title: "Garden Landscaping",
          category: "Landscaping",
        },
        fees: {
          platform: 10.0,
          processing: 6.0,
          total: 16.0,
        },
        dispute: {
          id: "dispute_001",
          reason: "Work not completed as agreed",
          status: "investigating",
          resolution: "Under review by support team",
        },
        escrowTransactionId: "escrow_003",
        tags: ["disputed", "landscaping"],
      },
      {
        id: "tx_005",
        type: "fee",
        status: "completed",
        amount: 10.0,
        currency: "USD",
        description: "Platform Fee - House Cleaning Service",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        relatedTransactionId: "tx_001",
        tags: ["fee", "platform"],
      },
      {
        id: "tx_006",
        type: "chargeback",
        status: "pending",
        amount: 75.0,
        currency: "USD",
        description: "Chargeback - Pet Grooming Service",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        customer: {
          id: "customer_4",
          name: "John Smith",
          email: "john@example.com",
        },
        provider: {
          id: "provider_4",
          name: "Lisa Parker",
          email: "lisa@example.com",
        },
        paymentMethod: {
          type: "card",
          last4: "9999",
          brand: "Visa",
        },
        dispute: {
          id: "dispute_002",
          reason: "Unauthorized transaction",
          status: "investigating",
        },
        tags: ["chargeback", "investigation"],
      },
    ];

    setTransactions(mockTransactions);
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(query) ||
          tx.id.toLowerCase().includes(query) ||
          tx.customer?.name.toLowerCase().includes(query) ||
          tx.provider?.name.toLowerCase().includes(query) ||
          tx.service?.title.toLowerCase().includes(query),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const days = parseInt(dateRange);
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((tx) => tx.timestamp >= cutoff);
    }

    return filtered.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }, [transactions, searchQuery, typeFilter, statusFilter, dateRange]);

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "payment":
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case "payout":
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      case "refund":
        return <ArrowUpRight className="w-4 h-4 text-yellow-600" />;
      case "fee":
        return <DollarSign className="w-4 h-4 text-purple-600" />;
      case "chargeback":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "dispute_resolution":
        return <Shield className="w-4 h-4 text-orange-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "disputed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getAmountDisplay = (transaction: Transaction) => {
    const isIncoming =
      transaction.type === "payment" || transaction.type === "payout";
    const isOutgoing =
      transaction.type === "refund" ||
      transaction.type === "fee" ||
      transaction.type === "chargeback";

    let sign = "";
    let colorClass = "text-gray-900 dark:text-gray-100";

    if (userType === "customer") {
      if (transaction.type === "payment" || transaction.type === "fee") {
        sign = "-";
        colorClass = "text-red-600";
      } else if (transaction.type === "refund") {
        sign = "+";
        colorClass = "text-green-600";
      }
    } else if (userType === "provider") {
      if (transaction.type === "payout") {
        sign = "+";
        colorClass = "text-green-600";
      } else if (transaction.type === "payment") {
        sign = "+";
        colorClass = "text-green-600";
      }
    }

    return (
      <span className={cn("font-semibold", colorClass)}>
        {sign}${Math.abs(transaction.amount).toFixed(2)}
      </span>
    );
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your transaction history is being prepared for download",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Transactions updated",
        description: "Transaction history has been refreshed",
      });
    }, 1000);
  };

  // Calculate summary stats
  const totalIncoming = filteredTransactions
    .filter(
      (tx) =>
        (userType === "customer" && tx.type === "refund") ||
        (userType === "provider" &&
          (tx.type === "payout" || tx.type === "payment")),
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOutgoing = filteredTransactions
    .filter(
      (tx) =>
        (userType === "customer" &&
          (tx.type === "payment" || tx.type === "fee")) ||
        (userType === "provider" && tx.type === "refund"),
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netAmount = totalIncoming - totalOutgoing;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Incoming
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalIncoming.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Outgoing
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ${totalOutgoing.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Net Amount
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    netAmount >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  ${Math.abs(netAmount).toFixed(2)}
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  netAmount >= 0
                    ? "bg-green-100 dark:bg-green-900/20"
                    : "bg-red-100 dark:bg-red-900/20",
                )}
              >
                <DollarSign
                  className={cn(
                    "w-6 h-6",
                    netAmount >= 0 ? "text-green-600" : "text-red-600",
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Transactions
                </p>
                <p className="text-2xl font-bold">
                  {filteredTransactions.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="payout">Payouts</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                  <SelectItem value="chargeback">Chargebacks</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn("w-4 h-4", isLoading && "animate-spin")}
                />
              </Button>

              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No transactions found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't made any transactions yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                    transaction.status === "disputed" &&
                      "border-orange-200 dark:border-orange-800",
                    transaction.status === "failed" &&
                      "border-red-200 dark:border-red-800",
                  )}
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">
                          {transaction.description}
                        </h4>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        {transaction.dispute && (
                          <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-600"
                          >
                            Disputed
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ID: {transaction.id}</span>
                        <span>{transaction.timestamp.toLocaleString()}</span>
                        {transaction.paymentMethod && (
                          <span>
                            {transaction.paymentMethod.brand} ****
                            {transaction.paymentMethod.last4}
                          </span>
                        )}
                        {transaction.service && (
                          <span>{transaction.service.category}</span>
                        )}
                      </div>
                    </div>

                    {/* Participant Info */}
                    <div className="flex items-center gap-2">
                      {transaction.customer && userType !== "customer" && (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={transaction.customer.avatar} />
                            <AvatarFallback className="text-xs">
                              {transaction.customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {transaction.customer.name}
                          </span>
                        </div>
                      )}

                      {transaction.provider && userType !== "provider" && (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={transaction.provider.avatar} />
                            <AvatarFallback className="text-xs">
                              {transaction.provider.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {transaction.provider.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg">
                        {getAmountDisplay(transaction)}
                      </div>
                      {transaction.fees && (
                        <div className="text-xs text-muted-foreground">
                          Fee: ${transaction.fees.total.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {transaction.receiptUrl && (
                        <Button size="sm" variant="ghost">
                          <Receipt className="w-3 h-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Transaction ID: {selectedTransaction.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Transaction Info</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Type:</strong> {selectedTransaction.type}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedTransaction.status}
                    </p>
                    <p>
                      <strong>Amount:</strong> $
                      {selectedTransaction.amount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {selectedTransaction.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="space-y-1 text-sm">
                    {selectedTransaction.paymentMethod && (
                      <>
                        <p>
                          <strong>Type:</strong>{" "}
                          {selectedTransaction.paymentMethod.type}
                        </p>
                        {selectedTransaction.paymentMethod.brand && (
                          <p>
                            <strong>Card:</strong>{" "}
                            {selectedTransaction.paymentMethod.brand} ****
                            {selectedTransaction.paymentMethod.last4}
                          </p>
                        )}
                        {selectedTransaction.paymentMethod.accountInfo && (
                          <p>
                            <strong>Account:</strong>{" "}
                            {selectedTransaction.paymentMethod.accountInfo}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              {selectedTransaction.service && (
                <div>
                  <h4 className="font-medium mb-2">Service Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Title:</strong>{" "}
                      {selectedTransaction.service.title}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {selectedTransaction.service.category}
                    </p>
                  </div>
                </div>
              )}

              {/* Participants */}
              <div className="grid grid-cols-2 gap-4">
                {selectedTransaction.customer && (
                  <div>
                    <h4 className="font-medium mb-2">Customer</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={selectedTransaction.customer.avatar}
                        />
                        <AvatarFallback>
                          {selectedTransaction.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {selectedTransaction.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedTransaction.customer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTransaction.provider && (
                  <div>
                    <h4 className="font-medium mb-2">Provider</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={selectedTransaction.provider.avatar}
                        />
                        <AvatarFallback>
                          {selectedTransaction.provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {selectedTransaction.provider.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedTransaction.provider.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fees Breakdown */}
              {selectedTransaction.fees && (
                <div>
                  <h4 className="font-medium mb-2">Fee Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>
                        ${selectedTransaction.fees.platform.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>
                        ${selectedTransaction.fees.processing.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total Fees:</span>
                      <span>${selectedTransaction.fees.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute Info */}
              {selectedTransaction.dispute && (
                <div className="border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-orange-800">
                    Dispute Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Reason:</strong>{" "}
                      {selectedTransaction.dispute.reason}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {selectedTransaction.dispute.status}
                    </p>
                    {selectedTransaction.dispute.resolution && (
                      <p>
                        <strong>Resolution:</strong>{" "}
                        {selectedTransaction.dispute.resolution}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedTransaction.receiptUrl && (
                  <Button variant="outline" size="sm">
                    <Receipt className="w-3 h-3 mr-1" />
                    Download Receipt
                  </Button>
                )}
                {selectedTransaction.invoiceUrl && (
                  <Button variant="outline" size="sm">
                    <FileText className="w-3 h-3 mr-1" />
                    View Invoice
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View in Escrow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
