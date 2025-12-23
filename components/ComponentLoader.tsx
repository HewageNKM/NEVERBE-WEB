"use client";
import React from "react";

/**
 * ComponentLoader - NEVERBE Liquid Glass Style
 * Minimal glass-effect loading indicator with 3-dot animation.
 */
const ComponentLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-white/70 backdrop-blur-md flex items-center justify-center z-30">
      {/* Liquid Glass Container */}
      <div
        className="backdrop-blur-xl bg-white/80 rounded-2xl px-6 py-4 flex items-center gap-2"
        style={{
          boxShadow: `
            0 8px 32px rgba(151, 225, 62, 0.12),
            0 4px 16px rgba(0, 0, 0, 0.06),
            inset 0 1px 1px rgba(255, 255, 255, 0.9)
          `,
        }}
      >
        {/* Three-dot bounce loader */}
        <div
          className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce"
          style={{
            animationDelay: "0ms",
            boxShadow: "0 3px 10px rgba(151, 225, 62, 0.35)",
          }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce"
          style={{
            animationDelay: "150ms",
            boxShadow: "0 3px 10px rgba(151, 225, 62, 0.35)",
          }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce"
          style={{
            animationDelay: "300ms",
            boxShadow: "0 3px 10px rgba(151, 225, 62, 0.35)",
          }}
        />
      </div>
    </div>
  );
};

export default ComponentLoader;
