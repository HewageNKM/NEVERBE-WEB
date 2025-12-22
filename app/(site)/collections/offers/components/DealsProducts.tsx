"use client";
import React, { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import DealsFilter from "./DealsFilter";
import { IoOptionsOutline } from "react-icons/io5";
import {
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/dealsSlice/dealsSlice";
import { Product } from "@/interfaces/Product";
import { sortProductsByPrice } from "@/utils/formatting";
import SortDropdown from "@/components/SortDropdown";

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
  } = useSelector((state: RootState) => state.dealsSlice);

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(items);
  const [totalProducts, setTotalProducts] = useState(items.length);

  // Fetch Logic (preserved, visual updates only)
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
      {/* 1. Sidebar - Borderless Desktop Filter */}
      <aside className="hidden lg:block w-[260px] shrink-0 pt-8 pr-8">
        <DealsFilter />
      </aside>

      <div className="flex-1 w-full">
        {/* 2. Sticky Toolbar: Nike Pro Look */}
        <div className="bg-white/90 backdrop-blur-md py-6 flex justify-between items-center">
          <h2 className="text-[20px] font-medium text-[#111] tracking-tight">
            Special Offers ({totalProducts})
          </h2>

          <div className="flex items-center gap-6">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="lg:hidden flex items-center gap-2 text-[16px] text-[#111]"
              aria-label="Open Filters"
            >
              <IoOptionsOutline size={22} />
            </button>

            <SortDropdown
              value={selectedSort}
              onChange={(val) => dispatch(setSelectedSort(val))}
            />
          </div>
        </div>

        {/* 3. Product Grid: Borderless & Breathable */}
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

        {/* 4. Nike Style Pagination Wrapper */}
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
