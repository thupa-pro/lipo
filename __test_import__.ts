// Temporary test file to verify imports work
import type { Coordinates, Location } from "./lib/geolocation/types";
import { geolocationService } from "./lib/geolocation/geolocation-service";

// Test type usage
const testCoords: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
};

// Test service instantiation
const service = geolocationService;

// Export to avoid unused variable warnings
export { testCoords, service };
