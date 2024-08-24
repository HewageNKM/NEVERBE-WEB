import React from 'react';
import Footer from "@/components/Footer";
import ProductHero from "@/components/sections/products/ProductHero";
import Products from "@/components/sections/products/Products";
import Header from "@/components/Header";
import LoginModel from "@/components/LoginModel";
import {AnimatePresence} from "framer-motion";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import SearchModel from "@/components/SearchModel";
import CartModal from "@/components/CartModal";

const Index = () => {
    const {showLoginDialog, showSearchDialog, showCartDialog} = useSelector((state: RootState) => state.headerSlice);
    return (
        <div className="w-full relative justify-between flex flex-col overflow-clip min-h-screen">
            <ProductHero containerStyles='px-5 md:px-10 py-4'/>
            <Products containerStyles='px-5 md:px-10 py-4'/>
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
        </div>
    );
};

export default Index;