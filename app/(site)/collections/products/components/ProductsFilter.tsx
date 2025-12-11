"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { BiReset } from "react-icons/bi";
import {
  resetFilter,
  setSelectedBrand,
  setSelectedCategories,
  setInStock,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
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

const ProductsFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, inStock } = useSelector(
    (state: RootState) => state.productsSlice
  );

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

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
        return;
      }
      dispatch(setSelectedCategories([...selectedCategories, lowerValue]));
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const result = await axios.get(`/api/v1/brands/dropdown`);
      setBrands(result.data);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const result = await axios.get(`/api/v1/categories/dropdown`);
      setCategories(result.data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // --- Helper: Skeleton loader for buttons ---
  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg" />
    ));

  return (
    <LazyMotion features={domAnimation}>
      <m.aside
        className="hidden lg:flex flex-col w-72 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-[0_0_20px_rgba(0,0,0,0.05)] sticky top-20 gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <m.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-display font-bold tracking-wide text-gray-800"
          >
            Filters
          </m.h2>
          <m.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95, rotate: -10 }}
            onClick={() => dispatch(resetFilter())}
            className="p-2 rounded-full bg-primary-100 hover:bg-primary-100 transition"
            title="Reset Filters"
          >
            <BiReset size={20} className="text-white" />
          </m.button>
        </div>

        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* In Stock Switch */}
          <m.div
            variants={itemVariants}
            className="flex justify-between items-center"
          >
            <h3 className="text-lg font-semibold text-gray-700">In Stock</h3>
            <Switch
              checked={inStock}
              onChange={(e) => dispatch(setInStock(e.target.checked))}
              color="warning"
            />
          </m.div>

          {/* Categories */}
          <m.div variants={itemVariants}>
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
                      category.label?.toLowerCase()
                    );
                    return (
                      <m.button
                        key={index}
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
                      </m.button>
                    );
                  })}
            </div>
          </m.div>

          {/* Brands */}
          <m.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
              <span>Brands</span>
              <span className="text-xs text-gray-400">
                {selectedBrands.length}/5
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {loadingBrands
                ? renderSkeletons(6)
                : brands.map((brand, index) => {
                    const isSelected = selectedBrands.includes(
                      brand.label?.toLowerCase()
                    );
                    return (
                      <m.button
                        key={index}
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
                      </m.button>
                    );
                  })}
            </div>
          </m.div>
        </m.div>
      </m.aside>
    </LazyMotion>
  );
};

export default ProductsFilter;
