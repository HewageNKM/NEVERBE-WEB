"use client";
import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "small" | "medium";
  disabled?: boolean;
}

/**
 * Custom Toggle Switch component - replaces MUI Switch
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
        transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
        ${isSmall ? "h-5 w-9" : "h-6 w-11"}
        ${checked ? "bg-black" : "bg-gray-200"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block rounded-full bg-white shadow-lg
          ring-0 transition duration-200 ease-in-out
          ${isSmall ? "h-4 w-4" : "h-5 w-5"}
          ${
            checked
              ? isSmall
                ? "translate-x-4"
                : "translate-x-5"
              : "translate-x-0.5"
          }
          ${isSmall ? "mt-0.5" : "mt-0.5"}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
