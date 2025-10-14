"use client";
import React from "react";
import { BsEmojiFrown } from "react-icons/bs";

interface EmptyStateProps {
  heading: string;
  subHeading?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ heading, subHeading, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex w-full justify-center items-center py-16 px-6" role="alert">
      <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl p-10 gap-6 max-w-sm text-center">
        {/* Icon with gradient background */}
        <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-tr from-red-100 via-red-200 to-red-300 rounded-full">
          <BsEmojiFrown size={40} className="text-red-600" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-snug">
          {heading}
        </h2>

        {/* Subheading */}
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
          {subHeading || "Please check back later."}
        </p>

        {/* Optional action button */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
