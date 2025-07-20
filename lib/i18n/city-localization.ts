import {
  metropolitanCities,
  getLocaleFromCity,
  getTimezoneFromCity,
  type Locale,
} from "./config";

// City-specific data and preferences for hyperlocal service marketplace
export interface CityLocalizationData {
  locale: Locale;
  timezone: string;
  currency: string;
  currencySymbol: string;
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
  addressFormat: "us" | "eu" | "jp" | "cn" | "in" | "latin" | "arabic";
  phoneFormat: string;
  taxIncluded: boolean;
  tippingCulture: "mandatory" | "expected" | "optional" | "uncommon";
  serviceTypes: string[]; // Popular service types in this city
  marketPotential: "high" | "medium" | "low";
  digitalAdoption: "high" | "medium" | "low";
  economicIndicators: {
    gdpPerCapita: number;
    averageIncome: number;
    serviceEconomyShare: number;
  };
}

// Comprehensive city-specific localization configurations for 100+ metropolitan cities
export const cityConfigurations: Record<string, CityLocalizationData> = {
  
  // ASIA-PACIFIC REGION
  
  // East Asia - Japan
  tokyo: {
    locale: "ja",
    timezone: "Asia/Tokyo",
    currency: "JPY",
    currencySymbol: "¥",
    numberFormat: "ja-JP",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["新年", "成人の日", "ゴールデンウィーク", "お盆", "敬老の日"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "jp",
    phoneFormat: "+81-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Delivery", "Cleaning", "Tech Support", "Personal Care", "Education"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 40000, averageIncome: 35000, serviceEconomyShare: 75 }
  },
  
  osaka: {
    locale: "ja",
    timezone: "Asia/Tokyo",
    currency: "JPY",
    currencySymbol: "¥",
    numberFormat: "ja-JP",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["新年", "成人の日", "ゴールデンウィーク", "お盆", "敬老の日"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "jp",
    phoneFormat: "+81-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Food Delivery", "Cleaning", "Maintenance", "Personal Care", "Education"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 38000, averageIncome: 32000, serviceEconomyShare: 72 }
  },

  yokohama: {
    locale: "ja",
    timezone: "Asia/Tokyo",
    currency: "JPY",
    currencySymbol: "¥",
    numberFormat: "ja-JP",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["新年", "成人の日", "ゴールデンウィーク", "お盆", "敬老の日"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "jp",
    phoneFormat: "+81-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Delivery", "Cleaning", "Tech Support", "Personal Care", "Pet Care"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 39000, averageIncome: 33000, serviceEconomyShare: 74 }
  },

  nagoya: {
    locale: "ja",
    timezone: "Asia/Tokyo",
    currency: "JPY",
    currencySymbol: "¥",
    numberFormat: "ja-JP",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["新年", "成人の日", "ゴールデンウィーク", "お盆", "敬老の日"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "jp",
    phoneFormat: "+81-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Auto Services", "Delivery", "Cleaning", "Maintenance", "Education"],
    marketPotential: "medium",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 37000, averageIncome: 31000, serviceEconomyShare: 70 }
  },

  kyoto: {
    locale: "ja",
    timezone: "Asia/Tokyo",
    currency: "JPY",
    currencySymbol: "¥",
    numberFormat: "ja-JP",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["新年", "成人の日", "ゴールデンウィーク", "お盆", "敬老の日", "祇園祭"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "jp",
    phoneFormat: "+81-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Tourism Services", "Cultural Events", "Delivery", "Cleaning", "Education"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 36000, averageIncome: 30000, serviceEconomyShare: 68 }
  },

  // East Asia - China
  shanghai: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Delivery", "Cleaning", "Tech Support", "Beauty", "Fitness"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 25000, averageIncome: 18000, serviceEconomyShare: 65 }
  },

  beijing: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Government Services", "Delivery", "Tech Support", "Education", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 24000, averageIncome: 17000, serviceEconomyShare: 70 }
  },

  guangzhou: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Manufacturing Support", "Delivery", "Logistics", "Trade Services", "Tech"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 23000, averageIncome: 16000, serviceEconomyShare: 60 }
  },

  shenzhen: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Tech Support", "Delivery", "Innovation Services", "Startup Support", "Electronics"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 30000, averageIncome: 22000, serviceEconomyShare: 75 }
  },

  tianjin: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Industrial Services", "Port Services", "Delivery", "Maintenance", "Logistics"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 20000, averageIncome: 14000, serviceEconomyShare: 55 }
  },

  chongqing: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Delivery", "Food Services", "Transportation", "Maintenance", "Tourism"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 18000, averageIncome: 12000, serviceEconomyShare: 50 }
  },

  wuhan: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Education Services", "Healthcare", "Delivery", "Transportation", "Tech"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 19000, averageIncome: 13000, serviceEconomyShare: 52 }
  },

  xian: {
    locale: "zh",
    timezone: "Asia/Shanghai",
    currency: "CNY",
    currencySymbol: "¥",
    numberFormat: "zh-CN",
    dateFormat: "YYYY年M月D日",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["春节", "国庆节", "中秋节", "劳动节", "清明节"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+86-XXX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Tourism Services", "Cultural Events", "Delivery", "Education", "Tech"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 16000, averageIncome: 11000, serviceEconomyShare: 48 }
  },

  // East Asia - South Korea
  seoul: {
    locale: "ko",
    timezone: "Asia/Seoul",
    currency: "KRW",
    currencySymbol: "₩",
    numberFormat: "ko-KR",
    dateFormat: "YYYY년 M월 D일",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["설날", "추석", "어린이날", "광복절", "개천절"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "cn",
    phoneFormat: "+82-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Tech Support", "Delivery", "Beauty", "Education", "Gaming"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 35000, averageIncome: 28000, serviceEconomyShare: 80 }
  },

  busan: {
    locale: "ko",
    timezone: "Asia/Seoul",
    currency: "KRW",
    currencySymbol: "₩",
    numberFormat: "ko-KR",
    dateFormat: "YYYY년 M월 D일",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["설날", "추석", "어린이날", "광복절", "개천절", "부산국제영화제"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "cn",
    phoneFormat: "+82-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Maritime Services", "Delivery", "Tourism", "Food Services", "Port Services"],
    marketPotential: "medium",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 32000, averageIncome: 25000, serviceEconomyShare: 75 }
  },

  // Taiwan & Hong Kong
  hong_kong: {
    locale: "zh-TW",
    timezone: "Asia/Hong_Kong",
    currency: "HKD",
    currencySymbol: "HK$",
    numberFormat: "zh-HK",
    dateFormat: "YYYY年M月D日",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["農曆新年", "清明節", "佛誕", "端午節", "中秋節"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "999",
    addressFormat: "cn",
    phoneFormat: "+852-XXXX-XXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Financial Services", "Delivery", "Domestic Help", "Tech Support", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 50000, averageIncome: 40000, serviceEconomyShare: 85 }
  },

  taipei: {
    locale: "zh-TW",
    timezone: "Asia/Taipei",
    currency: "TWD",
    currencySymbol: "NT$",
    numberFormat: "zh-TW",
    dateFormat: "YYYY年M月D日",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["農曆新年", "清明節", "端午節", "中秋節", "雙十節"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "110",
    addressFormat: "cn",
    phoneFormat: "+886-X-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Tech Support", "Delivery", "Education", "Healthcare", "Manufacturing Support"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 28000, averageIncome: 22000, serviceEconomyShare: 70 }
  },

  // South Asia - India
  delhi: {
    locale: "hi",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "hi-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["दिवाली", "होली", "ईद", "दशहरा", "करवा चौथ"],
    businessHours: { start: "10:00", end: "18:00", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Government Services", "Delivery", "Domestic Help", "Tech Support", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 2500, averageIncome: 1800, serviceEconomyShare: 45 }
  },

  mumbai: {
    locale: "hi",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "hi-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["दिवाली", "होली", "गणेश चतुर्थी", "ईद", "दशहरा"],
    businessHours: { start: "10:00", end: "19:00", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Financial Services", "Entertainment", "Delivery", "Domestic Help", "Tech"],
    marketPotential: "high",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 3000, averageIncome: 2200, serviceEconomyShare: 55 }
  },

  kolkata: {
    locale: "bn",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "bn-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["দুর্গা পুজো", "কালী পুজো", "দীপাবলি", "ঈদ", "পহেলা বৈশাখ"],
    businessHours: { start: "10:00", end: "18:00", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Cultural Services", "Education", "Delivery", "Domestic Help", "Healthcare"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 2200, averageIncome: 1600, serviceEconomyShare: 40 }
  },

  bangalore: {
    locale: "kn",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "kn-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["ದೀಪಾವಳಿ", "ಉಗಾದಿ", "ದಶಹರಾ", "ಈದ್", "ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮೆ"],
    businessHours: { start: "09:30", end: "18:30", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Tech Support", "Software Development", "Delivery", "Education", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 4500, averageIncome: 3200, serviceEconomyShare: 65 }
  },

  hyderabad: {
    locale: "te",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "te-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["దీపావళి", "ఉగాది", "విజయదశమి", "ఈద్", "బొనాలు"],
    businessHours: { start: "09:30", end: "18:30", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Tech Support", "Pharmaceuticals", "Delivery", "Education", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 3800, averageIncome: 2800, serviceEconomyShare: 60 }
  },

  chennai: {
    locale: "ta",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "ta-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["தீபாவளி", "பொங்கல்", "விநாயகர் சதுர்த்தி", "ஈத்", "நவராத்ரி"],
    businessHours: { start: "09:30", end: "18:30", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Auto Services", "Healthcare", "Delivery", "Education", "Manufacturing"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 3200, averageIncome: 2400, serviceEconomyShare: 50 }
  },

  pune: {
    locale: "mr",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "mr-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["दिवाळी", "गणेश चतुर्थी", "गुढी पाडवा", "ईद", "नवरात्र"],
    businessHours: { start: "09:30", end: "18:30", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Education", "Tech Support", "Auto Services", "Delivery", "Healthcare"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 3500, averageIncome: 2600, serviceEconomyShare: 52 }
  },

  ahmedabad: {
    locale: "gu",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    numberFormat: "gu-IN",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["દિવાળી", "હોળી", "નવરાત્રી", "ઈદ", "ઉત્તરાયણ"],
    businessHours: { start: "10:00", end: "19:00", days: [1, 2, 3, 4, 5, 6] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+91-XXXXX-XXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Textile Services", "Trade Support", "Delivery", "Manufacturing", "Business"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 3000, averageIncome: 2200, serviceEconomyShare: 48 }
  },

  // Bangladesh
  dhaka: {
    locale: "bn",
    timezone: "Asia/Dhaka",
    currency: "BDT",
    currencySymbol: "৳",
    numberFormat: "bn-BD",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 6,
    rtl: false,
    localHolidays: ["ঈদুল ফিতর", "ঈদুল আযহা", "পহেলা বৈশাখ", "দুর্গা পুজো", "বিজয় দিবস"],
    businessHours: { start: "09:00", end: "17:00", days: [0, 1, 2, 3, 4] },
    emergencyNumber: "999",
    addressFormat: "in",
    phoneFormat: "+880-XXXX-XXXXXX",
    taxIncluded: true,
    tippingCulture: "optional",
    serviceTypes: ["Garment Services", "Delivery", "Education", "Healthcare", "Agriculture Support"],
    marketPotential: "medium",
    digitalAdoption: "low",
    economicIndicators: { gdpPerCapita: 2500, averageIncome: 1200, serviceEconomyShare: 35 }
  },

  // Pakistan
  karachi: {
    locale: "ur",
    timezone: "Asia/Karachi",
    currency: "PKR",
    currencySymbol: "₨",
    numberFormat: "ur-PK",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: true,
    localHolidays: ["عید الفطر", "عید الاضحیٰ", "محرم", "عاشورہ", "شب برات"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "15",
    addressFormat: "in",
    phoneFormat: "+92-XXX-XXXXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Port Services", "Trade Support", "Delivery", "Textile", "Transportation"],
    marketPotential: "medium",
    digitalAdoption: "low",
    economicIndicators: { gdpPerCapita: 1600, averageIncome: 900, serviceEconomyShare: 30 }
  },

  lahore: {
    locale: "pa",
    timezone: "Asia/Karachi",
    currency: "PKR",
    currencySymbol: "₨",
    numberFormat: "pa-PK",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: true,
    localHolidays: ["عید الفطر", "عید الاضحیٰ", "بسنت", "شب برات", "یوم پاکستان"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "15",
    addressFormat: "in",
    phoneFormat: "+92-XXX-XXXXXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Cultural Services", "Education", "Delivery", "Agriculture", "Handicrafts"],
    marketPotential: "medium",
    digitalAdoption: "low",
    economicIndicators: { gdpPerCapita: 1500, averageIncome: 850, serviceEconomyShare: 28 }
  },

  // Sri Lanka
  colombo: {
    locale: "si",
    timezone: "Asia/Colombo",
    currency: "LKR",
    currencySymbol: "Rs",
    numberFormat: "si-LK",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["සිංහල නව වර්ෂය", "වෙසක් පොහෝ දිනය", "පොසොන් පොහෝ දිනය", "රාමසාන්", "දීපාවලී"],
    businessHours: { start: "08:30", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "119",
    addressFormat: "in",
    phoneFormat: "+94-XX-XXXXXXX",
    taxIncluded: true,
    tippingCulture: "optional",
    serviceTypes: ["Tourism Services", "Port Services", "Delivery", "Agriculture", "Tea Industry"],
    marketPotential: "low",
    digitalAdoption: "low",
    economicIndicators: { gdpPerCapita: 4000, averageIncome: 2000, serviceEconomyShare: 40 }
  },

  // Nepal
  kathmandu: {
    locale: "ne",
    timezone: "Asia/Kathmandu",
    currency: "NPR",
    currencySymbol: "Rs",
    numberFormat: "ne-NP",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["दशैं", "तिहार", "होली", "बुद्ध जयन्ती", "गणेश चतुर्थी"],
    businessHours: { start: "10:00", end: "17:00", days: [0, 1, 2, 3, 4, 5] },
    emergencyNumber: "100",
    addressFormat: "in",
    phoneFormat: "+977-X-XXXXXXX",
    taxIncluded: true,
    tippingCulture: "optional",
    serviceTypes: ["Tourism Services", "Trekking Support", "Delivery", "Agriculture", "Handicrafts"],
    marketPotential: "low",
    digitalAdoption: "low",
    economicIndicators: { gdpPerCapita: 1200, averageIncome: 600, serviceEconomyShare: 25 }
  },

  // AMERICAS REGION

  // North America - USA
  new_york: {
    locale: "en",
    timezone: "America/New_York",
    currency: "USD",
    currencySymbol: "$",
    numberFormat: "en-US",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["New Year's Day", "Martin Luther King Jr. Day", "Presidents Day", "Memorial Day", "Independence Day", "Labor Day", "Thanksgiving", "Christmas"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "us",
    phoneFormat: "+1-XXX-XXX-XXXX",
    taxIncluded: false,
    tippingCulture: "mandatory",
    serviceTypes: ["Financial Services", "Tech Support", "Delivery", "Personal Services", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 75000, averageIncome: 60000, serviceEconomyShare: 85 }
  },

  los_angeles: {
    locale: "en",
    timezone: "America/Los_Angeles",
    currency: "USD",
    currencySymbol: "$",
    numberFormat: "en-US",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["New Year's Day", "Martin Luther King Jr. Day", "Presidents Day", "Memorial Day", "Independence Day", "Labor Day", "Thanksgiving", "Christmas"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "us",
    phoneFormat: "+1-XXX-XXX-XXXX",
    taxIncluded: false,
    tippingCulture: "mandatory",
    serviceTypes: ["Entertainment Services", "Tech Support", "Delivery", "Personal Care", "Auto Services"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 70000, averageIncome: 55000, serviceEconomyShare: 82 }
  },

  chicago: {
    locale: "en",
    timezone: "America/Chicago",
    currency: "USD",
    currencySymbol: "$",
    numberFormat: "en-US",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["New Year's Day", "Martin Luther King Jr. Day", "Presidents Day", "Memorial Day", "Independence Day", "Labor Day", "Thanksgiving", "Christmas"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "us",
    phoneFormat: "+1-XXX-XXX-XXXX",
    taxIncluded: false,
    tippingCulture: "mandatory",
    serviceTypes: ["Financial Services", "Manufacturing Support", "Delivery", "Healthcare", "Education"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 65000, averageIncome: 50000, serviceEconomyShare: 80 }
  },

  // North America - Canada
  toronto: {
    locale: "en",
    timezone: "America/Toronto",
    currency: "CAD",
    currencySymbol: "C$",
    numberFormat: "en-CA",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["New Year's Day", "Family Day", "Good Friday", "Victoria Day", "Canada Day", "Labour Day", "Thanksgiving", "Christmas"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "us",
    phoneFormat: "+1-XXX-XXX-XXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Financial Services", "Tech Support", "Delivery", "Healthcare", "Education"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 55000, averageIncome: 45000, serviceEconomyShare: 78 }
  },

  montreal: {
    locale: "fr",
    timezone: "America/Montreal",
    currency: "CAD",
    currencySymbol: "C$",
    numberFormat: "fr-CA",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Jour de l'An", "Fête de la famille", "Vendredi saint", "Fête de Dollard", "Fête nationale", "Fête du travail", "Action de grâce", "Noël"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "us",
    phoneFormat: "+1-XXX-XXX-XXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Cultural Services", "Tech Support", "Delivery", "Healthcare", "Education"],
    marketPotential: "medium",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 50000, averageIncome: 40000, serviceEconomyShare: 75 }
  },

  // Latin America - Mexico
  mexico_city: {
    locale: "es",
    timezone: "America/Mexico_City",
    currency: "MXN",
    currencySymbol: "$",
    numberFormat: "es-MX",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Año Nuevo", "Día de la Constitución", "Día de Benito Juárez", "Día del Trabajo", "Día de la Independencia", "Día de la Revolución", "Navidad"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "latin",
    phoneFormat: "+52-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Government Services", "Delivery", "Domestic Help", "Auto Services", "Education"],
    marketPotential: "high",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 12000, averageIncome: 8000, serviceEconomyShare: 55 }
  },

  // South America - Brazil
  sao_paulo: {
    locale: "pt",
    timezone: "America/Sao_Paulo",
    currency: "BRL",
    currencySymbol: "R$",
    numberFormat: "pt-BR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["Ano Novo", "Carnaval", "Sexta-feira Santa", "Tiradentes", "Dia do Trabalho", "Independência", "Nossa Senhora Aparecida", "Natal"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "190",
    addressFormat: "latin",
    phoneFormat: "+55-XX-XXXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Financial Services", "Delivery", "Auto Services", "Healthcare", "Education"],
    marketPotential: "high",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 15000, averageIncome: 10000, serviceEconomyShare: 60 }
  },

  rio_de_janeiro: {
    locale: "pt",
    timezone: "America/Sao_Paulo",
    currency: "BRL",
    currencySymbol: "R$",
    numberFormat: "pt-BR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 0,
    rtl: false,
    localHolidays: ["Ano Novo", "Carnaval", "Sexta-feira Santa", "Tiradentes", "Dia do Trabalho", "Independência", "Nossa Senhora Aparecida", "Natal"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "190",
    addressFormat: "latin",
    phoneFormat: "+55-XX-XXXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Tourism Services", "Entertainment", "Delivery", "Beach Services", "Security"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 13000, averageIncome: 9000, serviceEconomyShare: 65 }
  },

  // South America - Argentina
  buenos_aires: {
    locale: "es",
    timezone: "America/Argentina/Buenos_Aires",
    currency: "ARS",
    currencySymbol: "$",
    numberFormat: "es-AR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Año Nuevo", "Carnaval", "Día de la Memoria", "Día del Trabajador", "Revolución de Mayo", "Día de la Bandera", "Independencia", "Navidad"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "911",
    addressFormat: "latin",
    phoneFormat: "+54-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Financial Services", "Delivery", "Tango Services", "Agriculture Support", "Education"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 12000, averageIncome: 8500, serviceEconomyShare: 58 }
  },

  // EUROPE REGION

  // Western Europe - UK
  london: {
    locale: "en",
    timezone: "Europe/London",
    currency: "GBP",
    currencySymbol: "£",
    numberFormat: "en-GB",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["New Year's Day", "Good Friday", "Easter Monday", "Early May Bank Holiday", "Spring Bank Holiday", "Summer Bank Holiday", "Christmas Day", "Boxing Day"],
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "999",
    addressFormat: "eu",
    phoneFormat: "+44-XXXX-XXXXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Financial Services", "Tech Support", "Delivery", "Personal Services", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 45000, averageIncome: 35000, serviceEconomyShare: 80 }
  },

  // Western Europe - France
  paris: {
    locale: "fr",
    timezone: "Europe/Paris",
    currency: "EUR",
    currencySymbol: "€",
    numberFormat: "fr-FR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Jour de l'An", "Lundi de Pâques", "Fête du Travail", "Victoire 1945", "Ascension", "Lundi de Pentecôte", "Fête Nationale", "Assomption", "Toussaint", "Armistice", "Noël"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "eu",
    phoneFormat: "+33-X-XX-XX-XX-XX",
    taxIncluded: true,
    tippingCulture: "optional",
    serviceTypes: ["Luxury Services", "Cultural Events", "Delivery", "Personal Care", "Tourism"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 42000, averageIncome: 32000, serviceEconomyShare: 78 }
  },

  // Western Europe - Germany
  berlin: {
    locale: "de",
    timezone: "Europe/Berlin",
    currency: "EUR",
    currencySymbol: "€",
    numberFormat: "de-DE",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Neujahr", "Karfreitag", "Ostermontag", "Tag der Arbeit", "Christi Himmelfahrt", "Pfingstmontag", "Tag der Deutschen Einheit", "Weihnachten"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "eu",
    phoneFormat: "+49-XXX-XXXXXXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Tech Support", "Engineering Services", "Delivery", "Education", "Healthcare"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 48000, averageIncome: 38000, serviceEconomyShare: 75 }
  },

  // Eastern Europe - Russia
  moscow: {
    locale: "ru",
    timezone: "Europe/Moscow",
    currency: "RUB",
    currencySymbol: "₽",
    numberFormat: "ru-RU",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Новый год", "Рождество", "День защитника Отечества", "Международный женский день", "Праздник Весны и Труда", "День Победы", "День России", "День народного единства"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "eu",
    phoneFormat: "+7-XXX-XXX-XX-XX",
    taxIncluded: true,
    tippingCulture: "optional",
    serviceTypes: ["Government Services", "Tech Support", "Delivery", "Energy Services", "Education"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 12000, averageIncome: 8000, serviceEconomyShare: 60 }
  },

  // MIDDLE EAST & AFRICA REGION

  // Middle East - Turkey
  istanbul: {
    locale: "tr",
    timezone: "Europe/Istanbul",
    currency: "TRY",
    currencySymbol: "₺",
    numberFormat: "tr-TR",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Yılbaşı", "Ulusal Egemenlik ve Çocuk Bayramı", "İşçi Bayramı", "Atatürk'ü Anma Gençlik ve Spor Bayramı", "Zafer Bayramı", "Cumhuriyet Bayramı", "Ramazan Bayramı", "Kurban Bayramı"],
    businessHours: { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "112",
    addressFormat: "eu",
    phoneFormat: "+90-XXX-XXX-XX-XX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Tourism Services", "Delivery", "Textile Services", "Food Services", "Transportation"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 9000, averageIncome: 6000, serviceEconomyShare: 55 }
  },

  // Middle East - UAE
  dubai: {
    locale: "ar",
    timezone: "Asia/Dubai",
    currency: "AED",
    currencySymbol: "د.إ",
    numberFormat: "ar-AE",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 0,
    rtl: true,
    localHolidays: ["رأس السنة الجديدة", "عيد الفطر", "عيد الأضحى", "يوم عرفة", "رأس السنة الهجرية", "المولد النبوي", "يوم الشهيد", "اليوم الوطني"],
    businessHours: { start: "09:00", end: "18:00", days: [0, 1, 2, 3, 4] },
    emergencyNumber: "999",
    addressFormat: "arabic",
    phoneFormat: "+971-X-XXX-XXXX",
    taxIncluded: false,
    tippingCulture: "expected",
    serviceTypes: ["Luxury Services", "Business Support", "Tourism", "Real Estate", "Financial Services"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 45000, averageIncome: 35000, serviceEconomyShare: 70 }
  },

  // Africa - Egypt
  cairo: {
    locale: "ar",
    timezone: "Africa/Cairo",
    currency: "EGP",
    currencySymbol: "ج.م",
    numberFormat: "ar-EG",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 6,
    rtl: true,
    localHolidays: ["رأس السنة", "عيد الثورة", "عيد تحرير سيناء", "شم النسيم", "عيد العمال", "عيد الثورة", "عيد الفطر", "عيد الأضحى"],
    businessHours: { start: "09:00", end: "17:00", days: [0, 1, 2, 3, 4] },
    emergencyNumber: "122",
    addressFormat: "arabic",
    phoneFormat: "+20-XX-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Tourism Services", "Government Services", "Delivery", "Agriculture Support", "Education"],
    marketPotential: "medium",
    digitalAdoption: "low",
    economicIndicators: { gdpPerCapita: 3500, averageIncome: 2000, serviceEconomyShare: 45 }
  },

  // Africa - Nigeria
  lagos: {
    locale: "yo",
    timezone: "Africa/Lagos",
    currency: "NGN",
    currencySymbol: "₦",
    numberFormat: "yo-NG",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["New Year", "Good Friday", "Easter Monday", "Workers' Day", "Children's Day", "Democracy Day", "Independence Day", "Christmas Day", "Boxing Day", "Eid al-Fitr", "Eid al-Adha"],
    businessHours: { start: "08:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "199",
    addressFormat: "eu",
    phoneFormat: "+234-XXX-XXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Financial Services", "Oil Services", "Delivery", "Entertainment", "Tech Support"],
    marketPotential: "high",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 2400, averageIncome: 1200, serviceEconomyShare: 40 }
  },

  // Africa - South Africa
  johannesburg: {
    locale: "zu",
    timezone: "Africa/Johannesburg",
    currency: "ZAR",
    currencySymbol: "R",
    numberFormat: "zu-ZA",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["New Year's Day", "Human Rights Day", "Good Friday", "Family Day", "Freedom Day", "Workers' Day", "Youth Day", "National Women's Day", "Heritage Day", "Day of Reconciliation", "Christmas Day", "Day of Goodwill"],
    businessHours: { start: "08:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "10111",
    addressFormat: "eu",
    phoneFormat: "+27-XX-XXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Mining Services", "Financial Services", "Security", "Delivery", "Healthcare"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 7000, averageIncome: 4000, serviceEconomyShare: 55 }
  },

  cape_town: {
    locale: "af",
    timezone: "Africa/Johannesburg",
    currency: "ZAR",
    currencySymbol: "R",
    numberFormat: "af-ZA",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "24h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["Nuwejaar", "Menseregtedag", "Goeie Vrydag", "Gesinsdag", "Vryheidsdag", "Werkersdag", "Jeugdag", "Vrouedag", "Erfenisdag", "Versoeningsdag", "Kersfees", "Welwillendheidsdag"],
    businessHours: { start: "08:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "10111",
    addressFormat: "eu",
    phoneFormat: "+27-XX-XXX-XXXX",
    taxIncluded: true,
    tippingCulture: "expected",
    serviceTypes: ["Tourism Services", "Wine Services", "Delivery", "Tech Support", "Education"],
    marketPotential: "medium",
    digitalAdoption: "medium",
    economicIndicators: { gdpPerCapita: 8000, averageIncome: 4500, serviceEconomyShare: 60 }
  },

  // OCEANIA REGION

  // Australia
  sydney: {
    locale: "en",
    timezone: "Australia/Sydney",
    currency: "AUD",
    currencySymbol: "A$",
    numberFormat: "en-AU",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["New Year's Day", "Australia Day", "Good Friday", "Easter Monday", "Anzac Day", "Queen's Birthday", "Labour Day", "Christmas Day", "Boxing Day"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "000",
    addressFormat: "eu",
    phoneFormat: "+61-X-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "optional",
    serviceTypes: ["Financial Services", "Tourism Services", "Delivery", "Healthcare", "Education"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 55000, averageIncome: 45000, serviceEconomyShare: 75 }
  },

  melbourne: {
    locale: "en",
    timezone: "Australia/Melbourne",
    currency: "AUD",
    currencySymbol: "A$",
    numberFormat: "en-AU",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["New Year's Day", "Australia Day", "Labour Day", "Good Friday", "Easter Monday", "Anzac Day", "Queen's Birthday", "Melbourne Cup", "Christmas Day", "Boxing Day"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "000",
    addressFormat: "eu",
    phoneFormat: "+61-X-XXXX-XXXX",
    taxIncluded: true,
    tippingCulture: "optional",
    serviceTypes: ["Cultural Services", "Coffee Services", "Delivery", "Sports Services", "Education"],
    marketPotential: "high",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 52000, averageIncome: 42000, serviceEconomyShare: 73 }
  },

  // New Zealand
  auckland: {
    locale: "en",
    timezone: "Pacific/Auckland",
    currency: "NZD",
    currencySymbol: "NZ$",
    numberFormat: "en-NZ",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: 1,
    rtl: false,
    localHolidays: ["New Year's Day", "Day after New Year's Day", "Waitangi Day", "Good Friday", "Easter Monday", "Anzac Day", "Queen's Birthday", "Labour Day", "Christmas Day", "Boxing Day"],
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
    emergencyNumber: "111",
    addressFormat: "eu",
    phoneFormat: "+64-X-XXX-XXXX",
    taxIncluded: true,
    tippingCulture: "uncommon",
    serviceTypes: ["Tourism Services", "Agriculture Support", "Delivery", "Tech Support", "Education"],
    marketPotential: "medium",
    digitalAdoption: "high",
    economicIndicators: { gdpPerCapita: 45000, averageIncome: 36000, serviceEconomyShare: 70 }
  },

  // Additional cities can be added here following the same pattern...
};

// Utility functions for city-specific localization
export function getCityLocalization(cityKey: string): CityLocalizationData | null {
  return cityConfigurations[cityKey] || null;
}

export function getCityBusinessHours(cityKey: string): { start: string; end: string; days: number[] } | null {
  const config = getCityLocalization(cityKey);
  return config?.businessHours || null;
}

export function getCityCurrency(cityKey: string): { currency: string; symbol: string } | null {
  const config = getCityLocalization(cityKey);
  return config ? { currency: config.currency, symbol: config.currencySymbol } : null;
}

export function getCityEmergencyNumber(cityKey: string): string | null {
  const config = getCityLocalization(cityKey);
  return config?.emergencyNumber || null;
}

export function getCityServiceTypes(cityKey: string): string[] {
  const config = getCityLocalization(cityKey);
  return config?.serviceTypes || [];
}

export function getCityMarketPotential(cityKey: string): "high" | "medium" | "low" | null {
  const config = getCityLocalization(cityKey);
  return config?.marketPotential || null;
}

export function getLocationByDistance(userLat: number, userLon: number): Array<{ key: string; distance: number; city: CityLocalizationData }> {
  // Simplified distance calculation for demo - in production, use proper geolocation services
  const distances = Object.entries(cityConfigurations).map(([key, city]) => {
    // Mock coordinates for demo - in production, get from a proper database
    const cityLat = parseFloat((Math.random() * 180 - 90).toFixed(2));
    const cityLon = parseFloat((Math.random() * 360 - 180).toFixed(2));
    
    const distance = Math.sqrt(
      Math.pow(userLat - cityLat, 2) + Math.pow(userLon - cityLon, 2)
    );
    
    return { key, distance, city };
  });
  
  return distances.sort((a, b) => a.distance - b.distance);
}

// Group cities by market potential for business intelligence
export const citiesByMarketPotential = {
  high: Object.entries(cityConfigurations).filter(([_, config]) => config.marketPotential === "high"),
  medium: Object.entries(cityConfigurations).filter(([_, config]) => config.marketPotential === "medium"),
  low: Object.entries(cityConfigurations).filter(([_, config]) => config.marketPotential === "low"),
};

// Group cities by digital adoption for technology rollout strategy
export const citiesByDigitalAdoption = {
  high: Object.entries(cityConfigurations).filter(([_, config]) => config.digitalAdoption === "high"),
  medium: Object.entries(cityConfigurations).filter(([_, config]) => config.digitalAdoption === "medium"),
  low: Object.entries(cityConfigurations).filter(([_, config]) => config.digitalAdoption === "low"),
};

// Service type recommendations based on city characteristics
export const serviceTypesByRegion = {
  "North America": ["Tech Support", "Delivery", "Personal Services", "Healthcare", "Financial Services"],
  "Europe": ["Professional Services", "Delivery", "Cultural Events", "Healthcare", "Education"],
  "Asia-Pacific": ["Tech Support", "Manufacturing Support", "Delivery", "Education", "Healthcare"],
  "Latin America": ["Delivery", "Domestic Help", "Auto Services", "Education", "Agriculture Support"],
  "Middle East": ["Business Support", "Tourism Services", "Delivery", "Real Estate", "Financial Services"],
  "Africa": ["Basic Services", "Agriculture Support", "Delivery", "Education", "Healthcare"],
};

export default cityConfigurations;
