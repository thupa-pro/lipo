import { metropolitanCities, getCityData, type Locale } from "./config";
import { getCityConfiguration, formatCurrency } from "./city-localization";

// Country to currency mapping
export const countryCurrencyMap: Record<string, string> = {
  // North America
  "United States": "USD",
  USA: "USD",
  Canada: "CAD",
  Mexico: "MXN",

  // South America
  Brazil: "BRL",
  Argentina: "ARS",
  Peru: "PEN",
  Colombia: "COP",
  Chile: "CLP",
  Venezuela: "VES",

  // Europe
  "United Kingdom": "GBP",
  UK: "GBP",
  Germany: "EUR",
  France: "EUR",
  Spain: "EUR",
  Italy: "EUR",
  Netherlands: "EUR",
  Austria: "EUR",
  Portugal: "EUR",
  Switzerland: "CHF",
  Russia: "RUB",
  Turkey: "TRY",
  Ukraine: "UAH",
  Poland: "PLN",
  "Czech Republic": "CZK",
  Hungary: "HUF",
  Romania: "RON",
  Greece: "EUR",
  Sweden: "SEK",
  Denmark: "DKK",
  Norway: "NOK",
  Finland: "EUR",

  // Asia
  China: "CNY",
  Japan: "JPY",
  India: "INR",
  "South Korea": "KRW",
  Indonesia: "IDR",
  Thailand: "THB",
  Vietnam: "VND",
  Malaysia: "MYR",
  Philippines: "PHP",
  Taiwan: "TWD",
  Pakistan: "PKR",
  Bangladesh: "BDT",
  Iran: "IRR",

  // Middle East
  "Saudi Arabia": "SAR",
  "United Arab Emirates": "AED",
  UAE: "AED",
  Israel: "ILS",
  Iraq: "IQD",

  // Africa
  "South Africa": "ZAR",
  Nigeria: "NGN",
  Egypt: "EGP",
  Morocco: "MAD",
  Algeria: "DZD",
  Tunisia: "TND",
  Sudan: "SDG",
  Ethiopia: "ETB",
  Kenya: "KES",
  Tanzania: "TZS",
  Ghana: "GHS",
  Angola: "AOA",
  Madagascar: "MGA",
  "Ivory Coast": "XOF",
  "DR Congo": "CDF",

  // Oceania
  Australia: "AUD",
  "New Zealand": "NZD",
};

// Country to phone code mapping
export const countryPhoneCodeMap: Record<string, string> = {
  // North America (NANP)
  "United States": "+1",
  USA: "+1",
  Canada: "+1",
  Mexico: "+52",

  // South America
  Brazil: "+55",
  Argentina: "+54",
  Peru: "+51",
  Colombia: "+57",
  Chile: "+56",
  Venezuela: "+58",

  // Europe
  "United Kingdom": "+44",
  UK: "+44",
  Germany: "+49",
  France: "+33",
  Spain: "+34",
  Italy: "+39",
  Netherlands: "+31",
  Austria: "+43",
  Portugal: "+351",
  Switzerland: "+41",
  Russia: "+7",
  Turkey: "+90",
  Ukraine: "+380",
  Poland: "+48",
  "Czech Republic": "+420",
  Hungary: "+36",
  Romania: "+40",
  Greece: "+30",
  Sweden: "+46",
  Denmark: "+45",
  Norway: "+47",
  Finland: "+358",

  // Asia
  China: "+86",
  Japan: "+81",
  India: "+91",
  "South Korea": "+82",
  Indonesia: "+62",
  Thailand: "+66",
  Vietnam: "+84",
  Malaysia: "+60",
  Philippines: "+63",
  Taiwan: "+886",
  Pakistan: "+92",
  Bangladesh: "+880",
  Iran: "+98",

  // Middle East
  "Saudi Arabia": "+966",
  "United Arab Emirates": "+971",
  UAE: "+971",
  Israel: "+972",
  Iraq: "+964",

  // Africa
  "South Africa": "+27",
  Nigeria: "+234",
  Egypt: "+20",
  Morocco: "+212",
  Algeria: "+213",
  Tunisia: "+216",
  Sudan: "+249",
  Ethiopia: "+251",
  Kenya: "+254",
  Tanzania: "+255",
  Ghana: "+233",
  Angola: "+244",
  Madagascar: "+261",
  "Ivory Coast": "+225",
  "DR Congo": "+243",

  // Oceania
  Australia: "+61",
  "New Zealand": "+64",
};

