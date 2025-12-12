"use client";
import React from "react";

const DealsHeader = () => {
  return (
    <section className="w-full px-4 md:px-8 py-8 md:py-12 bg-white">
      <div className="flex flex-col items-start max-w-[1440px] mx-auto">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-red-600">
          Hot Deals
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm md:text-base text-black font-bold uppercase tracking-wide">
            Limited Time Offers & Exclusive Discounts
          </p>
          <div className="h-px w-12 bg-red-600"></div>
        </div>
      </div>
    </section>
  );
};

export default DealsHeader;
