"use client";
import React from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import ToggleSwitch from "@/components/ToggleSwitch";
import DropShadow from "@/components/DropShadow";
import { useFilterData } from "@/hooks/useFilterData";
import { AVAILABLE_SIZES } from "@/constants/filters";

interface PopUpFilterPanelProps {
  // Current filter state
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  inStock: boolean;
  // Callbacks
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onInStockChange: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
  // Options
  showCategories?: boolean;
}

const FilterGroup = ({
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
  <div className="mb-8">
    <h3 className="font-bold text-lg mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => {
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
          <button onClick={onClose}>
            <IoCloseOutline size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100">
            <span className="font-bold text-lg">In Stock Only</span>
            <ToggleSwitch checked={inStock} onChange={onInStockChange} />
          </div>

          {/* Sizes */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h3 className="font-bold text-lg mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => onSizeToggle(size)}
                    className={`w-12 h-12 border-2 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {showCategories && (
            <FilterGroup
              title="Categories"
              items={categories}
              selected={selectedCategories}
              onToggle={onCategoryToggle}
            />
          )}

          <FilterGroup
            title="Brands"
            items={brands}
            selected={selectedBrands}
            onToggle={onBrandToggle}
          />
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
          <button
            onClick={onReset}
            className="flex-1 py-3 text-sm font-bold uppercase border border-gray-300 rounded-full hover:bg-white transition"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold uppercase bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Apply
          </button>
        </div>
      </motion.aside>
    </DropShadow>
  );
};

export default PopUpFilterPanel;