// Phone number patterns by country
export const phoneNumberPatterns: Record<string, RegExp> = {
  // NANP (US, Canada)
  "United States":
    /^(\+1)?[\s.-]?\(?([0-9]{3})\)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{4})$/,
  USA: /^(\+1)?[\s.-]?\(?([0-9]{3})\)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{4})$/,
  Canada: /^(\+1)?[\s.-]?\(?([0-9]{3})\)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{4})$/,

  // International patterns (basic)
  "United Kingdom":
    /^(\+44)?[\s.-]?([0-9]{4})[\s.-]?([0-9]{3})[\s.-]?([0-9]{3})$/,
  Germany: /^(\+49)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{7,8})$/,
  France:
    /^(\+33)?[\s.-]?([0-9])[\s.-]?([0-9]{2})[\s.-]?([0-9]{2})[\s.-]?([0-9]{2})[\s.-]?([0-9]{2})$/,
  China: /^(\+86)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{4})[\s.-]?([0-9]{4})$/,
  India: /^(\+91)?[\s.-]?([0-9]{5})[\s.-]?([0-9]{5})$/,
  Japan: /^(\+81)?[\s.-]?([0-9]{2})[\s.-]?([0-9]{4})[\s.-]?([0-9]{4})$/,
  Brazil: /^(\+55)?[\s.-]?([0-9]{2})[\s.-]?([0-9]{5})[\s.-]?([0-9]{4})$/,
  Australia: /^(\+61)?[\s.-]?([0-9])[\s.-]?([0-9]{4})[\s.-]?([0-9]{4})$/,
};

export interface CountryDetectionResult {
  country: string;
  currency: string;
  phoneCode: string;
  locale?: Locale;
  cityKey?: string;
  confidence: number;
}

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

// Detect country from coordinates using reverse geocoding simulation
export function detectCountryFromCoords(
  coords: GeolocationCoords,
): Promise<CountryDetectionResult> {
  return new Promise((resolve) => {
    // Find the nearest metropolitan city
    let nearestCity = null;
    let minDistance = Infinity;

    for (const [cityKey, cityData] of Object.entries(metropolitanCities)) {
      const cityConfig = getCityConfiguration(cityKey);
      if (!cityConfig) continue;

      // Get city coordinates (you'd use a proper geocoding service in production)
      const cityCoords = getCityCoordinatesFromKey(cityKey);
      if (!cityCoords) continue;

      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        cityCoords.lat,
        cityCoords.lng,
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = { cityKey, cityData, distance };
      }
    }

    if (nearestCity && nearestCity.distance < 500) {
      // Within 500km
      const country = nearestCity.cityData.country;
      const currency = countryCurrencyMap[country] || "USD";
      const phoneCode = countryPhoneCodeMap[country] || "+1";
      const confidence = Math.max(
        0,
        Math.min(1, 1 - nearestCity.distance / 500),
      );

      resolve({
        country,
        currency,
        phoneCode,
        locale: nearestCity.cityData.locale,
        cityKey: nearestCity.cityKey,
        confidence,
      });
    } else {
      // Default to US if no match
      resolve({
        country: "United States",
        currency: "USD",
        phoneCode: "+1",
        locale: "en",
        confidence: 0.1,
      });
    }
  });
}

// Get country info from browser/IP (simulation)
export async function detectCountryFromBrowser(): Promise<CountryDetectionResult> {
  // In a real app, you'd use IP geolocation service like:
  // - ipapi.co
  // - ipgeolocation.io
  // - MaxMind GeoIP2

  // For now, try to get from navigator.language and timezone
  const language = navigator.language || "en-US";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Simple mapping based on timezone and language
  const countryFromTimezone = getCountryFromTimezone(timezone);
  const countryFromLanguage = getCountryFromLanguage(language);

  const detectedCountry =
    countryFromTimezone || countryFromLanguage || "United States";
  const currency = countryCurrencyMap[detectedCountry] || "USD";
  const phoneCode = countryPhoneCodeMap[detectedCountry] || "+1";

  // Find matching locale
  const cityEntry = Object.entries(metropolitanCities).find(
    ([, cityData]) => cityData.country === detectedCountry,
  );

  return {
    country: detectedCountry,
    currency,
    phoneCode,
    locale: cityEntry?.[1].locale || "en",
    cityKey: cityEntry?.[0],
    confidence: 0.7,
  };
}

// Get user's location and detect country
export function getUserLocationAndDetectCountry(): Promise<CountryDetectionResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback to browser detection
      detectCountryFromBrowser().then(resolve).catch(reject);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          const result = await detectCountryFromCoords(coords);
          resolve(result);
        } catch (error) {
          // Fallback to browser detection
          const result = await detectCountryFromBrowser();
          resolve(result);
        }
      },
      async (error) => {
        console.warn("Geolocation failed:", error);
        // Fallback to browser detection
        const result = await detectCountryFromBrowser();
        resolve(result);
      },
      {
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
        enableHighAccuracy: false,
      },
    );
  });
}

// Format currency based on detected country
export function formatCurrencyForCountry(
  amount: number,
  country: string,
  options?: Intl.NumberFormatOptions,
): string {
  const currency = countryCurrencyMap[country] || "USD";
  const locale = getLocaleForCountry(country);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...options,
  }).format(amount);
}

