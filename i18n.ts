import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];

export default getRequestConfig(async ({ locale }) => {
  // Handle undefined locale
  if (!locale) {
    locale = 'en';
  }

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.warn(`Invalid locale "${locale}", using default "en"`);
    locale = 'en';
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      locale,
      messages,
      timeZone: 'UTC',
      now: new Date()
    };
  } catch (error) {
    console.error(`Error loading messages for locale "${locale}":`, error);
    // Fallback to English
    try {
      const fallbackMessages = (await import(`./messages/en.json`)).default;
      return {
        messages: fallbackMessages,
        timeZone: 'UTC',
        now: new Date()
      };
    } catch (fallbackError) {
      console.error('Error loading fallback messages:', fallbackError);
      // Return minimal config if all fails
      return {
        messages: {},
        timeZone: 'UTC',
        now: new Date()
      };
    }
  }
});
