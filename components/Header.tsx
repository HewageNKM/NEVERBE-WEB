import React from 'react';
import {IoCart, IoMenu, IoSearch} from "react-icons/io5";
import Link from "next/link";
import {RxAvatar} from "react-icons/rx";
import {menuItems} from "@/constants";

const Header = () => {
    return (
        <header className="w-full">
            <div className="px-8 pt-4 flex items-center gap-10 relative">
                <Link href="/" className="text-xl tracking-wide md:text-3xl font-bold">NEVERBE</Link>
                <ul className="flex-row hidden absolute lg:flex w-full justify-center items-center">
                    <div className="flex flex-row gap-10">
                        {menuItems.map((item, index) => (
                            <li key={index} className="text-centertext-lg font-medium hover:text-primary lg:transition-all lg:duration-500 md:text-2xl">
                                <Link href={item.url}>{item.title}</Link>
                            </li>
                        ))}
                    </div>
                </ul>
                <div className="lg:flex-row absolute right-2 justify-center items-center gap-5 hidden lg:flex">
                    <div className="relative">
                        <input type="text"
                               className="bg-gray-200 w-[16rem] h-10 rounded-lg px-4 py-2 pr-16 font-light text-primary"
                               placeholder="Search"/>
                        <button className="bg-primary text-white px-4 h-10 py-2 rounded-lg absolute right-0"><IoSearch/>
                        </button>
                    </div>
                    <button className="bg-primary rounded-full p-1">
                        <IoCart size={40} color="white"/>
                    </button>
                    <div
                        className="bg-primary text-white font-medium px-4 py-1 cursor-pointer rounded-lg flex flex-row justify-center items-center gap-2">
                        <RxAvatar size={40} color="white"/>
                        <button>Sign In/Up</button>
                    </div>
                </div>
                <div className="lg:hidden block">
                    <button>
                        <IoMenu size={40}/>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;