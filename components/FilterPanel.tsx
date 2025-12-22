"use client";
import React from "react";
import ToggleSwitch from "@/components/ToggleSwitch";
import { useFilterData } from "@/hooks/useFilterData";
import { AVAILABLE_SIZES } from "@/constants/filters";

interface FilterPanelProps {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  inStock: boolean;
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onInStockChange: (value: boolean) => void;
  onReset: () => void;
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
  <div className="py-8 border-t border-default">
    <h3 className="text-md font-medium text-primary tracking-tight mb-5">
      {title}
    </h3>
    <div className="flex flex-col gap-4">
      {items.map((item, idx) => {
        const isSelected = selectedItems.includes(item.label?.toLowerCase());
        return (
          <button
            key={idx}
            onClick={() => onToggle(item.label)}
            className="flex items-center gap-3 group text-left"
          >
            {/* Minimalist Checkbox Indicator */}
            <div
              className={`w-5 h-5 border rounded-[4px] flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? "bg-dark border-dark"
                  : "bg-surface border-gray-300 group-hover:border-dark"
              }`}
            >
              {isSelected && (
                <div className="w-2 h-2 bg-surface rounded-full" />
              )}
            </div>

            <span
              className={`text-md transition-colors ${
                isSelected
                  ? "text-primary font-medium"
                  : "text-primary font-normal group-hover:text-secondary"
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
    <aside className="hidden lg:block w-[260px] pr-10 sticky top-24 h-fit max-h-[85vh] overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-[20px] font-medium text-primary tracking-tight">
          {title}
        </h2>
        <button
          onClick={onReset}
          className="text-[14px] font-normal text-secondary hover:text-primary transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* In Stock Utility */}
      <div className="flex justify-between items-center pb-8">
        <span className="text-md font-normal text-primary">In Stock Only</span>
        <ToggleSwitch
          checked={inStock}
          onChange={onInStockChange}
          size="small"
        />
      </div>

      {/* Nike Style Size Grid (1:1 Ratio Squares) */}
      <div className="py-8 border-t border-default">
        <h3 className="text-md font-medium text-primary tracking-tight mb-5">
          Select Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onSizeToggle(size)}
                className={`aspect-square flex items-center justify-center border rounded-[4px] text-[14px] transition-all ${
                  isSelected
                    ? "bg-dark border-dark text-inverse font-medium"
                    : "bg-surface border-gray-200 text-primary hover:border-dark"
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
          title="Shop by Category"
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

      {/* Visual Spacer for the bottom of the sticky aside */}
      <div className="h-20" />
    </aside>
  );
};

export default FilterPanel;
