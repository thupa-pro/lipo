import { MockListing, MockBooking, MockNotification, MockUser } from "./types";

const STORAGE_KEYS = {
  listings: "loconomy_mock_listings",
  bookings: "loconomy_mock_bookings",
  notifications: "loconomy_mock_notifications",
  users: "loconomy_mock_users",
};

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to generate unique IDs
const generateId = () =>
  `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Default sample data
const defaultListings: MockListing[] = [
  {
    id: "listing_1",
    title: "Professional House Cleaning",
    description:
      "Deep cleaning service for your home. Includes kitchen, bathrooms, living areas, and bedrooms.",
    category: "cleaning",
    price: 85,
    providerId: "provider_1",
    providerName: "Mike Rodriguez",
    location: "Downtown Seattle",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop",
    ],
    availability: {
      monday: ["09:00", "10:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "11:00", "14:00"],
      wednesday: ["09:00", "14:00", "15:00", "16:00"],
      thursday: ["10:00", "11:00", "14:00", "15:00"],
      friday: ["09:00", "10:00", "14:00"],
    },
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "listing_2",
    title: "Personal Training Session",
    description:
      "One-on-one fitness training with certified personal trainer. Customized workout plans.",
    category: "fitness",
    price: 65,
    providerId: "provider_2",
    providerName: "Jessica Adams",
    location: "Capitol Hill Gym",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1434754205268-ad3b5f052d9a?w=400&h=300&fit=crop",
    ],
    availability: {
      monday: ["06:00", "07:00", "18:00", "19:00"],
      wednesday: ["06:00", "07:00", "18:00", "19:00"],
      friday: ["06:00", "07:00", "18:00", "19:00"],
      saturday: ["08:00", "09:00", "10:00", "11:00"],
    },
    status: "active",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "listing_3",
    title: "Gourmet Meal Delivery",
    description:
      "Fresh, locally-sourced meals prepared by professional chef. Weekly meal prep available.",
    category: "food",
    price: 45,
    providerId: "provider_3",
    providerName: "Chef Marcus Thompson",
    location: "Fremont Kitchen",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    ],
    availability: {
      monday: ["11:00", "12:00", "17:00", "18:00"],
      tuesday: ["11:00", "12:00", "17:00", "18:00"],
      wednesday: ["11:00", "12:00", "17:00", "18:00"],
      thursday: ["11:00", "12:00", "17:00", "18:00"],
      friday: ["11:00", "12:00", "17:00", "18:00"],
    },
    status: "active",
    createdAt: new Date("2024-01-08"),
  },
];

const defaultBookings: MockBooking[] = [
  {
    id: "booking_1",
    listingId: "listing_1",
    listingTitle: "Professional House Cleaning",
    providerId: "provider_1",
    providerName: "Mike Rodriguez",
    consumerId: "consumer_1",
    consumerName: "Sarah Johnson",
    date: "2024-02-15",
    timeSlot: "10:00",
    status: "confirmed",
    totalAmount: 85,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "booking_2",
    listingId: "listing_2",
    listingTitle: "Personal Training Session",
    providerId: "provider_2",
    providerName: "Jessica Adams",
    consumerId: "consumer_1",
    consumerName: "Sarah Johnson",
    date: "2024-02-16",
    timeSlot: "07:00",
    status: "pending",
    totalAmount: 65,
    createdAt: new Date("2024-02-11"),
  },
];

const defaultNotifications: MockNotification[] = [
  {
    id: "notif_1",
    userId: "consumer_1",
    title: "Booking Confirmed",
    message:
      "Your house cleaning appointment has been confirmed for Feb 15th at 10:00 AM.",
    type: "success",
    read: false,
    createdAt: new Date("2024-02-10T14:30:00"),
  },
  {
    id: "notif_2",
    userId: "consumer_1",
    title: "New Message",
    message:
      "Mike Rodriguez sent you a message about your upcoming appointment.",
    type: "info",
    read: false,
    createdAt: new Date("2024-02-11T09:15:00"),
  },
];

class MockDataStore {
  // Generic storage methods
  private getFromStorage<T>(key: string, defaultData: T[]): T[] {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
      return defaultData;
    } catch (error) {
      console.warn(`Failed to load ${key}:`, error);
      return defaultData;
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save ${key}:`, error);
    }
  }

  // Listings CRUD
  async getListings(): Promise<MockListing[]> {
    await delay();
    return this.getFromStorage(STORAGE_KEYS.listings, defaultListings);
  }

  async getListing(id: string): Promise<MockListing | null> {
    await delay();
    const listings = this.getFromStorage(
      STORAGE_KEYS.listings,
      defaultListings,
    );
    return listings.find((listing) => listing.id === id) || null;
  }

  async createListing(
    data: Omit<MockListing, "id" | "createdAt">,
  ): Promise<MockListing> {
    await delay(500);
    const listings = this.getFromStorage(
      STORAGE_KEYS.listings,
      defaultListings,
    );

    const newListing: MockListing = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
    };

    listings.push(newListing);
    this.saveToStorage(STORAGE_KEYS.listings, listings);
    return newListing;
  }

  async updateListing(
    id: string,
    data: Partial<MockListing>,
  ): Promise<MockListing | null> {
    await delay(400);
    const listings = this.getFromStorage(
      STORAGE_KEYS.listings,
      defaultListings,
    );
    const index = listings.findIndex((listing) => listing.id === id);

    if (index === -1) return null;

    const updatedListing = { ...listings[index], ...data };
    listings[index] = updatedListing;
    this.saveToStorage(STORAGE_KEYS.listings, listings);
    return updatedListing;
  }

  async deleteListing(id: string): Promise<boolean> {
    await delay(300);
    const listings = this.getFromStorage(
      STORAGE_KEYS.listings,
      defaultListings,
    );
    const filteredListings = listings.filter((listing) => listing.id !== id);

    if (filteredListings.length === listings.length) return false;

    this.saveToStorage(STORAGE_KEYS.listings, filteredListings);
    return true;
  }

  // Bookings CRUD
  async getBookings(): Promise<MockBooking[]> {
    await delay();
    return this.getFromStorage(STORAGE_KEYS.bookings, defaultBookings);
  }

  async getBooking(id: string): Promise<MockBooking | null> {
    await delay();
    const bookings = this.getFromStorage(
      STORAGE_KEYS.bookings,
      defaultBookings,
    );
    return bookings.find((booking) => booking.id === id) || null;
  }

  async createBooking(
    data: Omit<MockBooking, "id" | "createdAt">,
  ): Promise<MockBooking> {
    await delay(600);
    const bookings = this.getFromStorage(
      STORAGE_KEYS.bookings,
      defaultBookings,
    );

    const newBooking: MockBooking = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
    };

    bookings.push(newBooking);
    this.saveToStorage(STORAGE_KEYS.bookings, bookings);

    // Create notification for provider
    await this.sendNotification({
      userId: data.providerId,
      title: "New Booking Request",
      message: `${data.consumerName} has booked your service "${data.listingTitle}" for ${data.date} at ${data.timeSlot}.`,
      type: "info",
    });

    return newBooking;
  }

  async updateBooking(
    id: string,
    data: Partial<MockBooking>,
  ): Promise<MockBooking | null> {
    await delay(400);
    const bookings = this.getFromStorage(
      STORAGE_KEYS.bookings,
      defaultBookings,
    );
    const index = bookings.findIndex((booking) => booking.id === id);

    if (index === -1) return null;

    const updatedBooking = { ...bookings[index], ...data };
    bookings[index] = updatedBooking;
    this.saveToStorage(STORAGE_KEYS.bookings, bookings);

    // Send notification based on status change
    if (data.status) {
      const statusMessages = {
        confirmed: "Your booking has been confirmed!",
        completed:
          "Your booking has been completed. Please rate your experience.",
        canceled: "Your booking has been canceled.",
      };

      if (statusMessages[data.status as keyof typeof statusMessages]) {
        await this.sendNotification({
          userId: updatedBooking.consumerId,
          title: "Booking Update",
          message: statusMessages[data.status as keyof typeof statusMessages],
          type: data.status === "canceled" ? "warning" : "success",
        });
      }
    }

    return updatedBooking;
  }

  // Notifications CRUD
  async getNotifications(userId: string): Promise<MockNotification[]> {
    await delay();
    const notifications = this.getFromStorage(
      STORAGE_KEYS.notifications,
      defaultNotifications,
    );
    return notifications.filter((notif) => notif.userId === userId);
  }

  async sendNotification(
    data: Omit<MockNotification, "id" | "read" | "createdAt">,
  ): Promise<MockNotification> {
    await delay(200);
    const notifications = this.getFromStorage(
      STORAGE_KEYS.notifications,
      defaultNotifications,
    );

    const newNotification: MockNotification = {
      ...data,
      id: generateId(),
      read: false,
      createdAt: new Date(),
    };

    notifications.push(newNotification);
    this.saveToStorage(STORAGE_KEYS.notifications, notifications);
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<boolean> {
    await delay(100);
    const notifications = this.getFromStorage(
      STORAGE_KEYS.notifications,
      defaultNotifications,
    );
    const index = notifications.findIndex((notif) => notif.id === id);

    if (index === -1) return false;

    notifications[index].read = true;
    this.saveToStorage(STORAGE_KEYS.notifications, notifications);
    return true;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await delay(200);
    const notifications = this.getFromStorage(
      STORAGE_KEYS.notifications,
      defaultNotifications,
    );

    notifications.forEach((notif) => {
      if (notif.userId === userId) {
        notif.read = true;
      }
    });

    this.saveToStorage(STORAGE_KEYS.notifications, notifications);
  }

  // Analytics data
  async getAnalytics() {
    await delay(800);
    const listings = await this.getListings();
    const bookings = await this.getBookings();

    return {
      totalListings: listings.length,
      totalBookings: bookings.length,
      activeListings: listings.filter((l) => l.status === "active").length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed")
        .length,
      totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
      recentBookings: bookings.slice(-5).reverse(),
      topProviders: listings.reduce(
        (acc, listing) => {
          const provider = acc[listing.providerId] || {
            name: listing.providerName,
            count: 0,
          };
          provider.count++;
          acc[listing.providerId] = provider;
          return acc;
        },
        {} as Record<string, { name: string; count: number }>,
      ),
    };
  }

  // Clear all data (for testing/demo purposes)
  async clearAllData(): Promise<void> {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  // Reset to default data
  async resetToDefaults(): Promise<void> {
    this.saveToStorage(STORAGE_KEYS.listings, defaultListings);
    this.saveToStorage(STORAGE_KEYS.bookings, defaultBookings);
    this.saveToStorage(STORAGE_KEYS.notifications, defaultNotifications);
  }
}

// Export singleton instance
export const mockDataStore = new MockDataStore();

// Export types and utilities
export type { MockListing, MockBooking, MockNotification };
export { generateId };
