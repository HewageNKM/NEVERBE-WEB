"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Promotion, ProductVariantTarget, PromotionCondition } from "@/interfaces/Promotion";
import {
  isPromotionDateValid,
  checkVariantEligibility,
  isVariantEligibleForPromotion,
} from "@/utils/promotionUtils";
import axiosInstance from "@/actions/axiosInstance";

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
    variantId?: string,
  ) => ActivePromotion | null;
  getPromotionsForProduct: (
    productId: string,
    variantId?: string,
  ) => ActivePromotion[];
}

const PromotionsContext = createContext<PromotionsContextType>({
  promotions: [],
  isLoading: false,
  getPromotionForProduct: () => null,
  getPromotionsForProduct: () => [],
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
        const res = await axiosInstance.get("/web/promotions");
        if (res.data) {
          const data = res.data;
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
      if (!productId) return null;

      const matches = promotions.filter((promo) => {
        // 1. Check Date Validity
        const dateCheck = isPromotionDateValid(promo.startDate, promo.endDate);
        if (!dateCheck.valid) return false;

        // 2. Initial Exclusions
        if (promo.excludedProducts?.includes(productId)) return false;

        // 3. Use Granular Utility for targeting (Product, Variant, Conditions)
        const isEligible = isVariantEligibleForPromotion(
          productId,
          variantId || "",
          promo.applicableProductVariants as ProductVariantTarget[],
          promo.conditions as PromotionCondition[],
          promo.applicableProducts,
        );

        if (!isEligible) return false;

        // 4. Category/Brand Check (Additional layer if not covered by conditions)
        if (
          promo.applicableCategories &&
          promo.applicableCategories.length > 0
        ) {
          // Note: Full category/brand check requires product data which might not be in the promo object.
          // This is a simplified check assuming the caller handles basic eligibility if it's a general promo.
        }

        return true;
      });

      // Return highest priority match
      return (
        matches.sort(
          (a: any, b: any) => (b.priority || 0) - (a.priority || 0),
        )[0] || null
      );
    },
    [promotions],
  );

  const getPromotionsForProduct = useCallback(
    (productId: string, variantId?: string): ActivePromotion[] => {
      if (!productId) return [];

      return promotions
        .filter((promo) => {
          // 1. Check Date Validity
          const dateCheck = isPromotionDateValid(promo.startDate, promo.endDate);
          if (!dateCheck.valid) return false;

          // 2. Initial Exclusions
          if (promo.excludedProducts?.includes(productId)) return false;

          // 3. Use Granular Utility for targeting
          const isEligible = isVariantEligibleForPromotion(
            productId,
            variantId || "",
            promo.applicableProductVariants as ProductVariantTarget[],
            promo.conditions as PromotionCondition[],
            promo.applicableProducts,
          );

          return isEligible;
        })
        .sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0));
    },
    [promotions],
  );

  return (
    <PromotionsContext.Provider
      value={{ 
        promotions, 
        isLoading, 
        getPromotionForProduct,
        getPromotionsForProduct 
      }}
    >
      {children}
    </PromotionsContext.Provider>
  );
};
