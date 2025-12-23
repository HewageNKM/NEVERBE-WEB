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
 * SortDropdown - NEVERBE Performance Style
 * Features high-precision typography and brand-aligned selection states.
 */
const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, closeDropdown, isOpen);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Icon-only Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-10 h-10 flex items-center justify-center bg-surface-2 border border-default rounded-full hover:border-accent transition-all duration-300"
        aria-label="Sort options"
      >
        <TbArrowsSort
          size={18}
          className={`transition-colors ${
            isOpen ? "text-accent" : "text-primary group-hover:text-accent"
          }`}
        />
      </button>

      {/* DROPDOWN MENU: Technical Spec Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-3 w-[220px] bg-surface border border-default shadow-hover z-[100] py-2 rounded-xl overflow-hidden backdrop-blur-xl bg-surface/95"
          >
            {sortingOptions.map((opt, i) => {
              const isSelected = value === opt.value;
              return (
                <li
                  key={i}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    px-6 py-3 cursor-pointer text-right transition-all duration-200 flex items-center justify-end gap-3 group
                    ${isSelected ? "bg-surface-2" : "hover:bg-surface-3"}
                  `}
                >
                  <span
                    className={`text-sm uppercase tracking-tight transition-colors ${
                      isSelected
                        ? "text-accent font-display font-black italic tracking-tighter"
                        : "text-muted font-bold group-hover:text-primary"
                    }`}
                  >
                    {opt.name}
                  </span>

                  {/* Performance indicator for active selection */}
                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_#97e13e] animate-pulse" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
