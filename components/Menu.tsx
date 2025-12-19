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

  let displayLinks = mainNav.length > 0 ? mainNav : DEFAULT_LINKS;
  if (!displayLinks.some((l) => l.link === "/")) {
    displayLinks = [{ title: "Home", link: "/" }, ...displayLinks];
  }

  // --- SEARCH LOGIC (Functionality Maintained) ---
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
            (v: ProductVariant) => v.isDeleted === true && v.status === false
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
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* 1. NIKE AIRY BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        className="absolute inset-0 bg-white/80 backdrop-blur-md"
      />

      {/* 2. DRAWER CONTAINER */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[380px] h-full bg-white text-[#111] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.05)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <span className="font-medium text-[20px] tracking-tight text-[#111]">
            Menu
          </span>
          <button
            onClick={() => dispatch(toggleMenu(false))}
            className="p-2 -mr-2 text-[#111] hover:bg-gray-100 rounded-full transition-all"
          >
            <IoCloseOutline size={30} />
          </button>
        </div>

        {/* 3. SEARCH BAR (Nike Pill Style) */}
        <div className="px-8 py-2 mb-6">
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={onSearch}
              placeholder="Search"
              className="w-full bg-[#f5f5f5] text-[#111] px-5 py-3 pl-12 rounded-full text-[16px] font-normal focus:outline-none transition-all placeholder:text-[#707072]"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-[#111]">
              {isSearching ? (
                <div className="w-5 h-5 border-[1.5px] border-gray-200 border-t-black rounded-full animate-spin" />
              ) : (
                <IoSearchOutline size={22} />
              )}
            </div>
          </div>
          {showSearchResult && items.length > 0 && (
            <div className="absolute left-0 right-0 top-[140px] z-50 px-4">
              <SearchDialog
                containerStyle="max-h-[60vh] shadow-2xl rounded-none border border-gray-100"
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

        {/* 4. NAVIGATION LINKS (Sophisticated Hierarchy) */}
        <nav className="flex-1 overflow-y-auto px-8 space-y-2 no-scrollbar">
          {displayLinks.map((link) => (
            <Link
              key={link.title}
              href={link.link}
              onClick={() => dispatch(toggleMenu(false))}
              className="flex items-center justify-between py-4 group"
            >
              <span className="text-[24px] font-medium tracking-tight text-[#111] transition-transform group-hover:translate-x-1">
                {link.title}
              </span>
              <IoChevronForward
                size={20}
                className="text-gray-200 group-hover:text-[#111]"
              />
            </Link>
          ))}

          {/* Categories Section */}
          <div className="pt-2">
            <button
              onClick={() => toggleSection("categories")}
              className="w-full flex justify-between items-center py-4 text-[#111]"
            >
              <span className="text-[24px] font-medium tracking-tight">
                Categories
              </span>
              <IoChevronDownOutline
                className={`transition-transform duration-300 ${
                  openSection === "categories" ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <AnimatePresence>
              {openSection === "categories" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col pb-6 space-y-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/collections/products?category=${encodeURIComponent(
                          cat.label
                        )}`}
                        className="text-[16px] text-[#707072] hover:text-[#111] transition-colors"
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

          {/* Brands Section */}
          <div>
            <button
              onClick={() => toggleSection("brands")}
              className="w-full flex justify-between items-center py-4 text-[#111]"
            >
              <span className="text-[24px] font-medium tracking-tight">
                Brands
              </span>
              <IoChevronDownOutline
                className={`transition-transform duration-300 ${
                  openSection === "brands" ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <AnimatePresence>
              {openSection === "brands" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col pb-6 space-y-4">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/collections/products?brand=${encodeURIComponent(
                          brand.label
                        )}`}
                        className="text-[16px] text-[#707072] hover:text-[#111] transition-colors"
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

        {/* 5. FOOTER (Nike Utility Style) */}
        <div className="p-8 bg-white border-t border-gray-50 mt-auto">
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              <Link
                href="/contact"
                className="text-[14px] font-medium text-[#111]"
                onClick={() => dispatch(toggleMenu(false))}
              >
                Contact Us
              </Link>
              <Link
                href="/contact"
                className="text-[14px] font-medium text-[#111]"
                onClick={() => dispatch(toggleMenu(false))}
              >
                Help
              </Link>
            </div>
            <p className="text-[11px] text-[#707072] font-medium uppercase tracking-widest">
              &copy; {new Date().getFullYear()} NEVERBE, INC.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
