import React from 'react';
import Footer from "@/components/sections/Footer";
import ProductHero from "@/components/sections/ProductHero";
import Products from "@/components/sections/Products";
import Header from "@/components/sections/Header";
import ReviewModel from "@/components/ReviewModel";
import LoginModel from "@/components/LoginModel";
import {AnimatePresence} from "framer-motion";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";

const Index = () => {
    const showLoginDialog = useSelector((state:RootState) => state.headerSlice.showLoginDialog);
    return (
        <div className="w-full relative overflow-clip h-full">
            <Header containerStyles='px-5 md:px-10 py-4'/>
            <ProductHero containerStyles='px-5 md:px-10 py-4'/>
            <Products containerStyles='px-5 md:px-10 py-4'/>
            <Footer/>
            <AnimatePresence>
                {showLoginDialog && (
                    <LoginModel/>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Index;