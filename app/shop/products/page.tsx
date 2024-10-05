import React from 'react';
import Products from "@/app/shop/products/components/Products";
import Options from "@/app/shop/products/components/Options";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Products",
    twitter:{
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Products",
        description: "NEVERBE Products",
    },
    openGraph:{
        title: "Products",
        description: "NEVERBE Products",
        url: "https://neverbe.lk/shop/products",
        type: "website",
        images: [
            {
                url: "https://neverbe.lk/api/og",
                width: 260,
                height: 260,
                alt: "NEVERBE_Logo",
            },
        ],
    }
}

const Page = () => {
    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl font-bold tracking-wider mt-10">Products</h1>
                <div className="w-full">
                    <Options/>
                    <Products/>
                </div>
            </div>
        </main>
    );
};

export default Page;