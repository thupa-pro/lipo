import { redirect } from "next/navigation";

export default function AdminProvidersPage() {
  // Redirect to the existing providers page
  redirect("/admin/users");
}
