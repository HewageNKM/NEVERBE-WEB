import React from 'react';
import {Item} from "@/interfaces";
import {Metadata} from "next";
import {getItemsByField} from "@/firebase/firebaseAdmin";
import EmptyState from "@/components/EmptyState";
import Options from "@/app/shop/products/components/Options";
import Products from "@/app/shop/products/accessories/components/Products";

export const metadata: Metadata = {
    title: `Accessories - NEVERBE`,
    description: `Discover the latest accessories at NEVERBE. Shop now for the best deals and selections.`,
    keywords: `accessories, NEVERBE, online shopping, products`,
    twitter: {
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: `Accessories - NEVERBE`,
        description: `NEVERBE Accessories`,
    },
    openGraph: {
        title: `Accessories - NEVERBE`,
        description: `Discover the latest accessories at NEVERBE.`,
        type: "website",
        url: `https://neverbe.lk/shop/products/accessories`,
        images: [
            {
                url: "https://neverbe.lk/api/og",
                width: 260,
                height: 260,
                alt: `Accessories - NEVERBE`,
            },
        ],
    },
}

const Page = async () => {
    let items: Item[] = [];

    try {
        items = await getItemsByField("accessories", "type");
    } catch (e: any) {
        console.error("Error fetching items:", e.message);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-20 overflow-hidden">
            <div className="px-8 py-6">
                <h1 className="md:text-2xl text-xl capitalize font-bold tracking-wider mt-10 text-gray-600">
                    Accessories ({items.length})
                </h1>
                <div className="w-full mt-2">
                    {items.length > 0 ? (
                        <Products items={items}/>
                    ) : (
                        <EmptyState message="No products found for accessories"/>
                    )}
                </div>
            </div>
        </main>
    );
};
export const dynamic = 'force-dynamic';
export default Page;
