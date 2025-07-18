import {
  getCityConfiguration,
  formatCurrency,
  formatDate,
} from "@/lib/i18n/city-localization";
import { metropolitanCities, getCityData } from "@/lib/i18n/config";

export default function TestCitiesPage() {
  // Test some of the new African cities
  const testCities = [
    "lagos",
    "johannesburg",
    "addis_ababa",
    "casablanca",
    "cape_town",
    "nairobi",
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Test New Cities Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testCities.map((cityKey) => {
          const cityData = getCityData(cityKey);
          const cityConfig = getCityConfiguration(cityKey);
          const testAmount = 1000;
          const testDate = new Date();

          if (!cityData || !cityConfig) {
            return (
              <div key={cityKey} className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold text-red-600">Error: {cityKey}</h3>
                <p>Configuration not found</p>
              </div>
            );
          }

          return (
            <div
              key={cityKey}
              className="p-4 border rounded-lg bg-white shadow"
            >
              <h3 className="font-semibold text-lg mb-2 capitalize">
                {cityKey.replace("_", " ")}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Country:</strong> {cityData.country}
                </p>
                <p>
                  <strong>Locale:</strong> {cityData.locale}
                </p>
                <p>
                  <strong>Population:</strong>{" "}
                  {cityData.population?.toLocaleString()}
                </p>
                <p>
                  <strong>Currency:</strong> {cityConfig.currency}
                </p>
                <p>
                  <strong>Emergency:</strong> {cityConfig.emergencyNumber}
                </p>
                <p>
                  <strong>Timezone:</strong> {cityConfig.timezone}
                </p>
                <p>
                  <strong>RTL:</strong> {cityConfig.rtl ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Price Format:</strong>{" "}
                  {formatCurrency(testAmount, cityKey)}
                </p>
                <p>
                  <strong>Date Format:</strong> {formatDate(testDate, cityKey)}
                </p>
                <p>
                  <strong>Phone Format:</strong> {cityConfig.phoneFormat}
                </p>
                <div>
                  <strong>Holidays:</strong>
                  <ul className="list-disc list-inside ml-2">
                    {cityConfig.localHolidays
                      ?.slice(0, 3)
                      .map((holiday, idx) => (
                        <li key={idx}>{holiday}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Total Cities Supported</h2>
        <p className="text-lg">
          We now support{" "}
          <strong>{Object.keys(metropolitanCities).length}</strong> metropolitan
          cities worldwide!
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.keys(metropolitanCities).map((city) => (
            <span key={city} className="px-2 py-1 bg-blue-200 rounded text-xs">
              {city.replace("_", " ")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
