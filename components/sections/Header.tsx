'use client';
import React, {useState} from 'react';
import Link from "next/link";
import FormField from "@/components/FormField";
import {CiSearch, CiShoppingCart} from "react-icons/ci";
import {VscAccount} from "react-icons/vsc";
import {useGlobalContext} from "@/context/GlobalProvider";

const Header = () => {
    // @ts-ignore
    const {cart} = useGlobalContext();
    const [showMenu, setShowMenu] = useState(false);

    console.log(showMenu)
    return (
        <div className="w-full flex-row">
            <header className="flex relative w-full items-center">
                <div className="absolute left-0 top-0">
                    <p className="text-3xl font-bold">Never Be</p>
                    {/* <Image alt="nevebe_logo" src=""></Image>*/}
                </div>
                <nav className="flex w-full justify-center items-center gap-8">
                    <Link href=""
                          className="font-medium text-center h-[2rem] duration-100 hover:border-b-2 border-b-black text-xl"
                          onMouseEnter={() => setShowMenu(true)}>Women</Link>
                    <Link href=""
                          className="font-medium duration-100 h-[2rem] hover:border-b-2 border-b-black text-xl"
                          onMouseEnter={() => setShowMenu(true)}>Men</Link>
                </nav>
                <div className="flex absolute items-center justify-center right-0 top-0 gap-6">
                    <div className="relative">
                        <FormField containerStles="" placeholder="Search"
                                   otherStyle="w-[10rem] hover:bg-gray-200  pl-3 pt-1 pb-1 pr-10 h-[2rem]"/>
                        <button
                            className="absolute flex items-center justify-center h-[2rem] text-center hover:bg-gray-200 rounded-full top-0 w-[2rem] right-0">
                            <CiSearch size={18}/></button>
                    </div>
                    <Link href="" className="hover:bg-gray-100 rounded-full p-2">
                        <VscAccount size={22}/>
                    </Link>
                    <div className="hover:bg-gray-100 relative rounded-full p-1.5">
                        <Link href="" className="">
                            <CiShoppingCart size={25}/>
                        </Link>
                        <div
                            className="absolute -top-2 -right-2 bg-black text-sm text-white rounded-full w-5 h-5 flex items-center justify-center">{cart?.length || 0}</div>
                    </div>
                </div>
                <div>
                </div>
            </header>
            <div onMouseOut={() => setShowMenu(false)} onMouseOver={() => setShowMenu(true)} className={`w-[95vw] -z-50 absolute gap-12 flex justify-center items-center duration-[800ms] transition-all ${showMenu ? 'top-[3rem] z-0' : '-top-[100%]'} `}>
                <div className="mt-7 gap-3 p-5 w-fit flex justify-center items-center flex-col">
                    <div className="flex gap-5">
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">Nike</Link>
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">Adidas</Link>
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">Puma</Link>
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">Louis Vuitton</Link>
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">Cross</Link>
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">Polo</Link>
                    </div>
                    <div className="flex gap-5">
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">New Balance</Link>
                        <Link href="" className="font-bold text-xl h-[2rem] border-b-black hover:border-b-2">Other</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;