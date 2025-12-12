"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { showCart } from "@/redux/cartSlice/cartSlice";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import {
  IoCartOutline,
  IoMenuOutline,
  IoSearchOutline,
  IoCloseOutline,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { Banner, Logo } from "@/assets/images";
import SearchDialog from "@/components/SearchDialog";
import { getAlgoliaClient } from "@/util";
import { AnimatePresence, motion } from "framer-motion";
import SeasonalPromo from "@/app/(site)/components/SeasonalPromo";

const Header = ({ season }: { season: "christmas" | "newYear" | null }) => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
  const dispatch: AppDispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ... (Keep your existing search logic / algolia logic here) ...
  // [Assuming existing state variables: items, showSearchResult, etc]
  // Note: For brevity, I am focusing on the UI structure.

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <SeasonalPromo season={season} />

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="z-50">
            {/* Dynamic Logo color based on scroll if needed, but black works for Nike style */}
            <Image
              src={Logo}
              alt="NEVERBE"
              width={100}
              height={40}
              className={`object-contain transition-all ${
                scrolled ? "brightness-0" : "brightness-0 invert lg:invert-0"
              }`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <ul
              className={`flex gap-8 font-bold uppercase text-sm tracking-wide ${
                scrolled ? "text-black" : "text-black"
              }`}
            >
              {["New Arrivals", "Men", "Women", "Deals"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/collections/${item
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ICONS */}
          <div
            className={`flex items-center gap-4 ${
              scrolled ? "text-black" : "text-black"
            }`}
          >
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <IoSearchOutline size={24} />
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch(showCart())}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <IoCartOutline size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => dispatch(toggleMenu(true))}
              className="lg:hidden p-2"
            >
              <IoMenuOutline size={28} />
            </button>
          </div>
        </div>

        {/* FULL SCREEN SEARCH OVERLAY (Modern Nike Style) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full bg-white z-50 p-6 shadow-xl"
            >
              <div className="max-w-4xl mx-auto relative">
                <div className="flex items-center border-b-2 border-gray-100 pb-2">
                  <IoSearchOutline size={24} className="text-gray-400 mr-4" />
                  <input
                    autoFocus
                    placeholder="Search for products..."
                    className="w-full text-xl font-bold outline-none placeholder:text-gray-300"
                    // Add your onChange logic here
                  />
                  <button onClick={() => setIsSearchOpen(false)}>
                    <IoCloseOutline
                      size={24}
                      className="text-gray-500 hover:text-black"
                    />
                  </button>
                </div>
                {/* Insert Search Results Component Here */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
export default Header;
