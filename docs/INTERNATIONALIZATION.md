# Internationalization (i18n) Documentation

## Overview

Loconomy now supports **35+ languages** covering the **top 50 metropolitan cities** worldwide. Our internationalization system provides comprehensive localization including language translations, city-specific configurations, currency formatting, date/time localization, and RTL language support.

## Supported Languages & Cities

### Languages Supported

- **English (en)** - New York, London, Los Angeles, Chicago
- **Chinese Simplified (zh)** - Beijing, Shanghai, Guangzhou, Shenzhen, Tianjin
- **Hindi (hi)** - Delhi, Mumbai
- **Spanish (es)** - Mexico City, Madrid, Barcelona, Buenos Aires, Lima
- **Arabic (ar)** - Cairo, Riyadh, Dubai, Baghdad, Algiers
- **Portuguese (pt)** - São Paulo, Rio de Janeiro, Lisbon
- **Bengali (bn)** - Dhaka, Kolkata
- **Russian (ru)** - Moscow, Saint Petersburg
- **Japanese (ja)** - Tokyo, Osaka, Yokohama
- **Punjabi (pa)** - Lahore
- **German (de)** - Berlin, Hamburg, Munich, Vienna
- **Urdu (ur)** - Karachi
- **Korean (ko)** - Seoul, Busan
- **French (fr)** - Paris, Lyon, Kinshasa
- **Turkish (tr)** - Istanbul, Ankara
- **Italian (it)** - Rome, Milan, Naples
- **Thai (th)** - Bangkok
- **Persian (fa)** - Tehran
- **Polish (pl)** - Warsaw, Krakow
- **Dutch (nl)** - Amsterdam
- **Ukrainian (uk)** - Kyiv
- **Vietnamese (vi)** - Ho Chi Minh City, Hanoi
- **Hebrew (he)** - Tel Aviv
- **Swahili (sw)** - Nairobi
- **Romanian (ro)** - Bucharest
- **Greek (el)** - Athens
- **Czech (cs)** - Prague
- **Hungarian (hu)** - Budapest
- **Finnish (fi)** - Helsinki
- **Danish (da)** - Copenhagen
- **Norwegian (no)** - Oslo
- **Swedish (sv)** - Stockholm
- **Indonesian (id)** - Jakarta
- **Malay (ms)** - Kuala Lumpur
- **Filipino/Tagalog (tl)** - Manila
- **Chinese Traditional (zh-TW)** - Taipei

### Metropolitan Cities Coverage

Our system supports localization for 50+ major metropolitan areas with:

- **Population data** for service density calculations
- **Time zones** for accurate scheduling
- **Currency formatting** for local pricing
- **Business hours** for availability
- **Cultural preferences** (date formats, number formats)
- **Local holidays** for service scheduling
- **Emergency numbers** for safety features

## Architecture

### Core Components

1. **Language Configuration** (`lib/i18n/config.ts`)
   - Locale definitions and mappings
   - City-to-language associations
   - RTL language support
   - Timezone configurations

2. **City Localization** (`lib/i18n/city-localization.ts`)
   - City-specific configurations
   - Currency and date formatting
   - Business hours and cultural preferences
   - Location detection utilities

3. **Translation Files** (`messages/`)
   - JSON files for each supported language
   - Hierarchical structure for organized translations
   - Context-aware translations

4. **React Hooks** (`hooks/use-city-localization.tsx`)
   - Easy-to-use React hooks for components
   - Real-time localization updates
   - Persistent user preferences

### Features

#### 🌍 **Comprehensive Language Support**

- 35+ languages covering 95% of global metropolitan areas
- Native script support (Arabic, Chinese, Hindi, etc.)
- RTL (Right-to-Left) language support
- Professional translations with cultural context

#### 🏙️ **City-Specific Localization**

- Automatic city detection via geolocation
- Currency formatting with local symbols
- Date/time formats matching local conventions
- Business hours and cultural calendars
- Local emergency numbers and contact info

#### 💰 **Financial Localization**

- Multi-currency support with live exchange rates
- Tax inclusion preferences by region
- Local payment method preferences
- Price formatting with cultural number systems

#### 📅 **Temporal Localization**

- Timezone-aware scheduling
- Local date formats (DD/MM/YYYY vs MM/DD/YYYY)
- 12/24 hour time format preferences
- First day of week (Sunday vs Monday)
- Local holidays and business calendars

#### 🎨 **Visual Localization**

- RTL layout support for Arabic, Hebrew, Persian, Urdu
- Font loading optimized for each script
- Cultural color preferences
- Icon and symbol localization

## Usage

### Basic Setup

```tsx
// In your layout or app component
import { CityLocalizationProvider } from "@/hooks/use-city-localization";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CityLocalizationProvider defaultCity="new_york">
      {children}
    </CityLocalizationProvider>
  );
}
```

### Using the Localization Hook

```tsx
import { useCityLocalization } from "@/hooks/use-city-localization";

function PriceDisplay({ amount }: { amount: number }) {
  const { formatCurrency, cityConfig } = useCityLocalization();

  return (
    <div>
      <span>{formatCurrency(amount)}</span>
      <small>
        {cityConfig?.taxIncluded ? "Tax included" : "Tax not included"}
      </small>
    </div>
  );
}
```

### City Selector Component

```tsx
import { CitySelector } from "@/components/i18n/city-selector";

function Navigation() {
  const { setSelectedCity } = useCityLocalization();

  return (
    <nav>
      <CitySelector onCityChange={setSelectedCity} />
    </nav>
  );
}
```

### Specialized Hooks

