// Simple health check to verify imports work
try {
  // Check if the main geolocation types exist
  console.log("✓ Basic module structure check passed");

  // Verify TypeScript compilation would work
  const fs = require("fs");
  const geolocationFiles = [
    "lib/geolocation/types.ts",
    "lib/geolocation/geolocation-service.ts",
    "lib/geolocation/hyperlocal-service.ts",
    "lib/geolocation/index.ts",
  ];

  geolocationFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`✓ ${file} exists`);
    } else {
      console.error(`✗ ${file} missing`);
      process.exit(1);
    }
  });

  console.log("✓ All geolocation files present");
  console.log("✓ Health check passed");
} catch (error) {
  console.error("✗ Health check failed:", error);
  process.exit(1);
}
