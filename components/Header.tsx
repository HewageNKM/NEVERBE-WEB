"use client"
import React, {useState} from 'react';
import {IoCart, IoCartOutline, IoMenu, IoMenuOutline} from "react-icons/io5";
import Link from "next/link";
import {AnimatePresence} from "framer-motion";
import BrandsPopupMenu from "@/components/BrandsPopupMenu";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {showCart} from "@/redux/cartSlice/cartSlice";
import Image from "next/image";
import {Logo} from "@/assets/images";
import Menu from "@/components/Menu";

const Header = () => {
    const [showBrands, setShowBrands] = useState(false);
    const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
    const dispatch: AppDispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="w-full relative" onMouseLeave={() => setShowBrands(false)}>
            <Link href="/" className="z-50 absolute top-0 left-0 font-bold">
                <Image src={Logo} alt="NEVERBE_Logo" width={200} height={200}
                       className="cursor-pointer md:h-36 md:w-36 h-28 w-28"/>
            </Link>
            <div className="lg:hidden z-50 flex flex-row gap-2 absolute right-5 top-7">
                <button onClick={() => dispatch(showCart())} className="text-black rounded-full p-2 relative">
                    <IoCartOutline size={40}/>
                    <div
                        className="absolute -top-2 -right-1 text-xl font-bold text-black flex justify-center items-center">{cartItems.length}</div>
                </button>
                <button onClick={() => setShowMenu(true)}
                        className="text-black text-center p-1 rounded-full">
                    <IoMenuOutline size={40}/>
                </button>
            </div>
            <div className="flex-row z-40 hidden mt-16 absolute lg:flex w-full justify-center items-center">
            <ul className="flex z-50 flex-row gap-10 lg:gap-8">
                    <li>
                        <Link href="/shop/products"
                              className="lg:text-[1.8rem] xl:text-3xl hover:text-primary transition-all font-bold tracking-widest">
                            <h2>Shop Now</h2></Link>
                    </li>
                    <li>
                        <Link onMouseEnter={() => setShowBrands(true)} href="/shop/products"
                              className="lg:text-[1.8rem] xl:text-3xl hover:text-primary transition-all font-bold tracking-widest">
                            <h2>Brands</h2></Link>
                    </li>
                    <li>
                        <Link href="/shop/products"
                              className="lg:text-[1.8rem] xl:text-3xl hover:text-primary transition-all font-bold tracking-widest">
                            <h2>Accessories</h2>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="px-8 pt-12 flex justify-between gap-10 relative">
                <div className="lg:flex-row z-50 absolute right-5 justify-center items-center gap-3 hidden lg:flex">
                    <button onClick={() => dispatch(showCart())} className="text-black rounded-full p-2 relative">
                        <IoCartOutline size={40}/>
                        <div
                            className="absolute -top-2 -right-1 text-xl font-bold text-black flex justify-center items-center">{cartItems.length}</div>
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {showBrands && (
                    <BrandsPopupMenu setShowBrands={setShowBrands}/>
                )}
                {showMenu && (
                    <Menu setShowMenu={setShowMenu} />
                )}
            </AnimatePresence>

        </header>
    );
};

export default Header;