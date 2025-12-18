"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import ProductsFilter from "./ProductsFilter";
import { IoChevronDownOutline, IoOptionsOutline } from "react-icons/io5";
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
} from "@/redux/productsSlice/productsSlice";
import { sortingOptions } from "@/constants";
import { Product } from "@/interfaces/Product";

const Products = ({ items }: { items: Product[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
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
  } = useSelector((state: RootState) => state.productsSlice);

  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Initialize from URL params on mount ---
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

    // Map URL sort to redux sort
    if (sort === "low") dispatch(setSelectedSort("LOW TO HIGH"));
    else if (sort === "high") dispatch(setSelectedSort("HIGH TO LOW"));
    else if (sort === "new") dispatch(setSelectedSort("NEW ARRIVALS"));

    setIsInitialized(true);
  }, []); // Only run once on mount

  // --- Update URL when filters change ---
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

    // Map redux sort to URL sort
    if (selectedSort === "LOW TO HIGH") params.set("sort", "low");
    else if (selectedSort === "HIGH TO LOW") params.set("sort", "high");
    else if (selectedSort === "NEW ARRIVALS") params.set("sort", "new");

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Update URL without navigation
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

  // --- Initial Set ---
  useEffect(() => {
    dispatch(setProducts(items));
  }, [dispatch, items]);

  // --- Fetch Logic ---
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

        // Add category and brand as tags
        selectedBrands.forEach((b) => params.append("tag", b));
        selectedCategories.forEach((c) => params.append("tag", c));

        const res = await fetch(`/api/v1/products?${params}`);
        const data = await res.json();

        // Client-side Sort
        let sorted = [...(data.dataList || [])];
        if (selectedSort === "LOW TO HIGH")
          sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
        if (selectedSort === "HIGH TO LOW")
          sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);

        dispatch(setProducts(sorted));
        setTotalProduct(data.total || 0);
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

  // Close Sort Dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setOpenSort(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-20 flex gap-12">
      {/* Desktop Sidebar */}
      <ProductsFilter />

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
            Showing {products.length} Results
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

        {/* --- Product Grid --- */}
        {isLoading ? (
          <div className="h-[50vh] relative">
            <ComponentLoader />
          </div>
        ) : products.length === 0 ? (
          <EmptyState heading="No Products Found" />
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
            count={Math.ceil(totalProduct / size)}
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

export default Products;
