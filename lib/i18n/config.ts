import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Comprehensive locales supporting 100+ metropolitan cities worldwide
export const locales = [
  // Major Language Groups
  "en", // English - Global: NYC, London, LA, Chicago, Toronto, Sydney, Melbourne, Singapore, Dublin, Auckland
  "zh", // Chinese (Simplified) - China: Beijing, Shanghai, Guangzhou, Shenzhen, Tianjin, Chongqing, Wuhan, Xi'an
  "zh-TW", // Traditional Chinese - Taiwan, Hong Kong: Taipei, Hong Kong
  "hi", // Hindi - India: Delhi, Mumbai, Bangalore, Hyderabad, Pune, Chennai
  "es", // Spanish - Spain & Latin America: Madrid, Barcelona, Mexico City, Buenos Aires, Lima, Bogotá, Santiago
  "ar", // Arabic - MENA: Cairo, Riyadh, Dubai, Baghdad, Casablanca, Tunis, Khartoum, Alexandria, Amman, Beirut
  "pt", // Portuguese - Brazil & Portugal: São Paulo, Rio, Lisbon, Porto, Brasília, Salvador
  "bn", // Bengali - Bangladesh & India: Dhaka, Kolkata, Chittagong
  "ru", // Russian - Russia & CIS: Moscow, Saint Petersburg, Novosibirsk, Yekaterinburg, Kyiv, Minsk
  "ja", // Japanese - Japan: Tokyo, Osaka, Yokohama, Nagoya, Kyoto, Kobe
  "pa", // Punjabi - Pakistan & India: Lahore, Amritsar
  "de", // German - DACH region: Berlin, Hamburg, Munich, Vienna, Zurich, Frankfurt, Cologne
  "ur", // Urdu - Pakistan: Karachi, Islamabad, Faisalabad
  "ko", // Korean - South Korea: Seoul, Busan, Incheon, Daegu
  "fr", // French - France & Francophone: Paris, Lyon, Marseille, Montreal, Quebec City, Kinshasa, Algiers, Abidjan
  "tr", // Turkish - Turkey: Istanbul, Ankara, Izmir, Bursa
  "it", // Italian - Italy: Rome, Milan, Naples, Turin, Florence, Venice
  "th", // Thai - Thailand: Bangkok, Chiang Mai
  "fa", // Persian - Iran: Tehran, Isfahan, Mashhad, Shiraz
  "pl", // Polish - Poland: Warsaw, Krakow, Gdansk, Wroclaw
  "nl", // Dutch - Netherlands & Belgium: Amsterdam, Rotterdam, The Hague, Brussels, Antwerp
  "uk", // Ukrainian - Ukraine: Kyiv, Kharkiv, Odesa, Dnipro
  "vi", // Vietnamese - Vietnam: Ho Chi Minh City, Hanoi, Da Nang
  "he", // Hebrew - Israel: Tel Aviv, Jerusalem, Haifa
  "sw", // Swahili - East Africa: Nairobi, Dar es Salaam, Kampala
  "ro", // Romanian - Romania: Bucharest, Cluj-Napoca, Timișoara
  "el", // Greek - Greece: Athens, Thessaloniki
  "cs", // Czech - Czech Republic: Prague, Brno
  "hu", // Hungarian - Hungary: Budapest, Debrecen
  "fi", // Finnish - Finland: Helsinki, Tampere
  "da", // Danish - Denmark: Copenhagen, Aarhus
  "no", // Norwegian - Norway: Oslo, Bergen
  "sv", // Swedish - Sweden: Stockholm, Gothenburg, Malmö
  "id", // Indonesian - Indonesia: Jakarta, Surabaya, Bandung, Medan
  "ms", // Malay - Malaysia: Kuala Lumpur, George Town, Johor Bahru
  "tl", // Filipino/Tagalog - Philippines: Manila, Cebu City, Davao
  "am", // Amharic - Ethiopia: Addis Ababa
  "mg", // Malagasy - Madagascar: Antananarivo
  "yo", // Yoruba - Nigeria: Lagos, Ibadan
  "ha", // Hausa - Nigeria: Kano, Kaduna
  "ig", // Igbo - Nigeria: Onitsha, Enugu
  "zu", // Zulu - South Africa: Johannesburg, Durban
  "af", // Afrikaans - South Africa: Cape Town, Pretoria
  "xh", // Xhosa - South Africa: Port Elizabeth
  "bg", // Bulgarian - Bulgaria: Sofia, Plovdiv
  "hr", // Croatian - Croatia: Zagreb, Split
  "sr", // Serbian - Serbia: Belgrade, Novi Sad
  "sk", // Slovak - Slovakia: Bratislava, Košice
  "sl", // Slovenian - Slovenia: Ljubljana, Maribor
  "lv", // Latvian - Latvia: Riga
  "lt", // Lithuanian - Lithuania: Vilnius, Kaunas
  "et", // Estonian - Estonia: Tallinn, Tartu
  "mt", // Maltese - Malta: Valletta
  "mk", // Macedonian - North Macedonia: Skopje
  "al", // Albanian - Albania: Tirana
  "is", // Icelandic - Iceland: Reykjavik
  "ga", // Irish - Ireland: Dublin, Cork
  "cy", // Welsh - Wales: Cardiff, Swansea
  "eu", // Basque - Spain: Bilbao, San Sebastian
  "ca", // Catalan - Spain: Barcelona, Valencia
  "gl", // Galician - Spain: A Coruña, Vigo
  "ka", // Georgian - Georgia: Tbilisi, Batumi
  "hy", // Armenian - Armenia: Yerevan
  "az", // Azerbaijani - Azerbaijan: Baku
  "kk", // Kazakh - Kazakhstan: Almaty, Nur-Sultan
  "ky", // Kyrgyz - Kyrgyzstan: Bishkek
  "uz", // Uzbek - Uzbekistan: Tashkent, Samarkand
  "tj", // Tajik - Tajikistan: Dushanbe
  "tk", // Turkmen - Turkmenistan: Ashgabat
  "mn", // Mongolian - Mongolia: Ulaanbaatar
  "my", // Myanmar - Myanmar: Yangon, Mandalay
  "km", // Khmer - Cambodia: Phnom Penh, Siem Reap
  "lo", // Lao - Laos: Vientiane, Luang Prabang
  "si", // Sinhala - Sri Lanka: Colombo, Kandy
  "ta", // Tamil - India & Sri Lanka: Chennai, Madurai, Coimbatore
  "te", // Telugu - India: Hyderabad, Visakhapatnam, Vijayawada
  "kn", // Kannada - India: Bangalore, Mysore, Hubli
  "ml", // Malayalam - India: Kochi, Thiruvananthapuram, Kozhikode
  "or", // Odia - India: Bhubaneswar, Cuttack
  "gu", // Gujarati - India: Ahmedabad, Surat, Vadodara
  "mr", // Marathi - India: Mumbai, Pune, Nashik
  "ne", // Nepali - Nepal: Kathmandu, Pokhara
  "dz", // Dzongkha - Bhutan: Thimphu
  "ps", // Pashto - Afghanistan: Kabul, Kandahar
  "sd", // Sindhi - Pakistan: Hyderabad, Sukkur
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

// Comprehensive locale names in their native scripts
export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文 (简体)",
  "zh-TW": "中文 (繁體)",
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
  am: "አማርኛ",
  mg: "Malagasy",
  yo: "Yorùbá",
  ha: "Hausa",
  ig: "Igbo",
  zu: "isiZulu",
  af: "Afrikaans",
  xh: "isiXhosa",
  bg: "Български",
  hr: "Hrvatski",
  sr: "Српски",
  sk: "Slovenčina",
  sl: "Slovenščina",
  lv: "Latviešu",
  lt: "Lietuvių",
  et: "Eesti",
  mt: "Malti",
  mk: "Македонски",
  al: "Shqip",
  is: "Íslenska",
  ga: "Gaeilge",
  cy: "Cymraeg",
  eu: "Euskera",
  ca: "Català",
  gl: "Galego",
  ka: "ქართული",
  hy: "Հայերեն",
  az: "Azərbaycan",
  kk: "Қазақша",
  ky: "Кыргызча",
  uz: "O'zbek",
  tj: "Тоҷикӣ",
  tk: "Türkmen",
  mn: "Монгол",
  my: "မြန်မာ",
  km: "ខ្មែរ",
  lo: "ລາວ",
  si: "සිංහල",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  or: "ଓଡ଼ିଆ",
  gu: "ગુજરાતી",
  mr: "મરાઠી",
  ne: "नेपाली",
  dz: "རྫོང་ཁ",
  ps: "پښتو",
  sd: "سنڌي",
};

