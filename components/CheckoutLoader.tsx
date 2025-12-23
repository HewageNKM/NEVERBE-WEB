"use client";
import React from "react";

/**
 * CheckoutLoader - Full-page Liquid Glass Loader
 * Premium liquid glass effect with 3-dot animation and processing message.
 */
const CheckoutLoader = () => {
  return (
    <div className="fixed inset-0 z-300 flex flex-col items-center justify-center overflow-hidden">
      {/* Liquid Glass Background */}
      <div
        className="absolute inset-0 backdrop-blur-2xl"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(151, 225, 62, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(151, 225, 62, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 245, 0.98) 100%)
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Cart Icon */}
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-8">
          <svg
            className="w-8 h-8 text-accent"
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
          Processing Order
        </h2>

        <p className="text-xs text-muted text-center mb-8">
          Please wait while we secure your order
        </p>

        {/* 3-Dot Animation */}
        <div className="flex gap-3">
          <div
            className="w-4 h-4 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-4 h-4 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-4 h-4 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Bottom Warning */}
        <p className="mt-10 text-xs text-muted">Do not close this page</p>
      </div>
    </div>
  );
};

export default CheckoutLoader;
