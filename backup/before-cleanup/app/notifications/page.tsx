import { redirect } from "next/navigation";

export default function NotificationsPage() {
  // Redirect to the locale-specific notifications page
  redirect("/en/notifications");
}
