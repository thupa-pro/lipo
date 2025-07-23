// This file has been moved to app/[locale]/settings/page.tsx
// Redirecting to avoid conflicts

import { redirect } from "next/navigation";

export default function SettingsPageRedirect() {
  redirect("/en/settings");
}
