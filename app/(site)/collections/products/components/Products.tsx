"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import ProductsFilter from "./ProductsFilter";
import { IoOptionsOutline } from "react-icons/io5";
import { AnimatePresence } from "framer-motion";
import {
  setPage,
  setProducts,
  setSelectedSort,
  setSelectedGender,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  setInStock,
  toggleFilter,
  resetFilter,
} from "@/redux/productsSlice/productsSlice";
import { Product } from "@/interfaces/Product";
import { sortProductsByPrice } from "@/utils/formatting";
import SortDropdown from "@/components/SortDropdown";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";
import { useFilterToggles } from "@/hooks/useFilterToggles";

const Products = ({ items }: { items: Product[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    products,
    page,
    size,
    selectedBrands,
    selectedCategories,
    selectedSizes,
    selectedGender,
    inStock,
    selectedSort,
    showFilter,
  } = useSelector((state: RootState) => state.productsSlice);

  const [isLoading, setIsLoading] = useState(false);
  const [totalProduct, setTotalProduct] = useState(items?.length || 0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use shared filter toggle hooks
  const { toggleBrand, toggleCategory, toggleSize } = useFilterToggles(
    selectedBrands,
    selectedCategories,
    selectedSizes,
    setSelectedBrand,
    setSelectedCategories,
    setSelectedSizes
  );

  // --- Initializing from URL ---
  useEffect(() => {
    const gender = searchParams.get("gender") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
    const stock = searchParams.get("inStock") === "true";
    const sort = searchParams.get("sort") || "";
    const pageNum = Number(searchParams.get("page")) || 1;

    dispatch(setSelectedGender(gender));
    dispatch(setSelectedCategories(category ? [category] : []));
    dispatch(setSelectedBrand(brand ? [brand] : []));
    dispatch(setSelectedSizes(sizes));
    dispatch(setInStock(stock));
    dispatch(setPage(pageNum));

    if (sort === "low") dispatch(setSelectedSort("LOW TO HIGH"));
    else if (sort === "high") dispatch(setSelectedSort("HIGH TO LOW"));
    else if (sort === "new") dispatch(setSelectedSort("NEW ARRIVALS"));

    setIsInitialized(true);
  }, [dispatch, searchParams]);

  // --- Sync Redux with props and update total count ---
  useEffect(() => {
    dispatch(setProducts(items));
    if (items?.length > 0 && totalProduct === 0) {
      setTotalProduct(items.length);
    }
  }, [dispatch, items, totalProduct]);

  // --- URL Management ---
  const updateURL = useCallback(() => {
    if (!isInitialized) return;
    const params = new URLSearchParams();
    if (selectedGender) params.set("gender", selectedGender);
    if (selectedCategories.length > 0)
      params.set("category", selectedCategories[0]);
    if (selectedBrands.length > 0) params.set("brand", selectedBrands[0]);
    if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));
    if (inStock) params.set("inStock", "true");
    if (page > 1) params.set("page", page.toString());

    if (selectedSort === "LOW TO HIGH") params.set("sort", "low");
    else if (selectedSort === "HIGH TO LOW") params.set("sort", "high");
    else if (selectedSort === "NEW ARRIVALS") params.set("sort", "new");

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState({}, "", newUrl);
  }, [
    isInitialized,
    selectedGender,
    selectedCategories,
    selectedBrands,
    selectedSizes,
    inStock,
    page,
    selectedSort,
    pathname,
  ]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // --- Fetch Data on Filter Change ---
  useEffect(() => {
    if (!isInitialized) return;

    const fetchAndSort = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });
        if (inStock) params.append("inStock", "true");
        if (selectedGender) params.append("gender", selectedGender);
        if (selectedSizes.length > 0)
          params.append("sizes", selectedSizes.join(","));
        selectedBrands.forEach((b) => params.append("tag", b));
        selectedCategories.forEach((c) => params.append("tag", c));

        const res = await fetch(`/api/v1/products?${params}`);
        const data = await res.json();

        // Use shared sorting utility
        const sorted = sortProductsByPrice(data.dataList || [], selectedSort);

        dispatch(setProducts(sorted));
        setTotalProduct(data.total || sorted.length);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSort();
  }, [
    dispatch,
    page,
    size,
    selectedBrands,
    selectedCategories,
    selectedSizes,
    selectedGender,
    inStock,
    selectedSort,
    isInitialized,
  ]);

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 pb-20 flex gap-0 bg-surface">
      {/* 1. DESKTOP SIDEBAR - FilterPanel provides its own sticky aside */}
      <ProductsFilter />

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
        {/* Icon-only Toolbar */}
        <div className="relative z-20 bg-surface/90 backdrop-blur-md py-4 flex justify-end items-center gap-2">
          <button
            onClick={() => dispatch(toggleFilter())}
            className="w-10 h-10 flex items-center justify-center bg-surface-2 border border-default rounded-full hover:border-accent text-primary hover:text-accent transition-all"
            aria-label="Open Filters"
          >
            <IoOptionsOutline size={18} />
          </button>

          <SortDropdown
            value={selectedSort}
            onChange={(val) => dispatch(setSelectedSort(val))}
          />
        </div>

        {/* 3. PRODUCT GRID */}
        {isLoading ? (
          <div className="h-[60vh] relative">
            <ComponentLoader />
          </div>
        ) : products.length === 0 ? (
          <div className="pt-20">
            <EmptyState heading="No Products Found" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
            {products.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalProduct > size && (
          <div className="flex justify-center mt-24 border-t border-default pt-12">
            <Pagination
              count={Math.ceil(totalProduct / size)}
              page={page}
              onChange={(v) => {
                dispatch(setPage(v));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
