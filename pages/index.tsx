import React from 'react';
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Popular from "@/components/sections/Popular";
import Arrival from "@/components/sections/Arrival";
import Footer from "@/components/sections/Footer";

const Home = () => {
    return (
        <main className="w-full overflow-clip bg-slate-50 relative h-full ">
            <Header containerStyle="px-4 py-4"/>
            <Hero containerStyle="px-4 py-4"/>
            <Popular containerStyles="px-4 py-4"/>
            <Arrival containerStyles="px-4 py-4"/>
            <Footer/>
        </main>
    )
}

export default Home;
