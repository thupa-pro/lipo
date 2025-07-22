"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock, AlertCircle,
  ArrowLeft,
  Info,
  Calendar,
  MapPin
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from 'next/image';

interface PaymentFormProps {
  service: {
    id: string;
    title: string;
    price: number;
    provider: {
      name: string;
      image?: string;
    };
  };
  bookingDetails: {
    selectedDate: Date | null;
    selectedTime: string | null;
    notes: string;
    address: string;
  };
  total: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function PaymentForm({
  service,
  bookingDetails,
  total,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [currentStep, setCurrentStep] = useState<"method" | "details" | "confirm">("method");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    zip: "",
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "paypal",
      type: "paypal",
      name: "PayPal",
      icon: <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>,
      description: "Pay with your PayPal account",
    },
    {
      id: "bank",
      type: "bank",
      name: "Bank Transfer",
      icon: <div className="w-5 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">$</div>,
      description: "Direct bank transfer",
    },
  ];

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === "number") {
      formattedValue = formatCardNumber(value.replace(/\D/g, ''));
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value);
    } else if (field === "cvc") {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would integrate with Stripe
      // const { error } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: elements.getElement(CardElement),
      //   }
      // });
      
      onSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Secure Payment</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Image
              src={service.provider.image || "/api/placeholder/40/40"}
              alt={service.provider.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{service.title}</h4>
              <p className="text-xs text-muted-foreground">with {service.provider.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${total.toFixed(2)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{bookingDetails.selectedDate?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{bookingDetails.selectedTime && formatTime(bookingDetails.selectedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{bookingDetails.address || "Address to be confirmed"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      {currentStep === "method" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h4 className="font-medium">Select Payment Method</h4>
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
            className="space-y-3"
          >
            {paymentMethods.map((method) => (
              <Label
                key={method.id}
                htmlFor={method.id}
                className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center gap-3 flex-1">
                  {method.icon}
                  <div>
                    <p className="font-medium text-sm">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
          
          <Button 
            onClick={() => setCurrentStep("details")} 
            className="w-full"
            disabled={!selectedPaymentMethod}
          >
            Continue
          </Button>
        </motion.div>
      )}

      {/* Payment Details */}
      {currentStep === "details" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {selectedPaymentMethod === "card" && (
            <div className="space-y-4">
              <h4 className="font-medium">Card Details</h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInputChange("number", e.target.value)}
                    maxLength={19}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                      maxLength={5}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => handleCardInputChange("cvc", e.target.value)}
                      maxLength={4}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    placeholder="12345"
                    value={cardDetails.zip}
                    onChange={(e) => handleCardInputChange("zip", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPaymentMethod === "paypal" && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">PP</span>
              </div>
              <p className="text-muted-foreground">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          )}

          {selectedPaymentMethod === "bank" && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">$</span>
              </div>
              <p className="text-muted-foreground">
                Bank transfer details will be provided after confirmation.
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep("method")}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={() => setCurrentStep("confirm")} 
              className="flex-1"
              disabled={selectedPaymentMethod === "card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name)}
            >
              Review
            </Button>
          </div>
        </motion.div>
      )}

      {/* Confirmation */}
      {currentStep === "confirm" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h4 className="font-medium">Confirm & Pay</h4>
          
          {/* Escrow Information */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Escrow Protection:</strong> Your payment will be held securely until the service is completed. 
              Funds are only released to the provider after you confirm satisfaction.
            </AlertDescription>
          </Alert>

          {/* Payment Summary */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Service fee</span>
                <span>${service.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform fee</span>
                <span>${(total - service.price).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreesToTerms}
              onCheckedChange={(checked) => setAgreesToTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              I agree to the{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              . I understand that payment will be held in escrow until service completion.
            </Label>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep("details")}
              className="flex-1"
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button 
              onClick={handlePayment} 
              className="flex-1"
              disabled={!agreesToTerms || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Pay ${total.toFixed(2)}
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3 h-3" />
        <span>256-bit SSL encryption • PCI DSS compliant • Fraud protection</span>
      </div>
    </div>
  );
}