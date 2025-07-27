import { z } from 'zod';

// Comprehensive environment validation schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Application
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('Invalid app URL')
    .default('http://localhost:3000'),

  // Database (Supabase) - Required
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'Supabase service role key is required'),

  // Authentication (Clerk) - Required
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'Clerk publishable key is required'),
  CLERK_SECRET_KEY: z
    .string()
    .min(1, 'Clerk secret key is required'),
  CLERK_WEBHOOK_SECRET: z
    .string()
    .min(1, 'Clerk webhook secret is required')
    .optional(),

  // Rate Limiting (Redis) - Optional with fallback
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('Invalid Redis URL')
    .optional(),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, 'Redis token required if URL provided')
    .optional(),

  // External Services - Optional
  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url('Invalid Sentry DSN')
    .optional(),
  POSTHOG_API_KEY: z
    .string()
    .optional(),
  POSTHOG_HOST: z
    .string()
    .url('Invalid PostHog host')
    .default('https://app.posthog.com'),

  // Payment (Stripe) - Optional
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, 'Stripe secret key required')
    .optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'Stripe publishable key required')
    .optional(),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, 'Stripe webhook secret required')
    .optional(),

  // Analytics - Optional
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .optional(),
  NEXT_PUBLIC_FB_PIXEL_ID: z
    .string()
    .optional(),
  NEXT_PUBLIC_HOTJAR_ID: z
    .string()
    .optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private config: EnvConfig | null = null;
  private isValid: boolean = false;
  private errors: string[] = [];

  private constructor() {
    this.validate();
  }

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  private validate(): void {
    try {
      this.config = envSchema.parse(process.env);
      this.isValid = true;
      this.errors = [];
      
      // Additional validation for related variables
      this.validateRelatedVars();
      
      console.log('✅ Environment validation passed');
    } catch (error) {
      this.isValid = false;
      
      if (error instanceof z.ZodError) {
        this.errors = error.errors.map(
          (err) => `${err.path.join('.')}: ${err.message}`
        );
      } else {
        this.errors = ['Unknown validation error'];
      }
      
      console.error('❌ Environment validation failed:', this.errors);
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          `Critical environment variables missing:\n${this.errors.join('\n')}`
        );
      }
    }
  }

  private validateRelatedVars(): void {
    if (!this.config) return;

    // Redis validation - both URL and token required if one is provided
    const hasRedisUrl = !!this.config.UPSTASH_REDIS_REST_URL;
    const hasRedisToken = !!this.config.UPSTASH_REDIS_REST_TOKEN;
    
    if (hasRedisUrl && !hasRedisToken) {
      this.errors.push('UPSTASH_REDIS_REST_TOKEN is required when UPSTASH_REDIS_REST_URL is provided');
      this.isValid = false;
    }
    
    if (hasRedisToken && !hasRedisUrl) {
      this.errors.push('UPSTASH_REDIS_REST_URL is required when UPSTASH_REDIS_REST_TOKEN is provided');
      this.isValid = false;
    }

    // Stripe validation - both keys required if one is provided
    const hasStripeSecret = !!this.config.STRIPE_SECRET_KEY;
    const hasStripePublic = !!this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (hasStripeSecret && !hasStripePublic) {
      this.errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required when STRIPE_SECRET_KEY is provided');
      this.isValid = false;
    }
    
    if (hasStripePublic && !hasStripeSecret) {
      this.errors.push('STRIPE_SECRET_KEY is required when NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is provided');
      this.isValid = false;
    }
  }

  public getConfig(): EnvConfig {
    if (!this.config) {
      throw new Error('Environment not validated. Call validate() first.');
    }
    return this.config;
  }

  public isValidConfig(): boolean {
    return this.isValid;
  }

  public getErrors(): string[] {
    return [...this.errors];
  }

  public hasFeature(feature: string): boolean {
    if (!this.config) return false;
    
    switch (feature) {
      case 'redis':
        return !!(this.config.UPSTASH_REDIS_REST_URL && this.config.UPSTASH_REDIS_REST_TOKEN);
      case 'stripe':
        return !!(this.config.STRIPE_SECRET_KEY && this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      case 'sentry':
        return !!this.config.NEXT_PUBLIC_SENTRY_DSN;
      case 'posthog':
        return !!this.config.POSTHOG_API_KEY;
      case 'analytics':
        return !!(this.config.NEXT_PUBLIC_GA_MEASUREMENT_ID || this.config.NEXT_PUBLIC_FB_PIXEL_ID);
      case 'clerk_webhooks':
        return !!this.config.CLERK_WEBHOOK_SECRET;
      default:
        return false;
    }
  }

  public isDevelopment(): boolean {
    return this.config?.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return this.config?.NODE_ENV === 'production';
  }

  public getAppUrl(): string {
    return this.config?.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
}

// Export singleton instance
export const env = EnvironmentValidator.getInstance();

// Export validation function for direct use
export function validateEnvironment(): EnvConfig {
  return env.getConfig();
}

// Export feature checking function
export function hasFeature(feature: string): boolean {
  return env.hasFeature(feature);
}

// Export environment checking functions
export function isDevelopment(): boolean {
  return env.isDevelopment();
}

export function isProduction(): boolean {
  return env.isProduction();
}

// Validate on module load in server environment
if (typeof window === 'undefined') {
  validateEnvironment();
}
