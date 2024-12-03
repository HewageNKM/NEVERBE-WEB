import React from 'react';
import Products from "@/app/shop/products/components/Products";
import Options from "@/app/shop/products/components/Options";
import {Metadata} from "next";
import {Item} from "@/interfaces";
import EmptyState from "@/components/EmptyState";
import {getAllInventoryItems} from "@/firebase/firebaseAdmin";

export const metadata: Metadata = {
    title: "NEVERBE Products - Shop Online",
    description: "Explore a wide range of products available at NEVERBE. Shop the latest items and enjoy a great online shopping experience.",
    keywords: "NEVERBE, online shopping, products, latest items",
    twitter: {
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "NEVERBE Products - Shop Online",
        description: "Explore a wide range of products available at NEVERBE.",
    },
    openGraph: {
        title: "NEVERBE Products - Shop Online",
        description: "Explore a wide range of products available at NEVERBE.",
        url: "https://neverbe.lk/shop/products",
        type: "website",
        images: [
            {
                url: "https://neverbe.lk/api/og",
                width: 260,
                height: 260,
                alt: "NEVERBE Logo",
            },
        ],
    },
};

const Page = async () => {
    let items: Item[] = [];

    try {
        items = await getAllInventoryItems();
    } catch (e) {
        console.error("Error fetching items:", e);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-20  overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl tracking-wider mt-10"><strong>Products</strong></h1>
                <div className="w-full">
                    <Options/>
                    {items.length > 0 ? (
                        <Products items={items}/>
                    ) : (
                        <EmptyState message="No products available at this time."/>
                    )}
                </div>
            </div>
        </main>
    );
};

export const dynamic = 'force-dynamic';
export default Page;
