import React from "react";
import { Metadata } from "next";
import { WorkspaceSettings } from "@/components/workspace/WorkspaceSettings";

export const metadata: Metadata = {
  title: "Workspace Settings - Loconomy",
  description: "Manage your workspace settings and team members",
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default function WorkspaceSettingsPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Workspace Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your workspace configuration, team members, and preferences
          </p>
        </div>

        <WorkspaceSettings workspaceSlug={params.slug} />
      </div>
    </div>
  );
}
