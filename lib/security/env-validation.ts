import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "Supabase anon key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "Supabase service role key is required")
    .optional(),

  // Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Clerk publishable key is required")
    .optional(),
  CLERK_SECRET_KEY: z
    .string()
    .min(1, "Clerk secret key is required")
    .optional(),

  // Payment
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, "Stripe secret key is required")
    .optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Stripe publishable key is required")
    .optional(),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "Stripe webhook secret is required")
    .optional(),

  // External Services
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  POSTHOG_API_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().url().optional(),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_FB_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_HOTJAR_ID: z.string().optional(),

  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url("Invalid app URL").optional(),
  NEXT_PUBLIC_DEFAULT_TIMEZONE: z.string().optional(),

  // Build/Development
  ANALYZE: z.enum(["true", "false"]).optional(),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function validateEnv(): Env {
  if (validatedEnv) return validatedEnv;

  try {
    validatedEnv = envSchema.parse(process.env);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(
        `Environment variable validation failed:\n${errorMessage}`,
      );
    }
    throw error;
  }
}

export function getEnv(): Env {
  if (!validatedEnv) {
    throw new Error(
      "Environment variables not validated. Call validateEnv() first.",
    );
  }
  return validatedEnv;
}

// Validate environment variables on module load
if (typeof window === "undefined") {
  validateEnv();
}
