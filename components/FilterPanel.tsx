"use client";
import React from "react";
import ToggleSwitch from "@/components/ToggleSwitch";
import { IoCheckbox, IoSquareOutline } from "react-icons/io5";
import { useFilterData } from "@/hooks/useFilterData";
import { AVAILABLE_SIZES } from "@/constants/filters";

interface FilterPanelProps {
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
  // Options
  showCategories?: boolean;
  title?: string;
}

const FilterSection = ({
  title,
  items,
  selectedItems,
  onToggle,
}: {
  title: string;
  items: any[];
  selectedItems: string[];
  onToggle: (label: string) => void;
}) => (
  <div className="py-6 border-t border-gray-100">
    <h3 className="text-sm font-bold uppercase tracking-wide mb-4">{title}</h3>
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => {
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

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedBrands,
  selectedCategories,
  selectedSizes,
  inStock,
  onBrandToggle,
  onCategoryToggle,
  onSizeToggle,
  onInStockChange,
  onReset,
  showCategories = true,
  title = "Filters",
}) => {
  const { brands, categories } = useFilterData(showCategories);

  return (
    <aside className="hidden lg:block w-64 pr-8 sticky top-24 h-fit max-h-[85vh] overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight">{title}</h2>
        <button
          onClick={onReset}
          className="text-xs font-bold underline text-gray-400 hover:text-black"
        >
          Clear All
        </button>
      </div>

      {/* In Stock */}
      <div className="flex justify-between items-center pb-6">
        <span className="text-sm font-bold uppercase">In Stock Only</span>
        <ToggleSwitch
          checked={inStock}
          onChange={onInStockChange}
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
                onClick={() => onSizeToggle(size)}
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

      {showCategories && (
        <FilterSection
          title="Categories"
          items={categories}
          selectedItems={selectedCategories}
          onToggle={onCategoryToggle}
        />
      )}

      <FilterSection
        title="Brands"
        items={brands}
        selectedItems={selectedBrands}
        onToggle={onBrandToggle}
      />
    </aside>
  );
};

export default FilterPanel;
