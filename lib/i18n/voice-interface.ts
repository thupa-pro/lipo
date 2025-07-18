import { type Locale } from "./config";

// Voice interface configuration for each locale
export interface VoiceConfig {
  locale: Locale;
  speechLang: string;
  speechVoice?: string;
  speechRate: number;
  speechPitch: number;
  recognitionLang: string;
  keywords: {
    search: string[];
    book: string[];
    cancel: string[];
    help: string[];
    navigate: string[];
    yes: string[];
    no: string[];
  };
  phrases: {
    welcome: string;
    listening: string;
    notUnderstood: string;
    searching: string;
    found: string;
    error: string;
  };
}

// Voice configurations for supported languages
export const voiceConfigs: Record<Locale, VoiceConfig> = {
  en: {
    locale: "en",
    speechLang: "en-US",
    speechRate: 1.0,
    speechPitch: 1.0,
    recognitionLang: "en-US",
    keywords: {
      search: ["search", "find", "look for", "get me"],
      book: ["book", "reserve", "schedule", "order"],
      cancel: ["cancel", "stop", "abort", "exit"],
      help: ["help", "assist", "support"],
      navigate: ["go to", "open", "show me"],
      yes: ["yes", "yeah", "sure", "okay", "confirm"],
      no: ["no", "nope", "cancel", "stop"],
    },
    phrases: {
      welcome: "Welcome to Loconomy. How can I help you today?",
      listening: "I'm listening...",
      notUnderstood: "I didn't understand that. Could you please repeat?",
      searching: "Searching for services...",
      found: "I found several options for you.",
      error: "Sorry, there was an error. Please try again.",
    },
  },
  zh: {
    locale: "zh",
    speechLang: "zh-CN",
    speechRate: 0.9,
    speechPitch: 1.1,
    recognitionLang: "zh-CN",
    keywords: {
      search: ["搜索", "查找", "寻找", "找到"],
      book: ["预订", "预约", "订购", "安排"],
      cancel: ["取消", "停止", "退出"],
      help: ["帮助", "协助", "支持"],
      navigate: ["去", "打开", "显示"],
      yes: ["是", "好的", "确认", "可以"],
      no: ["不", "不是", "取消", "停止"],
    },
    phrases: {
      welcome: "欢迎来到Loconomy。今天我可以为您做什么？",
      listening: "我在听...",
      notUnderstood: "我没有理解。请您再说一遍？",
      searching: "正在搜索服务...",
      found: "我为您找到了几个选项。",
      error: "抱歉，出现了错误。请再试一次。",
    },
  },
  hi: {
    locale: "hi",
    speechLang: "hi-IN",
    speechRate: 0.9,
    speechPitch: 1.0,
    recognitionLang: "hi-IN",
    keywords: {
      search: ["खोजें", "ढूंढें", "देखें", "मिलाएं"],
      book: ["बुक करें", "आरक्षित करें", "ऑर्डर करें"],
      cancel: ["रद्द करें", "बंद करें", "रोकें"],
      help: ["मदद", "सहायता", "सपोर्ट"],
      navigate: ["जाएं", "खोलें", "दिखाएं"],
      yes: ["हां", "जी हां", "ठीक है", "पुष्टि करें"],
      no: ["नहीं", "ना", "रद्द करें"],
    },
    phrases: {
      welcome: "Loconomy में आपका स्वागत है। आज मैं आपकी कैसे मदद कर सकता हूं?",
      listening: "मैं सुन रहा हूं...",
      notUnderstood: "मैं समझ नहीं पाया। कृपया दोहराएं?",
      searching: "सेवाएं खोजी जा रही हैं...",
      found: "मैंने आपके लिए कई विकल्प पाए हैं।",
      error: "माफ करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    },
  },
  es: {
    locale: "es",
    speechLang: "es-ES",
    speechRate: 1.0,
    speechPitch: 1.0,
    recognitionLang: "es-ES",
    keywords: {
      search: ["buscar", "encontrar", "buscar", "conseguir"],
      book: ["reservar", "programar", "pedir", "ordenar"],
      cancel: ["cancelar", "parar", "salir"],
      help: ["ayuda", "asistir", "soporte"],
      navigate: ["ir a", "abrir", "mostrar"],
      yes: ["sí", "claro", "vale", "confirmar"],
      no: ["no", "cancelar", "parar"],
    },
    phrases: {
      welcome: "Bienvenido a Loconomy. ¿Cómo puedo ayudarte hoy?",
      listening: "Estoy escuchando...",
      notUnderstood: "No entendí eso. ¿Podrías repetir?",
      searching: "Buscando servicios...",
      found: "Encontré varias opciones para ti.",
      error: "Lo siento, hubo un error. Por favor intenta de nuevo.",
    },
  },
  ar: {
    locale: "ar",
    speechLang: "ar-SA",
    speechRate: 0.9,
    speechPitch: 1.1,
    recognitionLang: "ar-SA",
    keywords: {
      search: ["ابحث", "اعثر", "ابحث عن", "أحضر لي"],
      book: ["احجز", "اطلب", "رتب", "اطلب"],
      cancel: ["ألغي", "توقف", "اخرج"],
      help: ["مساعدة", "مساعد", "دعم"],
      navigate: ["اذهب إلى", "افتح", "أرني"],
      yes: ["نعم", "أجل", "حسناً", "موافق"],
      no: ["لا", "ألغي", "توقف"],
    },
    phrases: {
      welcome: "مرحباً بك في Loconomy. كيف يمكنني مساعدتك اليوم؟",
      listening: "أنا أستمع...",
      notUnderstood: "لم أفهم ذلك. هل يمكنك الإعادة؟",
      searching: "البحث عن الخدمات...",
      found: "وجدت عدة خيارات لك.",
      error: "آسف، حدث خطأ. يرجى المحاولة مرة أخرى.",
    },
  },
  ja: {
    locale: "ja",
    speechLang: "ja-JP",
    speechRate: 0.8,
    speechPitch: 1.2,
    recognitionLang: "ja-JP",
    keywords: {
      search: ["検索", "探す", "見つける", "探して"],
      book: ["予約", "ブック", "注文", "予約する"],
      cancel: ["キャンセル", "停止", "終了"],
      help: ["ヘルプ", "助けて", "サポート"],
      navigate: ["行く", "開く", "表示して"],
      yes: ["はい", "そうです", "OK", "確認"],
      no: ["いいえ", "ダメ", "キャンセル"],
    },
    phrases: {
      welcome: "Loconomyへようこそ。今日はどのようにお手伝いできますか？",
      listening: "聞いています...",
      notUnderstood: "理解できませんでした。もう一度お願いします。",
      searching: "サービスを検索中...",
      found: "いくつかのオプションを見つけました。",
      error: "申し訳ありません、エラーが発生しました。もう一度お試しください。",
    },
  },
  ru: {
    locale: "ru",
    speechLang: "ru-RU",
    speechRate: 1.0,
    speechPitch: 1.0,
    recognitionLang: "ru-RU",
    keywords: {
      search: ["искать", "найти", "поиск", "найдите"],
      book: ["забронировать", "заказать", "записаться"],
      cancel: ["отменить", "остановить", "выйти"],
      help: ["помощь", "помочь", "поддержка"],
      navigate: ["перейти", "открыть", "показать"],
      yes: ["да", "конечно", "хорошо", "подтвердить"],
      no: ["нет", "отменить", "стоп"],
    },
    phrases: {
      welcome: "Добро пожаловать в Loconomy. Как я могу помочь вам сегодня?",
      listening: "Я слушаю...",
      notUnderstood: "Я не понял. Не могли бы вы повторить?",
      searching: "Поиск услуг...",
      found: "Я нашел несколько вариантов для вас.",
      error: "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.",
    },
  },
  de: {
    locale: "de",
    speechLang: "de-DE",
    speechRate: 1.0,
    speechPitch: 1.0,
    recognitionLang: "de-DE",
    keywords: {
      search: ["suchen", "finden", "suche", "holen"],
      book: ["buchen", "reservieren", "bestellen"],
      cancel: ["abbrechen", "stoppen", "beenden"],
      help: ["hilfe", "helfen", "unterstützung"],
      navigate: ["gehen zu", "öffnen", "zeigen"],
      yes: ["ja", "natürlich", "okay", "bestätigen"],
      no: ["nein", "abbrechen", "stopp"],
    },
    phrases: {
      welcome: "Willkommen bei Loconomy. Wie kann ich Ihnen heute helfen?",
      listening: "Ich höre zu...",
      notUnderstood:
        "Das habe ich nicht verstanden. Könnten Sie das wiederholen?",
      searching: "Suche nach Dienstleistungen...",
      found: "Ich habe mehrere Optionen für Sie gefunden.",
      error:
        "Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.",
    },
  },
  ko: {
    locale: "ko",
    speechLang: "ko-KR",
    speechRate: 0.9,
    speechPitch: 1.1,
    recognitionLang: "ko-KR",
    keywords: {
      search: ["검색", "찾기", "찾아줘", "검색해줘"],
      book: ["예약", "예약하기", "주문", "신청"],
      cancel: ["취소", "중단", "나가기"],
      help: ["도움", "도와줘", "지원"],
      navigate: ["가기", "열기", "보여줘"],
      yes: ["네", "예", "좋아", "확인"],
      no: ["아니요", "안돼", "취소"],
    },
    phrases: {
      welcome: "Loconomy에 오신 것을 환영합니다. 오늘 어떻게 도와드릴까요?",
      listening: "듣고 있습니다...",
      notUnderstood: "이해하지 못했습니다. 다시 말씀해 주시겠어요?",
      searching: "서비스를 검색하고 있습니다...",
      found: "여러 옵션을 찾았습니다.",
      error: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.",
    },
  },
  fr: {
    locale: "fr",
    speechLang: "fr-FR",
    speechRate: 1.0,
    speechPitch: 1.0,
    recognitionLang: "fr-FR",
    keywords: {
      search: ["chercher", "trouver", "rechercher", "obtenir"],
      book: ["réserver", "programmer", "commander"],
      cancel: ["annuler", "arrêter", "quitter"],
      help: ["aide", "aider", "support"],
      navigate: ["aller à", "ouvrir", "montrer"],
      yes: ["oui", "bien sûr", "d'accord", "confirmer"],
      no: ["non", "annuler", "arrêter"],
    },
    phrases: {
      welcome:
        "Bienvenue chez Loconomy. Comment puis-je vous aider aujourd'hui?",
      listening: "J'écoute...",
      notUnderstood: "Je n'ai pas compris. Pourriez-vous répéter?",
      searching: "Recherche de services...",
      found: "J'ai trouvé plusieurs options pour vous.",
      error: "Désolé, il y a eu une erreur. Veuillez réessayer.",
    },
  },
} as Record<Locale, VoiceConfig>;

// Add default configs for remaining locales
const defaultConfig: Omit<VoiceConfig, "locale"> = {
  speechLang: "en-US",
  speechRate: 1.0,
  speechPitch: 1.0,
  recognitionLang: "en-US",
  keywords: voiceConfigs.en.keywords,
  phrases: voiceConfigs.en.phrases,
};

// Fill in missing locales with defaults
(
  [
    "pt",
    "bn",
    "pa",
    "ur",
    "tr",
    "it",
    "th",
    "fa",
    "pl",
    "nl",
    "uk",
    "vi",
    "he",
    "sw",
    "ro",
    "el",
    "cs",
    "hu",
    "fi",
    "da",
    "no",
    "sv",
    "id",
    "ms",
    "tl",
    "zh-TW",
  ] as Locale[]
).forEach((locale) => {
  if (!voiceConfigs[locale]) {
    voiceConfigs[locale] = {
      ...defaultConfig,
      locale,
    } as VoiceConfig;
  }
});

// Voice interface controller
export class VoiceInterface {
  private config: VoiceConfig;
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private callbacks: {
    onResult?: (text: string, confidence: number) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  } = {};

  constructor(locale: Locale) {
    this.config = voiceConfigs[locale] || voiceConfigs.en;
    this.synthesis = window.speechSynthesis;
    this.initRecognition();
  }

  private initRecognition(): void {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.config.recognitionLang;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();
        this.speak(this.config.phrases.listening);
      };

      this.recognition.onresult = (event) => {
        const result = event.results[0][0];
        this.callbacks.onResult?.(result.transcript, result.confidence);
      };

      this.recognition.onerror = (event) => {
        this.callbacks.onError?.(event.error);
        this.speak(this.config.phrases.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onEnd?.();
      };
    }
  }

  setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = callbacks;
  }

  speak(
    text: string,
    options: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(),
  ): void {
    if (!this.synthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.config.speechLang;
    utterance.rate = this.config.speechRate;
    utterance.pitch = this.config.speechPitch;

    // Try to use preferred voice if available
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.lang === this.config.speechLang &&
        voice.name.includes(this.config.speechVoice || ""),
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synthesis.speak(utterance);
  }

  startListening(): void {
    if (!this.recognition || this.isListening) return;

    this.recognition.start();
  }

  stopListening(): void {
    if (!this.recognition || !this.isListening) return;

    this.recognition.stop();
  }

  processCommand(text: string): { action: string; data?: any } | null {
    const lowerText = text.toLowerCase();

    // Check for search commands
    if (this.matchesKeywords(lowerText, this.config.keywords.search)) {
      const query = this.extractQuery(lowerText, this.config.keywords.search);
      return { action: "search", data: { query } };
    }

    // Check for booking commands
    if (this.matchesKeywords(lowerText, this.config.keywords.book)) {
      return { action: "book" };
    }

    // Check for cancel commands
    if (this.matchesKeywords(lowerText, this.config.keywords.cancel)) {
      return { action: "cancel" };
    }

    // Check for help commands
    if (this.matchesKeywords(lowerText, this.config.keywords.help)) {
      return { action: "help" };
    }

    // Check for navigation commands
    if (this.matchesKeywords(lowerText, this.config.keywords.navigate)) {
      const destination = this.extractQuery(
        lowerText,
        this.config.keywords.navigate,
      );
      return { action: "navigate", data: { destination } };
    }

    // Check for yes/no responses
    if (this.matchesKeywords(lowerText, this.config.keywords.yes)) {
      return { action: "confirm" };
    }

    if (this.matchesKeywords(lowerText, this.config.keywords.no)) {
      return { action: "deny" };
    }

    return null;
  }

  private matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  }

  private extractQuery(text: string, keywords: string[]): string {
    for (const keyword of keywords) {
      const index = text.indexOf(keyword.toLowerCase());
      if (index !== -1) {
        return text.substring(index + keyword.length).trim();
      }
    }
    return text;
  }

  welcome(): void {
    this.speak(this.config.phrases.welcome);
  }

  confirmSearch(resultsCount: number): void {
    this.speak(
      this.config.phrases.found.replace("{count}", resultsCount.toString()),
    );
  }

  notUnderstood(): void {
    this.speak(this.config.phrases.notUnderstood);
  }

  isSupported(): boolean {
    return (
      !!(window.SpeechRecognition || window.webkitSpeechRecognition) &&
      !!window.speechSynthesis
    );
  }

  changeLocale(locale: Locale): void {
    this.config = voiceConfigs[locale] || voiceConfigs.en;
    this.initRecognition();
  }
}

// Voice interface React hook
export function useVoiceInterface(locale: Locale) {
  const [voiceInterface] = useState(() => new VoiceInterface(locale));
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(voiceInterface.isSupported());

    voiceInterface.setCallbacks({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: (text, confidence) => {
        console.log("Voice result:", text, "Confidence:", confidence);
      },
      onError: (error) => {
        console.error("Voice error:", error);
        setIsListening(false);
      },
    });

    return () => {
      voiceInterface.stopListening();
    };
  }, [voiceInterface]);

  useEffect(() => {
    voiceInterface.changeLocale(locale);
  }, [locale, voiceInterface]);

  return {
    voiceInterface,
    isListening,
    isSupported,
    startListening: () => voiceInterface.startListening(),
    stopListening: () => voiceInterface.stopListening(),
    speak: (text: string) => voiceInterface.speak(text),
  };
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
