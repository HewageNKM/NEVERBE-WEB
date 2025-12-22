"use client";
import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronDownOutline } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";
import { useClickOutside } from "@/hooks/useClickOutside";
import { sortingOptions } from "@/constants";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Shared sorting dropdown component
 * Consolidates duplicate dropdown UI from Products, CollectionProducts, DealsProducts
 */
const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use shared click-outside hook
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, closeDropdown, isOpen);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[16px] text-primary hover:text-secondary transition-colors"
      >
        <TbArrowsSort size={20} />
        <span className="md:hidden">Sort</span>
        <span className="hidden md:inline">Sort By</span>
        <IoChevronDownOutline
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute right-0 mt-4 w-[200px] bg-surface border border-default shadow-xl z-[100] py-4 rounded-none"
          >
            {sortingOptions.map((opt, i) => (
              <li
                key={i}
                onClick={() => handleSelect(opt.value)}
                className={`px-6 py-2 text-[14px] cursor-pointer text-right transition-colors ${
                  value === opt.value
                    ? "text-primary font-medium"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {opt.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
