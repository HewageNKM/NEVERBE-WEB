"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BiReset } from "react-icons/bi";
import {
  resetFilter,
  setSelectedBrand,
  setSelectedCategories,
  setInStock,
} from "@/redux/dealsSlice/dealsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const DealsFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, inStock } = useSelector(
    (state: RootState) => state.dealsSlice
  );

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        axios.get(`/api/v1/brands/dropdown`),
        axios.get(`/api/v1/categories/dropdown`),
      ]);
      setBrands(brandsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch {
      toast.error("Failed to fetch filter data");
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
    <motion.aside
      className="hidden lg:flex flex-col w-72 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm sticky top-20 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={() => dispatch(resetFilter())}
          className="p-2 bg-primary rounded-full text-white"
        >
          <BiReset size={18} />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-700">In Stock</span>
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
                  <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg" />
                ))
            : categories.map((cat, i) => {
                const isSelected = selectedCategories.includes(
                  cat.label?.toLowerCase()
                );
                return (
                  <button
                    key={i}
                    onClick={() => toggleCategory(cat.label)}
                    className={`px-3 py-1 rounded-lg border font-medium transition ${
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
                  <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg" />
                ))
            : brands.map((brand, i) => {
                const isSelected = selectedBrands.includes(
                  brand.label?.toLowerCase()
                );
                return (
                  <button
                    key={i}
                    onClick={() => toggleBrand(brand.label)}
                    className={`px-3 py-1 rounded-lg border font-medium transition ${
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
    </motion.aside>
  );
};

export default DealsFilter;
