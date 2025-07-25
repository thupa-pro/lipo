import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Enhanced locales with regional variants and cultural adaptations
export const enhancedLocales = [
  // Enhanced Asian Languages with Regional Variants
  "en-US", "en-GB", "en-AU", "en-CA", "en-NZ", "en-SG", "en-IN", "en-ZA",
  "zh-CN", "zh-TW", "zh-HK", "zh-SG",
  "hi-IN", "hi-FJ",
  "es-ES", "es-MX", "es-AR", "es-CL", "es-PE", "es-CO", "es-VE", "es-UY",
  "ar-SA", "ar-EG", "ar-AE", "ar-MA", "ar-TN", "ar-JO", "ar-LB", "ar-IQ",
  "pt-BR", "pt-PT", "pt-AO", "pt-MZ",
  "bn-BD", "bn-IN",
  "ru-RU", "ru-BY", "ru-KZ", "ru-KG", "ru-UA",
  "ja-JP",
  "pa-IN", "pa-PK",
  "de-DE", "de-AT", "de-CH",
  "ur-PK", "ur-IN",
  "ko-KR", "ko-KP",
  "fr-FR", "fr-CA", "fr-BE", "fr-CH", "fr-DZ", "fr-MA", "fr-SN", "fr-CI",
  "tr-TR", "tr-CY",
  "it-IT", "it-CH", "it-SM",
  "th-TH",
  "fa-IR", "fa-AF", "fa-TJ",
  "pl-PL",
  "nl-NL", "nl-BE", "nl-SR",
  "uk-UA",
  "vi-VN",
  "he-IL",
  "sw-KE", "sw-TZ", "sw-UG",
  "ro-RO", "ro-MD",
  "el-GR", "el-CY",
  "cs-CZ",
  "hu-HU",
  "fi-FI",
  "da-DK",
  "no-NO",
  "sv-SE", "sv-FI",
  "id-ID",
  "ms-MY", "ms-BN", "ms-SG",
  "tl-PH",
  "am-ET",
  "mg-MG",
  "yo-NG", "yo-BJ",
  "ha-NG", "ha-NE",
  "ig-NG",
  "zu-ZA",
  "af-ZA", "af-NA",
  "xh-ZA",
  "bg-BG",
  "hr-HR", "hr-BA",
  "sr-RS", "sr-BA", "sr-ME",
  "sk-SK",
  "sl-SI",
  "lv-LV",
  "lt-LT",
  "et-EE",
  "mt-MT",
  "mk-MK",
  "sq-AL", "sq-XK", "sq-MK",
  "is-IS",
  "ga-IE",
  "cy-GB",
  "eu-ES", "eu-FR",
  "ca-ES", "ca-AD", "ca-FR",
  "gl-ES",
  "ka-GE",
  "hy-AM",
  "az-AZ",
  "kk-KZ",
  "ky-KG",
  "uz-UZ",
  "tg-TJ",
  "tk-TM",
  "mn-MN",
  "my-MM",
  "km-KH",
  "lo-LA",
  "si-LK",
  "ta-IN", "ta-LK", "ta-SG", "ta-MY",
  "te-IN",
  "kn-IN",
  "ml-IN",
  "or-IN",
  "gu-IN",
  "mr-IN",
  "ne-NP", "ne-IN",
  "dz-BT",
  "ps-AF", "ps-PK",
  "sd-PK",
  
  // Additional Regional Languages
  "be-BY", // Belarusian
  "bs-BA", // Bosnian
  "me-ME", // Montenegrin
  "la-VA", // Latin (Vatican)
  "rm-CH", // Romansh (Switzerland)
  "lb-LU", // Luxembourgish
  "fo-FO", // Faroese
  "kl-GL", // Greenlandic
  "se-NO", // Northern Sami
  "mi-NZ", // Māori
  "haw-US", // Hawaiian
  "iu-CA", // Inuktitut
  "chr-US", // Cherokee
  "nv-US", // Navajo
  
  // African Languages
  "rw-RW", // Kinyarwanda
  "rn-BI", // Kirundi
  "lg-UG", // Luganda
  "ak-GH", // Akan
  "tw-GH", // Twi
  "ff-SN", // Fulah
  "wo-SN", // Wolof
  "bm-ML", // Bambara
  "ny-MW", // Chichewa
  "sn-ZW", // Shona
  "nd-ZW", // Northern Ndebele
  "st-ZA", // Southern Sotho
  "tn-ZA", // Tswana
  "ve-ZA", // Venda
  "ts-ZA", // Tsonga
  "ss-ZA", // Swati
  "nr-ZA", // Southern Ndebele
  
  // Middle Eastern Languages
  "ku-IQ", // Kurdish
  "ckb-IQ", // Central Kurdish
  "arc-SY", // Aramaic
  "syr-SY", // Syriac
  
  // South Asian Languages
  "as-IN", // Assamese
  "ks-IN", // Kashmiri
  "sa-IN", // Sanskrit
  "pi-IN", // Pali
  "mai-IN", // Maithili
  "bh-IN", // Bihari
  "new-NP", // Newari
  "dv-MV", // Dhivehi
  
  // Southeast Asian Languages
  "jv-ID", // Javanese
  "su-ID", // Sundanese
  "min-ID", // Minangkabau
  "bug-ID", // Buginese
  "tet-TL", // Tetum
  "ceb-PH", // Cebuano
  "ilo-PH", // Ilocano
  "hil-PH", // Hiligaynon
  "war-PH", // Waray
  "pam-PH", // Kapampangan
  "bcl-PH", // Bikol
  
  // East Asian Languages
  "lzh-CN", // Literary Chinese
  "wuu-CN", // Wu Chinese
  "yue-HK", // Cantonese
  "nan-TW", // Min Nan
  "hak-TW", // Hakka
  "bo-CN", // Tibetan
  "ug-CN", // Uyghur
  "za-CN", // Zhuang
  "ii-CN", // Sichuan Yi
  
  // Pacific Languages
  "fj-FJ", // Fijian
  "to-TO", // Tongan
  "sm-WS", // Samoan
  "ty-PF", // Tahitian
  "mh-MH", // Marshallese
  "na-NR", // Nauruan
  "gil-KI", // Gilbertese
  "pon-FM", // Pohnpeian
  "kos-FM", // Kosraean
  "yap-FM", // Yapese
  "chk-FM", // Chuukese
  
  // Sign Languages
  "ase", // American Sign Language
  "bfi", // British Sign Language
  "fsl", // French Sign Language
  "gsg", // German Sign Language
  "jsl", // Japanese Sign Language
  "csl", // Chinese Sign Language
  
  // Constructed Languages
  "eo", // Esperanto
  "ia", // Interlingua
  "ie", // Interlingue
  "vo", // Volapük
  "jbo", // Lojban
  "ido", // Ido
  "nov", // Novial
  "toki-pona", // Toki Pona
] as const;

