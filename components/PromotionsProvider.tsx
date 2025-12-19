"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Promotion, ProductVariantTarget } from "@/interfaces/Promotion";
import {
  isPromotionDateValid,
  checkVariantEligibility,
} from "@/utils/promotionUtils";

// Active promotion for context consumers
export interface ActivePromotion extends Partial<Promotion> {
  id: string;
  name: string;
  description: string;
  type: Promotion["type"];
  bannerUrl?: string;
  isEligible?: boolean;
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

  // Match a product to the best available promotion
  const getPromotionForProduct = useCallback(
    (productId: string, variantId?: string): ActivePromotion | null => {
      const matches = promotions.filter((promo) => {
        // 1. Check Date Validity
        const dateCheck = isPromotionDateValid(promo.startDate, promo.endDate);
        if (!dateCheck.valid) return false;

        // 2. Check Exclusions
        if (promo.excludedProducts?.includes(productId)) return false;

        // 3. Check Variant Targeting (using shared utility)
        if (
          promo.applicableProductVariants &&
          promo.applicableProductVariants.length > 0
        ) {
          const mockCartItem = [
            { itemId: productId, variantId, quantity: 1, price: 0 },
          ];
          const variantMatch = checkVariantEligibility(
            mockCartItem,
            promo.applicableProductVariants as ProductVariantTarget[]
          );
          if (!variantMatch) return false;
          return true;
        }

        // 4. Check Product Targeting
        if (promo.applicableProducts && promo.applicableProducts.length > 0) {
          if (promo.applicableProducts.includes(productId)) return true;
        }

        // 5. Check SPECIFIC_PRODUCT conditions
        if (promo.conditions && promo.conditions.length > 0) {
          const hasSpecificProduct = promo.conditions.some(
            (c: any) =>
              c.type === "SPECIFIC_PRODUCT" &&
              (c.value === productId || c.productIds?.includes(productId))
          );
          if (hasSpecificProduct) return true;
        }

        return false;
      });

      // Return highest priority match
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
