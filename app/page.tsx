import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

// This page only renders when the locale is missing from the URL
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
