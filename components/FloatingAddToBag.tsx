"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoBagAdd } from "react-icons/io5";

interface FloatingAddToBagProps {
  productName: string;
  price: number;
  selectedSize: string;
  canAddToBag: boolean;
  onAddToBag: () => void;
}

/**
 * Floating Add to Bag button that appears when scrolled past the main CTA
 * Shows on mobile and tablet for easy access
 */
const FloatingAddToBag: React.FC<FloatingAddToBagProps> = ({
  productName,
  price,
  selectedSize,
  canAddToBag,
  onAddToBag,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (past the main product section)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl p-4 lg:hidden"
        >
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#111] truncate">
                {productName}
              </p>
              <p className="text-[13px] text-[#707072]">
                Rs. {price.toLocaleString()}
                {selectedSize && ` • Size: ${selectedSize}`}
              </p>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={onAddToBag}
              disabled={!canAddToBag}
              className="flex items-center gap-2 px-6 py-3 bg-[#111] text-white text-[14px] font-medium rounded-full disabled:bg-gray-300 disabled:text-gray-500 transition-all active:scale-95"
            >
              <IoBagAdd size={18} />
              <span className="hidden sm:inline">Add to Bag</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingAddToBag;
