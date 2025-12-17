"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ActivePromotion as HookActivePromotion } from "@/hooks/usePromotions";

// Define the shape of the raw promotion data from API
export interface ActivePromotion
  extends Omit<HookActivePromotion, "isEligible" | "message"> {
  startDate?: string;
  endDate?: string;
  status?: string;
  conditions?: any[];
  actions?: any[];
  bannerUrl?: string; // New field for Unified Promotion Model
  isEligible?: boolean; // Optional here as we calculate it differently
  message?: string;
}

interface PromotionsContextType {
  promotions: ActivePromotion[];
  isLoading: boolean;
  getPromotionForProduct: (
    productId: string,
    variantId?: string
  ) => ActivePromotion | null;
}

const PromotionsContext = createContext<PromotionsContextType>({
  promotions: [],
  isLoading: false,
  getPromotionForProduct: () => null,
});

export const usePromotionsContext = () => useContext(PromotionsContext);

export const PromotionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [promotions, setPromotions] = useState<ActivePromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all active promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/v1/promotions");
        if (res.ok) {
          const data = await res.json();
          setPromotions(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Helper: Match a product to the best available promotion
  const getPromotionForProduct = useCallback(
    (productId: string, variantId?: string): ActivePromotion | null => {
      // Find all promotions that target this product
      const matches = promotions.filter((promo) => {
        // 1. Check Date Validity
        const now = new Date();
        if (promo.startDate && new Date(promo.startDate as any) > now)
          return false;
        if (promo.endDate && new Date(promo.endDate as any) < now) return false;

        // 2. Check Exclusions
        if (promo.excludedProducts?.includes(productId)) return false;

        // 3. Check Variant Targeting (Highest Priority)
        if (
          promo.applicableProductVariants &&
          promo.applicableProductVariants.length > 0
        ) {
          // Check if this specific product+variant is targeted
          const updatedVariantsTargeting = promo.applicableProductVariants.find(
            (t: any) => t.productId === productId
          );
          if (!updatedVariantsTargeting) return false; // This promo targets VARIANTS, but not THIS product's variants

          if (updatedVariantsTargeting.variantMode === "ALL_VARIANTS")
            return true;
          if (
            updatedVariantsTargeting.variantMode === "SPECIFIC_VARIANTS" &&
            variantId
          ) {
            return (
              updatedVariantsTargeting.variantIds?.includes(variantId) || false
            );
          }
          // If no variantId provided, but checking generic product eligibility, we can say "maybe"
          // but usually ItemCard only has product ID. We'll return match if ANY variant is compatible?
          // For now, assume stringent check if variantId is provided.
          return false;
        }

        // 4. Check Product Targeting
        if (promo.applicableProducts && promo.applicableProducts.length > 0) {
          if (promo.applicableProducts.includes(productId)) return true;
        }

        // 5. Check "Specific Product" conditions (Condition-based targeting)
        if (promo.conditions && promo.conditions.length > 0) {
          const hasSpecificProductCondition = promo.conditions.some(
            (c: any) =>
              c.type === "SPECIFIC_PRODUCT" &&
              (c.value === productId || c.productIds?.includes(productId))
          );
          if (hasSpecificProductCondition) return true;
        }

        // 6. Check Categories/Brands (if we had access to product metadata here)
        // Note: We don't have the full product object here, so we can't check category/brand easily
        // unless passed in. We'll skip this for now or rely on specific product targeting.

        return false;
      });

      // Return the highest priority match
      return (
        matches.sort(
          (a: any, b: any) => (b.priority || 0) - (a.priority || 0)
        )[0] || null
      );
    },
    [promotions]
  );

  return (
    <PromotionsContext.Provider
      value={{ promotions, isLoading, getPromotionForProduct }}
    >
      {children}
    </PromotionsContext.Provider>
  );
};
