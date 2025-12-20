"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilter,
  setInStock,
  setSelectedBrands,
  setSelectedSizes,
  toggleFilter,
} from "@/redux/categorySlice/categorySlice";
import { AppDispatch, RootState } from "@/redux/store";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";
import { useFilterToggles } from "@/hooks/useFilterToggles";

const CollectionPopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedSizes, inStock } = useSelector(
    (state: RootState) => state.categorySlice
  );

  // Use shared filter toggle hooks
  const { toggleBrand, toggleSize } = useFilterToggles(
    selectedBrands,
    [], // No categories for collection filter
    selectedSizes,
    setSelectedBrands,
    () => {}, // No category action
    setSelectedSizes
  );

  return (
    <PopUpFilterPanel
      selectedBrands={selectedBrands}
      selectedCategories={[]}
      selectedSizes={selectedSizes}
      inStock={inStock}
      onBrandToggle={toggleBrand}
      onCategoryToggle={() => {}}
      onSizeToggle={toggleSize}
      onInStockChange={(val) => dispatch(setInStock(val))}
      onReset={() => dispatch(resetFilter())}
      onClose={() => dispatch(toggleFilter())}
      showCategories={false}
    />
  );
};

export default CollectionPopUpFilter;
