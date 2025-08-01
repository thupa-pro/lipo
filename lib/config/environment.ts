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
    .refine(
      (val) => !val || val.startsWith('your_') || z.string().url().safeParse(val).success,
      'Invalid Sentry DSN - must be a valid URL or placeholder'
    )
    .optional(),
  POSTHOG_API_KEY: z
    .string()
    .refine(
      (val) => !val || val.startsWith('your_') || val.length > 5,
      'Invalid PostHog API key'
    )
    .optional(),
  POSTHOG_HOST: z
    .string()
    .refine(
      (val) => !val || val.startsWith('your_') || z.string().url().safeParse(val).success,
      'Invalid PostHog host'
    )
    .default('https://app.posthog.com'),

  // Payment (Stripe) - Optional
  STRIPE_SECRET_KEY: z
    .string()
    .refine(
      (val) => !val || val.startsWith('your_') || val.startsWith('sk_'),
      'Invalid Stripe secret key'
    )
    .optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .refine(
      (val) => !val || val.startsWith('your_') || val.startsWith('pk_'),
      'Invalid Stripe publishable key'
    )
    .optional(),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .refine(
      (val) => !val || val.startsWith('your_') || val.startsWith('whsec_'),
      'Invalid Stripe webhook secret'
    )
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

    const isRealValue = (value: string | undefined): boolean => {
      return !!(value && !value.startsWith('your_') && value.length > 5);
    };

    // Redis validation - both URL and token required if one is provided (and not placeholder)
    const hasRedisUrl = isRealValue(this.config.UPSTASH_REDIS_REST_URL);
    const hasRedisToken = isRealValue(this.config.UPSTASH_REDIS_REST_TOKEN);

    if (hasRedisUrl && !hasRedisToken) {
      this.errors.push('UPSTASH_REDIS_REST_TOKEN is required when UPSTASH_REDIS_REST_URL is provided');
      this.isValid = false;
    }

    if (hasRedisToken && !hasRedisUrl) {
      this.errors.push('UPSTASH_REDIS_REST_URL is required when UPSTASH_REDIS_REST_TOKEN is provided');
      this.isValid = false;
    }

    // Stripe validation - both keys required if one is provided (and not placeholder)
    const hasStripeSecret = isRealValue(this.config.STRIPE_SECRET_KEY);
    const hasStripePublic = isRealValue(this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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

    const isValidValue = (value: string | undefined): boolean => {
      return !!(value && !value.startsWith('your_') && value.length > 5);
    };

    switch (feature) {
      case 'redis':
        return isValidValue(this.config.UPSTASH_REDIS_REST_URL) && isValidValue(this.config.UPSTASH_REDIS_REST_TOKEN);
      case 'stripe':
        return isValidValue(this.config.STRIPE_SECRET_KEY) && isValidValue(this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      case 'sentry':
        return isValidValue(this.config.NEXT_PUBLIC_SENTRY_DSN);
      case 'posthog':
        return isValidValue(this.config.POSTHOG_API_KEY);
      case 'analytics':
        return isValidValue(this.config.NEXT_PUBLIC_GA_MEASUREMENT_ID) || isValidValue(this.config.NEXT_PUBLIC_FB_PIXEL_ID);
      case 'clerk_webhooks':
        return isValidValue(this.config.CLERK_WEBHOOK_SECRET);
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
