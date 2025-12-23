"use client";
import React from "react";
import { IoBagHandleOutline } from "react-icons/io5";

interface EmptyStateProps {
  heading: string;
  subHeading?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  heading,
  subHeading,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex w-full justify-center items-center py-24 px-6 animate-fade">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Icon Wrapper - Brand Surface with Accent Glow */}
        <div className="mb-8 p-8 bg-surface-2 rounded-full relative group">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all duration-500" />
          <IoBagHandleOutline
            size={56}
            className="text-accent relative z-10"
            strokeWidth={1.2}
          />
        </div>

        {/* Heading - Performance Display Style */}
        <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary mb-4">
          {heading}
        </h2>

        {/* Subheading - High Contrast Secondary */}
        <p className="text-secondary text-base md:text-md font-medium leading-relaxed mb-10 max-w-xs mx-auto">
          {subHeading ||
            "We couldn't find any items matching your criteria. Try clearing your filters or check back later."}
        </p>

        {/* Action Button - NEVERBE Dark to Accent Transition */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-10 py-4 bg-dark text-inverse text-xs md:text-sm font-bold uppercase tracking-[0.2em] rounded-full hover:bg-accent hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-custom hover:shadow-hover active:scale-95"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
