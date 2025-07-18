import {
  metropolitanCities,
  getLocaleFromCity,
  getTimezoneFromCity,
  type Locale,
} from "./config";

// City-specific data and preferences
export interface CityLocalizationData {
  locale: Locale;
  timezone: string;
  currency: string;
  numberFormat: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  rtl: boolean;
  localHolidays: string[];
  businessHours: {
    start: string;
    end: string;
    days: number[]; // 0-6, Sunday = 0
  };
  emergencyNumber: string;
  addressFormat: "us" | "eu" | "jp" | "cn" | "in";
  phoneFormat: string;
  taxIncluded: boolean;
}

// City-specific localization configurations
export const cityConfigurations: Record<string, CityLocalizationData> = {
  // Asian Cities
  tokyo: {
    locale: "ja",
    timezone: "Asia/Tokyo",
    currency: "JPY",
    numberFormat: "ja-JP",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["新年", "成人の日", "ゴールデンウィーク"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "jp",
    phoneFormat: "+81-XX-XXXX-XXXX",
    taxIncluded: true,
  },
  beijing: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
  },
  delhi: {
    locale: "hi",
    timezone: "Asia/Kolkata",
    currency: "INR",
    numberFormat: "hi-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["दिवाली", "होली", "ईद"],
    businessHours: { start: "10:00", end: "18:00", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
  },
  seoul: {
    locale: "ko",
    timezone: "Asia/Seoul",
    currency: "KRW",
    numberFormat: "ko-KR",
    dateFormat: "YYYY년 M월 D일",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["설날", "추석", "어린이날"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "jp",
    phoneFormat: "+82-XX-XXXX-XXXX",
    taxIncluded: true,
  },
  bangkok: {
    locale: "th",
    timezone: "Asia/Bangkok",
    currency: "THB",
    numberFormat: "th-TH",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["วันขึ้นปีใหม่", "วันสงกรานต์", "วันเฉลิมพระชนมพรรษา"],
    businessHours: { start: "08:30", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "191",
    addressFormat: "us",
    phoneFormat: "+66-X-XXXX-XXXX",
    taxIncluded: true,
  },

  // European Cities
  london: {
    locale: "en",
    timezone: "Europe/London",
    currency: "GBP",
    numberFormat: "en-GB",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Christmas", "Easter", "Bank Holiday"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "999",
    addressFormat: "eu",
    phoneFormat: "+44-XXXX-XXX-XXX",
    taxIncluded: true,
  },
  paris: {
    locale: "fr",
    timezone: "Europe/Paris",
    currency: "EUR",
    numberFormat: "fr-FR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Noël", "Pâques", "Fête du Travail"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "eu",
    phoneFormat: "+33-X-XX-XX-XX-XX",
    taxIncluded: true,
  },
  berlin: {
    locale: "de",
    timezone: "Europe/Berlin",
    currency: "EUR",
    numberFormat: "de-DE",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Weihnachten", "Ostern", "Tag der Arbeit"],
    businessHours: { start: "08:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "eu",
    phoneFormat: "+49-XXX-XXXXXXX",
    taxIncluded: true,
  },
  moscow: {
    locale: "ru",
    timezone: "Europe/Moscow",
    currency: "RUB",
    numberFormat: "ru-RU",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Новый год", "Пасха", "День Победы"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "eu",
    phoneFormat: "+7-XXX-XXX-XX-XX",
    taxIncluded: true,
  },

  // Middle Eastern Cities
  dubai: {
    locale: "ar",
    timezone: "Asia/Dubai",
    currency: "AED",
    numberFormat: "ar-AE",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 6, // Friday in UAE
    rtl: true,
    localHolidays: ["عيد الفطر", "عيد الأضحى", "اليوم الوطني"],
    businessHours: { start: "08:00", end: "17:00", days: [0, 1, 2, 3, 4] }, // Sun-Thu
    emergencyNumber: "999",
    addressFormat: "us",
    phoneFormat: "+971-XX-XXX-XXXX",
    taxIncluded: false,
  },
  cairo: {
    locale: "ar",
    timezone: "Africa/Cairo",
    currency: "EGP",
    numberFormat: "ar-EG",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 6,
    rtl: true,
    localHolidays: ["عيد الفطر", "عيد الأضحى", "عيد الثورة"],
    businessHours: { start: "09:00", end: "17:00", days: [0, 1, 2, 3, 4] },
    emergencyNumber: "122",
    addressFormat: "us",
    phoneFormat: "+20-XX-XXXX-XXXX",
    taxIncluded: false,
  },

  // American Cities
  new_york: {
    locale: "en",
    timezone: "America/New_York",
    currency: "USD",
    numberFormat: "en-US",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["Christmas", "Thanksgiving", "Independence Day"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "us",
    phoneFormat: "+1-XXX-XXX-XXXX",
    taxIncluded: false,
  },
  mexico_city: {
    locale: "es",
    timezone: "America/Mexico_City",
    currency: "MXN",
    numberFormat: "es-MX",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["Navidad", "Día de los Muertos", "Día de la Independencia"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "us",
    phoneFormat: "+52-XX-XXXX-XXXX",
    taxIncluded: true,
  },
  sao_paulo: {
    locale: "pt",
    timezone: "America/Sao_Paulo",
    currency: "BRL",
    numberFormat: "pt-BR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["Natal", "Carnaval", "Independência"],
    businessHours: { start: "08:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "190",
    addressFormat: "us",
    phoneFormat: "+55-XX-XXXXX-XXXX",
    taxIncluded: false,
  },
};

// Helper functions
export function getCityConfiguration(
  cityKey: string,
): CityLocalizationData | null {
  return cityConfigurations[cityKey] || null;
}

export function detectCityFromLocation(coordinates: {
  lat: number;
  lng: number;
}): string | null {
  // Simple distance calculation to find nearest major city
  // In production, you'd use a proper geocoding service
  const distances = Object.entries(metropolitanCities).map(([key, city]) => {
    // Approximate city coordinates - in production use actual coordinates
    const cityCoords = getCityCoordinates(key);
    if (!cityCoords) return { key, distance: Infinity };

    const distance = Math.sqrt(
      Math.pow(coordinates.lat - cityCoords.lat, 2) +
        Math.pow(coordinates.lng - cityCoords.lng, 2),
    );
    return { key, distance };
  });

  const nearest = distances.reduce((min, current) =>
    current.distance < min.distance ? current : min,
  );

  return nearest.distance < 1 ? nearest.key : null; // Within ~111km
}

// Approximate coordinates for major cities
function getCityCoordinates(
  cityKey: string,
): { lat: number; lng: number } | null {
  const coords: Record<string, { lat: number; lng: number }> = {
    tokyo: { lat: 35.6762, lng: 139.6503 },
    beijing: { lat: 39.9042, lng: 116.4074 },
    delhi: { lat: 28.7041, lng: 77.1025 },
    seoul: { lat: 37.5665, lng: 126.978 },
    bangkok: { lat: 13.7563, lng: 100.5018 },
    london: { lat: 51.5074, lng: -0.1278 },
    paris: { lat: 48.8566, lng: 2.3522 },
    berlin: { lat: 52.52, lng: 13.405 },
    moscow: { lat: 55.7558, lng: 37.6176 },
    dubai: { lat: 25.2048, lng: 55.2708 },
    cairo: { lat: 30.0444, lng: 31.2357 },
    new_york: { lat: 40.7128, lng: -74.006 },
    mexico_city: { lat: 19.4326, lng: -99.1332 },
    sao_paulo: { lat: -23.5505, lng: -46.6333 },
  };
  return coords[cityKey] || null;
}

export function formatCurrency(amount: number, cityKey: string): string {
  const config = getCityConfiguration(cityKey);
  if (!config) return amount.toString();

  return new Intl.NumberFormat(config.numberFormat, {
    style: "currency",
    currency: config.currency,
  }).format(amount);
}

export function formatDate(date: Date, cityKey: string): string {
  const config = getCityConfiguration(cityKey);
  if (!config) return date.toLocaleDateString();

  return new Intl.DateTimeFormat(config.numberFormat, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatTime(date: Date, cityKey: string): string {
  const config = getCityConfiguration(cityKey);
  if (!config) return date.toLocaleTimeString();

  return new Intl.DateTimeFormat(config.numberFormat, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: config.timeFormat === "12h",
  }).format(date);
}

export function isBusinessHours(
  cityKey: string,
  date: Date = new Date(),
): boolean {
  const config = getCityConfiguration(cityKey);
  if (!config) return true;

  const day = date.getDay();
  const time = date.getHours() * 100 + date.getMinutes();
  const startTime = parseInt(config.businessHours.start.replace(":", ""));
  const endTime = parseInt(config.businessHours.end.replace(":", ""));

  return (
    config.businessHours.days.includes(day) &&
    time >= startTime &&
    time <= endTime
  );
}

export function getLocalizedPlaceholder(
  cityKey: string,
  type: "address" | "phone",
): string {
  const config = getCityConfiguration(cityKey);
  if (!config) return "";

  const placeholders = {
    address: {
      us: "123 Main St, City, State 12345",
      eu: "Musterstraße 123, 12345 Stadt",
      jp: "〒123-4567 東京都渋谷区○○1-2-3",
      cn: "北京市朝阳区XX路123号",
      in: "123, Main Road, City, State - 123456",
    },
    phone: {
      us: "(555) 123-4567",
      eu: "+49 123 456789",
      jp: "090-1234-5678",
      cn: "138 0013 8000",
      in: "+91 98765 43210",
    },
  };

  const formatKey = config.addressFormat;
  return placeholders[type][formatKey] || placeholders[type].us;
}
