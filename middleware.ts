import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./lib/i18n/config";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/messages(.*)",
  "/notifications(.*)",
  "/payments(.*)",
  "/my-bookings(.*)",
  "/requests(.*)",
]);

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
