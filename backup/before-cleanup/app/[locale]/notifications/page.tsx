import { Metadata } from "next";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export const metadata: Metadata = {
  title: "Notifications - Loconomy",
  description: "Manage your notifications and stay updated with your activity",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay updated with your activity and manage notification preferences
          </p>
        </div>

        {/* Notification Center */}
        <NotificationCenter />
      </div>
    </div>
  );
}
