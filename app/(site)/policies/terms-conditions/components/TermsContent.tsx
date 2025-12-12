"use client";

import React from "react";
import { termsAndConditions } from "@/constants";

const TermsContent = () => {
  return (
    <div className="flex flex-col">
      {termsAndConditions.map((item, index) => (
        <div
          key={index}
          className="group flex flex-col md:flex-row gap-4 md:gap-12 py-10 border-t border-gray-100 first:border-none"
        >
          {/* Index Number - Sticky feel */}
          <span className="text-xs font-bold text-gray-300 group-hover:text-black transition-colors uppercase tracking-widest shrink-0 w-16 pt-1">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Content Body */}
          <div className="flex flex-col gap-3 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">
              {item.title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TermsContent;
