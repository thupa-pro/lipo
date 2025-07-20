"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Type,
  MousePointer,
  Volume2,
  VolumeX,
  Contrast,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Languages,
  Accessibility,
  Settings,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface AccessibilitySettings {
  // Visual
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  letterSpacing: number;
  highContrast: boolean;
  darkMode: boolean;
  reduceMotion: boolean;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  
  // Motor
  largerClickTargets: boolean;
  stickyHover: boolean;
  keyboardNavigation: boolean;
  reducedScrolling: boolean;
  
  // Cognitive
  simplifiedUI: boolean;
  focusIndicators: boolean;
  readingGuide: boolean;
  autoplayDisabled: boolean;
  
  // Audio
  soundEnabled: boolean;
  speechRate: number;
  speechVolume: number;
  backgroundAudioMuted: boolean;
  
  // Language
  language: string;
  textDirection: "ltr" | "rtl";
  numberFormat: string;
  dateFormat: string;
  currency: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  currentLanguage: Language;
  availableLanguages: Language[];
  changeLanguage: (languageCode: string) => void;
  translations: Record<string, string>;
  t: (key: string, fallback?: string) => string;
  announceToScreenReader: (message: string) => void;
  isAccessibilityPanelOpen: boolean;
  toggleAccessibilityPanel: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  fontFamily: "system",
  lineHeight: 1.5,
  letterSpacing: 0,
  highContrast: false,
  darkMode: false,
  reduceMotion: false,
  colorBlindMode: "none",
  largerClickTargets: false,
  stickyHover: false,
  keyboardNavigation: true,
  reducedScrolling: false,
  simplifiedUI: false,
  focusIndicators: true,
  readingGuide: false,
  autoplayDisabled: false,
  soundEnabled: true,
  speechRate: 1,
  speechVolume: 0.8,
  backgroundAudioMuted: false,
  language: "en",
  textDirection: "ltr",
  numberFormat: "en-US",
  dateFormat: "MM/dd/yyyy",
  currency: "USD",
};

const availableLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", rtl: true },
];

