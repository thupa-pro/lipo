import { Metadata } from "next";
import { SovereignAgentSystem } from "@/components/ai/SovereignAgentSystem";

export const metadata: Metadata = {
  title: "AI Agents - Loconomy",
  description: "Manage your sovereign AI agents for automated marketplace operations",
};

export default function AgentsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <SovereignAgentSystem />
    </div>
  );
}
