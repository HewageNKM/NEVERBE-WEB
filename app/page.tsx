import React from 'react';
import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import Brands from './components/Brands';
const Home = () => {

    return (
        <main className="w-full relative">
            <Hero />
            <NewArrivals />
            <WhyUs />
            <Brands />
        </main>
    )
}

export default Home;
