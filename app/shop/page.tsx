import React from 'react';
import Hero from "@/app/shop/components/Hero";
import NewArrivals from "@/app/shop/components/NewArrivals";
import WhyUs from "@/app/shop/components/WhyUs";
import Brands from "@/app/shop/components/Brands";
import HotProducts from "@/app/shop/components/HotProducts";
import FAQ from "@/app/shop/components/FAQ";

const Page = () => {
    return (
        <main className="w-full relative">
            <Hero/>
            <HotProducts />
            <NewArrivals/>
            <WhyUs/>
            <Brands/>
            <FAQ />
        </main>
    );
};

export default Page;