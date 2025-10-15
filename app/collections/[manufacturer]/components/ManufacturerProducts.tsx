"use client";
import React, { useEffect, useRef, useState } from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import ManufacturerFilter from "@/app/collections/[manufacturer]/components/ManufacturerFilter";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { IoFilter, IoCheckmark } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  getItemsByManufacturer,
  setProducts,
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/manufacturerSlice/manufacturerSlice";
import { sortingOptions } from "@/constants";

const ManufacturerProducts = ({
  items,
  manufacturer,
}: {
  items: any[];
  manufacturer: string;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { products, page, size, selectedSort, isLoading, error } = useSelector(
    (state: RootState) => state.manufacturerSlice
  );
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Initialize localStorage & set products
  useEffect(() => {
    window.localStorage.setItem("manufacturer", manufacturer);
    dispatch(setProducts(items));
  }, [dispatch, items, manufacturer]);

  // Fetch products when page, sort, or size changes
  useEffect(() => {
    dispatch(getItemsByManufacturer({ name: manufacturer, page, size }));
  }, [dispatch, page, size, selectedSort, manufacturer]);

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

  // Framer Motion variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <section className="w-full flex flex-col mb-5 lg:flex-row gap-6 pt-5 lg:justify-between">
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-[22%]">
        <ManufacturerFilter manufacturer={manufacturer} />
      </aside>

      {/* Products Section */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-20 flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
        >
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleFilter())}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiFilter size={20} />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </motion.button>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative" ref={sortRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50 transition"
            >
              <IoFilter size={20} className="text-gray-500" />
              <span className="text-gray-700 font-medium capitalize">
                {selectedSort}
              </span>
            </motion.button>

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
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={() => {
                          dispatch(setSelectedSort(opt.value));
                          setOpenSort(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer transition ${
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
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ComponentLoader />
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState heading="Products Not Available!" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState heading="An error occurred!" subHeading={error} />
            </motion.div>
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4"
            >
              {products.map((item) => (
                <motion.li
                  key={item.itemId}
                  variants={itemVariants}
                  className="group"
                >
                  <ItemCard item={item} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mt-10"
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

export default ManufacturerProducts;
