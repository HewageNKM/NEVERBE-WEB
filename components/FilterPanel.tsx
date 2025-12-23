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
  <div className="py-8 border-t border-default animate-fade">
    <h3 className="text-md font-display font-black uppercase italic tracking-tighter text-primary mb-6">
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
            {/* BRANDED CHECKBOX: Accent green on selection */}
            <div
              className={`w-5 h-5 border rounded-[4px] flex items-center justify-center transition-all duration-300 ${
                isSelected
                  ? "bg-accent border-accent shadow-custom"
                  : "bg-surface border-border-secondary group-hover:border-accent"
              }`}
            >
              {isSelected && (
                <div className="w-2 h-2 bg-dark rounded-full animate-pulse" />
              )}
            </div>

            <span
              className={`text-base tracking-tight transition-colors ${
                isSelected
                  ? "text-primary font-bold"
                  : "text-secondary font-medium group-hover:text-primary"
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
    <aside className="hidden lg:block w-[280px] pr-10 sticky top-24 h-fit max-h-[85vh] overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-primary">
          {title}
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors underline underline-offset-4"
        >
          Clear All
        </button>
      </div>

      {/* In Stock Toggle - Using Brand Surface */}
      <div className="flex justify-between items-center pb-8 bg-surface-2 p-4 rounded-lg border border-default mb-4">
        <span className="text-base font-bold text-primary uppercase tracking-tight">
          In Stock Only
        </span>
        <ToggleSwitch
          checked={inStock}
          onChange={onInStockChange}
          size="small"
        />
      </div>

      {/* Select Size Grid */}
      <div className="py-8 border-t border-default">
        <h3 className="text-md font-display font-black uppercase italic tracking-tighter text-primary mb-6">
          Select Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onSizeToggle(size)}
                className={`aspect-square flex items-center justify-center border rounded-[4px] text-base transition-all duration-300 ${
                  isSelected
                    ? "bg-dark border-dark text-accent font-black italic shadow-hover"
                    : "bg-surface border-border-primary text-primary font-bold hover:border-accent"
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

      <div className="h-20" />
    </aside>
  );
};

export default FilterPanel;
