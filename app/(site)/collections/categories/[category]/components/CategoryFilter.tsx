"use client";
import React, { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetFilter,
  setInStock,
  setSelectedBrands,
} from "@/redux/categorySlice/categorySlice";
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

const CategoryFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, inStock } = useSelector(
    (state: RootState) => state.categorySlice
  );

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      dispatch(setSelectedBrands(selectedBrands.filter((b) => b !== brand)));
    } else if (selectedBrands.length < 5) {
      dispatch(setSelectedBrands([...selectedBrands, brand]));
    }
  };

  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/brands/dropdown");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBrands(data || []);
    } catch (e) {
      console.error("Error fetching categories:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.aside
      className="hidden lg:flex flex-col w-72 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-[0_0_20px_rgba(0,0,0,0.05)] sticky top-20 gap-6"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-gray-800">
          Filter
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => dispatch(resetFilter())}
          className="p-2 rounded-full bg-primary hover:bg-primary transition"
        >
          <BiReset size={22} className="text-white" />
        </motion.button>
      </div>

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

      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2 flex justify-between items-center">
          <span>Brands</span>
          <span className="text-xs text-gray-400">
            {selectedBrands.length}/5
          </span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"
                />
              ))
            : brands.map((brand, i) => {
                const selected = selectedBrands.includes(
                  brand.label.toLowerCase()
                );
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBrand(brand.label.toLowerCase())}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition ${
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
      </motion.div>
    </motion.aside>
  );
};

export default CategoryFilter;
