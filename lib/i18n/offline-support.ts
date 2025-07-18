// Offline language support with service worker integration
export class OfflineTranslationManager {
  private dbName = "loconomy-translations";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create translations store
        if (!db.objectStoreNames.contains("translations")) {
          const translationsStore = db.createObjectStore("translations", {
            keyPath: "id",
          });
          translationsStore.createIndex("locale", "locale", { unique: false });
          translationsStore.createIndex("lastUpdated", "lastUpdated", {
            unique: false,
          });
        }

        // Create cache metadata store
        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata", { keyPath: "key" });
        }
      };
    });
  }

  async storeTranslations(locale: string, translations: any): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["translations"], "readwrite");
    const store = transaction.objectStore("translations");

    const data = {
      id: locale,
      locale,
      translations,
      lastUpdated: Date.now(),
      version: 1,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTranslations(locale: string): Promise<any | null> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["translations"], "readonly");
    const store = transaction.objectStore("translations");

    return new Promise((resolve, reject) => {
      const request = store.get(locale);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.translations : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedLocales(): Promise<string[]> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["translations"], "readonly");
    const store = transaction.objectStore("translations");

    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  async isStale(
    locale: string,
    maxAge: number = 24 * 60 * 60 * 1000,
  ): Promise<boolean> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["translations"], "readonly");
    const store = transaction.objectStore("translations");

    return new Promise((resolve, reject) => {
      const request = store.get(locale);
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(true); // No data is stale
        } else {
          const age = Date.now() - result.lastUpdated;
          resolve(age > maxAge);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async syncWithServer(locale: string): Promise<void> {
    try {
      const response = await fetch(`/api/translations/${locale}`);
      if (response.ok) {
        const translations = await response.json();
        await this.storeTranslations(locale, translations);
      }
    } catch (error) {
      console.warn(`Failed to sync translations for ${locale}:`, error);
    }
  }

  async prefetchLanguages(locales: string[]): Promise<void> {
    const promises = locales.map((locale) => this.syncWithServer(locale));
    await Promise.allSettled(promises);
  }
}

// Service Worker registration for offline support
export async function registerTranslationServiceWorker(): Promise<void> {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/sw-translations.js",
      );
      console.log("Translation SW registered:", registration);

      // Update service worker when new version is available
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available
              console.log("New translation cache available");
            }
          });
        }
      });
    } catch (error) {
      console.error("Translation SW registration failed:", error);
    }
  }
}

// Progressive download strategy
export class ProgressiveLanguageLoader {
  private loadedLanguages = new Set<string>();
  private loadingPromises = new Map<string, Promise<any>>();
  private offlineManager = new OfflineTranslationManager();

  constructor() {
    this.offlineManager.init();
  }

  async loadLanguage(
    locale: string,
    priority: "high" | "normal" | "low" = "normal",
  ): Promise<any> {
    if (this.loadedLanguages.has(locale)) {
      return this.getCachedTranslations(locale);
    }

    if (this.loadingPromises.has(locale)) {
      return this.loadingPromises.get(locale);
    }

    const loadPromise = this.loadLanguageInternal(locale, priority);
    this.loadingPromises.set(locale, loadPromise);

    try {
      const translations = await loadPromise;
      this.loadedLanguages.add(locale);
      return translations;
    } finally {
      this.loadingPromises.delete(locale);
    }
  }

  private async loadLanguageInternal(
    locale: string,
    priority: "high" | "normal" | "low",
  ): Promise<any> {
    // Try offline first
    const cachedTranslations =
      await this.offlineManager.getTranslations(locale);
    const isStale = await this.offlineManager.isStale(locale);

    if (cachedTranslations && !isStale) {
      return cachedTranslations;
    }

    // Try to fetch from network
    if (navigator.onLine) {
      try {
        const networkTranslations = await this.fetchFromNetwork(
          locale,
          priority,
        );
        await this.offlineManager.storeTranslations(
          locale,
          networkTranslations,
        );
        return networkTranslations;
      } catch (error) {
        console.warn(`Failed to fetch ${locale} from network:`, error);
      }
    }

    // Fallback to cached (even if stale) or error
    if (cachedTranslations) {
      console.warn(`Using stale translations for ${locale}`);
      return cachedTranslations;
    }

    throw new Error(`No translations available for ${locale}`);
  }

