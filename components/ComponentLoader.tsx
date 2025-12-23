"use client";
import React from "react";

/**
 * ComponentLoader - NEVERBE Liquid Glass
 * Overlay with liquid glass effect and 3-dot animation.
 */
const ComponentLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-30 overflow-hidden">
      {/* Liquid Glass Background */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 245, 0.88) 100%),
            radial-gradient(ellipse at 30% 30%, rgba(151, 225, 62, 0.05) 0%, transparent 60%)
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            inset 0 -1px 0 rgba(0, 0, 0, 0.02)
          `,
        }}
      />

      {/* 3-dot loader */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="flex gap-2.5">
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentLoader;
