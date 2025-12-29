"use client";
import React from "react";
import Pagination from "@/components/Pagination";
import ProductsFilter from "./ProductsFilter";
import { IoOptionsOutline } from "react-icons/io5";
import { AnimatePresence } from "framer-motion";
import { Product } from "@/interfaces/Product";
import SortDropdown from "@/components/SortDropdown";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";
import { useProductListing } from "@/hooks/useProductListing";
import ProductGrid from "@/components/ProductGrid";

const Products = ({ items }: { items: Product[] }) => {
  // Use the new Unified Hook
  // We don't initialize internal state from 'items' because the hook fetches fresh data
  // but we could pass 'items' as initial data if we wanted SSR hydration support primarily.
  // For now, maximizing simple client-side consistency.
  const {
    products,
    loading,
    total,
    page,
    totalPages,
    filters,
    setPage,
    setSort,
    setInStock,
    toggleBrand,
    toggleCategory,
    toggleSize,
    resetFilters,
  } = useProductListing({
    apiEndpoint: "/api/v1/products",
  });

  // Local state for mobile drawer only (UI state, not data state)
  const [showFilter, setShowFilter] = React.useState(false);

  // Derive products to show:
  // If loading first time (products empty) but we have SSR items, maybe show SSR items?
  // But hook fetches immediately. Let's just rely on hook data.
  const displayProducts =
    products.length > 0 ? products : loading && items.length > 0 ? items : [];
  const showLoading = loading && displayProducts.length === 0;

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 pb-20 flex gap-0 bg-surface">
      {/* 1. DESKTOP SIDEBAR - FilterPanel provides its own sticky aside */}
      <ProductsFilter
        filters={filters}
        actions={{
          toggleBrand,
          toggleCategory,
          toggleSize,
          setInStock,
          resetFilters,
        }}
      />

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilter && (
          <PopUpFilterPanel
            selectedBrands={filters.brands}
            selectedCategories={filters.categories}
            selectedSizes={filters.sizes}
            inStock={filters.inStock}
            onBrandToggle={toggleBrand}
            onCategoryToggle={toggleCategory}
            onSizeToggle={toggleSize}
            onInStockChange={setInStock}
            onReset={resetFilters}
            onClose={() => setShowFilter(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 w-full">
        {/* Icon-only Toolbar */}
        <div className="relative z-20 bg-surface/90 backdrop-blur-md py-4 flex justify-between lg:justify-end items-center gap-2">
          <button
            onClick={() => setShowFilter(true)}
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-surface-2 border border-default rounded-full hover:border-accent text-primary hover:text-accent transition-all"
            aria-label="Open Filters"
          >
            <IoOptionsOutline size={18} />
          </button>

          <SortDropdown value={filters.sort} onChange={setSort} />
        </div>

        {/* 3. PRODUCT GRID */}
        <ProductGrid products={displayProducts} loading={showLoading} />

        {/* Pagination */}
        {total > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-24 border-t border-default pt-12">
            <Pagination count={totalPages} page={page} onChange={setPage} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
