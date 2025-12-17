"use client";
import React from "react";
import ComboCard from "./ComboCard";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";

interface CombosGridProps {
  combos: any[];
  currentPage: number; // Controlled by parent
  totalPages: number; // Controlled by parent
}

const CombosGrid: React.FC<CombosGridProps> = ({
  combos,
  currentPage,
  totalPages,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // Create new URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    // Push new URL
    router.push(`?${params.toString()}`, { scroll: true });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      const showPage =
        i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1;
      if (showPage) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (combos.length === 0) return null;

  return (
    <>
      {/* Combo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo: any) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1} // Client-side check, mostly visual
              className="flex items-center gap-1 px-4 py-2 border text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-gray-300 hover:border-black"
            >
              <IoChevronBack size={16} />
              Prev
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-gray-400"
                    >
                      ...
                    </span>
                  );
                }
                const pageNum = page as number;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors ${
                      currentPage === pageNum
                        ? "bg-black text-white"
                        : "border border-gray-300 hover:border-black"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-gray-300 hover:border-black"
            >
              Next
              <IoChevronForward size={16} />
            </button>
          </div>

          {/* Page Info */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
    </>
  );
};

export default CombosGrid;
