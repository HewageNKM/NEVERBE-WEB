"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import DealsFilter from "./DealsFilter";
import { FiFilter } from "react-icons/fi";
import { IoFilter, IoCheckmark } from "react-icons/io5";
import {
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/dealsSlice/dealsSlice";
import axios from "axios";
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

  useEffect(() => {
    setProducts(items);
  }, [items, dispatch]);

  useEffect(() => {
    fetchDeals();
  }, [page, size, selectedBrands, selectedCategories, inStock]);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, any> = {
        page,
        size,
        sort: selectedSort,
      };

      const queryParts: string[] = [];

      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParts.push(`${key}=${value}`);
      });

      if (inStock) queryParts.push("inStock=true");

      selectedBrands.forEach((b) => queryParts.push(`tag=${b}`));
      selectedCategories.forEach((c) => queryParts.push(`tag=${c}`));

      const queryString = queryParts.join("&");
      const response = await axios.get(`/api/v1/products/deals?${queryString}`);

      setProducts(response.data.dataList);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    sortProducts();
  }, [selectedSort]);

  const sortProducts = () => {
    if (!products || products.length === 0) return [];
    let sortedProducts = [...products];
    setIsLoading(true);
    switch (selectedSort) {
      case "LOW TO HIGH":
        sortedProducts.sort(
          (a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0)
        );
        break;

      case "HIGH TO LOW":
        sortedProducts.sort(
          (a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0)
        );
        break;

      default:
        sortedProducts = [...products];
        break;
    }
    setProducts(sortedProducts);
    setIsLoading(false);
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="w-full flex flex-col lg:flex-row gap-6 pt-5">
      <aside className="hidden lg:block w-[22%]">
        <DealsFilter />
      </aside>

      <div className="flex-1 relative">
        <motion.div
          className="sticky top-0 z-20 flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="lg:hidden">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiFilter size={20} />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </button>
          </div>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 text-gray-700 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              <IoFilter />
              <span>Sort by: {selectedSort.toUpperCase()}</span>
            </button>

            <AnimatePresence>
              {openSort && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-30 overflow-hidden"
                >
                  {sortingOptions.map((opt, i) => (
                    <motion.li
                      key={i}
                      onClick={() => {
                        dispatch(setSelectedSort(opt.value));
                        setOpenSort(false);
                      }}
                      className={`px-4 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-gray-100 ${
                        selectedSort === opt.value ? "text-primary" : ""
                      }`}
                    >
                      {opt.name}
                      {selectedSort === opt.value && <IoCheckmark />}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {isLoading ? (
          <ComponentLoader />
        ) : products.length === 0 ? (
          <EmptyState heading="No deals available!" />
        ) : (
          <motion.ul
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((item) => (
              <motion.li key={item.id}>
                <ItemCard item={item} />
              </motion.li>
            ))}
          </motion.ul>
        )}

        <div className="flex justify-center mt-10">
          <Pagination
            count={Math.ceil(totalProducts / size)}
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={(e, v) => dispatch(setPage(v))}
          />
        </div>
      </div>
    </section>
  );
};

export default DealsProducts;
