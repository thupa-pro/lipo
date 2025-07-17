import { createClient } from "@/lib/supabase/server";
import {
  OnboardingProgress,
  OnboardingStep,
  ConsumerProfile,
  ProviderProfile,
} from "./types";

// Server-side utilities
export async function getOnboardingProgress(
  userId: string,
): Promise<OnboardingProgress | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_onboarding")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as OnboardingProgress;
}

export async function initializeOnboarding(
  userId: string,
  role: "consumer" | "provider",
): Promise<OnboardingProgress | null> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("initialize_onboarding", {
    p_user_id: userId,
    p_role: role,
  });

  if (error) {
    console.error("Error initializing onboarding:", error);
    return null;
  }

  return getOnboardingProgress(userId);
}

export async function updateOnboardingProgress(
  userId: string,
  step: OnboardingStep,
  data?: Record<string, any>,
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.rpc("update_onboarding_progress", {
    p_user_id: userId,
    p_step: step,
    p_data: data || {},
  });

  return !error;
}

export async function getConsumerProfile(
  userId: string,
): Promise<ConsumerProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("consumer_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as ConsumerProfile;
}

export async function getProviderProfile(
  userId: string,
): Promise<ProviderProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("provider_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as ProviderProfile;
}

export async function saveConsumerProfile(
  userId: string,
  profile: Partial<ConsumerProfile>,
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from("consumer_profiles").upsert({
    user_id: userId,
    ...profile,
    updated_at: new Date().toISOString(),
  });

  return !error;
}

export async function saveProviderProfile(
  userId: string,
  profile: Partial<ProviderProfile>,
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from("provider_profiles").upsert({
    user_id: userId,
    ...profile,
    updated_at: new Date().toISOString(),
  });

  return !error;
}
