import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Item, PaymentMethod } from "@/interfaces/BagItem";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// ====================== Products ======================
export const getProducts = async (
  tags?: string[],
  inStock?: boolean,
  page: number = 1,
  size: number = 20
): Promise<{ total: number; dataList: Product[] }> => {
  try {
    console.log(
      `[ProductService] getProducts → Page: ${page}, Size: ${size}, Tags: ${tags}, InStock: ${inStock}`
    );
    let query: FirebaseFirestore.Query = adminFirestore
      .collection("products")
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true);

    const offset = (page - 1) * size;

    if (tags && tags.length > 0) {
      query = query.where("tags", "array-contains-any", tags);
      console.log(`[ProductService] Filtering by tags: ${tags}`);
    }

    if (typeof inStock === "boolean") {
      query = query.where("inStock", "==", inStock);
      console.log(`[ProductService] Filtering by stock: ${inStock}`);
    }

    const total = (await query.get()).size;
    console.log(`[ProductService] Total matching products: ${total}`);

    query = query.offset(offset).limit(size);
    const snapshot = await query.get();

    const products: Product[] = snapshot.docs
      .map((doc) => {
        const product = {
          ...(doc.data() as Product),
          createdAt: null,
          updatedAt: null,
        };
        const filteredVariants = (product.variants || []).filter(
          (variant: ProductVariant) =>
            variant.status === true && variant.isDeleted === false
        );
        return { ...product, variants: filteredVariants };
      })
      .filter((p) => (p.variants?.length ?? 0) > 0);

    console.log(`[ProductService] Products fetched: ${products.length}`);
    return { total, dataList: products };
  } catch (error) {
    console.error("[ProductService] getProducts error:", error);
    throw error;
  }
};

// ====================== New Arrivals ======================
export const getNewArrivals = async (
  page: number = 1,
  size: number = 20
): Promise<{ total: number; dataList: Product[] }> => {
  try {
    console.log(
      `[ProductService] getNewArrivals → Page: ${page}, Size: ${size}`
    );
    const offset = (page - 1) * size;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateThreshold = thirtyDaysAgo.toISOString();

    console.log(
      `[ProductService] Checking for products updated since: ${dateThreshold}`
    );

    let query: FirebaseFirestore.Query = adminFirestore
      .collection("products")
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true)
      .where("createdAt", ">=", dateThreshold);

    const snapshot = await query.get();
    let total = snapshot.size;

    console.log(
      `[ProductService] Found ${total} new arrivals in last 30 days.`
    );

    let products: Product[] = [];

    if (total === 0 && page === 1) {
      console.log(
        "[ProductService] No new arrivals found. Falling back to recent updated items."
      );
      query = adminFirestore
        .collection("products")
        .where("isDeleted", "==", false)
        .where("status", "==", true)
        .where("listing", "==", true)
        .orderBy("updatedAt", "desc");

      total = (await query.get()).size;
      query = query.offset(offset).limit(size);
      const fallbackSnapshot = await query.get();
      products = fallbackSnapshot.docs
        .map((doc) => {
          const product = doc.data() as Product;
          const filteredVariants = (product.variants || []).filter(
            (v) => v.status && !(v as any).isDeleted
          );
          return {
            ...product,
            variants: filteredVariants,
            createdAt: null,
            updatedAt: null,
          };
        })
        .filter((p) => (p.variants?.length ?? 0) > 0);
    } else {
      query = query.orderBy("updatedAt", "desc").offset(offset).limit(size);
      const pagedSnapshot = await query.get();

      products = pagedSnapshot.docs
        .map((doc) => {
          const product = doc.data() as Product;
          const filteredVariants = (product.variants || []).filter(
            (v) => v.status && !(v as any).isDeleted
          );
          return {
            ...product,
            variants: filteredVariants,
            createdAt: null,
            updatedAt: null,
          };
        })
        .filter((p) => (p.variants?.length ?? 0) > 0);
    }

    console.log(`[ProductService] New Arrivals fetched: ${products.length}`);
    return { total, dataList: products };
  } catch (error) {
    console.error("[ProductService] getNewArrivals error:", error);
    // If index error, might fall through here.
    // Ideally we should handle it, but throwing allows debugging.
    throw error;
  }
};

// ====================== Recent Items ======================
export const getRecentItems = async () => {
  try {
    console.log("[ProductService] getRecentItems → Fetching latest products.");
    const docs = await adminFirestore
      .collection("products")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .limit(8)
      .get();
    console.log(`[ProductService] Recent items fetched: ${docs.size}`);

    const items: Product[] = docs.docs.map((doc) => ({
      ...doc.data(),
      createdAt: null,
      updatedAt: null,
    }));
    return items;
  } catch (error) {
    console.error("[ProductService] getRecentItems error:", error);
    throw error;
  }
};

