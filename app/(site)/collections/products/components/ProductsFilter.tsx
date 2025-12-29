"use client";
import React from "react";
import FilterPanel from "@/components/FilterPanel";

interface ProductsFilterProps {
  filters: {
    brands: string[];
    categories: string[];
    sizes: string[];
    inStock: boolean;
  };
  actions: {
    toggleBrand: (brand: string) => void;
    toggleCategory: (category: string) => void;
    toggleSize: (size: string) => void;
    setInStock: (val: boolean) => void;
    resetFilters: () => void;
  };
}

const ProductsFilter = ({ filters, actions }: ProductsFilterProps) => {
  return (
    <FilterPanel
      selectedBrands={filters.brands}
      selectedCategories={filters.categories}
      selectedSizes={filters.sizes}
      inStock={filters.inStock}
      onBrandToggle={actions.toggleBrand}
      onCategoryToggle={actions.toggleCategory}
      onSizeToggle={actions.toggleSize}
      onInStockChange={actions.setInStock}
      onReset={actions.resetFilters}
    />
  );
};

export default ProductsFilter;
