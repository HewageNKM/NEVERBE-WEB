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
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`w-full bg-white text-black shadow-2xl border border-gray-100 rounded-lg overflow-hidden flex flex-col ${
          containerStyle
            ? containerStyle
            : "absolute top-14 right-0 lg:w-[600px] z-50"
        }`}
        style={{ maxHeight }}
      >
        {/* Results List */}
        {results.length > 0 ? (
          <ul className="flex flex-col overflow-y-auto">
            {results.map((result, index) => (
              <motion.li
                key={result.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b border-gray-100 last:border-none"
              >
                <SearchResultCard item={result} onClick={onClick} />
              </motion.li>
            ))}
          </ul>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6 text-center"
          >
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <IoSearchOutline className="text-2xl text-gray-400" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              No results found
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Try adjusting your search terms
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDialog;
