import { redirect } from "next/navigation";

// Redirect to analytics page since reports are part of analytics
export default function ProviderReportsRedirect() {
  redirect("/provider/analytics");
}
