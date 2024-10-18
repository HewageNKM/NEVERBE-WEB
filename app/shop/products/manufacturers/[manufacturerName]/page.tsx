import React from 'react';
import Products from "@/app/shop/products/components/Products";
import { Item } from "@/interfaces";
import { Metadata } from "next";
import SortingOptions from "@/app/shop/products/manufacturers/[manufacturerName]/components/SortingOptions";
import { getItemsByField } from "@/firebase/firebaseAdmin";
import EmptyState from "@/components/EmptyState";

export async function generateMetadata({ params }: { params: { manufacturerName: string } }): Promise<Metadata> {
    const manufacturerName = params.manufacturerName.toUpperCase();
    const title = `${manufacturerName} Products - NEVERBE`;

    return {
        title,
        description: `Discover the latest products from ${manufacturerName} at NEVERBE. Shop now for the best deals and selections.`,
        keywords: `${manufacturerName}, NEVERBE, online shopping, products`,
        twitter: {
            card: "summary",
            site: "@neverbe",
            creator: "@neverbe",
            title,
            description: `NEVERBE Products By ${manufacturerName}`,
        },
        openGraph: {
            title,
            description: `Discover the latest products from ${manufacturerName} at NEVERBE.`,
            type: "website",
            url: `https://neverbe.lk/shop/products/${params.manufacturerName}`,
            images: [
                {
                    url: "https://neverbe.lk/api/og",
                    width: 260,
                    height: 260,
                    alt: `${manufacturerName} Products - NEVERBE`,
                },
            ],
        },
    };
}

const Page = async ({ params }: { params: { manufacturerName: string } }) => {
    let items: Item[] = [];

    try {
        items = await getItemsByField(params.manufacturerName, "manufacturer");
    } catch (e: any) {
        console.error("Error fetching items:", e.message);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl capitalize font-bold tracking-wider mt-10">
                    {params.manufacturerName} ({items.length})
                </h1>
                <div className="w-full">
                    <SortingOptions />
                    {items.length > 0 ? (
                        <Products items={items} />
                    ) : (
                        <EmptyState  message={`No products found for ${params.manufacturerName.toUpperCase()}`}/>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Page;
