import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import ShoeDetails from "@/components/sections/productDetails/ShoeDetails";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getShoeDetails} from "@/lib/features/shoeDetailsSlice/shoeDetailsSlice";
import ShoeReview from "@/components/sections/productDetails/ShoeReview";
import SimilarProducts from "@/components/sections/productDetails/SimilarProducts";
import ReviewModel from "@/components/ReviewModel";
import {AnimatePresence} from "framer-motion";
import LoginModel from "@/components/LoginModel";
import SearchModel from "@/components/SearchModel";
import {setCart} from "@/lib/features/cartSlice/cartSlice";
import CartModal from '@/components/CartModal';

const Id = () => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const addReviewDialog = useSelector((state: RootState) => state.shoeReviewSlice.reviewAddDialog);
    const shoe = useSelector((state: RootState) => state.shoeDetailsSlice.shoeDetails);
    const {showLoginDialog, showCartDialog,showSearchDialog} = useSelector((state: RootState) => state.headerSlice);

    useEffect(() => {
        dispatch(getShoeDetails(router.query.id as string));
    }, [router.query.id, dispatch]);

    useEffect(() => {
        const cart = window.localStorage.getItem("cart");
        dispatch(setCart(cart ? JSON.parse(cart) : []))
    });
    return (
        <main className="w-full relative overflow-clip h-full">
            <ShoeDetails shoe={shoe} containerStyles='px-5 md:px-10 py-4'/>
            <ShoeReview shoe={shoe} containerStyles='px-5 md:px-10 py-4'/>
            <SimilarProducts shoe={shoe} containerStyles='px-5 md:px-10 py-4'/>
            <AnimatePresence>
                {addReviewDialog && (
                    <ReviewModel/>
                )}
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

        </main>
    );
}

export default Id;