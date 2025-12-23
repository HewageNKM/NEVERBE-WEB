"use client";
import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "small" | "medium";
  disabled?: boolean;
}

/**
 * ToggleSwitch - NEVERBE Performance Style
 * High-precision toggle with brand-aligned "Active" states and glowing accents.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  size = "medium",
  disabled = false,
}) => {
  const isSmall = size === "small";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex shrink-0 cursor-pointer rounded-full
        transition-all duration-300 ease-in-out border-2
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        ${isSmall ? "h-6 w-10" : "h-7 w-12"}
        ${
          checked
            ? "bg-accent border-accent shadow-custom"
            : "bg-surface-3 border-border-primary hover:border-border-secondary"
        }
        ${disabled ? "opacity-40 cursor-not-allowed grayscale" : ""}
      `}
    >
      {/* Visual Label (Hidden from screen readers) */}
      <span className="sr-only">Toggle selection</span>

      {/* The Thumb */}
      <span
        className={`
          pointer-events-none flex items-center justify-center rounded-full 
          shadow-lg ring-0 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isSmall ? "h-4 w-4" : "h-5 w-5"}
          ${checked ? "bg-dark" : "bg-white"}
          ${
            checked
              ? isSmall
                ? "translate-x-4"
                : "translate-x-5"
              : "translate-x-0"
          }
          ${isSmall ? "mt-[2px] ml-[2px]" : "mt-[2px] ml-[2px]"}
        `}
      >
        {/* Internal Detail: Technical Dot */}
        {checked && (
          <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
        )}
      </span>
    </button>
  );
};

export default ToggleSwitch;
