"use client"
import React, {useEffect, useState} from "react";
import DropShadow from "@/components/DropShadow";
import Link from "next/link";
import {motion} from "framer-motion";
import {IoClose} from "react-icons/io5";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {Brand} from "@/interfaces";
import {auth} from "@/firebase/firebaseClient";
import axios from "axios";

const Menu = ({setShowMenu}: { setShowMenu: any }) => {
    const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
    const {user} = useSelector((state: RootState) => state.authSlice);
    const [brands, setBrands] = useState<Brand[] | []>([])
    useEffect(() => {
        fetchBrands();
    }, [user]);
    const fetchBrands = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await axios({
                method: 'GET',
                url: '/api/brands',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            setBrands(res.data);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    const toggleBrand = (brandValue: string) => {
        setExpandedBrand((prev) => (prev === brandValue ? null : brandValue));
    };

    return (
        <DropShadow containerStyle="fixed inset-0 flex justify-end items-start">
            <motion.div
                initial={{opacity: 0, x: "100vw"}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: "100vw"}}
                transition={{duration: 0.3}}
                className="w-[80vw] h-full bg-white rounded-l-lg shadow-lg relative flex flex-col p-6"
            >
                <button
                    onClick={() => setShowMenu(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    aria-label="Close Menu"
                >
                    <IoClose size={30}/>
                </button>
                <nav className="mt-8 text-lg font-semibold flex flex-col gap-5">
                    <Link
                        href="/shop/products"
                        className="hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setShowMenu(false)}
                    >
                        Shop Now
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => toggleBrand("brands")}
                            aria-expanded={!!expandedBrand}
                            className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                        >
                            <span>Brands</span>
                            {expandedBrand ? (
                                <MdKeyboardArrowUp size={24}/>
                            ) : (
                                <MdKeyboardArrowDown size={24}/>
                            )}
                        </button>
                        {expandedBrand && (
                            <ul
                                className="mt-2 max-h-[50vh] overflow-auto flex flex-col gap-3 bg-gray-50 p-3 rounded-md shadow-inner"
                                id="brand-list"
                            >
                                {brands.map((brand) => (
                                    <li key={brand.value} className="flex flex-col">
                                        <button
                                            onClick={() => toggleBrand(brand.value)}
                                            aria-expanded={expandedBrand === brand.value}
                                            className="w-full text-left flex justify-between items-center hover:text-blue-600"
                                        >
                                            {brand.name}
                                            {expandedBrand === brand.value ? (
                                                <MdKeyboardArrowUp size={20}/>
                                            ) : (
                                                <MdKeyboardArrowDown size={20}/>
                                            )}
                                        </button>
                                        {expandedBrand === brand.value && (
                                            <ul className="mt-2 pl-4 flex flex-col gap-2 text-sm text-slate-600">
                                                {brand.titles.map((title) => (
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
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Link
                        href="/shop/products/accessories"
                        className="hover:text-blue-600 transition-colors duration-200"
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
