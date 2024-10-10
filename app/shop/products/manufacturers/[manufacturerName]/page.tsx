import React from 'react';
import Products from "@/app/shop/products/components/Products";
import {Item} from "@/interfaces";
import {Metadata} from "next";
import SortingOptions from "@/app/shop/products/manufacturers/[manufacturerName]/components/SortingOptions";
import {getItemsByField} from "@/firebase/firebaseAdmin";

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
        items = await getItemsByField(params.manufacturerName, "manufacturer");
    } catch (e: any) {
        console.log(e.message)
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl capitalize font-bold tracking-wider mt-10">{params.manufacturerName}({items.length})</h1>
                <div className="w-full">
                    <SortingOptions />
                    <Products items={items}/>
                </div>
            </div>
        </main>
    );
};

export default Page;