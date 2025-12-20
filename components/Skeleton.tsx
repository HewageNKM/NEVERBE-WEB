"use client";
import React from "react";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component with pulse animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/**
 * Product card skeleton for loading states
 */
export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col w-full">
    {/* Image skeleton */}
    <Skeleton className="aspect-4/5 w-full rounded-none" />
    {/* Content skeleton */}
    <div className="pt-3 pb-6 px-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-1/3 mt-2" />
    </div>
  </div>
);

/**
 * Grid of product card skeletons
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Search result skeleton
 */
export const SearchResultSkeleton: React.FC<{ count?: number }> = ({
  count = 5,
}) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4">
        <Skeleton className="w-16 h-16 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
