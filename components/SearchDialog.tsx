"use client";
import React from "react";
import SearchResultCard from "@/components/SearchResultCard";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import { Product } from "@/interfaces/Product";
import { Button } from "antd";

interface SearchDialogProps {
  results: Product[];
  recommendations?: Product[];
  onClick: () => void;
  containerStyle?: string;
  maxHeight?: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  results,
  recommendations = [],
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
        className={`w-full text-primary-dark overflow-hidden flex flex-col ${
          containerStyle ||
          "shadow-hover border border-default absolute top-14 right-0 lg:w-[600px] z-50"
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
            // List layout - vertical scrollable list with BRANDED SCROLLBAR
            <ul className="flex flex-col overflow-y-auto hide-scrollbar bg-white">
              {results.map((result, index) => (
                <motion.li
                  key={result.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-default last:border-none group"
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
        ) : recommendations.length > 0 ? (
          /* --- ZERO RESULTS STATE WITH RECOMMENDATIONS --- */
          <div className="flex flex-col w-full h-full p-6 animate-fade bg-white">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-default"></span>
              Trending Now
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
              {recommendations.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SearchResultCard
                    item={result}
                    onClick={onClick}
                    variant="card"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* --- PURE EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade bg-white">
            <div className="bg-surface-2 p-6 rounded-full mb-6 relative">
              <div className="absolute inset-0 bg-accent/10 rounded-full animate-ping scale-150 opacity-20"></div>
              <IoSearchOutline className="text-muted relative z-10" size={32} />
            </div>

            <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-primary-dark">
              No results found
            </h3>

            <p className="text-base text-muted mt-2 font-medium max-w-[240px] leading-snug">
              Adjust your search terms to find what you're looking for.
            </p>

            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={onClick}
              className="mt-8 font-bold uppercase tracking-widest bg-accent hover:bg-accent-hover border-none px-8 h-12 flex items-center shadow-accent"
            >
              Clear Search
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDialog;
