"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import DealsFilter from "./DealsFilter";
import { IoOptionsOutline } from "react-icons/io5";
import { AnimatePresence } from "framer-motion";
import {
  setPage,
  setSelectedSort,
  toggleFilter,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  setInStock,
  resetFilter,
} from "@/redux/dealsSlice/dealsSlice";
import { Product } from "@/interfaces/Product";
import { sortProductsByPrice } from "@/utils/formatting";
import SortDropdown from "@/components/SortDropdown";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";
import { useFilterToggles } from "@/hooks/useFilterToggles";

const DealsProducts = ({ items }: { items: Product[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const {
    page,
    size,
    selectedBrands,
    selectedCategories,
    selectedSizes,
    inStock,
    selectedSort,
    showFilter,
  } = useSelector((state: RootState) => state.dealsSlice);

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(items);
  const [totalProducts, setTotalProducts] = useState(items.length);

  // Use shared filter toggle hooks
  const { toggleBrand, toggleCategory, toggleSize } = useFilterToggles(
    selectedBrands,
    selectedCategories,
    selectedSizes,
    setSelectedBrand,
    setSelectedCategories,
    setSelectedSizes
  );

  // Fetch Logic
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sort: selectedSort,
          ...(inStock && { inStock: "true" }),
        });
        selectedBrands.forEach((b) => params.append("tag", b));
        selectedCategories.forEach((c) => params.append("tag", c));
        if (selectedSizes.length > 0)
          params.append("sizes", selectedSizes.join(","));

        const res = await fetch(`/api/v1/products/deals?${params}`);
        const data = await res.json();

        // Use shared sorting utility
        const sorted = sortProductsByPrice(data.dataList || [], selectedSort);

        setProducts(sorted);
        setTotalProducts(data.total);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, [
    page,
    size,
    selectedBrands,
    selectedCategories,
    selectedSizes,
    inStock,
    selectedSort,
  ]);

  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 md:px-8 pb-20 flex gap-0 bg-white">
      {/* 1. DESKTOP SIDEBAR - FilterPanel provides its own sticky aside */}
      <DealsFilter />

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilter && (
          <PopUpFilterPanel
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
        )}
      </AnimatePresence>

      <div className="flex-1 w-full">
        {/* 2. Sticky Toolbar */}
        <div className="relative z-20 bg-white/90 backdrop-blur-md py-6 flex justify-end items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="lg:hidden flex items-center gap-2 text-[16px] text-primary"
              aria-label="Open Filters"
            >
              <IoOptionsOutline size={22} />
              <span>Filter</span>
            </button>

            <SortDropdown
              value={selectedSort}
              onChange={(val) => dispatch(setSelectedSort(val))}
            />
          </div>
        </div>

        {/* 3. Product Grid */}
        {isLoading ? (
          <div className="h-[60vh] relative">
            <ComponentLoader />
          </div>
        ) : products.length === 0 ? (
          <div className="pt-20">
            <EmptyState heading="No offers found" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-12">
            {products.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* 4. Pagination */}
        <div className="flex justify-center mt-24 border-t border-gray-100 pt-12">
          <Pagination
            count={Math.ceil(totalProducts / size)}
            page={page}
            onChange={(v) => {
              dispatch(setPage(v));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default DealsProducts;
