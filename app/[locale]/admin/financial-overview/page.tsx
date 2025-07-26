"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Receipt,
  Users,
  CheckCircle,
  Calendar,
  Eye,
  Search,
  RefreshCcw
} from "lucide-react";
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"


interface Transaction {
  id: string
  type: "job_payment" | "payout" | "fee" | "refund"
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  date: string
  description: string
  relatedUser: string
}

export default function FinancialOverviewPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [filterStatus, setFilterStatus] = useState("all")

  const { toast } = useToast()

  // Mock financial data
  const financialMetrics = {
    totalRevenue: 125000,
    netProfit: 105000,
    transactionVolume: 5890,
    avgTransactionFee: 8.5,
    monthlyGrowth: 25,
    payoutsDue: 12500,
    pendingPayouts: 5,
  }

  const revenueData = [
    { date: "Apr 1", revenue: 1500 },
    { date: "Apr 5", revenue: 1800 },
    { date: "Apr 10", revenue: 2200 },
    { date: "Apr 15", revenue: 2500 },
    { date: "Apr 20", revenue: 2800 },
    { date: "Apr 25", revenue: 3100 },
    { date: "Apr 30", revenue: 3500 },
  ]

  const mockTransactions: Transaction[] = [
    {
      id: "txn-1",
      type: "job_payment",
      amount: 120,
      currency: "USD",
      status: "completed",
      date: "2024-04-20",
      description: "House Cleaning Job #123",
      relatedUser: "Alice Johnson",
    },
    {
      id: "txn-2",
      type: "payout",
      amount: 102,
      currency: "USD",
      status: "pending",
      date: "2024-04-21",
      description: "Payout for Sarah Mitchell",
      relatedUser: "Sarah Mitchell",
    },
    {
      id: "txn-3",
      type: "fee",
      amount: 18,
      currency: "USD",
      status: "completed",
      date: "2024-04-20",
      description: "Platform fee for Job #123",
      relatedUser: "Loconomy",
    },
    {
      id: "txn-4",
      type: "job_payment",
      amount: 250,
      currency: "USD",
      status: "completed",
      date: "2024-04-10",
      description: "Emergency Pipe Repair Job #456",
      relatedUser: "Bob Smith",
    },
    {
      id: "txn-5",
      type: "payout",
      amount: 212.5,
      currency: "USD",
      status: "completed",
      date: "2024-04-11",
      description: "Payout for Mike Rodriguez",
      relatedUser: "Mike Rodriguez",
    },
    {
      id: "txn-6",
      type: "refund",
      amount: 50,
      currency: "USD",
      status: "completed",
      date: "2024-04-12",
      description: "Partial refund for Job #789",
      relatedUser: "Charlie Brown",
    },
  ]

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesStatus = filterStatus === "all" || txn.status === filterStatus
    return matchesStatus
  })

  const getTransactionStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20"
      case "pending":
        return "bg-warning/10 text-warning border-warning/20"
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "job_payment":
        return <DollarSign className="w-4 h-4 text-success" />
      case "payout":
        return <Wallet className="w-4 h-4 text-ai" />
      case "fee":
        return <Receipt className="w-4 h-4 text-destructive" />
      case "refund":
        return <RefreshCcw className="w-4 h-4 text-warning" />
      default:
        return <DollarSign className="w-4 h-4 text-muted-foreground" />
    }
  }

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  }

  const handleProcessPayout = (txnId: string) => {
    toast({
      title: "Payout Processed",
      description: `Payout for transaction ID: ${txnId} has been initiated.`,
      variant: "default",
    })
    // In a real, app, trigger payout process
  }

  const handleViewTransaction = (txnId: string) => {
    toast({
      title: "View Transaction",
      description: `Opening details for transaction ID: ${txnId}.`,
      variant: "default",
    })
    // In a real, app, navigate to transaction details
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <DollarSign className="w-9 h-9 text-success-600" />
            Financial Overview
          </h1>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Monitor platform, revenue, manage, payouts, and track all financial transactions.
        </p>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-glass-success interactive-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue (YTD)</CardTitle>
                <div className="text-4xl font-bold mt-2 text-green-800 dark:text-green-200">
                  ${financialMetrics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="w-3 h-3 inline-block mr-1" />
                  {financialMetrics.monthlyGrowth}% last month
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="card-glass-ai interactive-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit (YTD)</CardTitle>
                <div className="text-4xl font-bold mt-2 text-blue-800 dark:text-blue-200">
                  ${financialMetrics.netProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Platform take rate: 15%</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="card-glass-premium interactive-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Payouts Due</CardTitle>
                <div className="text-4xl font-bold mt-2 text-yellow-800 dark:text-yellow-200">
                  ${financialMetrics.payoutsDue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {financialMetrics.pendingPayouts} pending payouts
                </p>
              </div>
              <Wallet className="w-12 h-12 text-yellow-600 opacity-30" />
            </CardContent>
          </Card>
          <Card className="card-glass-trust interactive-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Transaction Fee</CardTitle>
                <div className="text-4xl font-bold mt-2 text-purple-800 dark:text-purple-200">
                  ${financialMetrics.avgTransactionFee.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all transactions</p>
              </div>
              <Receipt className="w-12 h-12 text-purple-600 opacity-30" />
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart & Payouts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg dark:bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BarChart3 className="w-6 h-6 text-primary" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Platform revenue over the last {timeRange}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
                </Select>
              </div>
              <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg dark:bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Wallet className="w-6 h-6 text-primary" />
                Payout Management
              </CardTitle>
              <CardDescription>Review and process provider payouts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                    ${financialMetrics.payoutsDue.toLocaleString()}
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">Total Payouts Due</div>
                  <Button variant="outline" size="sm">
                    Process All
                  </Button>
                </div>

                <h4 className="font-semibold text-lg mb-2">Pending Payouts</h4>
                {mockTransactions.filter(t => t.type === "payout" && t.status === "pending").length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No pending payouts at this time.</p>
                  </div>
                ) : (
                  mockTransactions.filter(t => t.type === "payout" && t.status === "pending").map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-sm text-muted-foreground">{txn.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-yellow-600">${txn.amount.toFixed(2)}</span>
                        <Button size="sm" onClick={() => handleProcessPayout(txn.id)}>
                          Process
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Receipt className="w-6 h-6 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>Detailed log of all financial transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No transactions found matching your criteria.</p>
                  <p className="text-sm">Try adjusting your filters.</p>
                </div>
              ) : (
                filteredTransactions.map((txn) => (
                  <Card key={txn.id} className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        {getTransactionIcon(txn.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{txn.description}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {txn.relatedUser}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-4">
                        <div className="text-right md:text-left">
                          <Badge variant="outline" className="capitalize mb-1">
                            {txn.type.replace("_", " ")}
                          </Badge>
                          <Badge className={getTransactionStatusColor(txn.status)}>{txn.status}</Badge>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {txn.date}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl text-green-600">${txn.amount.toFixed(2)}</span>
                          <Button size="sm" variant="outline" onClick={() => handleViewTransaction(txn.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <Card className="mt-10 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-950/30 dark:to-blue-950/30 shadow-xl border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-3 text-green-800 dark:text-green-200">
              Gain Full Financial Clarity
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Monitor every, dollar, manage, payouts, and ensure the financial health of your platform.
            </p>
            <Button size="lg" variant="default" asChild className="shadow-md hover:shadow-lg transition-all">
              <Link href="/admin">Back to Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
