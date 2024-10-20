import React from 'react';
import Products from "@/app/shop/products/components/Products";
import { Item } from "@/interfaces";
import { Metadata } from "next";
import SortingOptions from "@/app/shop/products/manufacturers/[manufacturerName]/components/SortingOptions";
import { getItemsByField } from "@/firebase/firebaseAdmin";
import EmptyState from "@/components/EmptyState";

export async function generateMetadata({ params }: { params: { manufacturerName: string } }): Promise<Metadata> {
    const manufacturerName = params.manufacturerName.toUpperCase().replace("%20"," ")
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
            url: `https://neverbe.lk/shop/products/${params.manufacturerName.replace("%20"," ")}`,
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
        items = await getItemsByField(params.manufacturerName.replace("%20"," "), "manufacturer");
    } catch (e: any) {
        console.error("Error fetching items:", e.message);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-hidden">
            <div className="px-8 py-6">
                <h1 className="md:text-4xl text-3xl capitalize font-bold tracking-wider mt-10 text-gray-800">
                    {params.manufacturerName.replace("%20"," ")} ({items.length})
                </h1>
                <div className="w-full mt-4">
                    <SortingOptions />
                    {items.length > 0 ? (
                        <Products items={items} />
                    ) : (
                        <EmptyState message={`No products found for ${params.manufacturerName.toUpperCase().replace("%20"," ")}`} />
                    )}
                </div>
            </div>
        </main>
    );
};

export default Page;
