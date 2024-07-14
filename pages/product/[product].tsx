import React from 'react';
import {useRouter} from "next/router";
import Header from "@/components/sections/Header";
import ShoeDetails from "@/components/sections/ShoeDetails";
import ShoeReview from "@/components/sections/ShoeReview";
import Footer from "@/components/sections/Footer";
import SimilarProducts from "@/components/sections/SimilarProducts";

const Product = () => {
    const router = useRouter();
    return (
        <main className="w-full overflow-clip relative h-full px-4 py-4">
            <Header/>
            <ShoeDetails />
            <ShoeReview />
            <SimilarProducts/>
            <Footer/>
        </main>
    );
}

export default Product;