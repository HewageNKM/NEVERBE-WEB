"use client"
import React, {useState} from 'react';
import {IoCart, IoMenu, IoSearch} from "react-icons/io5";
import Link from "next/link";
import {RxAvatar} from "react-icons/rx";
import {AnimatePresence} from "framer-motion";
import BrandsPopupMenu from "@/components/BrandsPopupMenu";

const Header = () => {
    const [showBrands, setShowBrands] = useState(false);
    return (
        <header className="w-full relative" onMouseLeave={() => setShowBrands(false)}>
            <ul className="flex-row z-40 hidden absolute mt-5 lg:flex w-full justify-center items-center">
                <div className="flex flex-row gap-10">
                    <Link onMouseEnter={() => setShowBrands(true)} href=""
                          className="text-3xl hover:text-primary transition-all font-bold tracking-widest">
                        <h2>Brands</h2></Link>
                    <Link href="" className="text-3xl hover:text-primary transition-all font-bold tracking-widest">
                        <h2>Accessories</h2></Link>
                </div>
            </ul>
            <div className="px-8 pt-4 flex items-center justify-between gap-10 relative">
                <Link href="/" className="text-xl z-50 tracking-wide md:text-3xl font-bold">NEVERBE</Link>
                <div className="lg:flex-row absolute right-2 justify-center items-center gap-5 hidden lg:flex">

                    <button className="bg-primary text-center p-1 text-white rounded-lg"><IoSearch
                        size={40} color="white"/></button>
                    <button className="bg-primary rounded-full p-1">
                        <IoCart size={40} color="white"/>
                    </button>
                    <div
                        className="bg-primary text-white font-bold tracking-wider px-4 py-1 cursor-pointer rounded-lg flex flex-row justify-center items-center gap-2">
                        <RxAvatar size={40} color="white"/>
                        <button>Sign In/Up</button>
                    </div>
                </div>
                <div className="lg:hidden block ">
                    <button>
                        <IoMenu size={40}/>
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