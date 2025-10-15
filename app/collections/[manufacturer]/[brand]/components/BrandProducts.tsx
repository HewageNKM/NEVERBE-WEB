"use client";
import React, { useEffect, useRef, useState } from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import BrandFilter from "@/app/collections/[manufacturer]/[brand]/components/BrandFilter";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { IoFilter, IoCheckmark } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import {
  getItemsByTwoField,
  setProducts,
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/brandSlice/brandSlice";
import { sortingOptions } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";

const BrandProducts = ({
  items,
  manufacturer,
  brand,
}: {
  items: any[];
  manufacturer: string;
  brand: string;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { products, page, size, selectedSort, isLoading, error } = useSelector(
    (state: RootState) => state.brandSlice
  );
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Initialize localStorage & set products
  useEffect(() => {
    window.localStorage.setItem("manufacturer", manufacturer);
    window.localStorage.setItem("brand", brand);
    dispatch(setProducts(items));
  }, [dispatch, items, manufacturer, brand]);

  // Fetch products when page, sort, or size changes
  useEffect(() => {
    dispatch(
      getItemsByTwoField({
        value1: manufacturer,
        value2: brand,
        field1: "manufacturer",
        field2: "brand",
        page,
        size,
      })
    );
  }, [dispatch, page, size, selectedSort, manufacturer, brand]);

  // Close sorting dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Motion variants
  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <section className="w-full flex flex-col lg:flex-row gap-6 pt-5 p-2 lg:justify-between">
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-[22%]">
        <BrandFilter />
      </aside>

      {/* Products Section */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="sticky top-0 z-20 flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
          {/* Mobile Filter Button */}
          <motion.div whileTap={{ scale: 0.95 }} className="lg:hidden">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiFilter size={20} />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </button>
          </motion.div>

          {/* Sorting Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50 transition"
            >
              <IoFilter size={20} className="text-gray-500" />
              <span className="text-gray-700 font-medium capitalize">
                {selectedSort}
              </span>
            </button>

            <AnimatePresence>
              {openSort && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50"
                >
                  {sortingOptions.map((opt) => {
                    const isSelected = selectedSort === opt.value;
                    return (
                      <motion.li
                        key={opt.value}
                        onClick={() => {
                          dispatch(setSelectedSort(opt.value));
                          setOpenSort(false);
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 transition ${
                          isSelected ? "bg-blue-100 font-semibold" : ""
                        }`}
                      >
                        <span>{opt.name}</span>
                        <IoCheckmark
                          className={
                            isSelected ? "text-blue-600" : "text-gray-300"
                          }
                          size={18}
                        />
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ComponentLoader />
        ) : products.length === 0 ? (
          <EmptyState heading="Products Not Available!" />
        ) : error ? (
          <EmptyState heading="An error occurred!" subHeading={error} />
        ) : (
          <motion.ul
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((item) => (
              <motion.li
                key={item.itemId}
                className="group"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ItemCard item={item} />
              </motion.li>
            ))}
          </motion.ul>
        )}

        <motion.div
          className="flex justify-center mt-10"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Pagination
            count={5}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => dispatch(setPage(value))}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BrandProducts;
