"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { BiReset } from "react-icons/bi";
import DropShadow from "@/components/DropShadow";
import {
  resetFilter,
  setInStock,
  setSelectedBrand,
  setSelectedCategories,
  toggleFilter,
} from "@/redux/productsSlice/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { toast } from "react-toastify";
import { Switch } from "@mui/material";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.3 },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

const renderSkeletons = (count: number) =>
  Array.from({ length: count }).map((_, i) => (
    <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg" />
  ));

const PopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, inStock } = useSelector(
    (state: RootState) => state.productsSlice
  );

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // --- Toggle Brand ---
  const toggleBrand = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (selectedBrands.includes(lowerValue)) {
      dispatch(
        setSelectedBrand(selectedBrands.filter((b) => b !== lowerValue))
      );
    } else {
      if (selectedBrands.length >= 5) {
        toast.warn("You can select up to 5 brands only.");
        return;
      }
      dispatch(setSelectedBrand([...selectedBrands, lowerValue]));
    }
  };

  // --- Toggle Category ---
  const toggleCategory = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (selectedCategories.includes(lowerValue)) {
      dispatch(
        setSelectedCategories(
          selectedCategories.filter((c) => c !== lowerValue)
        )
      );
    } else {
      if (selectedCategories.length >= 5) {
        toast.warn("You can select up to 5 categories only.");
        return;
      }
      dispatch(setSelectedCategories([...selectedCategories, lowerValue]));
    }
  };

  // --- Fetch Data ---
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const result = await axios.get(`/api/v1/brands/dropdown`);
      setBrands(result.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch brands");
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const result = await axios.get(`/api/v1/categories/dropdown`);
      setCategories(result.data || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  return (
    <DropShadow containerStyle="flex justify-start items-start">
      <motion.aside
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white backdrop-blur-xl shadow-xl rounded-r-2xl p-6 w-[85vw] md:w-[50vw] h-screen overflow-y-auto relative"
      >
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center border-b pb-3 mb-5"
        >
          <h2 className="text-2xl font-display font-bold text-gray-800">
            Filters
          </h2>

          <div className="flex gap-3">
            {/* Reset Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(resetFilter())}
              className="bg-primary p-2 rounded-full hover:bg-primary/90 transition"
              title="Reset Filters"
            >
              <BiReset size={20} className="text-white" />
            </motion.button>

            {/* Close Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleFilter())}
              className="p-2 text-gray-500 hover:text-red-500 transition"
              title="Close Filter"
            >
              <IoClose size={28} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex mb-6 flex-col gap-8"
        >
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
        </motion.div>

        {/* --- Categories --- */}
        <motion.div
          variants={sectionVariants}
          custom={0}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
            <span>Categories</span>
            <span className="text-xs text-gray-400">
              {selectedCategories.length}/5
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {loadingCategories
              ? renderSkeletons(6)
              : categories.map((category, i) => {
                  const isSelected = selectedCategories.includes(
                    category.label?.toLowerCase()
                  );
                  return (
                    <motion.button
                      key={i}
                      variants={buttonVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(category.label)}
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

        {/* --- Brands --- */}
        <motion.div
          variants={sectionVariants}
          custom={1}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
            <span>Brands</span>
            <span className="text-xs text-gray-400">
              {selectedBrands.length}/5
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {loadingBrands
              ? renderSkeletons(6)
              : brands.map((brand, i) => {
                  const isSelected = selectedBrands.includes(
                    brand.label?.toLowerCase()
                  );
                  return (
                    <motion.button
                      key={i}
                      variants={buttonVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleBrand(brand.label)}
                      className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {brand.label}
                    </motion.button>
                  );
                })}
          </div>
        </motion.div>
      </motion.aside>
    </DropShadow>
  );
};

export default PopUpFilter;
