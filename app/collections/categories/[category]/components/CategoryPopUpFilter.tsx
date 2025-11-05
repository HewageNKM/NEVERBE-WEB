"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiReset } from "react-icons/bi";
import DropShadow from "@/components/DropShadow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetFilter,
  setInStock,
  setSelectedBrands,
  toggleFilter,
} from "@/redux/categorySlice/categorySlice";
import { motion } from "framer-motion";
import Switch from "@mui/material/Switch";
import axios from "axios";

const CategoryPopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, inStock } = useSelector(
    (state: RootState) => state.categorySlice
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrand();
  }, []);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/categories/dropdown");
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBrand = (cat: string) => {
    if (selectedBrands.includes(cat)) {
      dispatch(setSelectedBrands(selectedBrands.filter((c) => c !== cat)));
    } else if (selectedBrands.length < 5) {
      dispatch(setSelectedBrands([...selectedBrands, cat]));
    }
  };

  return (
    <DropShadow containerStyle="flex justify-start items-start">
      <motion.section
        className="bg-white/90 backdrop-blur-xl shadow-lg rounded-r-2xl p-6 w-[85vw] md:w-[50vw] lg:w-[30vw] h-screen overflow-y-auto relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-2xl font-display font-bold text-gray-800">Filters</h2>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(resetFilter())}
              className="bg-primary p-2 rounded-full"
            >
              <BiReset size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleFilter())}
              className="p-2 text-gray-500 hover:text-red-500 transition"
            >
              <IoClose size={28} />
            </motion.button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">In Stock</h3>
            <Switch
              checked={inStock}
              onChange={(e) => dispatch(setInStock(e.target.checked))}
              color="warning"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
              <span>Brands</span>
              <span className="text-xs text-gray-400">{selectedBrands.length}/5</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"
                    />
                  ))
                : categories.map((brand, i) => {
                    const selected = selectedBrands.includes(brand.label.toLowerCase());
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleBrand(brand.label.toLowerCase())}
                        className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                          selected
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {brand.label}
                      </motion.button>
                    );
                  })}
            </div>
          </div>
        </div>
      </motion.section>
    </DropShadow>
  );
};

export default CategoryPopUpFilter;
