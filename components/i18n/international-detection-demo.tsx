"use client";

import { useState, useEffect } from "react";
import { useInternationalDetection } from "@/hooks/use-international-detection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  DollarSign,
  Phone,
  Globe,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function InternationalDetectionDemo() {
  const [testAmount, setTestAmount] = useState(1000);
  const [testPhone, setTestPhone] = useState("");
  const [manualCountryInput, setManualCountryInput] = useState("");

  const {
    isDetecting,
    isDetected,
    detectionError,
    country,
    currency,
    phoneCode,
    locale,
    cityKey,
    confidence,
    formatCurrency,
    formatPhone,
    validatePhone,
    detectLocation,
    setManualCountry: setCountryManually,
    resetDetection,
  } = useInternationalDetection({
    enableGeolocation: true,
    fallbackToIP: true,
    cacheResults: true,
    onDetectionComplete: (result) => {
      console.log("Detection completed:", result);
      // Set a sample phone number for the detected country
      if (result.country === "United States" || result.country === "Canada") {
        setTestPhone("555-123-4567");
      } else if (result.country === "United Kingdom") {
        setTestPhone("020 7946 0958");
      } else if (result.country === "Germany") {
        setTestPhone("030 12345678");
      } else if (result.country === "France") {
        setTestPhone("01 42 68 53 32");
      } else {
        setTestPhone("123456789");
      }
    },
    onDetectionError: (error) => {
      console.error("Detection error:", error);
    },
  });

  const handleManualCountrySet = () => {
          if (manualCountryInput.trim()) {
        setCountryManually(manualCountryInput.trim());
        setManualCountryInput("");
    }
  };

  const confidenceColor =
    confidence > 0.8
      ? "text-green-600"
      : confidence > 0.5
        ? "text-yellow-600"
        : "text-red-600";

  const confidenceLabel =
    confidence > 0.8 ? "High" : confidence > 0.5 ? "Medium" : "Low";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">International Detection System</h1>
        <p className="text-lg text-muted-foreground">
          Automatic currency and phone number detection based on user location
        </p>
      </div>

      {/* Detection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Detection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isDetecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isDetected ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="font-medium">
                {isDetecting
                  ? "Detecting..."
                  : isDetected
                    ? "Detected"
                    : "Not Detected"}
              </span>
            </div>

            {confidence > 0 && (
              <Badge variant="outline" className={confidenceColor}>
                {confidenceLabel} Confidence ({Math.round(confidence * 100)}%)
              </Badge>
            )}
          </div>

          {detectionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Detection failed: {detectionError.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={detectLocation}
              disabled={isDetecting}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-detect Location
            </Button>
            <Button onClick={resetDetection} variant="outline">
              Reset Detection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detection Results */}
      {isDetected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Country:</strong> {country}
                </div>
                <div>
                  <strong>Locale:</strong> {locale}
                </div>
                {cityKey && (
                  <div>
                    <strong>Nearest City:</strong> {cityKey.replace("_", " ")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5" />
                Currency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Currency:</strong> {currency}
                </div>
                <div>
                  <strong>Format Example:</strong>
                  <br />
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {formatCurrency(testAmount)}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Country Code:</strong> {phoneCode}
                </div>
                <div>
                  <strong>Format Example:</strong>
                  <br />
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {formatPhone(testPhone)}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5" />
                Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Phone Valid:</span>
                  {validatePhone(testPhone) ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <strong>Confidence:</strong> {Math.round(confidence * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interactive Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Test Currency & Phone Formatting</CardTitle>
          <CardDescription>
            Test the formatting capabilities with custom values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Currency Testing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Currency Formatting</h3>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label>Formatted Result</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-lg font-mono">
                    {isDetected
                      ? formatCurrency(testAmount)
                      : "No country detected"}
                  </code>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alternative Formats</Label>
                <div className="space-y-1">
                  <div className="text-sm">
                    <strong>Compact:</strong>{" "}
                    {isDetected &&
                      formatCurrency(testAmount, { notation: "compact" })}
                  </div>
                  <div className="text-sm">
                    <strong>No Symbol:</strong>{" "}
                    {isDetected &&
                      formatCurrency(testAmount, { style: "decimal" })}
                  </div>
                  <div className="text-sm">
                    <strong>Accounting:</strong>{" "}
                    {isDetected &&
                      formatCurrency(testAmount, {
                        currencySign: "accounting",
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Number Testing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Phone Number Formatting</h3>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Formatted Result</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-lg font-mono">
                    {isDetected
                      ? formatPhone(testPhone)
                      : "No country detected"}
                  </code>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Validation</Label>
                <div className="flex items-center gap-2">
                  {isDetected && validatePhone(testPhone) ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Valid phone number</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">Invalid phone number</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Manual Country Override */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Manual Country Override</h3>
            <p className="text-sm text-muted-foreground">
              Test with a different country to see how formatting changes
            </p>
            <div className="flex gap-2">
              <Input
                                  value={manualCountryInput}
                onChange={(e) => setManualCountryInput(e.target.value)}
                placeholder="Enter country name (e.g., Germany, Japan, Brazil)"
                className="flex-1"
              />
              <Button onClick={handleManualCountrySet}>Set Country</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Try: United States, Germany, France, Japan, Brazil, United
              Kingdom, Australia, India
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Detection Methods</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• GPS/HTML5 Geolocation API</li>
                <li>• Browser timezone detection</li>
                <li>• Navigator language preferences</li>
                <li>• IP-based geolocation (fallback)</li>
                <li>• Nearest metropolitan city matching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Supported Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 47+ countries with currency mapping</li>
                <li>• International phone number formatting</li>
                <li>• Phone number validation by country</li>
                <li>• Multiple currency display formats</li>
                <li>• Caching for performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
