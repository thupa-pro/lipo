"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Wallet 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gift,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "earning" | "tip" | "bonus" | "withdrawal" | "fee";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface LoyaltyTier {
  name: string;
  level: number;
  minEarnings: number;
  benefits: string[];
  color: string;
}

interface WalletSummaryCardProps {
  balance: number;
  totalEarnings: number;
  totalTips: number;
  pendingAmount: number;
  currency: string;
  loyaltyTier: LoyaltyTier;
  nextTierProgress: number; // 0-100
  recentTransactions: Transaction[];
  onViewAll?: () => void;
  onWithdraw?: () => void;
  onAddFunds?: () => void;
  className?: string;
  showBalance?: boolean;
  period?: "week" | "month" | "year";
}

const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: "Bronze",
    level: 1,
    minEarnings: 0,
    benefits: ["Basic support", "Standard rates"],
    color: "bg-amber-600"
  },
  {
    name: "Silver",
    level: 2,
    minEarnings: 1000,
    benefits: ["Priority support", "5% bonus tips", "Featured listings"],
    color: "bg-gray-400"
  },
  {
    name: "Gold",
    level: 3,
    minEarnings: 5000,
    benefits: ["24/7 support", "10% bonus tips", "Premium tools", "Lower fees"],
    color: "bg-yellow-500"
  },
  {
    name: "Platinum",
    level: 4,
    minEarnings: 15000,
    benefits: ["Dedicated manager", "15% bonus tips", "Early access", "No fees"],
    color: "bg-purple-600"
  }
];

export function WalletSummaryCard({
  balance,
  totalEarnings,
  totalTips,
  pendingAmount,
  currency,
  loyaltyTier,
  nextTierProgress,
  recentTransactions,
  onViewAll,
  onWithdraw,
  onAddFunds,
  className,
  showBalance = true,
  period = "month"
}: WalletSummaryCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = React.useState(showBalance);

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "earning":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "tip":
        return <Gift className="w-4 h-4 text-blue-600" />;
      case "bonus":
        return <Star className="w-4 h-4 text-yellow-600" />;
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case "fee":
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const nextTier = LOYALTY_TIERS.find(tier => tier.level > loyaltyTier.level);
  const earningsToNext = nextTier ? nextTier.minEarnings - totalEarnings : 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Summary
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="p-2"
          >
            {isBalanceVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Balance Section */}
        <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
          <div className="text-3xl font-bold">
            {isBalanceVisible ? (
              `${currency}${balance.toLocaleString()}`
            ) : (
              "••••••"
            )}
          </div>
          {pendingAmount > 0 && (
            <div className="text-sm text-muted-foreground mt-1">
              {currency}{pendingAmount.toLocaleString()} pending
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Earnings</span>
            </div>
            <div className="text-xl font-semibold">
              {isBalanceVisible ? (
                `${currency}${totalEarnings.toLocaleString()}`
              ) : (
                "••••"
              )}
            </div>
            <div className="text-xs text-muted-foreground">This {period}</div>
          </div>

          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Tips</span>
            </div>
            <div className="text-xl font-semibold">
              {isBalanceVisible ? (
                `${currency}${totalTips.toLocaleString()}`
              ) : (
                "••••"
              )}
            </div>
            <div className="text-xs text-muted-foreground">This {period}</div>
          </div>
        </div>

        {/* Loyalty Tier */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="font-medium">Loyalty Tier</span>
            </div>
            <Badge className={cn("text-white", loyaltyTier.color)}>
              {loyaltyTier.name}
            </Badge>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Progress to {nextTier.name}
                </span>
                <span className="font-medium">
                  {currency}{earningsToNext.toLocaleString()} to go
                </span>
              </div>
              <Progress value={nextTierProgress} className="h-2" />
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <strong>Benefits:</strong> {loyaltyTier.benefits.join(", ")}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Recent Activity</span>
            {onViewAll && (
              <Button variant="ghost" size="sm" onClick={onViewAll}>
                View All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 p-2 border rounded">
                {getTransactionIcon(transaction.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-sm font-medium",
                    transaction.type === "withdrawal" || transaction.type === "fee" 
                      ? "text-red-600" 
                      : "text-green-600"
                  )}>
                    {transaction.type === "withdrawal" || transaction.type === "fee" ? "-" : "+"}
                    {currency}{transaction.amount.toLocaleString()}
                  </div>
                  <div className={cn("text-xs", getStatusColor(transaction.status))}>
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recentTransactions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No recent transactions
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {onWithdraw && (
            <Button
              variant="outline"
              onClick={onWithdraw}
              className="flex items-center gap-2"
              disabled={balance <= 0}
            >
              <ArrowDownRight className="w-4 h-4" />
              Withdraw
            </Button>
          )}
          
          {onAddFunds && (
            <Button
              onClick={onAddFunds}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Funds
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}