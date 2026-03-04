"use client";
import React, { useState, useEffect, useRef } from "react";
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
  IoPersonOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SeasonalPromo from "@/app/(site)/components/SeasonalPromo";
import SearchDialog from "@/components/SearchDialog";
import { NavigationItem } from "@/actions/websiteAction";
import { useAlgoliaSearch } from "@/hooks/useAlgoliaSearch";
import { Badge, Input, ConfigProvider, Button, Flex, Typography } from "antd";

const { Text } = Typography;

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
  const [scrolled, setScrolled] = useState(false);

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
    fetchRecommendations,
    recommendations,
    clearSearch,
  } = useAlgoliaSearch();

  const onSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    performSearch(evt.target.value);
  };

  // Scroll detection & Pre-fetch recommendations
  useEffect(() => {
    fetchRecommendations();

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full z-50">
      {/* 2. MAIN HEADER — Dark sticky nav */}
      <header
        className={`sticky top-0 w-full transition-all duration-300 z-50 header-dark ${scrolled ? "header-dark-scrolled" : ""}`}
      >
        <Flex
          justify="space-between"
          align="center"
          className="max-w-content mx-auto px-4 lg:px-12 h-[64px] lg:h-[76px]"
        >
          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="NEVERBE"
              width={60}
              height={30}
              className="object-contain transition-transform hover:scale-110 active:scale-95 duration-300"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <Flex component="ul" gap={32} className="m-0 p-0 list-none">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.link}
                    className="relative pb-2 text-[13px] font-bold uppercase tracking-tight text-gray-700 hover:text-[#2e9e5b] transition-colors group"
                  >
                    {item.title}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[3px] transition-all duration-300 group-hover:w-full"
                      style={{
                        background: "linear-gradient(90deg, #2e9e5b, #26854b)",
                        borderRadius: 99,
                      }}
                    />
                  </Link>
                </li>
              ))}
            </Flex>
          </nav>

          {/* ICONS & SEARCH */}
          <Flex align="center" gap={4} className="lg:gap-[16px]">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-black/5 transition-colors group cursor-pointer border-none bg-transparent outline-none m-0 p-0"
            >
              <IoSearchOutline
                size={24}
                className="text-gray-700 group-hover:text-[#2e9e5b] transition-colors"
              />
            </button>

            <Link
              href="/account"
              className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-black/5 transition-colors group cursor-pointer border-none bg-transparent outline-none m-0 p-0"
            >
              <IoPersonOutline
                size={24}
                className="text-gray-700 group-hover:text-[#2e9e5b] transition-colors"
              />
            </Link>

            <Link
              href="/account/wishlist"
              className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-black/5 transition-colors group cursor-pointer border-none bg-transparent outline-none m-0 p-0"
            >
              <IoHeartOutline
                size={24}
                className="text-gray-700 group-hover:text-[#2e9e5b] transition-colors"
              />
            </Link>

            <button
              onClick={() => dispatch(showBag())}
              className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-black/5 transition-colors group cursor-pointer border-none bg-transparent outline-none m-0 p-0"
            >
              <Badge
                count={bagItems.length}
                offset={[-2, 6]}
                color="#2e9e5b"
                size="small"
                style={{ color: "#fff", fontWeight: 800 }}
              >
                <IoBagHandleOutline
                  size={24}
                  className="text-gray-700 group-hover:text-[#2e9e5b] transition-colors"
                />
              </Badge>
            </button>

            <div className="lg:hidden flex items-center justify-center">
              <button
                onClick={() => dispatch(toggleMenu(true))}
                className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-black/5 transition-colors group cursor-pointer border-none bg-transparent outline-none m-0 p-0"
              >
                <IoMenuOutline
                  size={28}
                  className="text-gray-800 group-hover:text-[#2e9e5b] transition-colors"
                />
              </button>
            </div>
          </Flex>
        </Flex>

        {/* FULL SCREEN SEARCH OVERLAY */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-100 overflow-y-auto"
              style={{
                background: "rgba(248, 250, 245, 0.96)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
              }}
            >
              <div className="max-w-content mx-auto px-4 lg:px-12 py-4 lg:py-12">
                {/* Mobile: Stacked layout, Desktop: Side-by-side */}
                <Flex
                  vertical
                  justify="space-between"
                  align="center"
                  gap={16}
                  className="mb-8 lg:mb-12 lg:flex-row"
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    className="w-full lg:w-auto"
                  >
                    <Image
                      src="/logo.png"
                      alt="NEVERBE"
                      width={60}
                      height={24}
                      className="lg:w-[70px]"
                    />
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        clearSearch();
                      }}
                      className="lg:hidden flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors cursor-pointer border-none outline-none m-0 p-0"
                    >
                      <IoCloseOutline size={24} className="text-gray-600" />
                    </button>
                  </Flex>

                  {/* Search bar */}
                  <Flex className="flex-1 lg:max-w-2xl lg:mx-auto w-full">
                    <ConfigProvider
                      theme={{
                        components: {
                          Input: {
                            colorBgContainer: "#fff",
                            colorBorder: "rgba(46, 158, 91, 0.3)",
                            hoverBorderColor: "#2e9e5b",
                            activeBorderColor: "#2e9e5b",
                            activeShadow: "0 0 0 3px rgba(46, 158, 91, 0.12)",
                            borderRadius: 99,
                            colorText: "#1a1a1a",
                            colorTextPlaceholder: "rgba(0,0,0,0.3)",
                          },
                        },
                      }}
                    >
                      <Input
                        autoFocus
                        size="large"
                        placeholder="Search products..."
                        className="w-full"
                        style={{
                          padding: "12px 24px",
                          fontSize: 16,
                          fontWeight: 700,
                          background: "#fff",
                          backdropFilter: "blur(12px)",
                        }}
                        prefix={
                          <IoSearchOutline
                            size={20}
                            style={{
                              color: "#2e9e5b",
                              marginRight: 8,
                              flexShrink: 0,
                            }}
                          />
                        }
                        suffix={
                          <Flex align="center">
                            {search && (
                              <button
                                onClick={() => clearSearch()}
                                className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full hover:bg-black/10 transition-colors cursor-pointer border-none bg-transparent outline-none m-0 p-0 mr-2"
                              >
                                <IoCloseOutline
                                  size={20}
                                  className="text-gray-400 hover:text-gray-600"
                                />
                              </button>
                            )}
                            {isSearching && (
                              <div
                                className="animate-spin shrink-0"
                                style={{
                                  width: 20,
                                  height: 20,
                                  border: "2px solid #2e9e5b",
                                  borderTopColor: "transparent",
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </Flex>
                        }
                        onChange={onSearch}
                        value={search}
                      />
                    </ConfigProvider>
                  </Flex>

                  {/* Desktop close button */}
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      clearSearch();
                    }}
                    className="hidden lg:flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 transition-colors cursor-pointer border-none outline-none m-0 p-0"
                  >
                    <IoCloseOutline size={28} className="text-gray-600" />
                  </button>
                </Flex>

                {/* Results Section */}
                {showSearchResult ? (
                  <div className="animate-fade mt-4">
                    <Flex
                      align="center"
                      gap={8}
                      style={{
                        marginBottom: 24,
                        paddingBottom: 16,
                        borderBottom: "1px solid rgba(46, 158, 91, 0.15)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                          color: "rgba(0,0,0,0.35)",
                        }}
                      >
                        Results
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          color: "#2e9e5b",
                        }}
                      >
                        ({items.length})
                      </Text>
                    </Flex>
                    {items.length > 0 ? (
                      <SearchDialog
                        containerStyle="shadow-none border-none grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6 lg:gap-6"
                        results={items}
                        onClick={() => {
                          setIsSearchOpen(false);
                          clearSearch();
                        }}
                      />
                    ) : (
                      <Flex
                        vertical
                        align="center"
                        justify="center"
                        style={{ padding: "80px 0" }}
                      >
                        <IoSearchOutline
                          size={48}
                          style={{
                            color: "rgba(0,0,0,0.12)",
                            marginBottom: 16,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 900,
                            textTransform: "uppercase",
                            color: "rgba(0,0,0,0.18)",
                          }}
                        >
                          No matches found
                        </Text>
                        <Text
                          style={{
                            marginTop: 8,
                            fontSize: 13,
                            color: "rgba(0,0,0,0.3)",
                          }}
                        >
                          Try a different search term
                        </Text>
                      </Flex>
                    )}
                  </div>
                ) : recommendations.length > 0 ? (
                  /* Show trending / recommended products when search overlay first opens */
                  <div className="animate-fade mt-4">
                    <Flex
                      align="center"
                      gap={8}
                      style={{
                        marginBottom: 16,
                        borderBottom: "1px solid rgba(46, 158, 91, 0.15)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                          color: "rgba(0,0,0,0.35)",
                        }}
                      >
                        Trending Now
                      </Text>
                    </Flex>
                    <SearchDialog
                      containerStyle="shadow-none border-none grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6 lg:gap-6"
                      results={recommendations}
                      onClick={() => {
                        setIsSearchOpen(false);
                        clearSearch();
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Header;
