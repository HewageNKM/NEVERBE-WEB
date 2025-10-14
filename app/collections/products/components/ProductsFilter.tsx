"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BiReset } from "react-icons/bi";
import {
  getInventory,
  resetFilter,
  setSelectedManufacturers,
  setSelectedSizes,
  setSelectedType,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { accessoriesSizes, productTypes, wearableSizes } from "@/constants";
import { getBrands } from "@/actions/inventoryAction";

const ProductsFilter = ({ gender }: { gender: string }) => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedSizes, selectedType, selectedManufacturers, page, size } =
    useSelector((state: RootState) => state.productsSlice);

  const [brands, setBrands] = useState([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState(true);

  const toggleBrand = (value: string) => {
    if (selectedManufacturers.includes(value)) {
      dispatch(
        setSelectedManufacturers(
          selectedManufacturers.filter((b) => b !== value)
        )
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

  const fetchBrands = async () => {
    try {
      const result = await getBrands();
      setBrands(result);
    } finally {
      setIsBrandsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getInventory({ gender, page, size }));
  }, [selectedManufacturers, selectedType, selectedSizes, dispatch]);

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <aside className="hidden lg:block w-[22vw] bg-white/80 backdrop-blur-sm border-r border-gray-200 p-6 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide text-gray-800">
          Filters
        </h2>
        <button
          onClick={() => dispatch(resetFilter())}
          className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
          title="Reset Filters"
        >
          <BiReset size={20} className="text-white" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-8"
      >
        {/* TYPE */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2">
            Type
          </h3>
          <div className="flex flex-wrap gap-3">
            {productTypes.map((type, index) => (
              <label
                key={index}
                className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-1 border ${
                  selectedType === type.value
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                } transition`}
              >
                <input
                  checked={selectedType === type.value}
                  onChange={() => {
                    dispatch(setSelectedType(type.value));
                    dispatch(setSelectedSizes([]));
                  }}
                  type="radio"
                  className="hidden"
                />
                <span className="capitalize text-sm font-medium">
                  {type.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* BRANDS */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2">
            Brands
          </h3>
          <div className="flex flex-wrap gap-3">
              {brands.map((brand, index) => (
                <label
                  key={index}
                  className={`px-3 py-1.5 rounded-lg border cursor-pointer ${
                    selectedManufacturers.includes(brand.value)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                  } transition`}
                  onClick={() => toggleBrand(brand.value)}
                >
                  {brand.name}
                </label>
              ))}
          </div>
        </div>

        {/* SIZES */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2">
            Sizes
          </h3>
          <div className="flex flex-wrap gap-3">
            {(selectedType === "all" || selectedType === "shoes" || selectedType === "sandals"
              ? wearableSizes
              : accessoriesSizes
            ).map((size, index) => (
              <button
                key={index}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-lg border font-medium ${
                  selectedSizes.includes(size)
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                } transition`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

export default ProductsFilter;
