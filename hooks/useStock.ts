"use client";
import { useState, useCallback } from "react";

interface UseStockOptions {
  onError?: (error: Error) => void;
}

interface UseStockReturn {
  sizeStock: Record<string, number>;
  stockLoading: boolean;
  fetchStock: (
    productId: string,
    variantId: string,
    sizes: string[]
  ) => Promise<void>;
  clearStock: () => void;
}

/**
 * Consolidated hook for fetching product stock
 * Replaces duplicate stock fetching logic in ProductHero and QuickViewModal
 */
export function useStock(options: UseStockOptions = {}): UseStockReturn {
  const { onError } = options;
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState(false);

  const fetchStock = useCallback(
    async (productId: string, variantId: string, sizes: string[]) => {
      if (!productId || !variantId || !sizes.length) {
        setSizeStock({});
        return;
      }

      setStockLoading(true);
      try {
        const res = await fetch(
          `/api/v1/inventory/batch?productId=${productId}&variantId=${variantId}&sizes=${sizes.join(
            ","
          )}`
        );
        const data = await res.json();
        setSizeStock(data.stock || {});
      } catch (error) {
        if (onError) {
          onError(error as Error);
        } else {
          console.error("[useStock] Failed to fetch stock:", error);
        }
        setSizeStock({});
      } finally {
        setStockLoading(false);
      }
    },
    [onError]
  );

  const clearStock = useCallback(() => {
    setSizeStock({});
  }, []);

  return {
    sizeStock,
    stockLoading,
    fetchStock,
    clearStock,
  };
}

export default useStock;
