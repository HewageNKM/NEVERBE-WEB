"use client";
import React from "react";

/**
 * ComponentLoader - NEVERBE Brand Style
 * Minimal, modern loading indicator for inline/component loading states.
 */
const ComponentLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-surface/90 backdrop-blur-sm flex items-center justify-center z-30">
      {/* Three-dot bounce loader */}
      <div className="flex gap-1.5">
        <div
          className="w-2 h-2 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default ComponentLoader;