export const defaultLocale = "en-US" as const;
export type EnhancedLocale = (typeof enhancedLocales)[number];

// Cultural adaptations and formatting preferences
export const culturalSettings: Record<string, {
  dateFormat: string;
  timeFormat: "12h" | "24h";
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
  addressFormat: "western" | "eastern" | "middle-eastern" | "african";
  nameOrder: "first-last" | "last-first" | "family-given";
  phoneFormat: string;
  writingDirection: "ltr" | "rtl" | "ttb";
  formalityLevels: boolean;
  honorifics: boolean;
}> = {
  "en-US": {
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    numberFormat: { decimal: ".", thousands: ",", currency: "$" },
    addressFormat: "western",
    nameOrder: "first-last",
    phoneFormat: "(XXX) XXX-XXXX",
    writingDirection: "ltr",
    formalityLevels: false,
    honorifics: false
  },
  "ja-JP": {
    dateFormat: "YYYY年MM月DD日",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    numberFormat: { decimal: ".", thousands: ",", currency: "¥" },
    addressFormat: "eastern",
    nameOrder: "last-first",
    phoneFormat: "XXX-XXXX-XXXX",
    writingDirection: "ltr",
    formalityLevels: true,
    honorifics: true
  },
  "ar-SA": {
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 6,
    numberFormat: { decimal: "٫", thousands: "٬", currency: "ر.س" },
    addressFormat: "middle-eastern",
    nameOrder: "first-last",
    phoneFormat: "XXX XXX XXXX",
    writingDirection: "rtl",
    formalityLevels: true,
    honorifics: true
  },
  "zh-CN": {
    dateFormat: "YYYY年MM月DD日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    numberFormat: { decimal: ".", thousands: ",", currency: "¥" },
    addressFormat: "eastern",
    nameOrder: "last-first",
    phoneFormat: "XXX XXXX XXXX",
    writingDirection: "ltr",
    formalityLevels: true,
    honorifics: true
  },
  "hi-IN": {
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    numberFormat: { decimal: ".", thousands: ",", currency: "₹" },
    addressFormat: "western",
    nameOrder: "first-last",
    phoneFormat: "XXXXX XXXXX",
    writingDirection: "ltr",
    formalityLevels: true,
    honorifics: true
  }
};

