"use client"
import React, { useState } from 'react';
import { IoCartOutline, IoMenuOutline } from "react-icons/io5";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import BrandsPopupMenu from "@/components/BrandsPopupMenu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { showCart } from "@/redux/cartSlice/cartSlice";
import Image from "next/image";
import { Logo } from "@/assets/images";
import Menu from "@/components/Menu";

const Header = () => {
    const [showBrands, setShowBrands] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
    const dispatch: AppDispatch = useDispatch();

    return (
        <header className="w-full relative" onMouseLeave={() => setShowBrands(false)}>
            {/* Logo */}
            <Link href="/" className="z-50 absolute top-0 left-0">
                <Image
                    src={Logo}
                    alt="NEVERBE Logo"
                    width={200}
                    height={200}
                    className="cursor-pointer md:h-36 md:w-36 h-28 w-28"
                />
            </Link>

            {/* Mobile Header */}
            <div className="lg:hidden z-50 flex flex-row gap-3 absolute right-5 top-7">
                {/* Cart Button */}
                <button
                    onClick={() => dispatch(showCart())}
                    className="text-black rounded-full p-2 relative hover:bg-gray-200 transition-colors"
                    aria-label="View Cart"
                >
                    <IoCartOutline size={40} />
                    <div
                        className="absolute -top-2 -right-1 text-xl font-bold text-black flex justify-center items-center">
                        {cartItems.length}
                    </div>
                </button>
                {/* Menu Button */}
                <button
                    onClick={() => setShowMenu(true)}
                    className="text-black text-center p-1 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Open Menu"
                >
                    <IoMenuOutline size={40} />
                </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-row z-40 mt-16 absolute w-full justify-center items-center">
                <ul className="flex flex-row gap-8">
                    <li>
                        <Link
                            href="/shop/products"
                            className="lg:text-[1.8rem] xl:text-3xl font-bold tracking-widest hover:text-primary transition-colors"
                        >
                            Shop Now
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/shop/products"
                            onMouseEnter={() => setShowBrands(true)}
                            className="lg:text-[1.8rem] xl:text-3xl font-bold tracking-widest hover:text-primary transition-colors"
                        >
                            Brands
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/shop/products"
                            className="lg:text-[1.8rem] xl:text-3xl font-bold tracking-widest hover:text-primary transition-colors"
                        >
                            Accessories
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Cart Icon for Desktop */}
            <div className="hidden lg:flex absolute top-8 z-50 right-5 items-center gap-3">
                <button
                    onClick={() => dispatch(showCart())}
                    className="text-black rounded-full p-2 relative hover:bg-gray-200 transition-colors"
                    aria-label="View Cart"
                >
                    <IoCartOutline size={40} />
                    <div
                        className="absolute -top-2 -right-1 text-xl font-bold text-black flex justify-center items-center">
                        {cartItems.length}
                    </div>
                </button>
            </div>

            {/* Popups */}
            <AnimatePresence>
                {showBrands && <BrandsPopupMenu setShowBrands={setShowBrands} />}
                {showMenu && <Menu setShowMenu={setShowMenu} />}
            </AnimatePresence>
        </header>
    );
};

export default Header;
