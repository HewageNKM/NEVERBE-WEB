"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { applyPromotions, removePromotion } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces/BagItem";
import { calculateTotal, calculateTotalDiscount } from "@/util";
import { ProductVariantTarget } from "@/interfaces/Promotion";
import {
  checkPromotionEligibility,
  calculatePromotionProgress,
  getEligibleCartItems,
  CartItem,
} from "@/utils/promotionUtils";

export interface ActivePromotion {
  id: string;
  name: string;
  description: string;
  type: "COMBO" | "BOGO" | "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  priority?: number; // For priority-based selection (matches backend)
  stackable?: boolean; // Whether this promotion can stack with others
  discountValue?: number;
  minOrderAmount?: number;
  applicableProducts?: string[];
  applicableProductVariants?: ProductVariantTarget[]; // Variant-level targeting
  applicableCategories?: string[];
  applicableBrands?: string[];
  excludedProducts?: string[];
  message: string;
  savings?: number;
  isEligible: boolean;
  isRestricted?: boolean; // Eligible by conditions but restricted by targeting
  restrictionReason?: string; // Why it's restricted
  progress?: number; // 0-100 for min amount progress
  remaining?: number; // Amount remaining to qualify
  isFreeShipping?: boolean; // Flag for free shipping promotions
}

interface UsePromotionsReturn {
  activePromotions: ActivePromotion[];
  eligiblePromotions: ActivePromotion[];
  nearbyPromotions: ActivePromotion[];
  restrictedPromotions: ActivePromotion[]; // Promotions restricted by targeting
  isLoading: boolean;
  hasComboItems: boolean;
  isBlocked: boolean;
  appliedPromotion: ActivePromotion | null; // Primary (backward compat)
  appliedPromotions: ActivePromotion[]; // All stacked promotions
  totalPromotionDiscount: number; // Combined discount
  refreshPromotions: () => Promise<void>;
}

/**
 * usePromotions - Hook to fetch and check active promotions
 */
