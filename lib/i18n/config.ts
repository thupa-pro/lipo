import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Expanded locales to support 70+ metropolitan cities worldwide (one language per country)
export const locales = [
  "en", // English - New York, London, Los Angeles, Chicago, Toronto, Sydney, Lagos, Johannesburg, Accra
  "zh", // Chinese (Mandarin) - Beijing, Shanghai, Guangzhou, Shenzhen, Tianjin
  "hi", // Hindi - Delhi, Mumbai
  "es", // Spanish - Mexico City, Madrid, Barcelona, Buenos Aires, Lima, Bogotá
  "ar", // Arabic - Cairo, Riyadh, Dubai, Baghdad, Casablanca, Tunis, Khartoum, Alexandria
  "pt", // Portuguese - São Paulo, Rio de Janeiro, Lisbon, Luanda
  "bn", // Bengali - Dhaka, Kolkata
  "ru", // Russian - Moscow, Saint Petersburg
  "ja", // Japanese - Tokyo, Osaka, Yokohama
  "pa", // Punjabi - Lahore
  "de", // German - Berlin, Hamburg, Munich, Vienna, Zurich
  "ur", // Urdu - Karachi
  "ko", // Korean - Seoul, Busan
  "fr", // French - Paris, Lyon, Kinshasa, Algiers, Abidjan, Montreal
  "tr", // Turkish - Istanbul, Ankara
  "it", // Italian - Rome, Milan, Naples
  "th", // Thai - Bangkok
  "fa", // Persian - Tehran
  "pl", // Polish - Warsaw, Krakow
  "nl", // Dutch - Amsterdam
  "uk", // Ukrainian - Kyiv
  "vi", // Vietnamese - Ho Chi Minh City, Hanoi
  "he", // Hebrew - Tel Aviv
  "sw", // Swahili - Nairobi, Dar es Salaam
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
  "am", // Amharic - Addis Ababa
  "mg", // Malagasy - Antananarivo
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
  bn: "বাংল���",
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
  am: "አማርኛ",
  mg: "Malagasy",
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
  am: "🇪🇹",
  mg: "🇲🇬",
};

