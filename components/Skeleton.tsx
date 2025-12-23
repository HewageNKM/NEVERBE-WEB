"use client";
import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "shimmer";
}

/**
 * Base NEVERBE Skeleton
 * Uses surface-3 (brand-tinted neutral) for a cohesive loading experience.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "default",
}) => (
  <div
    className={`
      rounded-sm relative overflow-hidden bg-surface-3
      ${variant === "shimmer" ? "animate-pulse" : "animate-pulse"}
      ${className}
    `}
  >
    {/* Subtle Performance Glow overlay for active pulse */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
  </div>
);

/**
 * Product Card Skeleton - Matches NEVERBE ItemCard structure
 */
export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col w-full animate-fade">
    {/* Image area with 4/5 performance aspect ratio */}
    <div className="relative aspect-4/5 w-full bg-surface-2 overflow-hidden">
      <Skeleton className="h-full w-full rounded-none" />
      {/* Badge placeholder */}
      <Skeleton className="absolute top-3 left-3 h-6 w-16 bg-surface-3/50" />
    </div>

    {/* Content Area */}
    <div className="pt-4 pb-6 px-1 space-y-3">
      {/* Title placeholder */}
      <Skeleton className="h-5 w-3/4" />
      {/* Category placeholder */}
      <Skeleton className="h-3 w-1/2" />

      {/* Price & KOKO placeholder */}
      <div className="flex flex-col gap-2 pt-1">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-2 w-1/4 opacity-50" />
      </div>
    </div>
  </div>
);

/**
 * Grid of Product Skeletons for Collections/Search
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => (
  <div className="w-full max-w-content mx-auto">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Search Result Skeleton (List Variant)
 */
export const SearchResultSkeleton: React.FC<{ count?: number }> = ({
  count = 5,
}) => (
  <div className="flex flex-col divide-y divide-default">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-5 p-5 animate-fade">
        {/* Precision Image Box placeholder */}
        <Skeleton className="w-20 h-20 rounded-lg shrink-0 border border-default" />

        <div className="flex-1 space-y-3">
          {/* Header & Tag placeholders */}
          <div className="space-y-1">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          {/* Price placeholder */}
          <Skeleton className="h-5 w-1/5" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Page Blueprint Skeleton (for initial route transition)
 */
export const PageBlueprintSkeleton: React.FC = () => (
  <div className="space-y-12 py-10">
    <div className="px-6 md:px-12 space-y-4">
      <Skeleton className="h-10 w-48" /> {/* Header */}
      <Skeleton className="h-4 w-96" /> {/* Subtitle */}
    </div>
    <ProductGridSkeleton count={4} />
  </div>
);

export default Skeleton;
