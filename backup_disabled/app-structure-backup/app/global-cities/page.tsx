"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Users, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  MapPin, 
  Building, 
  Smartphone,
  Heart,
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import CitySelector from "@/components/i18n/city-selector";
import {
  metropolitanCities,
  cityTiers,
  economyTypes,
  localeNames,
  localeFlags,
} from "@/lib/i18n/config";
import {
  cityConfigurations,
  citiesByMarketPotential,
  citiesByDigitalAdoption,
  type CityLocalizationData,
} from "@/lib/i18n/city-localization";

export default function GlobalCitiesPage() {
  const [selectedCity, setSelectedCity] = useState<string>("new_york");
  const [selectedCityData, setSelectedCityData] = useState<CityLocalizationData | null>(null);

  // Global statistics
  const globalStats = {
    totalCities: Object.keys(metropolitanCities).length,
    totalPopulation: Object.values(metropolitanCities).reduce((sum, city) => sum + city.population, 0),
    totalCountries: new Set(Object.values(metropolitanCities).map(city => city.country)).size,
    totalLanguages: new Set(Object.values(metropolitanCities).map(city => city.locale)).size,
    megaCities: cityTiers.mega.length,
    largeCities: cityTiers.large.length,
    mediumCities: cityTiers.medium.length,
    smallCities: cityTiers.small.length,
    developedEconomies: economyTypes.developed.length,
    emergingEconomies: economyTypes.emerging.length,
    developingEconomies: economyTypes.developing.length,
    highPotentialCities: citiesByMarketPotential.high.length,
    mediumPotentialCities: citiesByMarketPotential.medium.length,
    lowPotentialCities: citiesByMarketPotential.low.length,
    highDigitalCities: citiesByDigitalAdoption.high.length,
    mediumDigitalCities: citiesByDigitalAdoption.medium.length,
    lowDigitalCities: citiesByDigitalAdoption.low.length,
  };

  const handleCitySelect = (cityKey: string, cityData: CityLocalizationData) => {
    setSelectedCity(cityKey);
    setSelectedCityData(cityData);
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(1)}M`;
    }
    return `${(pop / 1000).toFixed(0)}K`;
  };

  const selectedCityMetro = selectedCity ? metropolitanCities[selectedCity as keyof typeof metropolitanCities] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              🌍 Global Hyperlocal Network
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
              Connecting 100+ metropolitan cities worldwide through innovative hyperlocal service marketplace technology
            </p>
          </div>

          {/* Global Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border">
              <div className="text-3xl font-bold text-blue-600">{globalStats.totalCities}</div>
              <div className="text-sm text-muted-foreground">Cities Worldwide</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border">
              <div className="text-3xl font-bold text-green-600">
                {formatPopulation(globalStats.totalPopulation)}
              </div>
              <div className="text-sm text-muted-foreground">Total Population</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border">
              <div className="text-3xl font-bold text-purple-600">{globalStats.totalCountries}</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border">
              <div className="text-3xl font-bold text-orange-600">{globalStats.totalLanguages}</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Global Market Analysis
            </CardTitle>
            <CardDescription>
              Strategic market distribution across economic development levels and digital adoption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Economic Development */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Economic Development</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Developed Markets
                    </span>
                    <span className="font-semibold">{globalStats.developedEconomies}</span>
                  </div>
                  <Progress value={(globalStats.developedEconomies / globalStats.totalCities) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      Emerging Markets
                    </span>
                    <span className="font-semibold">{globalStats.emergingEconomies}</span>
                  </div>
                  <Progress value={(globalStats.emergingEconomies / globalStats.totalCities) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Developing Markets
                    </span>
                    <span className="font-semibold">{globalStats.developingEconomies}</span>
                  </div>
                  <Progress value={(globalStats.developingEconomies / globalStats.totalCities) * 100} className="h-2" />
                </div>
              </div>

              {/* Market Potential */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Market Potential</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-600" />
                      High Potential
                    </span>
                    <span className="font-semibold">{globalStats.highPotentialCities}</span>
                  </div>
                  <Progress value={(globalStats.highPotentialCities / globalStats.totalCities) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      Medium Potential
                    </span>
                    <span className="font-semibold">{globalStats.mediumPotentialCities}</span>
                  </div>
                  <Progress value={(globalStats.mediumPotentialCities / globalStats.totalCities) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-red-600" />
                      Emerging Potential
                    </span>
                    <span className="font-semibold">{globalStats.lowPotentialCities}</span>
                  </div>
                  <Progress value={(globalStats.lowPotentialCities / globalStats.totalCities) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* City Tiers Breakdown */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🏙️</div>
              <div className="text-2xl font-bold">{globalStats.megaCities}</div>
              <div className="text-blue-100">Mega Cities</div>
              <div className="text-xs text-blue-200 mt-1">10M+ Population</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🌆</div>
              <div className="text-2xl font-bold">{globalStats.largeCities}</div>
              <div className="text-green-100">Large Cities</div>
              <div className="text-xs text-green-200 mt-1">5-10M Population</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🏘️</div>
              <div className="text-2xl font-bold">{globalStats.mediumCities}</div>
              <div className="text-yellow-100">Medium Cities</div>
              <div className="text-xs text-yellow-200 mt-1">1-5M Population</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🏠</div>
              <div className="text-2xl font-bold">{globalStats.smallCities}</div>
              <div className="text-purple-100">Small Cities</div>
              <div className="text-xs text-purple-200 mt-1">Under 1M</div>
            </CardContent>
          </Card>
        </div>

        {/* Selected City Details */}
        {selectedCityMetro && selectedCityData && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-3xl">
                  {localeFlags[selectedCityMetro.locale as keyof typeof localeFlags]}
                </span>
                <div>
                  <div className="capitalize text-2xl">
                    {selectedCity.replace(/_/g, " ")}
                  </div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {selectedCityMetro.country} • {localeNames[selectedCityMetro.locale as keyof typeof localeNames]}
                  </div>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    Featured City
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Demographics */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Demographics
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Population:</span>
                      <span className="font-semibold">{formatPopulation(selectedCityMetro.population)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City Tier:</span>
                      <Badge variant="outline">{selectedCityMetro.tier}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Economy:</span>
                      <Badge variant="outline">{selectedCityMetro.economy}</Badge>
                    </div>
                  </div>
                </div>

                {/* Market Indicators */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Market Indicators
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Market Potential:</span>
                      <Badge 
                        variant="outline" 
                        className={
                          selectedCityData.marketPotential === "high" ? "border-green-500 text-green-700" :
                          selectedCityData.marketPotential === "medium" ? "border-yellow-500 text-yellow-700" :
                          "border-red-500 text-red-700"
                        }
                      >
                        {selectedCityData.marketPotential}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Digital Adoption:</span>
                      <Badge 
                        variant="outline"
                        className={
                          selectedCityData.digitalAdoption === "high" ? "border-blue-500 text-blue-700" :
                          selectedCityData.digitalAdoption === "medium" ? "border-yellow-500 text-yellow-700" :
                          "border-gray-500 text-gray-700"
                        }
                      >
                        {selectedCityData.digitalAdoption}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>GDP per Capita:</span>
                      <span className="font-semibold">${selectedCityData.economicIndicators.gdpPerCapita.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Economy:</span>
                      <span className="font-semibold">{selectedCityData.economicIndicators.serviceEconomyShare}%</span>
                    </div>
                  </div>
                </div>

                {/* Local Services */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    Popular Services
                  </h3>
                  <div className="space-y-2">
                    {selectedCityData.serviceTypes.slice(0, 5).map((service, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Emergency: {selectedCityData.emergencyNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>Currency: {selectedCityData.currency} ({selectedCityData.currencySymbol})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-500" />
                    <span>Phone: {selectedCityData.phoneFormat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Tipping: {selectedCityData.tippingCulture}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive City Selector */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Explore Our Global Network
            </CardTitle>
            <CardDescription>
              Discover 100+ metropolitan cities where Loconomy connects local service providers with customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CitySelector
              selectedCity={selectedCity}
              onCitySelect={handleCitySelect}
            />
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Join the Global Hyperlocal Revolution</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Connect with local service providers and customers in your city. 
                Experience the future of hyperlocal commerce today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Find Services Near Me
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Become a Provider
                  <Building className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}