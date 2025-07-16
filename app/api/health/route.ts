import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity using user_roles table (which should exist)
    const { data, error } = await supabase
      .from("user_roles")
      .select("count")
      .limit(1);

    if (error) {
      throw error;
    }

    const dbLatency = Date.now() - startTime;

    // Check external services
    const checks = {
      database: {
        status: "healthy",
        latency: dbLatency,
        timestamp: new Date().toISOString(),
      },
      memory: {
        usage: process.memoryUsage(),
        timestamp: new Date().toISOString(),
      },
      uptime: {
        seconds: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      checks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        checks: {
          database: {
            status: "unhealthy",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
        },
      },
      { status: 503 },
    );
  }
}
