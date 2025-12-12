"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import DropShadow from "@/components/DropShadow";
import {
  resetFilter,
  setInStock,
  setSelectedBrand,
  setSelectedCategories,
  toggleFilter,
} from "@/redux/productsSlice/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Switch } from "@mui/material";

const PopUpFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, inStock } = useSelector(
    (state: RootState) => state.productsSlice
  );

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch logic same as desktop
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

  const toggleSelection = (list: string[], item: string, action: any) => {
    const lower = item.toLowerCase();
    const newList = list.includes(lower)
      ? list.filter((i) => i !== lower)
      : [...list, lower];
    dispatch(action(newList.slice(0, 5)));
  };

  const FilterGroup = ({ title, items, selected, onToggle }: any) => (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item: any, i: number) => {
          const isActive = selected.includes(item.label?.toLowerCase());
          return (
            <button
              key={i}
              onClick={() => onToggle(item.label)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-800"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <DropShadow containerStyle="flex justify-end">
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="bg-white w-full md:w-[400px] h-full overflow-y-auto relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Filter
          </h2>
          <button onClick={() => dispatch(toggleFilter())}>
            <IoCloseOutline size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100">
            <span className="font-bold text-lg">In Stock Only</span>
            <Switch
              checked={inStock}
              onChange={(e) => dispatch(setInStock(e.target.checked))}
              color="default"
            />
          </div>

          <FilterGroup
            title="Categories"
            items={categories}
            selected={selectedCategories}
            onToggle={(val: string) =>
              toggleSelection(selectedCategories, val, setSelectedCategories)
            }
          />

          <FilterGroup
            title="Brands"
            items={brands}
            selected={selectedBrands}
            onToggle={(val: string) =>
              toggleSelection(selectedBrands, val, setSelectedBrand)
            }
          />
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
          <button
            onClick={() => dispatch(resetFilter())}
            className="flex-1 py-3 text-sm font-bold uppercase border border-gray-300 rounded-full hover:bg-white transition"
          >
            Reset
          </button>
          <button
            onClick={() => dispatch(toggleFilter())}
            className="flex-1 py-3 text-sm font-bold uppercase bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Apply
          </button>
        </div>
      </motion.aside>
    </DropShadow>
  );
};

export default PopUpFilter;
