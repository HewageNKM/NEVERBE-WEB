"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const { selectedSizes, selectedType, selectedManufacturers, page } =
    useSelector((state: RootState) => state.productsSlice);

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleBrand = (value: string) => {
    if (selectedManufacturers.includes(value)) {
      dispatch(
        setSelectedManufacturers(selectedManufacturers.filter((b) => b !== value))
      );
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

  useEffect(() => {
    const gender = window.localStorage.getItem("gender") || "all";
    dispatch(getInventory({ gender, page }));
  }, [selectedManufacturers, selectedType, selectedSizes, dispatch]);

  useEffect(() => {
    getBrands().then((b) => setBrands(b)).finally(() => setLoading(false));
  }, []);

  return (
    <DropShadow containerStyle="flex justify-start items-start">
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-xl shadow-lg rounded-r-2xl p-6 w-[85vw] md:w-[50vw] h-screen overflow-y-auto relative"
      >
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-2xl font-bold font-display text-gray-800">Filters</h2>
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

        {/* Type */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Type</h3>
          <div className="flex flex-wrap gap-3">
            {productTypes.map((type, i) => (
              <button
                key={i}
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
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Brands</h3>
          <div className="flex flex-wrap gap-3">
            {loading ? (
              <Skeleton />
            ) : (
              brands.map((brand, i) => (
                <button
                  key={i}
                  onClick={() => toggleBrand(brand.value)}
                  className={`px-3 py-1 rounded-lg border font-medium ${
                    selectedManufacturers.includes(brand.value)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  {brand.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Sizes</h3>
          <div className="flex flex-wrap gap-3">
            {(selectedType === "all" || selectedType === "shoes" || selectedType === "sandals"
              ? wearableSizes
              : accessoriesSizes
            ).map((size, i) => (
              <button
                key={i}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-lg border font-medium ${
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
      </motion.aside>
    </DropShadow>
  );
};

export default PopUpFilter;
