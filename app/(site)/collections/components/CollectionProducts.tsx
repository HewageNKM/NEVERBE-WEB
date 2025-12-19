"use client";
import React, { useEffect, useRef, useState } from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import CollectionFilter from "./CollectionFilter";
import Pagination from "@/components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { IoChevronDownOutline, IoOptionsOutline } from "react-icons/io5";
import {
  setProducts,
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/categorySlice/categorySlice";
import { sortingOptions } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/interfaces/Product";
import CollectionPopUpFilter from "./CollectionPopUpFilter";

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

  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
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

        // Client Sort fallback
        let sorted = [...(data.dataList || [])];
        if (selectedSort === "LOW TO HIGH")
          sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
        if (selectedSort === "HIGH TO LOW")
          sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);

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

  // Close Sort
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setOpenSort(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-20 flex gap-12 pt-8">
      {/* Desktop Filters */}
      <CollectionFilter />

      {/* Mobile Filter Drawer - Reusing CategoryPopUpFilter for now as it likely uses same slice */}
      <AnimatePresence>
        {showFilter && <CollectionPopUpFilter />}
      </AnimatePresence>

      <div className="flex-1 w-full">
        {/* --- Toolbar --- */}
        <div className="sticky top-[60px] md:top-20 z-30 bg-white/95 backdrop-blur-md py-4 mb-6 border-b border-gray-100 flex justify-between items-center">
          {/* Mobile Trigger */}
          <button
            onClick={() => dispatch(toggleFilter())}
            className="lg:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-wide border border-gray-300 rounded-full px-4 py-2 hover:border-black transition-colors"
          >
            <IoOptionsOutline size={18} /> Filters
          </button>

          <p className="hidden lg:block text-gray-400 text-sm font-medium">
            Showing {products?.length || 0} Products
          </p>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-1 text-sm font-bold uppercase hover:text-gray-600 transition-colors"
            >
              Sort By <IoChevronDownOutline />
            </button>
            <AnimatePresence>
              {openSort && (
                <motion.ul
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl z-50 py-2 rounded-sm"
                >
                  {sortingOptions.map((opt, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        dispatch(setSelectedSort(opt.value));
                        setOpenSort(false);
                      }}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-gray-50 ${
                        selectedSort === opt.value
                          ? "text-black bg-gray-50"
                          : "text-gray-500"
                      }`}
                    >
                      {opt.name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- Grid --- */}
        {isLoading ? (
          <div className="h-[50vh] relative">
            <ComponentLoader />
          </div>
        ) : products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {products?.map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState heading={`No products found`} />
        )}

        {/* --- Pagination --- */}
        <div className="flex justify-center mt-16">
          <Pagination
            page={page}
            count={Math.ceil(totalProducts / size) || 1}
            onChange={(value) => dispatch(setPage(value))}
          />
        </div>
      </div>
    </section>
  );
};

export default CollectionProducts;
