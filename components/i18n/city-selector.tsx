"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Globe, TrendingUp, DollarSign, Users} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  metropolitanCities,
  cityTiers,
  economyTypes,
  localeFlags,
  type, Locale
} from "@/lib/i18n/config";
import {
  cityConfigurations,
  citiesByMarketPotential,
  citiesByDigitalAdoption,
  type, CityLocalizationData
} from "@/lib/i18n/city-localization";

interface CitySelectorProps {
  selectedCity?: string;
  onCitySelect: (cityKey: string, cityData: CityLocalizationData) => void;
  className?: string;
}

interface CityInfo {
  key: string;
  data: typeof metropolitanCities[keyof typeof metropolitanCities];
  localization: CityLocalizationData;
}

// Region groupings for 100+ cities
const regionGroups = {
  "Asia-Pacific": {
    icon: "🌏",
    description: "High-growth markets with massive urbanization",
    countries: ["Japan", "China", "South Korea", "Taiwan", "Hong Kong", "India", "Bangladesh", "Pakistan", "Sri Lanka", "Nepal", "Indonesia", "Philippines", "Thailand", "Vietnam", "Malaysia", "Singapore", "Cambodia", "Myanmar"],
  },
  "Americas": {
    icon: "🌎",
    description: "Mature and emerging markets with strong service economies",
    countries: ["USA", "Canada", "Mexico", "Brazil", "Argentina", "Peru", "Colombia", "Chile", "Venezuela", "Uruguay"],
  },
  "Europe": {
    icon: "🌍",
    description: "Developed markets with high digital adoption",
    countries: ["UK", "France", "Germany", "Spain", "Italy", "Netherlands", "Belgium", "Switzerland", "Austria", "Portugal", "Ireland", "Russia", "Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Greece", "Croatia"],
  },
  "Middle East & Africa": {
    icon: "🌍",
    description: "Emerging markets with growing middle class",
    countries: ["Turkey", "UAE", "Saudi Arabia", "Israel", "Iran", "Iraq", "Jordan", "Lebanon", "Egypt", "Nigeria", "South Africa", "Kenya", "Ethiopia", "Morocco"],
  },
  "Oceania": {
    icon: "🏝️",
    description: "Developed markets with high living standards",
    countries: ["Australia", "New Zealand"],
  },
} as const;

const getTierIcon = (tier: string) => {
  switch (tier) {
    case "mega": return "🏙️";
    case "large": return "🌆";
    case "medium": return "🏘️";
    case "small": return "🏠";
    default: return "📍";
  }
};

