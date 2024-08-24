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

const Id = () => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const addReviewDialog = useSelector((state: RootState) => state.shoeReviewSlice.reviewAddDialog);
    const shoe = useSelector((state: RootState) => state.shoeDetailsSlice.shoeDetails);
    const showLoginDialog = useSelector((state: RootState) => state.headerSlice.showLoginDialog);
    const showSearchDialog = useSelector((state: RootState) => state.headerSlice.showSearchDialog);
    useEffect(() => {
        dispatch(getShoeDetails(router.query.id as string));
    }, [router.query.id, dispatch]);

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
            </AnimatePresence>

        </main>
    );
}

export default Id;