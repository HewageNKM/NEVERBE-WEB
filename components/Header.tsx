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
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { AnimatePresence, motion } from "framer-motion";
import SeasonalPromo from "@/app/(site)/components/SeasonalPromo";
import SearchDialog from "@/components/SearchDialog";
import { NavigationItem } from "@/services/WebsiteService";
import { useAlgoliaSearch } from "@/hooks/useAlgoliaSearch";
import { Badge, Input, ConfigProvider, Button, Flex, Typography } from "antd";

const { Text } = Typography;

const ANNOUNCEMENTS = [
  "🚚 Island-Wide Delivery Available",
  "💳 Cash on Delivery — Pay When You Receive",
  "🔄 Easy Returns & Exchanges Within 7 Days",
  "⭐ 100% Premium Quality Guaranteed",
];

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
  const [announcementIndex, setAnnouncementIndex] = useState(0);

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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Announcement rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full z-50">
      {/* 1. ANNOUNCEMENT BAR — Light with rotating text */}
      <div className="announcement-bar w-full py-2.5 px-4 relative overflow-hidden">
        <Flex justify="center" align="center" gap={16}>
          <Button
            type="text"
            size="small"
            icon={<IoChevronBackOutline size={14} />}
            onClick={() =>
              setAnnouncementIndex(
                (prev) =>
                  (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length,
              )
            }
            className="!text-[#5a8a1a]/60 hover:!text-[#4a7a10] !border-none !p-0 !h-auto !w-auto"
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={announcementIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#3a6a10",
                textAlign: "center",
                minWidth: 280,
                display: "inline-block",
              }}
            >
              {ANNOUNCEMENTS[announcementIndex]}
            </motion.span>
          </AnimatePresence>
          <Button
            type="text"
            size="small"
            icon={<IoChevronForwardOutline size={14} />}
            onClick={() =>
              setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
            }
            className="!text-[#5a8a1a]/60 hover:!text-[#4a7a10] !border-none !p-0 !h-auto !w-auto"
          />
        </Flex>
      </div>

      {/* 2. MAIN HEADER — Dark sticky nav */}
      <header
        className={`sticky top-0 w-full transition-all duration-300 z-50 header-dark ${scrolled ? "header-dark-scrolled" : ""}`}
      >
        <SeasonalPromo season={season} />

        <Flex
          justify="space-between"
          align="center"
          className="max-w-content mx-auto px-4 lg:px-12 h-[64px] lg:h-[76px]"
        >
          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <Image
              src={Logo}
              alt="NEVERBE"
              width={130}
              height={50}
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
                    className="relative pb-2 text-[13px] font-bold uppercase tracking-tight text-gray-700 hover:text-[#5a9a1a] transition-colors group"
                  >
                    {item.title}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[3px] transition-all duration-300 group-hover:w-full"
                      style={{
                        background: "linear-gradient(90deg, #97e13e, #7bc922)",
                        borderRadius: 99,
                      }}
                    />
                  </Link>
                </li>
              ))}
            </Flex>
          </nav>

          {/* ICONS & SEARCH */}
          <Flex align="center" gap={4} className="lg:gap-12">
            <Button
              type="text"
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full transition-colors group !border-none !h-auto !w-auto flex items-center justify-center m-0"
              icon={
                <IoSearchOutline
                  size={24}
                  className="text-gray-600 group-hover:text-[#5a9a1a] transition-colors"
                />
              }
            />

            <Link
              href="/account/wishlist"
              className="p-2.5 rounded-full transition-colors group flex items-center justify-center"
            >
              <IoHeartOutline
                size={24}
                className="group-hover:text-[#5a9a1a] text-gray-600 transition-colors"
              />
            </Link>

            <Button
              type="text"
              onClick={() => dispatch(showBag())}
              className="relative p-2.5 rounded-full transition-colors group !border-none !h-auto !w-auto flex items-center justify-center m-0"
            >
              <Badge
                count={bagItems.length}
                offset={[-2, 6]}
                color="#97e13e"
                size="small"
                style={{ color: "#fff", fontWeight: 800 }}
              >
                <IoBagHandleOutline
                  size={24}
                  className="group-hover:text-[#5a9a1a] text-gray-600 transition-colors"
                />
              </Badge>
            </Button>

            <Button
              type="text"
              onClick={() => dispatch(toggleMenu(true))}
              className="lg:hidden p-2.5 rounded-full !border-none !h-auto !w-auto flex items-center justify-center m-0"
              icon={<IoMenuOutline size={28} className="text-gray-700" />}
            />
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
                  className="mb-6 lg:mb-12 lg:flex-row"
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    className="w-full lg:w-auto"
                  >
                    <Image
                      src={Logo}
                      alt="NEVERBE"
                      width={70}
                      height={30}
                      className="lg:w-[80px]"
                    />

                    <Button
                      type="text"
                      onClick={() => {
                        setIsSearchOpen(false);
                        clearSearch();
                      }}
                      className="lg:hidden !h-auto !w-auto !border-none flex items-center justify-center"
                      style={{
                        padding: 10,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.06)",
                      }}
                      icon={
                        <IoCloseOutline size={24} className="text-gray-600" />
                      }
                    />
                  </Flex>

                  {/* Search bar */}
                  <Flex className="flex-1 lg:max-w-2xl lg:mx-auto w-full">
                    <ConfigProvider
                      theme={{
                        components: {
                          Input: {
                            colorBgContainer: "#fff",
                            colorBorder: "rgba(151, 225, 62, 0.3)",
                            hoverBorderColor: "#97e13e",
                            activeBorderColor: "#97e13e",
                            activeShadow: "0 0 0 3px rgba(151, 225, 62, 0.12)",
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
                              color: "#97e13e",
                              marginRight: 8,
                              flexShrink: 0,
                            }}
                          />
                        }
                        suffix={
                          <Flex align="center">
                            {search && (
                              <Button
                                type="text"
                                onClick={() => clearSearch()}
                                className="p-1 rounded-full transition-colors shrink-0 mr-2 !h-auto !w-auto !border-none flex items-center justify-center"
                                icon={
                                  <IoCloseOutline
                                    size={18}
                                    className="text-gray-400"
                                  />
                                }
                              />
                            )}
                            {isSearching && (
                              <div
                                className="animate-spin shrink-0"
                                style={{
                                  width: 20,
                                  height: 20,
                                  border: "2px solid #97e13e",
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
                  <Button
                    type="text"
                    onClick={() => {
                      setIsSearchOpen(false);
                      clearSearch();
                    }}
                    className="hidden lg:flex !h-auto !w-auto !border-none items-center justify-center"
                    style={{
                      padding: 12,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.06)",
                      transition: "all 0.3s ease",
                    }}
                    icon={
                      <IoCloseOutline size={28} className="text-gray-600" />
                    }
                  />
                </Flex>

                {/* Results Section */}
                {showSearchResult && (
                  <div className="animate-fade">
                    <Flex
                      align="center"
                      gap={8}
                      style={{
                        marginBottom: 24,
                        paddingBottom: 16,
                        borderBottom: "1px solid rgba(151, 225, 62, 0.15)",
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
                          color: "#5a9a1a",
                        }}
                      >
                        ({items.length})
                      </Text>
                    </Flex>
                    {items.length > 0 ? (
                      <SearchDialog
                        containerStyle="shadow-none border-none grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-6"
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
