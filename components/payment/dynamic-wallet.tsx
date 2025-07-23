"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import {
  Wallet,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  QrCode,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletTransaction {
  id: string;
  type: "credit" | "debit" | "pending";
  amount: number;
  description: string;
  category: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  merchant?: string;
  reference?: string;
}

interface WalletStats {
  totalBalance: number;
  availableBalance: number;
  pendingBalance: number;
  monthlySpent: number;
  monthlyEarned: number;
  savingsGoal?: number;
  savingsProgress?: number;
}

interface DynamicWalletProps {
  className?: string;
}

export function DynamicWallet({ className }: DynamicWalletProps) {
  const t = useTranslations("Payment.wallet");
  const [stats, setStats] = useState<WalletStats>({
    totalBalance: 2847.5,
    availableBalance: 2847.5,
    pendingBalance: 125.0,
    monthlySpent: 1245.3,
    monthlyEarned: 2890.75,
    savingsGoal: 5000,
    savingsProgress: 2847.5,
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: "tx_001",
      type: "credit",
      amount: 125.0,
      description: "House cleaning service payment",
      category: "Services",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: "completed",
      merchant: "Sarah Mitchell",
      reference: "LOCO-2024-001",
    },
    {
      id: "tx_002",
      type: "debit",
      amount: 45.99,
      description: "Platform fee",
      category: "Fees",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "completed",
      reference: "LOCO-FEE-001",
    },
    {
      id: "tx_003",
      type: "credit",
      amount: 89.5,
      description: "Handyman service payment",
      category: "Services",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: "completed",
      merchant: "Mike Rodriguez",
      reference: "LOCO-2024-002",
    },
    {
      id: "tx_004",
      type: "pending",
      amount: 250.0,
      description: "Pet grooming service",
      category: "Services",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "pending",
      merchant: "Emma Thompson",
      reference: "LOCO-2024-003",
    },
    {
      id: "tx_005",
      type: "debit",
      amount: 12.99,
      description: "Premium subscription",
      category: "Subscription",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "completed",
      reference: "LOCO-SUB-001",
    },
  ]);

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);

  // Simulate real-time balance updates
  useEffect(() => {
    if (!realtimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate random small balance changes
      const change = (Math.random() - 0.5) * 10;
      setStats((prev) => ({
        ...prev,
        totalBalance: Math.max(0, prev.totalBalance + change),
        availableBalance: Math.max(0, prev.availableBalance + change),
      }));

      // Occasionally add new transactions
      if (Math.random() < 0.1) {
        const newTransaction: WalletTransaction = {
          id: `tx_${Date.now()}`,
          type: Math.random() > 0.5 ? "credit" : "debit",
          amount: Math.floor(Math.random() * 200) + 10,
          description: "Real-time transaction",
          category: "Services",
          timestamp: new Date(),
          status: "completed",
          reference: `LOCO-RT-${Date.now()}`,
        };

        setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [realtimeUpdates]);

  const refreshWallet = async () => {
    setIsRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate updated data
    setStats((prev) => ({
      ...prev,
      totalBalance: prev.totalBalance + Math.floor(Math.random() * 100),
      monthlyEarned: prev.monthlyEarned + Math.floor(Math.random() * 50),
    }));

    setIsRefreshing(false);
  };

  const formatAmount = (amount: number) => {
    return balanceVisible ? `$${amount.toFixed(2)}` : "••••••";
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTransactionIcon = (transaction: WalletTransaction) => {
    switch (transaction.type) {
      case "credit":
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case "debit":
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <MoreHorizontal className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            {t("transaction_received")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
            {t("transaction_pending")}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {t("transaction_failed")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const savingsPercentage = stats.savingsGoal
    ? (stats.savingsProgress! / stats.savingsGoal) * 100
    : 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Wallet Overview */}
      <Card className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <CardContent className="relative p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="w-6 h-6" />
              <h2 className="text-lg font-semibold">{t("title")}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-white hover:bg-white/10"
              >
                {balanceVisible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshWallet}
                disabled={isRefreshing}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw
                  className={cn("w-4 h-4", isRefreshing && "animate-spin")}
                />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-white/70 text-sm">{t("balance")}</p>
              <p className="text-3xl font-bold">
                {formatAmount(stats.totalBalance)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/70 text-sm">
                  {t("available_balance")}
                </p>
                <p className="text-lg font-semibent">
                  {formatAmount(stats.availableBalance)}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Pending</p>
                <p className="text-lg font-semibold">
                  {formatAmount(stats.pendingBalance)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-white text-blue-600 hover:bg-white/90">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
              <Button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20">
                <QrCode className="w-4 h-4 mr-2" />
                Receive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-muted-foreground">Earned</span>
            </div>
            <p className="text-lg font-bold text-emerald-600">
              {formatAmount(stats.monthlyEarned)}
            </p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Spent</span>
            </div>
            <p className="text-lg font-bold text-red-600">
              {formatAmount(stats.monthlySpent)}
            </p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Cashback</span>
            </div>
            <p className="text-lg font-bold text-yellow-600">$24.80</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Protected</span>
            </div>
            <p className="text-lg font-bold text-blue-600">100%</p>
            <p className="text-xs text-muted-foreground">Secure</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goal */}
      {stats.savingsGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Savings Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Progress to ${stats.savingsGoal.toLocaleString()}</span>
                <span className="font-semibold">
                  {savingsPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={savingsPercentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${stats.savingsProgress?.toFixed(2)}</span>
                <span>
                  $
                  {(stats.savingsGoal - (stats.savingsProgress || 0)).toFixed(
                    2,
                  )}{" "}
                  to go
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRealtimeUpdates(!realtimeUpdates)}
                className={cn(
                  "text-xs",
                  realtimeUpdates ? "text-emerald-600" : "text-gray-400",
                )}
              >
                {realtimeUpdates && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                )}
                Live Updates
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="credit">Income</TabsTrigger>
              <TabsTrigger value="debit">Expenses</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction)}
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{transaction.category}</span>
                        {transaction.merchant && (
                          <>
                            <span>•</span>
                            <span>{transaction.merchant}</span>
                          </>
                        )}
                        <span>���</span>
                        <span>{formatTime(transaction.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-semibold",
                        transaction.type === "credit"
                          ? "text-emerald-600"
                          : "text-red-600",
                        transaction.type === "pending" && "text-yellow-600",
                      )}
                    >
                      {transaction.type === "credit" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="credit" className="space-y-3 mt-4">
              {transactions
                .filter((t) => t.type === "credit")
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction)}
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.merchant} •{" "}
                          {formatTime(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">
                        +${transaction.amount.toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="debit" className="space-y-3 mt-4">
              {transactions
                .filter((t) => t.type === "debit")
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction)}
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category} •{" "}
                          {formatTime(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        -${transaction.amount.toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3 mt-4">
              {transactions
                .filter((t) => t.type === "pending")
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction)}
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.merchant} •{" "}
                          {formatTime(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">
                        ${transaction.amount.toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
