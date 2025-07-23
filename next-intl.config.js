import { getRequestConfig } from "next-intl/server";

// Supported locales - matches the middleware.ts file
export const locales = [
  "en", "zh", "hi", "es", "ar", "pt", "bn", "ru", "ja", "pa", "de", "ur", "ko", "fr", "tr", "it", "th", "fa", "pl", "nl", "uk", "vi", "he", "sw", "ro", "el", "cs", "hu", "fi", "da", "no", "sv", "id", "ms", "tl", "zh-TW", "am", "mg"
];

export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  // Validate the locale parameter
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  try {
    return {
      messages: (await import(`./messages/${locale}.json`)).default,
      timeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "America/New_York",
      now: new Date()
    };
  } catch (error) {
    console.warn(`Failed to load messages for locale '${locale}', falling back to '${defaultLocale}'`);
    // Fallback to English if locale file doesn't exist
    return {
      messages: (await import(`./messages/en.json`)).default,
      timeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "America/New_York",
      now: new Date()
    };
  }
});
