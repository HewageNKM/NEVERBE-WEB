"use client";
import React from "react";

/**
 * ComponentLoader - NEVERBE Brand Style
 * Features a high-speed precision spinner with brand accent colors.
 */
const ComponentLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-surface/80 flex items-center justify-center z-30">
      <div className="w-8 h-8 rounded-full border-2 border-muted border-t-primary animate-spin"></div>
    </div>
  );
};

export default ComponentLoader;
