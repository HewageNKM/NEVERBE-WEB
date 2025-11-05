"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetFilter,
  setInStock,
  setSelectedBrand,
  setSelectedCategories,
  toggleFilter,
} from "@/redux/dealsSlice/dealsSlice";
import axios from "axios";
import { BiReset } from "react-icons/bi";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

const DealsTopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { showFilter, inStock, selectedBrands, selectedCategories } =
    useSelector((state: RootState) => state.dealsSlice);

  const [brands, setBrands] = useState<{ label: string }[]>([]);
  const [categories, setCategories] = useState<{ label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showFilter) fetchDropdowns();
  }, [showFilter]);

  const fetchDropdowns = async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        axios.get(`/api/v1/brands/dropdown`),
        axios.get(`/api/v1/categories/dropdown`),
      ]);
      setBrands(brandsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch {
      toast.error("Failed to load filters");
    } finally {
      setLoading(false);
    }
  };

  const toggleBrand = (value: string) => {
    const lower = value.toLowerCase();
    if (selectedBrands.includes(lower)) {
      dispatch(setSelectedBrand(selectedBrands.filter((b) => b !== lower)));
    } else {
      dispatch(setSelectedBrand([...selectedBrands, lower]));
    }
  };

  const toggleCategory = (value: string) => {
    const lower = value.toLowerCase();
    if (selectedCategories.includes(lower)) {
      dispatch(
        setSelectedCategories(selectedCategories.filter((c) => c !== lower))
      );
    } else {
      dispatch(setSelectedCategories([...selectedCategories, lower]));
    }
  };

  return (
    <AnimatePresence>
      {showFilter && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="w-[90%] sm:w-[400px] bg-white h-full flex flex-col overflow-y-auto rounded-l-2xl shadow-lg"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center bg-white border-b p-4">
              <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(resetFilter())}
                  className="p-2 bg-primary text-white rounded-full"
                >
                  <BiReset size={18} />
                </button>
                <button
                  onClick={() => dispatch(toggleFilter())}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <IoClose size={22} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto">
              {/* In Stock Toggle */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  In Stock
                </span>
                <Switch
                  checked={inStock}
                  onChange={(e) => dispatch(setInStock(e.target.checked))}
                  color="warning"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 border-b pb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {loading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"
                          />
                        ))
                    : categories.map((cat, i) => {
                        const isSelected = selectedCategories.includes(
                          cat.label?.toLowerCase()
                        );
                        return (
                          <button
                            key={i}
                            onClick={() => toggleCategory(cat.label)}
                            className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                              isSelected
                                ? "bg-primary text-white border-primary"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 border-b pb-2">
                  Brands
                </h3>
                <div className="flex flex-wrap gap-2">
                  {loading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"
                          />
                        ))
                    : brands.map((brand, i) => {
                        const isSelected = selectedBrands.includes(
                          brand.label?.toLowerCase()
                        );
                        return (
                          <button
                            key={i}
                            onClick={() => toggleBrand(brand.label)}
                            className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                              isSelected
                                ? "bg-primary text-white border-primary"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                            }`}
                          >
                            {brand.label}
                          </button>
                        );
                      })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DealsTopUpFilter;