// ====================== Hot Products ======================
export const getHotProducts = async () => {
  try {
    console.log(
      "[ProductService] getHotProducts → Calculating hot products based on orders."
    );
    const ordersSnapshot = await adminFirestore
      .collection("orders")
      .limit(100)
      .get();
    const itemCount: Record<string, number> = {};

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          if (item?.itemId)
            itemCount[item.itemId] = (itemCount[item.itemId] || 0) + 1;
        });
      }
    });

    const sortedItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([itemId]) => itemId);

    const hotProducts: Product[] = [];
    for (const itemId of sortedItems) {
      const itemDoc = await adminFirestore
        .collection("products")
        .where("status", "==", true)
        .where("isDeleted", "==", false)
        .where("listing", "==", true)
        .where("id", "==", itemId)
        .get();
      if (!itemDoc.empty)
        hotProducts.push({
          ...itemDoc.docs[0].data(),
          createdAt: null,
          updatedAt: null,
        });
      if (hotProducts.length === 10) break;
    }

    console.log(`[ProductService] Hot products fetched: ${hotProducts.length}`);
    return hotProducts;
  } catch (error) {
    console.error("[ProductService] getHotProducts error:", error);
    throw error;
  }
};

// ====================== Get Product By ID ======================
export const getProductById = async (itemId: string) => {
  try {
    console.log(`[ProductService] getProductById → Item ID: ${itemId}`);
    const itemDoc = await adminFirestore
      .collection("products")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .where("id", "==", itemId)
      .get();

    if (itemDoc.empty) throw new Error(`Product not found: ${itemId}`);
    const docData = itemDoc.docs[0].data();
    const variants = docData.variants.filter(
      (v: ProductVariant) => v.status && !v.isDeleted
    );

    console.log(
      `[ProductService] Product ${itemId} fetched with ${variants.length} valid variants.`
    );
    return { ...docData, variants, createdAt: null, updatedAt: null };
  } catch (error) {
    console.error(`[ProductService] getProductById error:`, error);
    throw error;
  }
};

// ====================== Get Products By Category ======================
export const getProductsByCategory = async (
  category: string,
  page: number = 1,
  size: number = 10,
  tags?: string[],
  inStock?: boolean
) => {
  try {
    console.log(
      `[ProductService] getProductsByCategory → Category: ${category}, Page: ${page}, Size: ${size}`
    );
    const offset = (page - 1) * size;
    let query = adminFirestore
      .collection("products")
      .where("category", "==", capitalizeWords(category))
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true);

    if (tags && tags.length > 0) {
      query = query.where("tags", "array-contains-any", tags);
      console.log(`[ProductService] Filtering by tags: ${tags}`);
    }
    if (typeof inStock === "boolean") {
      query = query.where("inStock", "==", inStock);
      console.log(`[ProductService] Filtering by stock: ${inStock}`);
    }

    const total = (await query.get()).size;
    query = query.offset(offset).limit(size);

    const snapshot = await query.get();
    const products: Product[] = snapshot.docs
      .map((doc) => ({ ...doc.data(), createdAt: null, updatedAt: null }))
      .filter((p) => (p.variants?.length ?? 0) > 0);

    console.log(
      `[ProductService] Products by category fetched: ${products.length}`
    );
    return { total, dataList: products };
  } catch (error) {
    console.error("[ProductService] getProductsByCategory error:", error);
    throw error;
  }
};

// ====================== Get Products By Brand ======================
export const getProductsByBrand = async (
  brand: string,
  page: number = 1,
  size: number = 10,
  categories?: string[],
  inStock?: boolean
) => {
  try {
    console.log(
      `[ProductService] getProductsByBrand → Brand: ${brand}, Page: ${page}, Size: ${size}`
    );
    const offset = (page - 1) * size;
    let query: FirebaseFirestore.Query = adminFirestore
      .collection("products")
      .where("brand", "==", capitalizeWords(brand))
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true);

    if (categories && categories.length > 0) {
      query = query.where("tags", "array-contains-any", categories);
      console.log(`[ProductService] Filtering by categories: ${categories}`);
    }
    if (typeof inStock === "boolean") {
      query = query.where("inStock", "==", inStock);
      console.log(`[ProductService] Filtering by stock: ${inStock}`);
    }

    const total = (await query.get()).size;
    const snapshot = await query.offset(offset).limit(size).get();

    const products: Product[] = snapshot.docs
      .map((doc) => {
        const product = doc.data() as Product;
        const filteredVariants = (product.variants || []).filter(
          (v) => v.status && !v.isDeleted
        );
        return {
          ...product,
          variants: filteredVariants,
          createdAt: null,
          updatedAt: null,
        };
      })
      .filter((p) => (p.variants?.length ?? 0) > 0);

    console.log(
      `[ProductService] Products by brand fetched: ${products.length}`
    );
    return { total, dataList: products };
  } catch (error) {
    console.error("[ProductService] getProductsByBrand error:", error);
    throw error;
  }
};

