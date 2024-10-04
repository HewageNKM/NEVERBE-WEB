import React from 'react';
import Hero from "@/app/shop/components/Hero";
import NewArrivals from "@/app/shop/components/NewArrivals";
import WhyUs from "@/app/shop/components/WhyUs";
import Brands from "@/app/shop/components/Brands";

const Page = () => {
    return (
        <main className="w-full relative">
            <Hero/>
            <NewArrivals/>
            <WhyUs/>
            <Brands/>
        </main>
    );
};

export default Page;