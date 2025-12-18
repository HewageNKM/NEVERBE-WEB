"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilter,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  setInStock,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Switch } from "@mui/material";
import { IoCheckbox, IoSquareOutline } from "react-icons/io5";

// Common shoe sizes
const AVAILABLE_SIZES = [
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
];

const ProductsFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, selectedSizes, inStock } =
    useSelector((state: RootState) => state.productsSlice);

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          fetch(`/api/v1/brands/dropdown`),
          fetch(`/api/v1/categories/dropdown`),
        ]);
        setBrands(await bRes.json());
        setCategories(await cRes.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const toggleBrand = (value: string) => {
    const lowerValue = value.toLowerCase();
    const newBrands = selectedBrands.includes(lowerValue)
      ? selectedBrands.filter((b) => b !== lowerValue)
      : [...selectedBrands, lowerValue];
    dispatch(setSelectedBrand(newBrands.slice(0, 5)));
  };

  const toggleCategory = (value: string) => {
    const lowerValue = value.toLowerCase();
    const newCats = selectedCategories.includes(lowerValue)
      ? selectedCategories.filter((c) => c !== lowerValue)
      : [...selectedCategories, lowerValue];
    dispatch(setSelectedCategories(newCats.slice(0, 5)));
  };

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    dispatch(setSelectedSizes(newSizes));
  };

  const FilterSection = ({ title, items, selectedItems, onToggle }: any) => (
    <div className="py-6 border-t border-gray-100">
      <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item: any, idx: number) => {
          const isSelected = selectedItems.includes(item.label?.toLowerCase());
          return (
            <button
              key={idx}
              onClick={() => onToggle(item.label)}
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
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="hidden lg:block w-64 pr-8 sticky top-24 h-fit max-h-[85vh] overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight">Filters</h2>
        <button
          onClick={() => dispatch(resetFilter())}
          className="text-xs font-bold underline text-gray-400 hover:text-black"
        >
          Clear All
        </button>
      </div>

      {/* In Stock */}
      <div className="flex justify-between items-center pb-6">
        <span className="text-sm font-bold uppercase">In Stock Only</span>
        <Switch
          checked={inStock}
          onChange={(e) => dispatch(setInStock(e.target.checked))}
          color="default"
          size="small"
        />
      </div>

      {/* Sizes */}
      <div className="py-6 border-t border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
          Sizes
        </h3>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`w-10 h-10 border-2 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-black border-black text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-black"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <FilterSection
        title="Categories"
        items={categories}
        selectedItems={selectedCategories}
        onToggle={toggleCategory}
      />

      <FilterSection
        title="Brands"
        items={brands}
        selectedItems={selectedBrands}
        onToggle={toggleBrand}
      />
    </aside>
  );
};

export default ProductsFilter;
