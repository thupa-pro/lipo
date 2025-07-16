import { redirect } from "next/navigation";

// Redirect to the existing content-moderation page
export default function ModerationRedirect() {
  redirect("/admin/content-moderation");
}
