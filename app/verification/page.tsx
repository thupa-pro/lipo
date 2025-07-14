import { redirect } from "next/navigation";

export default function VerificationPage() {
  // Redirect to the locale-specific verification page
  redirect("/en/verification");
}
