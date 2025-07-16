import { createClient } from "@/lib/supabase/client";
import type {
  ChatConversation,
  ChatMessage,
  ChatSuggestion,
  OnboardingStep,
  AIResponse,
  ChatAnalytics,
  ChatContext,
  ChatApiResponse,
  PaginatedChatResponse,
  SendMessageForm,
  CreateConversationForm,
  UpdateConversationForm,
  ChatIntent,
  AIKnowledgeBase,
  DEFAULT_SUGGESTIONS,
} from "./types";

export class AIChatClient {
  private supabase = createClient();

  // Conversation Management
  async getConversations(
    userId?: string,
  ): Promise<ChatApiResponse<ChatConversation[]>> {
    try {
      let query = this.supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations",
      };
    }
  }

  async createConversation(
    form: CreateConversationForm,
  ): Promise<ChatApiResponse<ChatConversation>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "create_chat_conversation",
        {
          title: form.title,
          conversation_type: form.type,
          context_data: form.context || {},
          priority_level: form.priority || "medium",
        },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error creating conversation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create conversation",
      };
    }
  }

  async updateConversation(
    conversationId: string,
    updates: UpdateConversationForm,
  ): Promise<ChatApiResponse<ChatConversation>> {
    try {
      const { data, error } = await this.supabase
        .from("chat_conversations")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error updating conversation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update conversation",
      };
    }
  }

  async deleteConversation(
    conversationId: string,
  ): Promise<ChatApiResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from("chat_conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;

      return { success: true, data: true };
    } catch (error) {
      console.error("Error deleting conversation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete conversation",
      };
    }
  }

  // Message Management
  async getConversationMessages(
    conversationId: string,
    limit = 50,
    offset = 0,
  ): Promise<ChatApiResponse<ChatMessage[]>> {
    try {
      const { data, error } = await this.supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("timestamp", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch messages",
      };
    }
  }

  async sendMessage(
    conversationId: string,
    content: string,
    type: "text" | "suggestion" = "text",
  ): Promise<ChatApiResponse<AIResponse>> {
    try {
      // First, save the user message
      const userMessage = {
        conversation_id: conversationId,
        content,
        sender: "user",
        type,
        timestamp: new Date().toISOString(),
      };

      const { error: messageError } = await this.supabase
        .from("chat_messages")
        .insert([userMessage]);

      if (messageError) throw messageError;

      // Get conversation context
      const context = await this.getConversationContext(conversationId);

      // Process message with AI
      const aiResponse = await this.processWithAI(content, context, type);

      // Save AI response
      const assistantMessage = {
        conversation_id: conversationId,
        content: aiResponse.content,
        sender: "assistant",
        type: "text",
        timestamp: new Date().toISOString(),
        metadata: aiResponse.metadata,
      };

      const { error: responseError } = await this.supabase
        .from("chat_messages")
        .insert([assistantMessage]);

      if (responseError) throw responseError;

      // Update conversation
      await this.updateConversation(conversationId, {
        lastMessageAt: new Date().toISOString(),
        messageCount: await this.getMessageCount(conversationId),
      });

      // Handle onboarding updates if applicable
      if (aiResponse.onboardingUpdate) {
        await this.updateOnboardingProgress(
          context.userId,
          aiResponse.onboardingUpdate,
        );
      }

      return { success: true, data: aiResponse };
    } catch (error) {
      console.error("Error sending message:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send message",
      };
    }
  }

  async addMessageReaction(
    messageId: string,
    reaction: "helpful" | "not_helpful",
  ): Promise<ChatApiResponse<boolean>> {
    try {
      const { error } = await this.supabase.rpc("add_message_reaction", {
        message_id: messageId,
        reaction_type: reaction,
      });

      if (error) throw error;

      return { success: true, data: true };
    } catch (error) {
      console.error("Error adding reaction:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to add reaction",
      };
    }
  }

  async clearConversation(
    conversationId: string,
  ): Promise<ChatApiResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from("chat_messages")
        .delete()
        .eq("conversation_id", conversationId);

      if (error) throw error;

      // Update conversation message count
      await this.updateConversation(conversationId, { messageCount: 0 });

      return { success: true, data: true };
    } catch (error) {
      console.error("Error clearing conversation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to clear conversation",
      };
    }
  }

  // AI Processing
  private async processWithAI(
    content: string,
    context: ChatContext,
    type: string,
  ): Promise<AIResponse> {
    // This is where you'd integrate with your AI service (OpenAI, Anthropic, etc.)
    // For now, we'll provide intelligent mock responses based on content analysis

    const intent = this.analyzeIntent(content);
    const entities = this.extractEntities(content);

    let response: AIResponse;

    switch (intent.name) {
      case "onboarding_help":
        response = await this.handleOnboardingHelp(content, context, entities);
        break;
      case "booking_help":
        response = await this.handleBookingHelp(content, context, entities);
        break;
      case "service_inquiry":
        response = await this.handleServiceInquiry(content, context, entities);
        break;
      case "profile_setup":
        response = await this.handleProfileSetup(content, context, entities);
        break;
      case "general_question":
        response = await this.handleGeneralQuestion(content, context, entities);
        break;
      default:
        response = await this.handleDefault(content, context);
    }

    // Add processing metadata
    response.metadata = {
      ...response.metadata,
      intent: intent.name,
      confidence: intent.confidence,
      entities,
      processingTime: Math.random() * 1000 + 500, // Mock processing time
      model: "loconomy-ai-v1",
    };

    return response;
  }

  private analyzeIntent(content: string): ChatIntent {
    const lowerContent = content.toLowerCase();

    // Simple keyword-based intent classification
    if (
      lowerContent.includes("profile") ||
      lowerContent.includes("setup") ||
      lowerContent.includes("account")
    ) {
      return { name: "profile_setup", confidence: 0.85, entities: [] };
    }

    if (
      lowerContent.includes("book") ||
      lowerContent.includes("appointment") ||
      lowerContent.includes("schedule")
    ) {
      return { name: "booking_help", confidence: 0.9, entities: [] };
    }

    if (
      lowerContent.includes("onboard") ||
      lowerContent.includes("start") ||
      lowerContent.includes("begin")
    ) {
      return { name: "onboarding_help", confidence: 0.8, entities: [] };
    }

    if (
      lowerContent.includes("service") ||
      lowerContent.includes("provider") ||
      lowerContent.includes("category")
    ) {
      return { name: "service_inquiry", confidence: 0.75, entities: [] };
    }

    return { name: "general_question", confidence: 0.6, entities: [] };
  }

  private extractEntities(
    content: string,
  ): Array<{ entity: string; value: string; confidence: number }> {
    const entities = [];
    const lowerContent = content.toLowerCase();

    // Extract location entities
    const locationKeywords = ["near", "in", "around", "at"];
    locationKeywords.forEach((keyword) => {
      if (lowerContent.includes(keyword)) {
        const words = content.split(" ");
        const index = words.findIndex((word) => word.toLowerCase() === keyword);
        if (index !== -1 && index < words.length - 1) {
          entities.push({
            entity: "location",
            value: words[index + 1],
            confidence: 0.7,
          });
        }
      }
    });

    // Extract service entities
    const serviceKeywords = [
      "cleaning",
      "repair",
      "massage",
      "tutoring",
      "pet",
      "beauty",
    ];
    serviceKeywords.forEach((service) => {
      if (lowerContent.includes(service)) {
        entities.push({
          entity: "service_type",
          value: service,
          confidence: 0.8,
        });
      }
    });

    return entities;
  }

  private async handleOnboardingHelp(
    content: string,
    context: ChatContext,
    entities: any[],
  ): Promise<AIResponse> {
    const suggestions: ChatSuggestion[] = [
      {
        id: "complete-profile",
        text: "Complete my profile setup",
        type: "onboarding",
        metadata: { actionType: "navigate", targetUrl: "/profile/setup" },
      },
      {
        id: "verify-account",
        text: "Verify my account",
        type: "onboarding",
        metadata: { actionType: "navigate", targetUrl: "/verify" },
      },
      {
        id: "take-tour",
        text: "Take the platform tour",
        type: "onboarding",
        metadata: { actionType: "start_flow", stepId: "platform_tour" },
      },
    ];

    return {
      content: `I'd be happy to help you get started with Loconomy! 🚀\n\nHere's what we can work on together:\n\n• **Complete your profile** - Add your details so providers can serve you better\n• **Verify your account** - Quick verification for added security\n• **Take a platform tour** - Learn how everything works\n• **Make your first booking** - I'll guide you through the process\n\nWhat would you like to start with?`,
      confidence: 0.9,
      intent: "onboarding_help",
      suggestions,
      onboardingUpdate: {
        stepCompleted: "initiated_help",
        nextStep: "profile_setup",
        progress: 10,
      },
    };
  }

  private async handleBookingHelp(
    content: string,
    context: ChatContext,
    entities: any[],
  ): Promise<AIResponse> {
    const suggestions: ChatSuggestion[] = [
      {
        id: "browse-services",
        text: "Browse available services",
        type: "action",
        metadata: { actionType: "navigate", targetUrl: "/services" },
      },
      {
        id: "search-location",
        text: "Search by location",
        type: "action",
        metadata: { actionType: "open_modal", stepId: "location_search" },
      },
      {
        id: "popular-services",
        text: "Show popular services",
        type: "help",
      },
    ];

    return {
      content: `I'll help you with booking! 📅\n\nTo find the perfect service provider, I can help you:\n\n• **Browse by category** - Home services, beauty, fitness, and more\n• **Search by location** - Find providers near you\n• **Filter by ratings** - See top-rated providers\n• **Compare prices** - Get the best value\n\nWhat type of service are you looking for?`,
      confidence: 0.95,
      intent: "booking_help",
      suggestions,
    };
  }

  private async handleServiceInquiry(
    content: string,
    context: ChatContext,
    entities: any[],
  ): Promise<AIResponse> {
    const serviceType = entities.find(
      (e) => e.entity === "service_type",
    )?.value;
    const location = entities.find((e) => e.entity === "location")?.value;

    const suggestions: ChatSuggestion[] = [
      {
        id: "view-providers",
        text: `See ${serviceType || "service"} providers`,
        type: "action",
        metadata: { actionType: "navigate", targetUrl: "/services" },
      },
      {
        id: "pricing-info",
        text: "How much does it cost?",
        type: "help",
      },
      {
        id: "booking-process",
        text: "How does booking work?",
        type: "help",
      },
    ];

    let responseContent = `Great question about our services! 🔍\n\n`;

    if (serviceType) {
      responseContent += `For **${serviceType}** services, we have verified providers who:\n• Are background-checked\n• Have customer reviews\n• Offer competitive pricing\n• Provide quality guarantees\n\n`;
    }

    if (location) {
      responseContent += `In **${location}**, we have multiple providers available. `;
    }

    responseContent += `Would you like me to show you available providers or answer specific questions about our services?`;

    return {
      content: responseContent,
      confidence: 0.8,
      intent: "service_inquiry",
      suggestions,
    };
  }

  private async handleProfileSetup(
    content: string,
    context: ChatContext,
    entities: any[],
  ): Promise<AIResponse> {
    const suggestions: ChatSuggestion[] = [
      {
        id: "start-profile",
        text: "Start profile setup",
        type: "action",
        metadata: { actionType: "navigate", targetUrl: "/profile/setup" },
      },
      {
        id: "what-info-needed",
        text: "What information do I need?",
        type: "help",
      },
      {
        id: "privacy-info",
        text: "How is my data protected?",
        type: "help",
      },
    ];

    return {
      content: `Let's get your profile set up! 👤\n\n**Here's what we'll need:**\n• Basic information (name, email, phone)\n• Your location for finding nearby services\n• Service preferences (optional)\n• Profile photo (optional)\n\n**Why we need this:**\n• Providers can serve you better\n• Faster booking process\n• Personalized recommendations\n• Secure communication\n\nYour privacy is protected - we only share what's necessary with your chosen service providers. Ready to start?`,
      confidence: 0.9,
      intent: "profile_setup",
      suggestions,
      onboardingUpdate: {
        stepCompleted: "profile_info_provided",
        nextStep: "profile_setup",
        progress: 20,
      },
    };
  }

  private async handleGeneralQuestion(
    content: string,
    context: ChatContext,
  ): Promise<AIResponse> {
    const suggestions: ChatSuggestion[] = [
      {
        id: "how-it-works",
        text: "How does Loconomy work?",
        type: "help",
      },
      {
        id: "safety-measures",
        text: "What safety measures are in place?",
        type: "help",
      },
      {
        id: "contact-support",
        text: "Contact human support",
        type: "action",
        metadata: { actionType: "open_modal", stepId: "contact_support" },
      },
    ];

    return {
      content: `I'm here to help with any questions! 🤝\n\n**Popular topics:**\n• How our platform works\n• Safety and security measures\n• Pricing and payments\n• Provider verification process\n• Booking and cancellation policies\n\nWhat would you like to know more about? I can also connect you with our human support team if needed.`,
      confidence: 0.7,
      intent: "general_question",
      suggestions,
    };
  }

  private async handleDefault(
    content: string,
    context: ChatContext,
  ): Promise<AIResponse> {
    return {
      content: `I want to make sure I understand you correctly. Could you tell me more about what you're looking for? I'm here to help with:\n\n• Getting started with Loconomy\n• Finding and booking services\n• Setting up your profile\n• Answering questions about our platform\n\nWhat can I help you with today?`,
      confidence: 0.5,
      intent: "clarification_needed",
      suggestions: DEFAULT_SUGGESTIONS.general.map((s) => ({
        id: s.id,
        text: s.text,
        type: s.type,
      })),
    };
  }

  // Suggestions
  async getSuggestions(
    conversationId?: string,
    context?: string,
  ): Promise<ChatApiResponse<ChatSuggestion[]>> {
    try {
      // In a real implementation, this would be AI-powered based on conversation context
      let suggestions: ChatSuggestion[];

      switch (context) {
        case "welcome":
          suggestions = DEFAULT_SUGGESTIONS.welcome.map((s) => ({
            id: s.id,
            text: s.text,
            type: s.type,
          }));
          break;
        case "booking":
          suggestions = DEFAULT_SUGGESTIONS.booking.map((s) => ({
            id: s.id,
            text: s.text,
            type: s.type,
          }));
          break;
        default:
          suggestions = DEFAULT_SUGGESTIONS.general.map((s) => ({
            id: s.id,
            text: s.text,
            type: s.type,
          }));
      }

      return { success: true, data: suggestions };
    } catch (error) {
      console.error("Error getting suggestions:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get suggestions",
      };
    }
  }

  // Onboarding
  async getOnboardingProgress(
    userId?: string,
  ): Promise<ChatApiResponse<OnboardingStep[]>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_onboarding_progress",
        { user_id: userId },
      );

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching onboarding progress:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch onboarding progress",
      };
    }
  }

  async updateOnboardingProgress(
    userId: string,
    update: { stepCompleted?: string; nextStep?: string; progress: number },
  ): Promise<ChatApiResponse<boolean>> {
    try {
      const { error } = await this.supabase.rpc("update_onboarding_progress", {
        user_id: userId,
        step_completed: update.stepCompleted,
        next_step: update.nextStep,
        progress_percentage: update.progress,
      });

      if (error) throw error;

      return { success: true, data: true };
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update onboarding progress",
      };
    }
  }

  // Utility functions
  private async getConversationContext(
    conversationId: string,
  ): Promise<ChatContext> {
    try {
      const { data: conversation } = await this.supabase
        .from("chat_conversations")
        .select("*, profiles(*)")
        .eq("id", conversationId)
        .single();

      return {
        userId: conversation?.user_id || "",
        conversationId,
        userProfile: conversation?.profiles
          ? {
              name: `${conversation.profiles.first_name} ${conversation.profiles.last_name}`,
              userType: conversation.profiles.user_type,
              location: conversation.profiles.location,
              joinedDate: conversation.profiles.created_at,
            }
          : undefined,
        conversationHistory: {
          previousTopics: conversation?.context?.topics || [],
          lastInteraction: conversation?.last_message_at,
        },
        onboardingContext: conversation?.context?.onboarding || {},
      };
    } catch (error) {
      console.error("Error getting conversation context:", error);
      return {
        userId: "",
        conversationId,
      };
    }
  }

  private async getMessageCount(conversationId: string): Promise<number> {
    try {
      const { count } = await this.supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId);

      return count || 0;
    } catch (error) {
      console.error("Error getting message count:", error);
      return 0;
    }
  }

  // Analytics
  async getChatAnalytics(
    conversationId?: string,
  ): Promise<ChatApiResponse<ChatAnalytics>> {
    try {
      const { data, error } = await this.supabase.rpc("get_chat_analytics", {
        conversation_id: conversationId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching chat analytics:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch analytics",
      };
    }
  }

  // Knowledge Base
  async searchKnowledgeBase(
    query: string,
  ): Promise<ChatApiResponse<AIKnowledgeBase[]>> {
    try {
      const { data, error } = await this.supabase.rpc("search_knowledge_base", {
        search_query: query,
      });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to search knowledge base",
      };
    }
  }
}

export const aiChatClient = new AIChatClient();
