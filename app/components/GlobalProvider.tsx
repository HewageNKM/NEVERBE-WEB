"use client"
import React, {ReactNode, useEffect} from 'react';
import {signUser} from "@/firebase/firebaseClient";
import {AppDispatch, RootState} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {initializeCart} from "@/redux/cartSlice/cartSlice";
import {AnimatePresence} from "framer-motion";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {redirect} from "next/navigation";

const GlobalProvider = ({children}: { children: ReactNode }) => {
    const dispatch: AppDispatch = useDispatch();
    const showCart = useSelector((state: RootState) => state.cartSlice.showCart);

    useEffect(() => {
        signUser();
        dispatch(initializeCart())
    });

    return (
        <main className="w-full relative flex flex-col justify-between min-h-screen overflow-clip">
            <Header/>
            {children}
            <Footer/>
            <AnimatePresence>
                {showCart && (<Cart/>)}
            </AnimatePresence>
        </main>
    );
};

export default GlobalProvider;