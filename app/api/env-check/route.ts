import { NextResponse } from "next/server";

export async function GET() {
  const envVars = {
    // Public vars (safe to show)
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "Set"
      : "Missing",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env
      .NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      ? "Set"
      : "Missing",
    NEXT_PUBLIC_DEFAULT_TIMEZONE:
      process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "Not set",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "Not set",

    // Private vars (only show if set/missing)
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "Set"
      : "Missing",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "Set" : "Missing",
    CLERK_API_URL: process.env.CLERK_API_URL || "Not set",

    // Node env
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json({
    status: "success",
    environment: envVars,
    timestamp: new Date().toISOString(),
  });
}
