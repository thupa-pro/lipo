import { MockUser } from './auth';

// Utility to simulate API latency
const simulateLatency = (callback: () => void) => {
  setTimeout(callback, Math.random() * 500 + 200); // 200-700ms delay
};

// 1. Mock Data Structures
export interface Listing {
  id: string;
  providerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  listingId: string;
  consumerId: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// 2. In-memory Data Store
let listings: Listing[] = [
  { id: 'listing-001', providerId: 'provider-001', title: 'Professional House Cleaning', description: 'Deep cleaning services for your home.', price: 150, category: 'Cleaning', createdAt: new Date() },
  { id: 'listing-002', providerId: 'provider-001', title: 'Garden Maintenance', description: 'Weekly gardening and lawn care.', price: 75, category: 'Gardening', createdAt: new Date() },
];

let bookings: Booking[] = [
  { id: 'booking-001', listingId: 'listing-001', consumerId: 'consumer-001', startTime: new Date(Date.now() + 86400000), endTime: new Date(Date.now() + 86400000 + 7200000), status: 'confirmed', createdAt: new Date() },
];

let notifications: Notification[] = [
  { id: 'notif-001', userId: 'consumer-001', message: 'Your booking for Professional House Cleaning has been confirmed.', read: false, createdAt: new Date() },
];

// 3. Mock API Functions
export const mockDataStore = {
  // Listings
  createListing: (newListing: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const listing: Listing = {
          ...newListing,
          id: `listing-${Date.now()}`,
          createdAt: new Date(),
        };
        listings.push(listing);
        resolve(listing);
      });
    });
  },

  updateListing: (id: string, updates: Partial<Omit<Listing, 'id'>>): Promise<Listing | null> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const index = listings.findIndex(l => l.id === id);
        if (index !== -1) {
          listings[index] = { ...listings[index], ...updates };
          resolve(listings[index]);
        } else {
          resolve(null);
        }
      });
    });
  },

  deleteListing: (id: string): Promise<boolean> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const initialLength = listings.length;
        listings = listings.filter(l => l.id !== id);
        resolve(listings.length < initialLength);
      });
    });
  },

  getListings: (): Promise<Listing[]> => {
    return new Promise(resolve => {
      simulateLatency(() => resolve([...listings]));
    });
  },

  // Bookings
  createBooking: (newBooking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const booking: Booking = {
          ...newBooking,
          id: `booking-${Date.now()}`,
          status: 'pending',
          createdAt: new Date(),
        };
        bookings.push(booking);
        resolve(booking);
      });
    });
  },

  updateBooking: (id: string, updates: Partial<Omit<Booking, 'id'>>): Promise<Booking | null> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
          bookings[index] = { ...bookings[index], ...updates };
          resolve(bookings[index]);
        } else {
          resolve(null);
        }
      });
    });
  },

  getBookingsForUser: (userId: string): Promise<Booking[]> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const userBookings = bookings.filter(b => b.consumerId === userId || listings.some(l => l.id === b.listingId && l.providerId === userId));
        resolve(userBookings);
      });
    });
  },

  // Notifications
  sendNotification: (userId: string, message: string): Promise<Notification> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          userId,
          message,
          read: false,
          createdAt: new Date(),
        };
        notifications.push(notification);
        resolve(notification);
      });
    });
  },

  getNotificationsForUser: (userId: string): Promise<Notification[]> => {
    return new Promise(resolve => {
      simulateLatency(() => {
        const userNotifications = notifications.filter(n => n.userId === userId);
        resolve(userNotifications);
      });
    });
  },
};
