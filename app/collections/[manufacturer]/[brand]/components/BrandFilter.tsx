"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiReset } from "react-icons/bi";
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

  return (
    <aside className="hidden lg:flex flex-col w-72 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-[0_0_20px_rgba(0,0,0,0.05)] sticky top-20 gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Filter</h2>
        <button
          onClick={() => dispatch(resetFilter())}
          className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
          title="Reset Filters"
        >
          <BiReset size={22} className="text-white" />
        </button>
      </div>

      {/* Sizes Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-700">Sizes</h3>
        <div className="flex flex-wrap gap-3">
          {wearableSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                selectedSizes.includes(size)
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-300"
              }`}
            >
              Size {size}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BrandFilter;
