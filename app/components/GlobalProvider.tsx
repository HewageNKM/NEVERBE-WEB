"use client"
import React, {ReactNode, useEffect, useState} from 'react';
import {signUser} from "@/firebase/firebaseClient";
import LoadingScreen from "@/components/LoadingScreen";
import {AppDispatch, RootState} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {initializeCart} from "@/redux/cartSlice/cartSlice";
import {AnimatePresence} from "framer-motion";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GlobalProvider = ({children}: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true)
    const dispatch: AppDispatch = useDispatch();
    const showCart = useSelector((state: RootState) => state.cartSlice.showCart);

    useEffect(() => {
        signUser().then(() => {
            setIsLoading(false)
        }).catch(() => {
            setIsLoading(false)
        });
        dispatch(initializeCart())
    });

    return (
        <main className="w-full relative flex flex-col justify-between h-full overflow-clip">
            {isLoading ? <LoadingScreen/> :
                <>
                    <Header/>
                    {children}
                    <Footer/>
                    <AnimatePresence>
                        {showCart && (<Cart/>)}
                    </AnimatePresence>
                </>}
        </main>
    );
};

export default GlobalProvider;