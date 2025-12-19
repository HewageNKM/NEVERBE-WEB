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

const CollectionPopUpFilter = () => {
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
