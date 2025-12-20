"use client";

import React from "react";

interface SizeGridProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  stockMap?: Record<string, number>;
  stockLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Unified size selection grid component
 * Used across ProductHero, QuickViewModal, and ComboHero for consistent UX
 */
const SizeGrid: React.FC<SizeGridProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  stockMap = {},
  stockLoading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {sizes.map((size) => {
        const stockQty = stockMap[size];
        const isOutOfStock = stockQty !== undefined && stockQty <= 0;
        const isSelected = selectedSize === size;
        const isDisabled = disabled || isOutOfStock || stockLoading;

        return (
          <button
            key={size}
            disabled={isDisabled}
            onClick={() => onSelectSize(size)}
            className={`
              py-3.5 text-xs font-bold border rounded-md transition-all
              flex items-center justify-center
              ${
                isSelected
                  ? "bg-black text-white border-black"
                  : isOutOfStock
                  ? "bg-gray-50 text-gray-300 line-through border-gray-100 cursor-not-allowed"
                  : "bg-white text-black border-gray-200 hover:border-black"
              }
            `}
          >
            {stockLoading ? "..." : size}
          </button>
        );
      })}
    </div>
  );
};

export default SizeGrid;
