"use client";
import React from "react";
import { Item } from "@/interfaces";
import SearchResultCard from "@/components/SearchResultCard";
import { motion } from "framer-motion";

interface SearchDialogProps {
  results: Item[];
  onClick: () => void;
  containerStyle?: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  results,
  onClick,
  containerStyle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`w-full max-w-md bg-white text-black rounded-lg shadow-lg p-3 overflow-y-auto hide-scrollbar ${
        containerStyle ? containerStyle : "absolute top-[3.5rem] right-0 z-50"
      }`}
    >
      {results.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {results.map((result, index) => (
            <li
              key={index}
              className="hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            >
              <SearchResultCard item={result} onClick={onClick} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-4">
          No results found
        </div>
      )}
    </motion.div>
  );
};

export default SearchDialog;
