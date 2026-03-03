"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/actions/axiosInstance";

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
        const promises = [axiosInstance.get("/web/brands/dropdown")];
        if (fetchCategories) {
          promises.push(axiosInstance.get("/web/categories/dropdown"));
        }

        const responses = await Promise.all(promises);
        const [brandsData, categoriesData] = responses.map(
          (r) => r.data.data || r.data,
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
