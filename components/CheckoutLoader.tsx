"use client";
import React from "react";

/**
 * CheckoutLoader - Full-page Liquid Glass Loader
 * Premium white theme with 3-dot animation and processing message.
 */
const CheckoutLoader = () => {
  return (
    <div className="fixed inset-0 z-300 flex flex-col items-center justify-center bg-surface/95 backdrop-blur-sm">
      {/* Liquid Glass Card */}
      <div
        className="backdrop-blur-xl bg-white/80 rounded-3xl px-12 py-10 flex flex-col items-center max-w-sm mx-4"
        style={{
          boxShadow: `
            0 16px 48px rgba(151, 225, 62, 0.18),
            0 8px 24px rgba(0, 0, 0, 0.08),
            inset 0 2px 2px rgba(255, 255, 255, 0.9)
          `,
        }}
      >
        {/* Cart Icon */}
        <div
          className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6"
          style={{ boxShadow: "0 4px 16px rgba(151, 225, 62, 0.2)" }}
        >
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

        {/* Processing Message */}
        <h2 className="text-lg font-display font-black uppercase tracking-widest text-primary mb-2">
          Processing
        </h2>

        <p className="text-xs text-muted text-center mb-6">
          Please wait while we secure your order
        </p>

        {/* 3-Dot Animation */}
        <div className="flex gap-2.5">
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{
              animationDelay: "0ms",
              boxShadow: "0 4px 12px rgba(151, 225, 62, 0.4)",
            }}
          />
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{
              animationDelay: "150ms",
              boxShadow: "0 4px 12px rgba(151, 225, 62, 0.4)",
            }}
          />
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{
              animationDelay: "300ms",
              boxShadow: "0 4px 12px rgba(151, 225, 62, 0.4)",
            }}
          />
        </div>
      </div>

      {/* Bottom Warning Text */}
      <p className="mt-6 text-xs text-muted">Do not close this page</p>
    </div>
  );
};

export default CheckoutLoader;
