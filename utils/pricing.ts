import { Product } from "@/interfaces/Product";

interface Promotion {
  type: "COMBO" | "BOGO" | "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  actions?: Array<{ value?: number }>;
}

/**
 * Calculate the final price of a product after applying discounts and promotions
 * Consolidates duplicate price calculation logic from ItemCard, SearchResultCard, BagItemCard
 */
export function calculateFinalPrice(
  product: Product,
  promotion?: Promotion | null
): number {
  let finalPrice = product.sellingPrice;

  // Apply product-level discount first
  if (product.discount > 0) {
    finalPrice =
      Math.round(
        (product.sellingPrice -
          (product.sellingPrice * product.discount) / 100) /
          10
      ) * 10;
  }

  // Apply promotion discount on top
  if (promotion?.actions?.[0]?.value) {
    const discountValue = promotion.actions[0].value;

    if (promotion.type === "PERCENTAGE") {
      finalPrice =
        Math.round((finalPrice * (100 - discountValue)) / 100 / 10) * 10;
    } else if (promotion.type === "FIXED") {
      finalPrice = Math.max(0, finalPrice - discountValue);
    }
  }

  return finalPrice;
}

/**
 * Check if a product has any discount (product-level or promotion)
 */
export function hasDiscount(
  product: Product,
  promotion?: Promotion | null
): boolean {
  return product.discount > 0 || !!promotion;
}

/**
 * Get the original price to show with strikethrough
 */
export function getOriginalPrice(product: Product): number {
  return product.marketPrice > product.sellingPrice
    ? product.marketPrice
    : product.sellingPrice;
}

/**
 * Calculate savings amount
 */
export function calculateSavings(
  product: Product,
  promotion?: Promotion | null
): number {
  const originalPrice = getOriginalPrice(product);
  const finalPrice = calculateFinalPrice(product, promotion);
  return Math.max(0, originalPrice - finalPrice);
}

/**
 * Calculate savings percentage
 */
export function calculateSavingsPercent(
  product: Product,
  promotion?: Promotion | null
): number {
  const originalPrice = getOriginalPrice(product);
  const savings = calculateSavings(product, promotion);
  return Math.round((savings / originalPrice) * 100);
}
