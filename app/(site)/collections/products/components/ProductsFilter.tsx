"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilter,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  setInStock,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import FilterPanel from "@/components/FilterPanel";
import { useFilterToggles } from "@/hooks/useFilterToggles";

const ProductsFilter = () => {
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
    <aside className="w-full">
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
    </aside>
  );
};

export default ProductsFilter;
