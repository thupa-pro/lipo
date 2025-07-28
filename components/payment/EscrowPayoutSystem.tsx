import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { X, Eye, Download, RefreshCw, CreditCard, Banknote, TrendingUp, Filter, MoreHorizontal, ExternalLink, FileText, Wallet, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface EscrowTransaction {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "held" | "released" | "disputed" | "refunded" | "expired";
  createdAt: Date;
  releasedAt?: Date;
  expiresAt?: Date;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
  };
  service: {
    title: string;
    category: string;
    description: string;
  };
  fees: {
    platform: number;
    processing: number;
    total: number;
  };
  payoutAmount: number;
  releaseConditions: {
    serviceCompleted: boolean;
    customerApproval: boolean;
    disputeResolved: boolean;
    timeoutReached: boolean;
  };
  dispute?: {
    id: string;
    reason: string;
    status: "open" | "investigating" | "resolved";
    createdAt: Date;
    messages: Array<{
      from: "customer" | "provider" | "admin";
      message: string;
      timestamp: Date;
    }>;
  };
}

interface PayoutRequest {
  id: string;
  providerId: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed";
  requestedAt: Date;
  processedAt?: Date;
  failureReason?: string;
  payoutMethod: {
    type: "bank_transfer" | "paypal" | "stripe_express" | "crypto";
    accountInfo: string;
    processingTime: string;
  };
  transactions: string[]; // escrow transaction IDs
}

interface EscrowPayoutSystemProps {
  userType: "customer" | "provider" | "admin";
  userId?: string;
  className?: string;
}

