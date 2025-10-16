"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { BiReset } from "react-icons/bi";
import DropShadow from "@/components/DropShadow";
import {
  getItemsByTwoField,
  resetFilter,
  setSelectedSizes,
  toggleFilter,
} from "@/redux/brandSlice/brandSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { wearableSizes } from "@/constants";

const BrandTopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedSizes, page, size } = useSelector(
    (state: RootState) => state.brandSlice
  );

  const [manufacturer, setManufacturer] = useState("");
  const [brand, setBrand] = useState("");

  const toggleSize = (value: string) => {
    if (selectedSizes.includes(value)) {
      dispatch(setSelectedSizes(selectedSizes.filter((s) => s !== value)));
    } else {
      dispatch(setSelectedSizes([...selectedSizes, value]));
    }
  };

  useEffect(() => {
    setManufacturer(window.localStorage.getItem("manufacturer") || "");
    setBrand(window.localStorage.getItem("brand") || "");
  }, []);

  useEffect(() => {
    if (manufacturer && brand) {
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
    }
  }, [selectedSizes, dispatch, manufacturer, brand, page, size]);

  // Motion variants
  const sectionVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
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
          <h2 className="text-2xl font-display font-bold text-gray-800">Filters</h2>
          <div className="flex gap-3">
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => dispatch(resetFilter())}
              className="bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition"
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
          </div>
        </div>

        {/* Sizes */}
        <motion.div
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Sizes</h3>
          <div className="flex flex-wrap gap-3">
            {wearableSizes.map((size, index) => (
              <motion.button
                key={index}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-lg border font-medium text-sm transition ${
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
      </motion.section>
    </DropShadow>
  );
};

export default BrandTopUpFilter;
