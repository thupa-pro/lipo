"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Wallet,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Smartphone,
  QrCode,
  Banknote,
  TrendingUp,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Fingerprint,
  Apple,
  Smartphone as PhoneIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  type: "card" | "wallet" | "bank" | "crypto" | "mobile";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  lastFour?: string;
  brand?: string;
  isDefault?: boolean;
  balance?: number;
  connected?: boolean;
  fee?: number;
  processingTime?: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  recipient: string;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: Date;
  fee?: number;
  estimatedTime?: string;
}

interface DynamicPaymentSystemProps {
  amount?: number;
  currency?: string;
  recipient?: string;
  description?: string;
  onComplete?: (transaction: Transaction) => void;
  onCancel?: () => void;
  className?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card-1",
    type: "card",
    name: "Visa •••• 4242",
    icon: CreditCard,
    lastFour: "4242",
    brand: "visa",
    isDefault: true,
    fee: 0.029,
    processingTime: "Instant",
  },
  {
    id: "wallet-1",
    type: "wallet",
    name: "Loconomy Wallet",
    icon: Wallet,
    balance: 847.5,
    connected: true,
    fee: 0,
    processingTime: "Instant",
  },
  {
    id: "apple-pay",
    type: "mobile",
    name: "Apple Pay",
    icon: Apple,
    connected: true,
    fee: 0.015,
    processingTime: "Instant",
  },
  {
    id: "bank-1",
    type: "bank",
    name: "Bank Transfer",
    icon: Banknote,
    connected: true,
    fee: 0,
    processingTime: "1-3 days",
  },
  {
    id: "crypto-1",
    type: "crypto",
    name: "Crypto Wallet",
    icon: QrCode,
    connected: false,
    fee: 0.01,
    processingTime: "10-30 min",
  },
];

