"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { applyPromotions, removePromotion } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces/BagItem";
import { calculateTotal, calculateTotalDiscount } from "@/util";

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
  applicableCategories?: string[];
  applicableBrands?: string[];
  excludedProducts?: string[];
  message: string;
  savings?: number;
  isEligible: boolean;
  progress?: number; // 0-100 for min amount progress
  remaining?: number; // Amount remaining to qualify
  isFreeShipping?: boolean; // Flag for free shipping promotions
}

interface UsePromotionsReturn {
  activePromotions: ActivePromotion[];
  eligiblePromotions: ActivePromotion[];
  nearbyPromotions: ActivePromotion[];
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
  const bagItems = useSelector((state: RootState) => state.bagSlice.bag);
  const appliedPromotionId = useSelector(
    (state: RootState) => state.bagSlice.promotionId
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
            const isEligible = checkEligibility(promo, bagItems, cartTotal);
            const { progress, remaining } = calculateProgress(promo, cartTotal);

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
              applicableCategories: promo.applicableCategories,
              applicableBrands: promo.applicableBrands,
              excludedProducts: promo.excludedProducts,
              message: getPromoMessage(promo, isEligible),
              savings: isEligible
                ? calculateSavings(promo, cartTotal, bagItems)
                : undefined,
              isEligible,
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

  // Check if cart meets promotion conditions
  const checkEligibility = (
    promo: any,
    items: BagItem[],
    total: number
  ): boolean => {
    // First check date validity
    const now = new Date();
    if (promo.startDate) {
      const startDate = new Date(promo.startDate);
      if (now < startDate) return false;
    }
    if (promo.endDate) {
      const endDate = new Date(promo.endDate);
      if (now > endDate) return false;
    }

    // Check applicable products targeting (if any cart item matches)
    if (promo.applicableProducts && promo.applicableProducts.length > 0) {
      const hasApplicableProduct = items.some((item) =>
        promo.applicableProducts.includes(item.itemId)
      );
      if (!hasApplicableProduct) return false;
    }

    // Check applicable categories targeting
    if (promo.applicableCategories && promo.applicableCategories.length > 0) {
      const hasApplicableCategory = items.some(
        (item) =>
          (item as any).category &&
          promo.applicableCategories.includes((item as any).category)
      );
      if (!hasApplicableCategory) return false;
    }

    // Check applicable brands targeting
    if (promo.applicableBrands && promo.applicableBrands.length > 0) {
      const hasApplicableBrand = items.some(
        (item) =>
          (item as any).brand &&
          promo.applicableBrands.includes((item as any).brand)
      );
      if (!hasApplicableBrand) return false;
    }

    // Check excluded products (if ALL items are excluded, promo doesn't apply)
    if (promo.excludedProducts && promo.excludedProducts.length > 0) {
      const allExcluded = items.every((item) =>
        promo.excludedProducts.includes(item.itemId)
      );
      if (allExcluded) return false;
    }

    // Check conditions
    if (!promo.conditions || promo.conditions.length === 0) return true;

    return promo.conditions.every((condition: any) => {
      switch (condition.type) {
        case "MIN_AMOUNT":
          return total >= condition.value;
        case "MIN_QUANTITY":
          const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
          return totalQty >= condition.value;
        case "SPECIFIC_PRODUCT":
          return items.some((item) =>
            condition.productIds?.includes(item.itemId)
          );
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
  };

  // Calculate progress towards min amount
  const calculateProgress = (
    promo: any,
    total: number
  ): { progress: number; remaining: number } => {
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

    // Calculate applicable total (respecting targeting and exclusions)
    let applicableTotal = total;

    // If applicable products specified, only count those
    if (promo.applicableProducts && promo.applicableProducts.length > 0) {
      applicableTotal = items
        .filter((item) => promo.applicableProducts.includes(item.itemId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    // Exclude excluded products from calculation
    if (promo.excludedProducts && promo.excludedProducts.length > 0) {
      const excludedTotal = items
        .filter((item) => promo.excludedProducts.includes(item.itemId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      applicableTotal = Math.max(0, applicableTotal - excludedTotal);
    }

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
        // Return a nominal value to indicate savings (actual shipping cost varies)
        return 0; // Will be handled separately in checkout
      case "FREE_ITEM":
        // Return the price of the free item if specified
        if (action.freeProductId) {
          const freeItem = items.find(
            (item) => item.itemId === action.freeProductId
          );
          if (freeItem) {
            return freeItem.price;
          }
        }
        return 0;
      case "BOGO":
        // Buy One Get One - calculate the value of the cheapest item
        if (items.length >= 2) {
          const sortedPrices = items
            .map((item) => item.price)
            .sort((a, b) => a - b);
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
        return "Free shipping on this order!";
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
    (p) => !p.isEligible && (p.progress || 0) >= 50
  );

  // Get applied promotions from Redux state
  const appliedPromotionIds = useSelector(
    (state: RootState) => state.bagSlice.promotionIds
  );
  const totalPromotionDiscount = useSelector(
    (state: RootState) => state.bagSlice.promotionDiscount
  );
  const reduxAppliedPromotions = useSelector(
    (state: RootState) => state.bagSlice.appliedPromotions
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
