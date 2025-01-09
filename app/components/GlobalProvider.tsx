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
import Login from "@/components/Login";

const GlobalProvider = ({children}: { children: ReactNode }) => {
    const dispatch: AppDispatch = useDispatch();

    const showCart = useSelector((state: RootState) => state.cartSlice.showCart);
    const showLoginForm = useSelector((state: RootState) => state.authSlice.showLoginForm);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                dispatch(setUser(user));
                console.log("User Logged In");
            } else {
                const user = await signInAnonymously(auth);
                dispatch(setUser(user));
                console.log("New User Logged In");
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
            <AnimatePresence>
                {showLoginForm && (<Login />)}
            </AnimatePresence>
        </main>
    );
};

export default GlobalProvider;