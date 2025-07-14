"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  CreditCard,
  Smartphone,
  QrCode,
  NfcIcon,
  Apple,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Fingerprint,
  FaceIcon,
  Lock,
  Zap,
  Send,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobilePaymentFlowProps {
  initialAmount?: number;
  recipient?: string;
  onComplete?: (result: any) => void;
  onCancel?: () => void;
  className?: string;
}

type PaymentStep = "amount" | "method" | "auth" | "processing" | "complete";
type PaymentMethod = "tap" | "qr" | "nfc" | "biometric" | "pin";

export function MobilePaymentFlow({
  initialAmount = 0,
  recipient = "Sarah Mitchell",
  onComplete,
  onCancel,
  className,
}: MobilePaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("amount");
  const [amount, setAmount] = useState(initialAmount.toString());
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("tap");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [pin, setPin] = useState("");

  // Gesture and animation refs
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Quick amount buttons
  const quickAmounts = [25, 50, 100, 250];

  useEffect(() => {
    if (initialAmount > 0) {
      setAmount(initialAmount.toString());
    }
  }, [initialAmount]);

  const formatAmount = (value: string) => {
    const number = parseFloat(value) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  const addToAmount = (value: string) => {
    if (value === "." && amount.includes(".")) return;
    if (amount === "0" && value !== ".") {
      setAmount(value);
    } else {
      setAmount(amount + value);
    }
  };

  const removeFromAmount = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount("0");
    }
  };

  const setQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCurrentStep("auth");

    // Simulate method-specific flows
    if (method === "tap" || method === "nfc") {
      // Simulate NFC/Tap detection
      setTimeout(() => {
        simulatePayment();
      }, 1000);
    }
  };

  const simulateBiometric = async () => {
    setIsProcessing(true);
    setProgress(25);

    // Simulate biometric scan
    setTimeout(() => {
      setProgress(75);
      setAuthSuccess(true);
    }, 2000);

    setTimeout(() => {
      setProgress(100);
      simulatePayment();
    }, 3000);
  };

  const handlePinEntry = (digit: string) => {
    if (digit === "clear") {
      setPin("");
      return;
    }
    if (digit === "delete") {
      setPin(pin.slice(0, -1));
      return;
    }
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === 4) {
        // Simulate PIN verification
        setTimeout(() => {
          simulatePayment();
        }, 500);
      }
    }
  };

  const simulatePayment = () => {
    setCurrentStep("processing");
    setIsProcessing(true);
    setProgress(0);

    // Progressive payment simulation
    const intervals = [
      { delay: 500, progress: 25, message: "Authorizing payment..." },
      { delay: 1500, progress: 50, message: "Processing transaction..." },
      { delay: 2500, progress: 75, message: "Confirming with bank..." },
      { delay: 3500, progress: 100, message: "Payment successful!" },
    ];

    intervals.forEach(({ delay, progress }) => {
      setTimeout(() => {
        setProgress(progress);
      }, delay);
    });

    setTimeout(() => {
      setCurrentStep("complete");
      setIsProcessing(false);
      onComplete?.({
        amount: parseFloat(amount),
        method: selectedMethod,
        recipient,
        timestamp: new Date(),
      });
    }, 4000);
  };

  const reset = () => {
    setCurrentStep("amount");
    setAmount("0");
    setSelectedMethod("tap");
    setIsProcessing(false);
    setProgress(0);
    setAuthSuccess(false);
    setPin("");
  };

  // Touch gestures for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const offset = touch.clientX - rect.left - rect.width / 2;
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0 && currentStep !== "complete") {
        // Swipe right - next step
        const steps: PaymentStep[] = [
          "amount",
          "method",
          "auth",
          "processing",
          "complete",
        ];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
          setCurrentStep(steps[currentIndex + 1]);
        }
      } else if (dragOffset < 0 && currentStep !== "amount") {
        // Swipe left - previous step
        const steps: PaymentStep[] = [
          "amount",
          "method",
          "auth",
          "processing",
          "complete",
        ];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
          setCurrentStep(steps[currentIndex - 1]);
        }
      }
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">Send Money</p>
        <p className="text-sm text-muted-foreground">To: {recipient}</p>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold mb-4">{formatAmount(amount)}</div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {quickAmounts.map((value) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => setQuickAmount(value)}
              className="text-xs"
            >
              ${value}
            </Button>
          ))}
        </div>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            onClick={() => addToAmount(num.toString())}
            className="h-14 text-lg font-semibold"
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          size="lg"
          onClick={() => addToAmount(".")}
          className="h-14 text-lg font-semibold"
        >
          .
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => addToAmount("0")}
          className="h-14 text-lg font-semibold"
        >
          0
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={removeFromAmount}
          className="h-14"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <Button
        onClick={() => setCurrentStep("method")}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 h-12 text-lg font-semibold"
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  const renderMethodStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">Payment Method</p>
        <p className="text-sm text-muted-foreground">{formatAmount(amount)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 hover:scale-105",
            selectedMethod === "tap" &&
              "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20",
          )}
          onClick={() => handleMethodSelect("tap")}
        >
          <CardContent className="p-6 text-center">
            <Smartphone className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <p className="font-semibold">Tap to Pay</p>
            <p className="text-xs text-muted-foreground">Near field payment</p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 hover:scale-105",
            selectedMethod === "qr" &&
              "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20",
          )}
          onClick={() => handleMethodSelect("qr")}
        >
          <CardContent className="p-6 text-center">
            <QrCode className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
            <p className="font-semibold">QR Code</p>
            <p className="text-xs text-muted-foreground">Scan to pay</p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 hover:scale-105",
            selectedMethod === "biometric" &&
              "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20",
          )}
          onClick={() => handleMethodSelect("biometric")}
        >
          <CardContent className="p-6 text-center">
            <Fingerprint className="w-12 h-12 mx-auto mb-3 text-purple-600" />
            <p className="font-semibold">Biometric</p>
            <p className="text-xs text-muted-foreground">Touch/Face ID</p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 hover:scale-105",
            selectedMethod === "pin" &&
              "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20",
          )}
          onClick={() => setSelectedMethod("pin")}
        >
          <CardContent className="p-6 text-center">
            <Lock className="w-12 h-12 mx-auto mb-3 text-teal-600" />
            <p className="font-semibold">PIN Entry</p>
            <p className="text-xs text-muted-foreground">Secure PIN</p>
          </CardContent>
        </Card>
      </div>

      {selectedMethod === "pin" && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">Enter your PIN</p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full border-2",
                    i < pin.length
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                onClick={() => handlePinEntry(num.toString())}
                className="h-12 text-lg font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              size="lg"
              onClick={() => handlePinEntry("clear")}
              className="h-12 text-sm"
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handlePinEntry("0")}
              className="h-12 text-lg font-semibold"
            >
              0
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handlePinEntry("delete")}
              className="h-12"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {selectedMethod === "biometric" && (
        <Button
          onClick={simulateBiometric}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 h-12 text-lg font-semibold"
        >
          <Fingerprint className="w-5 h-5 mr-2" />
          Authenticate
        </Button>
      )}
    </div>
  );

  const renderAuthStep = () => (
    <div className="space-y-6 text-center">
      {selectedMethod === "tap" && (
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse">
            <NfcIcon className="w-12 h-12 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold mb-2">Tap Your Device</p>
            <p className="text-sm text-muted-foreground">
              Hold your device near the payment terminal
            </p>
          </div>
          <div className="animate-bounce">
            <div className="w-4 h-4 mx-auto bg-blue-500 rounded-full" />
          </div>
        </div>
      )}

      {selectedMethod === "qr" && (
        <div className="space-y-4">
          <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
            <QrCode className="w-32 h-32 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-semibold mb-2">Scan QR Code</p>
            <p className="text-sm text-muted-foreground">
              Show this code to the merchant
            </p>
          </div>
        </div>
      )}

      {selectedMethod === "biometric" && (
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Fingerprint className="w-12 h-12 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold mb-2">
              Biometric Authentication
            </p>
            <p className="text-sm text-muted-foreground">
              {authSuccess
                ? "Authentication successful!"
                : "Place your finger on the sensor"}
            </p>
          </div>
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress < 50 ? "Scanning..." : "Verifying..."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderProcessingStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Zap className="w-12 h-12 text-white animate-pulse" />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
        <p className="text-muted-foreground">
          Securely processing {formatAmount(amount)}
        </p>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="h-3" />
        <div className="text-sm text-muted-foreground">
          {progress < 25 && "Connecting to payment network..."}
          {progress >= 25 && progress < 50 && "Authorizing transaction..."}
          {progress >= 50 && progress < 75 && "Processing with bank..."}
          {progress >= 75 && progress < 100 && "Finalizing payment..."}
          {progress === 100 && "Payment completed successfully!"}
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2 text-emerald-600">
          Payment Successful!
        </h3>
        <p className="text-muted-foreground">
          {formatAmount(amount)} sent to {recipient}
        </p>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm">
          <span>Transaction ID</span>
          <span className="font-mono">TX{Date.now().toString().slice(-8)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          New Payment
        </Button>
        <Button
          onClick={() =>
            onComplete?.({ amount: parseFloat(amount), recipient })
          }
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
        >
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <Card
      ref={cardRef}
      className={cn(
        "w-full max-w-sm mx-auto relative overflow-hidden",
        className,
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isDragging ? `translateX(${dragOffset * 0.1}px)` : undefined,
        transition: isDragging ? "none" : "transform 0.3s ease",
      }}
    >
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
          style={{
            width: `${(["amount", "method", "auth", "processing", "complete"].indexOf(currentStep) + 1) * 20}%`,
          }}
        />
      </div>

      <CardContent className="p-6 pt-8">
        {currentStep === "amount" && renderAmountStep()}
        {currentStep === "method" && renderMethodStep()}
        {currentStep === "auth" && renderAuthStep()}
        {currentStep === "processing" && renderProcessingStep()}
        {currentStep === "complete" && renderCompleteStep()}

        {/* Navigation hints */}
        <div className="mt-6 flex justify-center gap-2">
          {["amount", "method", "auth", "processing", "complete"].map(
            (step, index) => (
              <div
                key={step}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  step === currentStep
                    ? "bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600",
                )}
              />
            ),
          )}
        </div>

        {/* Swipe hint */}
        <p className="text-xs text-center text-muted-foreground mt-2">
          Swipe left or right to navigate
        </p>
      </CardContent>
    </Card>
  );
}
