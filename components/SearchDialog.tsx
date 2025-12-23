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
        className={`w-full bg-surface text-primary overflow-hidden flex flex-col ${
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
            <ul className="flex flex-col overflow-y-auto hide-scrollbar">
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
        ) : (
          /* --- EMPTY STATE: NEVERBE Performance Styling --- */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade">
            <div className="bg-surface-3 p-6 rounded-full mb-6 relative group">
              {/* Subtle green pulse behind the icon */}
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/40 transition-all duration-500" />
              <IoSearchOutline
                className="text-accent relative z-10"
                size={32}
              />
            </div>

            <h3 className="text-2xl font-display font-black uppercase italic tracking-tighter text-primary">
              No results found
            </h3>

            <p className="text-base text-muted mt-2 font-medium max-w-[240px] leading-snug">
              Adjust your filters or search for a better fit.
            </p>

            <button
              onClick={onClick}
              className="mt-8 text-xs font-black uppercase tracking-widest text-primary underline underline-offset-8 decoration-accent hover:decoration-primary transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDialog;
