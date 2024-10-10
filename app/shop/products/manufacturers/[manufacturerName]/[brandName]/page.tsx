import React from 'react';
import Products from "@/app/shop/products/components/Products";
import {Item} from "@/interfaces";
import {Metadata} from "next";
import SortingOptions from "@/app/shop/products/manufacturers/[manufacturerName]/components/SortingOptions";
import {getItemsByTwoField} from "@/firebase/firebaseAdmin";


export const metadata: Metadata = {
    title: "Manufacturer X Brand",
    twitter:{
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Manufacturer X Brand",
        description: "NEVERBE Products By Manufacture X Brand",
    },
    openGraph:{
        title: "Manufacturer X Brand",
        description: "NEVERBE Products By Manufacture X Brand",
        url: "https://neverbe.lk/shop/products/manufacturers/[name]/[brandName]",
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


const Page = async ({params}: { params: { manufacturerName: string, brandName: string } }) => {
    let items: Item[] = [];
    try {
        items = await getItemsByTwoField(params.manufacturerName, params.brandName, "manufacturer", "brand");
    } catch (e) {
        console.log(e);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl capitalize font-bold tracking-wider mt-10">{params.manufacturerName} &gt; {params.brandName}({items.length})</h1>
                <div className="w-full">
                    <SortingOptions />
                    <Products items={items}/>
                </div>
            </div>
        </main>
    );
};

export default Page;