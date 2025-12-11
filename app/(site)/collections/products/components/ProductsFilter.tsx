"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiReset } from "react-icons/bi";
import {
  resetFilter,
  setSelectedBrand,
  setSelectedCategories,
  setInStock,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";

import { Switch } from "@mui/material";
import { toast } from "react-toastify";

const ProductsFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, inStock } = useSelector(
    (state: RootState) => state.productsSlice
  );

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const toggleBrand = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (selectedBrands.includes(lowerValue)) {
      dispatch(
        setSelectedBrand(selectedBrands.filter((b) => b !== lowerValue))
      );
    } else {
      if (selectedBrands.length >= 5) {
        toast.warn("You can select up to 5 brands only.");
        return;
      }
      dispatch(setSelectedBrand([...selectedBrands, lowerValue]));
    }
  };

  const toggleCategory = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (selectedCategories.includes(lowerValue)) {
      dispatch(
        setSelectedCategories(
          selectedCategories.filter((c) => c !== lowerValue)
        )
      );
    } else {
      if (selectedCategories.length >= 5) {
        return;
      }
      dispatch(setSelectedCategories([...selectedCategories, lowerValue]));
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await fetch(`/api/v1/brands/dropdown`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBrands(data);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch(`/api/v1/categories/dropdown`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // --- Helper: Skeleton loader for buttons ---
  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg" />
    ));

  return (
    <>
      <aside className="hidden lg:flex flex-col w-72 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-[0_0_20px_rgba(0,0,0,0.05)] sticky top-20 gap-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold tracking-wide text-gray-800">
            Filters
          </h2>
          <button
            onClick={() => dispatch(resetFilter())}
            className="p-2 rounded-full bg-primary-100 hover:bg-primary-100 transition hover:scale-110 active:scale-95"
            title="Reset Filters"
          >
            <BiReset size={20} className="text-white" />
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {/* In Stock Switch */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">In Stock</h3>
            <Switch
              checked={inStock}
              onChange={(e) => dispatch(setInStock(e.target.checked))}
              color="warning"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
              <span>Categories</span>
              <span className="text-xs text-gray-400">
                {selectedCategories.length}/5
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {loadingCategories
                ? renderSkeletons(6)
                : categories.map((category, index) => {
                    const isSelected = selectedCategories.includes(
                      category.label?.toLowerCase()
                    );
                    return (
                      <button
                        key={index}
                        onClick={() => toggleCategory(category.label)}
                        className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition hover:scale-105 active:scale-95 ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
              <span>Brands</span>
              <span className="text-xs text-gray-400">
                {selectedBrands.length}/5
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {loadingBrands
                ? renderSkeletons(6)
                : brands.map((brand, index) => {
                    const isSelected = selectedBrands.includes(
                      brand.label?.toLowerCase()
                    );
                    return (
                      <button
                        key={index}
                        onClick={() => toggleBrand(brand.label)}
                        className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition hover:scale-105 active:scale-95 ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {brand.label}
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProductsFilter;
