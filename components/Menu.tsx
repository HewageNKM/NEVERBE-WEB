"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoChevronDownOutline,
  IoChevronForward,
} from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import SearchDialog from "@/components/SearchDialog";
import { NavigationItem } from "@/services/WebsiteService";
import { useAlgoliaSearch } from "@/hooks/useAlgoliaSearch";
import { useFilterData } from "@/hooks/useFilterData";

const DEFAULT_LINKS: NavigationItem[] = [
  { title: "Home", link: "/" },
  { title: "Bundles", link: "/collections/combos" },
  { title: "Offers", link: "/collections/offers" },
];

const Menu = ({ mainNav = [] }: { mainNav?: NavigationItem[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Use consolidated hooks for search and filter data
  const {
    query: search,
    results: items,
    isSearching,
    showResults: showSearchResult,
    search: performSearch,
    clearSearch,
  } = useAlgoliaSearch();

  // Use shared filter data hook instead of duplicate fetch
  const { brands, categories } = useFilterData(true);

  const onSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    performSearch(evt.target.value);
  };

  let displayLinks = mainNav.length > 0 ? mainNav : DEFAULT_LINKS;
  if (!displayLinks.some((l) => l.link === "/")) {
    displayLinks = [{ title: "Home", link: "/" }, ...displayLinks];
  }

  const handleOverlayClick = () => dispatch(toggleMenu(false));
  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* 1. NIKE AIRY BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        className="absolute inset-0 bg-white/80 backdrop-blur-md"
      />

      {/* 2. DRAWER CONTAINER */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[380px] h-full bg-white text-primary flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.05)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <span className="font-medium text-[20px] tracking-tight text-primary">
            Menu
          </span>
          <button
            onClick={() => dispatch(toggleMenu(false))}
            className="p-2 -mr-2 text-primary hover:bg-gray-100 rounded-full transition-all"
          >
            <IoCloseOutline size={30} />
          </button>
        </div>

        {/* 3. SEARCH BAR (Nike Pill Style) */}
        <div className="px-8 py-2 mb-6">
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={onSearch}
              placeholder="Search"
              className="w-full bg-surface-2 text-primary px-5 py-3 pl-12 rounded-full text-[16px] font-normal focus:outline-none transition-all placeholder:text-secondary"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-primary">
              {isSearching ? (
                <div className="w-5 h-5 border-[1.5px] border-gray-200 border-t-black rounded-full animate-spin" />
              ) : (
                <IoSearchOutline size={22} />
              )}
            </div>
          </div>
          {showSearchResult && items.length > 0 && (
            <div className="absolute left-0 right-0 top-[140px] z-50 px-4">
              <SearchDialog
                containerStyle="max-h-[60vh] shadow-2xl rounded-none border border-gray-100"
                results={items}
                onClick={() => {
                  clearSearch();
                  dispatch(toggleMenu(false));
                }}
              />
            </div>
          )}
        </div>

        {/* 4. NAVIGATION LINKS (Sophisticated Hierarchy) */}
        <nav className="flex-1 overflow-y-auto px-8 space-y-2 no-scrollbar">
          {displayLinks.map((link) => (
            <Link
              key={link.title}
              href={link.link}
              onClick={() => dispatch(toggleMenu(false))}
              className="flex items-center justify-between py-4 group"
            >
              <span className="text-[24px] font-medium tracking-tight text-primary transition-transform group-hover:translate-x-1">
                {link.title}
              </span>
              <IoChevronForward
                size={20}
                className="text-gray-200 group-hover:text-primary"
              />
            </Link>
          ))}

          {/* Categories Section */}
          <div className="pt-2">
            <button
              onClick={() => toggleSection("categories")}
              className="w-full flex justify-between items-center py-4 text-primary"
            >
              <span className="text-[24px] font-medium tracking-tight">
                Categories
              </span>
              <IoChevronDownOutline
                className={`transition-transform duration-300 ${
                  openSection === "categories" ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <AnimatePresence>
              {openSection === "categories" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col pb-6 space-y-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/collections/products?category=${encodeURIComponent(
                          cat.label
                        )}`}
                        className="text-[16px] text-secondary hover:text-primary transition-colors"
                        onClick={() => dispatch(toggleMenu(false))}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Brands Section */}
          <div>
            <button
              onClick={() => toggleSection("brands")}
              className="w-full flex justify-between items-center py-4 text-primary"
            >
              <span className="text-[24px] font-medium tracking-tight">
                Brands
              </span>
              <IoChevronDownOutline
                className={`transition-transform duration-300 ${
                  openSection === "brands" ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <AnimatePresence>
              {openSection === "brands" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col pb-6 space-y-4">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/collections/products?brand=${encodeURIComponent(
                          brand.label
                        )}`}
                        className="text-[16px] text-secondary hover:text-primary transition-colors"
                        onClick={() => dispatch(toggleMenu(false))}
                      >
                        {brand.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* 5. FOOTER (Nike Utility Style) */}
        <div className="p-8 bg-white border-t border-gray-50 mt-auto">
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              <Link
                href="/contact"
                className="text-[14px] font-medium text-primary"
                onClick={() => dispatch(toggleMenu(false))}
              >
                Contact Us
              </Link>
              <Link
                href="/contact"
                className="text-[14px] font-medium text-primary"
                onClick={() => dispatch(toggleMenu(false))}
              >
                Help
              </Link>
            </div>
            <p className="text-[11px] text-secondary font-medium uppercase tracking-widest">
              &copy; {new Date().getFullYear()} NEVERBE, INC.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
