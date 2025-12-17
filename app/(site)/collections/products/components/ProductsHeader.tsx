"use client";
import React from "react";

const ProductsHeader = () => {
  return (
    <section className="w-full px-4 md:px-8 py-8 md:py-12 bg-white flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="flex flex-col items-start max-w-[1440px]">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">
          All Products
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm md:text-base text-gray-500 font-medium">
            Premium Footwear & Apparel
          </p>
          <div className="h-px w-12 bg-gray-300"></div>
        </div>
      </div>

      <a
        href="/collections/combos"
        className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
      >
        <span>Shop Bundle Deals</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
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