export const usePromotions = (): UsePromotionsReturn => {
  const dispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const appliedPromotionId = useSelector(
    (state: RootState) => state.bag.promotionId
  );
  const [promotions, setPromotions] = useState<ActivePromotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastBagHash = useRef<string>("");

  // Check if bag contains combo items
  const hasComboItems = bagItems.some((item) => item.isComboItem === true);
  const isBlocked = hasComboItems;

  const cartTotal = calculateTotal(bagItems) - calculateTotalDiscount(bagItems);

  // Generate hash of bag for change detection
  const getBagHash = useCallback(() => {
    return bagItems
      .map(
        (item) =>
          `${item.itemId}-${item.variantId}-${item.size}-${item.quantity}`
      )
      .sort()
      .join("|");
  }, [bagItems]);

  // Fetch active promotions
  const fetchPromotions = useCallback(async () => {
    // Don't fetch if combo items block promotions
    if (hasComboItems) {
      setPromotions([]);
      dispatch(removePromotion());
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/promotions");
      if (res.ok) {
        const data = await res.json();

        // Process promotions to check eligibility
        const processedPromotions: ActivePromotion[] = (data || [])
          .map((promo: any) => {
            const eligibilityResult = checkEligibility(
              promo,
              bagItems,
              cartTotal
            );
            const { progress, remaining } = calculateProgress(
              promo,
              cartTotal,
              bagItems
            );

            return {
              id: promo.id,
              name: promo.name,
              description: promo.description,
              type: promo.type,
              priority: promo.priority || 0, // Include priority for sorting
              stackable: promo.stackable || false, // Include stackable flag
              discountValue: promo.actions?.[0]?.value,
              minOrderAmount: promo.conditions?.find(
                (c: any) => c.type === "MIN_AMOUNT"
              )?.value,
              applicableProducts: promo.applicableProducts,
              applicableProductVariants: promo.applicableProductVariants, // Include variant targeting
              applicableCategories: promo.applicableCategories,
              applicableBrands: promo.applicableBrands,
              excludedProducts: promo.excludedProducts,
              message: getPromoMessage(promo, eligibilityResult.eligible),
              savings: eligibilityResult.eligible
                ? calculateSavings(promo, cartTotal, bagItems)
                : undefined,
              isEligible: eligibilityResult.eligible,
              isRestricted: eligibilityResult.restricted,
              restrictionReason: eligibilityResult.reason,
              progress,
              remaining,
              isFreeShipping:
                promo.type === "FREE_SHIPPING" ||
                promo.actions?.[0]?.type === "FREE_SHIPPING",
            };
          })
          // Sort by priority (high to low) to match backend behavior
          .sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0));

        setPromotions(processedPromotions);

        // --- STACKING LOGIC ---
        // Filter eligible promotions with savings
        const eligible = processedPromotions.filter(
          (p) => p.isEligible && p.savings && p.savings > 0
        );

        if (eligible.length > 0) {
          const firstEligible = eligible[0];

          // If highest-priority promotion is NOT stackable, apply only that one
          if (!firstEligible.stackable) {
            dispatch(
              applyPromotions([
                {
                  id: firstEligible.id,
                  name: firstEligible.name,
                  discount: firstEligible.savings || 0,
                },
              ])
            );
          } else {
            // First promotion IS stackable - collect all stackable promotions
            const stackedPromos = eligible
              .filter((p) => p.stackable)
              .map((p) => ({
                id: p.id,
                name: p.name,
                discount: p.savings || 0,
              }));

            dispatch(applyPromotions(stackedPromos));
          }
        } else {
          // No eligible promotions, clear any applied
          dispatch(removePromotion());
        }
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bagItems, cartTotal, hasComboItems, dispatch]);

  // Helper: Check if cart items are eligible based on variant-level targeting
  const checkVariantEligibility = (
    items: BagItem[],
    targets: ProductVariantTarget[]
  ): boolean => {
    if (!targets || targets.length === 0) return true;

    for (const target of targets) {
      const matchingCartItems = items.filter(
        (item) => item.itemId === target.productId
      );

      if (matchingCartItems.length === 0) continue;

      if (target.variantMode === "ALL_VARIANTS") return true;

      if (target.variantMode === "SPECIFIC_VARIANTS" && target.variantIds) {
        const hasMatchingVariant = matchingCartItems.some(
          (item) =>
            item.variantId && target.variantIds!.includes(item.variantId)
        );
        if (hasMatchingVariant) return true;
      }
    }
    return false;
  };

  // Helper: Get cart items that match variant-level targeting (for discount calculation)
  const getEligibleCartItems = (
    items: BagItem[],
    targets: ProductVariantTarget[]
  ): BagItem[] => {
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

  // Check if cart meets promotion conditions
  // Returns: { eligible: boolean, restricted: boolean, reason?: string }
  const checkEligibility = (
    promo: any,
    items: BagItem[],
    total: number
  ): { eligible: boolean; restricted: boolean; reason?: string } => {
    // First check date validity
    const now = new Date();
    if (promo.startDate) {
      const startDate = new Date(promo.startDate);
      if (now < startDate)
        return { eligible: false, restricted: false, reason: "Not yet active" };
    }
    if (promo.endDate) {
      const endDate = new Date(promo.endDate);
      if (now > endDate)
        return { eligible: false, restricted: false, reason: "Expired" };
    }

    // Check variant-level targeting FIRST (this is the fix)
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

    // Check applicable products targeting (if any cart item matches)
    if (promo.applicableProducts && promo.applicableProducts.length > 0) {
      const hasApplicableProduct = items.some((item) =>
        promo.applicableProducts.includes(item.itemId)
      );
      if (!hasApplicableProduct) {
        return {
          eligible: false,
          restricted: true,
          reason: "Requires specific products not in your cart",
        };
      }
    }

    // Check applicable categories targeting
    if (promo.applicableCategories && promo.applicableCategories.length > 0) {
      const hasApplicableCategory = items.some(
        (item) =>
          (item as any).category &&
          promo.applicableCategories.includes((item as any).category)
      );
      if (!hasApplicableCategory) {
        return {
          eligible: false,
          restricted: true,
          reason: "Requires products from specific categories",
        };
      }
    }

    // Check applicable brands targeting
    if (promo.applicableBrands && promo.applicableBrands.length > 0) {
      const hasApplicableBrand = items.some(
        (item) =>
          (item as any).brand &&
          promo.applicableBrands.includes((item as any).brand)
      );
      if (!hasApplicableBrand) {
        return {
          eligible: false,
          restricted: true,
          reason: "Requires products from specific brands",
        };
      }
    }

    // Check excluded products (if ALL items are excluded, promo doesn't apply)
    if (promo.excludedProducts && promo.excludedProducts.length > 0) {
      const allExcluded = items.every((item) =>
        promo.excludedProducts.includes(item.itemId)
      );
      if (allExcluded) {
        return {
          eligible: false,
          restricted: true,
          reason: "All cart items are excluded from this promotion",
        };
      }
    }

    // Check conditions
    if (!promo.conditions || promo.conditions.length === 0) {
      return { eligible: true, restricted: false };
    }

    // Collect all SPECIFIC_PRODUCT values into one array for easier checking
    const specificProductIds: string[] = [];
    promo.conditions.forEach((condition: any) => {
      if (condition.type === "SPECIFIC_PRODUCT") {
        if (condition.value) specificProductIds.push(condition.value);
        if (condition.productIds)
          specificProductIds.push(...condition.productIds);
      }
    });

    const conditionsMet = promo.conditions.every((condition: any) => {
      switch (condition.type) {
        case "MIN_AMOUNT":
          return total >= Number(condition.value);
        case "MIN_QUANTITY":
          // If there are specific products, count only those
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
          // Check variant restrictions within the condition
          if (
            condition.variantMode === "SPECIFIC_VARIANTS" &&
            condition.variantIds
          ) {
            return items.some(
              (item) =>
                specificProductIds.includes(item.itemId) &&
                item.variantId &&
                condition.variantIds.includes(item.variantId)
            );
          }
          // Check if any cart item matches any of the collected specific product IDs
          if (specificProductIds.length > 0) {
            return items.some((item) =>
              specificProductIds.includes(item.itemId)
            );
          }
          return true;
        case "CATEGORY":
          return items.some(
            (item) =>
              (item as any).category === condition.value ||
              promo.applicableCategories?.includes((item as any).category)
          );
        case "CUSTOMER_TAG":
          // Customer tag validation would require user data - skip for now
          // This should be validated server-side when processing order
          console.log(
            "CUSTOMER_TAG condition present - will be validated server-side"
          );
          return true; // Allow eligibility, final check done server-side
        default:
          return true;
      }
    });

    return { eligible: conditionsMet, restricted: false };
  };

  // Calculate progress towards promotion conditions
  const calculateProgress = (
    promo: any,
    total: number,
    items: BagItem[]
  ): { progress: number; remaining: number } => {
    // Build list of applicable product IDs from SPECIFIC_PRODUCT conditions
    const applicableProductIds: string[] = [];
    if (promo.conditions && promo.conditions.length > 0) {
      promo.conditions.forEach((condition: any) => {
        if (condition.type === "SPECIFIC_PRODUCT") {
          if (condition.value) applicableProductIds.push(condition.value);
          if (condition.productIds)
            applicableProductIds.push(...condition.productIds);
        }
      });
    }

    // If promotion has specific products, check if cart has any
    if (applicableProductIds.length > 0) {
      const applicableItems = items.filter((item) =>
        applicableProductIds.includes(item.itemId)
      );

      // No applicable products in cart - no progress
      if (applicableItems.length === 0) {
        return { progress: 0, remaining: 0 };
      }

      // Check MIN_QUANTITY for applicable items
      const minQtyCondition = promo.conditions?.find(
        (c: any) => c.type === "MIN_QUANTITY"
      );
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

    // Fallback to MIN_AMOUNT check
    const minAmount = promo.conditions?.find(
      (c: any) => c.type === "MIN_AMOUNT"
    )?.value;

    if (!minAmount) return { progress: 100, remaining: 0 };

    const progress = Math.min(Math.round((total / minAmount) * 100), 100);
    const remaining = Math.max(minAmount - total, 0);

    return { progress, remaining };
  };

  // Calculate potential savings
  const calculateSavings = (
    promo: any,
    total: number,
    items: BagItem[]
  ): number => {
    const action = promo.actions?.[0];
    if (!action) return 0;

    // PRIORITY 1: Variant-level targeting (most specific)
    if (
      promo.applicableProductVariants &&
      promo.applicableProductVariants.length > 0
    ) {
      const eligibleItems = getEligibleCartItems(
        items,
        promo.applicableProductVariants
      );
      const eligibleTotal = eligibleItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Apply discount only to eligible items
      return calculateDiscountAmount(action, eligibleTotal, eligibleItems);
    }

    // PRIORITY 2: Product-level targeting
    // Build list of applicable product IDs from multiple sources:
    // 1. promo.applicableProducts (direct targeting)
    // 2. SPECIFIC_PRODUCT conditions (condition-based targeting)
    const applicableProductIds: string[] = [];

    // Add from applicableProducts field
    if (promo.applicableProducts && promo.applicableProducts.length > 0) {
      applicableProductIds.push(...promo.applicableProducts);
    }

    // Add from SPECIFIC_PRODUCT conditions
    if (promo.conditions && promo.conditions.length > 0) {
      promo.conditions.forEach((condition: any) => {
        if (condition.type === "SPECIFIC_PRODUCT") {
          if (condition.value) applicableProductIds.push(condition.value);
          if (condition.productIds)
            applicableProductIds.push(...condition.productIds);
        }
      });
    }

    // Calculate applicable total
    let applicableTotal = total;
    let eligibleItems = items;

    // If we have specific products, only count those
    if (applicableProductIds.length > 0) {
      eligibleItems = items.filter((item) =>
        applicableProductIds.includes(item.itemId)
      );
      applicableTotal = eligibleItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    // Exclude excluded products from calculation
    if (promo.excludedProducts && promo.excludedProducts.length > 0) {
      eligibleItems = eligibleItems.filter(
        (item) => !promo.excludedProducts.includes(item.itemId)
      );
      applicableTotal = eligibleItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    return calculateDiscountAmount(action, applicableTotal, eligibleItems);
  };

  // Helper: Calculate discount amount based on action type
  const calculateDiscountAmount = (
    action: any,
    applicableTotal: number,
    eligibleItems: BagItem[]
  ): number => {
    switch (action.type) {
      case "PERCENTAGE_OFF":
        let discount = (applicableTotal * action.value) / 100;
        if (action.maxDiscount) {
          discount = Math.min(discount, action.maxDiscount);
        }
        return Math.round(discount);
      case "FIXED_OFF":
        return Math.min(action.value, applicableTotal);
      case "FREE_SHIPPING":
        // Return estimated average shipping cost for display
        // Actual shipping ranges from Rs. 380 (1 item) to Rs. 500+ (2+ items)
        return 400; // Average shipping cost saved
      case "FREE_ITEM":
        // Return the price of the free item if specified
        if (action.freeProductId) {
          const freeItem = eligibleItems.find(
            (item: BagItem) => item.itemId === action.freeProductId
          );
          if (freeItem) {
            return freeItem.price;
          }
        }
        return 0;
      case "BOGO":
        // Buy One Get One - calculate the value of the cheapest eligible item
        if (eligibleItems.length >= 2) {
          const sortedPrices = eligibleItems
            .map((item: BagItem) => item.price)
            .sort((a: number, b: number) => a - b);
          return sortedPrices[0]; // Cheapest item is free
        }
        return 0;
      default:
        return 0;
    }
  };

  // Generate message for promotion
  const getPromoMessage = (promo: any, isEligible: boolean): string => {
    const action = promo.actions?.[0];
    const minAmount = promo.conditions?.find(
      (c: any) => c.type === "MIN_AMOUNT"
    )?.value;

    if (!action) return promo.description;

    switch (action.type) {
      case "PERCENTAGE_OFF":
        const msg = `Get ${action.value}% off`;
        if (minAmount && !isEligible) {
          return `${msg} on orders over Rs. ${minAmount.toLocaleString()}`;
        }
        return isEligible ? `${msg} applied!` : msg;
      case "FIXED_OFF":
        return `Save Rs. ${action.value} on your order`;
      case "FREE_SHIPPING":
        return isEligible ? "Free shipping applied!" : "Get free shipping!";
      case "BOGO":
        return "Buy one, get one free!";
      default:
        return promo.description;
    }
  };

  // Refresh on mount and when cart changes
  useEffect(() => {
    const currentHash = getBagHash();
    const bagChanged = currentHash !== lastBagHash.current;
    lastBagHash.current = currentHash;

    // Clear promotions if combo items added
    if (hasComboItems) {
      setPromotions([]);
      dispatch(removePromotion());
      return;
    }

    // Refresh on any bag change
    if (bagChanged || promotions.length === 0) {
      fetchPromotions();
    }
  }, [bagItems, hasComboItems, getBagHash, fetchPromotions, dispatch]);

  // Split promotions by eligibility
  const eligiblePromotions = promotions.filter((p) => p.isEligible);
  const nearbyPromotions = promotions.filter(
    (p) => !p.isEligible && !p.isRestricted && (p.progress || 0) >= 50
  );
  // Promotions that user could qualify for if they had the right items
  const restrictedPromotions = promotions.filter(
    (p) => !p.isEligible && p.isRestricted
  );

  // Get applied promotions from Redux state
  const appliedPromotionIds = useSelector(
    (state: RootState) => state.bag.promotionIds
  );
  const totalPromotionDiscount = useSelector(
    (state: RootState) => state.bag.promotionDiscount
  );
  const reduxAppliedPromotions = useSelector(
    (state: RootState) => state.bag.appliedPromotions
  );

  // Find currently applied promotion (primary - for backward compat)
  const appliedPromotion =
    promotions.find((p) => p.id === appliedPromotionId) || null;

  // Find all applied promotions
  const appliedPromotionsFromState: ActivePromotion[] = promotions.filter((p) =>
    appliedPromotionIds.includes(p.id)
  );

  return {
    activePromotions: promotions,
    eligiblePromotions,
    nearbyPromotions,
    restrictedPromotions,
    isLoading,
    hasComboItems,
    isBlocked,
    appliedPromotion,
    appliedPromotions: appliedPromotionsFromState,
    totalPromotionDiscount,
    refreshPromotions: fetchPromotions,
  };
};

export default usePromotions;
