import { BaseRepository } from "./BaseRepository";

/**
 * Other Repository - handles brands, categories, and settings
 */
export class OtherRepository extends BaseRepository<any> {
  constructor() {
    super("brands"); // Default collection, methods use specific collections
  }

  /**
   * Get active brands for dropdown
   */
  async getBrandsForDropdown(): Promise<{ id: string; label: string }[]> {
    const snapshot = await this.collection.firestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().name,
    }));
  }

  /**
   * Get full brand objects
   */
  async getBrands(): Promise<any[]> {
    const snapshot = await this.collection.firestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    return snapshot.docs.map((doc) => this.clearTimestamps({ ...doc.data() }));
  }

  /**
   * Get active categories for dropdown
   */
  async getCategoriesForDropdown(): Promise<{ id: string; label: string }[]> {
    const snapshot = await this.collection.firestore
      .collection("categories")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().name,
    }));
  }

  /**
   * Get ERP settings
   */
  async getSettings(): Promise<any | null> {
    const doc = await this.collection.firestore
      .collection("app_settings")
      .doc("erp_settings")
      .get();

    if (!doc.exists) return null;

    const ecommerce = doc.data()?.ecommerce || {};
    return {
      ...ecommerce,
      stockId: doc.data()?.onlineStockId,
    };
  }

  /**
   * Get brands for sitemap
   */
  async getBrandsForSitemap(
    baseUrl: string
  ): Promise<{ url: string; lastModified: Date; priority: number }[]> {
    const snapshot = await this.collection.firestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .get();

    return snapshot.docs.map((doc) => ({
      url: `${baseUrl}/collections/products?brand=${encodeURIComponent(
        doc.data().name
      )}`,
      lastModified: new Date(),
      priority: 0.8,
    }));
  }

  /**
   * Get categories for sitemap
   */
  async getCategoriesForSitemap(
    baseUrl: string
  ): Promise<{ url: string; lastModified: Date; priority: number }[]> {
    const snapshot = await this.collection.firestore
      .collection("categories")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    return snapshot.docs.map((doc) => ({
      url: `${baseUrl}/collections/products?category=${encodeURIComponent(
        doc.data().name
      )}`,
      lastModified: new Date(),
      priority: 0.8,
    }));
  }

  /**
   * Get active payment methods
   */
  async getPaymentMethods(): Promise<any[]> {
    const snapshot = await this.collection.firestore
      .collection("paymentMethods")
      .where("status", "==", "Active")
      .where("available", "array-contains", "Website")
      .get();

    return snapshot.docs.map((doc) => this.clearTimestamps({ ...doc.data() }));
  }

  /**
   * Get sliders
   */
  async getSliders(): Promise<any[]> {
    const snapshot = await this.collection.firestore
      .collection("sliders")
      .get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: null,
      updatedAt: null,
    }));
  }
}

// Singleton instance
export const otherRepository = new OtherRepository();
