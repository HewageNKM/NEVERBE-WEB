"use client";
import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "@/components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import DealsFilter from "./DealsFilter";
import { IoChevronDownOutline, IoOptionsOutline } from "react-icons/io5";
import {
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/dealsSlice/dealsSlice";
import { sortingOptions } from "@/constants";
import { Product } from "@/interfaces/Product";

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
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

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
        let sorted = [...data.dataList];
        if (selectedSort === "LOW TO HIGH")
          sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
        if (selectedSort === "HIGH TO LOW")
          sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setOpenSort(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 pb-20 flex gap-0">
      {/* 1. Sidebar - Borderless Desktop Filter */}
      <aside className="hidden lg:block w-[260px] shrink-0 pt-8 pr-8">
        <DealsFilter />
      </aside>

      <div className="flex-1 w-full">
        {/* 2. Sticky Toolbar: Nike Pro Look */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md py-6 flex justify-between items-center">
          <h2 className="text-[20px] font-medium text-[#111] tracking-tight">
            Special Offers ({totalProducts})
          </h2>

          <div className="flex items-center gap-6">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="lg:hidden flex items-center gap-2 text-[16px] text-[#111]"
            >
              Filters <IoOptionsOutline size={20} />
            </button>

            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setOpenSort(!openSort)}
                className="flex items-center gap-2 text-[16px] text-[#111] hover:text-[#707072] transition-colors"
              >
                Sort By{" "}
                <IoChevronDownOutline
                  size={14}
                  className={`transition-transform ${
                    openSort ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openSort && (
                  <motion.ul
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-4 w-[200px] bg-white border border-[#e5e5e5] shadow-xl z-50 py-4 rounded-none"
                  >
                    {sortingOptions.map((opt, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          dispatch(setSelectedSort(opt.value));
                          setOpenSort(false);
                        }}
                        className={`px-6 py-2 text-[14px] cursor-pointer text-right transition-colors ${
                          selectedSort === opt.value
                            ? "text-[#111] font-medium"
                            : "text-[#707072] hover:text-[#111]"
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
