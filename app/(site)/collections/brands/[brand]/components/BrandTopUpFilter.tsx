"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import DropShadow from "@/components/DropShadow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetFilter,
  setInStock,
  setSelectedCategories,
  toggleFilter,
} from "@/redux/brandSlice/brandSlice";
import Switch from "@mui/material/Switch";

const BrandTopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedCategories, inStock } = useSelector(
    (state: RootState) => state.brandSlice
  );
  const [categories, setCategories] = useState<{ label: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories/dropdown");
        setCategories(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (cat: string) => {
    const lower = cat.toLowerCase();
    const newCats = selectedCategories.includes(lower)
      ? selectedCategories.filter((c) => c !== lower)
      : [...selectedCategories, lower];
    if (newCats.length <= 5) dispatch(setSelectedCategories(newCats));
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
            Refine Results
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

          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c, i) => {
                const isActive = selectedCategories.includes(
                  c.label.toLowerCase()
                );
                return (
                  <button
                    key={i}
                    onClick={() => toggleCategory(c.label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-800"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
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

export default BrandTopUpFilter;
