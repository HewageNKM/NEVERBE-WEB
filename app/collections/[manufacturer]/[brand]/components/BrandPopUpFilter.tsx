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

  return (
    <DropShadow containerStyle="flex justify-start items-start">
      <motion.section
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-xl shadow-lg rounded-r-2xl p-6 w-[85vw] md:w-[50vw] lg:w-[30vw] h-screen overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-2xl font-display font-bold text-gray-800">Filters</h2>
          <div className="flex gap-3">
            <button
              onClick={() => dispatch(resetFilter())}
              className="bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition"
              title="Reset Filters"
            >
              <BiReset size={20} className="text-white" />
            </button>
            <button
              onClick={() => dispatch(toggleFilter())}
              className="p-2 text-gray-500 hover:text-red-500 transition"
            >
              <IoClose size={28} />
            </button>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Sizes</h3>
          <div className="flex flex-wrap gap-3">
            {wearableSizes.map((size, index) => (
              <button
                key={index}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-lg border font-medium text-sm transition ${
                  selectedSizes.includes(size)
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </motion.section>
    </DropShadow>
  );
};

export default BrandTopUpFilter;
