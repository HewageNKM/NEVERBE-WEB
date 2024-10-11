import React from 'react';
import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import Brands from "@/app/components/Brands";
import HotProducts from "@/app/components/HotProducts";
import FAQ from "@/app/components/FAQ";

const Page = () => {
    return (
        <>
            <Hero/>
            <HotProducts/>
            <NewArrivals/>
            <WhyUs/>
            <Brands/>
            <FAQ/>
        </>
    );
};

export default Page;