'use client';
import React, {useState} from 'react';
import Link from "next/link";
import FormField from "@/components/FormField";
import {CiSearch, CiShoppingCart} from "react-icons/ci";
import {VscAccount} from "react-icons/vsc";
import {CgMenu} from "react-icons/cg";
import {menu} from "@/constants";

const Header = ({containerStyle}:{containerStyle:string}) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className={`w-full flex-row ${containerStyle}`}>
            <header className="flex relative w-full items-center">
                <div className="absolute left-0 top-0">
                    <Link href="/"><p className="text-3xl font-bold">Never Be</p></Link>
                </div>
                <nav className="lg:flex w-full justify-center hidden items-center gap-8">
                    <Link href=""
                          className="font-bold text-center h-[2rem] duration-100 hover:border-b-2 border-b-black text-xl"
                          onMouseEnter={() => setShowMenu(true)}>Women</Link>
                    <Link href=""
                          className="font-bold duration-100 h-[2rem] hover:border-b-2 border-b-black text-xl"
                          onMouseEnter={() => setShowMenu(true)}>Men</Link>
                </nav>
                <div className="flex absolute items-center justify-center right-0 top-0 gap-2">
                    <div className="relative hidden lg:flex">
                        <FormField containerStyles="" placeholder="Search"
                                   otherStyles="w-[10rem] hover:bg-gray-200  pl-3 pt-1 pb-1 pr-10 h-[2rem]"/>
                        <button
                            className="absolute flex items-center justify-center h-[2rem] text-center hover:bg-gray-200 rounded-full top-0 w-[2rem] right-0">
                            <CiSearch size={18}/></button>
                    </div>
                    <button className="hover:bg-gray-100 lg:hidden relative rounded-full p-1 lg:p-1.5">
                        <CiSearch size={25}/>
                    </button>
                    <Link href="/auth" className="hover:bg-gray-100 rounded-full p-1 lg:p-2">
                        <VscAccount size={25}/>
                    </Link>
                    <div className="hover:bg-gray-100 relative rounded-full p-1 lg:p-1.5">
                        <Link href="" className="">
                            <CiShoppingCart size={25}/>
                        </Link>
                        <div className="absolute -top-2 -right-2 bg-black text-sm text-white rounded-full w-5 h-5 flex items-center justify-center">{0}</div>
                    </div>
                    <div className="hover:bg-gray-100 lg:hidden relative rounded-full lg:p-1.5 p-1">
                        <CgMenu size={25}/>
                    </div>
                </div>
                <div>
                </div>
            </header>
            <div onMouseOut={() => setShowMenu(false)} onMouseOver={() => setShowMenu(true)}
                 className={`w-[97vw] -z-50  absolute gap-12 justify-center items-center duration-[800ms] transition-all ${showMenu ? 'top-[3rem] z-50' : '-top-[100%]'} `}>
                <div className="mt-7 gap-3 bg-white overflow-clip p-5 w-full flex justify-center items-center flex-col">
                    <div className="flex gap-5 flex-wrap">
                        {menu.map((item, index) => (
                            <Link key={index} href={item.url}
                                  className="font-semibold capitalize text-xl h-[2rem] border-b-black hover:border-b-2">{item.title}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;