// ====================== Get Deals Products ======================
// ====================== Get Deals Products ======================
import { getActivePromotions } from "./PromotionService";
import { FieldPath } from "firebase-admin/firestore";

export const getDealsProducts = async (
  page: number = 1,
  size: number = 10,
  tags?: string[],
  inStock?: boolean
) => {
  try {
    console.log(
      `[ProductService] getDealsProducts → Page: ${page}, Size: ${size}`
    );

    // 1. Get Promoted Product IDs (Unified Promotion Model)
    const activePromotions = await getActivePromotions();
    const promoProductIds = new Set<string>();

    activePromotions.forEach((promo: any) => {
      // Product Level
      if (promo.applicableProducts) {
        promo.applicableProducts.forEach((id: string) =>
          promoProductIds.add(id)
        );
      }
      // Variant Level
      if (promo.applicableProductVariants) {
        promo.applicableProductVariants.forEach((v: any) =>
          promoProductIds.add(v.productId)
        );
      }
    });

    const allPromoIds = Array.from(promoProductIds);
    const promoCount = allPromoIds.length;
    console.log(
      `[ProductService] Found ${promoCount} products in active promotions.`
    );

    // 2. Base Query for Standard Discounts
    let discountQuery = adminFirestore
      .collection("products")
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true)
      .where("discount", ">", 0);

    if (tags && tags.length > 0)
      discountQuery = discountQuery.where("tags", "array-contains-any", tags);
    if (typeof inStock === "boolean")
      discountQuery = discountQuery.where("inStock", "==", inStock);

    // Get total count of discounted products
    // Note: This adds latency. Ideally cache or estimate.
    const discountSnapshotCount = await discountQuery.count().get();
    const discountTotal = discountSnapshotCount.data().count;

    const total = promoCount + discountTotal;

    // 3. Calculate Ranges
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    let dataList: Product[] = [];

    // --- Fetch Promos if in range ---
    if (startIndex < promoCount) {
      const promoIdsToFetch = allPromoIds.slice(
        startIndex,
        Math.min(endIndex, promoCount)
      );

      if (promoIdsToFetch.length > 0) {
        // Firestore 'in' limit is 30. Chunk if needed (though page size is usually small)
        const validPromoIds = promoIdsToFetch.slice(0, 30);

        const promoDocs = await adminFirestore
          .collection("products")
          .where(FieldPath.documentId(), "in", validPromoIds)
          .get();

        const fetchedPromos = promoDocs.docs
          .map(
            (doc) =>
              ({
                ...doc.data(),
                createdAt: null,
                updatedAt: null,
              } as Product)
          )
          .filter((p) => p.status && !p.isDeleted); // Re-check status just in case

        dataList = [...dataList, ...fetchedPromos];
      }
    }

    // --- Fetch Discounts if in range ---
    // If we haven't filled 'size' yet, fetch from discounts
    if (dataList.length < size) {
      const remainingSlots = size - dataList.length;
      // Calculate offset in the discount list
      // If we are past all promos, offset is (startIndex - promoCount)
      // If we are bridging, offset is 0 (start fetching from top of discounts)
      const discountOffset = Math.max(0, startIndex - promoCount);

      const discountDocs = await discountQuery
        .offset(discountOffset)
        .limit(remainingSlots)
        .get();

      const fetchedDiscounts = discountDocs.docs
        .map(
          (doc) =>
            ({
              ...doc.data(),
              createdAt: null,
              updatedAt: null,
            } as Product)
        )
        .filter((p) => !promoProductIds.has(p.id)); // Client-side Dedupe (simple)

      dataList = [...dataList, ...fetchedDiscounts];
    }

    // Filter variants for all fetched products
    dataList = dataList
      .map((p) => ({
        ...p,
        variants: (p.variants || []).filter(
          (v: ProductVariant) => v.status && !v.isDeleted
        ),
      }))
      .filter((p) => (p.variants?.length ?? 0) > 0);

    console.log(
      `[ProductService] Deals products fetched (Mixed): ${dataList.length}`
    );
    return { total, dataList };
  } catch (error) {
    console.error("[ProductService] getDealsProducts error:", error);
    throw error;
  }
};

