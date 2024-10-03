'use client'
import React, {ReactNode, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import LoadingScreen from "@/components/LoadingScreen";
import {setLoading} from "@/redux/authSlice/authSlice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {initializeCart} from "@/redux/cartSlice/cartSlice";
import Cart from "@/components/Cart";
import {AnimatePresence} from "framer-motion";

const GlobalProvider = ({children}: { children: ReactNode }) => {
    // Todo
    const isLoading = useSelector((state: RootState) => state.authSlice.isLoading);
    const dispatch: AppDispatch = useDispatch();
    const showCart = useSelector((state: RootState) => state.cartSlice.showCart);


    useEffect(() => {
        setTimeout(() => {
            dispatch(initializeCart())
            dispatch(setLoading(false))
        }, 1000)
    });
    return (
        <>
            {isLoading ? <LoadingScreen/> :
                <div className="min-h-screen relative flex-col justify-between flex w-full">
                    <Header/>
                    {children}
                    <Footer/>
                    <AnimatePresence>
                        {showCart && (<Cart />)}
                    </AnimatePresence>
                </div>}
        </>
    );
};

export default GlobalProvider;