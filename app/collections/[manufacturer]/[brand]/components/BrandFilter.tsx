"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiReset } from "react-icons/bi";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getItemsByTwoField,
  resetFilter,
  setSelectedSizes,
} from "@/redux/brandSlice/brandSlice";
import { wearableSizes } from "@/constants";

const BrandFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedSizes, page, size } = useSelector(
    (state: RootState) => state.brandSlice
  );

  const toggleSize = (value: string) => {
    if (selectedSizes.includes(value)) {
      dispatch(setSelectedSizes(selectedSizes.filter((s) => s !== value)));
    } else {
      dispatch(setSelectedSizes([...selectedSizes, value]));
    }
  };

  useEffect(() => {
    const manufacturer = window.localStorage.getItem("manufacturer");
    const brand = window.localStorage.getItem("brand");
    dispatch(
      getItemsByTwoField({
        value1: manufacturer,
        value2: brand,
        field1: "manufacturer",
        field2: "brand",
        page,
        size,
      })
    );
  }, [selectedSizes, dispatch, page, size]);

  // Motion variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
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
          className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
          title="Reset Filters"
        >
          <BiReset size={22} className="text-white" />
        </motion.button>
      </div>

      {/* Sizes Section */}
      <motion.div className="flex flex-col gap-3" variants={sectionVariants}>
        <h3 className="text-lg font-semibold text-gray-700">Sizes</h3>
        <div className="flex flex-wrap gap-3">
          {wearableSizes.map((size) => (
            <motion.button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                selectedSizes.includes(size)
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-300"
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {size}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default BrandFilter;
