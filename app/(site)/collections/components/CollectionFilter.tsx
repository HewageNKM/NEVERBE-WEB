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

const CollectionFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedSizes, inStock } = useSelector(
    (state: RootState) => state.categorySlice
  );

  const toggleBrand = (brand: string) => {
    const lower = brand.toLowerCase();
    const newBrands = selectedBrands.includes(lower)
      ? selectedBrands.filter((b) => b !== lower)
      : [...selectedBrands, lower];
    if (newBrands.length <= 5) dispatch(setSelectedBrands(newBrands));
  };

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    dispatch(setSelectedSizes(newSizes));
  };

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
