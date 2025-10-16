"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { BiReset } from "react-icons/bi";
import DropShadow from "@/components/DropShadow";
import {
  getInventory,
  resetFilter,
  setSelectedManufacturers,
  setSelectedSizes,
  setSelectedType,
  toggleFilter,
} from "@/redux/productsSlice/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { productTypes, wearableSizes, accessoriesSizes } from "@/constants";
import { getBrands } from "@/actions/inventoryAction";
import Skeleton from "@/components/Skeleton";

const PopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedSizes, selectedType, selectedManufacturers, page } = useSelector(
    (state: RootState) => state.productsSlice
  );

  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleBrand = (value: string) => {
    if (selectedManufacturers.includes(value)) {
      dispatch(setSelectedManufacturers(selectedManufacturers.filter((b) => b !== value)));
    } else {
      dispatch(setSelectedManufacturers([...selectedManufacturers, value]));
    }
  };

  const toggleSize = (value: string) => {
    if (selectedSizes.includes(value)) {
      dispatch(setSelectedSizes(selectedSizes.filter((s) => s !== value)));
    } else {
      dispatch(setSelectedSizes([...selectedSizes, value]));
    }
  };

  // Fetch products on filter change
  useEffect(() => {
    const gender = window.localStorage.getItem("gender") || "all";
    dispatch(getInventory({ gender, page }));
  }, [selectedManufacturers, selectedType, selectedSizes, dispatch]);

  // Fetch brands
  useEffect(() => {
    getBrands()
      .then((b) => setBrands(b))
      .finally(() => setLoading(false));
  }, []);

  // --- Motion Variants ---
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.3 },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <DropShadow containerStyle="flex justify-start items-start">
      <AnimatePresence>
        <motion.aside
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-xl shadow-xl rounded-r-2xl p-6 w-[85vw] md:w-[50vw] h-screen overflow-y-auto relative"
        >
          {/* --- Header --- */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center border-b pb-3 mb-5"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800">Filters</h2>
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(resetFilter())}
                className="bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition"
                title="Reset Filters"
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
          </motion.div>

          {/* --- Filter Sections --- */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {/* --- Type --- */}
            <motion.div variants={sectionVariants} custom={0} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Type</h3>
              <div className="flex flex-wrap gap-3">
                {productTypes.map((type, i) => (
                  <motion.button
                    key={i}
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      dispatch(setSelectedType(type.value));
                      dispatch(setSelectedSizes([]));
                    }}
                    className={`px-3 py-1 rounded-lg border font-medium transition-all duration-200 ${
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

            {/* --- Brands --- */}
            <motion.div variants={sectionVariants} custom={1} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Brands</h3>
              <div className="flex flex-wrap gap-3">
                {loading ? (
                  <Skeleton />
                ) : (
                  brands.map((brand, i) => (
                    <motion.button
                      key={i}
                      variants={buttonVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleBrand(brand?.value)}
                      className={`px-3 py-1 rounded-lg border font-medium transition-all duration-200 ${
                        selectedManufacturers.includes(brand?.value)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {brand?.name}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>

            {/* --- Sizes --- */}
            <motion.div variants={sectionVariants} custom={2}>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Sizes</h3>
              <div className="flex flex-wrap gap-3">
                {(selectedType === "all" ||
                selectedType === "shoes" ||
                selectedType === "sandals"
                  ? wearableSizes
                  : accessoriesSizes
                ).map((size, i) => (
                  <motion.button
                    key={i}
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded-lg border font-medium transition-all duration-200 ${
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
          </motion.div>
        </motion.aside>
      </AnimatePresence>
    </DropShadow>
  );
};

export default PopUpFilter;
