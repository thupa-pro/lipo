// Comprehensive data activation system for Loconomy
import {
  seedUsers,
  seedServices,
  seedBookings,
  seedReviews,
  popularCategories,
  platformStats,
  testimonials,
} from "./seed-data";

export interface DataActivationResult {
  success: boolean;
  activated: string[];
  errors: string[];
  totalRecords: number;
}

export class DataActivator {
  private static instance: DataActivator;
  private isActivated = false;

  static getInstance(): DataActivator {
    if (!DataActivator.instance) {
      DataActivator.instance = new DataActivator();
    }
    return DataActivator.instance;
  }

  async activateAll(): Promise<DataActivationResult> {
    const result: DataActivationResult = {
      success: true,
      activated: [],
      errors: [],
      totalRecords: 0,
    };

    try {
      // Store all realistic data in localStorage for demo purposes
      const dataTypes = [
        { key: "users", data: seedUsers, name: "Users & Providers" },
        { key: "services", data: seedServices, name: "Service Listings" },
        { key: "bookings", data: seedBookings, name: "Booking History" },
        { key: "reviews", data: seedReviews, name: "Customer Reviews" },
        {
          key: "categories",
          data: popularCategories,
          name: "Service Categories",
        },
        { key: "stats", data: platformStats, name: "Platform Statistics" },
        {
          key: "testimonials",
          data: testimonials,
          name: "Customer Testimonials",
        },
      ];

      for (const type of dataTypes) {
        try {
          localStorage.setItem(
            `loconomy_${type.key}`,
            JSON.stringify(type.data),
          );
          result.activated.push(type.name);
          result.totalRecords += Array.isArray(type.data)
            ? type.data.length
            : 1;
        } catch (error) {
          result.errors.push(`Failed to activate ${type.name}: ${error}`);
          result.success = false;
        }
      }

      // Set activation flag
      localStorage.setItem("loconomy_data_activated", "true");
      localStorage.setItem(
        "loconomy_activation_timestamp",
        new Date().toISOString(),
      );

      this.isActivated = true;
    } catch (error) {
      result.success = false;
      result.errors.push(`General activation error: ${error}`);
    }

    return result;
  }

  getRealisticUsers() {
    if (typeof window === "undefined") return seedUsers;
    const stored = localStorage.getItem("loconomy_users");
    return stored ? JSON.parse(stored) : seedUsers;
  }

  getRealisticServices() {
    if (typeof window === "undefined") return seedServices;
    const stored = localStorage.getItem("loconomy_services");
    return stored ? JSON.parse(stored) : seedServices;
  }

  getRealisticBookings() {
    if (typeof window === "undefined") return seedBookings;
    const stored = localStorage.getItem("loconomy_bookings");
    return stored ? JSON.parse(stored) : seedBookings;
  }

  getRealisticReviews() {
    if (typeof window === "undefined") return seedReviews;
    const stored = localStorage.getItem("loconomy_reviews");
    return stored ? JSON.parse(stored) : seedReviews;
  }

  getRealisticTestimonials() {
    if (typeof window === "undefined") return testimonials;
    const stored = localStorage.getItem("loconomy_testimonials");
    return stored ? JSON.parse(stored) : testimonials;
  }

  getPlatformStats() {
    if (typeof window === "undefined") return platformStats;
    const stored = localStorage.getItem("loconomy_stats");
    return stored ? JSON.parse(stored) : platformStats;
  }

  isDataActivated(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("loconomy_data_activated") === "true";
  }

  getActivationStatus() {
    if (typeof window === "undefined") return null;
    const timestamp = localStorage.getItem("loconomy_activation_timestamp");
    return {
      activated: this.isDataActivated(),
      timestamp: timestamp ? new Date(timestamp) : null,
      recordCount: this.getTotalRecordCount(),
    };
  }

  private getTotalRecordCount(): number {
    let total = 0;
    const keys = [
      "users",
      "services",
      "bookings",
      "reviews",
      "categories",
      "testimonials",
    ];

    for (const key of keys) {
      const stored = localStorage.getItem(`loconomy_${key}`);
      if (stored) {
        const data = JSON.parse(stored);
        total += Array.isArray(data) ? data.length : 1;
      }
    }

    return total;
  }

  clearAllData(): void {
    if (typeof window === "undefined") return;

    const keys = [
      "loconomy_users",
      "loconomy_services",
      "loconomy_bookings",
      "loconomy_reviews",
      "loconomy_categories",
      "loconomy_stats",
      "loconomy_testimonials",
      "loconomy_data_activated",
      "loconomy_activation_timestamp",
    ];

    keys.forEach((key) => localStorage.removeItem(key));
    this.isActivated = false;
  }

  exportData(): string {
    const data = {
      users: this.getRealisticUsers(),
      services: this.getRealisticServices(),
      bookings: this.getRealisticBookings(),
      reviews: this.getRealisticReviews(),
      testimonials: this.getRealisticTestimonials(),
      stats: this.getPlatformStats(),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): DataActivationResult {
    const result: DataActivationResult = {
      success: true,
      activated: [],
      errors: [],
      totalRecords: 0,
    };

    try {
      const data = JSON.parse(jsonData);

      const dataMap = {
        users: "Users & Providers",
        services: "Service Listings",
        bookings: "Booking History",
        reviews: "Customer Reviews",
        testimonials: "Customer Testimonials",
        stats: "Platform Statistics",
      };

      for (const [key, name] of Object.entries(dataMap)) {
        if (data[key]) {
          try {
            localStorage.setItem(`loconomy_${key}`, JSON.stringify(data[key]));
            result.activated.push(name);
            result.totalRecords += Array.isArray(data[key])
              ? data[key].length
              : 1;
          } catch (error) {
            result.errors.push(`Failed to import ${name}: ${error}`);
            result.success = false;
          }
        }
      }

      if (result.success) {
        localStorage.setItem("loconomy_data_activated", "true");
        localStorage.setItem(
          "loconomy_activation_timestamp",
          new Date().toISOString(),
        );
        this.isActivated = true;
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Invalid JSON data: ${error}`);
    }

    return result;
  }
}

export const dataActivator = DataActivator.getInstance();

// Utility functions for easy access
export const getRealisticData = {
  users: () => dataActivator.getRealisticUsers(),
  services: () => dataActivator.getRealisticServices(),
  bookings: () => dataActivator.getRealisticBookings(),
  reviews: () => dataActivator.getRealisticReviews(),
  testimonials: () => dataActivator.getRealisticTestimonials(),
  stats: () => dataActivator.getPlatformStats(),
};

// Auto-activate data on module load for seamless experience
if (typeof window !== "undefined") {
  const activator = DataActivator.getInstance();
  if (!activator.isDataActivated()) {
    activator.activateAll().then((result) => {
      if (result.success) {
        console.log("✅ Loconomy realistic data activated successfully");
        console.log(`📊 Loaded ${result.totalRecords} realistic records`);
        console.log("🎯 Platform ready for launch");
      }
    });
  }
}
