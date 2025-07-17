import { createClient } from "@/lib/supabase/client";
import {
  OnboardingProgress,
  OnboardingStep,
  ConsumerProfile,
  ProviderProfile,
} from "./types";

// Client-side utilities hook
export function useOnboardingClient() {
  const supabase = createClient();

  return {
    async getProgress(userId: string): Promise<OnboardingProgress | null> {
      const { data, error } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) return null;
      return data as OnboardingProgress;
    },

    async updateProgress(
      userId: string,
      step: OnboardingStep,
      data?: Record<string, any>,
    ): Promise<boolean> {
      const { error } = await supabase.rpc("update_onboarding_progress", {
        p_user_id: userId,
        p_step: step,
        p_data: data || {},
      });

      return !error;
    },

    async saveConsumerProfile(
      userId: string,
      profile: Partial<ConsumerProfile>,
    ): Promise<boolean> {
      const { error } = await supabase.from("consumer_profiles").upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });

      return !error;
    },

    async saveProviderProfile(
      userId: string,
      profile: Partial<ProviderProfile>,
    ): Promise<boolean> {
      const { error } = await supabase.from("provider_profiles").upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });

      return !error;
    },
  };
}
