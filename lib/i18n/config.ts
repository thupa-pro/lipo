import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Expanded locales to support top 50 metropolitan cities worldwide
export const locales = [
  "en", // English - New York, London, Los Angeles, Chicago, etc.
  "zh", // Chinese (Mandarin) - Beijing, Shanghai, Guangzhou, Shenzhen, Tianjin
  "hi", // Hindi - Delhi, Mumbai
  "es", // Spanish - Mexico City, Madrid, Barcelona, Buenos Aires, Lima
  "ar", // Arabic - Cairo, Riyadh, Dubai, Baghdad
  "pt", // Portuguese - São Paulo, Rio de Janeiro, Lisbon
  "bn", // Bengali - Dhaka, Kolkata
  "ru", // Russian - Moscow, Saint Petersburg, Istanbul (partial)
  "ja", // Japanese - Tokyo, Osaka, Yokohama
  "pa", // Punjabi - Lahore
  "de", // German - Berlin, Hamburg, Munich, Vienna
  "ur", // Urdu - Karachi
  "ko", // Korean - Seoul, Busan
  "fr", // French - Paris, Lyon, Kinshasa, Algiers
  "tr", // Turkish - Istanbul, Ankara
  "it", // Italian - Rome, Milan, Naples
  "th", // Thai - Bangkok
  "fa", // Persian - Tehran
  "pl", // Polish - Warsaw, Krakow
  "nl", // Dutch - Amsterdam
  "uk", // Ukrainian - Kyiv
  "vi", // Vietnamese - Ho Chi Minh City, Hanoi
  "he", // Hebrew - Tel Aviv
  "sw", // Swahili - Nairobi
  "ro", // Romanian - Bucharest
  "el", // Greek - Athens
  "cs", // Czech - Prague
  "hu", // Hungarian - Budapest
  "fi", // Finnish - Helsinki
  "da", // Danish - Copenhagen
  "no", // Norwegian - Oslo
  "sv", // Swedish - Stockholm
  "id", // Indonesian - Jakarta
  "ms", // Malay - Kuala Lumpur
  "tl", // Filipino/Tagalog - Manila
  "zh-TW", // Traditional Chinese - Taipei
] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "America/New_York",
  };
});

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文 (简体)",
  hi: "हिन्दी",
  es: "Español",
  ar: "العربية",
  pt: "Português",
  bn: "বাংলা",
  ru: "Русский",
  ja: "日本語",
  pa: "ਪੰਜਾਬੀ",
  de: "Deutsch",
  ur: "اردو",
  ko: "한국어",
  fr: "Français",
  tr: "Türkçe",
  it: "Italiano",
  th: "ไทย",
  fa: "فارسی",
  pl: "Polski",
  nl: "Nederlands",
  uk: "Українська",
  vi: "Tiếng Việt",
  he: "עברית",
  sw: "Kiswahili",
  ro: "Română",
  el: "Ελληνικά",
  cs: "Čeština",
  hu: "Magyar",
  fi: "Suomi",
  da: "Dansk",
  no: "Norsk",
  sv: "Svenska",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  tl: "Filipino",
  "zh-TW": "中文 (繁體)",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  zh: "🇨🇳",
  hi: "🇮🇳",
  es: "🇪🇸",
  ar: "🇸🇦",
  pt: "🇧🇷",
  bn: "🇧🇩",
  ru: "🇷🇺",
  ja: "🇯🇵",
  pa: "🇵🇰",
  de: "🇩🇪",
  ur: "🇵🇰",
  ko: "🇰🇷",
  fr: "🇫🇷",
  tr: "🇹🇷",
  it: "🇮🇹",
  th: "🇹🇭",
  fa: "🇮🇷",
  pl: "🇵🇱",
  nl: "🇳🇱",
  uk: "🇺🇦",
  vi: "🇻🇳",
  he: "🇮🇱",
  sw: "🇰🇪",
  ro: "🇷🇴",
  el: "🇬🇷",
  cs: "🇨🇿",
  hu: "🇭🇺",
  fi: "🇫🇮",
  da: "🇩🇰",
  no: "🇳🇴",
  sv: "🇸🇪",
  id: "🇮🇩",
  ms: "🇲🇾",
  tl: "🇵🇭",
  "zh-TW": "🇹🇼",
};
