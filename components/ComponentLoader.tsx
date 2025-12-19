"use client";
import React from "react";

const ComponentLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-white/60 backdrop-blur-[4px] flex items-center justify-center z-30 transition-all duration-300">
      {/* NIKE STYLE LOADER: 
          Uses a thinner stroke-width (1.5px) and a precise circular motion.
          The 'border-t-transparent' creates the "gap" look seen in high-end athletic apps.
      */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[1.5px] border-[#111] border-t-transparent animate-spin duration-500 ease-linear"></div>

        {/* Optional: Subtle pulse background to give it more depth */}
        <div className="absolute w-10 h-10 rounded-full border border-gray-100 animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default ComponentLoader;
