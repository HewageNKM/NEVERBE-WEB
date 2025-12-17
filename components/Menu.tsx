"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoChevronForward,
} from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import { getAlgoliaClient } from "@/util";
import SearchDialog from "@/components/SearchDialog";
import { ProductVariant } from "@/interfaces/ProductVariant";

import { NavigationItem } from "@/services/WebsiteService";

// Default fallback if no dynamic nav
const DEFAULT_LINKS: NavigationItem[] = [
  { title: "Home", link: "/" },
  { title: "Bundles", link: "/collections/combos" },
  { title: "Offers", link: "/collections/offers" },
];

const Menu = ({ mainNav = [] }: { mainNav?: NavigationItem[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const searchClient = getAlgoliaClient();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Use dynamic nav or default
  // Ensure "Home" is first if not present
  let displayLinks = mainNav.length > 0 ? mainNav : DEFAULT_LINKS;
  if (!displayLinks.some((l) => l.link === "/")) {
    displayLinks = [{ title: "Home", link: "/" }, ...displayLinks];
  }

  // --- SEARCH LOGIC (Kept identical for functionality) ---
  const onSearch = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const query = evt.target.value;
    setSearch(query);

    if (query.trim().length < 3) {
      setItems([]);
      setShowSearchResult(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchClient.search({
        requests: [
          { indexName: "products_index", query: query.trim(), hitsPerPage: 30 },
        ],
      });
      // @ts-ignore
      let filteredResults = searchResults.results[0].hits.filter(
        (item: any) =>
          item.status === true &&
          item.listing === true &&
          item.isDeleted == false
      );
      filteredResults = filteredResults.filter(
        (item: any) =>
          !item.variants.some(
            (variant: ProductVariant) =>
              variant.isDeleted === true && variant.status === false
          )
      );
      setItems(filteredResults);
      setShowSearchResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          fetch(`/api/v1/brands/dropdown`),
          fetch(`/api/v1/categories/dropdown`),
        ]);
        setBrands(await bRes.json());
        setCategories(await cRes.json());
      } catch (e) {
        console.error("Menu data fetch error", e);
      }
    };
    fetchData();
  }, []);

  const handleOverlayClick = () => dispatch(toggleMenu(false));
  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-end">
      {/* Dark Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md h-full bg-white text-black flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="font-black text-xl uppercase tracking-tighter">
            Menu
          </span>
          <button
            onClick={() => dispatch(toggleMenu(false))}
            className="p-2 -mr-2 text-black hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoCloseOutline size={28} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={onSearch}
              placeholder="Search products..."
              className="w-full bg-gray-100 text-black px-5 py-3 pl-12 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
              ) : (
                <IoSearchOutline size={22} />
              )}
            </div>
          </div>
          {/* Search Results Dropdown */}
          {showSearchResult && items.length > 0 && (
            <div className="absolute left-0 right-0 top-[140px] z-50 px-4">
              <SearchDialog
                containerStyle="max-h-[60vh] shadow-2xl rounded-2xl border border-gray-200"
                results={items}
                onClick={() => {
                  setShowSearchResult(false);
                  setSearch("");
                  dispatch(toggleMenu(false));
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-2 space-y-1">
          {/* Primary Links */}
          {displayLinks.map((link) => (
            <Link
              key={link.title}
              href={link.link}
              onClick={() => dispatch(toggleMenu(false))}
              className={`flex items-center justify-between py-4 border-b border-gray-100 group text-black`}
            >
              <span className="text-2xl font-black uppercase tracking-tight group-hover:pl-2 transition-all">
                {link.title}
              </span>
              <IoChevronForward className="text-gray-300 group-hover:text-black transition-colors" />
            </Link>
          ))}

          {/* Collapsible: Categories */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection("categories")}
              className="w-full flex justify-between items-center py-4 text-black group"
            >
              <span className="text-2xl font-black uppercase tracking-tight group-hover:pl-2 transition-all">
                Categories
              </span>
              {openSection === "categories" ? (
                <IoChevronUpOutline size={20} />
              ) : (
                <IoChevronDownOutline size={20} />
              )}
            </button>
            <AnimatePresence>
              {openSection === "categories" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col pb-4 pl-2 space-y-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/collections/categories/${cat.label}`}
                        className="text-lg font-medium text-gray-500 hover:text-black transition-colors"
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

          {/* Collapsible: Brands */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection("brands")}
              className="w-full flex justify-between items-center py-4 text-black group"
            >
              <span className="text-2xl font-black uppercase tracking-tight group-hover:pl-2 transition-all">
                Brands
              </span>
              {openSection === "brands" ? (
                <IoChevronUpOutline size={20} />
              ) : (
                <IoChevronDownOutline size={20} />
              )}
            </button>
            <AnimatePresence>
              {openSection === "brands" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col pb-4 pl-2 space-y-3">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/collections/brands/${brand.label}`}
                        className="text-lg font-medium text-gray-500 hover:text-black transition-colors"
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

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-4 justify-center mb-4">
            <Link
              href="/contact"
              className="text-sm font-bold text-gray-500 uppercase hover:text-black"
            >
              Contact Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-bold text-gray-500 uppercase hover:text-black"
            >
              Help
            </Link>
          </div>
          <p className="text-xs text-center text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} NEVERBE. All Rights Reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
