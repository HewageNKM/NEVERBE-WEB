'use client'
import {AnimatePresence} from "framer-motion";
import LoginModel from "@/components/LoginModel";
import SearchModel from "@/components/SearchModel";
import CartModal from "@/components/CartModal";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {setCart} from "@/lib/features/cartSlice/cartSlice";
import ReviewModel from "@/components/ReviewModel";

export default function ModelProvider({children,}: { children: React.ReactNode }) {
    const {showLoginDialog, showSearchDialog, showCartDialog} = useSelector((state: RootState) => state.headerSlice);
    const dispatch: AppDispatch = useDispatch();
    const showReviewAddDialog = useSelector((state: RootState) => state.shoeReviewSlice.showReviewAddDialog);

    useEffect(() => {
        const cart = window.localStorage.getItem("cart");
        dispatch(setCart(cart ? JSON.parse(cart) : []))
    });
    return <>
        {children}
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
            {showReviewAddDialog && (
                <ReviewModel/>
            )}
            {showReviewAddDialog && (
                <ReviewModel/>
            )}
        </AnimatePresence>
    </>
}