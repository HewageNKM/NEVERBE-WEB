'use client';
import React from 'react';
import Link from "next/link";
import {CiSearch, CiShoppingCart} from "react-icons/ci";
import {CgMenu} from "react-icons/cg";
import {menu} from "@/constants";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {setShowMenu, showLoginDialog, showSearchDialog} from "@/lib/features/headerSlice/headerSlice";
import {RxAvatar} from "react-icons/rx";
import { Button } from '@mui/material';
import MenuSlider from "@/components/MenuSlider";

const Header = ({containerStyles}: { containerStyles: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const {isLoggedIn} = useSelector((state: RootState) => state.authSlice);
    return (
        <div>
            <div className={`w-full flex-row ${containerStyles} mb-10`}>
                <header className="flex relative w-full items-center">
                    <div className="absolute left-0 top-0">
                        <Link href="/"><p className="text-3xl font-bold">Never Be</p></Link>
                    </div>
                    <nav onMouseLeave={()=>dispatch(setShowMenu(false))} onMouseEnter={()=> dispatch(setShowMenu(true))} className="lg:flex w-full justify-center hidden items-center gap-8">
                        <MenuSlider menu={menu}/>
                    </nav>
                    <div className="flex flex-row absolute gap-2 items-center justify-center right-0 top-0">
                        <button className="rounded-full p-1 lg:p-1.5" onClick={() => {
                            dispatch(showSearchDialog())
                        }}>
                            <CiSearch size={25}/>
                        </button>
                        <button onClick={() => dispatch(showLoginDialog())}
                                className="rounded-full text-black p-1 lg:p-2">
                            <RxAvatar size={25}/>
                        </button>
                        <div className="relative rounded-full p-1 lg:p-1.5">
                            <Link href="" className="">
                                <CiShoppingCart size={25}/>
                            </Link>
                            <div className="absolute -top-2 -right-2 bg-primary text-sm text-white rounded-full w-5 h-5 flex items-center justify-center">{0}</div>
                        </div>
                        <div className="relative rounded-full p-1 lg:p-1.5 lg:hidden">
                            <CgMenu size={25}/>
                        </div>
                    </div>
                    <div>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default Header;