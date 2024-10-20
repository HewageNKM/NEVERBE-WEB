import React, { useState } from 'react';
import DropShadow from "@/components/DropShadow";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { brands } from "@/constants";

const Menu = ({ setShowMenu }: { setShowMenu: any }) => {
    const [showBrands, setShowBrands] = useState(false);

    return (
        <DropShadow containerStyle="flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, x: '100vw' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100vw' }}
                transition={{ duration: 0.3 }}
                className="p-8 bg-white rounded-lg shadow-lg relative flex flex-col justify-center items-start max-h-screen max-w-full"
            >
                <nav className="flex flex-col mt-5 text-lg md:text-xl font-semibold justify-evenly items-start gap-5 w-full">
                    <ul className="flex flex-col gap-5 w-full">
                        <li onClick={()=>setShowMenu(false)}>
                            <Link href="/shop/products" className="transition-colors duration-200 hover:text-blue-600" aria-label="Shop Now">Shop Now</Link>
                        </li>
                        <li>
                            <button
                                onClick={() => setShowBrands(prevState => !prevState)}
                                aria-expanded={showBrands}
                                aria-controls="brand-list"
                                className="flex flex-row justify-between items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            >
                                <span>Brands</span>
                                {showBrands ? <MdKeyboardArrowUp size={30} /> : <MdKeyboardArrowDown size={30} />}
                            </button>

                            <ul
                                id="brand-list"
                                className={`overflow-auto w-full mt-2 flex flex-col gap-2 text-slate-500 transition-all duration-300 ${showBrands ? 'max-h-[50vh] block' : 'max-h-0 hidden'}`}
                                style={{ overflowY: showBrands ? 'auto' : 'hidden' }}
                            >
                                {brands.map((brand, index) => (
                                    <li key={index} onClick={() => setShowMenu(false)}>
                                        <Link href={brand.url} className="font-semibold text-lg hover:text-blue-600 transition-colors duration-200">{brand.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li onClick={()=>setShowMenu(false)}>
                            <Link href="/shop/products" className="transition-colors duration-200 hover:text-blue-600">Accessories</Link>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={() => setShowMenu(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    aria-label="Close Menu"
                >
                    <IoClose size={30} />
                </button>
            </motion.div>
        </DropShadow>
    );
};

export default Menu;
