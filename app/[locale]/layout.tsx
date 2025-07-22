import type React from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Metadata } from "next";

// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'] as const;
type Locale = typeof locales[number];

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

// Validate and get locale
function getValidLocale(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  notFound();
}

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = getValidLocale(params.locale);
  
  // Locale-specific metadata
  const titles = {
    en: "Loconomy - Elite AI-Powered Local Services Platform",
    es: "Loconomy - Plataforma Elite de Servicios Locales con IA",
    fr: "Loconomy - Plateforme Elite de Services Locaux IA",
    de: "Loconomy - Elite KI-gestützte lokale Dienstleistungsplattform",
    it: "Loconomy - Piattaforma Elite di Servizi Locali con IA",
    pt: "Loconomy - Plataforma Elite de Serviços Locais com IA",
    ja: "Loconomy - エリートAI搭載ローカルサービスプラットフォーム",
    ko: "Loconomy - 엘리트 AI 기반 지역 서비스 플랫폼",
    zh: "Loconomy - 精英人工智能本地服务平台",
  };

  const descriptions = {
    en: "Experience the world's most advanced AI marketplace where elite professionals meet intelligent matching in under 90 seconds.",
    es: "Experimenta el mercado de IA más avanzado del mundo donde profesionales élite se encuentran con emparejamiento inteligente en menos de 90 segundos.",
    fr: "Découvrez le marché IA le plus avancé au monde où les professionnels d'élite rencontrent un appariement intelligent en moins de 90 secondes.",
    de: "Erleben Sie den fortschrittlichsten KI-Marktplatz der Welt, wo Elite-Profis auf intelligentes Matching in unter 90 Sekunden treffen.",
    it: "Vivi il marketplace IA più avanzato al mondo dove professionisti d'élite incontrano abbinamenti intelligenti in meno di 90 secondi.",
    pt: "Experimente o marketplace de IA mais avançado do mundo onde profissionais de elite encontram correspondência inteligente em menos de 90 segundos.",
    ja: "90秒以内でエリート専門家とインテリジェントマッチングが出会う、世界最先端のAIマーケットプレイスを体験してください。",
    ko: "90초 이내에 엘리트 전문가와 지능형 매칭이 만나는 세계 최고의 AI 마켓플레이스를 경험하세요.",
    zh: "体验世界上最先进的AI市场，精英专业人士与智能匹配在90秒内相遇。",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map(l => [l, `/${l}`])
      ),
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      locale: locale === 'en' ? 'en_US' : 
              locale === 'es' ? 'es_ES' :
              locale === 'fr' ? 'fr_FR' :
              locale === 'de' ? 'de_DE' :
              locale === 'it' ? 'it_IT' :
              locale === 'pt' ? 'pt_BR' :
              locale === 'ja' ? 'ja_JP' :
              locale === 'ko' ? 'ko_KR' :
              'zh_CN',
    },
  };
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Locale Layout Component
 * 
 * This layout handles locale-specific functionality without creating 
 * duplicate HTML structure. It works as a nested layout under the root layout.
 * 
 * Key responsibilities:
 * - Locale validation and i18n message loading
 * - Locale-specific metadata generation
 * - Setting up NextIntl context for the locale
 * - NO HTML/body elements (handled by root layout)
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Validate locale
  const locale = getValidLocale(params.locale);

  // Load messages for the locale
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback to English if locale messages not found
    console.warn(`Messages for locale ${locale} not found, falling back to English`);
    messages = (await import(`../../messages/en.json`)).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div 
        lang={locale} 
        dir={locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr'}
        className="locale-container"
        data-locale={locale}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
