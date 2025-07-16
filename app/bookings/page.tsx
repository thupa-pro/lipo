import { redirect } from "next/navigation";

// Redirect /bookings to /my-bookings for consistency
export default function BookingsRedirect() {
  redirect("/my-bookings");
}
