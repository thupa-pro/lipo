import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

// Lazy load heavy components
import { LazyComponents, createRouteComponent } from "@/lib/utils/code-splitting";

// Import lightweight components directly (these can be server components)
import { HeroSection } from "@/app/components/hero-section";
import { StatsSection } from "@/app/components/stats-section";

// Create lazy-loaded components for heavy sections
const CategoriesSection = createRouteComponent(
  () => import("@/app/components/categories-section").then(mod => ({ default: mod.CategoriesSection })),
  "Categories"
);

const ProvidersSection = createRouteComponent(
  () => import("@/app/components/providers-section"),
  "Providers"
);

const TestimonialsSection = createRouteComponent(
  () => import("@/app/components/testimonials-section"),
  "Testimonials"
);

const MediaShowcase = createRouteComponent(
  () => import("@/app/components/media-showcase").then(mod => ({ default: mod.MediaShowcase })),
  "Media Showcase"
);

const EnhancedFeatureGallery = createRouteComponent(
  () => import("@/app/components/enhanced-feature-gallery").then(mod => ({ default: mod.EnhancedFeatureGallery })),
  "Feature Gallery"
);

const EnhancedProviderShowcase = createRouteComponent(
  () => import("@/app/components/enhanced-provider-showcase").then(mod => ({ default: mod.EnhancedProviderShowcase })),
  "Provider Showcase"
);

const CTASection = createRouteComponent(
  () => import("@/app/components/cta-section"),
  "Call to Action"
);

// Loading components for different sections
const SectionSkeleton = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} bg-gray-50 animate-pulse rounded-lg flex items-center justify-center`}>
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
      <div className="w-32 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
    </div>
  </div>
);

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  // Validate locale (this runs on server)
  const validLocales = ['en', 'es', 'fr', 'de'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  // Get translations on server side
  const t = await getTranslations('HomePage');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Critical above-the-fold content, keep as server component */}
      <HeroSection locale={locale} />

      {/* Stats Section - Lightweight, keep as server component */}
      <StatsSection />

      {/* Categories Section - Lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <CategoriesSection />
      </Suspense>

      {/* Providers Section - Heavy component, lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <ProvidersSection />
      </Suspense>

      {/* Enhanced Feature Gallery - Lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
        <EnhancedFeatureGallery />
      </Suspense>

      {/* Enhanced Provider Showcase - Lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <EnhancedProviderShowcase />
      </Suspense>

      {/* Media Showcase - Heavy media content, lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
        <MediaShowcase />
      </Suspense>

      {/* Testimonials Section - Lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <TestimonialsSection />
      </Suspense>

      {/* CTA Section - Final call to action, lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <CTASection />
      </Suspense>
    </div>
  );
}

// Generate metadata on server side for better SEO
export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = params;
  
  const t = await getTranslations('HomePage');
  
  return {
    title: t('meta.title') || 'Loconomy - Elite AI-Powered Local Services Platform',
    description: t('meta.description') || 'Experience the world\'s most advanced AI marketplace where elite professionals meet intelligent matching in under 90 seconds.',
    openGraph: {
      title: t('meta.title') || 'Loconomy - Elite AI-Powered Local Services Platform',
      description: t('meta.description') || 'Experience the world\'s most advanced AI marketplace where elite professionals meet intelligent matching in under 90 seconds.',
      locale: locale,
    },
  };
}