// Top 70+ Metropolitan Cities with their preferred languages and regions
export const metropolitanCities = {
  // Asia-Pacific
  tokyo: {
    locale: "ja",
    region: "Asia/Tokyo",
    country: "Japan",
    population: 37400000,
  },
  delhi: {
    locale: "hi",
    region: "Asia/Kolkata",
    country: "India",
    population: 32900000,
  },
  shanghai: {
    locale: "zh",
    region: "Asia/Shanghai",
    country: "China",
    population: 28500000,
  },
  dhaka: {
    locale: "bn",
    region: "Asia/Dhaka",
    country: "Bangladesh",
    population: 22600000,
  },
  beijing: {
    locale: "zh",
    region: "Asia/Shanghai",
    country: "China",
    population: 21700000,
  },
  mumbai: {
    locale: "hi",
    region: "Asia/Kolkata",
    country: "India",
    population: 20700000,
  },
  osaka: {
    locale: "ja",
    region: "Asia/Tokyo",
    country: "Japan",
    population: 19000000,
  },
  karachi: {
    locale: "ur",
    region: "Asia/Karachi",
    country: "Pakistan",
    population: 16100000,
  },
  chongqing: {
    locale: "zh",
    region: "Asia/Shanghai",
    country: "China",
    population: 16000000,
  },
  guangzhou: {
    locale: "zh",
    region: "Asia/Shanghai",
    country: "China",
    population: 15300000,
  },
  tianjin: {
    locale: "zh",
    region: "Asia/Shanghai",
    country: "China",
    population: 14100000,
  },
  shenzhen: {
    locale: "zh",
    region: "Asia/Shanghai",
    country: "China",
    population: 13400000,
  },
  kolkata: {
    locale: "bn",
    region: "Asia/Kolkata",
    country: "India",
    population: 13200000,
  },
  lahore: {
    locale: "pa",
    region: "Asia/Karachi",
    country: "Pakistan",
    population: 13100000,
  },
  seoul: {
    locale: "ko",
    region: "Asia/Seoul",
    country: "South Korea",
    population: 9900000,
  },
  bangkok: {
    locale: "th",
    region: "Asia/Bangkok",
    country: "Thailand",
    population: 10700000,
  },
  jakarta: {
    locale: "id",
    region: "Asia/Jakarta",
    country: "Indonesia",
    population: 10600000,
  },
  manila: {
    locale: "tl",
    region: "Asia/Manila",
    country: "Philippines",
    population: 13900000,
  },
  ho_chi_minh_city: {
    locale: "vi",
    region: "Asia/Ho_Chi_Minh",
    country: "Vietnam",
    population: 9000000,
  },
  kuala_lumpur: {
    locale: "ms",
    region: "Asia/Kuala_Lumpur",
    country: "Malaysia",
    population: 8000000,
  },
  taipei: {
    locale: "zh-TW",
    region: "Asia/Taipei",
    country: "Taiwan",
    population: 2700000,
  },

  // Americas
  new_york: {
    locale: "en",
    region: "America/New_York",
    country: "USA",
    population: 18800000,
  },
  mexico_city: {
    locale: "es",
    region: "America/Mexico_City",
    country: "Mexico",
    population: 21600000,
  },
  sao_paulo: {
    locale: "pt",
    region: "America/Sao_Paulo",
    country: "Brazil",
    population: 22400000,
  },
  los_angeles: {
    locale: "en",
    region: "America/Los_Angeles",
    country: "USA",
    population: 12400000,
  },
  rio_de_janeiro: {
    locale: "pt",
    region: "America/Sao_Paulo",
    country: "Brazil",
    population: 13600000,
  },
  chicago: {
    locale: "en",
    region: "America/Chicago",
    country: "USA",
    population: 8900000,
  },
  lima: {
    locale: "es",
    region: "America/Lima",
    country: "Peru",
    population: 10900000,
  },
  buenos_aires: {
    locale: "es",
    region: "America/Argentina/Buenos_Aires",
    country: "Argentina",
    population: 15200000,
  },

  // Europe
  london: {
    locale: "en",
    region: "Europe/London",
    country: "UK",
    population: 9600000,
  },
  moscow: {
    locale: "ru",
    region: "Europe/Moscow",
    country: "Russia",
    population: 12600000,
  },
  istanbul: {
    locale: "tr",
    region: "Europe/Istanbul",
    country: "Turkey",
    population: 15800000,
  },
  paris: {
    locale: "fr",
    region: "Europe/Paris",
    country: "France",
    population: 11000000,
  },
  berlin: {
    locale: "de",
    region: "Europe/Berlin",
    country: "Germany",
    population: 3700000,
  },
  madrid: {
    locale: "es",
    region: "Europe/Madrid",
    country: "Spain",
    population: 6700000,
  },
  rome: {
    locale: "it",
    region: "Europe/Rome",
    country: "Italy",
    population: 4300000,
  },
  barcelona: {
    locale: "es",
    region: "Europe/Madrid",
    country: "Spain",
    population: 5600000,
  },
  milan: {
    locale: "it",
    region: "Europe/Rome",
    country: "Italy",
    population: 3200000,
  },
  naples: {
    locale: "it",
    region: "Europe/Rome",
    country: "Italy",
    population: 2200000,
  },
  kiev: {
    locale: "uk",
    region: "Europe/Kiev",
    country: "Ukraine",
    population: 2900000,
  },
  saint_petersburg: {
    locale: "ru",
    region: "Europe/Moscow",
    country: "Russia",
    population: 5400000,
  },
  warsaw: {
    locale: "pl",
    region: "Europe/Warsaw",
    country: "Poland",
    population: 1800000,
  },
  amsterdam: {
    locale: "nl",
    region: "Europe/Amsterdam",
    country: "Netherlands",
    population: 1100000,
  },
  vienna: {
    locale: "de",
    region: "Europe/Vienna",
    country: "Austria",
    population: 1900000,
  },
  athens: {
    locale: "el",
    region: "Europe/Athens",
    country: "Greece",
    population: 3200000,
  },
  budapest: {
    locale: "hu",
    region: "Europe/Budapest",
    country: "Hungary",
    population: 1800000,
  },
  prague: {
    locale: "cs",
    region: "Europe/Prague",
    country: "Czech Republic",
    population: 1300000,
  },
  stockholm: {
    locale: "sv",
    region: "Europe/Stockholm",
    country: "Sweden",
    population: 1000000,
  },
  copenhagen: {
    locale: "da",
    region: "Europe/Copenhagen",
    country: "Denmark",
    population: 1400000,
  },
  oslo: {
    locale: "no",
    region: "Europe/Oslo",
    country: "Norway",
    population: 700000,
  },
  helsinki: {
    locale: "fi",
    region: "Europe/Helsinki",
    country: "Finland",
    population: 650000,
  },
  bucharest: {
    locale: "ro",
    region: "Europe/Bucharest",
    country: "Romania",
    population: 1900000,
  },

  // Middle East & Africa
  cairo: {
    locale: "ar",
    region: "Africa/Cairo",
    country: "Egypt",
    population: 20900000,
  },
  tehran: {
    locale: "fa",
    region: "Asia/Tehran",
    country: "Iran",
    population: 9500000,
  },
  baghdad: {
    locale: "ar",
    region: "Asia/Baghdad",
    country: "Iraq",
    population: 7000000,
  },
  riyadh: {
    locale: "ar",
    region: "Asia/Riyadh",
    country: "Saudi Arabia",
    population: 7000000,
  },
  dubai: {
    locale: "ar",
    region: "Asia/Dubai",
    country: "UAE",
    population: 3400000,
  },
  tel_aviv: {
    locale: "he",
    region: "Asia/Jerusalem",
    country: "Israel",
    population: 1300000,
  },
  nairobi: {
    locale: "sw",
    region: "Africa/Nairobi",
    country: "Kenya",
    population: 4900000,
  },
  kinshasa: {
    locale: "fr",
    region: "Africa/Kinshasa",
    country: "DR Congo",
    population: 15600000,
  },
  algiers: {
    locale: "ar",
    region: "Africa/Algiers",
    country: "Algeria",
    population: 2700000,
  },
  lisbon: {
    locale: "pt",
    region: "Europe/Lisbon",
    country: "Portugal",
    population: 2900000,
  },

  // Additional African Cities
  lagos: {
    locale: "en",
    region: "Africa/Lagos",
    country: "Nigeria",
    population: 15300000,
  },
  johannesburg: {
    locale: "en",
    region: "Africa/Johannesburg",
    country: "South Africa",
    population: 4400000,
  },
  khartoum: {
    locale: "ar",
    region: "Africa/Khartoum",
    country: "Sudan",
    population: 5200000,
  },
  luanda: {
    locale: "pt",
    region: "Africa/Luanda",
    country: "Angola",
    population: 8300000,
  },
  dar_es_salaam: {
    locale: "sw",
    region: "Africa/Dar_es_Salaam",
    country: "Tanzania",
    population: 6700000,
  },
  addis_ababa: {
    locale: "am",
    region: "Africa/Addis_Ababa",
    country: "Ethiopia",
    population: 4800000,
  },
  casablanca: {
    locale: "ar",
    region: "Africa/Casablanca",
    country: "Morocco",
    population: 3700000,
  },
  cape_town: {
    locale: "en",
    region: "Africa/Johannesburg",
    country: "South Africa",
    population: 4600000,
  },
  kano: {
    locale: "en",
    region: "Africa/Lagos",
    country: "Nigeria",
    population: 3600000,
  },
  ibadan: {
    locale: "en",
    region: "Africa/Lagos",
    country: "Nigeria",
    population: 3200000,
  },
  abidjan: {
    locale: "fr",
    region: "Africa/Abidjan",
    country: "Ivory Coast",
    population: 4400000,
  },
  alexandria: {
    locale: "ar",
    region: "Africa/Cairo",
    country: "Egypt",
    population: 5200000,
  },
  durban: {
    locale: "en",
    region: "Africa/Johannesburg",
    country: "South Africa",
    population: 3500000,
  },
  accra: {
    locale: "en",
    region: "Africa/Accra",
    country: "Ghana",
    population: 2300000,
  },
  antananarivo: {
    locale: "mg",
    region: "Indian/Antananarivo",
    country: "Madagascar",
    population: 3100000,
  },
  tunis: {
    locale: "ar",
    region: "Africa/Tunis",
    country: "Tunisia",
    population: 2300000,
  },

  // Additional Cities from Other Continents
  toronto: {
    locale: "en",
    region: "America/Toronto",
    country: "Canada",
    population: 6200000,
  },
  montreal: {
    locale: "fr",
    region: "America/Montreal",
    country: "Canada",
    population: 4100000,
  },
  sydney: {
    locale: "en",
    region: "Australia/Sydney",
    country: "Australia",
    population: 5300000,
  },
  melbourne: {
    locale: "en",
    region: "Australia/Melbourne",
    country: "Australia",
    population: 5000000,
  },
  bogota: {
    locale: "es",
    region: "America/Bogota",
    country: "Colombia",
    population: 10700000,
  },
  santiago: {
    locale: "es",
    region: "America/Santiago",
    country: "Chile",
    population: 6700000,
  },
  caracas: {
    locale: "es",
    region: "America/Caracas",
    country: "Venezuela",
    population: 2900000,
  },
  zurich: {
    locale: "de",
    region: "Europe/Zurich",
    country: "Switzerland",
    population: 1400000,
  },
  hanoi: {
    locale: "vi",
    region: "Asia/Ho_Chi_Minh",
    country: "Vietnam",
    population: 8100000,
  },
  busan: {
    locale: "ko",
    region: "Asia/Seoul",
    country: "South Korea",
    population: 3400000,
  },
  yokohama: {
    locale: "ja",
    region: "Asia/Tokyo",
    country: "Japan",
    population: 3700000,
  },
  ankara: {
    locale: "tr",
    region: "Europe/Istanbul",
    country: "Turkey",
    population: 5600000,
  },
} as const;

