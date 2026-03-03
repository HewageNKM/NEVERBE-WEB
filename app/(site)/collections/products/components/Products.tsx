"use client";
import React from "react";
import { Pagination, Button, Badge } from "antd";
import ProductsFilter from "./ProductsFilter";
import { IoOptionsOutline } from "react-icons/io5";
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
    apiEndpoint: "/web/products",
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

      {/* Mobile Filter Drawer - Antd Drawer, no AnimatePresence needed */}
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

      <div className="flex-1 w-full">
        <div className="relative z-20 py-4 flex justify-between lg:justify-end items-center gap-3">
          <Button
            onClick={() => setShowFilter(true)}
            className="hidden"
            icon={<IoOptionsOutline size={16} />}
            style={{
              borderRadius: 99,
              fontWeight: 700,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              height: 38,
              padding: "0 16px",
              border: "1.5px solid rgba(0,0,0,0.12)",
              background: "#fff",
              color: "#333",
            }}
          >
            Filters
            {filters.brands.length +
              filters.categories.length +
              filters.sizes.length +
              (filters.inStock ? 1 : 0) >
              0 && (
              <span
                style={{
                  marginLeft: 6,
                  background: "#2e9e5b",
                  color: "#fff",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 900,
                  padding: "1px 7px",
                }}
              >
                {filters.brands.length +
                  filters.categories.length +
                  filters.sizes.length +
                  (filters.inStock ? 1 : 0)}
              </span>
            )}
          </Button>

          <SortDropdown value={filters.sort} onChange={setSort} />
        </div>

        {/* 3. PRODUCT GRID */}
        <ProductGrid products={displayProducts} loading={showLoading} />

        {/* Pagination */}
        {total > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-24 border-t border-default pt-12">
            <Pagination
              current={page}
              total={total}
              defaultPageSize={20}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
              className="font-display font-bold uppercase"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
