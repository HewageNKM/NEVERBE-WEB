"use client"
import React from 'react';
import Link from "next/link";
import Products from "@/app/products/components/Products";
import Options from "@/app/products/components/Options";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {AnimatePresence} from "framer-motion";
import Filter from "@/app/products/components/Filter";

const Page = () => {
    const showFilter = useSelector((state:RootState) => state.productsSlice.showFilter);
    return (
        <div className="w-full relative">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl font-bold tracking-wider mt-10">Products</h1>
                <div className="flex flex-row items-center text-blue-500 text-sm md:text-lg">
                    <Link href={"/"}>Home</Link>
                    <Link href={"/products"}>/Products</Link>
                </div>
                <div className="w-full">
                    <Options/>
                    <Products/>
                </div>
            </div>
            <AnimatePresence>
                {showFilter && (<Filter />)}
            </AnimatePresence>
        </div>
    );
};

export default Page;