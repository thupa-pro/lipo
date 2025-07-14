export interface RegionConfig {
  code: string
  name: string
  currency: string
  locale: string
  timezone: string
  languages: string[]
  compliance: {
    gdpr: boolean
    ccpa: boolean
    dataResidency: boolean
  }
  features: {
    escrowPayments: boolean
    backgroundChecks: boolean
    insurance: boolean
  }
}

export const REGIONS: Record<string, RegionConfig> = {
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    timezone: "America/New_York",
    languages: ["en", "es"],
    compliance: {
      gdpr: false,
      ccpa: true,
      dataResidency: false,
    },
    features: {
      escrowPayments: true,
      backgroundChecks: true,
      insurance: true,
    },
  },
  EU: {
    code: "EU",
    name: "European Union",
    currency: "EUR",
    locale: "en-GB",
    timezone: "Europe/London",
    languages: ["en", "de", "fr", "es", "it"],
    compliance: {
      gdpr: true,
      ccpa: false,
      dataResidency: true,
    },
    features: {
      escrowPayments: true,
      backgroundChecks: false,
      insurance: false,
    },
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    timezone: "America/Toronto",
    languages: ["en", "fr"],
    compliance: {
      gdpr: false,
      ccpa: false,
      dataResidency: true,
    },
    features: {
      escrowPayments: true,
      backgroundChecks: true,
      insurance: true,
    },
  },
  AU: {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    locale: "en-AU",
    timezone: "Australia/Sydney",
    languages: ["en"],
    compliance: {
      gdpr: false,
      ccpa: false,
      dataResidency: true,
    },
    features: {
      escrowPayments: true,
      backgroundChecks: true,
      insurance: false,
    },
  },
  AS: {
    code: "AS",
    name: "Asia",
    currency: "USD", // Using USD for simplicity, could be JPY, SGD, etc.
    locale: "en-SG", // Singapore English
    timezone: "Asia/Singapore",
    languages: ["en", "zh", "ja", "ko"],
    compliance: {
      gdpr: false,
      ccpa: false,
      dataResidency: true,
    },
    features: {
      escrowPayments: true,
      backgroundChecks: false,
      insurance: false,
    },
  },
  SA: {
    code: "SA",
    name: "South America",
    currency: "USD", // Using USD for simplicity, could be BRL, ARS, etc.
    locale: "es-AR", // Argentina Spanish
    timezone: "America/Argentina/Buenos_Aires",
    languages: ["es", "pt"],
    compliance: {
      gdpr: false,
      ccpa: false,
      dataResidency: false,
    },
    features: {
      escrowPayments: true,
      backgroundChecks: false,
      insurance: false,
    },
  },
  AF: {
    code: "AF",
    name: "Africa",
    currency: "USD", // Using USD for simplicity, could be ZAR, NGN, etc.
    locale: "en-ZA", // South Africa English
    timezone: "Africa/Johannesburg",
    languages: ["en", "fr", "ar"],
    compliance: {
      gdpr: false,
      ccpa: false,
      dataResidency: false,
    },
    features: {
      escrowPayments: true,
      backgroundChecks: false,
      insurance: false,
    },
  },
}

export function getRegionConfig(regionCode: string): RegionConfig {
  return REGIONS[regionCode] || REGIONS.US
}

export async function detectUserRegion(): Promise<string> {
  if (typeof window === "undefined") {
    return "US" // Default for server-side rendering
  }

  return new Promise((resolve) => {
    const fallbackToTimezone = () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (timezone.includes("Europe/")) return "EU"
      if (timezone.includes("America/Toronto")) return "CA"
      if (timezone.includes("Australia/")) return "AU"
      if (timezone.includes("Asia/")) return "AS"
      if (timezone.includes("America/Sao_Paulo") || timezone.includes("America/Argentina/")) return "SA"
      if (timezone.includes("Africa/")) return "AF"
      return "US" // Default to US if no specific region is matched
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // In a real application, you would use a geocoding service
          // (e.g., Google Maps Geocoding API, OpenStreetMap Nominatim)
          // to convert latitude/longitude to a country code or region.
          // For this demo, we'll make a simplified assumption based on common coordinates.

          // Example: Simple checks for regions
          if (latitude > 24 && latitude < 50 && longitude > -125 && longitude < -65) {
            resolve("US")
          } else if (latitude > 35 && latitude < 70 && longitude > -10 && longitude < 30) {
            resolve("EU")
          } else if (latitude > 40 && latitude < 85 && longitude > -140 && longitude < -50) {
            resolve("CA")
          } else if (latitude > -45 && latitude < -10 && longitude > 110 && longitude < 155) {
            resolve("AU")
          } else if (latitude > -10 && latitude < 80 && longitude > 60 && longitude < 180) {
            resolve("AS")
          } else if (latitude > -60 && latitude < 15 && longitude > -90 && longitude < -30) {
            resolve("SA")
          } else if (latitude > -40 && latitude < 40 && longitude > -20 && longitude < 60) {
            resolve("AF")
          }
          else {
            resolve(fallbackToTimezone())
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          resolve(fallbackToTimezone()) // Fallback on error
        },
        {
          timeout: 5000, // 5 seconds timeout
          maximumAge: 600000, // Use cached position if less than 10 minutes old
          enableHighAccuracy: false, // Prefer faster response over high accuracy
        },
      )
    } else {
      resolve(fallbackToTimezone()) // Geolocation not supported
    }
  })
}