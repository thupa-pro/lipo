import { createClient } from "@/lib/supabase/client";
import type {
  ReferralStats,
  ReferralHistory,
  ReferralCode,
  ReferralLeaderboard,
  ReferralAnalytics,
  CreateReferralCodeForm,
  ReferralApiResponse,
  PaginatedReferralResponse,
  AffiliateStats,
  AffiliateCommission,
  ReferralProgram,
  ReferralCampaign,
  ReferralTier,
  UserReferralTier,
  SocialShareTemplate,
  ReferralSource,
} from "./types";
import { useState, useEffect } from 'react';

export interface ReferralCode {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  currentUses: number;
  expiresAt?: Date;
  isActive: boolean;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
}

export function useReferralClient() {
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    totalEarnings: 0,
    pendingReferrals: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const generateReferralCode = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCode: ReferralCode = {
        id: Math.random().toString(36).substr(2, 9),
        code: `REF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        discount: 10,
        maxUses: 100,
        currentUses: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      };
      
      setReferralCode(newCode);
      return newCode;
    } catch (error) {
      console.error('Failed to generate referral code:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getReferralStats = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockStats: ReferralStats = {
        totalReferrals: 25,
        successfulReferrals: 18,
        totalEarnings: 450,
        pendingReferrals: 7,
      };
      
      setStats(mockStats);
      return mockStats;
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const shareReferralCode = async (platform: string) => {
    if (!referralCode) return;
    
    const shareText = `Join Loconomy using my referral code ${referralCode.code} and get ${referralCode.discount}% off your first service!`;
    const shareUrl = `https://loconomy.com/ref/${referralCode.code}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'copy':
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        break;
      default:
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }
  };

  useEffect(() => {
    getReferralStats();
  }, []);

  return {
    referralCode,
    stats,
    isLoading,
    generateReferralCode,
    getReferralStats,
    shareReferralCode,
  };
}

export function validateReferralCode(code: string): boolean {
  return /^[A-Z0-9]{6,12}$/.test(code);
}

export function calculateReferralReward(baseAmount: number, discountPercentage: number): number {
  return (baseAmount * discountPercentage) / 100;
}

export class ReferralClient {
  private supabase = createClient();

  // Referral Stats
  async getReferralStats(
    userId: string,
  ): Promise<ReferralApiResponse<ReferralStats>> {
    try {
      const { data, error } = await this.supabase.rpc("get_referral_stats", {
        user_id: userId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch referral stats",
      };
    }
  }

  // Referral History
  async getReferralHistory(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<ReferralApiResponse<PaginatedReferralResponse<ReferralHistory>>> {
    try {
      const { data, error } = await this.supabase.rpc("get_referral_history", {
        user_id: userId,
        page_size: limit,
        page_number: page,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching referral history:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch referral history",
      };
    }
  }

  // Referral Codes
  async getUserReferralCode(
    userId: string,
  ): Promise<ReferralApiResponse<ReferralCode>> {
    try {
      const { data, error } = await this.supabase
        .from("referral_codes")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      if (error) {
        // If no code exists, create one
        if (error.code === "PGRST116") {
          return await this.createReferralCode(userId);
        }
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching user referral code:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch referral code",
      };
    }
  }

  async createReferralCode(
    userId: string,
    form?: CreateReferralCodeForm,
  ): Promise<ReferralApiResponse<ReferralCode>> {
    try {
      const { data, error } = await this.supabase.rpc("create_referral_code", {
        user_id: userId,
        custom_code: form?.custom_code,
        max_uses: form?.max_uses,
        expires_at: form?.expires_at,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error creating referral code:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create referral code",
      };
    }
  }

  async validateReferralCode(
    code: string,
  ): Promise<ReferralApiResponse<boolean>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "validate_referral_code",
        { referral_code: code },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error validating referral code:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to validate referral code",
      };
    }
  }

  // Referral Process
  async processReferral(
    referralCode: string,
    referredUserId: string,
    source: ReferralSource = "direct_link",
  ): Promise<ReferralApiResponse<ReferralHistory>> {
    try {
      const { data, error } = await this.supabase.rpc("process_referral", {
        referral_code: referralCode,
        referred_user_id: referredUserId,
        referral_source: source,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error processing referral:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process referral",
      };
    }
  }

  async completeReferral(
    referralId: string,
    bookingId: string,
  ): Promise<ReferralApiResponse<boolean>> {
    try {
      const { data, error } = await this.supabase.rpc("complete_referral", {
        referral_id: referralId,
        booking_id: bookingId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error completing referral:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete referral",
      };
    }
  }

  // Leaderboard
  async getReferralLeaderboard(
    period: "monthly" | "quarterly" | "yearly" | "all_time" = "monthly",
    limit = 10,
  ): Promise<ReferralApiResponse<ReferralLeaderboard[]>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_referral_leaderboard",
        {
          period_type: period,
          limit_count: limit,
        },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching referral leaderboard:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch leaderboard",
      };
    }
  }

