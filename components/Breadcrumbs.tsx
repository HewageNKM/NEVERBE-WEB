"use client";
import React from "react";
import Link from "next/link";
import { IoChevronForward, IoHomeOutline } from "react-icons/io5";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component - NEVERBE Theme
 * Uses brand tokens for typography and colors.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      // Added your custom 'hide-scrollbar' utility and brand spacing
      className={`flex items-center gap-1 md:gap-2 text-base text-secondary overflow-x-auto hide-scrollbar max-w-full ${className}`}
    >
      {/* Home icon */}
      <Link
        href="/"
        className="hover:text-accent transition-colors flex items-center min-h-[44px] min-w-[32px] justify-center touch-manipulation shrink-0"
        aria-label="Home"
      >
        <IoHomeOutline size={16} />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <IoChevronForward size={12} className="text-muted shrink-0" />

          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-accent-hover hover:underline transition-all capitalize min-h-[44px] flex items-center px-1 touch-manipulation shrink-0 truncate max-w-[120px] md:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            /* Active Page: Highlighted with primary color/weight */
            <span className="text-primary font-bold capitalize truncate max-w-[120px] sm:max-w-[180px] md:max-w-[250px] min-h-[44px] flex items-center">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
