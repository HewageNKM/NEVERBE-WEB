"use client";
import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
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
    inStock,
    selectedSort,
  } = useSelector((state: RootState) => state.dealsSlice);

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Initial Load
  useEffect(() => {
    setProducts(items);
  }, [items]);

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

        const res = await fetch(`/api/v1/products/deals?${params}`);
        const data = await res.json();

        // Client Sort fallback if needed
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
  }, [page, size, selectedBrands, selectedCategories, inStock, selectedSort]);

  // Outside Click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setOpenSort(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="w-full flex gap-12">
      {/* Sidebar Filter */}
      <DealsFilter />

      <div className="flex-1 w-full">
        {/* --- Toolbar --- */}
        <div className="sticky top-[60px] md:top-20 z-30 bg-white/95 backdrop-blur-md py-4 mb-6 border-b border-gray-100 flex justify-between items-center">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => dispatch(toggleFilter())}
            className="lg:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-wide border border-gray-300 rounded-full px-4 py-2 hover:border-black transition-colors"
          >
            <IoOptionsOutline size={18} /> Filters
          </button>

          <p className="hidden lg:block text-gray-400 text-sm font-medium">
            {totalProducts} Items Found
          </p>

          {/* Sort Dropdown */}
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
        ) : products.length === 0 ? (
          <EmptyState heading="No deals found" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {products.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* --- Pagination --- */}
        <div className="flex justify-center mt-16">
          <Pagination
            count={Math.ceil(totalProducts / size)}
            page={page}
            shape="rounded"
            size="large"
            onChange={(e, v) => dispatch(setPage(v))}
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: "var(--font-display)",
                fontWeight: "bold",
                "&.Mui-selected": { backgroundColor: "black", color: "white" },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default DealsProducts;
