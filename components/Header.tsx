"use client"
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {showCart} from "@/redux/cartSlice/cartSlice";
import {IoCartOutline, IoMenu, IoSearch} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import {Banner, Logo} from "@/assets/images";

const Header = () => {
    const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
    const dispatch: AppDispatch = useDispatch();

    return (
        <header className="z-50 bg-black w-full">
            <div className="flex justify-between items-center p-4">
                <figure className="hidden lg:block p-1">
                    <Link href={"/"}>
                        <Image src={Logo} alt={"Logo"} width={100} height={100}/>
                    </Link>
                </figure>
                <figure className="lg:hidden block">
                    <Link href={"/"}>
                        <Image src={Banner} alt={"Banner"} width={180} height={180}/>
                    </Link>
                </figure>
                <nav className="hidden lg:block">
                    <ul className="flex text-white gap-4 text-xl">
                        <li>
                            <Link href={"/"} className="hover:text-primary-100">Home</Link>
                        </li>
                        <li>
                            <Link href={"/collections/products"} className="hover:text-primary-100">Shop</Link>
                        </li>
                        <li>
                            <Link href={"/about"} className="hover:text-primary-100">About Us</Link>
                        </li>
                        <li>
                            <Link href={"/contact"} className="hover:text-primary-100" s>Contact Us</Link>
                        </li>
                    </ul>
                </nav>
                <div className="flex text-white  flex-row gap-3 items-center">
                    <div className="relative hidden lg:block w-fit">
                        <IoSearch size={20} className="top-2 text-gray-600 right-2 absolute"/>
                        <input type="text" placeholder="search for products"
                               className="py-2 pr-8 text-black px-4 w-[15rem] rounded-md text-sm"/>
                    </div>
                    <div className="relative p-2 hover:bg-gray-900 rounded-full">
                        <button className="text-white" onClick={() => dispatch(showCart())}>
                            <IoCartOutline size={30}/>
                        </button>
                        <span className="absolute -top-2 p-1 right-0 bg-primary text-white text-xs rounded-full ">
                        {cartItems.length}</span>
                    </div>
                    <div className="lg:hidden block">
                        <button>
                            <IoMenu size={30}/>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
