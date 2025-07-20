"use client";

import React, { useCallback } from "react";
import AIAssistantWidget from "./ai-assistant-widget";

interface AIAssistantWrapperProps {
  position?: "floating" | "sidebar" | "bottom";
  size?: "small" | "normal" | "large";
  context?: Record<string, any>;
  theme?: "light" | "dark" | "auto";
  showAgentSelector?: boolean;
  enableVoice?: boolean;
  autoSuggest?: boolean;
  persistConversation?: boolean;
}

export function AIAssistantWrapper({
  position = "floating",
  size = "normal",
  context = {},
  theme = "auto",
  showAgentSelector = true,
  enableVoice = true,
  autoSuggest = true,
  persistConversation = true,
}: AIAssistantWrapperProps) {
  // ✅ Client Component function handler - safe to pass as prop
  const handleAction = useCallback((action: string, data: any) => {
    console.log("AI Assistant action:", action, data);
    // Handle AI assistant actions here
  }, []);

  return (
    <AIAssistantWidget
      position={position}
      size={size}
      context={context}
      theme={theme}
      showAgentSelector={showAgentSelector}
      enableVoice={enableVoice}
      autoSuggest={autoSuggest}
      persistConversation={persistConversation}
      onAction={handleAction} // ✅ Safe: Client → Client
    />
  );
}

export default AIAssistantWrapper;