import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import Products from "@/components/sections/products/Products";
import {AnimatePresence} from "framer-motion";
import Hero from "@/components/sections/products/Hero";
import Filters from "@/components/Filters";

const Index = () => {
    const {showFilter} = useSelector((state: RootState) => state.filterSlice);
    return (
        <div className="relative justify-between flex flex-col min-h-screen overflow-clip">
            <Hero containerStyles="px-8 mt-2"/>
            <Products containerStyles="px-8 mt-10"/>
            <AnimatePresence>
                {showFilter && (
                    <Filters containerStyles="" type="all"/>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Index;