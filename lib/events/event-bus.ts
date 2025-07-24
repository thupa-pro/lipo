import { EventEmitter } from 'events';
import { prisma } from '@/lib/prisma';
import { notificationService } from '@/lib/notifications';
import { vectorSearchService } from '@/lib/ai/vector-search';

export type EventType = 
  | 'booking.created'
  | 'booking.confirmed'
  | 'booking.completed'
  | 'booking.cancelled'
  | 'service.created'
  | 'service.updated'
  | 'user.registered'
  | 'user.verified'
  | 'review.created'
  | 'payment.completed'
  | 'dispute.created';

export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  userId?: string;
  data: Record<string, any>;
  retryCount?: number;
  version: string;
}

export interface EventHandler {
  handle(event: BaseEvent): Promise<void>;
  canHandle(eventType: EventType): boolean;
}

export class EventBus {
  private static instance: EventBus;
  private emitter: EventEmitter;
  private handlers: Map<EventType, EventHandler[]> = new Map();
  private eventLog: BaseEvent[] = [];

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100); // Handle many concurrent events
    this.initializeHandlers();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  private initializeHandlers() {
    // Register all event handlers
    this.registerHandler(new BookingEventHandler());
    this.registerHandler(new ServiceEventHandler());
    this.registerHandler(new UserEventHandler());
    this.registerHandler(new ReviewEventHandler());
    this.registerHandler(new PaymentEventHandler());
  }

  public registerHandler(handler: EventHandler) {
    for (const eventType of Object.values(EventType)) {
      if (handler.canHandle(eventType as EventType)) {
        const handlers = this.handlers.get(eventType as EventType) || [];
        handlers.push(handler);
        this.handlers.set(eventType as EventType, handlers);
      }
    }
  }

  public async emit(event: Omit<BaseEvent, 'id' | 'timestamp' | 'version'>): Promise<void> {
    const fullEvent: BaseEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
      version: '1.0',
    };

    // Log event for debugging and replay
    this.eventLog.push(fullEvent);
    console.log(`📡 Event emitted: ${fullEvent.type}`, fullEvent.data);

    // Emit to internal EventEmitter
    this.emitter.emit(fullEvent.type, fullEvent);

    // Process with registered handlers
    await this.processEvent(fullEvent);
  }

  private async processEvent(event: BaseEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    
    // Process handlers in parallel for better performance
    const promises = handlers.map(async (handler) => {
      try {
        await handler.handle(event);
      } catch (error) {
        console.error(`Error in handler for ${event.type}:`, error);
        
        // Implement retry logic
        if ((event.retryCount || 0) < 3) {
          const retryEvent = {
            ...event,
            retryCount: (event.retryCount || 0) + 1,
          };
          
          // Retry after exponential backoff
          setTimeout(() => {
            this.processEvent(retryEvent);
          }, Math.pow(2, retryEvent.retryCount) * 1000);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  public on(eventType: EventType, listener: (event: BaseEvent) => void): void {
    this.emitter.on(eventType, listener);
  }

  public off(eventType: EventType, listener: (event: BaseEvent) => void): void {
    this.emitter.off(eventType, listener);
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getEventLog(): BaseEvent[] {
    return [...this.eventLog];
  }

  public clearEventLog(): void {
    this.eventLog = [];
  }
}

// Event Handlers

class BookingEventHandler implements EventHandler {
  canHandle(eventType: EventType): boolean {
    return eventType.startsWith('booking.');
  }

  async handle(event: BaseEvent): Promise<void> {
    switch (event.type) {
      case 'booking.created':
        await this.handleBookingCreated(event);
        break;
      case 'booking.confirmed':
        await this.handleBookingConfirmed(event);
        break;
      case 'booking.completed':
        await this.handleBookingCompleted(event);
        break;
      case 'booking.cancelled':
        await this.handleBookingCancelled(event);
        break;
    }
  }

  private async handleBookingCreated(event: BaseEvent): Promise<void> {
    const { bookingId, customerId, providerId, serviceTitle } = event.data;
    
    // Notify provider of new booking
    await notificationService.notifyBookingReceived(providerId, customerId, serviceTitle);
    
    // Update provider availability
    // Implementation would depend on availability system
    
    console.log(`📅 Booking created: ${bookingId}`);
  }

  private async handleBookingConfirmed(event: BaseEvent): Promise<void> {
    const { bookingId, customerId, providerId, serviceTitle } = event.data;
    
    // Notify customer of confirmation
    await notificationService.notifyBookingConfirmed(customerId, providerId, serviceTitle);
    
    // Schedule reminder notifications
    // Implementation would use cron jobs or temporal workflows
    
    console.log(`✅ Booking confirmed: ${bookingId}`);
  }

  private async handleBookingCompleted(event: BaseEvent): Promise<void> {
    const { bookingId, customerId, providerId, serviceTitle } = event.data;
    
    // Notify customer to leave review
    await notificationService.notifyBookingCompleted(customerId, providerId, serviceTitle);
    
    // Update provider stats
    // Update customer history
    
    console.log(`🎉 Booking completed: ${bookingId}`);
  }

  private async handleBookingCancelled(event: BaseEvent): Promise<void> {
    const { bookingId, reason } = event.data;
    
    // Handle refunds
    // Update availability
    // Send notifications
    
    console.log(`❌ Booking cancelled: ${bookingId}, reason: ${reason}`);
  }
}

class ServiceEventHandler implements EventHandler {
  canHandle(eventType: EventType): boolean {
    return eventType.startsWith('service.');
  }

  async handle(event: BaseEvent): Promise<void> {
    switch (event.type) {
      case 'service.created':
        await this.handleServiceCreated(event);
        break;
      case 'service.updated':
        await this.handleServiceUpdated(event);
        break;
    }
  }

  private async handleServiceCreated(event: BaseEvent): Promise<void> {
    const { serviceId } = event.data;
    
    // Index service for search
    await vectorSearchService.indexServiceListing(serviceId);
    
    // Auto-generate tags
    await vectorSearchService.autoTagService(serviceId);
    
    // Notify potential customers in the area
    // Implementation would match to user preferences
    
    console.log(`🆕 Service created and indexed: ${serviceId}`);
  }

  private async handleServiceUpdated(event: BaseEvent): Promise<void> {
    const { serviceId } = event.data;
    
    // Re-index service for search
    await vectorSearchService.indexServiceListing(serviceId);
    
    console.log(`🔄 Service updated and re-indexed: ${serviceId}`);
  }
}

class UserEventHandler implements EventHandler {
  canHandle(eventType: EventType): boolean {
    return eventType.startsWith('user.');
  }

  async handle(event: BaseEvent): Promise<void> {
    switch (event.type) {
      case 'user.registered':
        await this.handleUserRegistered(event);
        break;
      case 'user.verified':
        await this.handleUserVerified(event);
        break;
    }
  }

  private async handleUserRegistered(event: BaseEvent): Promise<void> {
    const { userId, email, role } = event.data;
    
    // Send welcome sequence
    // Create user profile
    // Set up preferences
    
    console.log(`👤 User registered: ${email} as ${role}`);
  }

  private async handleUserVerified(event: BaseEvent): Promise<void> {
    const { userId } = event.data;
    
    // Send verification notification
    await notificationService.notifyVerificationApproved(userId);
    
    // Enable full account features
    // Send onboarding notifications
    
    console.log(`✅ User verified: ${userId}`);
  }
}

class ReviewEventHandler implements EventHandler {
  canHandle(eventType: EventType): boolean {
    return eventType.startsWith('review.');
  }

  async handle(event: BaseEvent): Promise<void> {
    switch (event.type) {
      case 'review.created':
        await this.handleReviewCreated(event);
        break;
    }
  }

  private async handleReviewCreated(event: BaseEvent): Promise<void> {
    const { reviewId, providerId, customerId, rating, serviceId } = event.data;
    
    // Notify provider of new review
    await notificationService.notifyReviewReceived(providerId, customerId, rating);
    
    // Update provider's average rating
    await this.updateProviderRating(providerId);
    
    // Re-index service with new review data
    await vectorSearchService.indexServiceListing(serviceId);
    
    console.log(`⭐ Review created: ${rating} stars for provider ${providerId}`);
  }

  private async updateProviderRating(providerId: string): Promise<void> {
    // Calculate new average rating for provider
    const reviews = await prisma.review.findMany({
      where: {
        service: {
          providerId,
        },
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await prisma.userProfile.updateMany({
        where: {
          userId: providerId,
        },
        data: {
          rating: avgRating,
          totalReviews: reviews.length,
        },
      });
    }
  }
}

class PaymentEventHandler implements EventHandler {
  canHandle(eventType: EventType): boolean {
    return eventType.startsWith('payment.');
  }

  async handle(event: BaseEvent): Promise<void> {
    switch (event.type) {
      case 'payment.completed':
        await this.handlePaymentCompleted(event);
        break;
    }
  }

  private async handlePaymentCompleted(event: BaseEvent): Promise<void> {
    const { paymentId, bookingId, amount, providerId } = event.data;
    
    // Release escrow
    // Update booking status
    // Send payment notifications
    // Update provider earnings
    
    console.log(`💰 Payment completed: ${amount} for booking ${bookingId}`);
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();

// Helper functions for common events
export const Events = {
  bookingCreated: (data: any) => eventBus.emit({
    type: 'booking.created',
    data,
    userId: data.customerId,
  }),

  bookingConfirmed: (data: any) => eventBus.emit({
    type: 'booking.confirmed',
    data,
    userId: data.customerId,
  }),

  bookingCompleted: (data: any) => eventBus.emit({
    type: 'booking.completed',
    data,
    userId: data.customerId,
  }),

  serviceCreated: (data: any) => eventBus.emit({
    type: 'service.created',
    data,
    userId: data.providerId,
  }),

  userRegistered: (data: any) => eventBus.emit({
    type: 'user.registered',
    data,
    userId: data.userId,
  }),

  userVerified: (data: any) => eventBus.emit({
    type: 'user.verified',
    data,
    userId: data.userId,
  }),

  reviewCreated: (data: any) => eventBus.emit({
    type: 'review.created',
    data,
    userId: data.customerId,
  }),
};