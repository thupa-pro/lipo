"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useLocalStorage } from "./use-local-storage";
import {
  getCityConfiguration,
  formatCurrency,
  formatDate,
  formatTime,
  isBusinessHours,
  getLocalizedPlaceholder,
  type CityLocalizationData,
} from "@/lib/i18n/city-localization";
import { getLocaleFromCity, getTimezoneFromCity } from "@/lib/i18n/config";

interface CityLocalizationContextType {
  selectedCity: string | null;
  setSelectedCity: (city: string) => void;
  cityConfig: CityLocalizationData | null;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  isBusinessHours: (date?: Date) => boolean;
  getPlaceholder: (type: "address" | "phone") => string;
  timezone: string;
  locale: string;
  isRTL: boolean;
}

const CityLocalizationContext =
  createContext<CityLocalizationContextType | null>(null);

export function CityLocalizationProvider({
  children,
  defaultCity = "new_york",
}: {
  children: React.ReactNode;
  defaultCity?: string;
}) {
  const [selectedCity, setSelectedCity] = useLocalStorage<string>(
    "selectedCity",
    defaultCity,
  );
  const [cityConfig, setCityConfig] = useState<CityLocalizationData | null>(
    null,
  );

  useEffect(() => {
    if (selectedCity) {
      const config = getCityConfiguration(selectedCity);
      setCityConfig(config);
    }
  }, [selectedCity]);

  const formatCurrencyForCity = (amount: number) => {
    return selectedCity
      ? formatCurrency(amount, selectedCity)
      : amount.toString();
  };

  const formatDateForCity = (date: Date) => {
    return selectedCity
      ? formatDate(date, selectedCity)
      : date.toLocaleDateString();
  };

  const formatTimeForCity = (date: Date) => {
    return selectedCity
      ? formatTime(date, selectedCity)
      : date.toLocaleTimeString();
  };

  const isBusinessHoursForCity = (date?: Date) => {
    return selectedCity ? isBusinessHours(selectedCity, date) : true;
  };

  const getPlaceholderForCity = (type: "address" | "phone") => {
    return selectedCity ? getLocalizedPlaceholder(selectedCity, type) : "";
  };

  const timezone = selectedCity ? getTimezoneFromCity(selectedCity) : "UTC";
  const locale = selectedCity ? getLocaleFromCity(selectedCity) : "en";
  const isRTL = cityConfig?.rtl || false;

  const value: CityLocalizationContextType = {
    selectedCity,
    setSelectedCity,
    cityConfig,
    formatCurrency: formatCurrencyForCity,
    formatDate: formatDateForCity,
    formatTime: formatTimeForCity,
    isBusinessHours: isBusinessHoursForCity,
    getPlaceholder: getPlaceholderForCity,
    timezone,
    locale,
    isRTL,
  };

  return (
    <CityLocalizationContext.Provider value={value}>
      {children}
    </CityLocalizationContext.Provider>
  );
}

export function useCityLocalization() {
  const context = useContext(CityLocalizationContext);
  if (!context) {
    throw new Error(
      "useCityLocalization must be used within a CityLocalizationProvider",
    );
  }
  return context;
}

// Additional utility hooks
export function useBusinessHours() {
  const { isBusinessHours, cityConfig } = useCityLocalization();
  return {
    isOpen: isBusinessHours(),
    businessHours: cityConfig?.businessHours,
    checkTime: (date: Date) => isBusinessHours(date),
  };
}

export function useCurrencyFormatter() {
  const { formatCurrency, cityConfig } = useCityLocalization();
  return {
    format: formatCurrency,
    currency: cityConfig?.currency,
    taxIncluded: cityConfig?.taxIncluded || false,
  };
}

export function useDateTimeFormatter() {
  const { formatDate, formatTime, cityConfig } = useCityLocalization();
  return {
    formatDate,
    formatTime,
    timeFormat: cityConfig?.timeFormat || "24h",
    firstDayOfWeek: cityConfig?.firstDayOfWeek || 0,
    timezone: cityConfig?.timezone || "UTC",
  };
}

export function useLocalizedInputs() {
  const { getPlaceholder, cityConfig } = useCityLocalization();
  return {
    getAddressPlaceholder: () => getPlaceholder("address"),
    getPhonePlaceholder: () => getPlaceholder("phone"),
    phoneFormat: cityConfig?.phoneFormat,
    addressFormat: cityConfig?.addressFormat,
  };
}
