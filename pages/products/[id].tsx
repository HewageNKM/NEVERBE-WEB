import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import Header from "@/components/sections/Header";
import ShoeDetails from "@/components/sections/ShoeDetails";
import Footer from "@/components/sections/Footer";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getShoeDetails} from "@/lib/features/shoeDetailsSlice/shoeDetailsSlice";
import ShoeReview from "@/components/sections/ShoeReview";
import SimilarProducts from "@/components/sections/SimilarProducts";

const Id = () => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const shoe = useSelector((state: RootState) => state.shoeDetailsSlice.shoeDetails);
    useEffect(() => {
        dispatch(getShoeDetails(router.query.id as string));
    }, [router.query.id,dispatch]);

    return (
        <main className="w-full relative overflow-clip h-full">
            <Header containerStyle='px-5 md:px-10 py-4'/>
            <ShoeDetails shoe={shoe} containerStyles='px-5 md:px-10 py-4'/>
            <ShoeReview shoe={shoe} containerStyles='px-5 md:px-10 py-4'/>
            <SimilarProducts shoe={shoe} containerStyles='px-5 md:px-10 py-4'/>
            <Footer/>
        </main>
    );
}

export default Id;