// ====================== Get Product Stock ======================
export const getProductStock = async (
  productId: string,
  variantId: string,
  size: string
) => {
  try {
    console.log(
      `[ProductService] getProductStock → Product: ${productId}, Variant: ${variantId}, Size: ${size}`
    );
    const settingsSnap = await adminFirestore
      .collection("app_settings")
      .doc("erp_settings")
      .get();
    const stockId = settingsSnap.data()?.onlineStockId;
    if (!stockId) throw new Error("onlineStockId not found in ERP settings");

    const stockSnap = await adminFirestore
      .collection("stock_inventory")
      .where("productId", "==", productId)
      .where("variantId", "==", variantId)
      .where("stockId", "==", stockId)
      .where("size", "==", size)
      .limit(1)
      .get();

    if (stockSnap.empty) {
      console.log("[ProductService] Stock not found, returning 0");
      return 0;
    }

    const quantity = stockSnap.docs[0].data().quantity;
    console.log(`[ProductService] Stock quantity: ${quantity}`);
    return quantity;
  } catch (error) {
    console.error("[ProductService] getProductStock error:", error);
    throw error;
  }
};

// ====================== Get Similar Items ======================
export const getSimilarItems = async (itemId: string) => {
  try {
    console.log(`[ProductService] getSimilarItems → Item ID: ${itemId}`);
    const itemDoc = await adminFirestore
      .collection("products")
      .doc(itemId)
      .get();
    if (!itemDoc.exists) throw new Error(`Item with ID ${itemId} not found`);
    const item = itemDoc.data() as Product;

    const similarItemsQuery = await adminFirestore
      .collection("products")
      .where("tags", "array-contains-any", [item.category.toLowerCase()])
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true)
      .limit(8)
      .get();

    const similarItems: Product[] = similarItemsQuery.docs
      .filter((doc) => doc.id !== itemId)
      .map((doc) => ({
        ...doc.data(),
        itemId: doc.id,
        createdAt: null,
        updatedAt: null,
      }));

    console.log(
      `[ProductService] Similar items fetched: ${similarItems.length}`
    );
    return similarItems;
  } catch (error) {
    console.error("[ProductService] getSimilarItems error:", error);
    throw error;
  }
};

// ====================== Sitemap ======================
export const getProductsForSitemap = async () => {
  try {
    console.log(
      "[ProductService] getProductsForSitemap → Fetching all products"
    );
    const snapshot = await adminFirestore
      .collection("products")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .get();

    const products = snapshot.docs.map((doc) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/products/${
        doc.data().id
      }`,
      lastModified: new Date(),
      priority: 0.7,
    }));

    console.log(`[ProductService] Products for sitemap: ${products.length}`);
    return products;
  } catch (error) {
    console.error("[ProductService] getProductsForSitemap error:", error);
    throw error;
  }
};

export const getBrandForSitemap = async () => {
  try {
    console.log("[ProductService] getBrandForSitemap → Fetching brands");
    const snapshot = await adminFirestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .get();

    const brands = snapshot.docs.map((doc) => ({
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/collections/brands/${encodeURIComponent(doc.data().name)}`,
      lastModified: new Date(),
      priority: 0.8,
    }));

    console.log(`[ProductService] Brands for sitemap: ${brands.length}`);
    return brands;
  } catch (error) {
    console.error("[ProductService] getBrandForSitemap error:", error);
    throw error;
  }
};

export const getCategoriesForSitemap = async () => {
  try {
    console.log(
      "[ProductService] getCategoriesForSitemap → Fetching categories"
    );
    const snapshot = await adminFirestore
      .collection("categories")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .get();

    const categories = snapshot.docs.map((doc) => ({
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/collections/categories/${encodeURIComponent(doc.data().name)}`,
      lastModified: new Date(),
      priority: 0.8,
    }));

    console.log(
      `[ProductService] Categories for sitemap: ${categories.length}`
    );
    return categories;
  } catch (error) {
    console.error("[ProductService] getCategoriesForSitemap error:", error);
    throw error;
  }
};

// ====================== Payment Methods ======================
export const getPaymentMethods = async () => {
  try {
    console.log(
      "[ProductService] getPaymentMethods → Fetching active payment methods"
    );
    const snapshot = await adminFirestore
      .collection("paymentMethods")
      .where("status", "==", "Active")
      .where("available", "array-contains", "Website")
      .get();

    const methods: PaymentMethod[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
      createdAt: null,
      updatedAt: null,
    }));

    console.log(`[ProductService] Payment methods fetched: ${methods.length}`);
    return methods;
  } catch (error) {
    console.error("[ProductService] getPaymentMethods error:", error);
    throw error;
  }
};
