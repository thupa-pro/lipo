"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Download,
  Upload,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  RefreshCw,
  FileText,
  Camera,
  User,
  MapPin,
  Phone,
  Mail,
  Building,
  Globe,
  Banknote,
  Wallet,
  Receipt,
  Settings,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useSWR from 'swr';

interface Transaction {
  id: string;
  type: "payout" | "payment" | "refund" | "fee" | "bonus";
  status: "completed" | "pending" | "failed" | "cancelled";
  amount: number;
  currency: string;
  description: string;
  date: Date;
  paymentMethod: string;
  reference: string;
  customer?: {
    name: string;
    email: string;
  };
  booking?: {
    id: string;
    service: string;
  };
}

interface PaymentMethod {
  id: string;
  type: "bank" | "card" | "paypal" | "digital_wallet";
  name: string;
  last4?: string;
  brand?: string;
  isDefault: boolean;
  isVerified: boolean;
  expiryDate?: string;
  bankName?: string;
  accountType?: string;
}

interface KYCStatus {
  status: "pending" | "verified" | "rejected" | "requires_action";
  level: "basic" | "intermediate" | "advanced";
  completedSteps: string[];
  requiredSteps: string[];
  documents: {
    id: string;
    type: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
    status: "pending" | "approved" | "rejected";
    uploadDate: Date;
    rejectionReason?: string;
  }[];
  verificationDate?: Date;
  nextReviewDate?: Date;
}

interface PaymentStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  totalTransactions: number;
  successRate: number;
  averageTransactionValue: number;
  payoutSchedule: "daily" | "weekly" | "monthly";
  nextPayoutDate: Date;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PaymentsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: transactions, error, isLoading: transactionsLoading } = useSWR<Transaction[]>(
    '/api/payments/transactions',
    fetcher
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const isDataLoading = transactionsLoading || isLoading;

  // Remove mockTransactions, use SWR data

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: "pm_1",
      type: "bank",
      name: "Chase Business Checking",
      last4: "4567",
      isDefault: true,
      isVerified: true,
      bankName: "JPMorgan Chase Bank",
      accountType: "Checking",
    },
    {
      id: "pm_2", 
      type: "card",
      name: "Business Credit Card",
      last4: "8901",
      brand: "Visa",
      isDefault: false,
      isVerified: true,
      expiryDate: "12/25",
    },
    {
      id: "pm_3",
      type: "paypal",
      name: "PayPal Business",
      isDefault: false,
      isVerified: true,
    },
  ];

  const mockKYCStatus: KYCStatus = {
    status: "verified",
    level: "intermediate", 
    completedSteps: ["identity_verification", "address_verification", "business_verification"],
    requiredSteps: ["enhanced_due_diligence"],
    documents: [
      {
        id: "doc_1",
        type: "drivers_license",
        status: "approved",
        uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "doc_2", 
        type: "utility_bill",
        status: "approved",
        uploadDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        id: "doc_3",
        type: "bank_statement",
        status: "pending",
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
    verificationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };

  const mockStats: PaymentStats = {
    totalEarnings: 15420.75,
    monthlyEarnings: 3250.50,
    pendingPayouts: 485.50,
    totalTransactions: 127,
    successRate: 98.4,
    averageTransactionValue: 121.42,
    payoutSchedule: "weekly",
    nextPayoutDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  };

  useEffect(() => {
    setTimeout(() => {
      // setTransactions(mockTransactions); // This line is no longer needed
      setPaymentMethods(mockPaymentMethods);
      setKycStatus(mockKYCStatus);
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payout":
        return <Upload className="w-4 h-4 text-green-600" />;
      case "payment":
        return <Download className="w-4 h-4 text-blue-600" />;
      case "refund":
        return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case "fee":
        return <Receipt className="w-4 h-4 text-red-600" />;
      case "bonus":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "verified":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "cancelled":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const filteredTransactions = transactions?.filter(txn => {
    const matchesFilter = filter === "all" || txn.type === filter;
    const matchesSearch = searchQuery === "" || 
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isDataLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) return <div>Error loading transactions.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments & Verification</h1>
          <p className="text-muted-foreground">
            Manage your earnings, payment methods, and identity verification
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-green-600">
                    +${stats.monthlyEarnings.toLocaleString()} this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                  <p className="text-2xl font-bold">${stats.pendingPayouts}</p>
                  <p className="text-sm text-blue-600">
                    Next: {stats.nextPayoutDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.totalTransactions} transactions
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                  <p className="text-2xl font-bold">${stats.averageTransactionValue}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.payoutSchedule} payouts
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* KYC Status Alert */}
      {kycStatus && kycStatus.status !== "verified" && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Verification Required:</strong> Complete your identity verification to unlock full payment features.
            <Button variant="link" className="ml-2 p-0 h-auto">
              Complete Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="kyc">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions?.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{transaction.description}</h4>
                        <span className={`text-lg font-bold ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{transaction.date.toLocaleDateString()}</span>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                    <SelectItem value="fee">Fees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTransactions?.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{transaction.description}</h4>
                        <span className={`text-lg font-bold ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{transaction.date.toLocaleDateString()}</span>
                          <span>{transaction.paymentMethod}</span>
                          <span>{transaction.reference}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {method.type === "bank" && <Building className="w-6 h-6" />}
                      {method.type === "card" && <CreditCard className="w-6 h-6" />}
                      {method.type === "paypal" && <Globe className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{method.name}</h4>
                        <div className="flex items-center gap-2">
                          {method.isDefault && (
                            <Badge variant="default">Default</Badge>
                          )}
                          {method.isVerified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {method.type === "bank" && method.bankName && (
                          <span>{method.bankName} • {method.accountType} • •••• {method.last4}</span>
                        )}
                        {method.type === "card" && (
                          <span>{method.brand} •••• {method.last4} • Expires {method.expiryDate}</span>
                        )}
                        {method.type === "paypal" && (
                          <span>PayPal Account</span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Set as Default</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          {/* KYC Status */}
          {kycStatus && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Identity Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Verification Level: {kycStatus.level}</h3>
                      <p className="text-sm text-muted-foreground">
                        Current status: <Badge className={getStatusColor(kycStatus.status)}>
                          {kycStatus.status}
                        </Badge>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {kycStatus.verificationDate && (
                          `Verified on ${kycStatus.verificationDate.toLocaleDateString()}`
                        )}
                      </p>
                      {kycStatus.nextReviewDate && (
                        <p className="text-sm text-muted-foreground">
                          Next review: {kycStatus.nextReviewDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Verification Progress</h4>
                    <div className="space-y-3">
                      {["identity_verification", "address_verification", "business_verification", "enhanced_due_diligence"].map((step) => (
                        <div key={step} className="flex items-center gap-3">
                          {kycStatus.completedSteps.includes(step) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : kycStatus.requiredSteps.includes(step) ? (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="capitalize">
                            {step.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kycStatus.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium capitalize">
                              {doc.type.replace(/_/g, " ")}
                            </h4>
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {doc.uploadDate.toLocaleDateString()}
                            {doc.rejectionReason && (
                              <span className="text-red-600 ml-2">
                                • {doc.rejectionReason}
                              </span>
                            )}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          {doc.status === "rejected" ? "Re-upload" : "View"}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Upload Additional Documents</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload clear photos of your documents for faster verification
                    </p>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}