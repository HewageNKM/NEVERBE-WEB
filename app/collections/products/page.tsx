import React from 'react';
import Products from "@/app/collections/products/components/Products";
import ProductsHeader from "@/app/collections/products/components/ProductsHeader";
import {Metadata} from "next";
import {Item} from "@/interfaces";
import EmptyState from "@/components/EmptyState";
import {getAllInventoryItems, getAllInventoryItemsByGender} from "@/firebase/firebaseAdmin";
import {seoKeywords} from "@/constants";

export const metadata: Metadata = {
    title: "Products",
    description: "Explore a wide range of products available at NEVERBE. Nike, Adidas, Puma, New Balance Vietnam high copy shoes, flip flop, sandals, slides and more.",
    keywords: seoKeywords,
    twitter: {
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Products",
        description: "Explore a wide range of products available at NEVERBE. Nike, Adidas, Puma, New Balance Vietnam high copy shoes, flip flop, sandals, slides and more.",
    },
    openGraph: {
        title: "Products",
        description: "Explore a wide range of products available at NEVERBE. Nike, Adidas, Puma, New Balance Vietnam high copy shoes, flip flop, sandals, slides and more.",
        url: "https://neverbe.lk/collections/products",
        type: "website",
        images: [
            {
                url: "https://neverbe.lk/api/v1/og",
                width: 260,
                height: 260,
                alt: "NEVERBE Logo",
            },
        ],
    },
};

const Page = async ({searchParams}: { searchParams: { [key: string]: string } }) => {
    const gender = searchParams.gender || 'all'; // Extract `gender` parameter
    let items: Item[] = [];

    try {
        if (gender === "all"){
            items.push(...await getAllInventoryItems());
        } else {
            items.push(...await getAllInventoryItemsByGender(gender));
        }
    } catch (e) {
        console.error("Error fetching items:", e);
    }
    console.log(gender)
    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mb-10 lg:mb-10 mt-16 overflow-clip">
            <div className="w-full">
                <ProductsHeader gender={gender}/>
                <div className="px-4">
                    {items.length > 0 ? (
                        <Products items={items} gender={gender}/>
                    ) : (
                        <EmptyState heading="No products available at this time."/>
                    )}
                </div>
            </div>
        </main>
    );
};

export const dynamic = 'force-dynamic'; // Ensure the page is server-rendered dynamically
export default Page;