// Language direction for RTL languages
export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  zh: "ltr",
  hi: "ltr",
  es: "ltr",
  pt: "ltr",
  bn: "ltr",
  ru: "ltr",
  ja: "ltr",
  pa: "ltr",
  de: "ltr",
  ko: "ltr",
  fr: "ltr",
  tr: "ltr",
  it: "ltr",
  th: "ltr",
  pl: "ltr",
  nl: "ltr",
  uk: "ltr",
  vi: "ltr",
  sw: "ltr",
  ro: "ltr",
  el: "ltr",
  cs: "ltr",
  hu: "ltr",
  fi: "ltr",
  da: "ltr",
  no: "ltr",
  sv: "ltr",
  id: "ltr",
  ms: "ltr",
  tl: "ltr",
  "zh-TW": "ltr",
  am: "ltr",
  mg: "ltr",
  // RTL languages
  ar: "rtl",
  ur: "rtl",
  fa: "rtl",
  he: "rtl",
};

// Helper function to get city data
export function getCityData(cityKey: string) {
  return metropolitanCities[cityKey as keyof typeof metropolitanCities];
}

// Helper function to detect locale from city
export function getLocaleFromCity(cityKey: string): Locale {
  const cityData = getCityData(cityKey);
  return cityData?.locale || defaultLocale;
}

// Helper function to get timezone from city
export function getTimezoneFromCity(cityKey: string): string {
  const cityData = getCityData(cityKey);
  return cityData?.region || "UTC";
}
