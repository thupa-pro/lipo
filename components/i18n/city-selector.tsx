"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Globe,
  Clock,
  DollarSign,
  Search,
  Star,
  Users,
} from "lucide-react";
import {
  metropolitanCities,
  localeNames,
  localeFlags,
  type Locale,
} from "@/lib/i18n/config";
import {
  getCityConfiguration,
  formatCurrency,
  formatTime,
  detectCityFromLocation,
} from "@/lib/i18n/city-localization";
import { useToast } from "@/components/ui/use-toast";

interface CitySelectorProps {
  selectedCity?: string;
  onCityChange?: (cityKey: string) => void;
  showDetection?: boolean;
}

export function CitySelector({
  selectedCity,
  onCityChange,
  showDetection = true,
}: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const { toast } = useToast();

  const cities = Object.entries(metropolitanCities).map(([key, data]) => ({
    key,
    ...data,
    config: getCityConfiguration(key),
  }));

  const filteredCities = cities.filter(
    (city) =>
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      localeNames[city.locale]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const selectedCityData = selectedCity
    ? cities.find((c) => c.key === selectedCity)
    : null;

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const detectedCity = detectCityFromLocation({
          lat: latitude,
          lng: longitude,
        });

        if (detectedCity && onCityChange) {
          onCityChange(detectedCity);
          toast({
            title: "Location detected",
            description: `Set to ${cities.find((c) => c.key === detectedCity)?.country}`,
          });
        } else {
          toast({
            title: "City not found",
            description:
              "We couldn't find a supported city near your location.",
            variant: "destructive",
          });
        }
        setIsDetecting(false);
      },
      (error) => {
        toast({
          title: "Location error",
          description:
            "Could not access your location. Please select manually.",
          variant: "destructive",
        });
        setIsDetecting(false);
      },
    );
  };

  const handleCitySelect = (cityKey: string) => {
    if (onCityChange) {
      onCityChange(cityKey);
    }
    setOpen(false);
  };

  const getCityDisplayName = (city: any) => {
    const cityNames: Record<string, string> = {
      new_york: "New York",
      mexico_city: "Mexico City",
      sao_paulo: "São Paulo",
      rio_de_janeiro: "Rio de Janeiro",
      buenos_aires: "Buenos Aires",
      los_angeles: "Los Angeles",
      saint_petersburg: "Saint Petersburg",
      ho_chi_minh_city: "Ho Chi Minh City",
      kuala_lumpur: "Kuala Lumpur",
      tel_aviv: "Tel Aviv",
    };

    return (
      cityNames[city.key] ||
      city.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const groupedCities = filteredCities.reduce(
    (groups, city) => {
      const continent = getContinentFromCity(city.key);
      if (!groups[continent]) groups[continent] = [];
      groups[continent].push(city);
      return groups;
    },
    {} as Record<string, typeof filteredCities>,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {selectedCityData ? (
            <>
              <span className="font-medium">
                {getCityDisplayName(selectedCityData)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {localeFlags[selectedCityData.locale]}{" "}
                {localeNames[selectedCityData.locale]}
              </Badge>
            </>
          ) : (
            <span>Select City</span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Choose Your City
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Auto-detect */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {showDetection && (
              <Button
                variant="outline"
                onClick={detectLocation}
                disabled={isDetecting}
                className="flex-shrink-0"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isDetecting ? "Detecting..." : "Auto-detect"}
              </Button>
            )}
          </div>

          {/* Selected City Info */}
          {selectedCityData && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {localeFlags[selectedCityData.locale]}{" "}
                  {getCityDisplayName(selectedCityData)}
                </h3>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {(selectedCityData.population / 1000000).toFixed(1)}M
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>{localeNames[selectedCityData.locale]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span>{formatTime(new Date(), selectedCityData.key)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                  <span>{selectedCityData.config?.currency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{selectedCityData.country}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cities List */}
          <div className="border rounded-lg max-h-96 overflow-auto">
            <Command>
              <CommandList>
                <CommandEmpty>No cities found.</CommandEmpty>
                {Object.entries(groupedCities).map(
                  ([continent, continentCities]) => (
                    <CommandGroup key={continent} heading={continent}>
                      {continentCities.map((city) => (
                        <CommandItem
                          key={city.key}
                          value={city.key}
                          onSelect={() => handleCitySelect(city.key)}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {localeFlags[city.locale]}
                            </span>
                            <div>
                              <div className="font-medium">
                                {getCityDisplayName(city)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {city.country} • {localeNames[city.locale]}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {(city.population / 1000000).toFixed(1)}M
                            </Badge>
                            {city.config && (
                              <Badge variant="secondary" className="text-xs">
                                {city.config.currency}
                              </Badge>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ),
                )}
              </CommandList>
            </Command>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to group cities by continent
function getContinentFromCity(cityKey: string): string {
  const continentMap: Record<string, string> = {
    // Asia-Pacific
    tokyo: "Asia-Pacific",
    delhi: "Asia-Pacific",
    shanghai: "Asia-Pacific",
    dhaka: "Asia-Pacific",
    beijing: "Asia-Pacific",
    mumbai: "Asia-Pacific",
    osaka: "Asia-Pacific",
    karachi: "Asia-Pacific",
    chongqing: "Asia-Pacific",
    guangzhou: "Asia-Pacific",
    tianjin: "Asia-Pacific",
    shenzhen: "Asia-Pacific",
    kolkata: "Asia-Pacific",
    lahore: "Asia-Pacific",
    seoul: "Asia-Pacific",
    bangkok: "Asia-Pacific",
    jakarta: "Asia-Pacific",
    manila: "Asia-Pacific",
    ho_chi_minh_city: "Asia-Pacific",
    kuala_lumpur: "Asia-Pacific",
    taipei: "Asia-Pacific",

    // Europe
    london: "Europe",
    moscow: "Europe",
    istanbul: "Europe",
    paris: "Europe",
    berlin: "Europe",
    madrid: "Europe",
    rome: "Europe",
    barcelona: "Europe",
    milan: "Europe",
    naples: "Europe",
    kiev: "Europe",
    saint_petersburg: "Europe",
    warsaw: "Europe",
    amsterdam: "Europe",
    vienna: "Europe",
    athens: "Europe",
    budapest: "Europe",
    prague: "Europe",
    stockholm: "Europe",
    copenhagen: "Europe",
    oslo: "Europe",
    helsinki: "Europe",
    bucharest: "Europe",
    lisbon: "Europe",

    // Americas
    new_york: "Americas",
    mexico_city: "Americas",
    sao_paulo: "Americas",
    los_angeles: "Americas",
    rio_de_janeiro: "Americas",
    chicago: "Americas",
    lima: "Americas",
    buenos_aires: "Americas",

    // Middle East & Africa
    cairo: "Middle East & Africa",
    tehran: "Middle East & Africa",
    baghdad: "Middle East & Africa",
    riyadh: "Middle East & Africa",
    dubai: "Middle East & Africa",
    tel_aviv: "Middle East & Africa",
    nairobi: "Middle East & Africa",
    kinshasa: "Middle East & Africa",
    algiers: "Middle East & Africa",
  };

  return continentMap[cityKey] || "Other";
}
