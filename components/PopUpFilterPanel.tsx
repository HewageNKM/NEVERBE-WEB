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
  <div className="py-8 border-t border-default animate-fade">
    <h3 className="text-lg font-display font-black uppercase italic tracking-tighter text-primary mb-6">
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
            {/* BRANDED CHECKBOX: Accent Green on active */}
            <div
              className={`w-6 h-6 border rounded-[4px] flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "bg-accent border-accent shadow-custom"
                  : "bg-surface border-border-secondary group-hover:border-accent"
              }`}
            >
              {isActive && (
                <div className="w-2.5 h-2.5 bg-dark rounded-full animate-pulse" />
              )}
            </div>
            <span
              className={`text-md tracking-tight transition-colors ${
                isActive
                  ? "text-primary font-bold italic"
                  : "text-muted font-medium"
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
        className="bg-surface w-full max-w-[440px] h-full shadow-hover relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER: Technical Performance Look */}
        <div className="px-8 py-6 flex justify-between items-center bg-surface border-b border-default z-20">
          <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-primary">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-primary hover:bg-surface-2 hover:text-accent transition-all rounded-full"
          >
            <IoCloseOutline size={32} />
          </button>
        </div>

        {/* BODY: Scannable vertical scroll */}
        <div className="flex-1 overflow-y-auto px-8 hide-scrollbar">
          {/* In Stock Toggle - Branded Utility Section */}
          <div className="flex justify-between items-center py-8 border-t border-default first:border-none">
            <span className="text-base font-bold uppercase tracking-tight text-primary">
              In Stock Only
            </span>
            <ToggleSwitch checked={inStock} onChange={onInStockChange} />
          </div>

          {/* SIZES: NEVERBE Performance Grid */}
          <div className="py-8 border-t border-default">
            <h3 className="text-lg font-display font-black uppercase italic tracking-tighter text-primary mb-6">
              Select Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => onSizeToggle(size)}
                    className={`aspect-square flex items-center justify-center border rounded-[4px] text-base transition-all duration-300 ${
                      isActive
                        ? "bg-dark text-accent border-dark font-black italic shadow-hover scale-[1.02]"
                        : "bg-surface text-primary border-border-primary font-bold hover:border-accent"
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

          <div className="h-24" />
        </div>

        {/* FOOTER ACTIONS: High-Energy Pill Buttons */}
        <div className="p-8 border-t-2 border-dark/5 bg-surface-2 flex gap-4 mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <button
            onClick={onReset}
            className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] text-muted hover:text-error transition-all underline underline-offset-8"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-2 py-4 bg-dark text-inverse text-sm font-black uppercase tracking-widest rounded-full hover:bg-accent hover:text-dark transition-all shadow-custom hover:shadow-hover active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </motion.aside>
    </DropShadow>
  );
};

export default PopUpFilterPanel;
