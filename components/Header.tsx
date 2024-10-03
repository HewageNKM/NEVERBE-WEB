"use client"
import React, {useState} from 'react';
import {IoCart, IoMenu, IoSearch} from "react-icons/io5";
import Link from "next/link";
import {RxAvatar} from "react-icons/rx";
import {AnimatePresence} from "framer-motion";
import BrandsPopupMenu from "@/components/BrandsPopupMenu";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {showCart} from "@/redux/cartSlice/cartSlice";

const Header = () => {
    const [showBrands, setShowBrands] = useState(false);
    const cartItems = useSelector((state:RootState) => state.cartSlice.cart);
    const dispatch:AppDispatch = useDispatch();

    return (
        <header className="w-full mt-4 relative" onMouseLeave={() => setShowBrands(false)}>
            <ul className="flex-row z-40 hidden mt-3 absolute lg:flex w-full justify-center items-center">
                <div className="flex z-50 flex-row gap-10">
                    <Link href="/products" className="text-3xl hover:text-primary transition-all font-bold tracking-widest">
                        <h2>Shop Now</h2></Link>
                    <Link onMouseEnter={() => setShowBrands(true)} href="/products"
                          className="text-3xl hover:text-primary transition-all font-bold tracking-widest">
                        <h2>Brands</h2></Link>
                    <Link href="/products" className="text-3xl hover:text-primary transition-all font-bold tracking-widest">
                        <h2>Accessories</h2></Link>
                </div>
            </ul>
            <div className="px-8 pt-4  flex items-center justify-between gap-10 relative">
                <Link href="/" className="text-3xl z-50 tracking-wide md:text-4xl font-bold">NEVERBE</Link>
                <div className="lg:flex-row z-50 absolute right-2 justify-center items-center gap-5 hidden lg:flex">
                    <button onClick={() => dispatch(showCart())} className="bg-primary rounded-full p-1 relative">
                        <IoCart size={40} color="white"/>
                        <div
                            className="absolute -top-5 -right-2 font-bold bg-primary text-white rounded-full w-7 h-7 flex justify-center items-center">{cartItems.length}</div>
                    </button>
                    <button className="bg-primary text-center p-1 text-white rounded-lg"><IoSearch
                        size={40} color="white"/></button>
                    <div
                        className="bg-primary text-white font-bold tracking-wider px-4 py-1 cursor-pointer rounded-lg flex flex-row justify-center items-center gap-2">
                        <RxAvatar size={40} color="white"/>
                        <button>Sign In/Up</button>
                    </div>
                </div>
                <div className="lg:hidden flex flex-row gap-2 ">
                    <button onClick={() => dispatch(showCart())} className="bg-primary rounded-full p-1 relative">
                        <IoCart size={35} color="white"/>
                        <div
                            className="absolute -top-5 -right-2 font-bold bg-primary text-white rounded-full w-7 h-7 flex justify-center items-center">{cartItems.length}</div>
                    </button>
                    <button className="bg-primary text-center p-1 text-white rounded-lg">
                        <IoMenu size={40} color="white"/>
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {showBrands && (
                    <BrandsPopupMenu setShowBrands={setShowBrands}/>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;