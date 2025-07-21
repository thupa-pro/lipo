import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { eventBus } from '@/lib/events';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GDPR schemas
export const CookieConsentSchema = z.object({
  user_id: z.string().optional(),
  session_id: z.string(),
  necessary: z.boolean().default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
  preferences: z.boolean().default(false),
  timestamp: z.string().datetime(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
});

export const DataExportRequestSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  request_type: z.enum(['export', 'delete']),
  data_categories: z.array(z.enum([
    'profile',
    'bookings',
    'preferences',
    'communications',
    'usage_analytics',
    'billing',
    'support_tickets',
    'all'
  ])),
  reason: z.string().optional(),
  verification_token: z.string().optional(),
});

export const PrivacySettingsSchema = z.object({
  user_id: z.string(),
  email_marketing: z.boolean().default(false),
  sms_marketing: z.boolean().default(false),
  push_notifications: z.boolean().default(true),
  data_analytics: z.boolean().default(true),
  personalized_ads: z.boolean().default(false),
  third_party_sharing: z.boolean().default(false),
  profile_visibility: z.enum(['private', 'public', 'limited']).default('limited'),
  updated_at: z.string().datetime(),
});

type CookieConsent = z.infer<typeof CookieConsentSchema>;
type DataExportRequest = z.infer<typeof DataExportRequestSchema>;
type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;

// Cookie categories and their purposes
export const COOKIE_CATEGORIES = {
  necessary: {
    name: 'Necessary',
    description: 'Essential cookies required for basic website functionality',
    required: true,
    cookies: [
      { name: 'session', purpose: 'User authentication and session management' },
      { name: 'csrf', purpose: 'Cross-site request forgery protection' },
      { name: 'consent', purpose: 'Remembers your cookie consent preferences' },
    ],
  },
  analytics: {
    name: 'Analytics',
    description: 'Help us understand how you use our website to improve performance',
    required: false,
    cookies: [
      { name: 'posthog', purpose: 'Website analytics and user behavior tracking' },
      { name: 'sentry', purpose: 'Error tracking and performance monitoring' },
    ],
  },
  marketing: {
    name: 'Marketing',
    description: 'Used to deliver personalized advertisements and marketing content',
    required: false,
    cookies: [
      { name: 'facebook_pixel', purpose: 'Facebook advertising and retargeting' },
      { name: 'google_ads', purpose: 'Google advertising and conversion tracking' },
    ],
  },
  preferences: {
    name: 'Preferences',
    description: 'Remember your preferences and settings for a better experience',
    required: false,
    cookies: [
      { name: 'locale', purpose: 'Remember your language preference' },
      { name: 'theme', purpose: 'Remember your theme preference (light/dark)' },
      { name: 'search_filters', purpose: 'Remember your search filter preferences' },
    ],
  },
} as const;

export class GDPRCompliance {
  private static instance: GDPRCompliance;

  public static getInstance(): GDPRCompliance {
    if (!GDPRCompliance.instance) {
      GDPRCompliance.instance = new GDPRCompliance();
    }
    return GDPRCompliance.instance;
  }

  // Record cookie consent
  async recordCookieConsent(consent: CookieConsent): Promise<void> {
    try {
      const validated = CookieConsentSchema.parse(consent);
      
      await supabase.from('cookie_consents').insert({
        user_id: validated.user_id,
        session_id: validated.session_id,
        necessary: validated.necessary,
        analytics: validated.analytics,
        marketing: validated.marketing,
        preferences: validated.preferences,
        timestamp: validated.timestamp,
        ip_address: validated.ip_address,
        user_agent: validated.user_agent,
      });

      // Emit consent event
      await eventBus.emit({
        type: 'cookie_consent_updated',
        data: {
          user_id: validated.user_id,
          session_id: validated.session_id,
          consent: {
            analytics: validated.analytics,
            marketing: validated.marketing,
            preferences: validated.preferences,
          },
        },
        context: { source: 'gdpr_compliance' },
      });

    } catch (error) {
      console.error('Failed to record cookie consent:', error);
      throw error;
    }
  }

