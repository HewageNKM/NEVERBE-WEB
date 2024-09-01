import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {setCart} from "@/lib/features/cartSlice/cartSlice";
import Products from "@/components/sections/products/Products";
import {AnimatePresence} from "framer-motion";
import LoginModel from "@/components/LoginModel";
import SearchModel from "@/components/SearchModel";
import CartModal from "@/components/CartModal";

const Index = () => {
    const {showLoginDialog, showSearchDialog, showCartDialog} = useSelector((state: RootState) => state.headerSlice);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const cart = window.localStorage.getItem("cart");
        dispatch(setCart(cart ? JSON.parse(cart) : []))
    });

    return (
        <div className="relative justify-between flex flex-col min-h-screen overflow-clip">
            <Products containerStyles='px-5 md:px-10 py-4' type="all"/>
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