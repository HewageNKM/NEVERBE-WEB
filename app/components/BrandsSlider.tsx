"use client";
import React, { useState, useEffect } from "react";
import BrandCard from "@/app/components/BrandCard";
import { brands } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_PLAY_INTERVAL = 4000; // 4 seconds

const BrandsSlider = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage, setBrandsPerPage] = useState(2); // default mobile

  // Dynamically set brands per page based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setBrandsPerPage(2); // mobile
      else if (window.innerWidth < 768) setBrandsPerPage(3); // sm
      else if (window.innerWidth < 1024) setBrandsPerPage(4); // md
      else setBrandsPerPage(6); // lg+
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(brands.length / brandsPerPage);
  const startIndex = (currentPage - 1) * brandsPerPage;
  const currentBrands = brands.slice(startIndex, startIndex + brandsPerPage);

  const handleDotClick = (page: number) => setCurrentPage(page);

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [totalPages]);

  return (
    <section className="w-full py-12 bg-slate-100">
      <h2 className="text-center font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
        Popular Brands
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.ul
            key={currentPage}
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center items-center`}
            role="list"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {currentBrands.map((brand) => (
              <li key={brand.id} className="flex justify-center">
                <BrandCard brand={brand.name} url={brand.url} image={brand.image} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i + 1)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === i + 1 ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandsSlider;
