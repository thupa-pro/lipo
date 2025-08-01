import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/config/environment';

// Enhanced Supabase client for enterprise authentication
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    const config = env.getConfig();
    
    supabaseClient = createClient(
      config.NEXT_PUBLIC_SUPABASE_URL!,
      config.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            'X-Client-Info': 'loconomy-enterprise-auth',
          },
        },
      }
    );

    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw new Error('Supabase client initialization failed');
  }
}

// User profile operations
export async function createUserProfile(userData: {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'consumer' | 'provider' | 'admin';
  avatar?: string;
  phone?: string;
  metadata?: Record<string, any>;
}) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        clerk_user_id: userData.clerkUserId,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        avatar_url: userData.avatar,
        phone: userData.phone,
        email_verified: true, // Clerk handles verification
        metadata: userData.metadata || {},
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data;
}

export async function getUserProfile(clerkUserId: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
}

export async function updateUserProfile(clerkUserId: string, updates: {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  metadata?: Record<string, any>;
  lastSignInAt?: string;
}) {
  const supabase = getSupabaseClient();
  
  const updateData: any = {};
  if (updates.firstName) updateData.first_name = updates.firstName;
  if (updates.lastName) updateData.last_name = updates.lastName;
  if (updates.avatar) updateData.avatar_url = updates.avatar;
  if (updates.phone) updateData.phone = updates.phone;
  if (updates.metadata) updateData.metadata = updates.metadata;
  if (updates.lastSignInAt) updateData.last_sign_in_at = updates.lastSignInAt;
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('clerk_user_id', clerkUserId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return data;
}

// Session tracking operations
export async function createSession(sessionData: {
  userId: string;
  clerkSessionId: string;
  ipAddress: string;
  userAgent?: string;
  expiresAt: string;
}) {
  const supabase = getSupabaseClient();
  
  // First get the user's internal ID
  const userProfile = await getUserProfile(sessionData.userId);
  if (!userProfile) {
    throw new Error('User profile not found');
  }

  const { data, error } = await supabase
    .from('user_sessions')
    .insert([
      {
        user_id: userProfile.id,
        clerk_session_id: sessionData.clerkSessionId,
        ip_address: sessionData.ipAddress,
        user_agent: sessionData.userAgent,
        expires_at: sessionData.expiresAt,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw error;
  }

  return data;
}

export async function invalidateSession(clerkSessionId: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_sessions')
    .update({ is_active: false })
    .eq('clerk_session_id', clerkSessionId)
    .select();

  if (error) {
    console.error('Error invalidating session:', error);
    throw error;
  }

  return data;
}

// Security event logging
export async function logSecurityEvent(eventData: {
  userId?: string;
  eventType: string;
  ipAddress: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
}) {
  const supabase = getSupabaseClient();
  
  let userProfileId = null;
  if (eventData.userId) {
    const userProfile = await getUserProfile(eventData.userId);
    userProfileId = userProfile?.id || null;
  }

  const { data, error } = await supabase
    .from('security_events')
    .insert([
      {
        user_id: userProfileId,
        event_type: eventData.eventType,
        ip_address: eventData.ipAddress,
        user_agent: eventData.userAgent,
        severity: eventData.severity,
        details: eventData.details || {},
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error logging security event:', error);
    // Don't throw here as we don't want security logging to break auth flow
    return null;
  }

  return data;
}

// Rate limiting operations
export async function checkRateLimit(identifier: string, actionType: string): Promise<{
  allowed: boolean;
  remaining: number;
  reset: number;
  limit: number;
}> {
  const supabase = getSupabaseClient();
  
  // Default limits per action type
  const limits: Record<string, { count: number; windowMs: number }> = {
    auth_signin: { count: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
    auth_signup: { count: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
    auth_oauth: { count: 10, windowMs: 60 * 60 * 1000 }, // 10 attempts per hour
    api_general: { count: 100, windowMs: 60 * 60 * 1000 }, // 100 requests per hour
  };

  const limit = limits[actionType] || limits.api_general;
  const windowStart = new Date(Date.now() - limit.windowMs);
  const expiresAt = new Date(Date.now() + limit.windowMs);

  // Clean up expired entries first
  await supabase
    .from('rate_limits')
    .delete()
    .lt('expires_at', new Date().toISOString());

  // Check current rate limit
  const { data: existing, error: fetchError } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('action_type', actionType)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking rate limit:', fetchError);
    // Allow request on error to avoid blocking users
    return { allowed: true, remaining: limit.count - 1, reset: expiresAt.getTime(), limit: limit.count };
  }

  if (existing) {
    // Update existing rate limit
    const newCount = existing.attempt_count + 1;
    
    if (newCount > limit.count) {
      return { allowed: false, remaining: 0, reset: existing.expires_at, limit: limit.count };
    }

    await supabase
      .from('rate_limits')
      .update({ attempt_count: newCount })
      .eq('id', existing.id);

    return { 
      allowed: true, 
      remaining: limit.count - newCount, 
      reset: new Date(existing.expires_at).getTime(),
      limit: limit.count 
    };
  } else {
    // Create new rate limit entry
    await supabase
      .from('rate_limits')
      .insert([
        {
          identifier,
          action_type: actionType,
          attempt_count: 1,
          window_start: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        },
      ]);

    return { 
      allowed: true, 
      remaining: limit.count - 1, 
      reset: expiresAt.getTime(),
      limit: limit.count 
    };
  }
}

// Provider profile operations
export async function createProviderProfile(providerData: {
  userId: string;
  businessName: string;
  businessDescription?: string;
  businessPhone?: string;
  businessEmail?: string;
  serviceCategories?: string[];
  hourlyRate?: number;
}) {
  const supabase = getSupabaseClient();
  
  // Get user profile ID
  const userProfile = await getUserProfile(providerData.userId);
  if (!userProfile) {
    throw new Error('User profile not found');
  }

  const { data, error } = await supabase
    .from('provider_profiles')
    .insert([
      {
        user_id: userProfile.id,
        business_name: providerData.businessName,
        business_description: providerData.businessDescription,
        business_phone: providerData.businessPhone,
        business_email: providerData.businessEmail,
        service_categories: providerData.serviceCategories || [],
        hourly_rate: providerData.hourlyRate,
        verification_status: 'pending',
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating provider profile:', error);
    throw error;
  }

  return data;
}

// Maintenance functions
export async function cleanupExpiredSessions(): Promise<number> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.rpc('cleanup_expired_sessions');
  
  if (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
  
  return data || 0;
}

export async function cleanupOldSecurityEvents(): Promise<number> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.rpc('cleanup_old_security_events');
  
  if (error) {
    console.error('Error cleaning up old security events:', error);
    return 0;
  }
  
  return data || 0;
}

export async function cleanupExpiredRateLimits(): Promise<number> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.rpc('cleanup_expired_rate_limits');
  
  if (error) {
    console.error('Error cleaning up expired rate limits:', error);
    return 0;
  }
  
  return data || 0;
}

// Health check
export async function healthCheck(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('user_profiles').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase health check failed:', error);
    return false;
  }
}
