"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { showBag } from "@/redux/bagSlice/bagSlice";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import {
  IoBagHandleOutline,
  IoMenuOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoPersonOutline,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { AnimatePresence, motion } from "framer-motion";
import SeasonalPromo from "@/app/(site)/components/SeasonalPromo";
import { getAlgoliaClient } from "@/util";
import SearchDialog from "@/components/SearchDialog";
import { ProductVariant } from "@/interfaces/ProductVariant";

const Header = ({ season }: { season: "christmas" | "newYear" | null }) => {
  const bagItems = useSelector((state: RootState) => state.bagSlice.bag);
  const user = useSelector((state: RootState) => state.authSlice.user);
  const dispatch: AppDispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- SEARCH LOGIC ---
  const searchClient = getAlgoliaClient();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 bg-white shadow-sm`}
      >
        <SeasonalPromo season={season} />

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex justify-between items-center py-2">
          {/* LOGO */}
          <Link href="/" className="z-50">
            {/* Dynamic Logo color based on scroll if needed, but black works for Nike style */}
            <Image
              src={Logo}
              alt="NEVERBE"
              width={100}
              height={40}
              className={`object-contain transition-all mix-blend-multiply`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <ul
              className={`flex gap-8 font-bold uppercase text-sm tracking-wide text-black`}
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
          <div className={`flex items-center gap-4 text-black`}>
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <IoSearchOutline size={24} />
            </button>

            {/* Account Icon */}
            <Link
              href={user ? "/account" : "/account/login"}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              {user ? (
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : "U"}
                </div>
              ) : (
                <IoPersonOutline size={24} />
              )}
            </Link>

            {/* Bag */}
            <button
              onClick={() => dispatch(showBag())}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <IoBagHandleOutline size={24} />
              {bagItems.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                  {bagItems.length}
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
                  <div className="mr-4 relative">
                    <IoSearchOutline size={24} className="text-gray-400" />
                    {isSearching && (
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="w-6 h-6 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    autoFocus
                    placeholder="Search for products..."
                    className="w-full text-xl font-bold outline-none placeholder:text-gray-300"
                    onChange={onSearch}
                    value={search}
                  />
                  <button onClick={() => setIsSearchOpen(false)}>
                    <IoCloseOutline
                      size={24}
                      className="text-gray-500 hover:text-black"
                    />
                  </button>
                </div>
                {/* Search Results */}
                {showSearchResult && items.length > 0 && (
                  <div className="absolute left-0 right-0 top-[60px] z-50">
                    <SearchDialog
                      containerStyle="max-h-[70vh] shadow-2xl rounded-b-2xl border-x border-b border-gray-200"
                      results={items}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearch("");
                        setShowSearchResult(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
export default Header;
