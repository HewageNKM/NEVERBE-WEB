"use client";
import React from "react";
import { IoFlameOutline } from "react-icons/io5";

interface StockBadgeProps {
  stockCount: number;
  lowStockThreshold?: number;
  className?: string;
}

/**
 * Stock urgency badge - shows "Only X left!" for low stock items
 * Creates urgency to encourage purchase
 */
const StockBadge: React.FC<StockBadgeProps> = ({
  stockCount,
  lowStockThreshold = 5,
  className = "",
}) => {
  // Don't show for out of stock or plenty in stock
  if (stockCount <= 0 || stockCount > lowStockThreshold) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium ${className}`}
    >
      <IoFlameOutline size={16} className="animate-pulse" />
      <span>Only {stockCount} left!</span>
    </div>
  );
};

export default StockBadge;
