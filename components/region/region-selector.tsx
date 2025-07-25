"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Globe,
  MapPin,
  DollarSign,
  Shield,
  Loader2,
  Clock
} from "lucide-react";
import { REGIONS, getRegionConfig, detectUserRegion, type RegionConfig } from "@/lib/region-config"

interface RegionSelectorProps {
  onRegionChange?: (region: RegionConfig) => void
  currentRegion?: string
}

export default function RegionSelector({ onRegionChange, currentRegion }: RegionSelectorProps) {
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>(currentRegion || "US") // Default, to 'US' initially
  const [regionConfig, setRegionConfig] = useState<RegionConfig>(getRegionConfig(selectedRegionCode))
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)

  useEffect(() => {
    const loadRegion = async () => {
      setIsLoadingLocation(true)
      const detectedCode = await detectUserRegion()
      setSelectedRegionCode(detectedCode)
      const config = getRegionConfig(detectedCode)
      setRegionConfig(config)
      onRegionChange?.(config)
      setIsLoadingLocation(false)
    }

    if (!currentRegion) { // Only auto-detect if no currentRegion is provided
      loadRegion()
    } else {
      // If currentRegion is, provided, just set it and its config
      const config = getRegionConfig(currentRegion)
      setSelectedRegionCode(currentRegion)
      setRegionConfig(config)
      onRegionChange?.(config)
      setIsLoadingLocation(false)
    }
  }, [currentRegion, onRegionChange]) // Depend on currentRegion to re-evaluate if it changes externally

  useEffect(() => {
    // This useEffect handles changes from the dropdown
    const config = getRegionConfig(selectedRegionCode)
    setRegionConfig(config)
    onRegionChange?.(config)
  }, [selectedRegionCode, onRegionChange])

  const handleRegionChange = (newRegionCode: string) => {
    setSelectedRegionCode(newRegionCode)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(regionConfig.locale, {
      style: "currency",
      currency: regionConfig.currency,
    }).format(amount)
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat(regionConfig.locale, {
      timeZone: regionConfig.timezone,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Region Settings
          </CardTitle>
          <CardDescription>Select your region to customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Region</label>
            {isLoadingLocation ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-muted-foreground">Detecting location...</span>
              </div>
            ) : (
              <Select value={selectedRegionCode} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(REGIONS).map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {region.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Currency</span>
                <Badge variant="outline" className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {regionConfig.currency}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Timezone</span>
                <Badge variant="outline" className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {regionConfig.timezone.split("/")[1]}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Languages</span>
                <div className="flex gap-1">
                  {regionConfig.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">GDPR Compliance</span>
                <Badge variant={regionConfig.compliance.gdpr ? "default" : "secondary"}>
                  {regionConfig.compliance.gdpr ? "Required" : "N/A"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Residency</span>
                <Badge variant={regionConfig.compliance.dataResidency ? "default" : "secondary"}>
                  {regionConfig.compliance.dataResidency ? "Local" : "Global"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Background Checks</span>
                <Badge variant={regionConfig.features.backgroundChecks ? "default" : "secondary"}>
                  {regionConfig.features.backgroundChecks ? "Available" : "N/A"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Localization Preview</CardTitle>
          <CardDescription>See how content appears in your selected region</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Sample Pricing</h4>
              <div className="space-y-1 text-sm">
                <div>House Cleaning: {formatCurrency(75)}</div>
                <div>Handyman Service: {formatCurrency(45)}/hr</div>
                <div>Moving Help: {formatCurrency(120)}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Date & Time Format</h4>
              <div className="space-y-1 text-sm">
                <div>Current: {formatDateTime(new Date())}</div>
                <div>Locale: {regionConfig.locale}</div>
                <div>Timezone: {regionConfig.timezone}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Regional Compliance</h4>
                <p className="text-sm text-blue-700">
                  {regionConfig.compliance.gdpr && "GDPR compliance is enabled for EU users. "}
                  {regionConfig.compliance.ccpa && "CCPA compliance is enabled for California users. "}
                  {regionConfig.compliance.dataResidency && "Data is stored within your region. "}
                  All regional requirements are automatically handled.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}