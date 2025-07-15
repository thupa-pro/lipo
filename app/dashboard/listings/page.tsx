import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/rbac/utils";
import { ListingsManager } from "@/components/listings/ListingsManager";

export default async function ListingsPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Only providers and admins can access listings management
  if (session.role !== "provider" && session.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <ListingsManager />
    </div>
  );
}
