"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { showBag } from "@/redux/bagSlice/bagSlice";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import {
  IoBagHandleOutline,
  IoMenuOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoHeartOutline,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { AnimatePresence, motion } from "framer-motion";
import SeasonalPromo from "@/app/(site)/components/SeasonalPromo";
import { getAlgoliaClient } from "@/util";
import SearchDialog from "@/components/SearchDialog";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { NavigationItem } from "@/services/WebsiteService";

const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { title: "New Arrivals", link: "/collections/new-arrivals" },
  { title: "Men", link: "/collections/products?gender=men" },
  { title: "Women", link: "/collections/products?gender=women" },
  { title: "Combos", link: "/collections/combos" },
  { title: "Offers", link: "/collections/offers" },
];

interface HeaderProps {
  season: "christmas" | "newYear" | null;
  mainNav?: NavigationItem[];
}

const Header = ({ season, mainNav = [] }: HeaderProps) => {
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const user = useSelector((state: RootState) => state.authSlice.user);
  const dispatch: AppDispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  let navItems = mainNav.length > 0 ? mainNav : DEFAULT_NAV_ITEMS;
  if (!navItems.some((item) => item.link === "/collections/offers")) {
    navItems = [...navItems, { title: "Offers", link: "/collections/offers" }];
  }

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
        (item: any) => item.status && item.listing && !item.isDeleted
      );
      setItems(filteredResults);
      setShowSearchResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full bg-white z-50">
      {/* 1. NIKE UTILITY TOP BAR (The Pre-Header) */}
      <div className="hidden lg:flex bg-[#f5f5f5] px-12 py-1.5 justify-between items-center text-[12px] font-medium text-black">
        <div className="flex gap-4">
          <Link href="/contact" className="hover:opacity-70">
            Help
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/account/register" className="hover:opacity-70">
            Join Us
          </Link>
        </div>
        <div className="flex gap-4">
          <Link
            href={user ? "/account" : "/account/login"}
            className="hover:opacity-70"
          >
            Hi, {user ? user.displayName?.split(" ")[0] : "Sign In"}
          </Link>
        </div>
      </div>

      <header className="sticky top-0 w-full bg-white transition-all duration-300 border-b lg:border-none border-gray-100">
        <SeasonalPromo season={season} />

        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 flex justify-between items-center h-[60px] lg:h-[72px]">
          {/* LOGO - Left aligned like Nike */}
          <Link href="/" className="shrink-0">
            <Image
              src={Logo}
              alt="NEVERBE"
              width={70}
              height={30}
              className="object-contain mix-blend-multiply transition-transform hover:scale-105"
            />
          </Link>

          {/* DESKTOP NAV - Centered */}
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <ul className="flex gap-6 text-[16px] font-medium text-black">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.link}
                    className="hover:border-b-2 border-black pb-[24px] transition-all"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ICONS & SEARCH BAR */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Desktop Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full transition"
            >
              <IoSearchOutline size={26} />
            </button>

            {/* Icons */}
            <div className="flex items-center">
              <Link
                href="/account/wishlist"
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <IoHeartOutline size={26} />
              </Link>

              <button
                onClick={() => dispatch(showBag())}
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
              >
                <IoBagHandleOutline size={26} />
                {bagItems.length > 0 && (
                  <span className="absolute bottom-2 right-2 h-4 w-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                    {bagItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => dispatch(toggleMenu(true))}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <IoMenuOutline size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* FULL SCREEN SEARCH OVERLAY (The Nike "Expansion") */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-[100] p-4 lg:p-12 overflow-y-auto"
            >
              <div className="max-w-[1440px] mx-auto">
                <div className="flex justify-between items-center mb-10">
                  <Image
                    src={Logo}
                    alt="NEVERBE"
                    width={60}
                    height={20}
                    className="mix-blend-multiply"
                  />

                  <div className="flex-1 max-w-2xl mx-auto px-4">
                    <div className="flex items-center bg-[#f5f5f5] rounded-full px-6 py-3 w-full">
                      <IoSearchOutline
                        size={24}
                        className="text-gray-400 mr-4"
                      />
                      <input
                        autoFocus
                        placeholder="Search for products..."
                        className="w-full bg-transparent text-lg border-none outline-none font-medium"
                        onChange={onSearch}
                        value={search}
                      />
                      {isSearching && (
                        <div className="w-5 h-5 border-2 border-t-black rounded-full animate-spin" />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearch("");
                    }}
                    className="p-2 bg-[#f5f5f5] rounded-full hover:bg-gray-200"
                  >
                    <IoCloseOutline size={28} />
                  </button>
                </div>

                {/* Search Results Grid - Simple and clean */}
                {showSearchResult && items.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[#707072] text-sm mb-6">
                      Search Results ({items.length})
                    </p>
                    <SearchDialog
                      containerStyle="shadow-none border-none grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                      results={items}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearch("");
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Header;
