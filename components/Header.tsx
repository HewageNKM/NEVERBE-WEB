"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { showCart } from "@/redux/cartSlice/cartSlice";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import {
  IoCartOutline,
  IoMenu,
  IoSearch,
  IoChevronDown,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { Banner, Logo } from "@/assets/images";
import SearchDialog from "@/components/SearchDialog";
import { getAlgoliaClient } from "@/util";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";

const Header = ({
  categories,
  brands,
}: {
  categories: any[];
  brands: any[];
}) => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
  const dispatch: AppDispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchClient = getAlgoliaClient();
  let searchTimeout: NodeJS.Timeout;

  // ✅ Debounced Search Function
  const searchItems = useCallback(
    (value: string) => {
      clearTimeout(searchTimeout);

      if (value.trim().length < 3) {
        setItems([]);
        setShowSearchResult(false);
        return;
      }

      searchTimeout = setTimeout(async () => {
        try {
          setIsSearching(true);
          const searchResults = await searchClient.search({
            requests: [
              { indexName: "products_index", query: value, hitsPerPage: 30 },
            ],
          });

          let filteredResults = searchResults.results[0].hits.filter(
            (item: Product) =>
              item.status === true &&
              item.listing === true &&
              item.isDeleted === false
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
        } catch (e) {
          console.error("Search error:", e);
        } finally {
          setIsSearching(false);
        }
      }, 400); // debounce delay
    },
    [searchClient]
  );

  // ✅ Handle input change
  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setSearch(value);
    searchItems(value);
  };

  // ✅ Click outside to close search dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResult(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header id="header" className="fixed top-0 left-0 w-full z-40 backdrop-blur-md bg-black/70 border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto gap-5 md:gap-0 flex justify-between items-center px-4 md:px-8 py-3 transition-all duration-300">
        {/* ---------- LEFT: LOGO ---------- */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="Neverbe Logo"
            width={110}
            height={110}
            className="hidden lg:block"
          />
          <Image
            src={Banner}
            alt="Neverbe Banner"
            width={160}
            height={160}
            className="block lg:hidden"
          />
        </Link>

        {/* ---------- CENTER: NAVIGATION ---------- */}
        <nav className="hidden lg:block relative">
          <ul className="flex gap-5 text-white text-sm font-medium uppercase tracking-wide">
            <li>
              <Link href="/" className="hover:text-primary-100 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/collections/products"
                className="hover:text-primary-100 transition-colors"
              >
                Shop
              </Link>
            </li>
            <li
              className="relative group"
              onMouseEnter={() => setOpenDropdown("categories")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex uppercase items-center gap-1 hover:text-primary-100 transition-colors">
                Categories <IoChevronDown size={14} />
              </button>
              <AnimatePresence>
                {openDropdown === "categories" && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-black/70 border backdrop-blur-md border-gray-700 max-h-80 overflow-y-auto rounded-md hide-scrollbar shadow-lg py-2"
                  >
                    {categories.map((cat) => (
                      <li key={cat.id || cat.label}>
                        <Link
                          href={`/collections/categories/${cat.label}`}
                          className="block px-4 py-2 hover:bg-primary-200/20 text-sm text-gray-200 whitespace-nowrap"
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            <li
              className="relative group"
              onMouseEnter={() => setOpenDropdown("brands")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex uppercase items-center gap-1 hover:text-primary-100 transition-colors">
                Brands <IoChevronDown size={14} />
              </button>
              <AnimatePresence>
                {openDropdown === "brands" && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 backdrop-blur-md bg-black/70 border border-gray-700 rounded-md shadow-lg py-2 w-48 max-h-80 overflow-y-auto hide-scrollbar"
                  >
                    {brands.map((brand) => (
                      <li key={brand.id || brand.name}>
                        <Link
                          href={`/collections/brands/${brand.slug || brand.label}`}
                          className="block px-4 py-2 hover:bg-primary-200/20 text-sm text-gray-200 whitespace-nowrap"
                        >
                          {brand.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            <li>
              <Link
                className="hover:text-primary-100 transition-colors"
                href="/collections/deals"
              >
                Deals
              </Link>
            </li>
          </ul>
        </nav>

        {/* ---------- RIGHT: SEARCH + CART + MENU ---------- */}
        <div className="flex items-center md:gap-4 gap-1 text-white">
          {/* Desktop Search */}
          <div ref={searchRef} className="relative hidden lg:block">
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="bg-white/10 backdrop-blur-md text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-full w-60 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
            {isSearching ? (
              <div className="absolute top-2.5 right-3 w-4 h-4 border-2 border-gray-400 border-t-primary-200 rounded-full animate-spin"></div>
            ) : (
              <IoSearch size={20} className="absolute top-2.5 right-3 text-gray-400" />
            )}
            <AnimatePresence>
              {showSearchResult && (
                <SearchDialog
                  results={items}
                  onClick={() => {
                    setShowSearchResult(false);
                    setSearch("");
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <button
            onClick={() => dispatch(showCart())}
            className="relative p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoCartOutline size={28} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => dispatch(toggleMenu(true))}
            className="block lg:hidden p-2 hover:bg-white/10 rounded-full"
          >
            <IoMenu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
