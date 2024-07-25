import React from 'react';
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Popular from "@/components/sections/Popular";
import Arrival from "@/components/sections/Arrival";
import Footer from "@/components/sections/Footer";
import Promotion from "@/components/sections/Promotion";

const Home = () => {
    return (
        <main className="w-full overflow-clip relative h-full ">
            <Header containerStyles="px-4 py-4"/>
            <Hero containerStyles="px-8 py-4"/>
            <Promotion containerStyles="px-4 py-4"/>
            <Popular containerStyles="px-4 py-4"/>
            <Arrival containerStyles="px-4 py-4"/>
            <Footer/>
        </main>
    )
}

export default Home;
