"use client";
import React, { useState } from "react";
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 4; // Number of products per page

const SimilarProducts = ({ items }: { items: Item[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDotClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="w-full my-10">
      <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6">
        Similar Products
      </h2>

      {items.length > 0 ? (
        <>
          {/* --- Product Grid with Animation --- */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {currentItems.map((item) => (
                  <ItemCard key={item.itemId} item={item} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- Pagination Dots --- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i + 1)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === i + 1
                      ? "bg-primary scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState heading="No similar products available!" />
      )}
    </section>
  );
};

export default SimilarProducts;
