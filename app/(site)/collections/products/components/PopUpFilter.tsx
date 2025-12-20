"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilter,
  setInStock,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  toggleFilter,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";
import { useFilterToggles } from "@/hooks/useFilterToggles";

const PopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, selectedSizes, inStock } =
    useSelector((state: RootState) => state.productsSlice);

  // Use shared filter toggle hooks
  const { toggleBrand, toggleCategory, toggleSize } = useFilterToggles(
    selectedBrands,
    selectedCategories,
    selectedSizes,
    setSelectedBrand,
    setSelectedCategories,
    setSelectedSizes
  );

  return (
    <PopUpFilterPanel
      // Ensure these props are styled inside the component with:
      // Nike Gray: #707072, Heading Size: text-[18px] Medium
      selectedBrands={selectedBrands}
      selectedCategories={selectedCategories}
      selectedSizes={selectedSizes}
      inStock={inStock}
      onBrandToggle={toggleBrand}
      onCategoryToggle={toggleCategory}
      onSizeToggle={toggleSize}
      onInStockChange={(val) => dispatch(setInStock(val))}
      onReset={() => dispatch(resetFilter())}
      onClose={() => dispatch(toggleFilter())}
    />
  );
};

export default PopUpFilter;
