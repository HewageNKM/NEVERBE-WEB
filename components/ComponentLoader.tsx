"use client";
import React from "react";

/**
 * ComponentLoader - NEVERBE Brand Style
 * Features a high-speed precision spinner with brand accent colors.
 */
const ComponentLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-surface/60 backdrop-blur-[6px] flex items-center justify-center z-30 animate-fade">
      <div className="relative flex items-center justify-center">
        {/* Main Brand Spinner */}
        <div className="w-10 h-10 rounded-full border-[1.5px] border-accent border-t-transparent animate-spin [animation-duration:0.5s]"></div>

        {/* Outer Glow Ring (NEVERBE Green Pulse) */}
        <div className="absolute w-12 h-12 rounded-full border-2 border-accent/20 animate-pulse"></div>

        {/* Center Core */}
        <div className="absolute w-1 h-1 bg-accent rounded-full"></div>
      </div>
    </div>
  );
};

export default ComponentLoader;
