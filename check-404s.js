const fs = require("fs");
const path = require("path");

// Extract all referenced URLs from the grep results
const referencedUrls = [
  // From navigation and footer
  "/browse",
  "/request-service",
  "/how-it-works",
  "/pricing",
  "/safety",
  "/customer-support",
  "/become-provider",
  "/provider-resources",
  "/provider-app",
  "/provider-support",
  "/success-stories",
  "/training-certification",
  "/about",
  "/careers",
  "/press",
  "/blog",
  "/investors",
  "/partnerships",
  "/help",
  "/contact",
  "/community",
  "/feedback",
  "/accessibility",
  "/sitemap",
  "/privacy",
  "/terms",
  "/cookies",
  "/gdpr",

  // From RBAC navigation
  "/dashboard",
  "/bookings",
  "/my-bookings",
  "/provider/dashboard",
  "/provider/listings",
  "/provider/analytics",
  "/provider/calendar",
  "/provider/listings/new",
  "/provider/reports",
  "/provider/availability",
  "/provider/bookings",
  "/admin",
  "/admin/users",
  "/admin/moderation",

  // From components and pages
  "/payments",
  "/profile",
  "/settings",
  "/notifications",
  "/verification",
  "/mock-auth",
  "/auth/signin",
  "/auth/signup",
  "/auth/login",
  "/auth/forgot-password",

  // From settings and tabs
  "/settings?tab=notifications",
];

// Get all existing pages
function getAllPages(dir, pages = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllPages(filePath, pages);
    } else if (file === "page.tsx" || file === "route.ts") {
      // Convert file path to URL path
      let urlPath = dir.replace(process.cwd() + "/app", "");

      // Handle dynamic routes
      urlPath = urlPath.replace(/\[([^\]]+)\]/g, "$1");

      // Handle locale routes
      if (urlPath.startsWith("/[locale]")) {
        urlPath = urlPath.replace("/[locale]", "");
      }

      // Root page
      if (urlPath === "") urlPath = "/";

      pages.push(urlPath);
    }
  }

  return pages;
}

// Get all existing pages
const existingPages = getAllPages(path.join(process.cwd(), "app"));

// Find missing pages
const missingPages = referencedUrls.filter((url) => {
  // Strip query parameters for checking
  const cleanUrl = url.split("?")[0];
  return !existingPages.includes(cleanUrl);
});

console.log("Missing pages that need to be created:");
missingPages.forEach((page) => console.log(`  ${page}`));

console.log("\nExisting pages:");
existingPages.sort().forEach((page) => console.log(`  ${page}`));
