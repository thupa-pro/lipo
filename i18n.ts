import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // Use fallback locale instead of notFound() to prevent error
    locale = 'en';
  }

  try {
    return {
      messages: (await import(`./messages/${locale}.json`)).default,
      timeZone: 'UTC',
      now: new Date()
    };
  } catch (error) {
    // Fallback to English if locale file doesn't exist
    return {
      messages: (await import(`./messages/en.json`)).default,
      timeZone: 'UTC',
      now: new Date()
    };
  }
});