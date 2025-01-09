import React from 'react';
import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import Brands from "@/app/components/Brands";
import PopularProducts from "@/app/components/PopularProducts";
import FAQ from "@/app/components/FAQ";
import {Item, Slide} from "@/interfaces";
import {getBrandsFromInventory, getHotProducts, getRecentItems, getSliders} from "@/firebase/firebaseAdmin";

const Page = async () => {
    const arrivals: Item[] = [];
    const hotItems: Item[] = [];
    const sliders: Slide[] = [];
    const brands = [];

    try {
        arrivals.push(...await getRecentItems());
        sliders.push(...await getSliders());
        hotItems.push(...await getHotProducts());
        brands.push(...await getBrandsFromInventory());
    } catch (e) {
        console.error(e);
    }

    return (
        <>
            <Hero slides={sliders}/>
            <PopularProducts hotItems={hotItems}/>
            <NewArrivals arrivals={arrivals}/>
            <Brands brands={brands}/>
            <WhyUs/>
            <FAQ/>
        </>
    );
};

export const dynamic = 'force-dynamic';
export default Page;