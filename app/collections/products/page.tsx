import React from 'react';
import Products from "@/app/collections/products/components/Products";
import ProductsHeader from "@/app/collections/products/components/ProductsHeader";
import {Metadata} from "next";
import {Item} from "@/interfaces";
import EmptyState from "@/components/EmptyState";
import {getAllInventoryItems} from "@/firebase/firebaseAdmin";

export const metadata: Metadata = {
    title: "Products",
    description: "Explore a wide range of products available at NEVERBE. Shop the latest items and enjoy a great online shopping experience." +
        "Nike, Adidas, New Balance",
    keywords: "NEVERBE, online shopping, products, latest items",
    twitter: {
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Products",
        description: "Explore a wide range of products available at NEVERBE.",
    },
    openGraph: {
        title: "Products",
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
        <main className="w-full relative lg:mt-32 md:mt-20 mb-5 lg:mb-10 mt-16 overflow-clip">
            <div className="w-full">
                <ProductsHeader count={items.length}/>
                <div className="px-4">
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
