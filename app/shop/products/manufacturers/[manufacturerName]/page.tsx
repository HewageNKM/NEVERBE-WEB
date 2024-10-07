import React from 'react';
import {getItemsByManufacturer} from "@/firebase/serviceAPI";
import Products from "@/app/shop/products/components/Products";
import {Item} from "@/interfaces";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Manufacturer",
    twitter:{
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Manufacturer",
        description: "NEVERBE Products By Manufacture",
    },
    openGraph:{
        title: "Manufacturer",
        description: "NEVERBE Products By Manufacture",
        url: "https://neverbe.lk/shop/products/manufacturers/[name]",
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

const Page = async ({params}: { params: { manufacturerName: string } }) => {
    let items: Item[] = [];

    try {
        items = await getItemsByManufacturer(params.manufacturerName);
    } catch (e: any) {
        console.log(e.message)
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl capitalize font-bold tracking-wider mt-10">{params.manufacturerName}({items.length})</h1>
                <div className="w-full">
                    <Products items={items}/>
                </div>
            </div>
        </main>
    );
};

export default Page;