import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Supported locales - matches the config.ts file
export const locales = [
  "en", "zh", "hi", "es", "ar", "pt", "bn", "ru", "ja", "pa", "de", "ur", "ko", "fr", "tr", "it", "th", "fa", "pl", "nl", "uk", "vi", "he", "sw", "ro", "el", "cs", "hu", "fi", "da", "no", "sv", "id", "ms", "tl", "zh-TW", "am", "mg"
];

export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  // Handle undefined locale
  if (!locale) {
    locale = 'en';
  }

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    // Use fallback locale instead of notFound() to prevent error
    locale = 'en';
  }

  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default,
      timeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "America/New_York",
      now: new Date()
    };
  } catch (error) {
    // Fallback to English if locale file doesn't exist
    return {
      locale: 'en',
      messages: (await import(`./messages/en.json`)).default,
      timeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "America/New_York",
      now: new Date()
    };
  }
});
