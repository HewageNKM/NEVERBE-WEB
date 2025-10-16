"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { showCart } from "@/redux/cartSlice/cartSlice";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import {
  IoCartOutline,
  IoMenu,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { Banner, Logo } from "@/assets/images";
import SearchDialog from "@/components/SearchDialog";
import { getAlgoliaClient } from "@/util";
import { Item } from "@/interfaces";
import { AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
  const dispatch: AppDispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const searchClient = getAlgoliaClient();

  const searchItems = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setSearch(value);

    if (value.trim().length < 3) {
      setItems([]);
      setShowSearchResult(false);
      return;
    }

    try {
      setIsSearching(true);
      const searchResults = await searchClient.search({
        requests: [
          { indexName: "inventory_index", query: value, hitsPerPage: 30 },
        ],
      });
      const filtered = searchResults.results[0].hits.filter(
        (item: Item) => item.status === "Active" && item.listing === "Active"
      );
      setItems(filtered);
      setShowSearchResult(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/70 border-b border-gray-800 shadow-sm">
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
        <nav className="hidden lg:block">
          <ul className="flex gap-6 text-white text-sm font-medium uppercase tracking-wide">
            {[
              { label: "Home", path: "/" },
              { label: "Shop", path: "/collections/products" },
              { label: "About Us", path: "/aboutUs" },
              { label: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-primary-200 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all duration-300 hover:text-primary-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- RIGHT: ICONS & SEARCH ---------- */}
        <div className="flex items-center md:gap-4 gap-1 text-white">
          {/* Desktop Search Bar */}
          <div className="relative hidden lg:block">
            <input
              value={search}
              onChange={searchItems}
              placeholder="Search for products..."
              className="bg-white/10 backdrop-blur-md text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-full w-60 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
            <IoSearch
              size={20}
              className="absolute top-2.5 right-3 text-gray-400"
            />
            {isSearching && (
              <div className="absolute top-2 right-3 w-4 h-4 border-2 border-gray-400 border-t-primary-200 rounded-full animate-spin"></div>
            )}
            <AnimatePresence>
              {showSearchResult && items.length > 0 && (
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

          <button
            onClick={() => dispatch(toggleMenu(true))}
            className="relative block lg:hidden p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoSearchOutline size={28} />
          </button>

          {/* Cart Icon */}
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

      {/* ---------- Mobile Search ----------
      <div className="lg:hidden px-4 pb-2">
        <div className="relative">
          <input
            value={search}
            onChange={searchItems}
            placeholder="Search products..."
            className="bg-white text-black px-4 py-2 pr-10 rounded-md w-full focus:outline-none"
          />
          <IoSearch
            size={20}
            className="absolute top-2.5 right-3 text-gray-500"
          />
          <AnimatePresence>
            {showSearchResult && items.length > 0 && (
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
      </div> */}
    </header>
  );
};

export default Header;
