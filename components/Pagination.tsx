"use client";
import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  count: number;
  page: number;
  onChange: (page: number) => void;
  siblingCount?: number;
}

/**
 * Custom Pagination component - replaces MUI Pagination
 */
const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  onChange,
  siblingCount = 1,
}) => {
  if (count <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, count);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < count - 1;

    if (!showLeftDots && showRightDots) {
      // Show first few pages
      for (let i = 1; i <= Math.min(3 + siblingCount * 2, count - 1); i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(count);
    } else if (showLeftDots && !showRightDots) {
      // Show last few pages
      pages.push(1);
      pages.push("...");
      for (let i = Math.max(count - 2 - siblingCount * 2, 2); i <= count; i++) {
        pages.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      // Show middle pages
      pages.push(1);
      pages.push("...");
      for (let i = leftSibling; i <= rightSibling; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(count);
    } else {
      // Show all pages
      for (let i = 1; i <= count; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        className={`
          p-2 rounded-lg transition-colors
          ${
            page === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }
        `}
        aria-label="Previous page"
      >
        <IoChevronBack size={20} />
      </button>

      {/* Page Numbers */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`
              min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors
              ${
                p === page
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }
            `}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => page < count && onChange(page + 1)}
        disabled={page === count}
        className={`
          p-2 rounded-lg transition-colors
          ${
            page === count
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }
        `}
        aria-label="Next page"
      >
        <IoChevronForward size={20} />
      </button>
    </nav>
  );
};

export default Pagination;
