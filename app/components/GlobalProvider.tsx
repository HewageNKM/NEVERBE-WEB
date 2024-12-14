"use client"
import React, {ReactNode, useEffect} from 'react';
import {auth} from "@/firebase/firebaseClient";
import {AppDispatch, RootState} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {initializeCart} from "@/redux/cartSlice/cartSlice";
import {AnimatePresence} from "framer-motion";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {onAuthStateChanged, signInAnonymously} from "firebase/auth";
import {setUser} from "@/redux/authSlice/authSlice";

const GlobalProvider = ({children}: { children: ReactNode }) => {
    const dispatch: AppDispatch = useDispatch();

    const showCart = useSelector((state: RootState) => state.cartSlice.showCart);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                dispatch(setUser(user));
                window.localStorage.setItem("neverbeUser", user);
            } else {
                const usr = window.localStorage.getItem("neverbeUser");
                if (!usr) {
                    const user = await signInAnonymously(auth);
                    window.localStorage.setItem("neverbeUser", user.user);
                    dispatch(setUser(user));
                } else {
                    dispatch(setUser(user));
                }
            }
        });
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