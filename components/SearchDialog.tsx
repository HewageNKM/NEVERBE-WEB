"use client";
import React from "react";
import SearchResultCard from "@/components/SearchResultCard";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import { Product } from "@/interfaces/Product";

interface SearchDialogProps {
  results: Product[];
  onClick: () => void;
  containerStyle?: string;
  maxHeight?: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  results,
  onClick,
  containerStyle,
  maxHeight = "60vh",
}) => {
  // Detect if we're in grid mode (desktop search overlay)
  const isGridMode = containerStyle?.includes("grid");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`w-full bg-white text-primary overflow-hidden flex flex-col ${
          containerStyle ||
          "shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 absolute top-14 right-0 lg:w-[600px] z-50"
        }`}
        style={{ maxHeight: isGridMode ? undefined : maxHeight }}
      >
        {results.length > 0 ? (
          isGridMode ? (
            // Grid layout - render cards directly
            <>
              {results.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <SearchResultCard
                    item={result}
                    onClick={onClick}
                    variant="card"
                  />
                </motion.div>
              ))}
            </>
          ) : (
            // List layout - vertical scrollable list
            <ul className="flex flex-col overflow-y-auto no-scrollbar">
              {results.map((result, index) => (
                <motion.li
                  key={result.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-50 last:border-none"
                >
                  <SearchResultCard
                    item={result}
                    onClick={onClick}
                    variant="list"
                  />
                </motion.li>
              ))}
            </ul>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="bg-surface-2 p-5 rounded-full mb-4">
              <IoSearchOutline className="text-primary" size={24} />
            </div>
            <p className="text-[16px] font-medium text-primary tracking-tight">
              No results found
            </p>
            <p className="text-[14px] text-secondary mt-1">
              Try adjusting your search for a better fit.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDialog;