const getEconomyColor = (economy: string) => {
  switch (economy) {
    case "developed": return "bg-green-100 text-green-800 border-green-200";
    case "emerging": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "developing": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getMarketPotentialColor = (potential: string) => {
  switch (potential) {
    case "high": return "text-green-600";
    case "medium": return "text-yellow-600";
    case "low": return "text-red-600";
    default: return "text-gray-600";
  }
};

export default function CitySelector({ selectedCity, onCitySelect, className }: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedEconomy, setSelectedEconomy] = useState<string>("all");

  // Combine city data with localization info
  const allCities: CityInfo[] = useMemo(() => {
    return Object.entries(metropolitanCities).map(([key, data]) => ({
      key,
      data,
      localization: cityConfigurations[key] || {
        locale: data.locale,
        timezone: data.region,
        currency: "USD",
        currencySymbol: "$",
        numberFormat: "en-US",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h" as const,
        firstDayOfWeek: 0,
        rtl: false,
        localHolidays: [],
        businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] },
        emergencyNumber: "911",
        addressFormat: "us" as const,
        phoneFormat: "+1-XXX-XXX-XXXX",
        taxIncluded: false,
        tippingCulture: "expected" as const,
        serviceTypes: ["General Services"],
        marketPotential: "medium" as const,
        digitalAdoption: "medium" as const,
        economicIndicators: { gdpPerCapita: 20000, averageIncome: 15000, serviceEconomyShare: 50 },
      },
    }));
  }, []);

  // Filter cities based on search and filters
  const filteredCities = useMemo(() => {
    return allCities.filter((city) => {
      const matchesSearch = 
        city.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.data.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.localization.serviceTypes.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesRegion = selectedRegion === "all" || 
        Object.entries(regionGroups).some(([region, info]) => 
          region === selectedRegion && info.countries.includes(city.data.country)
        );

      const matchesTier = selectedTier === "all" || city.data.tier === selectedTier;
      const matchesEconomy = selectedEconomy === "all" || city.data.economy === selectedEconomy;

      return matchesSearch && matchesRegion && matchesTier && matchesEconomy;
    });
  }, [allCities, searchQuery, selectedRegion, selectedTier, selectedEconomy]);

  // Group cities by region
  const citiesByRegion = useMemo(() => {
    const grouped: Record<string, CityInfo[]> = {};
    
    Object.entries(regionGroups).forEach(([region, info]) => {
      grouped[region] = filteredCities.filter(city => 
        info.countries.includes(city.data.country)
      );
    });

    return grouped;
  }, [filteredCities]);

  // Statistics
  const stats = useMemo(() => {
    const totalPopulation = filteredCities.reduce((sum, city) => sum + city.data.population, 0);
    const avgGDP = filteredCities.reduce((sum, city) => sum + city.localization.economicIndicators.gdpPerCapita, 0) / filteredCities.length;
    const highPotentialCities = filteredCities.filter(city => city.localization.marketPotential === "high").length;
    const highDigitalCities = filteredCities.filter(city => city.localization.digitalAdoption === "high").length;

    return {
      totalCities: filteredCities.length,
      totalPopulation: Math.round(totalPopulation / 1000000),
      avgGDP: Math.round(avgGDP),
      highPotentialCities,
      highDigitalCities,
    };
  }, [filteredCities]);

  const handleCitySelect = (city: CityInfo) => {
    onCitySelect(city.key, city.localization);
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header & Stats */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Global Market Presence
          </h2>
          <p className="text-muted-foreground text-lg">
            Loconomy serves 100+ metropolitan cities worldwide, connecting hyperlocal services across continents
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCities}</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalPopulation}M</div>
              <div className="text-sm text-muted-foreground">Total Population</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">${stats.avgGDP.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Avg GDP/Capita</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.highPotentialCities}</div>
              <div className="text-sm text-muted-foreground">High Potential</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-600">{stats.highDigitalCities}</div>
              <div className="text-sm text-muted-foreground">High Digital</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search cities, countries, or service types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Regions</option>
            {Object.keys(regionGroups).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Sizes</option>
            <option value="mega">Mega Cities (10M+)</option>
            <option value="large">Large Cities (5-10M)</option>
            <option value="medium">Medium Cities (1-5M)</option>
            <option value="small">Small Cities (1M-)</option>
          </select>

          <select
            value={selectedEconomy}
            onChange={(e) => setSelectedEconomy(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Economies</option>
            <option value="developed">Developed</option>
            <option value="emerging">Emerging</option>
            <option value="developing">Developing</option>
          </select>
        </div>
      </div>

      {/* Cities Grid by Region */}
      <Tabs value={selectedRegion === "all" ? "regions" : "list"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regions">By Region</TabsTrigger>
          <TabsTrigger value="list">City List</TabsTrigger>
        </TabsList>

        <TabsContent value="regions" className="space-y-6">
          {Object.entries(regionGroups).map(([region, info]) => {
            const cities = citiesByRegion[region] || [];
            if (cities.length === 0) return null;

            return (
              <Card key={region}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{info.icon}</span>
                    {region}
                    <Badge variant="secondary">{cities.length} cities</Badge>
                  </CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {cities.map((city) => (
                      <Button
                        key={city.key}
                        variant={selectedCity === city.key ? "default" : "outline"}
                        className="h-auto p-4 justify-start"
                        onClick={() => handleCitySelect(city)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="text-2xl">
                            {localeFlags[city.data.locale as Locale] || "🏙️"}
                          </div>
                          <div className="text-left space-y-1 flex-1 min-w-0">
                            <div className="font-semibold capitalize truncate">
                              {city.key.replace(/_/g, " ")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {city.data.country}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span>{getTierIcon(city.data.tier)}</span>
                              <span className="text-muted-foreground">
                                {(city.data.population / 1000000).toFixed(1)}M
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs px-1 py-0", getEconomyColor(city.data.economy))}
                              >
                                {city.data.economy}
                              </Badge>
                              <div className={cn("text-xs", getMarketPotentialColor(city.localization.marketPotential))}>
                                <TrendingUp className="w-3 h-3 inline mr-1" />
                                {city.localization.marketPotential}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCities.map((city) => (
              <Card
                key={city.key}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedCity === city.key && "ring-2 ring-primary"
                )}
                onClick={() => handleCitySelect(city)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">
                      {localeFlags[city.data.locale as Locale] || "🏙️"}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold capitalize">
                          {city.key.replace(/_/g, " ")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {city.data.country} • {(city.data.population / 1000000).toFixed(1)}M people
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={getEconomyColor(city.data.economy)}>
                          {city.data.economy}
                        </Badge>
                        <Badge variant="outline">
                          {getTierIcon(city.data.tier)} {city.data.tier}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <TrendingUp className={cn("w-3 h-3", getMarketPotentialColor(city.localization.marketPotential))} />
                          <span>Market: {city.localization.marketPotential}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-500" />
                          <span>Digital: {city.localization.digitalAdoption}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-500" />
                          <span>${(city.localization.economicIndicators.gdpPerCapita / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-purple-500" />
                          <span>{city.localization.economicIndicators.serviceEconomyShare}% Services</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <strong>Services:</strong> {city.localization.serviceTypes.slice(0, 3).join(", ")}
                        {city.localization.serviceTypes.length > 3 && " +more"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredCities.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No cities found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}
