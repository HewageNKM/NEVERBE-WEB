"use client";
import React, { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import CollectionFilter from "./CollectionFilter";
import Pagination from "@/components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { IoOptionsOutline } from "react-icons/io5";
import {
  setProducts,
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/categorySlice/categorySlice";
import { AnimatePresence } from "framer-motion";
import { Product } from "@/interfaces/Product";
import CollectionPopUpFilter from "./CollectionPopUpFilter";
import { sortProductsByPrice } from "@/utils/formatting";
import SortDropdown from "@/components/SortDropdown";

// Mapping for dynamic endpoint construction
interface CollectionProductsProps {
  initialItems: Product[];
  collectionType: "new-arrivals" | "men" | "women" | "category" | "brand";
  tagName?: string; // e.g. "Men", "Women"
  categoryName?: string; // e.g. "Shoes"
  brandName?: string;
  total?: number;
}

const CollectionProducts = ({
  initialItems,
  collectionType,
  tagName,
  categoryName,
  brandName,
  total = 0,
}: CollectionProductsProps) => {
  const dispatch: AppDispatch = useDispatch();
  const {
    products,
    page,
    size,
    selectedSort,
    inStock,
    selectedBrands,
    selectedSizes,
    showFilter,
  } = useSelector((state: RootState) => state.categorySlice);

  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(total);

  // Init
  useEffect(() => {
    dispatch(setProducts(initialItems));
    setTotalProducts(total);
  }, [initialItems, total, dispatch]);

  // Fetch Logic
  useEffect(() => {
    const fetchProducts = async () => {
      // Avoid fetching on initial mount if we already have items for page 1
      // checking if page is 1 and products match initialItems might be complex,
      // so we rely on page change or sort/filter change.

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (inStock) params.append("inStock", "true");
        selectedBrands.forEach((t) => params.append("tag", t));
        if (selectedSizes.length > 0) {
          params.append("sizes", selectedSizes.join(","));
        }

        let endpoint = "/api/v1/products";

        if (collectionType === "category" && categoryName) {
          endpoint = `/api/v1/products/categories/${categoryName}`;
        } else if (collectionType === "brand" && brandName) {
          // Need brand endpoint
          endpoint = `/api/v1/products`; // Fallback or assume query param
        } else {
          // Men, Women, New Arrivals use general product endpoint with tags
          if (tagName) params.append("tag", tagName);

          // New Arrivals might just be latest, so no tag needed unless filtering
        }

        const res = await fetch(`${endpoint}?${params}`);
        const data = await res.json();

        // Use shared sorting utility
        const sorted = sortProductsByPrice(data.dataList || [], selectedSort);

        dispatch(setProducts(sorted));
        setTotalProducts(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Skip initial fetch if we want to rely on server props, but filters need client fetch.
    // For simplicity, we fetch when dependencies change.
    // We can add a check to skip first run if needed, but existing logic usually fine.
    fetchProducts();
  }, [
    page,
    size,
    selectedBrands,
    selectedSizes,
    inStock,
    selectedSort,
    collectionType,
    tagName,
    categoryName,
    brandName,
    dispatch,
  ]);

  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 pb-20 flex gap-0 bg-white">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-[260px] shrink-0 pt-8 pr-8">
        <CollectionFilter />
      </aside>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilter && <CollectionPopUpFilter />}
      </AnimatePresence>

      <div className="flex-1 w-full">
        {/* 2. STICKY TOOLBAR */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md py-6 flex justify-between items-center transition-all">
          <h2 className="text-[20px] font-medium text-[#111] tracking-tight">
            {tagName || categoryName || brandName || "All Products"} (
            {products?.length || 0})
          </h2>

          <div className="flex items-center gap-6">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="lg:hidden flex items-center gap-2 text-[16px] text-[#111]"
            >
              Filters <IoOptionsOutline size={20} />
            </button>

            <SortDropdown
              value={selectedSort}
              onChange={(val) => dispatch(setSelectedSort(val))}
            />
          </div>
        </div>

        {/* 3. PRODUCT GRID */}
        {isLoading ? (
          <div className="h-[60vh] relative">
            <ComponentLoader />
          </div>
        ) : products?.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-12">
            {products?.map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        ) : (
          <div className="pt-20">
            <EmptyState heading={`No products found`} />
          </div>
        )}

        {/* 4. PAGINATION */}
        {totalProducts > size && (
          <div className="flex justify-center mt-24 border-t border-gray-100 pt-12">
            <Pagination
              page={page}
              count={Math.ceil(totalProducts / size) || 1}
              onChange={(value) => {
                dispatch(setPage(value));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionProducts;
