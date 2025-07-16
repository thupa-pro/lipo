import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware((auth, req) => {
  // Exclude mock routes from Clerk protection
  if (req.nextUrl.pathname.startsWith('/mock-')) {
    return;
  }
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