// Comprehensive flag mappings for all locales
export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸", zh: "🇨🇳", "zh-TW": "🇹🇼", hi: "🇮🇳", es: "🇪🇸", ar: "🇸🇦", pt: "🇧🇷",
  bn: "🇧🇩", ru: "🇷🇺", ja: "🇯🇵", pa: "🇵🇰", de: "🇩🇪", ur: "🇵🇰", ko: "🇰🇷",
  fr: "🇫🇷", tr: "🇹🇷", it: "🇮🇹", th: "🇹🇭", fa: "🇮🇷", pl: "🇵🇱", nl: "🇳🇱",
  uk: "🇺🇦", vi: "🇻🇳", he: "🇮🇱", sw: "🇰🇪", ro: "🇷🇴", el: "🇬🇷", cs: "🇨🇿",
  hu: "🇭🇺", fi: "🇫🇮", da: "🇩🇰", no: "🇳🇴", sv: "🇸🇪", id: "🇮🇩", ms: "🇲🇾",
  tl: "🇵🇭", am: "🇪🇹", mg: "🇲🇬", yo: "🇳🇬", ha: "🇳🇬", ig: "🇳🇬", zu: "🇿🇦",
  af: "🇿🇦", xh: "🇿🇦", bg: "🇧🇬", hr: "🇭🇷", sr: "🇷🇸", sk: "🇸🇰", sl: "🇸🇮",
  lv: "🇱🇻", lt: "🇱🇹", et: "🇪🇪", mt: "🇲🇹", mk: "🇲🇰", al: "🇦🇱", is: "🇮🇸",
  ga: "🇮🇪", cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", eu: "🏴󠁥󠁳󠁰󠁶󠁿", ca: "🏴󠁥󠁳󠁣󠁴󠁿", gl: "🏴󠁥󠁳󠁧󠁡󠁿", ka: "🇬🇪", hy: "🇦🇲",
  az: "🇦🇿", kk: "🇰🇿", ky: "🇰🇬", uz: "🇺🇿", tj: "🇹🇯", tk: "🇹🇲", mn: "🇲🇳",
  my: "🇲🇲", km: "🇰🇭", lo: "🇱🇦", si: "🇱🇰", ta: "🇮🇳", te: "🇮🇳", kn: "🇮🇳",
  ml: "🇮🇳", or: "🇮🇳", gu: "🇮🇳", mr: "🇮🇳", ne: "🇳🇵", dz: "🇧🇹", ps: "🇦🇫", sd: "🇵🇰",
};

