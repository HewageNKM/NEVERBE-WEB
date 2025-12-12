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
    <div className="flex w-full justify-center items-center py-24 px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Minimal Icon - Clean & Light */}
        <div className="mb-6 p-6 bg-gray-50 rounded-full">
          <IoBagHandleOutline
            size={48}
            className="text-gray-300"
            strokeWidth={1.5}
          />
        </div>

        {/* Heading - Uppercase & Bold */}
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mb-3">
          {heading}
        </h2>

        {/* Subheading - Professional Tone */}
        <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed mb-8 max-w-xs mx-auto">
          {subHeading ||
            "We couldn't find any items matching your criteria. Try clearing your filters or check back later."}
        </p>

        {/* Action Button - Solid Black Pill */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-8 py-3 bg-black text-white text-xs md:text-sm font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
