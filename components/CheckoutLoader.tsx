"use client";
import React from "react";

/**
 * CheckoutLoader - Full-page loading overlay for checkout processing
 * Premium experience with progress messaging for order processing.
 */
const CheckoutLoader = () => {
  return (
    <div className="fixed inset-0 z-300 flex flex-col items-center justify-center bg-dark">
      {/* Animated Rings */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Outer spinning ring */}
        <div
          className="absolute w-28 h-28 rounded-full border-2 border-accent/20 border-t-accent animate-spin"
          style={{ animationDuration: "1.5s" }}
        />

        {/* Middle pulsing ring */}
        <div className="absolute w-20 h-20 rounded-full border border-accent/40 animate-pulse" />

        {/* Center icon */}
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>

      {/* Brand Identity */}
      <p className="text-xs font-display font-black uppercase tracking-[0.4em] text-accent/80 mb-6">
        NEVERBE
      </p>

      {/* Processing Message */}
      <h2 className="text-xl font-display font-black uppercase tracking-widest text-inverse mb-3">
        Processing Order
      </h2>

      <p className="text-sm text-muted text-center max-w-xs mb-8">
        Please wait while we secure your order. Do not close this page.
      </p>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-accent via-primary to-accent animate-shimmer rounded-full"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );
};

export default CheckoutLoader;
