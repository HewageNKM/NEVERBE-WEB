"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilter,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  setInStock,
} from "@/redux/dealsSlice/dealsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import FilterPanel from "@/components/FilterPanel";

const DealsFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, selectedSizes, inStock } =
    useSelector((state: RootState) => state.dealsSlice);

  const toggleBrand = (value: string) => {
    const lowerValue = value.toLowerCase();
    const newBrands = selectedBrands.includes(lowerValue)
      ? selectedBrands.filter((b) => b !== lowerValue)
      : [...selectedBrands, lowerValue];
    dispatch(setSelectedBrand(newBrands.slice(0, 5)));
  };

  const toggleCategory = (value: string) => {
    const lowerValue = value.toLowerCase();
    const newCats = selectedCategories.includes(lowerValue)
      ? selectedCategories.filter((c) => c !== lowerValue)
      : [...selectedCategories, lowerValue];
    dispatch(setSelectedCategories(newCats.slice(0, 5)));
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
      selectedCategories={selectedCategories}
      selectedSizes={selectedSizes}
      inStock={inStock}
      onBrandToggle={toggleBrand}
      onCategoryToggle={toggleCategory}
      onSizeToggle={toggleSize}
      onInStockChange={(val) => dispatch(setInStock(val))}
      onReset={() => dispatch(resetFilter())}
    />
  );
};

export default DealsFilter;
