"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoSearch, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import { getAlgoliaClient } from "@/util";
import DropShadow from "@/components/DropShadow";
import SearchDialog from "@/components/SearchDialog";

const Menu = () => {
  const dispatch: AppDispatch = useDispatch();
  const searchClient = getAlgoliaClient();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const user = useSelector((state: RootState) => state.authSlice.user);

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
          { indexName: "inventory_index", query: query.trim(), hitsPerPage: 30 },
        ],
      });
      const filteredResults = searchResults.results[0].hits.filter(
        (item) => item.status === "Active" && item.listing === "Active"
      );
      setItems(filteredResults);
      setShowSearchResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOverlayClick = () => dispatch(toggleMenu(false));

  return (
    <DropShadow
      containerStyle="fixed inset-0 flex justify-end items-start bg-black/50 z-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.3 }}
        className="w-[85vw] max-w-sm h-full bg-white shadow-xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold font-display text-lg text-gray-800">Menu</h2>
          <button
            onClick={() => dispatch(toggleMenu(false))}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 relative">
          <input
            type="text"
            value={search}
            onChange={onSearch}
            placeholder="Search products..."
            className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          {isSearching ? (
            <div className="absolute top-7 right-6 w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
          ) : (
            <IoSearch className="absolute top-7 right-6 text-gray-500" size={20} />
          )}

          {showSearchResult && items.length > 0 && (
            <SearchDialog
              containerStyle="absolute top-16 left-0 right-0 max-h-[60vh] overflow-y-auto shadow-lg bg-white rounded-md z-50"
              results={items}
              onClick={() => {
                setShowSearchResult(false);
                setSearch("");
                dispatch(toggleMenu(false));
              }}
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4">
          {[
            { name: "Home", href: "/" },
            { name: "Shop", href: "/collections/products" },
            { name: "About Us", href: "/aboutUs" },
            { name: "Contact Us", href: "/contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-4 text-gray-700 border-b border-gray-200 hover:text-primary-100 transition-colors font-medium"
              onClick={() => dispatch(toggleMenu(false))}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Optional footer */}
        <div className="mt-auto p-4 text-gray-400 text-sm text-center">
          &copy; {new Date().getFullYear()} NEVERBE
        </div>
      </motion.div>
    </DropShadow>
  );
};

export default Menu;
