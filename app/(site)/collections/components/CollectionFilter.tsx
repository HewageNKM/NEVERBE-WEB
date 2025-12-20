"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetFilter,
  setInStock,
  setSelectedBrands,
  setSelectedSizes,
} from "@/redux/categorySlice/categorySlice";
import FilterPanel from "@/components/FilterPanel";
import { useFilterToggles } from "@/hooks/useFilterToggles";

const CollectionFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedSizes, inStock } = useSelector(
    (state: RootState) => state.categorySlice
  );

  // Use shared filter toggle hooks (pass empty array for categories as this filter doesn't use them)
  const { toggleBrand, toggleSize } = useFilterToggles(
    selectedBrands,
    [], // No categories in this filter
    selectedSizes,
    setSelectedBrands,
    () => ({ type: "NOOP", payload: [] }), // No-op for categories
    setSelectedSizes
  );

  return (
    <FilterPanel
      selectedBrands={selectedBrands}
      selectedCategories={[]}
      selectedSizes={selectedSizes}
      inStock={inStock}
      onBrandToggle={toggleBrand}
      onCategoryToggle={() => {}}
      onSizeToggle={toggleSize}
      onInStockChange={(val) => dispatch(setInStock(val))}
      onReset={() => dispatch(resetFilter())}
      showCategories={false}
      title="Refine"
    />
  );
};

export default CollectionFilter;
