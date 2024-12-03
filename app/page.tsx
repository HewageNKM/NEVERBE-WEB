import React from 'react';
import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import Brands from "@/app/components/Brands";
import HotProducts from "@/app/components/HotProducts";
import FAQ from "@/app/components/FAQ";
import {Item, Slide} from "@/interfaces";
import {getHotProducts, getRecentItems, getSliders} from "@/firebase/firebaseAdmin";

const Page = async () => {
    let arrivals: Item[] = [];
    let hotItems: Item[] = [];
    let sliders: Slide[] = [];


    try {
        arrivals.push(...await getRecentItems());
        sliders.push(...await getSliders());
        hotItems.push(...await getHotProducts());
    } catch (e) {
        console.error(e);
    }

    return (
        <>
            <Hero slides={sliders}/>
            <HotProducts hotItems={hotItems}/>
            <NewArrivals arrivals={arrivals}/>
            <WhyUs/>
            <Brands/>
            <FAQ/>
        </>
    );
};

export const dynamic = 'force-dynamic';
export default Page;