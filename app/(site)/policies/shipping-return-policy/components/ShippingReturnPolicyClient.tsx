"use client";

import React from "react";
import ShippingReturnPolicyContent from "./ShippingReturnPolicyContent";

const ShippingReturnPolicyClient = () => {
  return (
    <main className="w-full min-h-screen bg-white pt-32 md:pt-40 pb-20 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 border-b border-black pb-8">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black leading-[0.9]">
            Shipping & <br /> Returns
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Customer Service
            </p>
            <div className="hidden md:block h-px w-12 bg-gray-300"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Exchange Guidelines
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl">
          <ShippingReturnPolicyContent />
        </div>
      </div>
    </main>
  );
};

export default ShippingReturnPolicyClient;
