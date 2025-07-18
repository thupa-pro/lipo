"use client";

import { useState, useEffect } from "react";

export interface ReferralData {
  referralCode: string;
  referredUsers: number;
  earnings: number;
  pendingRewards: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export interface ReferralClient {
  data: ReferralData | null;
  loading: boolean;
  error: string | null;
  generateCode: () => Promise<void>;
  trackReferral: (code: string) => Promise<void>;
  claimRewards: () => Promise<void>;
}

export function useReferralClient(): ReferralClient {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data loading
    const loadReferralData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData({
          referralCode: "LOCON2025-ABC123",
          referredUsers: 12,
          earnings: 245.50,
          pendingRewards: 45.20,
          tier: "silver"
        });
      } catch (err) {
        setError("Failed to load referral data");
      } finally {
        setLoading(false);
      }
    };

    loadReferralData();
  }, []);

  const generateCode = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCode = `LOCON2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setData(prev => prev ? { ...prev, referralCode: newCode } : null);
    } catch (err) {
      setError("Failed to generate new code");
    } finally {
      setLoading(false);
    }
  };

  const trackReferral = async (code: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(prev => prev ? { 
        ...prev, 
        referredUsers: prev.referredUsers + 1,
        earnings: prev.earnings + 15.00,
        pendingRewards: prev.pendingRewards + 15.00
      } : null);
    } catch (err) {
      setError("Failed to track referral");
    } finally {
      setLoading(false);
    }
  };

  const claimRewards = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(prev => prev ? { 
        ...prev, 
        pendingRewards: 0
      } : null);
    } catch (err) {
      setError("Failed to claim rewards");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    generateCode,
    trackReferral,
    claimRewards,
  };
}
