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
 * SizeGrid - NEVERBE Brand Performance Style
 * High-precision selection grid with brand-aligned states and typography.
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
    <div className={`grid grid-cols-3 gap-2.5 ${className} animate-fade`}>
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
              relative py-4 text-base transition-all duration-300
              flex items-center justify-center rounded-sm overflow-hidden
              font-display font-bold uppercase tracking-tight
              ${
                isSelected
                  ? "bg-dark text-accent border-dark font-black italic tracking-tighter shadow-custom scale-[1.02] z-10"
                  : isOutOfStock
                  ? "bg-surface-3 text-muted border-transparent cursor-not-allowed opacity-40"
                  : "bg-surface text-primary border border-border-primary hover:border-accent hover:text-accent"
              }
            `}
          >
            {/* Out of Stock Diagonal Strike - More "Performance" than a standard line-through */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1.5px] bg-muted/30 rotate-15" />
              </div>
            )}

            {stockLoading ? (
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-muted rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            ) : (
              size
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SizeGrid;
