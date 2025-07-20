import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { prisma } from '@/lib/prisma';

export interface AgentContext {
  userId?: string;
  userRole?: string;
  location?: string;
  sessionMemory?: any;
  currentPage?: string;
}

export interface SlashCommand {
  command: string;
  description: string;
  parameters?: string[];
  handler: (params: string[], context: AgentContext) => Promise<AgentResponse>;
}

export interface AgentResponse {
  type: 'text' | 'action' | 'ui' | 'redirect' | 'form';
  content: string;
  data?: any;
  actions?: AgentAction[];
  ui?: React.ReactNode;
}

export interface AgentAction {
  type: 'navigate' | 'search' | 'book' | 'cancel' | 'notification' | 'form_fill';
  target?: string;
  data?: any;
}

export class LoconomyAgent {
  private static instance: LoconomyAgent;
  private memory: Map<string, any> = new Map();
  private slashCommands: Map<string, SlashCommand> = new Map();

  private constructor() {
    this.initializeSlashCommands();
  }

  public static getInstance(): LoconomyAgent {
    if (!LoconomyAgent.instance) {
      LoconomyAgent.instance = new LoconomyAgent();
    }
    return LoconomyAgent.instance;
  }

  private initializeSlashCommands() {
    // Core slash commands
    this.registerCommand({
      command: 'find',
      description: 'Find services near you',
      parameters: ['service_type', 'location?'],
      handler: this.handleFindCommand.bind(this),
    });

    this.registerCommand({
      command: 'reschedule',
      description: 'Reschedule a booking',
      parameters: ['booking_id?', 'new_date?'],
      handler: this.handleRescheduleCommand.bind(this),
    });

    this.registerCommand({
      command: 'cancel',
      description: 'Cancel a booking',
      parameters: ['booking_id?'],
      handler: this.handleCancelCommand.bind(this),
    });

    this.registerCommand({
      command: 'refer',
      description: 'Refer a friend',
      parameters: ['friend_email?'],
      handler: this.handleReferCommand.bind(this),
    });

    this.registerCommand({
      command: 'escalate',
      description: 'Escalate an issue to support',
      parameters: ['issue_description'],
      handler: this.handleEscalateCommand.bind(this),
    });

    this.registerCommand({
      command: 'book',
      description: 'Book a service',
      parameters: ['service_id?', 'date?', 'time?'],
      handler: this.handleBookCommand.bind(this),
    });

    this.registerCommand({
      command: 'status',
      description: 'Check booking status',
      parameters: ['booking_id?'],
      handler: this.handleStatusCommand.bind(this),
    });

    this.registerCommand({
      command: 'help',
      description: 'Show available commands',
      handler: this.handleHelpCommand.bind(this),
    });
  }

  public registerCommand(command: SlashCommand) {
    this.slashCommands.set(command.command, command);
  }

  public async processInput(input: string, context: AgentContext): Promise<AgentResponse> {
    // Check if it's a slash command
    if (input.startsWith('/')) {
      return this.handleSlashCommand(input, context);
    }

    // Check for intelligent intent detection
    const intent = await this.detectIntent(input, context);
    return this.handleIntent(intent, input, context);
  }

  private async handleSlashCommand(input: string, context: AgentContext): Promise<AgentResponse> {
    const parts = input.slice(1).split(' ');
    const commandName = parts[0];
    const params = parts.slice(1);

    const command = this.slashCommands.get(commandName);
    if (!command) {
      return {
        type: 'text',
        content: `Unknown command: /${commandName}. Type /help to see available commands.`,
      };
    }

    try {
      return await command.handler(params, context);
    } catch (error) {
      console.error('Error executing slash command:', error);
      return {
        type: 'text',
        content: `Sorry, I encountered an error executing /${commandName}. Please try again.`,
      };
    }
  }

