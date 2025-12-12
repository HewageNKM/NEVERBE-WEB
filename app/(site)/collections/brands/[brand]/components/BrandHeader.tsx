"use client";
import React from "react";

const BrandHeader = ({ brand }: { brand: string }) => {
  const title = brand && brand !== "all" ? brand : "All Brands";

  return (
    <section className="w-full px-4 md:px-8 py-8 md:py-12 bg-white border-b border-gray-100">
      <div className="flex flex-col items-start max-w-[1440px] mx-auto">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">
          {title}
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm md:text-base text-gray-500 font-bold uppercase tracking-wide">
            Official Collection
          </p>
          <div className="h-px w-12 bg-black"></div>
          <p className="text-xs text-gray-400 font-medium">
            Premium Quality • Master Copy • 7A Grade
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandHeader;
