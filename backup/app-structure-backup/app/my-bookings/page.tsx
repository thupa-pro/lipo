import { redirect } from "next/navigation";

export default function MyBookingsRedirectPage() {
  // Redirect to the correct bookings route
  redirect("/bookings");
}
