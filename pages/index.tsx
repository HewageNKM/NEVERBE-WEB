import React from 'react';
import Header from "@/components/Header";
import Hero from "@/components/sections/home/Hero";
import Popular from "@/components/sections/home/Popular";
import Arrival from "@/components/sections/home/Arrival";
import Footer from "@/components/Footer";
import Promotion from "@/components/sections/home/Promotion";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {AnimatePresence} from "framer-motion";
import LoginModel from "@/components/LoginModel";
import SearchModel from "@/components/SearchModel";
import Accessories from "@/components/sections/home/Accessories";
import CartModal from "@/components/CartModal";

const Home = () => {
    const {showLoginDialog, showSearchDialog, showCartDialog} = useSelector((state: RootState) => state.headerSlice);

    return (
        <main className="w-full overflow-clip relative h-full ">
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
