import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Wallet,
  DollarSign,
  TrendingUp,
  Shield,
  Plus,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import Link from "next/link";

const paymentMethods = [
  {
    id: 1,
    type: "Credit Card",
    last4: "4242",
    brand: "Visa",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: 2,
    type: "Credit Card",
    last4: "5555",
    brand: "Mastercard",
    expiry: "08/25",
    isDefault: false,
  },
];

const recentTransactions = [
  {
    id: 1,
    type: "payment",
    description: "House Cleaning - Sarah Mitchell",
    amount: -120.0,
    date: "Dec 12, 2024",
    status: "completed",
  },
  {
    id: 2,
    type: "refund",
    description: "Refund - Cancelled Handyman Service",
    amount: 85.0,
    date: "Dec 10, 2024",
    status: "completed",
  },
  {
    id: 3,
    type: "payment",
    description: "Pet Grooming - Emma Thompson",
    amount: -60.0,
    date: "Dec 8, 2024",
    status: "completed",
  },
];

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Payments & Wallet
          </h1>
          <p className="text-muted-foreground">
            Manage your payment methods and view transaction history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 text-white mb-6">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Loconomy Wallet</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-white/70 text-sm">Total Balance</p>
                    <p className="text-3xl font-bold">$847.50</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/70 text-sm">Available</p>
                      <p className="text-lg font-semibold">$847.50</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Pending</p>
                      <p className="text-lg font-semibold">$0.00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">This Month</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">$265</p>
                  <p className="text-sm text-muted-foreground">
                    Spent on services
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">15%</p>
                  <p className="text-sm text-muted-foreground">Vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </span>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.amount > 0
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <Badge variant="outline">{transaction.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Security & Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">2FA Enabled</p>
                  <p className="text-sm text-green-600">Account secured</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Auto-Pay</p>
                  <p className="text-sm text-blue-600">Enabled</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Wallet className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Spending Limit</p>
                  <p className="text-sm text-purple-600">$500/month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