// 100+ Metropolitan Cities optimized for Loconomy's hyperlocal service marketplace
export const metropolitanCities = {
  // ASIA-PACIFIC REGION (40 cities)
  
  // East Asia
  tokyo: { locale: "ja", region: "Asia/Tokyo", country: "Japan", population: 37400000, tier: "mega", economy: "developed" },
  shanghai: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 28500000, tier: "mega", economy: "emerging" },
  beijing: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 21700000, tier: "mega", economy: "emerging" },
  osaka: { locale: "ja", region: "Asia/Tokyo", country: "Japan", population: 19000000, tier: "large", economy: "developed" },
  guangzhou: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 15300000, tier: "large", economy: "emerging" },
  shenzhen: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 13400000, tier: "large", economy: "emerging" },
  seoul: { locale: "ko", region: "Asia/Seoul", country: "South Korea", population: 9900000, tier: "large", economy: "developed" },
  tianjin: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 14100000, tier: "large", economy: "emerging" },
  chongqing: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 16000000, tier: "large", economy: "emerging" },
  wuhan: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 12000000, tier: "large", economy: "emerging" },
  xian: { locale: "zh", region: "Asia/Shanghai", country: "China", population: 8500000, tier: "medium", economy: "emerging" },
  busan: { locale: "ko", region: "Asia/Seoul", country: "South Korea", population: 3400000, tier: "medium", economy: "developed" },
  yokohama: { locale: "ja", region: "Asia/Tokyo", country: "Japan", population: 3700000, tier: "medium", economy: "developed" },
  nagoya: { locale: "ja", region: "Asia/Tokyo", country: "Japan", population: 2300000, tier: "medium", economy: "developed" },
  kyoto: { locale: "ja", region: "Asia/Tokyo", country: "Japan", population: 1500000, tier: "medium", economy: "developed" },
  hong_kong: { locale: "zh-TW", region: "Asia/Hong_Kong", country: "Hong Kong", population: 7500000, tier: "large", economy: "developed" },
  taipei: { locale: "zh-TW", region: "Asia/Taipei", country: "Taiwan", population: 2700000, tier: "medium", economy: "developed" },

  // South Asia
  delhi: { locale: "hi", region: "Asia/Kolkata", country: "India", population: 32900000, tier: "mega", economy: "emerging" },
  mumbai: { locale: "hi", region: "Asia/Kolkata", country: "India", population: 20700000, tier: "mega", economy: "emerging" },
  kolkata: { locale: "bn", region: "Asia/Kolkata", country: "India", population: 13200000, tier: "large", economy: "emerging" },
  bangalore: { locale: "kn", region: "Asia/Kolkata", country: "India", population: 13200000, tier: "large", economy: "emerging" },
  hyderabad: { locale: "te", region: "Asia/Kolkata", country: "India", population: 10000000, tier: "large", economy: "emerging" },
  chennai: { locale: "ta", region: "Asia/Kolkata", country: "India", population: 11000000, tier: "large", economy: "emerging" },
  pune: { locale: "mr", region: "Asia/Kolkata", country: "India", population: 7400000, tier: "medium", economy: "emerging" },
  ahmedabad: { locale: "gu", region: "Asia/Kolkata", country: "India", population: 8300000, tier: "medium", economy: "emerging" },
  dhaka: { locale: "bn", region: "Asia/Dhaka", country: "Bangladesh", population: 22600000, tier: "mega", economy: "developing" },
  karachi: { locale: "ur", region: "Asia/Karachi", country: "Pakistan", population: 16100000, tier: "large", economy: "developing" },
  lahore: { locale: "pa", region: "Asia/Karachi", country: "Pakistan", population: 13100000, tier: "large", economy: "developing" },
  colombo: { locale: "si", region: "Asia/Colombo", country: "Sri Lanka", population: 5600000, tier: "medium", economy: "developing" },
  kathmandu: { locale: "ne", region: "Asia/Kathmandu", country: "Nepal", population: 1600000, tier: "small", economy: "developing" },

  // Southeast Asia
  jakarta: { locale: "id", region: "Asia/Jakarta", country: "Indonesia", population: 10600000, tier: "large", economy: "emerging" },
  manila: { locale: "tl", region: "Asia/Manila", country: "Philippines", population: 13900000, tier: "large", economy: "emerging" },
  bangkok: { locale: "th", region: "Asia/Bangkok", country: "Thailand", population: 10700000, tier: "large", economy: "emerging" },
  ho_chi_minh_city: { locale: "vi", region: "Asia/Ho_Chi_Minh", country: "Vietnam", population: 9000000, tier: "large", economy: "emerging" },
  hanoi: { locale: "vi", region: "Asia/Ho_Chi_Minh", country: "Vietnam", population: 8100000, tier: "medium", economy: "emerging" },
  kuala_lumpur: { locale: "ms", region: "Asia/Kuala_Lumpur", country: "Malaysia", population: 8000000, tier: "medium", economy: "emerging" },
  singapore: { locale: "en", region: "Asia/Singapore", country: "Singapore", population: 5900000, tier: "medium", economy: "developed" },
  surabaya: { locale: "id", region: "Asia/Jakarta", country: "Indonesia", population: 2900000, tier: "medium", economy: "emerging" },
  bandung: { locale: "id", region: "Asia/Jakarta", country: "Indonesia", population: 2500000, tier: "medium", economy: "emerging" },
  medan: { locale: "id", region: "Asia/Jakarta", country: "Indonesia", population: 2300000, tier: "medium", economy: "emerging" },
  phnom_penh: { locale: "km", region: "Asia/Phnom_Penh", country: "Cambodia", population: 2300000, tier: "small", economy: "developing" },
  yangon: { locale: "my", region: "Asia/Yangon", country: "Myanmar", population: 7400000, tier: "medium", economy: "developing" },

  // AMERICAS REGION (25 cities)
  
  // North America
  new_york: { locale: "en", region: "America/New_York", country: "USA", population: 18800000, tier: "mega", economy: "developed" },
  los_angeles: { locale: "en", region: "America/Los_Angeles", country: "USA", population: 12400000, tier: "large", economy: "developed" },
  chicago: { locale: "en", region: "America/Chicago", country: "USA", population: 9500000, tier: "large", economy: "developed" },
  dallas: { locale: "en", region: "America/Chicago", country: "USA", population: 7700000, tier: "medium", economy: "developed" },
  houston: { locale: "en", region: "America/Chicago", country: "USA", population: 7200000, tier: "medium", economy: "developed" },
  washington_dc: { locale: "en", region: "America/New_York", country: "USA", population: 6300000, tier: "medium", economy: "developed" },
  philadelphia: { locale: "en", region: "America/New_York", country: "USA", population: 6100000, tier: "medium", economy: "developed" },
  atlanta: { locale: "en", region: "America/New_York", country: "USA", population: 6000000, tier: "medium", economy: "developed" },
  phoenix: { locale: "en", region: "America/Phoenix", country: "USA", population: 4900000, tier: "medium", economy: "developed" },
  boston: { locale: "en", region: "America/New_York", country: "USA", population: 4900000, tier: "medium", economy: "developed" },
  toronto: { locale: "en", region: "America/Toronto", country: "Canada", population: 6200000, tier: "medium", economy: "developed" },
  montreal: { locale: "fr", region: "America/Montreal", country: "Canada", population: 4300000, tier: "medium", economy: "developed" },
  vancouver: { locale: "en", region: "America/Vancouver", country: "Canada", population: 2600000, tier: "small", economy: "developed" },
  mexico_city: { locale: "es", region: "America/Mexico_City", country: "Mexico", population: 21600000, tier: "mega", economy: "emerging" },

  // South America
  sao_paulo: { locale: "pt", region: "America/Sao_Paulo", country: "Brazil", population: 22400000, tier: "mega", economy: "emerging" },
  rio_de_janeiro: { locale: "pt", region: "America/Sao_Paulo", country: "Brazil", population: 13600000, tier: "large", economy: "emerging" },
  buenos_aires: { locale: "es", region: "America/Argentina/Buenos_Aires", country: "Argentina", population: 15200000, tier: "large", economy: "emerging" },
  lima: { locale: "es", region: "America/Lima", country: "Peru", population: 10900000, tier: "large", economy: "emerging" },
  bogota: { locale: "es", region: "America/Bogota", country: "Colombia", population: 11000000, tier: "large", economy: "emerging" },
  santiago: { locale: "es", region: "America/Santiago", country: "Chile", population: 6800000, tier: "medium", economy: "emerging" },
  caracas: { locale: "es", region: "America/Caracas", country: "Venezuela", population: 2900000, tier: "medium", economy: "developing" },
  brasilia: { locale: "pt", region: "America/Sao_Paulo", country: "Brazil", population: 3100000, tier: "medium", economy: "emerging" },
  salvador: { locale: "pt", region: "America/Sao_Paulo", country: "Brazil", population: 2900000, tier: "medium", economy: "emerging" },
  belo_horizonte: { locale: "pt", region: "America/Sao_Paulo", country: "Brazil", population: 2500000, tier: "medium", economy: "emerging" },
  montevideo: { locale: "es", region: "America/Montevideo", country: "Uruguay", population: 1700000, tier: "small", economy: "emerging" },

  // EUROPE REGION (25 cities)
  
  // Western Europe
  london: { locale: "en", region: "Europe/London", country: "UK", population: 9600000, tier: "large", economy: "developed" },
  paris: { locale: "fr", region: "Europe/Paris", country: "France", population: 11000000, tier: "large", economy: "developed" },
  madrid: { locale: "es", region: "Europe/Madrid", country: "Spain", population: 6700000, tier: "medium", economy: "developed" },
  barcelona: { locale: "ca", region: "Europe/Madrid", country: "Spain", population: 5600000, tier: "medium", economy: "developed" },
  rome: { locale: "it", region: "Europe/Rome", country: "Italy", population: 4300000, tier: "medium", economy: "developed" },
  milan: { locale: "it", region: "Europe/Rome", country: "Italy", population: 3200000, tier: "medium", economy: "developed" },
  berlin: { locale: "de", region: "Europe/Berlin", country: "Germany", population: 3700000, tier: "medium", economy: "developed" },
  munich: { locale: "de", region: "Europe/Berlin", country: "Germany", population: 1500000, tier: "small", economy: "developed" },
  hamburg: { locale: "de", region: "Europe/Berlin", country: "Germany", population: 1900000, tier: "small", economy: "developed" },
  frankfurt: { locale: "de", region: "Europe/Berlin", country: "Germany", population: 750000, tier: "small", economy: "developed" },
  amsterdam: { locale: "nl", region: "Europe/Amsterdam", country: "Netherlands", population: 1200000, tier: "small", economy: "developed" },
  brussels: { locale: "nl", region: "Europe/Brussels", country: "Belgium", population: 1200000, tier: "small", economy: "developed" },
  zurich: { locale: "de", region: "Europe/Zurich", country: "Switzerland", population: 400000, tier: "small", economy: "developed" },
  vienna: { locale: "de", region: "Europe/Vienna", country: "Austria", population: 1900000, tier: "small", economy: "developed" },
  lisbon: { locale: "pt", region: "Europe/Lisbon", country: "Portugal", population: 2900000, tier: "medium", economy: "developed" },
  dublin: { locale: "ga", region: "Europe/Dublin", country: "Ireland", population: 1400000, tier: "small", economy: "developed" },

  // Eastern Europe
  moscow: { locale: "ru", region: "Europe/Moscow", country: "Russia", population: 12600000, tier: "large", economy: "emerging" },
  saint_petersburg: { locale: "ru", region: "Europe/Moscow", country: "Russia", population: 5400000, tier: "medium", economy: "emerging" },
  warsaw: { locale: "pl", region: "Europe/Warsaw", country: "Poland", population: 1800000, tier: "small", economy: "emerging" },
  prague: { locale: "cs", region: "Europe/Prague", country: "Czech Republic", population: 1300000, tier: "small", economy: "developed" },
  budapest: { locale: "hu", region: "Europe/Budapest", country: "Hungary", population: 1800000, tier: "small", economy: "emerging" },
  bucharest: { locale: "ro", region: "Europe/Bucharest", country: "Romania", population: 1900000, tier: "small", economy: "emerging" },
  sofia: { locale: "bg", region: "Europe/Sofia", country: "Bulgaria", population: 1400000, tier: "small", economy: "emerging" },
  athens: { locale: "el", region: "Europe/Athens", country: "Greece", population: 3800000, tier: "medium", economy: "developed" },
  zagreb: { locale: "hr", region: "Europe/Zagreb", country: "Croatia", population: 800000, tier: "small", economy: "emerging" },

  // MIDDLE EAST & AFRICA REGION (15 cities)
  
  // Middle East
  istanbul: { locale: "tr", region: "Europe/Istanbul", country: "Turkey", population: 15500000, tier: "large", economy: "emerging" },
  tehran: { locale: "fa", region: "Asia/Tehran", country: "Iran", population: 9100000, tier: "large", economy: "emerging" },
  riyadh: { locale: "ar", region: "Asia/Riyadh", country: "Saudi Arabia", population: 7000000, tier: "medium", economy: "developing" },
  dubai: { locale: "ar", region: "Asia/Dubai", country: "UAE", population: 3400000, tier: "medium", economy: "developed" },
  tel_aviv: { locale: "he", region: "Asia/Jerusalem", country: "Israel", population: 4300000, tier: "medium", economy: "developed" },
  baghdad: { locale: "ar", region: "Asia/Baghdad", country: "Iraq", population: 7200000, tier: "medium", economy: "developing" },
  amman: { locale: "ar", region: "Asia/Amman", country: "Jordan", population: 2100000, tier: "small", economy: "developing" },
  beirut: { locale: "ar", region: "Asia/Beirut", country: "Lebanon", population: 2200000, tier: "small", economy: "developing" },

  // Africa
  cairo: { locale: "ar", region: "Africa/Cairo", country: "Egypt", population: 20900000, tier: "mega", economy: "developing" },
  lagos: { locale: "yo", region: "Africa/Lagos", country: "Nigeria", population: 15300000, tier: "large", economy: "developing" },
  johannesburg: { locale: "zu", region: "Africa/Johannesburg", country: "South Africa", population: 5600000, tier: "medium", economy: "emerging" },
  cape_town: { locale: "af", region: "Africa/Johannesburg", country: "South Africa", population: 4600000, tier: "medium", economy: "emerging" },
  nairobi: { locale: "sw", region: "Africa/Nairobi", country: "Kenya", population: 4900000, tier: "medium", economy: "developing" },
  casablanca: { locale: "ar", region: "Africa/Casablanca", country: "Morocco", population: 3700000, tier: "medium", economy: "developing" },
  addis_ababa: { locale: "am", region: "Africa/Addis_Ababa", country: "Ethiopia", population: 5200000, tier: "medium", economy: "developing" },

  // OCEANIA REGION (3 cities)
  sydney: { locale: "en", region: "Australia/Sydney", country: "Australia", population: 5300000, tier: "medium", economy: "developed" },
  melbourne: { locale: "en", region: "Australia/Melbourne", country: "Australia", population: 5100000, tier: "medium", economy: "developed" },
  auckland: { locale: "en", region: "Pacific/Auckland", country: "New Zealand", population: 1700000, tier: "small", economy: "developed" },
} as const;

