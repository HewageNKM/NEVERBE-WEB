"use client"
import React, {ReactNode, useEffect} from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {AnimatePresence} from "framer-motion";
import Cart from "@/components/Cart";
import {AppDispatch, RootState} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {initializeCart} from "@/redux/cartSlice/cartSlice";

const Layout = ({children}:{children:ReactNode}) => {
    const dispatch: AppDispatch = useDispatch();
    const showCart = useSelector((state: RootState) => state.cartSlice.showCart);


    useEffect(() => {
        dispatch(initializeCart())
    });
    return (
        <div className="min-h-screen relative flex-col justify-between flex w-full">
            <Header/>
            {children}
            <Footer/>
            <AnimatePresence>
                {showCart && (<Cart/>)}
            </AnimatePresence>
        </div>
    );
};

export default Layout;