// Mock translations - in real app, these would come from i18n files
const translations: Record<string, Record<string, string>> = {
  en: {
    "accessibility.title": "Accessibility Settings",
    "accessibility.visual": "Visual",
    "accessibility.motor": "Motor",
    "accessibility.cognitive": "Cognitive", 
    "accessibility.audio": "Audio",
    "accessibility.language": "Language",
    "accessibility.fontSize": "Font Size",
    "accessibility.fontFamily": "Font Family",
    "accessibility.highContrast": "High Contrast",
    "accessibility.darkMode": "Dark Mode",
    "accessibility.reduceMotion": "Reduce Motion",
    "accessibility.reset": "Reset All Settings",
    "accessibility.save": "Save Settings",
    "language.select": "Select Language",
    "navigation.home": "Home",
    "navigation.search": "Search",
    "navigation.messages": "Messages",
    "navigation.profile": "Profile",
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
  },
  es: {
    "accessibility.title": "Configuración de Accesibilidad",
    "accessibility.visual": "Visual",
    "accessibility.motor": "Motor",
    "accessibility.cognitive": "Cognitivo",
    "accessibility.audio": "Audio",
    "accessibility.language": "Idioma",
    "accessibility.fontSize": "Tamaño de Fuente",
    "accessibility.fontFamily": "Familia de Fuente",
    "accessibility.highContrast": "Alto Contraste",
    "accessibility.darkMode": "Modo Oscuro",
    "accessibility.reduceMotion": "Reducir Movimiento",
    "language.select": "Seleccionar Idioma",
    "navigation.home": "Inicio",
    "navigation.search": "Buscar",
    "navigation.messages": "Mensajes",
    "navigation.profile": "Perfil",
  },
  fr: {
    "accessibility.title": "Paramètres d'Accessibilité",
    "accessibility.visual": "Visuel",
    "accessibility.motor": "Moteur",
    "accessibility.cognitive": "Cognitif",
    "accessibility.audio": "Audio",
    "accessibility.language": "Langue",
    "accessibility.fontSize": "Taille de Police",
    "accessibility.fontFamily": "Famille de Police",
    "accessibility.highContrast": "Contraste Élevé",
    "accessibility.darkMode": "Mode Sombre",
    "accessibility.reduceMotion": "Réduire le Mouvement",
    "language.select": "Sélectionner la Langue",
    "navigation.home": "Accueil",
    "navigation.search": "Rechercher",
    "navigation.messages": "Messages",
    "navigation.profile": "Profil",
  },
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(availableLanguages[0]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("loconomy-accessibility");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({ ...defaultSettings, ...parsed });
    }

    // Detect system preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettings(prev => ({ ...prev, reduceMotion: true }));
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setSettings(prev => ({ ...prev, darkMode: true }));
    }

    // Detect browser language
    const browserLang = navigator.language.split("-")[0];
    const supportedLang = availableLanguages.find(lang => lang.code === browserLang);
    if (supportedLang) {
      setCurrentLanguage(supportedLang);
      setSettings(prev => ({ ...prev, language: supportedLang.code }));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem("loconomy-accessibility", JSON.stringify(settings));
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty("--font-size-base", `${settings.fontSize}px`);
    root.style.setProperty("--line-height", settings.lineHeight.toString());
    root.style.setProperty("--letter-spacing", `${settings.letterSpacing}px`);
    
    // Apply font family
    if (settings.fontFamily !== "system") {
      root.style.setProperty("--font-family", settings.fontFamily);
    }
    
    // Apply theme
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    
    // Apply reduced motion
    if (settings.reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
    
    // Apply color blind mode
    if (settings.colorBlindMode !== "none") {
      root.classList.add(`colorblind-${settings.colorBlindMode}`);
    } else {
      root.classList.remove(...["colorblind-protanopia", "colorblind-deuteranopia", "colorblind-tritanopia"]);
    }
    
    // Apply text direction
    root.setAttribute("dir", settings.textDirection);
    
    // Apply larger click targets
    if (settings.largerClickTargets) {
      root.classList.add("large-click-targets");
    } else {
      root.classList.remove("large-click-targets");
    }
    
    // Apply focus indicators
    if (settings.focusIndicators) {
      root.classList.add("enhanced-focus");
    } else {
      root.classList.remove("enhanced-focus");
    }
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("loconomy-accessibility");
  };

  const changeLanguage = (languageCode: string) => {
    const language = availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      updateSetting("language", languageCode);
      updateSetting("textDirection", language.rtl ? "rtl" : "ltr");
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langTranslations = translations[currentLanguage.code] || translations.en;
    return langTranslations[key] || fallback || key;
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const toggleAccessibilityPanel = () => {
    setIsAccessibilityPanelOpen(!isAccessibilityPanelOpen);
  };

  const value: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    currentLanguage,
    availableLanguages,
    changeLanguage,
    translations: translations[currentLanguage.code] || translations.en,
    t,
    announceToScreenReader,
    isAccessibilityPanelOpen,
    toggleAccessibilityPanel,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <AccessibilityPanel />
      <SkipToContent />
      <ScreenReaderAnnouncements />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}

// Accessibility Panel Component
function AccessibilityPanel() {
  const { settings, updateSetting, resetSettings, t, isAccessibilityPanelOpen, toggleAccessibilityPanel, availableLanguages, changeLanguage } = useAccessibility();

  return (
    <>
      {/* Floating Accessibility Button */}
      <Button
        onClick={toggleAccessibilityPanel}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full shadow-lg"
        aria-label={t("accessibility.title", "Accessibility Settings")}
        title={t("accessibility.title", "Accessibility Settings")}
      >
        <Accessibility className="w-6 h-6" />
      </Button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isAccessibilityPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-background border-l border-border shadow-2xl z-40 overflow-y-auto"
          >
            <Card className="h-full rounded-none border-0">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="w-5 h-5" />
                    {t("accessibility.title", "Accessibility Settings")}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={toggleAccessibilityPanel}>
                    ×
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Language Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    {t("accessibility.language", "Language")}
                  </h3>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("language.select", "Select Language")}
                    </label>
                    <Select value={settings.language} onValueChange={changeLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.nativeName}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Visual Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t("accessibility.visual", "Visual")}
                  </h3>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("accessibility.fontSize", "Font Size")}: {settings.fontSize}px
                    </label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => updateSetting("fontSize", value)}
                      min={12}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("accessibility.fontFamily", "Font Family")}
                    </label>
                    <Select value={settings.fontFamily} onValueChange={(value) => updateSetting("fontFamily", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System Default</SelectItem>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                        <SelectItem value="OpenDyslexic">OpenDyslexic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      {t("accessibility.highContrast", "High Contrast")}
                    </label>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      {t("accessibility.darkMode", "Dark Mode")}
                    </label>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      {t("accessibility.reduceMotion", "Reduce Motion")}
                    </label>
                    <Switch
                      checked={settings.reduceMotion}
                      onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Color Blind Support
                    </label>
                    <Select value={settings.colorBlindMode} onValueChange={(value) => updateSetting("colorBlindMode", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                        <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                        <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Motor Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MousePointer className="w-4 h-4" />
                    {t("accessibility.motor", "Motor")}
                  </h3>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Larger Click Targets</label>
                    <Switch
                      checked={settings.largerClickTargets}
                      onCheckedChange={(checked) => updateSetting("largerClickTargets", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sticky Hover</label>
                    <Switch
                      checked={settings.stickyHover}
                      onCheckedChange={(checked) => updateSetting("stickyHover", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Enhanced Focus Indicators</label>
                    <Switch
                      checked={settings.focusIndicators}
                      onCheckedChange={(checked) => updateSetting("focusIndicators", checked)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Audio Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    {t("accessibility.audio", "Audio")}
                  </h3>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sound Effects</label>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Disable Autoplay</label>
                    <Switch
                      checked={settings.autoplayDisabled}
                      onCheckedChange={(checked) => updateSetting("autoplayDisabled", checked)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Reset Button */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={resetSettings}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t("accessibility.reset", "Reset All Settings")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Skip to Content Link
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:z-50"
    >
      Skip to main content
    </a>
  );
}

// Screen Reader Announcements
function ScreenReaderAnnouncements() {
  return (
    <div
      id="screen-reader-announcements"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}