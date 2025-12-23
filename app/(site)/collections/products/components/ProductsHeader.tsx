"use client";
import React from "react";

const ProductsHeader = () => {
  return (
    <section className="w-full px-4 md:px-12 py-8 md:py-16 bg-surface flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="flex flex-col items-start max-w-[1920px]">
        {/* NEVERBE Performance Style Header */}
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter text-primary leading-none">
          All Products
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <p className="text-sm text-muted font-medium uppercase tracking-wider">
            High-Performance Footwear & Lifestyle Apparel
          </p>
        </div>
      </div>

      <a
        href="/collections/combos"
        className="group flex items-center gap-2 px-8 py-4 bg-dark text-inverse rounded-full font-display font-black uppercase text-xs tracking-widest transition-all hover:bg-accent hover:text-dark active:scale-[0.98] shadow-custom hover:shadow-hover"
      >
        <span>Shop Bundle Deals</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:translate-x-1 transition-transform"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </a>
    </section>
  );
};

export default ProductsHeader;
