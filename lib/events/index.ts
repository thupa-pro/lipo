import { z } from 'zod';
import { EventEmitter } from 'events';
import { createClient } from '@supabase/supabase-js';

// Sovereign Event Schema for AI-Native Marketplace
export const EventPayloadSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  version: z.string().default('1.0'),
  timestamp: z.date().default(() => new Date()),
  source: z.string(),
  data: z.record(z.any()),
  metadata: z.object({
    tenantId: z.string().optional(),
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    correlationId: z.string().optional(),
    aiContext: z.object({
      model: z.string().optional(),
      confidence: z.number().min(0).max(1).optional(),
      intent: z.string().optional(),
    }).optional(),
  }).optional(),
});

export type EventPayload = z.infer<typeof EventPayloadSchema>;

// AI-Native Event Types for Sovereign Marketplace
export enum AIMarketplaceEvents {
  // Provider Events
  PROVIDER_ONBOARDED = 'provider.onboarded',
  PROVIDER_VERIFIED = 'provider.verified',
  PROVIDER_AI_SCORED = 'provider.ai_scored',
  PROVIDER_SKILL_ENHANCED = 'provider.skill_enhanced',
  
  // Customer Events
  CUSTOMER_REGISTERED = 'customer.registered',
  CUSTOMER_AI_PROFILED = 'customer.ai_profiled',
  CUSTOMER_INTENT_DETECTED = 'customer.intent_detected',
  
  // Booking Events
  BOOKING_AI_MATCHED = 'booking.ai_matched',
  BOOKING_CONFIRMED = 'booking.confirmed',
  BOOKING_COMPLETED = 'booking.completed',
  BOOKING_AI_EVALUATED = 'booking.ai_evaluated',
  
  // AI Events
  AI_MODEL_TRAINED = 'ai.model_trained',
  AI_PREDICTION_MADE = 'ai.prediction_made',
  AI_FEEDBACK_PROCESSED = 'ai.feedback_processed',
  AI_ANOMALY_DETECTED = 'ai.anomaly_detected',
  
  // Marketplace Events
  MARKET_DEMAND_SURGE = 'market.demand_surge',
  MARKET_PRICING_OPTIMIZED = 'market.pricing_optimized',
  MARKET_QUALITY_ALERT = 'market.quality_alert',
  
  // System Events
  SYSTEM_SCALING_TRIGGERED = 'system.scaling_triggered',
  SYSTEM_HEALTH_CHECK = 'system.health_check',
  SYSTEM_SECURITY_ALERT = 'system.security_alert',
}

class SovereignEventBus extends EventEmitter {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  constructor() {
    super();
    this.setMaxListeners(100); // Handle high-throughput AI events
  }

  // Emit AI-native events with validation
  async emitSovereign(eventType: AIMarketplaceEvents, data: any, metadata?: EventPayload['metadata']) {
    const payload: EventPayload = {
      id: crypto.randomUUID(),
      type: eventType,
      version: '1.0',
      timestamp: new Date(),
      source: 'loconomy-sovereign',
      data,
      metadata: {
        ...metadata,
        aiContext: {
          model: 'gpt-4',
          confidence: metadata?.aiContext?.confidence || 0.95,
          intent: metadata?.aiContext?.intent || 'marketplace_optimization',
          ...metadata?.aiContext,
        },
      },
    };

    // Validate payload
    const validatedPayload = EventPayloadSchema.parse(payload);

    // Emit to local listeners
    this.emit(eventType, validatedPayload);

    // Persist to Supabase for distributed processing
    await this.persistEvent(validatedPayload);

    // Trigger AI processing pipeline
    if (this.isAIEvent(eventType)) {
      await this.triggerAIProcessing(validatedPayload);
    }

    return validatedPayload.id;
  }

  // Subscribe to AI-native events with type safety
  onSovereign<T = any>(
    eventType: AIMarketplaceEvents,
    handler: (payload: EventPayload & { data: T }) => void | Promise<void>
  ) {
    this.on(eventType, async (payload: EventPayload) => {
      try {
        await handler(payload as EventPayload & { data: T });
      } catch (error) {
        await this.handleEventError(eventType, payload, error);
      }
    });
  }

