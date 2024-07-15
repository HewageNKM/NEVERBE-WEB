import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Header from "@/components/sections/Header";
import ShoeDetails from "@/components/sections/ShoeDetails";
import ShoeReview from "@/components/sections/ShoeReview";
import Footer from "@/components/sections/Footer";
import SimilarProducts from "@/components/sections/SimilarProducts";
import {getAShoeById} from "@/firebase/Firebase";

const Product = () => {
    const router = useRouter();

    const [shoe, setShoe] = useState({});

    useEffect(() => {
        if (router.query.product) {
            getAShoeById(router.query.product).then((shoe) => {
                setShoe(shoe);
            });
        }
    }, [router.query.product]);
    return (
        <main className="w-full overflow-clip relative h-full px-5 md:px-10 py-4">
            <Header/>
            <ShoeDetails shoe={shoe}/>
            <ShoeReview shoeId={shoe.shoeId}/>
            <SimilarProducts/>
            <Footer/>
        </main>
    );
}

export default Product;