// Utility functions for city and locale management
export function getLocaleFromCity(cityKey: string): Locale {
  const city = metropolitanCities[cityKey as keyof typeof metropolitanCities];
  return city?.locale || defaultLocale;
}

export function getTimezoneFromCity(cityKey: string): string {
  const city = metropolitanCities[cityKey as keyof typeof metropolitanCities];
  return city?.region || "America/New_York";
}

export function getCityData(cityKey: string) {
  return metropolitanCities[cityKey as keyof typeof metropolitanCities];
}

// Cities grouped by economic development and market potential for Loconomy
export const cityTiers = {
  mega: Object.entries(metropolitanCities).filter(([_, city]) => city.tier === "mega"),
  large: Object.entries(metropolitanCities).filter(([_, city]) => city.tier === "large"),
  medium: Object.entries(metropolitanCities).filter(([_, city]) => city.tier === "medium"),
  small: Object.entries(metropolitanCities).filter(([_, city]) => city.tier === "small"),
} as const;

export const economyTypes = {
  developed: Object.entries(metropolitanCities).filter(([_, city]) => city.economy === "developed"),
  emerging: Object.entries(metropolitanCities).filter(([_, city]) => city.economy === "emerging"),
  developing: Object.entries(metropolitanCities).filter(([_, city]) => city.economy === "developing"),
} as const;
