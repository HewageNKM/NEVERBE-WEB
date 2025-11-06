"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch, IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import { getAlgoliaClient } from "@/util";
import DropShadow from "@/components/DropShadow";
import SearchDialog from "@/components/SearchDialog";
import { ProductVariant } from "@/interfaces/ProductVariant";

const Menu = () => {
  const dispatch: AppDispatch = useDispatch();
  const searchClient = getAlgoliaClient();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // --- SEARCH ---
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

  // --- FETCH BRANDS & CATEGORIES ---
  const fetchBrands = async () => {
    try {
      const result = await fetch(`/api/v1/brands/dropdown`);
      const data = await result.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await fetch(`/api/v1/categories/dropdown`);
      const data = await result.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const handleOverlayClick = () => dispatch(toggleMenu(false));

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

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
            <IoSearch
              className="absolute top-6 right-6 text-gray-500"
              size={20}
            />
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
        <nav className="flex flex-col mt-2 overflow-y-auto">
          {[
            { name: "Home", href: "/" },
            { name: "Shop", href: "/collections/products" },
            { name: "Deals", href: "/collections/deals" },
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

          {/* CATEGORIES DROPDOWN */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("categories")}
              className="w-full flex justify-between items-center p-4 text-gray-700 hover:text-primary-100 font-medium"
            >
              Categories
              {openSection === "categories" ? (
                <IoChevronUp size={20} />
              ) : (
                <IoChevronDown size={20} />
              )}
            </button>
            <AnimatePresence>
              {openSection === "categories" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col pl-6 bg-gray-50"
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/collections/categories/${cat.label}`}
                      className="py-2 text-gray-600 hover:text-primary-100 text-sm border-b border-gray-100"
                      onClick={() => dispatch(toggleMenu(false))}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BRANDS DROPDOWN */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("brands")}
              className="w-full flex justify-between items-center p-4 text-gray-700 hover:text-primary-100 font-medium"
            >
              Brands
              {openSection === "brands" ? (
                <IoChevronUp size={20} />
              ) : (
                <IoChevronDown size={20} />
              )}
            </button>
            <AnimatePresence>
              {openSection === "brands" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col pl-6 bg-gray-50 max-h-60 overflow-y-auto"
                >
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/collections/brands/${brand.label}`}
                      className="py-2 text-gray-600 hover:text-primary-100 text-sm border-b border-gray-100"
                      onClick={() => dispatch(toggleMenu(false))}
                    >
                      {brand.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 text-gray-400 text-sm text-center">
          &copy; {new Date().getFullYear()} NEVERBE
        </div>
      </motion.div>
    </DropShadow>
  );
};

export default Menu;