  // Persist events for audit and AI training
  private async persistEvent(payload: EventPayload) {
    try {
      await this.supabase
        .from('sovereign_events')
        .insert({
          id: payload.id,
          type: payload.type,
          version: payload.version,
          timestamp: payload.timestamp.toISOString(),
          source: payload.source,
          data: payload.data,
          metadata: payload.metadata,
          tenant_id: payload.metadata?.tenantId,
          user_id: payload.metadata?.userId,
        });
    } catch (error) {
      console.error('Failed to persist event:', error);
    }
  }

  // Trigger AI processing for relevant events
  private async triggerAIProcessing(payload: EventPayload) {
    try {
      // Queue for AI processing via Edge Function
      await fetch('/api/ai/process-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to trigger AI processing:', error);
    }
  }

  private isAIEvent(eventType: AIMarketplaceEvents): boolean {
    return eventType.includes('ai_') || 
           eventType.startsWith('AI_') ||
           [
             AIMarketplaceEvents.PROVIDER_AI_SCORED,
             AIMarketplaceEvents.CUSTOMER_AI_PROFILED,
             AIMarketplaceEvents.BOOKING_AI_MATCHED,
             AIMarketplaceEvents.BOOKING_AI_EVALUATED,
           ].includes(eventType);
  }

  private async handleEventError(eventType: string, payload: EventPayload, error: any) {
    console.error(`Event processing error for ${eventType}:`, error);
    
    // Emit error event for monitoring
    await this.emitSovereign(AIMarketplaceEvents.SYSTEM_SECURITY_ALERT, {
      errorType: 'event_processing_failure',
      originalEvent: eventType,
      eventId: payload.id,
      error: error.message,
    });
  }
}

// Singleton instance for sovereign marketplace
export const sovereignEventBus = new SovereignEventBus();

// Event handlers for AI-native marketplace operations
export class AIMarketplaceEventHandlers {
  static registerHandlers() {
    // Provider AI Enhancement
    sovereignEventBus.onSovereign(AIMarketplaceEvents.PROVIDER_ONBOARDED, async (payload) => {
      // Trigger AI skill assessment
      await sovereignEventBus.emitSovereign(AIMarketplaceEvents.PROVIDER_AI_SCORED, {
        providerId: payload.data.providerId,
        assessmentType: 'initial_onboarding',
      });
    });

    // Customer Intent Processing
    sovereignEventBus.onSovereign(AIMarketplaceEvents.CUSTOMER_INTENT_DETECTED, async (payload) => {
      // Trigger AI-powered provider matching
      await sovereignEventBus.emitSovereign(AIMarketplaceEvents.BOOKING_AI_MATCHED, {
        customerId: payload.data.customerId,
        intent: payload.data.intent,
        confidence: payload.metadata?.aiContext?.confidence || 0.95,
      });
    });

    // Market Optimization
    sovereignEventBus.onSovereign(AIMarketplaceEvents.BOOKING_COMPLETED, async (payload) => {
      // Trigger market analysis and pricing optimization
      await sovereignEventBus.emitSovereign(AIMarketplaceEvents.MARKET_PRICING_OPTIMIZED, {
        bookingId: payload.data.bookingId,
        providerId: payload.data.providerId,
        customerId: payload.data.customerId,
        serviceType: payload.data.serviceType,
        completionTime: payload.timestamp,
      });
    });

    // AI Model Feedback Loop
    sovereignEventBus.onSovereign(AIMarketplaceEvents.BOOKING_AI_EVALUATED, async (payload) => {
      // Trigger model training update
      await sovereignEventBus.emitSovereign(AIMarketplaceEvents.AI_FEEDBACK_PROCESSED, {
        evaluationId: payload.data.evaluationId,
        modelPerformance: payload.data.performance,
        improvementAreas: payload.data.improvements,
      });
    });
  }
}

// Initialize event handlers
AIMarketplaceEventHandlers.registerHandlers();

export default sovereignEventBus;