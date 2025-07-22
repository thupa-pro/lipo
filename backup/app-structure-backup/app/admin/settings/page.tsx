import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Settings - Admin Dashboard",
  description: "Configure platform settings",
};

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          System Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          This page is under development. System configuration features coming
          soon.
        </p>
      </div>
    </div>
  );
}
