"use client";
import React from "react";
import SearchResultCard from "@/components/SearchResultCard";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { Product } from "@/interfaces/Product";

interface SearchDialogProps {
  results: Product[];
  onClick: () => void;
  containerStyle?: string;
  maxHeight?: string;
  query?: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  results,
  onClick,
  containerStyle,
  maxHeight = "60vh",
  query,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className={`w-full max-w-md bg-white text-black rounded-xl shadow-xl border border-gray-200 p-3 sm:p-4 overflow-y-auto hide-scrollbar ${
          containerStyle ? containerStyle : "absolute top-[3.5rem] right-0 z-50"
        }`}
        style={{ maxHeight }}
      >
        {query && (
          <div className="flex items-center gap-2 px-1 pb-2 border-b border-gray-100 mb-2">
            <IoSearch className="text-gray-400 text-lg" />
            <span className="text-sm text-gray-600">
              Showing results for <span className="font-medium text-gray-900">&ldquo;{query}&ldquo;</span>
            </span>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <ul className="flex flex-col divide-y divide-gray-100">
            {results.map((result, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                className="hover:bg-gray-50 rounded-lg transition-colors"
              >
                <SearchResultCard item={result} onClick={onClick} />
              </motion.li>
            ))}
          </ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center text-gray-500 py-6"
          >
            <IoSearch className="text-3xl text-gray-300 mb-2" />
            <p className="text-sm">No results found</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDialog;
