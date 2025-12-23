"use client";
import React from "react";
import { IoFlameOutline } from "react-icons/io5";

interface StockBadgeProps {
  stockCount: number;
  lowStockThreshold?: number;
  className?: string;
}

/**
 * StockBadge - NEVERBE Performance Alert
 * High-urgency indicator using brand-aligned "Technical" aesthetics.
 */
const StockBadge: React.FC<StockBadgeProps> = ({
  stockCount,
  lowStockThreshold = 5,
  className = "",
}) => {
  // Logic: Hide if out of stock (handled by overlays) or if stock is healthy
  if (stockCount <= 0 || stockCount > lowStockThreshold) {
    return null;
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 
        bg-dark text-accent border border-accent/30 
        rounded-sm shadow-custom animate-fade ${className}
      `}
    >
      {/* High-Energy Pulse Icon */}
      <div className="relative flex items-center justify-center">
        <IoFlameOutline size={16} className="relative z-10 animate-pulse" />
        <div className="absolute inset-0 bg-accent/40 rounded-full blur-md animate-ping" />
      </div>

      <span className="text-xs font-display font-black uppercase italic tracking-tighter">
        Critical: Only {stockCount} {stockCount === 1 ? "Unit" : "Units"} Left
      </span>
    </div>
  );
};

export default StockBadge;
