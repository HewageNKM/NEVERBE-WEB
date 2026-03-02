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
    <div className="w-full z-50">
      {/* 1. UTILITY TOP BAR */}
      <Flex
        justify="space-between"
        align="center"
        className="hidden lg:flex px-12 py-2"
        style={{
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase" as const,
          letterSpacing: "0.15em",
          background: "rgba(248, 250, 245, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(151, 225, 62, 0.08)",
        }}
      >
        <Flex gap={24} align="center">
          <Link
            href="/contact"
            className="hover:text-[#97e13e] transition-colors text-gray-500"
          >
            Help
          </Link>
          <Text type="secondary" style={{ opacity: 0.2, fontSize: 10 }}>
            |
          </Text>
          <Link
            href="/account/register"
            className="hover:text-[#97e13e] transition-colors text-gray-800"
          >
            Join Us
          </Link>
        </Flex>
        <Flex gap={16} align="center">
          <Link
            href={user ? "/account" : "/account/login"}
            className="hover:text-[#97e13e] transition-colors flex items-center gap-1"
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(0,0,0,0.4)",
                textTransform: "uppercase",
              }}
            >
              Hi,
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 900,
                color: "rgba(0,0,0,0.8)",
                textTransform: "uppercase",
              }}
            >
              {user ? user.displayName?.split(" ")[0] : "Sign In"}
            </Text>
          </Link>
        </Flex>
      </Flex>

      <header
        className="sticky top-0 w-full transition-all duration-300 z-50"
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(151, 225, 62, 0.1)",
        }}
      >
        <SeasonalPromo season={season} />

        <Flex
          justify="space-between"
          align="center"
          className="max-w-content mx-auto px-4 lg:px-12 h-[64px] lg:h-[80px]"
        >
          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <Image
              src={Logo}
              alt="NEVERBE"
              width={130}
              height={50}
              className="object-contain mix-blend-multiply transition-transform hover:scale-110 active:scale-95 duration-300"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <Flex component="ul" gap={32} className="m-0 p-0 list-none">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.link}
                    className="relative pb-2 text-[13px] font-bold uppercase tracking-tight hover:text-[#97e13e] transition-colors group"
                  >
                    {item.title}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
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
              className="p-2.5 hover:bg-surface-2 rounded-full transition-colors group border-none h-auto w-auto flex items-center justify-center m-0"
              icon={
                <IoSearchOutline
                  size={24}
                  className="group-hover:text-[#97e13e] transition-colors"
                />
              }
            />

            <Link
              href="/account/wishlist"
              className="p-2.5 hover:bg-surface-2 rounded-full transition-colors group flex items-center justify-center"
            >
              <IoHeartOutline
                size={24}
                className="group-hover:text-[#97e13e] text-black transition-colors"
              />
            </Link>

            <Button
              type="text"
              onClick={() => dispatch(showBag())}
              className="relative p-2.5 hover:bg-surface-2 rounded-full transition-colors group border-none h-auto w-auto flex items-center justify-center m-0"
            >
              <Badge
                count={bagItems.length}
                offset={[-2, 6]}
                color="#97e13e"
                size="small"
                style={{ color: "#000", fontWeight: 800 }}
              >
                <IoBagHandleOutline
                  size={24}
                  className="group-hover:text-[#97e13e] text-black transition-colors"
                />
              </Badge>
            </Button>

            <Button
              type="text"
              onClick={() => dispatch(toggleMenu(true))}
              className="lg:hidden p-2.5 hover:bg-surface-2 rounded-full border-none h-auto w-auto flex items-center justify-center m-0"
              icon={<IoMenuOutline size={28} />}
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
              className="fixed inset-0 z-[100] overflow-y-auto"
              style={{
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(32px) saturate(200%)",
                WebkitBackdropFilter: "blur(32px) saturate(200%)",
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
                      className="mix-blend-multiply lg:w-[80px]"
                    />

                    <Button
                      type="text"
                      onClick={() => {
                        setIsSearchOpen(false);
                        clearSearch();
                      }}
                      className="lg:hidden h-auto w-auto border-none flex items-center justify-center"
                      style={{
                        padding: 10,
                        borderRadius: "50%",
                        background: "rgba(151, 225, 62, 0.1)",
                      }}
                      icon={<IoCloseOutline size={24} />}
                    />
                  </Flex>

                  {/* Search bar */}
                  <Flex className="flex-1 lg:max-w-2xl lg:mx-auto w-full">
                    <ConfigProvider
                      theme={{
                        components: {
                          Input: {
                            colorBgContainer: "transparent",
                            colorBorder: "rgba(151, 225, 62, 0.2)",
                            hoverBorderColor: "#97e13e",
                            activeBorderColor: "#97e13e",
                            activeShadow: "0 0 0 3px rgba(151, 225, 62, 0.1)",
                            borderRadius: 99,
                          },
                        },
                      }}
                    >
                      <Input
                        autoFocus
                        size="large"
                        placeholder="Search shoes..."
                        className="w-full"
                        style={{
                          padding: "12px 24px",
                          fontSize: 16,
                          fontWeight: 700,
                          background: "rgba(248, 250, 245, 0.8)",
                          backdropFilter: "blur(12px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
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
                                className="p-1 hover:bg-surface rounded-full transition-colors shrink-0 mr-2 h-auto w-auto border-none flex items-center justify-center"
                                icon={
                                  <IoCloseOutline
                                    size={18}
                                    className="text-muted"
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
                    className="hidden lg:flex h-auto w-auto border-none items-center justify-center"
                    style={{
                      padding: 12,
                      borderRadius: "50%",
                      background: "rgba(151, 225, 62, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    icon={<IoCloseOutline size={28} />}
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
                        borderBottom: "1px solid rgba(151, 225, 62, 0.1)",
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
                          color: "#97e13e",
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
                            color: "rgba(0,0,0,0.15)",
                            marginBottom: 16,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 900,
                            textTransform: "uppercase",
                            color: "rgba(0,0,0,0.2)",
                          }}
                        >
                          No matches found
                        </Text>
                        <Text
                          type="secondary"
                          style={{ marginTop: 8, fontSize: 13 }}
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
