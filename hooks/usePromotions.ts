"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { applyPromotion, removePromotion } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces/BagItem";
import { calculateTotal, calculateTotalDiscount } from "@/util";

export interface ActivePromotion {
  id: string;
  name: string;
  description: string;
  type: "COMBO" | "BOGO" | "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  priority?: number; // For priority-based selection (matches backend)
  discountValue?: number;
  minOrderAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  message: string;
  savings?: number;
  isEligible: boolean;
  progress?: number; // 0-100 for min amount progress
  remaining?: number; // Amount remaining to qualify
}

interface UsePromotionsReturn {
  activePromotions: ActivePromotion[];
  eligiblePromotions: ActivePromotion[];
  nearbyPromotions: ActivePromotion[];
  isLoading: boolean;
  hasComboItems: boolean;
  isBlocked: boolean;
  appliedPromotion: ActivePromotion | null;
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
              discountValue: promo.actions?.[0]?.value,
              minOrderAmount: promo.conditions?.find(
                (c: any) => c.type === "MIN_AMOUNT"
              )?.value,
              applicableProducts: promo.applicableProducts,
              applicableCategories: promo.applicableCategories,
              message: getPromoMessage(promo, isEligible),
              savings: isEligible
                ? calculateSavings(promo, cartTotal, bagItems)
                : undefined,
              isEligible,
              progress,
              remaining,
            };
          })
          // Sort by priority (high to low) to match backend behavior
          .sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0));

        setPromotions(processedPromotions);

        // Auto-apply best eligible promotion (highest priority first, matching backend)
        const eligible = processedPromotions.filter(
          (p) => p.isEligible && p.savings && p.savings > 0
        );
        if (eligible.length > 0) {
          // Take the first eligible promotion (highest priority due to sorting)
          const bestPromo = eligible[0];

          // Apply if different from current or not applied
          if (bestPromo.id !== appliedPromotionId) {
            dispatch(
              applyPromotion({
                id: bestPromo.id,
                discount: bestPromo.savings || 0,
              })
            );
          }
        } else {
          // No eligible promotions, clear any applied
          if (appliedPromotionId) {
            dispatch(removePromotion());
          }
        }
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bagItems, cartTotal, hasComboItems, appliedPromotionId, dispatch]);

  // Check if cart meets promotion conditions
  const checkEligibility = (
    promo: any,
    items: BagItem[],
    total: number
  ): boolean => {
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

    switch (action.type) {
      case "PERCENTAGE_OFF":
        let discount = (total * action.value) / 100;
        if (action.maxDiscount) {
          discount = Math.min(discount, action.maxDiscount);
        }
        return Math.round(discount);
      case "FIXED_OFF":
        return action.value;
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

  // Find currently applied promotion
  const appliedPromotion =
    promotions.find((p) => p.id === appliedPromotionId) || null;

  return {
    activePromotions: promotions,
    eligiblePromotions,
    nearbyPromotions,
    isLoading,
    hasComboItems,
    isBlocked,
    appliedPromotion,
    refreshPromotions: fetchPromotions,
  };
};

export default usePromotions;