export function EscrowPayoutSystem({
  userType,
  userId,
  className,
}: EscrowPayoutSystemProps) {
  const [escrowTransactions, setEscrowTransactions] = useState<
    EscrowTransaction[]
  >([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<EscrowTransaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    const mockEscrowTransactions: EscrowTransaction[] = [
      {
        id: "escrow_001",
        bookingId: "booking_123",
        amount: 125.0,
        currency: "USD",
        status: "held",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        customer: {
          id: "customer_1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
        },
        provider: {
          id: "provider_1",
          name: "Mike Rodriguez",
          email: "mike@example.com",
        },
        service: {
          title: "House Deep Cleaning",
          category: "Cleaning",
          description: "3-bedroom house deep cleaning service",
        },
        fees: {
          platform: 6.25, // 5%
          processing: 3.75, // 3%
          total: 10.0,
        },
        payoutAmount: 115.0,
        releaseConditions: {
          serviceCompleted: true,
          customerApproval: false,
          disputeResolved: true,
          timeoutReached: false,
        },
      },
      {
        id: "escrow_002",
        bookingId: "booking_124",
        amount: 85.0,
        currency: "USD",
        status: "released",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        releasedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        customer: {
          id: "customer_2",
          name: "David Chen",
          email: "david@example.com",
        },
        provider: {
          id: "provider_2",
          name: "Emma Thompson",
          email: "emma@example.com",
        },
        service: {
          title: "Handyman Repair",
          category: "Repair",
          description: "Kitchen faucet leak repair",
        },
        fees: {
          platform: 4.25,
          processing: 2.55,
          total: 6.8,
        },
        payoutAmount: 78.2,
        releaseConditions: {
          serviceCompleted: true,
          customerApproval: true,
          disputeResolved: true,
          timeoutReached: false,
        },
      },
      {
        id: "escrow_003",
        bookingId: "booking_125",
        amount: 200.0,
        currency: "USD",
        status: "disputed",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        customer: {
          id: "customer_3",
          name: "Maria Santos",
          email: "maria@example.com",
        },
        provider: {
          id: "provider_3",
          name: "Alex Wilson",
          email: "alex@example.com",
        },
        service: {
          title: "Garden Landscaping",
          category: "Landscaping",
          description: "Backyard garden design and installation",
        },
        fees: {
          platform: 10.0,
          processing: 6.0,
          total: 16.0,
        },
        payoutAmount: 184.0,
        releaseConditions: {
          serviceCompleted: true,
          customerApproval: false,
          disputeResolved: false,
          timeoutReached: false,
        },
        dispute: {
          id: "dispute_001",
          reason: "Work not completed as agreed",
          status: "investigating",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          messages: [
            {
              from: "customer",
              message:
                "The landscaping work was only partially completed. Several plants were not installed as discussed.",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
              from: "provider",
              message:
                "I completed all work as specified in the original agreement. The additional plants mentioned were discussed but not part of the original scope.",
              timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
            },
            {
              from: "admin",
              message:
                "We're reviewing both the original agreement and the dispute details. We'll provide a resolution within 48 hours.",
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            },
          ],
        },
      },
    ];

    const mockPayoutRequests: PayoutRequest[] = [
      {
        id: "payout_001",
        providerId: "provider_1",
        amount: 115.0,
        currency: "USD",
        status: "pending",
        requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        payoutMethod: {
          type: "bank_transfer",
          accountInfo: "Bank of America ****1234",
          processingTime: "1-3 business days",
        },
        transactions: ["escrow_002"],
      },
      {
        id: "payout_002",
        providerId: "provider_2",
        amount: 342.5,
        currency: "USD",
        status: "completed",
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        payoutMethod: {
          type: "stripe_express",
          accountInfo: "Stripe Express Account",
          processingTime: "Instant",
        },
        transactions: ["escrow_004", "escrow_005"],
      },
    ];

    setEscrowTransactions(mockEscrowTransactions);
    setPayoutRequests(mockPayoutRequests);
  }, []);

  const getStatusColor = (status: EscrowTransaction["status"]) => {
    switch (status) {
      case "held":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "released":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "disputed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "refunded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: EscrowTransaction["status"]) => {
    switch (status) {
      case "held":
        return <Lock className="w-4 h-4" />;
      case "released":
        return <Unlock className="w-4 h-4" />;
      case "disputed":
        return <UIIcons.AlertTriangle className="w-4 h-4" />;
      case "refunded":
        return <UIIcons.ArrowLeft className="w-4 h-4" />;
      case "expired":
        return <OptimizedIcon name="Clock" className="w-4 h-4" />;
      default:
        return <OptimizedIcon name="Shield" className="w-4 h-4" />;
    }
  };

  const handleReleaseEscrow = async (transactionId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEscrowTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? {
                ...tx,
                status: "released",
                releasedAt: new Date(),
                releaseConditions: {
                  ...tx.releaseConditions,
                  customerApproval: true,
                },
              }
            : tx,
        ),
      );

      toast({
        title: "Escrow released",
        description: "Payment has been released to the provider",
      });
    } catch (error) {
      toast({
        title: "Release failed",
        description: "Failed to release escrow payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisputeEscrow = async (transactionId: string, reason: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEscrowTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? {
                ...tx,
                status: "disputed",
                dispute: {
                  id: `dispute_${Date.now()}`,
                  reason,
                  status: "open",
                  createdAt: new Date(),
                  messages: [
                    {
                      from: "customer",
                      message: reason,
                      timestamp: new Date(),
                    },
                  ],
                },
              }
            : tx,
        ),
      );

      toast({
        title: "Dispute initiated",
        description: "Your dispute has been submitted for review",
      });
    } catch (error) {
      toast({
        title: "Dispute failed",
        description: "Failed to initiate dispute",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPayout = async (amount: number, method: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPayout: PayoutRequest = {
        id: `payout_${Date.now()}`,
        providerId: userId || "provider_1",
        amount,
        currency: "USD",
        status: "pending",
        requestedAt: new Date(),
        payoutMethod: {
          type: method as any,
          accountInfo: "****1234",
          processingTime:
            method === "stripe_express" ? "Instant" : "1-3 business days",
        },
        transactions: [], // would include related escrow IDs
      };

      setPayoutRequests((prev) => [newPayout, ...prev]);

      toast({
        title: "Payout requested",
        description: `$${amount.toFixed(2)} payout request submitted`,
      });
    } catch (error) {
      toast({
        title: "Payout failed",
        description: "Failed to request payout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = escrowTransactions.filter(
    (tx) => filterStatus === "all" || tx.status === filterStatus,
  );

  const totalEscrowAmount = escrowTransactions
    .filter((tx) => tx.status === "held")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const availableForPayout = escrowTransactions
    .filter((tx) => tx.status === "released")
    .reduce((sum, tx) => sum + tx.payoutAmount, 0);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total in Escrow
                </p>
                <p className="text-2xl font-bold">
                  ${totalEscrowAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <OptimizedIcon name="Shield" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Available Payout
                </p>
                <p className="text-2xl font-bold">
                  ${availableForPayout.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <BusinessIcons.DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Disputes
                </p>
                <p className="text-2xl font-bold">
                  {
                    escrowTransactions.filter((tx) => tx.status === "disputed")
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <UIIcons.AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Processing Time
                </p>
                <p className="text-2xl font-bold">2.3h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <OptimizedIcon name="Clock" className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="escrow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="escrow">Escrow Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="escrow" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="held">Held in Escrow</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-md cursor-pointer",
                  transaction.status === "disputed" &&
                    "border-red-200 dark:border-red-800",
                )}
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowTransactionDetails(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(transaction.status)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {transaction.service.title}
                          </h3>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p>
                              <strong>Customer:</strong>{" "}
                              {transaction.customer.name}
                            </p>
                            <p>
                              <strong>Provider:</strong>{" "}
                              {transaction.provider.name}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Amount:</strong> $
                              {transaction.amount.toFixed(2)}
                            </p>
                            <p>
                              <strong>Payout:</strong> $
                              {transaction.payoutAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Created:</strong>{" "}
                              {transaction.createdAt.toLocaleDateString()}
                            </p>
                            {transaction.expiresAt && (
                              <p>
                                <strong>Expires:</strong>{" "}
                                {transaction.expiresAt.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Release Conditions */}
                        {transaction.status === "held" && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Release Conditions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(
                                transaction.releaseConditions,
                              ).map(([key, value]) => (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    value
                                      ? "border-green-600 text-green-600"
                                      : "border-gray-300 text-gray-500",
                                  )}
                                >
                                  {value ? (
                                    <UIIcons.CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <OptimizedIcon name="Clock" className="w-3 h-3 mr-1" />
                                  )}
                                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Dispute Info */}
                        {transaction.dispute && (
                          <Alert className="mt-3">
                            <UIIcons.AlertTriangle className="w-4 h-4" />
                            <AlertDescription className="text-sm">
                              <strong>Dispute:</strong>{" "}
                              {transaction.dispute.reason}
                              <br />
                              <strong>Status:</strong>{" "}
                              {transaction.dispute.status}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {userType === "customer" &&
                        transaction.status === "held" &&
                        transaction.releaseConditions.serviceCompleted && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReleaseEscrow(transaction.id);
                            }}
                            disabled={isLoading}
                          >
                            <UIIcons.CheckCircle className="w-3 h-3 mr-1" />
                            Release Payment
                          </Button>
                        )}

                      {userType === "customer" &&
                        transaction.status === "held" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisputeEscrow(
                                transaction.id,
                                "Service not as described",
                              );
                            }}
                          >
                            <UIIcons.AlertTriangle className="w-3 h-3 mr-1" />
                            Dispute
                          </Button>
                        )}

                      <Button size="sm" variant="ghost">
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          {userType === "provider" && (
            <Card>
              <CardHeader>
                <CardTitle>Request Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div>
                    <p className="font-semibold">Available for Payout</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${availableForPayout.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      handleRequestPayout(availableForPayout, "stripe_express")
                    }
                    disabled={availableForPayout === 0 || isLoading}
                  >
                    <BusinessIcons.DollarSign className="w-4 h-4 mr-2" />
                    Request Payout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payout History */}
          <div className="space-y-3">
            {payoutRequests.map((payout) => (
              <Card key={payout.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          ${payout.amount.toFixed(2)} Payout
                        </h3>
                        <Badge
                          className={cn(
                            payout.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payout.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : payout.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800",
                          )}
                        >
                          {payout.status}
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>Method:</strong>{" "}
                          {payout.payoutMethod.accountInfo}
                        </p>
                        <p>
                          <strong>Processing Time:</strong>{" "}
                          {payout.payoutMethod.processingTime}
                        </p>
                        <p>
                          <strong>Requested:</strong>{" "}
                          {payout.requestedAt.toLocaleDateString()}
                        </p>
                        {payout.processedAt && (
                          <p>
                            <strong>Processed:</strong>{" "}
                            {payout.processedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <FileText className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                      {payout.status === "failed" && (
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Escrow Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Hold Time</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Release Rate</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dispute Rate</span>
                    <span className="font-medium">2.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Release Rate</span>
                    <span className="font-medium">78.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Payout Time</span>
                    <span className="font-medium">1.8 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium">99.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Processed</span>
                    <span className="font-medium">$45,231</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">$12,456</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog
          open={showTransactionDetails}
          onOpenChange={setShowTransactionDetails}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Escrow Transaction Details</DialogTitle>
              <DialogDescription>
                Transaction ID: {selectedTransaction.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Service Details</h4>
                  <p className="text-sm">
                    <strong>Title:</strong> {selectedTransaction.service.title}
                  </p>
                  <p className="text-sm">
                    <strong>Category:</strong>{" "}
                    {selectedTransaction.service.category}
                  </p>
                  <p className="text-sm">
                    <strong>Description:</strong>{" "}
                    {selectedTransaction.service.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Payment Breakdown</h4>
                  <p className="text-sm">
                    <strong>Service Amount:</strong> $
                    {selectedTransaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Platform Fee:</strong> $
                    {selectedTransaction.fees.platform.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Processing Fee:</strong> $
                    {selectedTransaction.fees.processing.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Provider Payout:</strong> $
                    {selectedTransaction.payoutAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {selectedTransaction.dispute && (
                <div>
                  <h4 className="font-medium mb-2">Dispute Messages</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedTransaction.dispute.messages.map(
                      (message, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium capitalize">
                              {message.from}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      ),
                    )}
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