  private async fetchFromNetwork(
    locale: string,
    priority: "high" | "normal" | "low",
  ): Promise<any> {
    const url = `/messages/${locale}.json`;

    // Use different strategies based on priority
    const fetchOptions: RequestInit = {
      method: "GET",
      cache: priority === "high" ? "no-cache" : "default",
    };

    if (priority === "low") {
      // Use background fetch for low priority
      fetchOptions.priority = "low";
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${locale}: ${response.status}`);
    }

    return response.json();
  }

  private async getCachedTranslations(locale: string): Promise<any> {
    return this.offlineManager.getTranslations(locale);
  }

  async preloadCriticalLanguages(locales: string[]): Promise<void> {
    const promises = locales.map((locale) =>
      this.loadLanguage(locale, "high").catch((error) =>
        console.warn(`Failed to preload ${locale}:`, error),
      ),
    );

    await Promise.allSettled(promises);
  }

  async preloadInBackground(locales: string[]): Promise<void> {
    // Use requestIdleCallback for background loading
    const loadNext = (index: number) => {
      if (index >= locales.length) return;

      const callback = () => {
        this.loadLanguage(locales[index], "low")
          .catch((error) =>
            console.warn(
              `Background load failed for ${locales[index]}:`,
              error,
            ),
          )
          .finally(() => loadNext(index + 1));
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 5000 });
      } else {
        setTimeout(callback, 100);
      }
    };

    loadNext(0);
  }

  isLanguageLoaded(locale: string): boolean {
    return this.loadedLanguages.has(locale);
  }

  async getAvailableLanguages(): Promise<string[]> {
    return this.offlineManager.getCachedLocales();
  }
}

// Network-aware translation loading
export class NetworkAwareTranslationLoader {
  private connectionType: string = "unknown";
  private effectiveType: string = "unknown";

  constructor() {
    this.detectConnectionType();
    this.setupNetworkListeners();
  }

  private detectConnectionType(): void {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      this.connectionType = connection.type || "unknown";
      this.effectiveType = connection.effectiveType || "unknown";
    }
  }

  private setupNetworkListeners(): void {
    window.addEventListener("online", () => {
      console.log("Network: Online");
      this.syncStaleTranslations();
    });

    window.addEventListener("offline", () => {
      console.log("Network: Offline");
    });

    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener("change", () => {
        this.detectConnectionType();
        this.adaptToNetworkConditions();
      });
    }
  }

  private adaptToNetworkConditions(): void {
    // Adapt loading strategy based on connection
    if (this.effectiveType === "slow-2g" || this.effectiveType === "2g") {
      // Use minimal translations for slow connections
      console.log(
        "Network: Slow connection detected, using minimal translations",
      );
    } else if (this.effectiveType === "3g") {
      // Use compressed translations
      console.log("Network: 3G connection, using compressed translations");
    } else {
      // Use full translations for fast connections
      console.log("Network: Fast connection, using full translations");
    }
  }

  private async syncStaleTranslations(): Promise<void> {
    const offlineManager = new OfflineTranslationManager();
    const cachedLocales = await offlineManager.getCachedLocales();

    for (const locale of cachedLocales) {
      const isStale = await offlineManager.isStale(locale);
      if (isStale) {
        offlineManager.syncWithServer(locale);
      }
    }
  }

  shouldPreload(): boolean {
    // Don't preload on slow or metered connections
    if (this.effectiveType === "slow-2g" || this.effectiveType === "2g") {
      return false;
    }

    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection.saveData) {
        return false; // User has data saver enabled
      }
    }

    return true;
  }

  getOptimalBatchSize(): number {
    switch (this.effectiveType) {
      case "slow-2g":
      case "2g":
        return 1;
      case "3g":
        return 3;
      case "4g":
        return 5;
      default:
        return 5;
    }
  }
}
