import React from 'react';
import Products from "@/app/shop/products/components/Products";
import Options from "@/app/shop/products/components/Options";
import {Metadata} from "next";
import {getAllInventoryItems} from "@/firebase/firebaseAdmin";
import {Item} from "@/interfaces";

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
    },
}

const Page = async () => {
    let items:Item[] = [];

    try {
        items = await getAllInventoryItems();
    }catch (e){
        console.log(e);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl tracking-wider mt-10"><strong>Products</strong></h1>
                <div className="w-full">
                    <Options/>
                    <Products items={items}/>
                </div>
            </div>
        </main>
    );
};

export default Page;