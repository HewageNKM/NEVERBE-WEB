"use client";
import React from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import ToggleSwitch from "@/components/ToggleSwitch";
import DropShadow from "@/components/DropShadow";
import { useFilterData } from "@/hooks/useFilterData";
import { AVAILABLE_SIZES } from "@/constants/filters";

interface PopUpFilterPanelProps {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  inStock: boolean;
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onInStockChange: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
  showCategories?: boolean;
}

const FilterList = ({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: any[];
  selected: string[];
  onToggle: (label: string) => void;
}) => (
  <div className="py-8 border-t border-gray-100">
    <h3 className="text-[18px] font-medium text-[#111] tracking-tight mb-6">
      {title}
    </h3>
    <div className="flex flex-col gap-5">
      {items.map((item, i) => {
        const isActive = selected.includes(item.label?.toLowerCase());
        return (
          <button
            key={i}
            onClick={() => onToggle(item.label)}
            className="flex items-center gap-4 group text-left"
          >
            {/* Minimalist Nike Checkbox */}
            <div
              className={`w-6 h-6 border rounded-[4px] flex items-center justify-center transition-all ${
                isActive ? "bg-black border-black" : "border-gray-300"
              }`}
            >
              {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span
              className={`text-[16px] ${
                isActive ? "text-[#111] font-medium" : "text-[#111]"
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

const PopUpFilterPanel: React.FC<PopUpFilterPanelProps> = ({
  selectedBrands,
  selectedCategories,
  selectedSizes,
  inStock,
  onBrandToggle,
  onCategoryToggle,
  onSizeToggle,
  onInStockChange,
  onReset,
  onClose,
  showCategories = true,
}) => {
  const { brands, categories } = useFilterData(showCategories);

  return (
    <DropShadow variant="light" containerStyle="flex justify-end">
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-[440px] h-full shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER: High-end minimalist */}
        <div className="px-8 py-6 flex justify-between items-center bg-white z-20">
          <h2 className="text-[20px] font-medium text-[#111] tracking-tight">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoCloseOutline size={30} />
          </button>
        </div>

        {/* BODY: Expansive vertical whitespace */}
        <div className="flex-1 overflow-y-auto px-8 no-scrollbar">
          {/* In Stock Utility */}
          <div className="flex justify-between items-center py-8 border-t border-gray-100">
            <span className="text-[16px] font-normal text-[#111]">
              In Stock Only
            </span>
            <ToggleSwitch checked={inStock} onChange={onInStockChange} />
          </div>

          {/* SIZES: 3-Column Nike Grid */}
          <div className="py-8 border-t border-gray-100">
            <h3 className="text-[18px] font-medium text-[#111] tracking-tight mb-6">
              Select Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => onSizeToggle(size)}
                    className={`aspect-square flex items-center justify-center border rounded-[4px] text-[14px] transition-all ${
                      isActive
                        ? "bg-black text-white border-black font-medium"
                        : "bg-white text-[#111] border-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {showCategories && (
            <FilterList
              title="Shop by Category"
              items={categories}
              selected={selectedCategories}
              onToggle={onCategoryToggle}
            />
          )}

          <FilterList
            title="Brands"
            items={brands}
            selected={selectedBrands}
            onToggle={onBrandToggle}
          />

          {/* Bottom spacer for sticky footer padding */}
          <div className="h-10" />
        </div>

        {/* FOOTER ACTIONS: Pill-shaped high-contrast buttons */}
        <div className="p-8 border-t border-gray-100 bg-white flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-4 text-[15px] font-medium border border-gray-200 rounded-full hover:border-black transition-all"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 text-[15px] font-medium bg-black text-white rounded-full hover:opacity-70 transition-all active:scale-[0.98]"
          >
            Apply
          </button>
        </div>
      </motion.aside>
    </DropShadow>
  );
};

export default PopUpFilterPanel;
