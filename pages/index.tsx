import React from 'react';
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Popular from "@/components/sections/Popular";
import Arrival from "@/components/sections/Arrival";
import Footer from "@/components/sections/Footer";

const Home = () => {
    return (
        <main className="w-full overflow-clip relative h-full px-4 py-4">
            <Header/>
            <Hero/>
            <Popular/>
            <Arrival/>
            <Footer/>
        </main>
    );
};

export default Home;
