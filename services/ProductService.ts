import { productRepository } from "@/repositories/ProductRepository";
import { otherRepository } from "@/repositories/OtherRepository";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { adminFirestore } from "@/firebase/firebaseAdmin";
import { getActivePromotions } from "./PromotionService";

/**
 * ProductService - Thin wrapper over ProductRepository
 * Delegates data access to repository layer, keeps business logic here
 */

// ====================== Products ======================
export const getProducts = async (
  tags?: string[],
  inStock?: boolean,
  page: number = 1,
  size: number = 20
): Promise<{ total: number; dataList: Product[] }> =>
  productRepository.findAll({ tags, inStock, page, size });

// ====================== New Arrivals ======================
export const getNewArrivals = async (
  page: number = 1,
  size: number = 20
): Promise<{ total: number; dataList: Product[] }> =>
  productRepository.findNewArrivals({ page, size });

// ====================== Recent Items ======================
export const getRecentItems = async () => productRepository.findRecent(8);

// ====================== Get Product By ID ======================
export const getProductById = async (itemId: string) => {
  const product = await productRepository.findById(itemId);
  if (!product) throw new Error(`Product not found: ${itemId}`);
  return product;
};

// ====================== Get Similar Items ======================
export const getSimilarItems = async (itemId: string) =>
  productRepository.findSimilar(itemId, 8);

// ====================== Get Product Stock ======================
export const getProductStock = async (
  productId: string,
  variantId: string,
  size: string
) => {
  const settings = await otherRepository.getSettings();
  if (!settings?.stockId)
    throw new Error("onlineStockId not found in ERP settings");
  return productRepository.getStock(
    productId,
    variantId,
    size,
    settings.stockId
  );
};

// ====================== Batch Stock (Single Call for All Sizes) ======================
export const getBatchProductStock = async (
  productId: string,
  variantId: string,
  sizes: string[]
): Promise<Record<string, number>> => {
  const settings = await otherRepository.getSettings();
  if (!settings?.stockId)
    throw new Error("onlineStockId not found in ERP settings");

  // Fetch all sizes in parallel at repository level
  const results = await Promise.all(
    sizes.map(async (size) => ({
      size,
      quantity: await productRepository.getStock(
        productId,
        variantId,
        size,
        settings.stockId
      ),
    }))
  );

  const stockMap: Record<string, number> = {};
  results.forEach(({ size, quantity }) => {
    stockMap[size] = quantity;
  });
  return stockMap;
};

// ====================== Sitemap ======================
export const getProductsForSitemap = async () => {
  const products = await productRepository.findAllForSitemap();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return products.map((p) => ({
    url: `${baseUrl}/collections/products/${p.id}`,
    lastModified: new Date(),
    priority: 0.7,
  }));
};

export const getBrandForSitemap = async () =>
  otherRepository.getBrandsForSitemap(process.env.NEXT_PUBLIC_BASE_URL || "");

export const getCategoriesForSitemap = async () =>
  otherRepository.getCategoriesForSitemap(
    process.env.NEXT_PUBLIC_BASE_URL || ""
  );

// ====================== Payment Methods ======================
export const getPaymentMethods = async () =>
  otherRepository.getPaymentMethods();

// ====================== Hot Products (Complex Business Logic) ======================
// Kept in service layer - aggregates across orders collection
export const getHotProducts = async () => {
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

  const sortedItemIds = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([itemId]) => itemId);

  if (sortedItemIds.length === 0) return [];

  const products = await productRepository.findByIds(sortedItemIds);

  // Filter out unlisted, inactive, or deleted products to prevent "leaking"
  return products.filter(
    (p) => p.listing === true && p.status === true && !p.isDeleted
  );
};

// ====================== Deals Products (Complex Business Logic) ======================
// Kept in service layer - requires promotion aggregation and complex filtering
const sanitizeProduct = <T extends { buyingPrice?: number }>(
  product: T
): Omit<T, "buyingPrice"> => {
  const { buyingPrice, ...rest } = product;
  return rest;
};

const filterActiveVariants = (variants: ProductVariant[] = []) =>
  variants.filter((v) => v.status && !v.isDeleted);

export const getDealsProducts = async (
  page: number = 1,
  size: number = 10,
  tags?: string[],
  inStock?: boolean
) => {
  // 1. Get Promoted Product IDs (Unified Promotion Model)
  const activePromotions = await getActivePromotions();
  const promoProductIds = new Set<string>();
  let hasGlobalPromotion = false;

  activePromotions.forEach((promo: any) => {
    const hasProductTargeting =
      (promo.applicableProducts && promo.applicableProducts.length > 0) ||
      (promo.applicableProductVariants &&
        promo.applicableProductVariants.length > 0) ||
      (promo.conditions &&
        promo.conditions.some((c: any) => c.type === "SPECIFIC_PRODUCT"));

    if (!hasProductTargeting) hasGlobalPromotion = true;

    if (promo.applicableProducts) {
      promo.applicableProducts.forEach((id: string) => promoProductIds.add(id));
    }
    if (promo.applicableProductVariants) {
      promo.applicableProductVariants.forEach((v: any) =>
        promoProductIds.add(v.productId)
      );
    }
    if (promo.conditions && Array.isArray(promo.conditions)) {
      promo.conditions.forEach((cond: any) => {
        if (cond.type === "SPECIFIC_PRODUCT") {
          if (cond.value && typeof cond.value === "string")
            promoProductIds.add(cond.value);
          if (cond.productIds && Array.isArray(cond.productIds)) {
            cond.productIds.forEach((id: string) => promoProductIds.add(id));
          }
        }
      });
    }
  });

  // If global promotion, delegate to repository
  if (hasGlobalPromotion) {
    return productRepository.findAll({ tags, inStock, page, size });
  }

  const allPromoIds = Array.from(promoProductIds);
  const promoCount = allPromoIds.length;

  // 2. Get discounted products count and fetch
  const discountResult = await productRepository.findDiscounted({
    tags,
    inStock,
    page: 1,
    size: 1000,
  });
  const discountTotal = discountResult.total;
  const total = promoCount + discountTotal;

  // 3. Calculate ranges
  const startIndex = (page - 1) * size;
  let dataList: Product[] = [];

  // Fetch promo products if in range
  if (startIndex < promoCount) {
    const promoIdsToFetch = allPromoIds.slice(
      startIndex,
      Math.min(startIndex + size, promoCount)
    );
    if (promoIdsToFetch.length > 0) {
      const promoProducts = await productRepository.findByIds(
        promoIdsToFetch.slice(0, 30)
      );
      dataList = [...dataList, ...promoProducts];
    }
  }

  // Fetch discounts if needed
  if (dataList.length < size) {
    const remainingSlots = size - dataList.length;
    const discountOffset = Math.max(0, startIndex - promoCount);
    const discountPage = Math.floor(discountOffset / remainingSlots) + 1;

    const discounted = await productRepository.findDiscounted({
      tags,
      inStock,
      page: discountPage,
      size: remainingSlots,
    });

    const deduped = discounted.dataList.filter(
      (p) => !promoProductIds.has(p.id)
    );
    dataList = [...dataList, ...deduped];
  }

  return { total, dataList };
};
