"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

interface IntlProviderProps {
  locale: string;
  messages: any;
  children: ReactNode;
}

export function IntlProvider({
  locale,
  messages,
  children,
}: IntlProviderProps) {
  return (
    <ErrorBoundary>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
