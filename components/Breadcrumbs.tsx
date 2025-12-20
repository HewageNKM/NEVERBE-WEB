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
 * Breadcrumb navigation component for improved UX
 * Shows path hierarchy and helps users understand their location
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm text-[#707072] ${className}`}
    >
      {/* Home icon */}
      <Link
        href="/"
        className="hover:text-[#111] transition-colors flex items-center"
        aria-label="Home"
      >
        <IoHomeOutline size={16} />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <IoChevronForward size={12} className="text-gray-300" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-[#111] transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#111] font-medium capitalize truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
