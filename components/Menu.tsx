"use client";
import React, { useState } from "react";
import DropShadow from "@/components/DropShadow";
import Link from "next/link";
import { motion } from "framer-motion";
import {IoArrowBack, IoArrowForward, IoClose} from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Brand } from "@/interfaces";
import {BiRightArrow} from "react-icons/bi";
import {FaArrowRightArrowLeft} from "react-icons/fa6"; // Assuming Brand type is defined

const Menu = ({ setShowMenu, brands }: { setShowMenu: any; brands: Brand[] }) => {
    const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

    const toggleBrand = (brandValue: string) => {
        setExpandedBrand((prev) => (prev === brandValue ? null : brandValue));
    };

    return (
        <DropShadow containerStyle="fixed inset-0 flex justify-end items-center bg-black/50">
            <motion.div
                initial={{ opacity: 0, x: "100vw" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100vw" }}
                transition={{ duration: 0.3 }}
                className="w-fit h-fit bg-white rounded-l-lg shadow-lg relative flex flex-col p-6 overflow-y-auto"
            >
                {/* Close Button */}
                <button
                    onClick={() => setShowMenu(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    aria-label="Close Menu"
                >
                    <IoArrowForward size={27}/>
                </button>

                {/* Navigation */}
                <nav className="mt-10 text-lg font-semibold flex flex-col gap-6">
                    {/* Shop Now Link */}
                    <Link
                        href="/shop/products"
                        className="text-gray-700 p-3 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setShowMenu(false)}
                    >
                        Shop Now
                    </Link>

                    {/* Brands Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleBrand("brands")}
                            aria-expanded={!!expandedBrand}
                            className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            <span>Brands</span>
                            {expandedBrand ? (
                                <MdKeyboardArrowUp size={24} />
                            ) : (
                                <MdKeyboardArrowDown size={24} />
                            )}
                        </button>
                        {expandedBrand && (
                            <ul className="mt-3 max-h-60 overflow-auto flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-inner">
                                {brands.map((brand) => (
                                    <li key={brand.value} className="flex flex-col">
                                        <button
                                            onClick={() => toggleBrand(brand.value)}
                                            aria-expanded={expandedBrand === brand.value}
                                            className="w-full text-left flex justify-between items-center font-medium text-gray-800 hover:text-blue-500"
                                        >
                                            {brand.name}
                                            {expandedBrand === brand.value ? (
                                                <MdKeyboardArrowUp size={20} />
                                            ) : (
                                                <MdKeyboardArrowDown size={20} />
                                            )}
                                        </button>
                                        {expandedBrand === brand.value && (
                                            <ul className="mt-2 pl-4 flex flex-col gap-3 text-sm text-gray-600">
                                                {brand.types.map((type) => (
                                                    <li key={type.url}>
                                                        <Link
                                                            href={type.url}
                                                            className="hover:text-blue-500"
                                                            onClick={() => setShowMenu(false)}
                                                        >
                                                            {type.name}
                                                        </Link>
                                                        <ul className="mt-2 pl-4 flex flex-col gap-2">
                                                            {type.titles.map((title) => (
                                                                <li key={title.url}>
                                                                    <Link
                                                                        href={title.url}
                                                                        className="hover:text-blue-500"
                                                                        onClick={() => setShowMenu(false)}
                                                                    >
                                                                        {title.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Accessories Link */}
                    <Link
                        href="/shop/products/accessories"
                        className="text-gray-700 p-3 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setShowMenu(false)}
                    >
                        Accessories
                    </Link>
                </nav>
            </motion.div>
        </DropShadow>
    );
};

export default Menu;
