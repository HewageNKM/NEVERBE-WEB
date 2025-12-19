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
 * Nike-Inspired Pagination Component
 * Focuses on minimalist circular buttons and bold contrast.
 */
const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  onChange,
  siblingCount = 1,
}) => {
  if (count <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, count);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < count - 1;

    if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= Math.min(3 + siblingCount * 2, count - 1); i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(count);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1);
      pages.push("...");
      for (let i = Math.max(count - 2 - siblingCount * 2, 2); i <= count; i++) {
        pages.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      pages.push(1);
      pages.push("...");
      for (let i = leftSibling; i <= rightSibling; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(count);
    } else {
      for (let i = 1; i <= count; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-2 py-10"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        className={`
          group flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300
          ${
            page === 1
              ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
              : "border-zinc-200 text-black hover:border-black hover:bg-black hover:text-white"
          }
        `}
        aria-label="Previous page"
      >
        <IoChevronBack size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-2">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-3 text-zinc-400 font-bold">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`
                w-12 h-12 rounded-full text-sm font-bold transition-all duration-200 tabular-nums
                ${
                  p === page
                    ? "bg-black text-white shadow-lg"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                }
              `}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => page < count && onChange(page + 1)}
        disabled={page === count}
        className={`
          group flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300
          ${
            page === count
              ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
              : "border-zinc-200 text-black hover:border-black hover:bg-black hover:text-white"
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
