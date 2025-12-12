"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetFilter,
  setInStock,
  setSelectedBrands,
} from "@/redux/categorySlice/categorySlice";
import Switch from "@mui/material/Switch";
import { IoCheckbox, IoSquareOutline } from "react-icons/io5";

const CollectionFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, inStock } = useSelector(
    (state: RootState) => state.categorySlice
  );

  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/v1/brands/dropdown");
        const data = await response.json();
        setBrands(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBrands();
  }, []);

  const toggleBrand = (brand: string) => {
    const lower = brand.toLowerCase();
    const newBrands = selectedBrands.includes(lower)
      ? selectedBrands.filter((b) => b !== lower)
      : [...selectedBrands, lower];

    // Limit to 5
    if (newBrands.length <= 5) dispatch(setSelectedBrands(newBrands));
  };

  return (
    <aside className="hidden lg:block w-64 pr-8 sticky top-24 h-fit max-h-[85vh] overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight">Refine</h2>
        <button
          onClick={() => dispatch(resetFilter())}
          className="text-xs font-bold underline text-gray-400 hover:text-black"
        >
          Clear
        </button>
      </div>

      {/* In Stock */}
      <div className="flex justify-between items-center pb-6 border-b border-gray-100">
        <span className="text-sm font-bold uppercase">In Stock Only</span>
        <Switch
          checked={inStock}
          onChange={(e) => dispatch(setInStock(e.target.checked))}
          color="default"
          size="small"
        />
      </div>

      {/* Brands List */}
      <div className="py-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
          Brands
        </h3>
        <div className="flex flex-col gap-2">
          {brands.map((brand, i) => {
            const isSelected = selectedBrands.includes(
              brand.label.toLowerCase()
            );
            return (
              <button
                key={i}
                onClick={() => toggleBrand(brand.label)}
                className="flex items-center gap-3 group text-left"
              >
                <div
                  className={`text-lg transition-colors ${
                    isSelected
                      ? "text-black"
                      : "text-gray-300 group-hover:text-gray-400"
                  }`}
                >
                  {isSelected ? <IoCheckbox /> : <IoSquareOutline />}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isSelected
                      ? "text-black"
                      : "text-gray-500 group-hover:text-black"
                  }`}
                >
                  {brand.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default CollectionFilter;
