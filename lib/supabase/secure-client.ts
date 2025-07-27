import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logSecurityEvent } from '@/lib/security/audit-logger';

// Database schema types
export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'consumer' | 'provider' | 'admin';
  avatar_url?: string;
  phone?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  metadata?: Record<string, any>;
}

export interface UserSession {
  id: string;
  user_id: string;
  clerk_session_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: string;
  ip_address: string;
  user_agent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
  created_at: string;
}

// Secure Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key';

const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Client-side Supabase client (browser)
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // We handle sessions via Clerk
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'loconomy-web',
      },
    },
  });
};

// Server-side Supabase client (SSR)
export const createServerClient = () => {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Handle cookie setting errors
          console.warn('Failed to set cookie:', error);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Handle cookie removal errors
          console.warn('Failed to remove cookie:', error);
        }
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

// Admin Supabase client (service role)
export const createAdminClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service role key');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'loconomy-admin',
      },
    },
  });
};

// Secure database operations class
export class SecureSupabaseService {
  private static adminClient = createAdminClient();

  // Create or update user profile securely
  static async upsertUserProfile(
    clerkUserId: string,
    userData: Partial<UserProfile>,
    clientIP: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      // If Supabase is not configured, return mock success
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, skipping user profile upsert');
        return {
          success: true,
          user: {
            id: clerkUserId,
            clerk_user_id: clerkUserId,
            email: userData.email || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            role: userData.role || 'consumer',
            email_verified: userData.email_verified || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as UserProfile
        };
      }
      // Validate required fields
      if (!clerkUserId || !userData.email) {
        return { success: false, error: 'Missing required user data' };
      }

      // Sanitize user data
      const sanitizedData = {
        clerk_user_id: clerkUserId,
        email: userData.email.toLowerCase().trim(),
        first_name: userData.first_name?.trim() || '',
        last_name: userData.last_name?.trim() || '',
        role: userData.role || 'consumer',
        avatar_url: userData.avatar_url,
        phone: userData.phone?.trim(),
        email_verified: userData.email_verified || false,
        updated_at: new Date().toISOString(),
      };

      // Check if user exists
      const { data: existingUser } = await this.adminClient
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      let result;
      
      if (existingUser) {
        // Update existing user
        result = await this.adminClient
          .from('user_profiles')
          .update(sanitizedData)
          .eq('clerk_user_id', clerkUserId)
          .select()
          .single();
      } else {
        // Create new user
        result = await this.adminClient
          .from('user_profiles')
          .insert({
            ...sanitizedData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
      }

      if (result.error) {
        await logSecurityEvent({
          type: 'USER_PROFILE_ERROR',
          userId: clerkUserId,
          ip: clientIP,
          severity: 'medium',
          details: result.error,
        });

        return { success: false, error: 'Failed to save user profile' };
      }

      // Log successful profile operation
      await logSecurityEvent({
        type: existingUser ? 'USER_PROFILE_UPDATED' : 'USER_PROFILE_CREATED',
        userId: clerkUserId,
        ip: clientIP,
        severity: 'info',
      });

      return { success: true, user: result.data };

    } catch (error) {
      await logSecurityEvent({
        type: 'USER_PROFILE_SYSTEM_ERROR',
        userId: clerkUserId,
        ip: clientIP,
        severity: 'high',
        details: error instanceof Error ? error.message : 'Unknown error',
      });

      return { success: false, error: 'System error occurred' };
    }
  }

  // Get user profile by Clerk ID
  static async getUserProfile(clerkUserId: string): Promise<UserProfile | null> {
    try {
      // If Supabase is not configured, return null
      if (!isSupabaseConfigured) {
        return null;
      }
      const { data, error } = await this.adminClient
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Create session record
  static async createSession(
    userId: string,
    clerkSessionId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ success: boolean; session?: UserSession; error?: string }> {
    try {
      if (!isSupabaseConfigured) {
        return { success: true };
      }
      const sessionData = {
        user_id: userId,
        clerk_session_id: clerkSessionId,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        is_active: true,
      };

      const { data, error } = await this.adminClient
        .from('user_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to create session' };
      }

      return { success: true, session: data };
    } catch (error) {
      return { success: false, error: 'System error occurred' };
    }
  }

  // Invalidate session
  static async invalidateSession(clerkSessionId: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured) {
        return true;
      }
      const { error } = await this.adminClient
        .from('user_sessions')
        .update({ is_active: false })
        .eq('clerk_session_id', clerkSessionId);

      return !error;
    } catch (error) {
      console.error('Error invalidating session:', error);
      return false;
    }
  }

  // Log security event to database
  static async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<boolean> {
    try {
      if (!isSupabaseConfigured) {
        // Log to console in development
        console.log('[SECURITY EVENT]', event);
        return true;
      }
      const eventData = {
        ...event,
        created_at: new Date().toISOString(),
      };

      const { error } = await this.adminClient
        .from('security_events')
        .insert(eventData);

      return !error;
    } catch (error) {
      console.error('Error logging security event:', error);
      return false;
    }
  }

  // Get user activity analytics
  static async getUserActivity(userId: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await this.adminClient
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return null;
    }
  }

  // Check for suspicious activity
  static async checkSuspiciousActivity(ipAddress: string, hours: number = 24): Promise<boolean> {
    try {
      const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await this.adminClient
        .from('security_events')
        .select('event_type')
        .eq('ip_address', ipAddress)
        .in('severity', ['high', 'critical'])
        .gte('created_at', startTime);

      if (error) {
        return false;
      }

      // Consider suspicious if more than 5 high/critical events in timeframe
      return (data?.length || 0) > 5;
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
      return false;
    }
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<boolean> {
    try {
      const { error } = await this.adminClient
        .from('user_sessions')
        .update({ is_active: false })
        .lt('expires_at', new Date().toISOString());

      return !error;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      return false;
    }
  }
}

// Export for backward compatibility
export const supabase = createBrowserClient();
export const supabaseServer = createServerClient();
export const supabaseAdmin = createAdminClient();
