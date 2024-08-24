import React, {useEffect} from 'react';
import Footer from "@/components/Footer";
import Products from "@/components/sections/products/Products";
import Filters from "@/components/sections/products/Filters";
import Header from "@/components/Header";
import LoginModel from "@/components/LoginModel";
import {AnimatePresence} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import SearchModel from "@/components/SearchModel";
import CartModal from "@/components/CartModal";
import {setCart} from "@/lib/features/cartSlice/cartSlice";

const Index = () => {
    const {showLoginDialog, showSearchDialog, showCartDialog} = useSelector((state: RootState) => state.headerSlice);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const cart = window.localStorage.getItem("cart");
        dispatch(setCart(cart ? JSON.parse(cart) : []))
    });

    return (
        <div className="relative justify-between flex flex-col min-h-screen overflow-clip">
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