// Enhanced locale names with native scripts and Latin transliterations
export const enhancedLocaleNames: Record<string, {
  native: string;
  latin?: string;
  flag: string;
  region: string;
  script: string;
  speakers: number; // in millions
}> = {
  "en-US": { native: "English (US)", flag: "🇺🇸", region: "North America", script: "Latin", speakers: 230 },
  "en-GB": { native: "English (UK)", flag: "🇬🇧", region: "Europe", script: "Latin", speakers: 60 },
  "zh-CN": { native: "中文 (简体)", latin: "Zhōngwén (Jiǎntǐ)", flag: "🇨🇳", region: "East Asia", script: "Han", speakers: 918 },
  "zh-TW": { native: "中文 (繁體)", latin: "Zhōngwén (Fántǐ)", flag: "🇹🇼", region: "East Asia", script: "Han", speakers: 23 },
  "hi-IN": { native: "हिन्दी", latin: "Hindī", flag: "🇮🇳", region: "South Asia", script: "Devanagari", speakers: 341 },
  "es-ES": { native: "Español", flag: "🇪🇸", region: "Europe", script: "Latin", speakers: 46 },
  "es-MX": { native: "Español (México)", flag: "🇲🇽", region: "North America", script: "Latin", speakers: 129 },
  "ar-SA": { native: "العربية", latin: "al-ʿArabiyyah", flag: "🇸🇦", region: "Middle East", script: "Arabic", speakers: 422 },
  "pt-BR": { native: "Português (Brasil)", flag: "🇧🇷", region: "South America", script: "Latin", speakers: 215 },
  "bn-BD": { native: "বাংলা", latin: "Bāṅlā", flag: "🇧🇩", region: "South Asia", script: "Bengali", speakers: 265 },
  "ru-RU": { native: "Русский", latin: "Russkiy", flag: "🇷🇺", region: "Europe/Asia", script: "Cyrillic", speakers: 154 },
  "ja-JP": { native: "日本語", latin: "Nihongo", flag: "🇯🇵", region: "East Asia", script: "Hiragana/Katakana/Kanji", speakers: 125 },
  "pa-IN": { native: "ਪੰਜਾਬੀ", latin: "Pañjābī", flag: "🇮🇳", region: "South Asia", script: "Gurmukhi", speakers: 113 },
  "de-DE": { native: "Deutsch", flag: "🇩🇪", region: "Europe", script: "Latin", speakers: 95 },
  "ur-PK": { native: "اردو", latin: "Urdū", flag: "🇵🇰", region: "South Asia", script: "Arabic", speakers: 70 },
  "ko-KR": { native: "한국어", latin: "Hangugeo", flag: "🇰🇷", region: "East Asia", script: "Hangul", speakers: 77 },
  "fr-FR": { native: "Français", flag: "🇫🇷", region: "Europe", script: "Latin", speakers: 68 },
  "tr-TR": { native: "Türkçe", flag: "🇹🇷", region: "Europe/Asia", script: "Latin", speakers: 76 },
  "it-IT": { native: "Italiano", flag: "🇮🇹", region: "Europe", script: "Latin", speakers: 65 },
  "th-TH": { native: "ไทย", latin: "Thai", flag: "🇹🇭", region: "Southeast Asia", script: "Thai", speakers: 21 },
  "fa-IR": { native: "فارسی", latin: "Fārsī", flag: "🇮🇷", region: "Middle East", script: "Arabic", speakers: 70 },
  "pl-PL": { native: "Polski", flag: "🇵🇱", region: "Europe", script: "Latin", speakers: 46 },
  "nl-NL": { native: "Nederlands", flag: "🇳🇱", region: "Europe", script: "Latin", speakers: 24 },
  "uk-UA": { native: "Українська", latin: "Ukrayins'ka", flag: "🇺🇦", region: "Europe", script: "Cyrillic", speakers: 41 },
  "vi-VN": { native: "Tiếng Việt", flag: "🇻🇳", region: "Southeast Asia", script: "Latin", speakers: 76 },
  "he-IL": { native: "עברית", latin: "Ivrit", flag: "🇮🇱", region: "Middle East", script: "Hebrew", speakers: 9 },
  "sw-KE": { native: "Kiswahili", flag: "🇰🇪", region: "East Africa", script: "Latin", speakers: 16 },
  "yo-NG": { native: "Yorùbá", flag: "🇳🇬", region: "West Africa", script: "Latin", speakers: 20 },
  "ta-IN": { native: "தமிழ்", latin: "Tamiḻ", flag: "🇮🇳", region: "South Asia", script: "Tamil", speakers: 75 },
  "te-IN": { native: "తెలుగు", latin: "Telugu", flag: "🇮🇳", region: "South Asia", script: "Telugu", speakers: 74 },
  "kn-IN": { native: "ಕನ್ನಡ", latin: "Kannaḍa", flag: "🇮🇳", region: "South Asia", script: "Kannada", speakers: 44 },
  "ml-IN": { native: "മലയാളം", latin: "Malayāḷam", flag: "🇮🇳", region: "South Asia", script: "Malayalam", speakers: 34 },
  "gu-IN": { native: "ગુજરાતી", latin: "Gujarātī", flag: "🇮🇳", region: "South Asia", script: "Gujarati", speakers: 56 },
  "mr-IN": { native: "मराठी", latin: "Marāṭhī", flag: "🇮🇳", region: "South Asia", script: "Devanagari", speakers: 73 },
  "ne-NP": { native: "नेपाली", latin: "Nepālī", flag: "🇳🇵", region: "South Asia", script: "Devanagari", speakers: 16 },
  "my-MM": { native: "မြန်မာ", latin: "Mranmā", flag: "🇲🇲", region: "Southeast Asia", script: "Myanmar", speakers: 33 },
  "km-KH": { native: "ខ្មែរ", latin: "Khmêr", flag: "🇰🇭", region: "Southeast Asia", script: "Khmer", speakers: 16 },
  "lo-LA": { native: "ລາວ", latin: "Lāo", flag: "🇱🇦", region: "Southeast Asia", script: "Lao", speakers: 3 },
  "si-LK": { native: "සිංහල", latin: "Siṁhala", flag: "🇱🇰", region: "South Asia", script: "Sinhala", speakers: 16 },
  "am-ET": { native: "አማርኛ", latin: "Amarəñña", flag: "🇪🇹", region: "East Africa", script: "Ethiopic", speakers: 32 },
  "id-ID": { native: "Bahasa Indonesia", flag: "🇮🇩", region: "Southeast Asia", script: "Latin", speakers: 199 },
  "ms-MY": { native: "Bahasa Melayu", flag: "🇲🇾", region: "Southeast Asia", script: "Latin", speakers: 19 },
  "tl-PH": { native: "Filipino", flag: "🇵🇭", region: "Southeast Asia", script: "Latin", speakers: 45 },
  
  // Additional regional variants
  "ca-ES": { native: "Català", flag: "🏴󠁥󠁳󠁣󠁴󠁿", region: "Europe", script: "Latin", speakers: 10 },
  "eu-ES": { native: "Euskera", flag: "🏴󠁥󠁳󠁰󠁶󠁿", region: "Europe", script: "Latin", speakers: 1 },
  "gl-ES": { native: "Galego", flag: "🏴󠁥󠁳󠁧󠁡󠁿", region: "Europe", script: "Latin", speakers: 2.4 },
  "ga-IE": { native: "Gaeilge", flag: "🇮🇪", region: "Europe", script: "Latin", speakers: 1.2 },
  "cy-GB": { native: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", region: "Europe", script: "Latin", speakers: 0.9 },
  
  // Sign Languages
  "ase": { native: "ASL", latin: "American Sign Language", flag: "🤟", region: "North America", script: "Visual-Spatial", speakers: 0.5 },
  "bfi": { native: "BSL", latin: "British Sign Language", flag: "🤟", region: "Europe", script: "Visual-Spatial", speakers: 0.15 },
  
  // Constructed Languages
  "eo": { native: "Esperanto", flag: "🌍", region: "Global", script: "Latin", speakers: 0.002 },
  "toki-pona": { native: "toki pona", flag: "🌐", region: "Global", script: "Latin", speakers: 0.001 }
};

// Advanced message loading with fallbacks and dynamic imports
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!enhancedLocales.includes(locale as any)) {
    notFound();
  }

  try {
    // Try to load the specific locale
    const messages = (await import(`../../messages/${locale}.json`)).default;
    
    // Get cultural settings for the locale
    const culturalSetting = culturalSettings[locale] || culturalSettings[defaultLocale];
    
    return {
      messages,
      timeZone: getTimezoneForLocale(locale),
      now: new Date(),
      formats: {
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          },
          long: {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
          }
        },
        number: {
          currency: {
            style: 'currency',
            currency: getCurrencyForLocale(locale)
          },
          percent: {
            style: 'percent'
          }
        }
      }
    };
  } catch (error) {
    // Fallback to base language if specific variant not found
    const baseLocale = locale.split('-')[0];
    try {
      const fallbackMessages = (await import(`../../messages/${baseLocale}.json`)).default;
      return {
        messages: fallbackMessages,
        timeZone: getTimezoneForLocale(locale)
      };
    } catch (fallbackError) {
      // Final fallback to default locale
      const defaultMessages = (await import(`../../messages/${defaultLocale}.json`)).default;
      return {
        messages: defaultMessages,
        timeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "America/New_York"
      };
    }
  }
});

