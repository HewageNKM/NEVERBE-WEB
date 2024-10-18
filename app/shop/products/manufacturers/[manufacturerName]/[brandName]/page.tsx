import React from 'react';
import Products from "@/app/shop/products/components/Products";
import { Item } from "@/interfaces";
import { Metadata } from "next";
import SortingOptions from "@/app/shop/products/manufacturers/[manufacturerName]/components/SortingOptions";
import { getItemsByTwoField } from "@/firebase/firebaseAdmin";
import EmptyState from "@/components/EmptyState";

export async function generateMetadata({ params }: { params: { manufacturerName: string; brandName: string } }): Promise<Metadata> {
    const title = `${params.manufacturerName.toUpperCase()} | ${params.brandName.toUpperCase()}`;
    const description = `Discover the latest products by ${params.brandName} from ${params.manufacturerName} at NEVERBE. Shop now for quality items and special offers.`;

    return {
        title,
        description,
        keywords: `${params.manufacturerName}, ${params.brandName}, NEVERBE, online shopping, products`,
        twitter: {
            card: "summary",
            site: "@neverbe",
            creator: "@neverbe",
            title,
            description,
        },
        openGraph: {
            title,
            description,
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
}

const Page = async ({ params }: { params: { manufacturerName: string; brandName: string } }) => {
    let items: Item[] = [];

    try {
        items = await getItemsByTwoField(params.manufacturerName, params.brandName, "manufacturer", "brand");
    } catch (e) {
        console.error("Error fetching items:", e);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <section className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl font-bold uppercase tracking-wider mt-10">
                    {params.manufacturerName} &gt; {params.brandName} ({items.length})
                </h1>
                <div className="w-full">
                    <SortingOptions />
                    {items.length > 0 ? (
                        <Products items={items} />
                    ) : (
                       <EmptyState message={`No products found for ${params.manufacturerName} &gt; ${params.brandName}.`}/>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Page;
