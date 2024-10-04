import React from 'react';
import Link from "next/link";
import Products from "@/app/shop/products/components/Products";
import Options from "@/app/shop/products/components/Options";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Products",
}

const Page = () => {
    return (
        <div className="w-full relative lg:mt-32 md:mt-20 mt-10">
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
        </div>
    );
};

export default Page;