// Utility functions
export function getTimezoneForLocale(locale: string): string {
  const timezoneMap: Record<string, string> = {
    "en-US": "America/New_York",
    "en-GB": "Europe/London",
    "en-AU": "Australia/Sydney",
    "zh-CN": "Asia/Shanghai",
    "zh-TW": "Asia/Taipei",
    "ja-JP": "Asia/Tokyo",
    "ko-KR": "Asia/Seoul",
    "hi-IN": "Asia/Kolkata",
    "ar-SA": "Asia/Riyadh",
    "pt-BR": "America/Sao_Paulo",
    "es-MX": "America/Mexico_City",
    "fr-FR": "Europe/Paris",
    "de-DE": "Europe/Berlin",
    "ru-RU": "Europe/Moscow",
    "tr-TR": "Europe/Istanbul",
    // Add more mappings as needed
  };
  
  return timezoneMap[locale] || timezoneMap[locale.split('-')[0]] || "UTC";
}

export function getCurrencyForLocale(locale: string): string {
  const currencyMap: Record<string, string> = {
    "en-US": "USD",
    "en-GB": "GBP",
    "en-AU": "AUD",
    "en-CA": "CAD",
    "zh-CN": "CNY",
    "zh-TW": "TWD",
    "ja-JP": "JPY",
    "ko-KR": "KRW",
    "hi-IN": "INR",
    "ar-SA": "SAR",
    "pt-BR": "BRL",
    "es-MX": "MXN",
    "fr-FR": "EUR",
    "de-DE": "EUR",
    "ru-RU": "RUB",
    "tr-TR": "TRY",
    // Add more mappings as needed
  };
  
  return currencyMap[locale] || currencyMap[locale.split('-')[0]] || "USD";
}

