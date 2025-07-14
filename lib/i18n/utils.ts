"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales, defaultLocale, type Locale } from "./config";

export function useLocaleRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if current path starts with a locale
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    // If no locale in path, redirect to default locale
    if (!pathnameHasLocale && pathname !== "/") {
      const preferredLocale =
        (localStorage.getItem("preferred-locale") as Locale) || defaultLocale;
      const newPath = `/${preferredLocale}${pathname}`;
      router.replace(newPath);
    }
  }, [pathname, router]);
}

export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  const browserLang = navigator.language.split("-")[0];
  return locales.includes(browserLang as Locale)
    ? (browserLang as Locale)
    : defaultLocale;
}

export function getCurrentLocale(pathname: string): Locale {
  const localeFromPath = pathname.split("/")[1];
  return locales.includes(localeFromPath as Locale)
    ? (localeFromPath as Locale)
    : defaultLocale;
}