  // Get user's current cookie consent
  async getCookieConsent(sessionId: string, userId?: string): Promise<CookieConsent | null> {
    try {
      let query = supabase
        .from('cookie_consents')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        return null;
      }

      return CookieConsentSchema.parse(data);
    } catch (error) {
      console.error('Failed to get cookie consent:', error);
      return null;
    }
  }

  // Update privacy settings
  async updatePrivacySettings(settings: PrivacySettings): Promise<void> {
    try {
      const validated = PrivacySettingsSchema.parse(settings);
      
      await supabase
        .from('privacy_settings')
        .upsert({
          user_id: validated.user_id,
          email_marketing: validated.email_marketing,
          sms_marketing: validated.sms_marketing,
          push_notifications: validated.push_notifications,
          data_analytics: validated.data_analytics,
          personalized_ads: validated.personalized_ads,
          third_party_sharing: validated.third_party_sharing,
          profile_visibility: validated.profile_visibility,
          updated_at: validated.updated_at,
        });

      // Emit privacy settings updated event
      await eventBus.emit({
        type: 'privacy_settings_updated',
        data: {
          user_id: validated.user_id,
          settings: validated,
        },
        context: { source: 'gdpr_compliance' },
      });

    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw error;
    }
  }

  // Get user's privacy settings
  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return PrivacySettingsSchema.parse(data);
    } catch (error) {
      console.error('Failed to get privacy settings:', error);
      return null;
    }
  }

  // Submit data export/deletion request
  async submitDataRequest(request: DataExportRequest): Promise<string> {
    try {
      const validated = DataExportRequestSchema.parse(request);
      
      // Generate verification token
      const verificationToken = this.generateVerificationToken();
      
      const { data, error } = await supabase
        .from('data_requests')
        .insert({
          user_id: validated.user_id,
          email: validated.email,
          request_type: validated.request_type,
          data_categories: validated.data_categories,
          reason: validated.reason,
          verification_token: verificationToken,
          status: 'pending_verification',
          submitted_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error || !data) {
        throw new Error('Failed to submit data request');
      }

      // Send verification email
      await this.sendVerificationEmail(validated.email, verificationToken, validated.request_type);

      // Emit data request event
      await eventBus.emit({
        type: 'data_request_submitted',
        data: {
          request_id: data.id,
          user_id: validated.user_id,
          request_type: validated.request_type,
          email: validated.email,
        },
        context: { source: 'gdpr_compliance' },
      });

      return data.id;
    } catch (error) {
      console.error('Failed to submit data request:', error);
      throw error;
    }
  }

  // Verify data request
  async verifyDataRequest(token: string): Promise<boolean> {
    try {
      const { data: request, error } = await supabase
        .from('data_requests')
        .select('*')
        .eq('verification_token', token)
        .eq('status', 'pending_verification')
        .single();

      if (error || !request) {
        return false;
      }

      // Check if token is still valid (24 hours)
      const submittedAt = new Date(request.submitted_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        await supabase
          .from('data_requests')
          .update({ status: 'expired' })
          .eq('id', request.id);
        return false;
      }

      // Mark as verified and process
      await supabase
        .from('data_requests')
        .update({ 
          status: 'verified',
          verified_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      // Process the request
      if (request.request_type === 'export') {
        await this.processDataExport(request);
      } else if (request.request_type === 'delete') {
        await this.processDataDeletion(request);
      }

      return true;
    } catch (error) {
      console.error('Failed to verify data request:', error);
      return false;
    }
  }

  // Process data export
  private async processDataExport(request: any): Promise<void> {
    try {
      const userData = await this.collectUserData(request.user_id, request.data_categories);
      
      // Store exported data temporarily
      const { data: exportRecord } = await supabase.storage
        .from('data-exports')
        .upload(`${request.user_id}/${request.id}.json`, JSON.stringify(userData, null, 2));

      if (exportRecord) {
        // Generate download link (expires in 7 days)
        const { data: downloadUrl } = await supabase.storage
          .from('data-exports')
          .createSignedUrl(`${request.user_id}/${request.id}.json`, 7 * 24 * 60 * 60);

        if (downloadUrl) {
          // Send download link via email
          await this.sendDataExportEmail(request.email, downloadUrl.signedUrl);
          
          // Update request status
          await supabase
            .from('data_requests')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', request.id);
        }
      }

      // Emit export completed event
      await eventBus.emit({
        type: 'data_export_completed',
        data: {
          request_id: request.id,
          user_id: request.user_id,
          email: request.email,
        },
        context: { source: 'gdpr_compliance' },
      });

    } catch (error) {
      console.error('Failed to process data export:', error);
      await supabase
        .from('data_requests')
        .update({ status: 'failed' })
        .eq('id', request.id);
    }
  }

  // Process data deletion
  private async processDataDeletion(request: any): Promise<void> {
    try {
      await this.deleteUserData(request.user_id, request.data_categories);
      
      // Update request status
      await supabase
        .from('data_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      // Emit deletion completed event
      await eventBus.emit({
        type: 'data_deletion_completed',
        data: {
          request_id: request.id,
          user_id: request.user_id,
          email: request.email,
          categories: request.data_categories,
        },
        context: { source: 'gdpr_compliance' },
      });

    } catch (error) {
      console.error('Failed to process data deletion:', error);
      await supabase
        .from('data_requests')
        .update({ status: 'failed' })
        .eq('id', request.id);
    }
  }

  // Collect all user data for export
  private async collectUserData(userId: string, categories: string[]): Promise<any> {
    const userData: any = {};

    if (categories.includes('all') || categories.includes('profile')) {
      const { data: profile } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();
      userData.profile = profile;
    }

    if (categories.includes('all') || categories.includes('bookings')) {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', userId);
      userData.bookings = bookings;
    }

    if (categories.includes('all') || categories.includes('preferences')) {
      const { data: preferences } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      userData.preferences = preferences;

      const { data: consents } = await supabase
        .from('cookie_consents')
        .select('*')
        .eq('user_id', userId);
      userData.cookie_consents = consents;
    }

    if (categories.includes('all') || categories.includes('communications')) {
      const { data: communications } = await supabase
        .from('communications')
        .select('*')
        .eq('user_id', userId);
      userData.communications = communications;
    }

    if (categories.includes('all') || categories.includes('usage_analytics')) {
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('data->>user_id', userId);
      userData.usage_analytics = events;
    }

    if (categories.includes('all') || categories.includes('billing')) {
      const { data: billing } = await supabase
        .from('usage_records')
        .select('*')
        .eq('customer_id', userId);
      userData.billing = billing;
    }

    return {
      exported_at: new Date().toISOString(),
      user_id: userId,
      data: userData,
    };
  }

  // Delete user data based on categories
  private async deleteUserData(userId: string, categories: string[]): Promise<void> {
    if (categories.includes('all') || categories.includes('profile')) {
      await supabase.from('customers').delete().eq('id', userId);
    }

    if (categories.includes('all') || categories.includes('bookings')) {
      await supabase.from('bookings').delete().eq('customer_id', userId);
    }

    if (categories.includes('all') || categories.includes('preferences')) {
      await supabase.from('privacy_settings').delete().eq('user_id', userId);
      await supabase.from('cookie_consents').delete().eq('user_id', userId);
    }

    if (categories.includes('all') || categories.includes('communications')) {
      await supabase.from('communications').delete().eq('user_id', userId);
    }

    if (categories.includes('all') || categories.includes('usage_analytics')) {
      await supabase.from('events').delete().eq('data->>user_id', userId);
    }

    if (categories.includes('all') || categories.includes('billing')) {
      await supabase.from('usage_records').delete().eq('customer_id', userId);
    }
  }

  // Generate verification token
  private generateVerificationToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Send verification email (placeholder)
  private async sendVerificationEmail(email: string, token: string, requestType: string): Promise<void> {
    // In production, integrate with your email service (Resend, etc.)
    console.log(`Sending verification email to ${email} for ${requestType} request with token ${token}`);
  }

  // Send data export email (placeholder)
  private async sendDataExportEmail(email: string, downloadUrl: string): Promise<void> {
    // In production, integrate with your email service
    console.log(`Sending data export email to ${email} with download URL ${downloadUrl}`);
  }

  // Check if user needs cookie consent (based on location)
  static requiresCookieConsent(countryCode?: string): boolean {
    const gdprCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
      'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
      'SE', 'GB', 'IS', 'LI', 'NO'
    ];
    
    return countryCode ? gdprCountries.includes(countryCode) : false;
  }

  // Get data retention policy
  static getDataRetentionPolicy(): Record<string, string> {
    return {
      profile: '2 years after account deletion or 7 years for legal compliance',
      bookings: '7 years for accounting and legal purposes',
      preferences: 'Until account deletion or withdrawal of consent',
      communications: '2 years for customer service purposes',
      usage_analytics: '26 months for analytics purposes',
      billing: '7 years for accounting and tax purposes',
      support_tickets: '3 years for quality assurance',
      security_logs: '1 year for security monitoring',
    };
  }
}

export const gdprCompliance = GDPRCompliance.getInstance();