import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

export default function AdminPricing() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-red-500" />
            Admin Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            As an administrator, you have full access to all platform features.
            No subscription is required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
