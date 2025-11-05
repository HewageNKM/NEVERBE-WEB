"use client";
import React, { useEffect, useRef, useState } from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import CategoryFilter from "./CategoryFilter";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FiFilter } from "react-icons/fi";
import { IoFilter, IoCheckmark } from "react-icons/io5";
import {
  setProducts,
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/categorySlice/categorySlice";
import { sortingOptions } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/interfaces/Product";

const CategoryProducts = ({
  items,
  category,
}: {
  items: Product[];
  category: string;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { products, page, size, selectedSort, inStock, selectedBrands } =
    useSelector((state: RootState) => state.categorySlice);
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    dispatch(setProducts(items));
  }, [dispatch, items]);

  useEffect(() => {
    fetchProducts();
  }, [page, size, selectedBrands, inStock]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
      });
      if (inStock) params.append("inStock", "true");
      selectedBrands.forEach((t) => params.append("tag", t));

      const res = await fetch(
        `/api/v1/products/categories/${category}?${params}`
      );
      const data = await res.json();
      dispatch(setProducts(data.dataList));
      setTotalProducts(data.total);
    } catch (err) {
      console.error("Error fetching category products:", err);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setOpenSort(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full flex flex-col lg:flex-row gap-6 pt-5 p-2 lg:justify-between">
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-[22%]">
        <CategoryFilter />
      </aside>

      {/* Products */}
      <div className="flex-1 relative">
        <div className="sticky top-0 z-20 flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
          <motion.div whileTap={{ scale: 0.95 }} className="lg:hidden">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiFilter size={20} />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </button>
          </motion.div>

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
        </div>

        {isLoading ? (
          <ComponentLoader />
        ) : products?.length ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {products?.map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </motion.div>
        ) : (
          <EmptyState message="No products found." />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mt-10"
        >
          <Pagination
            variant="outlined"
            shape="rounded"
            page={page}
            count={Math.ceil(totalProducts / size)}
            onChange={(event, value) => dispatch(setPage(value))}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryProducts;