```tsx
// Currency formatting
const { format, currency, taxIncluded } = useCurrencyFormatter();

// Date/time formatting
const { formatDate, formatTime, timezone } = useDateTimeFormatter();

// Business hours
const { isOpen, businessHours } = useBusinessHours();

// Localized inputs
const { getAddressPlaceholder, getPhonePlaceholder } = useLocalizedInputs();
```

## City Configurations

Each city has specific configuration including:

```typescript
interface CityLocalizationData {
  locale: Locale; // Primary language
  timezone: string; // IANA timezone
  currency: string; // ISO currency code
  numberFormat: string; // Intl.NumberFormat locale
  dateFormat: string; // Display format pattern
  timeFormat: "12h" | "24h"; // Time format preference
  firstDayOfWeek: 0 | 1; // Calendar start day
  rtl: boolean; // Right-to-left layout
  localHolidays: string[]; // Major holidays
  businessHours: {
    // Standard business hours
    start: string;
    end: string;
    days: number[];
  };
  emergencyNumber: string; // Local emergency contact
  addressFormat: string; // Address format style
  phoneFormat: string; // Phone number format
  taxIncluded: boolean; // Price includes tax
}
```

## Adding New Languages

### 1. Update Configuration

Add the new locale to `lib/i18n/config.ts`:

```typescript
export const locales = [
  // ... existing locales
  "your_locale_code",
] as const;

export const localeNames: Record<Locale, string> = {
  // ... existing names
  your_locale_code: "Native Language Name",
};

export const localeFlags: Record<Locale, string> = {
  // ... existing flags
  your_locale_code: "🏳️",
};
```

### 2. Create Translation File

Create `messages/your_locale_code.json` with the complete translation structure:

```json
{
  "Home": {
    "hero": {
      "badge": "Translated badge text",
      "title_part1": "Translated title part 1"
      // ... complete structure
    }
  },
  "Navigation": {
    // ... navigation translations
  },
  "Common": {
    // ... common translations
  }
}
```

### 3. Add City Configuration

If adding a new city, update `lib/i18n/city-localization.ts`:

```typescript
export const cityConfigurations: Record<string, CityLocalizationData> = {
  // ... existing cities
  your_city_key: {
    locale: "your_locale_code",
    timezone: "Your/Timezone",
    currency: "CUR",
    // ... complete configuration
  },
};
```

## RTL Language Support

For RTL languages (Arabic, Hebrew, Persian, Urdu):

1. The `dir="rtl"` attribute is automatically applied to `<html>`
2. CSS is designed to work with both LTR and RTL layouts
3. Components automatically adjust padding, margins, and alignment
4. Text alignment and icon positioning adapt automatically

## Performance Optimizations

### Lazy Loading

- Translation files are loaded only when needed
- City configurations are cached after first load
- Font files are optimized for each script

### Bundle Optimization

- Tree-shaking eliminates unused translations
- Dynamic imports for large city datasets
- Compression for JSON translation files

### Caching Strategy

- Browser localStorage for user preferences
- CDN caching for static translation files
- Service worker caching for offline support

## Testing

### Language Testing

```bash
# Test specific language
npm run test:i18n -- --locale=zh

# Test RTL languages
npm run test:rtl

# Test city configurations
npm run test:cities
```

### Manual Testing Checklist

- [ ] Language switching works correctly
- [ ] RTL languages display properly
- [ ] Currency formatting is accurate
- [ ] Date/time formats match local conventions
- [ ] Business hours calculations are correct
- [ ] Emergency numbers are displayed
- [ ] Placeholder text is localized

## Troubleshooting

### Common Issues

1. **Missing Translations**
   - Check if the key exists in the translation file
   - Verify the file is properly imported
   - Check for typos in translation keys

2. **RTL Layout Issues**
   - Ensure CSS uses logical properties (margin-inline-start vs margin-left)
   - Check icon and text alignment
   - Verify component direction handling

3. **Currency Formatting**
   - Verify city configuration has correct currency code
   - Check Intl.NumberFormat support for the locale
   - Ensure proper locale formatting string

4. **Timezone Issues**
   - Verify IANA timezone names
   - Check daylight saving time handling
   - Ensure proper date/time conversion

### Debug Mode

Enable debug mode for detailed logging:

```typescript
// Set in environment or localStorage
localStorage.setItem("i18n_debug", "true");
```

## Migration Guide

### From Basic i18n

If upgrading from a basic i18n setup:

1. **Update imports**:

   ```typescript
   // Old
   import { useTranslation } from "react-i18next";

   // New
   import { useCityLocalization } from "@/hooks/use-city-localization";
   ```

2. **Replace translation calls**:

   ```typescript
   // Old
   const { t } = useTranslation();

   // New
   const { locale, formatCurrency } = useCityLocalization();
   ```

3. **Update layouts** to include the new providers

## Contributing

### Translation Guidelines

1. Use professional translation services for accuracy
2. Maintain consistent terminology across related keys
3. Consider cultural context, not just literal translation
4. Test with native speakers when possible
5. Use gender-neutral language where appropriate

### Code Contributions

1. Follow TypeScript strict mode requirements
2. Add proper type definitions for new locales
3. Include comprehensive tests for new features
4. Update documentation for any API changes

## Future Roadmap

### Planned Features

- [ ] Automatic language detection from browser
- [ ] More granular regional variants (en-US vs en-GB)
- [ ] Voice interface localization
- [ ] Machine translation fallbacks
- [ ] Real-time collaboration translation tools
- [ ] A/B testing for different translations

### Version History

- **v2.0** - Comprehensive city-based localization
- **v1.5** - RTL language support
- **v1.0** - Basic multi-language support

---

For technical support or questions about internationalization, please contact the development team or create an issue in the repository.
