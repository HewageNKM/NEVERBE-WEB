"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import DropShadow from "@/components/DropShadow";
import {
  resetFilter,
  setInStock,
  setSelectedBrands,
  setSelectedSizes,
  toggleFilter,
} from "@/redux/categorySlice/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Switch } from "@mui/material";

// Common shoe sizes
const AVAILABLE_SIZES = [
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
];

const CollectionPopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedSizes, inStock } = useSelector(
    (state: RootState) => state.categorySlice
  );

  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/v1/brands/dropdown");
        const data = await response.json();
        setBrands(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBrands();
  }, []);

  const toggleBrand = (brand: string) => {
    const lower = brand.toLowerCase();
    const newBrands = selectedBrands.includes(lower)
      ? selectedBrands.filter((b) => b !== lower)
      : [...selectedBrands, lower];

    // Limit to 5
    if (newBrands.length <= 5) dispatch(setSelectedBrands(newBrands));
  };

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    dispatch(setSelectedSizes(newSizes));
  };

  return (
    <DropShadow containerStyle="flex justify-end">
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="bg-white w-full md:w-[400px] h-full overflow-y-auto relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Filter
          </h2>
          <button onClick={() => dispatch(toggleFilter())}>
            <IoCloseOutline size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100">
            <span className="font-bold text-lg">In Stock Only</span>
            <Switch
              checked={inStock}
              onChange={(e) => dispatch(setInStock(e.target.checked))}
              color="default"
            />
          </div>

          {/* Sizes */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h3 className="font-bold text-lg mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-12 h-12 border-2 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((item: any, i: number) => {
                const isActive = selectedBrands.includes(
                  item.label?.toLowerCase()
                );
                return (
                  <button
                    key={i}
                    onClick={() => toggleBrand(item.label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-800"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
          <button
            onClick={() => dispatch(resetFilter())}
            className="flex-1 py-3 text-sm font-bold uppercase border border-gray-300 rounded-full hover:bg-white transition"
          >
            Reset
          </button>
          <button
            onClick={() => dispatch(toggleFilter())}
            className="flex-1 py-3 text-sm font-bold uppercase bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Apply
          </button>
        </div>
      </motion.aside>
    </DropShadow>
  );
};

export default CollectionPopUpFilter;