export function DynamicPaymentSystem({
  amount = 125.0,
  currency = "USD",
  recipient = "Sarah Mitchell - House Cleaning",
  description = "Premium house cleaning service",
  onComplete,
  onCancel,
  className,
}: DynamicPaymentSystemProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    paymentMethods[0],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [progress, setProgress] = useState(0);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);

  // Card form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  // Real-time validation
  const [cardErrors, setCardErrors] = useState<{ [key: string]: string }>({});

  const processingRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (processingRef.current) {
        clearTimeout(processingRef.current);
      }
    };
  }, []);

  const validateCard = () => {
    const errors: { [key: string]: string } = {};

    if (cardNumber.replace(/\s/g, "").length < 16) {
      errors.cardNumber = "Card number is incomplete";
    }

    if (expiryDate.length < 5) {
      errors.expiryDate = "Expiry date is incomplete";
    }

    if (cvv.length < 3) {
      errors.cvv = "CVV is incomplete";
    }

    if (!cardName.trim()) {
      errors.cardName = "Cardholder name is required";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    return v;
  };

  const calculateFee = () => {
    if (!selectedMethod) return 0;
    const feeRate = selectedMethod.fee || 0;
    return amount * feeRate;
  };

  const getTotalAmount = () => {
    return amount + calculateFee();
  };

  const startPayment = async () => {
    if (!selectedMethod) return;

    // Validate if using new card
    if (selectedMethod.id === "new-card" && !validateCard()) {
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);

    // Create transaction
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      amount: getTotalAmount(),
      currency,
      description,
      recipient,
      status: "pending",
      timestamp: new Date(),
      fee: calculateFee(),
      estimatedTime: selectedMethod.processingTime,
    };
    setTransaction(newTransaction);

    // Simulate security check
    setTimeout(() => {
      setSecurityCheck(true);
      setProgress(25);
    }, 1000);

    // Simulate biometric auth (if mobile payment)
    setTimeout(() => {
      if (selectedMethod.type === "mobile") {
        setBiometricAuth(true);
        setProgress(50);
      } else {
        setProgress(50);
      }
    }, 2000);

    // Simulate processing
    setTimeout(() => {
      setProgress(75);
      if (newTransaction) {
        setTransaction((prev) =>
          prev ? { ...prev, status: "processing" } : null,
        );
      }
    }, 3500);

    // Complete transaction
    setTimeout(() => {
      setProgress(100);
      setCurrentStep(3);
      if (newTransaction) {
        const completedTransaction = {
          ...newTransaction,
          status: "completed" as const,
        };
        setTransaction(completedTransaction);
        onComplete?.(completedTransaction);
      }
      setIsProcessing(false);
    }, 5000);
  };

  const resetPayment = () => {
    setCurrentStep(1);
    setIsProcessing(false);
    setProgress(0);
    setSecurityCheck(false);
    setBiometricAuth(false);
    setTransaction(null);
    setCardErrors({});
  };

  const renderPaymentMethods = () => (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        return (
          <Card
            key={method.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-md",
              selectedMethod?.id === method.id
                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800",
            )}
            onClick={() => setSelectedMethod(method)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      method.type === "card" &&
                        "bg-gradient-to-br from-blue-500 to-indigo-600",
                      method.type === "wallet" &&
                        "bg-gradient-to-br from-emerald-500 to-teal-600",
                      method.type === "mobile" &&
                        "bg-gradient-to-br from-gray-800 to-gray-900",
                      method.type === "bank" &&
                        "bg-gradient-to-br from-green-500 to-emerald-600",
                      method.type === "crypto" &&
                        "bg-gradient-to-br from-orange-500 to-yellow-600",
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.name}</span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {method.balance !== undefined && (
                        <span>Balance: ${method.balance.toFixed(2)}</span>
                      )}
                      <span>
                        Fee:{" "}
                        {method.fee
                          ? `${(method.fee * 100).toFixed(1)}%`
                          : "Free"}
                      </span>
                      <span>{method.processingTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.connected && (
                    <Badge variant="outline" className="text-xs">
                      Connect
                    </Badge>
                  )}
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      selectedMethod?.id === method.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300",
                    )}
                  >
                    {selectedMethod?.id === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Add New Card Option */}
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300 hover:shadow-md border-dashed",
          showCardDetails &&
            "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20",
        )}
        onClick={() => setShowCardDetails(!showCardDetails)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Add new payment method</span>
          </div>
        </CardContent>
      </Card>

      {/* New Card Form */}
      {showCardDetails && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  className={cn(cardErrors.cardNumber && "border-red-500")}
                />
                {cardErrors.cardNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {cardErrors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) =>
                      setExpiryDate(formatExpiryDate(e.target.value))
                    }
                    maxLength={5}
                    className={cn(cardErrors.expiryDate && "border-red-500")}
                  />
                  {cardErrors.expiryDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {cardErrors.expiryDate}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Input
                    placeholder="CVV"
                    type={showCvv ? "text" : "password"}
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    maxLength={4}
                    className={cn(cardErrors.cvv && "border-red-500", "pr-10")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    {showCvv ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                  {cardErrors.cvv && (
                    <p className="text-xs text-red-500 mt-1">
                      {cardErrors.cvv}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  placeholder="Cardholder name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className={cn(cardErrors.cardName && "border-red-500")}
                />
                {cardErrors.cardName && (
                  <p className="text-xs text-red-500 mt-1">
                    {cardErrors.cardName}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <CreditCard className="w-10 h-10 text-white" />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
        <p className="text-muted-foreground">
          Securely processing your payment of ${getTotalAmount().toFixed(2)}
        </p>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground">
          {progress < 25 && "Initializing secure connection..."}
          {progress >= 25 &&
            progress < 50 &&
            securityCheck &&
            "Performing security checks..."}
          {progress >= 50 &&
            progress < 75 &&
            biometricAuth &&
            "Authenticating with biometrics..."}
          {progress >= 50 &&
            progress < 75 &&
            !biometricAuth &&
            "Verifying payment details..."}
          {progress >= 75 && progress < 100 && "Finalizing transaction..."}
          {progress === 100 && "Payment completed successfully!"}
        </div>
      </div>

      {securityCheck && (
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <Shield className="w-4 h-4" />
          <span className="text-sm">Security verified</span>
        </div>
      )}

      {biometricAuth && (
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Fingerprint className="w-4 h-4" />
          <span className="text-sm">Biometric authentication successful</span>
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2 text-emerald-600">
          Payment Successful!
        </h3>
        <p className="text-muted-foreground">
          Your payment has been processed successfully
        </p>
      </div>

      {transaction && (
        <Card className="text-left">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
            {calculateFee() > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing fee</span>
                <span>${calculateFee().toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold">${getTotalAmount().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment method</span>
              <span>{selectedMethod?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                Completed
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Card className={cn("w-full max-w-lg mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          {currentStep === 1 && "Select Payment Method"}
          {currentStep === 2 && "Processing Payment"}
          {currentStep === 3 && "Payment Complete"}
        </CardTitle>

        {/* Payment Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold">{recipient}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{currency}</p>
            </div>
          </div>
          {calculateFee() > 0 && (
            <div className="flex justify-between text-sm">
              <span>Processing fee</span>
              <span>${calculateFee().toFixed(2)}</span>
            </div>
          )}
          {calculateFee() > 0 && (
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <span>${getTotalAmount().toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <>
            {renderPaymentMethods()}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={startPayment}
                disabled={
                  !selectedMethod || (showCardDetails && !validateCard())
                }
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Pay ${getTotalAmount().toFixed(2)}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {currentStep === 2 && renderProcessing()}

        {currentStep === 3 && (
          <>
            {renderSuccess()}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetPayment}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Payment
              </Button>
              <Button
                onClick={() => onComplete?.(transaction!)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Done
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </CardContent>

      {/* Security Footer */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </div>
    </Card>
  );
}
