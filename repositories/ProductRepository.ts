import { BaseRepository } from "./BaseRepository";
import type { Query } from "firebase-admin/firestore";
import type { Product, ProductVariant } from "@/interfaces";

/**
 * Query options for product fetching
 */
export interface ProductQueryOptions {
  tags?: string[];
  inStock?: boolean;
  page?: number;
  size?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  total: number;
  dataList: T[];
}

/**
 * Product Repository - handles all product data access
 */
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super("products");
  }

  /**
   * Get active products query with listing filter
   */
  private getListedProductsQuery(): Query {
    return this.getActiveQuery().where("listing", "==", true);
  }

  /**
   * Filter active, non-deleted variants
   */
  private filterActiveVariants(
    variants: ProductVariant[] = []
  ): ProductVariant[] {
    return variants.filter((v) => v.status === true && v.isDeleted !== true);
  }

  /**
   * Strip buying price from product (security)
   */
  private sanitizeProduct<T extends { buyingPrice?: number }>(
    product: T
  ): Omit<T, "buyingPrice"> {
    const { buyingPrice, ...rest } = product;
    return rest;
  }

  /**
   * Prepare product for client response
   */
  private prepareProduct(data: Product): Omit<Product, "buyingPrice"> {
    return this.sanitizeProduct({
      ...data,
      variants: this.filterActiveVariants(data.variants),
      createdAt: null,
      updatedAt: null,
    });
  }

  /**
   * Find all products with optional filters and pagination
   */
  async findAll(
    options: ProductQueryOptions = {}
  ): Promise<PaginatedResult<Product>> {
    const { tags, inStock, page = 1, size = 20 } = options;

    let query = this.getListedProductsQuery();

    if (tags?.length) {
      query = query.where("tags", "array-contains-any", tags);
    }

    if (typeof inStock === "boolean") {
      query = query.where("inStock", "==", inStock);
    }

    const total = await this.countDocuments(query);
    const pagedQuery = this.applyPagination(query, page, size);
    const snapshot = await pagedQuery.get();

    const dataList = snapshot.docs
      .map((doc) => this.prepareProduct(doc.data() as Product))
      .filter((p) => (p.variants?.length ?? 0) > 0);

    return { total, dataList };
  }

  /**
   * Find a single product by ID
   */
  async findById(id: string): Promise<Product | null> {
    const snapshot = await this.getListedProductsQuery()
      .where("id", "==", id)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return this.prepareProduct(snapshot.docs[0].data() as Product);
  }

  /**
   * Find multiple products by IDs
   */
  async findByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];

    const docs = await this.findDocsByIds(ids, "id");

    return docs
      .map((doc) => this.prepareProduct(doc.data() as Product))
      .filter((p) => p.variants?.length > 0);
  }

  /**
   * Find new arrivals (products created/updated in last 30 days)
   */
  async findNewArrivals(
    options: ProductQueryOptions = {}
  ): Promise<PaginatedResult<Product>> {
    const { page = 1, size = 20 } = options;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateThreshold = thirtyDaysAgo.toISOString();

    let query = this.getListedProductsQuery()
      .where("createdAt", ">=", dateThreshold)
      .orderBy("createdAt", "desc");

    const snapshot = await query.get();
    let total = snapshot.size;

    // Fallback to recent updated items if no new arrivals
    if (total === 0 && page === 1) {
      query = this.getListedProductsQuery().orderBy("updatedAt", "desc");
      total = await this.countDocuments(query);
    }

    const pagedQuery = this.applyPagination(query, page, size);
    const pagedSnapshot = await pagedQuery.get();

    const dataList = pagedSnapshot.docs
      .map((doc) => this.prepareProduct(doc.data() as Product))
      .filter((p) => (p.variants?.length ?? 0) > 0);

    return { total, dataList };
  }

  /**
   * Find products with discounts
   */
  async findDiscounted(
    options: ProductQueryOptions = {}
  ): Promise<PaginatedResult<Product>> {
    const { tags, inStock, page = 1, size = 20 } = options;

    let query = this.getListedProductsQuery().where("discount", ">", 0);

    if (tags?.length) {
      query = query.where("tags", "array-contains-any", tags);
    }

    if (typeof inStock === "boolean") {
      query = query.where("inStock", "==", inStock);
    }

    const total = await this.countDocuments(query);
    const pagedQuery = this.applyPagination(query, page, size);
    const snapshot = await pagedQuery.get();

    const dataList = snapshot.docs
      .map((doc) => this.prepareProduct(doc.data() as Product))
      .filter((p) => (p.variants?.length ?? 0) > 0);

    return { total, dataList };
  }

  /**
   * Find similar products by category
   */
  async findSimilar(productId: string, limit: number = 8): Promise<Product[]> {
    const product = await this.findById(productId);
    if (!product) return [];

    const snapshot = await this.getListedProductsQuery()
      .where("tags", "array-contains-any", [product.category?.toLowerCase()])
      .limit(limit + 1) // +1 to account for excluding current product
      .get();

    return snapshot.docs
      .filter((doc) => doc.id !== productId)
      .slice(0, limit)
      .map((doc) => this.prepareProduct(doc.data() as Product));
  }

  /**
   * Find recent items (for homepage)
   */
  async findRecent(limit: number = 8): Promise<Product[]> {
    const snapshot = await this.getListedProductsQuery().limit(limit).get();

    return snapshot.docs.map((doc) =>
      this.prepareProduct(doc.data() as Product)
    );
  }

  /**
   * Get product stock for a specific variant and size
   */
  async getStock(
    productId: string,
    variantId: string,
    size: string,
    stockId: string
  ): Promise<number> {
    const snapshot = await this.collection.firestore
      .collection("stock_inventory")
      .where("productId", "==", productId)
      .where("variantId", "==", variantId)
      .where("stockId", "==", stockId)
      .where("size", "==", size)
      .limit(1)
      .get();

    if (snapshot.empty) return 0;
    return snapshot.docs[0].data().quantity ?? 0;
  }

  /**
   * Get all products for sitemap generation
   */
  async findAllForSitemap(): Promise<{ id: string; updatedAt: any }[]> {
    const snapshot = await this.getListedProductsQuery().get();

    return snapshot.docs.map((doc) => ({
      id: doc.data().id,
      updatedAt: doc.data().updatedAt,
    }));
  }
}

// Singleton instance
export const productRepository = new ProductRepository();
