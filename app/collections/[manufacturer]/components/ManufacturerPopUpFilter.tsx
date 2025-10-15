"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { BiReset } from "react-icons/bi";
import DropShadow from "@/components/DropShadow";
import {
  getItemsByManufacturer,
  resetFilter,
  setSelectedSizes,
  setSelectedType,
  toggleFilter,
} from "@/redux/manufacturerSlice/manufacturerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { productTypes, wearableSizes, accessoriesSizes } from "@/constants";
import { getBrands } from "@/actions/inventoryAction";
import Skeleton from "@/components/Skeleton";

const PopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedSizes, selectedType, selectedManufacturers, page } =
    useSelector((state: RootState) => state.manufacturerSlice);

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSize = (value: string) => {
    if (selectedSizes.includes(value)) {
      dispatch(setSelectedSizes(selectedSizes.filter((s) => s !== value)));
    } else {
      dispatch(setSelectedSizes([...selectedSizes, value]));
    }
  };

  useEffect(() => {
    dispatch(getItemsByManufacturer({ selectedManufacturers, page, selectedSizes }));
  }, [selectedManufacturers, selectedType, selectedSizes, dispatch, page]);

  useEffect(() => {
    getBrands().then((b) => setBrands(b)).finally(() => setLoading(false));
  }, []);

  // Framer Motion variants
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: "-100%", transition: { duration: 0.3, ease: "easeIn" } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <DropShadow containerStyle="flex justify-start items-start">
      <motion.aside
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sidebarVariants}
        className="bg-white/90 backdrop-blur-xl shadow-lg rounded-r-2xl p-6 w-[85vw] md:w-[50vw] h-screen overflow-y-auto relative"
      >
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-2xl font-bold font-display text-gray-800">Filters</h2>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(resetFilter())}
              className="bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition"
              title="Reset Filters"
            >
              <BiReset size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleFilter())}
              className="p-2 text-gray-500 hover:text-red-500 transition"
            >
              <IoClose size={28} />
            </motion.button>
          </div>
        </div>

        {/* Type */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Type</h3>
          <div className="flex flex-wrap gap-3">
            {productTypes.map((type, i) => (
              <motion.button
                key={i}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  dispatch(setSelectedType(type.value));
                  dispatch(setSelectedSizes([]));
                }}
                className={`px-3 py-1 rounded-lg border font-medium ${
                  selectedType === type.value
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {type.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Sizes */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Sizes</h3>
          <div className="flex flex-wrap gap-3">
            {(selectedType === "all" || selectedType === "shoes" || selectedType === "sandals"
              ? wearableSizes
              : accessoriesSizes
            ).map((size, i) => (
              <motion.button
                key={i}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-lg border font-medium ${
                  selectedSizes.includes(size)
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.aside>
    </DropShadow>
  );
};

export default PopUpFilter;
