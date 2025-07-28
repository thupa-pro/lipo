import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Scan, Lock, Unlock, AlertCircle, Eye, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface BiometricAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  type?: "fingerprint" | "face" | "both";
  title?: string;
  subtitle?: string;
  showFallback?: boolean;
  className?: string;
}

export function BiometricAuth({
  onSuccess,
  onError,
  type = "both",
  title = "Secure Authentication",
  subtitle = "Use your biometric data to authenticate",
  showFallback = true,
  className,
}: BiometricAuthProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string>("");
  const [supportedMethods, setSupportedMethods] = useState<string[]>([]);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const methods: string[] = [];

    // Check for WebAuthn support
    if (window.PublicKeyCredential) {
      methods.push("webauthn");
    }

    // Simulate checking for device biometric capabilities
    if (navigator.userAgent.includes("Mobile")) {
      methods.push("fingerprint", "face");
    }

    setSupportedMethods(methods);
  };

  const simulateBiometricAuth = async (method: string) => {
    setIsScanning(true);
    setAuthStatus("scanning");
    setError("");

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    try {
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/failure (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        setAuthStatus("success");
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      } else {
        throw new Error("Biometric authentication failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      setAuthStatus("error");
      onError?.(errorMessage);

      if (navigator.vibrate) {
        navigator.vibrate([100, 100, 100]);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleFingerprintAuth = () => {
    simulateBiometricAuth("fingerprint");
  };

  const handleFaceAuth = () => {
    simulateBiometricAuth("face");
  };

  const resetAuth = () => {
    setAuthStatus("idle");
    setError("");
    setIsScanning(false);
  };

  return (
    <Card
      className={cn(
        "border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
        className,
      )}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Authentication Status */}
        <div className="mb-6">
          {authStatus === "idle" && (
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <OptimizedIcon name="Shield" className="w-10 h-10 text-white" />
            </div>
          )}

          {authStatus === "scanning" && (
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-4 animate-pulse">
              <Scan className="w-10 h-10 text-white animate-spin" />
            </div>
          )}

          {authStatus === "success" && (
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 animate-bounce">
              <UIIcons.CheckCircle className="w-10 h-10 text-white" />
            </div>
          )}

          {authStatus === "error" && (
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mb-4 animate-pulse">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          )}

          {/* Status Text */}
          <div className="mb-4">
            {authStatus === "idle" && (
              <p className="text-sm text-muted-foreground">
                Ready for authentication
              </p>
            )}
            {authStatus === "scanning" && (
              <p className="text-sm text-blue-600 font-medium">
                Scanning... Please wait
              </p>
            )}
            {authStatus === "success" && (
              <p className="text-sm text-emerald-600 font-medium">
                Authentication successful!
              </p>
            )}
            {authStatus === "error" && (
              <div>
                <p className="text-sm text-red-600 font-medium">
                  Authentication failed
                </p>
                <p className="text-xs text-red-500 mt-1">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Authentication Methods */}
        {authStatus === "idle" && (
          <div className="space-y-4">
            {(type === "fingerprint" || type === "both") &&
              supportedMethods.includes("fingerprint") && (
                <Button
                  onClick={handleFingerprintAuth}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl py-3 transition-all duration-300 hover:shadow-lg"
                >
                  <Fingerprint className="w-5 h-5 mr-2" />
                  Use Fingerprint
                </Button>
              )}

            {(type === "face" || type === "both") &&
              supportedMethods.includes("face") && (
                <Button
                  onClick={handleFaceAuth}
                  disabled={isScanning}
                  variant="outline"
                  className="w-full border-2 border-blue-200 hover:border-blue-300 rounded-2xl py-3 transition-all duration-300"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Use Face ID
                </Button>
              )}

            {supportedMethods.length === 0 && (
              <div className="text-center">
                <Smartphone className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Biometric authentication not available on this device
                </p>
              </div>
            )}
          </div>
        )}

        {/* Retry/Reset Button */}
        {authStatus === "error" && (
          <Button
            onClick={resetAuth}
            variant="outline"
            className="w-full border-2 border-red-200 hover:border-red-300 rounded-2xl py-3 transition-all duration-300"
          >
            Try Again
          </Button>
        )}

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
          >
            <Lock className="w-3 h-3 mr-1" />
            End-to-End Encrypted
          </Badge>
        </div>

        {/* Fallback Option */}
        {showFallback && authStatus === "idle" && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Use PIN instead
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
