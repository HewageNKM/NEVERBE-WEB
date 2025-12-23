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

  const {
    query: search,
    results: items,
    isSearching,
    showResults: showSearchResult,
    search: performSearch,
    clearSearch,
  } = useAlgoliaSearch();

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
      {/* 1. Backdrop - Using Brand Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
      />

      {/* 2. Drawer Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[360px] h-full bg-surface text-primary flex flex-col shadow-hover"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-default">
          <span className="font-display font-black text-2xl uppercase italic tracking-tighter text-primary">
            Menu
          </span>
          <button
            onClick={() => dispatch(toggleMenu(false))}
            className="p-2 -mr-2 text-primary hover:bg-surface-2 rounded-full transition-all"
          >
            <IoCloseOutline size={32} />
          </button>
        </div>

        {/* 3. Search Bar - Branded focus state */}
        <div className="px-6 py-6">
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={onSearch}
              placeholder="Search gear..."
              className="w-full bg-surface-2 text-primary px-6 py-4 pl-12 rounded-full text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-accent/50 border border-transparent focus:border-accent placeholder:text-muted"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-5">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoSearchOutline size={22} className="text-primary" />
              )}
            </div>
          </div>
          {showSearchResult && items.length > 0 && (
            <div className="absolute left-0 right-0 top-[160px] z-50 px-4 animate-fade">
              <SearchDialog
                containerStyle="max-h-[60vh] shadow-hover border border-default rounded-2xl overflow-hidden"
                results={items}
                onClick={() => {
                  clearSearch();
                  dispatch(toggleMenu(false));
                }}
              />
            </div>
          )}
        </div>

        {/* 4. Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-8 space-y-1 hide-scrollbar">
          {displayLinks.map((link) => (
            <Link
              key={link.title}
              href={link.link}
              onClick={() => dispatch(toggleMenu(false))}
              className="flex items-center justify-between py-4 group border-b border-default/50"
            >
              <span className="text-3xl font-display font-black uppercase italic tracking-tighter text-primary transition-all group-hover:text-accent group-hover:translate-x-2">
                {link.title}
              </span>
              <IoChevronForward
                size={20}
                className="text-muted group-hover:text-accent"
              />
            </Link>
          ))}

          {/* Collapsible Sections */}
          {[
            {
              id: "categories",
              label: "Categories",
              data: categories,
              query: "category",
            },
            { id: "brands", label: "Brands", data: brands, query: "brand" },
          ].map((section) => (
            <div key={section.id} className="border-b border-default/50">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex justify-between items-center py-5 text-primary group"
              >
                <span className="text-2xl font-display font-black uppercase italic tracking-tighter group-hover:text-accent transition-colors">
                  {section.label}
                </span>
                <IoChevronDownOutline
                  className={`transition-all duration-300 ${
                    openSection === section.id
                      ? "rotate-180 text-accent"
                      : "text-muted"
                  }`}
                  size={20}
                />
              </button>
              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col pb-6 space-y-4 pl-4 border-l-2 border-accent/30">
                      {section.data.map((item) => (
                        <Link
                          key={item.id}
                          href={`/collections/products?${
                            section.query
                          }=${encodeURIComponent(item.label)}`}
                          className="text-base font-bold text-muted hover:text-accent hover:translate-x-1 transition-all uppercase tracking-tight"
                          onClick={() => dispatch(toggleMenu(false))}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* 5. Footer - Utility Links */}
        <div className="p-8 bg-surface-2 border-t border-default mt-auto">
          <div className="flex flex-col gap-6">
            <div className="flex gap-8">
              <Link
                href="/contact"
                className="text-sm font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                onClick={() => dispatch(toggleMenu(false))}
              >
                Contact
              </Link>
              <Link
                href="/contact"
                className="text-sm font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                onClick={() => dispatch(toggleMenu(false))}
              >
                Help
              </Link>
            </div>
            <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} NEVERBE, INC.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
