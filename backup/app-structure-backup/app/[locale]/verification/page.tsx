import { Metadata } from "next";
import { VerificationDashboard } from "@/components/verification/VerificationDashboard";

export const metadata: Metadata = {
  title: "Verification Center - Loconomy",
  description: "Manage your identity verification and trust score",
};

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Verification Center
          </h1>
          <p className="text-muted-foreground">
            Complete your verification to build trust and unlock platform
            benefits
          </p>
        </div>

        {/* Verification Dashboard */}
        <VerificationDashboard />
      </div>
    </div>
  );
}
