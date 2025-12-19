/**
 * Promotion Utilities
 * Shared logic for promotion eligibility checking
 */

import {
  ProductVariantTarget,
  PromotionCondition,
} from "@/interfaces/Promotion";

// ============ CART ITEM INTERFACE ============

export interface CartItem {
  itemId: string;
  variantId?: string;
  quantity: number;
  price: number;
  category?: string;
  brand?: string;
}

// ============ ELIGIBILITY RESULT ============

export interface EligibilityResult {
  eligible: boolean;
  restricted: boolean;
  reason?: string;
}

// ============ DATE VALIDATION ============

export const isPromotionDateValid = (
  startDate?: string | Date | any,
  endDate?: string | Date | any
): { valid: boolean; reason?: string } => {
  const now = new Date();

  if (startDate) {
    const start = new Date(startDate);
    if (now < start) return { valid: false, reason: "Not yet active" };
  }

  if (endDate) {
    const end = new Date(endDate);
    if (now > end) return { valid: false, reason: "Expired" };
  }

  return { valid: true };
};

// ============ VARIANT ELIGIBILITY ============

export const checkVariantEligibility = (
  items: CartItem[],
  targets: ProductVariantTarget[]
): boolean => {
  if (!targets || targets.length === 0) return true;

  for (const target of targets) {
    const matchingItems = items.filter(
      (item) => item.itemId === target.productId
    );
    if (matchingItems.length === 0) continue;

    if (target.variantMode === "ALL_VARIANTS") return true;

    if (target.variantMode === "SPECIFIC_VARIANTS" && target.variantIds) {
      const hasMatch = matchingItems.some(
        (item) => item.variantId && target.variantIds!.includes(item.variantId)
      );
      if (hasMatch) return true;
    }
  }
  return false;
};

// ============ GET ELIGIBLE CART ITEMS ============

export const getEligibleCartItems = (
  items: CartItem[],
  targets: ProductVariantTarget[]
): CartItem[] => {
  if (!targets || targets.length === 0) return items;

  return items.filter((item) => {
    for (const target of targets) {
      if (item.itemId !== target.productId) continue;
      if (target.variantMode === "ALL_VARIANTS") return true;
      if (target.variantMode === "SPECIFIC_VARIANTS" && target.variantIds) {
        return item.variantId && target.variantIds.includes(item.variantId);
      }
    }
    return false;
  });
};

// ============ PRODUCT TARGETING ============

export const checkProductTargeting = (
  items: CartItem[],
  applicableProducts?: string[],
  excludedProducts?: string[]
): { pass: boolean; restricted: boolean; reason?: string } => {
  // Check applicable products
  if (applicableProducts && applicableProducts.length > 0) {
    const hasApplicable = items.some((item) =>
      applicableProducts.includes(item.itemId)
    );
    if (!hasApplicable) {
      return {
        pass: false,
        restricted: true,
        reason: "Requires specific products not in your cart",
      };
    }
  }

  // Check excluded products
  if (excludedProducts && excludedProducts.length > 0) {
    const allExcluded = items.every((item) =>
      excludedProducts.includes(item.itemId)
    );
    if (allExcluded) {
      return {
        pass: false,
        restricted: true,
        reason: "All cart items are excluded from this promotion",
      };
    }
  }

  return { pass: true, restricted: false };
};

// ============ CATEGORY/BRAND TARGETING ============

export const checkCategoryBrandTargeting = (
  items: CartItem[],
  applicableCategories?: string[],
  applicableBrands?: string[]
): { pass: boolean; restricted: boolean; reason?: string } => {
  // Check categories
  if (applicableCategories && applicableCategories.length > 0) {
    const hasCategory = items.some(
      (item) => item.category && applicableCategories.includes(item.category)
    );
    if (!hasCategory) {
      return {
        pass: false,
        restricted: true,
        reason: "Requires products from specific categories",
      };
    }
  }

  // Check brands
  if (applicableBrands && applicableBrands.length > 0) {
    const hasBrand = items.some(
      (item) => item.brand && applicableBrands.includes(item.brand)
    );
    if (!hasBrand) {
      return {
        pass: false,
        restricted: true,
        reason: "Requires products from specific brands",
      };
    }
  }

  return { pass: true, restricted: false };
};

// ============ CONDITION CHECKING ============

