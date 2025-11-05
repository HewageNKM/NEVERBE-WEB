"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { BiReset } from "react-icons/bi";
import DropShadow from "@/components/DropShadow";
import {
  resetFilter,
  setInStock,
  setSelectedCategories,
  toggleFilter,
} from "@/redux/brandSlice/brandSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
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

const renderSkeletons = (count: number) =>
  Array.from({ length: count }).map((_, i) => (
    <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg" />
  ));

const BrandTopUpFilter = () => {
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
      const result = await axios.get("/api/v1/categories/dropdown");
      setCategories(result.data || []);
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
    <DropShadow containerStyle="flex justify-start items-start">
      <motion.section
        className="bg-white/90 backdrop-blur-xl shadow-lg rounded-r-2xl p-6 w-[85vw] md:w-[50vw] lg:w-[30vw] h-screen overflow-y-auto relative"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sectionVariants}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-2xl font-display font-bold text-gray-800">
            Filters
          </h2>
          <div className="flex gap-3">
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => dispatch(resetFilter())}
              className="bg-primary p-2 rounded-full hover:bg-primary transition"
              title="Reset Filters"
            >
              <BiReset size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => dispatch(toggleFilter())}
              className="p-2 text-gray-500 hover:text-red-500 transition"
            >
              <IoClose size={28} />
            </motion.button>
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
                          onClick={() =>
                            toggleCategory(category.label.toLowerCase())
                          }
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
          </div>
        </div>
      </motion.section>
    </DropShadow>
  );
};

export default BrandTopUpFilter;