export function getLocalizedCityData(locale: string) {
  // Return city data with localized names and cultural context
  return metropolitanCities;
}

export function getRTLLocales(): string[] {
  return enhancedLocales.filter(locale => {
    const culturalSetting = culturalSettings[locale];
    return culturalSetting?.writingDirection === "rtl";
  });
}

export function getLocalesByRegion(region: string): string[] {
  return Object.entries(enhancedLocaleNames)
    .filter(([_, data]) => data.region === region)
    .map(([locale, _]) => locale);
}

export function getLocalesByScript(script: string): string[] {
  return Object.entries(enhancedLocaleNames)
    .filter(([_, data]) => data.script === script)
    .map(([locale, _]) => locale);
}

export function getSpeakerCount(locale: string): number {
  return enhancedLocaleNames[locale]?.speakers || 0;
}

export function getTopLocalesByUsers(): string[] {
  return Object.entries(enhancedLocaleNames)
    .sort(([_, a], [__, b]) => b.speakers - a.speakers)
    .slice(0, 50)
    .map(([locale, _]) => locale);
}

// Dynamic message loading for better performance
export async function loadMessages(locale: string, namespace?: string) {
  try {
    if (namespace) {
      return (await import(`../../messages/${locale}/${namespace}.json`)).default;
    } else {
      return (await import(`../../messages/${locale}.json`)).default;
    }
  } catch (error) {
    // Fallback logic
    const baseLocale = locale.split('-')[0];
    try {
      if (namespace) {
        return (await import(`../../messages/${baseLocale}/${namespace}.json`)).default;
      } else {
        return (await import(`../../messages/${baseLocale}.json`)).default;
      }
    } catch (fallbackError) {
      if (namespace) {
        return (await import(`../../messages/${defaultLocale}/${namespace}.json`)).default;
      } else {
        return (await import(`../../messages/${defaultLocale}.json`)).default;
      }
    }
  }
}

// Import original city data
import { metropolitanCities } from "./config";