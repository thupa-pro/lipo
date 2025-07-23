import { redirect } from "next/navigation";

export default function AdminModerationPage() {
  // Redirect to the existing content moderation page
  redirect("/admin/content-moderation");
}
