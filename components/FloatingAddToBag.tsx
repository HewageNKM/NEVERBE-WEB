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
 * Floating Add to Bag button - NEVERBE Theme
 * Optimized for mobile "one-thumb" interactions.
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
      // Logic: Show after scrolling past the main hero/CTA
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          // Added brand surface, border-default, and custom shadow logic
          className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-t border-default shadow-hover p-4 lg:hidden"
        >
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            {/* Product Summary */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-primary truncate uppercase tracking-tight">
                {productName}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-md font-display font-black italic text-accent tracking-tighter">
                  Rs. {price.toLocaleString()}
                </p>
                {selectedSize && (
                  <span className="text-xs font-bold text-muted uppercase">
                    • Size: {selectedSize}
                  </span>
                )}
              </div>
            </div>

            {/* Branded Add to Bag Button */}
            <button
              onClick={onAddToBag}
              disabled={!canAddToBag}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full transition-all active:scale-95 shadow-custom
                ${
                  canAddToBag
                    ? "bg-dark text-inverse hover:bg-accent hover:text-primary font-black uppercase tracking-widest text-xs"
                    : "bg-surface-3 text-muted cursor-not-allowed font-bold uppercase text-xs"
                }
              `}
            >
              <IoBagAdd
                size={20}
                className={canAddToBag ? "text-accent" : ""}
              />
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
