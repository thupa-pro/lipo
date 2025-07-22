import { DynamicPaymentSystem } from "@/components/payment/dynamic-payment-system";
import { DynamicWallet } from "@/components/payment/dynamic-wallet";
import { PaymentAnalytics } from "@/components/payment/payment-analytics";
import { MobilePaymentFlow } from "@/components/payment/mobile-payment-flow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Wallet,
  BarChart,
  Smartphone,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
} from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Payment Center
              </h1>
              <p className="text-muted-foreground">
                Comprehensive payment management with real-time processing
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Volume",
                value: "$124,847",
                icon: DollarSign,
                change: "+23%",
              },
              {
                label: "Success Rate",
                value: "99.8%",
                icon: Shield,
                change: "+0.2%",
              },
              {
                label: "Avg Transaction",
                value: "$89.50",
                icon: TrendingUp,
                change: "+12%",
              },
              {
                label: "Processing Time",
                value: "0.3s",
                icon: Zap,
                change: "-25%",
              },
            ].map((stat) => (
              <Card key={stat.label} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <CardContent className="relative p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <stat.icon className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Tabs */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger
              value="wallet"
              className="flex items-center gap-2 py-3"
            >
              <Wallet className="w-4 h-4" />
              Digital Wallet
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center gap-2 py-3"
            >
              <CreditCard className="w-4 h-4" />
              Payment System
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className="flex items-center gap-2 py-3"
            >
              <Smartphone className="w-4 h-4" />
              Mobile Flow
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 py-3"
            >
              <BarChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <DynamicWallet />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <DynamicPaymentSystem />
          </TabsContent>

          <TabsContent value="mobile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Mobile Payment Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MobilePaymentFlow />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PaymentAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
