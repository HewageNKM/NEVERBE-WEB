import DropShadow from "@/components/DropShadow";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import { getAlgoliaClient } from "@/util";
import SearchDialog from "@/components/SearchDialog";
import React, { useState } from "react";

const Menu = () => {
    const dispatch: AppDispatch = useDispatch();
    const searchClient = getAlgoliaClient();
    const [search, setSearch] = useState("");
    const [items, setItems] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResult, setShowSearchResult] = useState(false);

    const onSearch = async (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(evt.target.value);
        try {
            if (evt.target.value.toString().trim().length < 3) {
                setItems([]);
                setShowSearchResult(false);
                return;
            }
            setIsSearching(true);
            const search = evt.target.value.toString().trim();
            const searchResults = await searchClient.search({
                requests: [{ indexName: "inventory_index", query: search, hitsPerPage: 30 }],
            });
            const filteredResults = searchResults.results[0].hits.filter(
                (item) => item.status === "Active" && item.listing === "Active"
            );
            setItems(filteredResults);
            setShowSearchResult(true);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleOverlayClick = () => {
        dispatch(toggleMenu(false));
    };

    return (
        <DropShadow
            containerStyle="fixed inset-0 flex justify-end items-center bg-black/50"
            onClick={handleOverlayClick} // Handles the click on the overlay
        >
            <motion.div
                initial={{ opacity: 0, x: "100vw" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100vw" }}
                transition={{ duration: 0.3 }}
                className="w-[80vw] h-full bg-white rounded-l-sm shadow-lg relative flex flex-col overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevents propagation of clicks inside the menu
            >
                <div className="relative">
                    <input
                        onChange={onSearch}
                        value={search}
                        type="text"
                        placeholder="Search"
                        className="w-full p-3 border-b-2 border-gray-200 focus:outline-none shadow-custom"
                    />
                    <button className="absolute right-0 top-0 p-3">
                        {isSearching ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-2 border-t-primary-200 rounded-full animate-spin absolute top-2 right-2 transition-all duration-300"></div>
                        ) : (
                            <IoSearch size={20} className="text-gray-600 absolute top-3 right-2" />
                        )}
                    </button>
                </div>
                {showSearchResult && items.length > 0 && (
                    <SearchDialog
                        containerStyle="relative"
                        results={items}
                        onClick={() => {
                            setShowSearchResult(false);
                            setSearch("");
                            dispatch(toggleMenu(false));
                        }}
                    />
                )}
                {/* Navigation */}
                <nav className="text-lg font-semibold flex flex-col">
                    <Link
                        href="/"
                        className="text-gray-700 p-3 border-b-2 hover:text-primary-100 transition-colors duration-200"
                        onClick={() => dispatch(toggleMenu(false))}
                    >
                        Home
                    </Link>
                    <Link
                        href="/collections/products"
                        className="text-gray-700 p-3 border-b-2 hover:text-primary-100 transition-colors duration-200"
                        onClick={() => dispatch(toggleMenu(false))}
                    >
                        Shop
                    </Link>
                    <Link
                        href="/aboutUs"
                        className="text-gray-700 p-3 border-b-2 hover:text-primary-100 transition-colors duration-200"
                        onClick={() => dispatch(toggleMenu(false))}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/contact"
                        className="text-gray-700 p-3 border-b-2 hover:text-primary-100 transition-colors duration-200"
                        onClick={() => dispatch(toggleMenu(false))}
                    >
                        Contact Us
                    </Link>
                </nav>
            </motion.div>
        </DropShadow>
    );
};

export default Menu;