  private async detectIntent(input: string, context: AgentContext): Promise<string> {
    const prompt = `
You are Loconomy's AI assistant. Analyze this user input and determine their intent:

User Input: "${input}"
User Context: ${JSON.stringify(context)}

Possible intents:
- find_service: User wants to find a service
- book_service: User wants to book something
- reschedule: User wants to change a booking
- cancel: User wants to cancel
- get_status: User wants to check status
- complaint: User has an issue
- help: User needs help
- general: General conversation

Respond with just the intent name.
`;

    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt,
        maxTokens: 50,
      });
      return text.trim().toLowerCase();
    } catch (error) {
      console.error('Error detecting intent:', error);
      return 'general';
    }
  }

  private async handleIntent(intent: string, input: string, context: AgentContext): Promise<AgentResponse> {
    switch (intent) {
      case 'find_service':
        return this.handleServiceSearch(input, context);
      case 'book_service':
        return this.handleBookingRequest(input, context);
      case 'reschedule':
        return this.handleRescheduleRequest(input, context);
      case 'cancel':
        return this.handleCancelRequest(input, context);
      case 'complaint':
        return this.handleComplaint(input, context);
      default:
        return this.handleGeneralQuery(input, context);
    }
  }

  // Slash command handlers
  private async handleFindCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    if (params.length === 0) {
      return {
        type: 'text',
        content: 'What service are you looking for? Try: `/find plumber` or `/find cleaning`',
      };
    }

    const serviceType = params.join(' ');
    const location = context.location || 'your area';

    // Simulate intelligent search
    const searchResults = await this.searchServices(serviceType, context);

    return {
      type: 'action',
      content: `🔍 Found ${searchResults.length} ${serviceType} providers in ${location}`,
      data: { searchResults, serviceType },
      actions: [{
        type: 'search',
        data: { query: serviceType, results: searchResults }
      }]
    };
  }

  private async handleRescheduleCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    if (params.length === 0) {
      // Get user's recent bookings
      const bookings = await this.getUserBookings(context.userId);
      if (bookings.length === 0) {
        return {
          type: 'text',
          content: "You don't have any bookings to reschedule.",
        };
      }

      return {
        type: 'ui',
        content: 'Which booking would you like to reschedule?',
        data: { bookings },
      };
    }

    const bookingId = params[0];
    return {
      type: 'form',
      content: `Rescheduling booking ${bookingId}. When would you like to reschedule?`,
      data: { action: 'reschedule', bookingId },
    };
  }

  private async handleCancelCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    if (params.length === 0) {
      const bookings = await this.getUserBookings(context.userId);
      if (bookings.length === 0) {
        return {
          type: 'text',
          content: "You don't have any bookings to cancel.",
        };
      }

      return {
        type: 'ui',
        content: 'Which booking would you like to cancel?',
        data: { bookings, action: 'cancel' },
      };
    }

    const bookingId = params[0];
    return {
      type: 'form',
      content: `Are you sure you want to cancel booking ${bookingId}?`,
      data: { action: 'cancel_confirm', bookingId },
    };
  }

  private async handleReferCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    if (params.length === 0) {
      return {
        type: 'form',
        content: "Who would you like to refer to Loconomy? I'll help you send them an invitation!",
        data: { action: 'refer' },
      };
    }

    const email = params[0];
    return {
      type: 'action',
      content: `📨 Sending referral invitation to ${email}...`,
      actions: [{
        type: 'notification',
        data: { type: 'referral_sent', email }
      }]
    };
  }

  private async handleEscalateCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    const issue = params.join(' ');
    if (!issue) {
      return {
        type: 'form',
        content: 'Please describe the issue you need help with:',
        data: { action: 'escalate' },
      };
    }

    return {
      type: 'action',
      content: `🆘 Issue escalated to support team: "${issue}". You'll hear back within 2 hours.`,
      actions: [{
        type: 'notification',
        data: { type: 'support_ticket_created', issue }
      }]
    };
  }

  private async handleBookCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    if (params.length === 0) {
      return {
        type: 'text',
        content: 'What would you like to book? Try: `/book cleaning tomorrow 2pm`',
      };
    }

    return {
      type: 'form',
      content: `Let me help you book ${params.join(' ')}. When would you like this service?`,
      data: { action: 'book', service: params.join(' ') },
    };
  }

  private async handleStatusCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    const bookings = await this.getUserBookings(context.userId);
    if (bookings.length === 0) {
      return {
        type: 'text',
        content: "You don't have any active bookings.",
      };
    }

    const statusSummary = bookings.map(b => 
      `📅 ${b.service} - ${b.status} (${b.date})`
    ).join('\n');

    return {
      type: 'text',
      content: `Your booking status:\n${statusSummary}`,
      data: { bookings },
    };
  }

  private async handleHelpCommand(params: string[], context: AgentContext): Promise<AgentResponse> {
    const commands = Array.from(this.slashCommands.values())
      .map(cmd => `/${cmd.command} - ${cmd.description}`)
      .join('\n');

    return {
      type: 'text',
      content: `Available commands:\n${commands}\n\nYou can also just type naturally and I'll understand what you need!`,
    };
  }

  // Intent-based handlers
  private async handleServiceSearch(input: string, context: AgentContext): Promise<AgentResponse> {
    const serviceType = await this.extractServiceType(input);
    return this.handleFindCommand([serviceType], context);
  }

  private async handleBookingRequest(input: string, context: AgentContext): Promise<AgentResponse> {
    return {
      type: 'form',
      content: 'I can help you book that! Let me get some details...',
      data: { action: 'book_natural', originalInput: input },
    };
  }

  private async handleRescheduleRequest(input: string, context: AgentContext): Promise<AgentResponse> {
    return this.handleRescheduleCommand([], context);
  }

  private async handleCancelRequest(input: string, context: AgentContext): Promise<AgentResponse> {
    return this.handleCancelCommand([], context);
  }

  private async handleComplaint(input: string, context: AgentContext): Promise<AgentResponse> {
    return {
      type: 'action',
      content: "I understand you're having an issue. Let me connect you with our support team right away.",
      actions: [{
        type: 'notification',
        data: { type: 'support_alert', issue: input }
      }]
    };
  }

  private async handleGeneralQuery(input: string, context: AgentContext): Promise<AgentResponse> {
    const prompt = `
You are Loconomy's helpful AI assistant. Respond to this user query in a friendly, helpful way.
Keep responses concise and actionable. If appropriate, suggest using slash commands.

User: "${input}"
Context: ${JSON.stringify(context)}

Response:
`;

    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt,
        maxTokens: 150,
      });

      return {
        type: 'text',
        content: text,
      };
    } catch (error) {
      return {
        type: 'text',
        content: "I'm here to help! You can ask me anything about Loconomy services or use commands like /find, /book, or /help.",
      };
    }
  }

  // Helper methods
  private async searchServices(serviceType: string, context: AgentContext): Promise<any[]> {
    try {
      // In a real implementation, this would use the search service
      return [
        { id: '1', name: `${serviceType} Pro`, rating: 4.8, price: 50 },
        { id: '2', name: `Quick ${serviceType}`, rating: 4.6, price: 35 },
        { id: '3', name: `Premium ${serviceType}`, rating: 4.9, price: 75 },
      ];
    } catch (error) {
      return [];
    }
  }

  private async getUserBookings(userId?: string): Promise<any[]> {
    if (!userId) return [];
    
    try {
      // Mock data for now
      return [
        { id: '1', service: 'House Cleaning', status: 'confirmed', date: '2024-01-20' },
        { id: '2', service: 'Plumbing', status: 'pending', date: '2024-01-22' },
      ];
    } catch (error) {
      return [];
    }
  }

  private async extractServiceType(input: string): Promise<string> {
    const commonServices = ['cleaning', 'plumber', 'electrician', 'handyman', 'painter', 'gardener'];
    const words = input.toLowerCase().split(' ');
    
    for (const service of commonServices) {
      if (words.some(word => word.includes(service) || service.includes(word))) {
        return service;
      }
    }
    
    return 'general service';
  }

  // Memory management
  public setMemory(userId: string, key: string, value: any) {
    const userMemory = this.memory.get(userId) || {};
    userMemory[key] = value;
    this.memory.set(userId, userMemory);
  }

  public getMemory(userId: string, key?: string) {
    const userMemory = this.memory.get(userId) || {};
    return key ? userMemory[key] : userMemory;
  }

  public predictIntent(userId: string, currentPage: string): string[] {
    const memory = this.getMemory(userId);
    const suggestions = [];

    // Predict based on user history and current context
    if (currentPage === 'dashboard' && memory.lastSearch) {
      suggestions.push(`/find ${memory.lastSearch}`);
    }

    if (memory.pendingBookings?.length > 0) {
      suggestions.push('/status');
    }

    if (memory.lastVisit && this.daysSince(memory.lastVisit) > 7) {
      suggestions.push('/find dog walker'); // Example based on history
    }

    return suggestions;
  }

  private daysSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export const loconomyAgent = LoconomyAgent.getInstance();