"use client";

import { redirect } from "next/navigation";

export default function DemoRedirectPage() {
  // Redirect to the locale-specific demo page
  redirect("/en/demo");
}
