"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiReset } from "react-icons/bi";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetFilter,
  setInStock,
  setSelectedCategories,
} from "@/redux/brandSlice/brandSlice";
import Switch from "@mui/material/Switch";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Skeleton loading placeholders
const renderSkeletons = (count: number) =>
  Array.from({ length: count }).map((_, i) => (
    <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg" />
  ));

const BrandFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedCategories, inStock } = useSelector(
    (state: RootState) => state.brandSlice
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("/api/v1/categories/dropdown");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      dispatch(
        setSelectedCategories(selectedCategories.filter((c) => c !== category))
      );
    } else {
      if (selectedCategories.length < 5) {
        dispatch(setSelectedCategories([...selectedCategories, category]));
      }
    }
  };

  return (
    <motion.aside
      className="hidden lg:flex flex-col w-72 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-[0_0_20px_rgba(0,0,0,0.05)] sticky top-20 gap-6"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-gray-800">
          Filter
        </h2>
        <motion.button
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          onClick={() => dispatch(resetFilter())}
          className="p-2 rounded-full bg-primary hover:bg-primary transition"
          title="Reset Filters"
        >
          <BiReset size={22} className="text-white" />
        </motion.button>
      </div>

      {/* In Stock Switch */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center"
      >
        <h3 className="text-lg font-semibold text-gray-700">In Stock</h3>
        <Switch
          checked={inStock}
          onChange={(e) => dispatch(setInStock(e.target.checked))}
          color="warning"
        />
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
          <span>Categories</span>
          <span className="text-xs text-gray-400">
            {selectedCategories.length}/5
          </span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {loadingCategories
            ? renderSkeletons(6)
            : categories.map((category, index) => {
                const isSelected = selectedCategories.includes(
                  category.label.toLowerCase()
                );
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCategory(category.label.toLowerCase())}
                    className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {category.label}
                  </motion.button>
                );
              })}
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default BrandFilter;