// Format phone number based on detected country
export function formatPhoneNumber(phone: string, country: string): string {
  const pattern = phoneNumberPatterns[country];
  const phoneCode = countryPhoneCodeMap[country] || "+1";

  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  if (!pattern) {
    // Generic international format
    return `${phoneCode} ${digits}`;
  }

  // Apply country-specific formatting
  const match = phone.match(pattern);
  if (match) {
    switch (country) {
      case "United States":
      case "USA":
      case "Canada":
        return `+1 (${match[2]}) ${match[3]}-${match[4]}`;
      case "United Kingdom":
        return `+44 ${match[2]} ${match[3]} ${match[4]}`;
      case "Germany":
        return `+49 ${match[2]} ${match[3]}`;
      case "France":
        return `+33 ${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]}`;
      default:
        return `${phoneCode} ${digits}`;
    }
  }

  return `${phoneCode} ${digits}`;
}

// Validate phone number for country
export function validatePhoneNumber(phone: string, country: string): boolean {
  const pattern = phoneNumberPatterns[country];
  if (!pattern) {
    // Basic validation: check if it has reasonable length
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }

  return pattern.test(phone);
}

// Helper functions
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getCityCoordinatesFromKey(
  cityKey: string,
): { lat: number; lng: number } | null {
  // This should match the coordinates in city-localization.ts
  const coords: Record<string, { lat: number; lng: number }> = {
    tokyo: { lat: 35.6762, lng: 139.6503 },
    delhi: { lat: 28.7041, lng: 77.1025 },
    shanghai: { lat: 31.2304, lng: 121.4737 },
    new_york: { lat: 40.7128, lng: -74.006 },
    london: { lat: 51.5074, lng: -0.1278 },
    paris: { lat: 48.8566, lng: 2.3522 },
    berlin: { lat: 52.52, lng: 13.405 },
    moscow: { lat: 55.7558, lng: 37.6176 },
    lagos: { lat: 6.5244, lng: 3.3792 },
    johannesburg: { lat: -26.2041, lng: 28.0473 },
    sydney: { lat: -33.8688, lng: 151.2093 },
    // Add more as needed
  };
  return coords[cityKey] || null;
}

function getCountryFromTimezone(timezone: string): string | null {
  const timezoneToCountry: Record<string, string> = {
    "America/New_York": "United States",
    "America/Los_Angeles": "United States",
    "America/Chicago": "United States",
    "America/Toronto": "Canada",
    "America/Montreal": "Canada",
    "America/Mexico_City": "Mexico",
    "America/Sao_Paulo": "Brazil",
    "America/Buenos_Aires": "Argentina",
    "Europe/London": "United Kingdom",
    "Europe/Paris": "France",
    "Europe/Berlin": "Germany",
    "Europe/Rome": "Italy",
    "Europe/Madrid": "Spain",
    "Europe/Moscow": "Russia",
    "Asia/Tokyo": "Japan",
    "Asia/Shanghai": "China",
    "Asia/Kolkata": "India",
    "Asia/Seoul": "South Korea",
    "Asia/Bangkok": "Thailand",
    "Asia/Jakarta": "Indonesia",
    "Australia/Sydney": "Australia",
    "Africa/Lagos": "Nigeria",
    "Africa/Johannesburg": "South Africa",
    "Africa/Cairo": "Egypt",
  };

  return timezoneToCountry[timezone] || null;
}

function getCountryFromLanguage(language: string): string | null {
  const langToCountry: Record<string, string> = {
    "en-US": "United States",
    "en-GB": "United Kingdom",
    "en-CA": "Canada",
    "en-AU": "Australia",
    "fr-FR": "France",
    "fr-CA": "Canada",
    "de-DE": "Germany",
    "es-ES": "Spain",
    "es-MX": "Mexico",
    "it-IT": "Italy",
    "pt-BR": "Brazil",
    "ru-RU": "Russia",
    "ja-JP": "Japan",
    "ko-KR": "South Korea",
    "zh-CN": "China",
    "hi-IN": "India",
    "th-TH": "Thailand",
    "tr-TR": "Turkey",
  };

  return (
    langToCountry[language] || langToCountry[language.split("-")[0]] || null
  );
}

function getLocaleForCountry(country: string): string {
  const countryToLocale: Record<string, string> = {
    "United States": "en-US",
    Canada: "en-CA",
    "United Kingdom": "en-GB",
    Australia: "en-AU",
    France: "fr-FR",
    Germany: "de-DE",
    Spain: "es-ES",
    Italy: "it-IT",
    Brazil: "pt-BR",
    Russia: "ru-RU",
    Japan: "ja-JP",
    "South Korea": "ko-KR",
    China: "zh-CN",
    India: "hi-IN",
    Thailand: "th-TH",
    Turkey: "tr-TR",
    Mexico: "es-MX",
    Nigeria: "en-NG",
    "South Africa": "en-ZA",
    Egypt: "ar-EG",
  };

  return countryToLocale[country] || "en-US";
}