export const checkConditions = (
  conditions: PromotionCondition[] | undefined,
  items: CartItem[],
  cartTotal: number
): boolean => {
  if (!conditions || conditions.length === 0) return true;

  // Collect specific product IDs from conditions
  const specificProductIds: string[] = [];
  conditions.forEach((condition) => {
    if (condition.type === "SPECIFIC_PRODUCT") {
      if (condition.value && typeof condition.value === "string") {
        specificProductIds.push(condition.value);
      }
      if (condition.productIds) {
        specificProductIds.push(...condition.productIds);
      }
    }
  });

  return conditions.every((condition) => {
    switch (condition.type) {
      case "MIN_AMOUNT":
        return cartTotal >= Number(condition.value);

      case "MIN_QUANTITY":
        const applicableItems =
          specificProductIds.length > 0
            ? items.filter((item) => specificProductIds.includes(item.itemId))
            : items;
        const totalQty = applicableItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return totalQty >= Number(condition.value);

      case "SPECIFIC_PRODUCT":
        if (
          condition.variantMode === "SPECIFIC_VARIANTS" &&
          condition.variantIds
        ) {
          return items.some(
            (item) =>
              specificProductIds.includes(item.itemId) &&
              item.variantId &&
              condition.variantIds!.includes(item.variantId)
          );
        }
        if (specificProductIds.length > 0) {
          return items.some((item) => specificProductIds.includes(item.itemId));
        }
        return true;

      case "CATEGORY":
        return items.some((item) => item.category === condition.value);

      case "CUSTOMER_TAG":
        // Customer tag validation should be done server-side
        return true;

      default:
        return true;
    }
  });
};

// ============ FULL ELIGIBILITY CHECK ============

export const checkPromotionEligibility = (
  promo: {
    startDate?: any;
    endDate?: any;
    applicableProductVariants?: ProductVariantTarget[];
    applicableProducts?: string[];
    excludedProducts?: string[];
    applicableCategories?: string[];
    applicableBrands?: string[];
    conditions?: PromotionCondition[];
  },
  items: CartItem[],
  cartTotal: number
): EligibilityResult => {
  // 1. Check date validity
  const dateCheck = isPromotionDateValid(promo.startDate, promo.endDate);
  if (!dateCheck.valid) {
    return { eligible: false, restricted: false, reason: dateCheck.reason };
  }

  // 2. Check variant-level targeting
  if (
    promo.applicableProductVariants &&
    promo.applicableProductVariants.length > 0
  ) {
    const variantEligible = checkVariantEligibility(
      items,
      promo.applicableProductVariants
    );
    if (!variantEligible) {
      return {
        eligible: false,
        restricted: true,
        reason: "Requires specific product variants not in your cart",
      };
    }
  }

  // 3. Check product targeting
  const productCheck = checkProductTargeting(
    items,
    promo.applicableProducts,
    promo.excludedProducts
  );
  if (!productCheck.pass) {
    return {
      eligible: false,
      restricted: productCheck.restricted,
      reason: productCheck.reason,
    };
  }

  // 4. Check category/brand targeting
  const catBrandCheck = checkCategoryBrandTargeting(
    items,
    promo.applicableCategories,
    promo.applicableBrands
  );
  if (!catBrandCheck.pass) {
    return {
      eligible: false,
      restricted: catBrandCheck.restricted,
      reason: catBrandCheck.reason,
    };
  }

  // 5. Check conditions
  const conditionsMet = checkConditions(promo.conditions, items, cartTotal);

  return { eligible: conditionsMet, restricted: false };
};

// ============ PROGRESS CALCULATION ============

export const calculatePromotionProgress = (
  conditions: PromotionCondition[] | undefined,
  items: CartItem[],
  cartTotal: number
): { progress: number; remaining: number } => {
  if (!conditions || conditions.length === 0) {
    return { progress: 100, remaining: 0 };
  }

  // Collect specific product IDs
  const specificProductIds: string[] = [];
  conditions.forEach((condition) => {
    if (condition.type === "SPECIFIC_PRODUCT") {
      if (condition.value && typeof condition.value === "string") {
        specificProductIds.push(condition.value);
      }
      if (condition.productIds) {
        specificProductIds.push(...condition.productIds);
      }
    }
  });

  // Check MIN_QUANTITY for applicable items
  if (specificProductIds.length > 0) {
    const applicableItems = items.filter((item) =>
      specificProductIds.includes(item.itemId)
    );
    if (applicableItems.length === 0) {
      return { progress: 0, remaining: 0 };
    }

    const minQtyCondition = conditions.find((c) => c.type === "MIN_QUANTITY");
    if (minQtyCondition) {
      const requiredQty = Number(minQtyCondition.value);
      const applicableQty = applicableItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const progress = Math.min(
        Math.round((applicableQty / requiredQty) * 100),
        100
      );
      const remaining = Math.max(requiredQty - applicableQty, 0);
      return { progress, remaining };
    }
  }

  // Fallback to MIN_AMOUNT
  const minAmountCondition = conditions.find((c) => c.type === "MIN_AMOUNT");
  if (!minAmountCondition) {
    return { progress: 100, remaining: 0 };
  }

  const minAmount = Number(minAmountCondition.value);
  const progress = Math.min(Math.round((cartTotal / minAmount) * 100), 100);
  const remaining = Math.max(minAmount - cartTotal, 0);

  return { progress, remaining };
};
