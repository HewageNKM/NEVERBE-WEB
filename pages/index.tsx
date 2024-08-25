import React, {useEffect} from 'react';
import Hero from "@/components/sections/home/Hero";
import Popular from "@/components/sections/home/Popular";
import Arrival from "@/components/sections/home/Arrival";
import Promotion from "@/components/sections/home/Promotion";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {AnimatePresence} from "framer-motion";
import LoginModel from "@/components/LoginModel";
import SearchModel from "@/components/SearchModel";
import Accessories from "@/components/sections/home/Accessories";
import CartModal from "@/components/CartModal";
import {setCart} from "@/lib/features/cartSlice/cartSlice";

const Home = () => {
    const {showLoginDialog, showSearchDialog, showCartDialog} = useSelector((state: RootState) => state.headerSlice);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const cart = window.localStorage.getItem("cart");
        dispatch(setCart(cart ? JSON.parse(cart) : []))
    });

    return (
        <main className="w-full overflow-clip relative flex-col justify-between min-h-screen">
            <Hero containerStyles=""/>
            <Promotion containerStyles="px-4 py-4"/>
            <Popular containerStyles="px-4 py-4"/>
            <Arrival containerStyles="px-4 py-4"/>
            <Accessories containerStyles="px-4 py-4"/>
            <AnimatePresence>
                {showLoginDialog && (
                    <LoginModel/>
                )}
                {showSearchDialog && (
                    <SearchModel/>
                )}
                {showCartDialog && (
                    <CartModal/>
                )}
            </AnimatePresence>
        </main>
    )
}

export default Home;
