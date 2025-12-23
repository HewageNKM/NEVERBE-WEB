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
 * Pagination - NEVERBE Brand Style
 * Focuses on circular precision, high-contrast states, and performance typography.
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
      className="flex items-center justify-center gap-2 py-12 animate-fade"
      aria-label="Pagination"
    >
      {/* --- PREVIOUS BUTTON --- */}
      <button
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        className={`
          group flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300
          ${
            page === 1
              ? "border-border-primary text-muted opacity-40 cursor-not-allowed"
              : "border-border-dark text-primary hover:bg-dark hover:text-inverse shadow-sm"
          }
        `}
        aria-label="Previous page"
      >
        <IoChevronBack
          size={20}
          className="transition-transform group-hover:-translate-x-0.5"
        />
      </button>

      {/* --- PAGE NUMBERS --- */}
      <div className="flex items-center gap-1.5 mx-4">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-3 text-muted font-black tracking-widest"
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`
                w-12 h-12 rounded-full text-base font-display transition-all duration-300 tabular-nums
                ${
                  p === page
                    ? "bg-accent text-dark font-black italic tracking-tighter shadow-custom scale-110"
                    : "text-muted font-bold hover:text-primary hover:bg-surface-2"
                }
              `}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* --- NEXT BUTTON --- */}
      <button
        onClick={() => page < count && onChange(page + 1)}
        disabled={page === count}
        className={`
          group flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300
          ${
            page === count
              ? "border-border-primary text-muted opacity-40 cursor-not-allowed"
              : "border-border-dark text-primary hover:bg-dark hover:text-inverse shadow-sm"
          }
        `}
        aria-label="Next page"
      >
        <IoChevronForward
          size={20}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </nav>
  );
};

export default Pagination;