  // Analytics
  async getReferralAnalytics(
    period: string = "last_30_days",
  ): Promise<ReferralApiResponse<ReferralAnalytics>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_referral_analytics",
        { period_type: period },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching referral analytics:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch analytics",
      };
    }
  }

  // Affiliate System
  async getAffiliateStats(
    userId: string,
  ): Promise<ReferralApiResponse<AffiliateStats>> {
    try {
      const { data, error } = await this.supabase.rpc("get_affiliate_stats", {
        user_id: userId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch affiliate stats",
      };
    }
  }

  async getAffiliateCommissions(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<
    ReferralApiResponse<PaginatedReferralResponse<AffiliateCommission>>
  > {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_affiliate_commissions",
        {
          user_id: userId,
          page_size: limit,
          page_number: page,
        },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching affiliate commissions:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch commissions",
      };
    }
  }

  // Referral Programs
  async getActiveReferralPrograms(): Promise<
    ReferralApiResponse<ReferralProgram[]>
  > {
    try {
      const { data, error } = await this.supabase
        .from("referral_programs")
        .select("*")
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching referral programs:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch programs",
      };
    }
  }

  // Referral Tiers
  async getUserReferralTier(
    userId: string,
  ): Promise<ReferralApiResponse<UserReferralTier>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_user_referral_tier",
        { user_id: userId },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching user referral tier:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch tier",
      };
    }
  }

  async getReferralTiers(): Promise<ReferralApiResponse<ReferralTier[]>> {
    try {
      const { data, error } = await this.supabase
        .from("referral_tiers")
        .select("*")
        .order("min_referrals", { ascending: true });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching referral tiers:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch tiers",
      };
    }
  }

  // Campaigns
  async getActiveCampaigns(): Promise<ReferralApiResponse<ReferralCampaign[]>> {
    try {
      const { data, error } = await this.supabase
        .from("referral_campaigns")
        .select("*")
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch campaigns",
      };
    }
  }

  // Social Sharing
  async getSocialShareTemplates(): Promise<
    ReferralApiResponse<SocialShareTemplate[]>
  > {
    try {
      const { data, error } = await this.supabase
        .from("social_share_templates")
        .select("*")
        .order("platform");

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching share templates:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch templates",
      };
    }
  }

  // Utility Functions
  generateReferralLink(code: string, baseUrl?: string): string {
    const base = baseUrl || window.location.origin;
    return `${base}/signup?ref=${code}`;
  }

  generateSocialShareUrls(referralLink: string, userName: string) {
    const encodedLink = encodeURIComponent(referralLink);
    const encodedText = encodeURIComponent(
      `Join me on Loconomy and we'll both get $10! Use my referral link:`,
    );

    return {
      email: `mailto:?subject=Join me on Loconomy&body=${encodedText} ${encodedLink}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
      whatsapp: `https://wa.me/?text=${encodedText} ${encodedLink}`,
      sms: `sms:?body=${encodedText} ${encodedLink}`,
    };
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }

  formatCurrency(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  }

  calculateConversionRate(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100 * 100) / 100;
  }

  generateQRCode(text: string): string {
    // Using a QR code service - in production, you might want to use a local library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  }
}

export const referralClient = new ReferralClient();
