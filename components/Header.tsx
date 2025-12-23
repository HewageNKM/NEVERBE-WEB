"use client";
import React, { useState } from "react";
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
import SearchDialog from "@/components/SearchDialog";
import { NavigationItem } from "@/services/WebsiteService";
import { useAlgoliaSearch } from "@/hooks/useAlgoliaSearch";

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

  const {
    query: search,
    results: items,
    isSearching,
    showResults: showSearchResult,
    search: performSearch,
    clearSearch,
  } = useAlgoliaSearch();

  const onSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    performSearch(evt.target.value);
  };

  return (
    <div className="w-full bg-surface z-50">
      {/* 1. UTILITY TOP BAR - NEVERBE Style */}
      <div className="hidden lg:flex bg-surface-2 px-12 py-2 justify-between items-center text-xs font-bold uppercase tracking-widest text-secondary border-b border-default">
        <div className="flex gap-6">
          <Link href="/contact" className="hover:text-accent transition-colors">
            Help
          </Link>
          <span className="text-border-primary">|</span>
          <Link
            href="/account/register"
            className="hover:text-accent transition-colors text-primary"
          >
            Join Us
          </Link>
        </div>
        <div className="flex gap-4">
          <Link
            href={user ? "/account" : "/account/login"}
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            Hi,{" "}
            <span className="text-primary font-black italic">
              {user ? user.displayName?.split(" ")[0] : "Sign In"}
            </span>
          </Link>
        </div>
      </div>

      <header className="sticky top-0 w-full bg-surface transition-all duration-300 border-b border-default lg:border-none">
        <SeasonalPromo season={season} />

        <div className="max-w-content mx-auto px-4 lg:px-12 flex justify-between items-center h-[64px] lg:h-[80px]">
          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <Image
              src={Logo}
              alt="NEVERBE"
              width={85}
              height={35}
              className="object-contain mix-blend-multiply transition-transform hover:scale-110 active:scale-95 duration-300"
            />
          </Link>

          {/* DESKTOP NAV - Performance Centering */}
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <ul className="flex gap-8 text-base font-bold uppercase tracking-tighter">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.link}
                    className="relative pb-2 hover:text-accent transition-colors group"
                  >
                    {item.title}
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ICONS & SEARCH */}
          <div className="flex items-center gap-1 lg:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 hover:bg-surface-2 rounded-full transition-colors group"
            >
              <IoSearchOutline size={24} className="group-hover:text-accent" />
            </button>

            <Link
              href="/account/wishlist"
              className="p-2.5 hover:bg-surface-2 rounded-full transition-colors group"
            >
              <IoHeartOutline size={24} className="group-hover:text-accent" />
            </Link>

            <button
              onClick={() => dispatch(showBag())}
              className="relative p-2.5 hover:bg-surface-2 rounded-full transition-colors group"
            >
              <IoBagHandleOutline
                size={24}
                className="group-hover:text-accent"
              />
              {bagItems.length > 0 && (
                <span className="absolute top-2 right-2 h-4.5 w-4.5 bg-accent text-dark text-[10px] flex items-center justify-center rounded-full font-black shadow-custom">
                  {bagItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => dispatch(toggleMenu(true))}
              className="lg:hidden p-2.5 hover:bg-surface-2 rounded-full"
            >
              <IoMenuOutline size={28} />
            </button>
          </div>
        </div>

        {/* FULL SCREEN SEARCH OVERLAY */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-surface z-[100] p-4 lg:p-12 overflow-y-auto"
            >
              <div className="max-w-content mx-auto">
                <div className="flex justify-between items-center mb-12">
                  <Image
                    src={Logo}
                    alt="NEVERBE"
                    width={80}
                    height={30}
                    className="mix-blend-multiply"
                  />

                  <div className="flex-1 max-w-2xl mx-auto px-4">
                    <div className="flex items-center bg-surface-2 border border-default rounded-full px-6 py-4 w-full focus-within:border-accent transition-all shadow-custom">
                      <IoSearchOutline size={24} className="text-accent mr-4" />
                      <input
                        autoFocus
                        placeholder="Search for premium gear..."
                        className="w-full bg-transparent text-xl border-none outline-none font-display font-black italic tracking-tight placeholder:text-muted"
                        onChange={onSearch}
                        value={search}
                      />
                      {isSearching && (
                        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      clearSearch();
                    }}
                    className="p-3 bg-surface-2 rounded-full hover:bg-dark hover:text-inverse transition-all"
                  >
                    <IoCloseOutline size={28} />
                  </button>
                </div>

                {/* Results Section */}
                {showSearchResult && (
                  <div className="animate-fade">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-8 border-b border-default pb-4">
                      Results{" "}
                      <span className="text-accent">({items.length})</span>
                    </p>
                    {items.length > 0 ? (
                      <SearchDialog
                        containerStyle="shadow-none border-none grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
                        results={items}
                        onClick={() => {
                          setIsSearchOpen(false);
                          clearSearch();
                        }}
                      />
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-2xl font-display font-black italic text-muted uppercase">
                          No matches found
                        </p>
                      </div>
                    )}
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
