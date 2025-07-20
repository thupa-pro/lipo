import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Supported locales - matches the config.ts file
export const locales = [
  "en", "zh", "hi", "es", "ar", "pt", "bn", "ru", "ja", "pa", "de", "ur", "ko", "fr", "tr", "it", "th", "fa", "pl", "nl", "uk", "vi", "he", "sw", "ro", "el", "cs", "hu", "fi", "da", "no", "sv", "id", "ms", "tl", "zh-TW", "am", "mg"
];

export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "America/New_York",
  };
});
