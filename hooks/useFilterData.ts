"use client";
import { useState, useEffect } from "react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterData {
  brands: FilterOption[];
  categories: FilterOption[];
  loading: boolean;
}

/**
 * Hook to fetch filter dropdown data (brands, categories)
 * Centralizes the fetch logic that was duplicated across 5 filter components
 */
export const useFilterData = (fetchCategories: boolean = true): FilterData => {
  const [brands, setBrands] = useState<FilterOption[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [fetch("/api/v1/brands/dropdown")];
        if (fetchCategories) {
          promises.push(fetch("/api/v1/categories/dropdown"));
        }

        const responses = await Promise.all(promises);
        const [brandsData, categoriesData] = await Promise.all(
          responses.map((r) => r.json())
        );

        setBrands(brandsData || []);
        if (fetchCategories) {
          setCategories(categoriesData || []);
        }
      } catch (e) {
        console.error("Failed to fetch filter data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchCategories]);

  return { brands, categories, loading };
};

export default useFilterData;
